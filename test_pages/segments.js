function getPageRect(doc){
    const zBody = doc.body,
    zHtml = document.documentElement;
    const zWidth = Math.max( zBody.scrollWidth, zBody.offsetWidth, 
        zHtml.clientWidth, zHtml.scrollWidth, zHtml.offsetWidth );
    const zHeight = Math.max( zBody.scrollHeight, zBody.offsetHeight, 
                        zHtml.clientHeight, zHtml.scrollHeight, zHtml.offsetHeight );
    return new Rect(0, 0, zWidth, zHeight)
}
function getUniqueCssPath(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }
    const path = [];
    while (el.nodeType === Node.ELEMENT_NODE && el.nodeName.toLowerCase() !== 'html') {
        let selector = el.nodeName.toLowerCase();
        if (el.parentNode) {
            const siblings = Array.from(el.parentNode.children);
            const sameTagSiblings = siblings.filter(sibling => sibling.nodeName.toLowerCase() === selector);
            if (sameTagSiblings.length > 1) {
                selector += `:nth-child(${siblings.indexOf(el) + 1})`;
            }
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(' > ');
}
function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}
function getAllText(element) {
    const text = element.innerText || '';
    return cleanText(text)
}
function getDirectText(el) {
    let directText = '';
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
            directText += el.childNodes[i].nodeValue;
        }
    }
    return cleanText(directText)
}
function isValidHttpUrl(string) {
    if (string[0] == "/")
        return true

    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:"
}
function highlight(rect, color, label, id) {
    const svgNS = 'http://www.w3.org/2000/svg';

    // var idElements = document.querySelectorAll(`#${id}`);
    // Array.from(idElements).forEach(function(element) {
    //     element.remove();
    // });

    // Create SVG element
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute("id", id)
    svg.style.position = 'fixed';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';
    svg.style.fontSize = unit;

    // Create Rectangle
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttribute('x', rect.x);
    rectangle.setAttribute('y', rect.y);
    rectangle.setAttribute('width', rect.w);
    rectangle.setAttribute('height', rect.h);
    rectangle.setAttribute('stroke-width', unit / 8);
    rectangle.setAttribute('stroke', color);
    rectangle.setAttribute('fill', 'none');

    // Create Label
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', rect.x);
    text.setAttribute('y', Number(rect.y) + Number(rect.h)); // Position below the rectangle
    text.setAttribute('dy', '1.2em'); // Offset below the rectangle
    text.setAttribute('font-size', unit);
    text.setAttribute('fill', color); // Color of text same as box's
    text.setAttribute('stroke', "none");
    text.textContent = label;

    // Add elements to SVG and then to Body
    svg.appendChild(rectangle);
    svg.appendChild(text);
    document.body.appendChild(svg);

}

class Rect {
    AlignIds = {
        x0 : "left",
        x1 : "center_x",
        x2 : "right",
        y0 : "top",
        y1 : "center_y",
        y2 : "bottom",
    }

    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.cx = this.x + this.w / 2;
        this.cy = this.y + this.h / 2;
    }
    get area() {
        return this.w * this.h
    }
    getAlignment(alignId){
        switch (alignId.toLowerCase().trim()) {
            case Rect.AlignIds.x0:
                return this.x
            case Rect.AlignIds.x1:
                return this.cx
            case Rect.AlignIds.x2:
                return this.x+this.w
            case Rect.AlignIds.y0:
                return this.y
            case Rect.AlignIds.y1:
                return this.cy
            case Rect.AlignIds.y2:
                return this.y+this.h
            default:
                throw new Error(`direction: ${direction} doesnt exist`);
        }
    }
    static elementToRect(element) {
        const domRect = element.getBoundingClientRect()
        return new Rect(domRect.left + window.scrollX, domRect.top + window.scrollY, domRect.width, domRect.height)
        // return new Rect(domRect.left, domRect.top, domRect.width, domRect.height)
    }
    static isWithinMargin(rect0, rect1, distance, directions) {
        const directionsArr = directions.split(",")
        const conditions = directionsArr.map(direction => {
            switch (direction.toLowerCase().trim()) {
                case "l":
                    return Rect.isWithinXMargin(rect0, rect1, -distance) &&
                        Rect.areYBoundsOverlaping(rect0, rect1)
                case "r":
                    return Rect.isWithinXMargin(rect0, rect1, distance) &&
                        Rect.areYBoundsOverlaping(rect0, rect1)
                case "t":
                    return Rect.isWithinYMargin(rect0, rect1, -distance) &&
                        Rect.areXBoundsOverlaping(rect0, rect1)
                case "b":
                    return Rect.isWithinYMargin(rect0, rect1, distance) &&
                        Rect.areXBoundsOverlaping(rect0, rect1)
                default:
                    throw new Error(`direction: ${direction} doesnt exist`);
            }
        })

        return conditions.some(v => v == true)
    }
    static areXBoundsOverlaping(rect0, rect1) {
        return (
            (rect0.x < rect1.x + rect1.w) &&
            (rect0.x + rect0.w > rect1.x)
        )
    }
    static areYBoundsOverlaping(rect0, rect1) {
        return (rect0.y < rect1.y + rect1.h) &&
            (rect0.y + rect0.h > rect1.y)
    }
    static isWithinXMargin(rect0, rect1, distance) {
        // <0 is left
        let d = rect1.cx - rect0.cx
        const direction = (d / Math.abs(d))
        let margin = d - ((rect0.w / 2 + rect1.w / 2) * direction)
        return (margin * direction) < (distance * direction)
    }
    static isWithinYMargin(rect0, rect1, distance) {
        // <0 is top
        let d = rect1.cy - rect0.cy
        const direction = (d / Math.abs(d))
        let margin = d - ((rect0.h / 2 + rect1.h / 2) * direction)
        return (margin * direction) < (distance * direction)
    }
    static combineRects(rects) {
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        rects.forEach(function (rect) {
            if (rect == null)
                return null

            minX = Math.min(minX, rect.x);
            minY = Math.min(minY, rect.y);
            maxX = Math.max(maxX, rect.x + rect.w);
            maxY = Math.max(maxY, rect.y + rect.h);
        });

        return new Rect(minX, minY, maxX - minX, maxY - minY);
    }
    static isContaining(parentRect, childRect) {
        return (
            (parentRect.x <= childRect.x) &&
            (parentRect.y <= childRect.y) &&
            (parentRect.y + parentRect.h >= childRect.y) &&
            (parentRect.x + parentRect.w >= childRect.x)
        )
    }
}
class Vis {
    static isSpatial(style, rect) {
        if (!(rect.w > 0 && rect.h > 0)) { return false }
        if (style.display === 'none') { return false }
        if (style.visibility === 'hidden') { return false }
        return true;
    }
    static isLowVis(style) {
        if (style.filter !== "none" || parseInt(style.opacity) < 1) {
            return true;
        }
        return false;
    }
    static hasInnerText(el) {
        const innerText = el.innerText
        if (innerText == null)
            return false
        if (innerText.length > 0)
            return true
        return false
    }
    static hasBG(style) {
        return !(style.backgroundColor === 'rgba(0, 0, 0, 0)' ||
            style.backgroundColor === 'transparent')
    }
}
class Tree{
    getRepeatedTextedElements(elements){

    }
}

class Option{
    constructor({path, label, optionIndex=null, wire="[Option]"}){
        this.path = path
        this.optionIndex = optionIndex
        this.label = label
        this.wire = wire
    }
}
class Segment {
    constructor(element) {
        this.element = element
        this.rect = Rect.elementToRect(element)
        this.path = this.getPath()
        this.name = null
        this.color = null
        this.group = null
        this.text = null
        this.wire = null
    }
    getCables(){
    }
    static toAvoid(el, rect, style) {
        return (
            !Vis.isSpatial(style, rect) ||
            !Rect.isContaining(page, rect) ||
            Segment.isLink(el) ||
            Vis.isLowVis(style)
        )
    }
    static isLink(el) {
        return (
            getElementTagname(el) === "a" &&
            (
                (
                    el.getAttribute("href") != null &&
                    isValidHttpUrl(el.getAttribute("href"))
                ) ||
                el.getAttribute("target") == "_blank"
            )
        )
    }
    static isOverflow(el, style){

        return(
            style.overflow == "auto" || style.overflow == "scroll" ||
            style.overflowX == "auto" || style.overflowX == "scroll" ||
            style.overflowY == "auto" || style.overflowY == "scroll"
        )
    }
    setGroup(group) {
        this.group = group
    }
    getPath() {
        return getUniqueCssPath(this.element)
    }
    static getSegment(el) {
        let segment = null
        if (segment == null) segment = MediaElement.getMediaElement(el)
        if (segment == null) segment =IElement.getIElement(el);
        if (segment == null) segment = TextElement.getTextElement(el)
        if (segment == null || segment.rect == null)
            return null
        return segment
    }
}

class ISeg extends Segment {
    constructor(element) {
        super(element);
        this.color = "blue"
    }
    static getIElement(el) {
        const IElementClass = IElementClasses.find(IElementClass => IElementClass.isType(el))
        if (!IElementClass)
            return null
        return new IElementClass(el);
    }
}
class MediaSeg extends Segment {
    constructor(element) {
        super(element);
        this.color = "cyan"
        this.wire = ""
        this.text = ""
    }
    getInfo(){
        return ""
    }
    static isMinMediaSize(el) {
        const rect = Rect.elementToRect(el)
        return (
            rect.w > minMediaSize * unit &&
            rect.h > minMediaSize * unit
        )
    }
    static isMinImageSize(el) {
        const rect = Rect.elementToRect(el)
        return (
            rect.w > minImageSize * unit &&
            rect.h > minImageSize * unit
        )
    }
    static getMediaElement(el) {
        const MediaClass = MediaClasses.find(MediaClass => MediaClass.isType(el))
        if (!MediaClass)
            return null
        return new MediaClass(el);
    }

}
class TextSeg extends Segment {
    constructor(element) {
        super(element);
        this.color = "green"
        this.wire = ""
    }
    getInfo(){
        return ""
    }
    static getTextElement(el) {
        const TextClass = TextClasses.find(TextClass => TextClass.isType(el))
        if (!TextClass)
            return null
        return new TextClass(el);
    }
}
// =========
class IText extends TextSeg{
    constructor(element) {
        super(element);
        this.name = "Text"
        this.color = "blue"
        this.text = getDirectText(element) || ""
    }
    static isType(element) {
        return getDirectText(element) !== ""
    }
}
class Instruction extends TextSeg{
    constructor(element) {
        super(element);
        this.name = "Instruction"
        this.color = "yellow"
        this.text = getDirectText(element) || ""
    }
    static isType(segments, segment) {
        if(!(segment instanceof IText))
            return false
        // if(getElementTagname(segment.element)==="label")
        //     return false
        return !segments.some(seg2=>{
            const cond = Rect.areYBoundsOverlaping(segment.rect, seg2.rect) &&
            seg2.rect.cx < segment.rect.cx
            if(cond)
                console.log(seg2)
            return cond
        })
    }
}
// =========
class ISelect extends ISeg {
    constructor(element) {
        super(element);
        this.name = "Select"
        this.color = "blue"
        this.wire = "[Option]"
        this.text = getAllText(element) ||  element.getAttribute("value") || ""
    }
    getChain(){
        const action = new Action({
            actionType:ActionType.select,
            path:this.path,
            optionIndex:-1,
        })
        return new Chain({text:this.text, actions:[action]})
    }
    getCable(){
        const action = new Action({
            actionType:ActionType.select,
            path:this.path,
            optionIndex:-1,
        })
        const chain = new Chain({text:this.text, actions:[action]})
        return new Cable({
            chains : [chain],
            isComparable:false,
        })
    }
    getInfo(){
        return this.wire + " " + this.text
    }
    static isType(element) {
        if (
            (
                getElementTagname(element) == "input" &&
                (
                    element.getAttribute("type") == "radio" ||
                    element.getAttribute("type") == "checkbox" ||
                    element.getAttribute("type") == "submit" 
                )
            ) ||
            (
                getElementTagname(element) == "button"
            ) ||
            ISelect.isInteractable(element)
        ) return true
        return false
    }
    static isInteractable(el) {
        const style = window.getComputedStyle(el);
        const tagName = getElementTagname(el);
        return (
            // tagName != "input" &&
            // tagName != "button" &&
            // tagName != "select" &&
            !Segment.isLink(el) &&
            style.cursor === 'pointer' &&
            style.pointerEvents !== 'none'
        )
    }
}
class IField extends ISeg {
    constructor(element) {
        super(element);
        this.name = "Field"
        this.wire = "[Input Field]"
        this.text = getAllText(element) || element.getAttribute("value") || ""
    }
    getCable(){
        const action = new Action({
            actionType:ActionType.field,
            path:this.path,
            optionIndex:-1,
        })
        const chain = new Chain({text:this.text, actions:[action]})
        return new Cable({
            chains : [chain],
            isComparable:false,
        })
    }
    getInfo(){
        return this.wire + " " + this.text
    }
    static isType(element) {
        if (
            (
                getElementTagname(element) == "input" &&
                (
                    element.getAttribute("type") == "text" ||
                    element.getAttribute("type") == "textarea" ||
                    element.getAttribute("type") == "date" ||
                    element.getAttribute("type") == "email" ||
                    element.getAttribute("type") == "number" ||
                    element.getAttribute("type") == "range" ||
                    element.getAttribute("type") == "password" ||
                    element.getAttribute("type") == "tel" ||
                    element.getAttribute("type") == "email"
                )
            ) ||
            getElementTagname(element) == "textarea"
        ) return true
        return false
    }
}
class IDropdown extends ISeg {
    constructor(element) {
        super(element);
        this.name = "Dropdown"
        this.wire = "[Option]"
        this.options = this.getOptions()
        this.text = this.getOptions().join("\n")
    }
    getCable(){
        const chains = this.options.map((opt,i)=>{
            const action = new Action({
                actionType:ActionType.dropdown,
                path:this.path,
                optionIndex:i,
            })
            return new Chain({text:opt, actions:[action]})
        })
        return new Cable({
            chains : chains,
            isComparable:true,
        })
    }
    getInfo(){
        return this.options.map(opt=> this.wire+" "+opt)
    }
    static isType(element) {
        if (
            (
                getElementTagname(element) == "select"
            )
        ) return true
        return false
    }
    getOptions() {
        return Array.from(this.element.options)
            .map(option => getDirectText(option))
    }
}
class CustomDropdown extends ISeg{
    constructor(element){
        super(element);
        this.labelName = "Custom Dropdown"
        this.verboseName = "Custom Dropdown"
        this.wire = "[Option]"
        this.options = this.getOptions()
        this.text = this.getOptions().join("\n")
    }
    getCable(){
        const chains = this.options.map((opt,i)=>{
            const action0 = new Action({
                actionType:ActionType.select,
                path:this.path,
                optionIndex:-1,
            })
            const action1 = new Action({
                actionType:ActionType.select,
                path:CustomDropdown.getOptionPathByText(this.element, opt),
                optionIndex:-1,
            })
            return new Chain({text:opt, actions:[action0, action1]})
        })
        return new Cable({
            chains : chains,
            isComparable:true,
        })
    }
    getInfo(){
        return this.options.map(opt=> this.wire+" "+opt)
    }
    static isType(el){
        const rect = Rect.elementToRect(el)
        const innerText = getAllText(el)
        const texts = el.textContent.split('\n')
                    .map(s => cleanText(s))
                    .filter(Boolean)

        return (
            (innerText === "" || texts.includes(innerText)) &&
            texts.length > 2 &&
            rect.h < unit * customDropdownHeight
        )

    }
    static getPatternedChildrenText(el){
        Array.from(el.children).map(child=>{
            getUniqueCssPath(child)
        })
    }
    getOptions(){
        // const visText = getAllText(this.element)
        // const texts = this.element.textContent.split('\n')
        //     .map(s => s.trim())
        //     .filter(Boolean)
        // return texts.filter(text=> text!=visText)  
        return this.element.textContent
                .split('\n')
                .map(s => cleanText(s))
                .filter(Boolean)
    }
    static getOptionPathByText(parent, text){
        const els = CustomDropdown.getElementsWithText(parent, text);
        if(els.length<=0)
            throw new Error('==== Could not find Custom Dropdown by Text ====');
        return getUniqueCssPath(els[0])
    }
    static getElementsWithText(parent, text) {
        let foundElements = [];
      
        function search(element) {
            
             if (getDirectText(element) === text) {
                   foundElements.push(element);
             } else {
                  Array.from(element.children).forEach(child=>{
                    search(child)
                  })
             }
        }
      
        search(parent);
      
        return foundElements;
    }
}
// =========
class ISubmit extends ISeg{
    constructor(element){
        super(element);
        this.name = "Submit"
        this.color = "red"
        this.wire = ""
        this.text = getAllText(element) || getAllText(element) ||  ""
    }
    getCable(){
        const action = new Action({
            actionType:ActionType.select,
            path:this.path,
            optionIndex:-1,
        })
        const chain = new Chain({text:this.text, actions:[action]})
        return new Cable({
            chains : [chain],
            isComparable:false,
        })
    }
    static isType(segments, segment) {
        if(!(segment instanceof ISelect))
            return false

        const style = getComputedStyle(segment.element)
        if(ISubmit.hasSubmitBehaviour(segment, style))
            return true

        // check if bg is repeated
        if(Vis.hasBG(style)){
            const exsitsRepeatedColor = segments.some(seg=>{
                if(seg===segment)
                    return false
                const style2 = getComputedStyle(seg.element)
                if(Vis.hasBG(style2)){
                    return style.backgroundColor === style2.backgroundColor
                }
                return false
            })
            if(exsitsRepeatedColor)
                return false
        }
        return true
    }
    static hasSubmitBehaviour(segment, style){
        const possibleSubmitText = ["submit", "continue","next","ok","skip","go","back",">","->","→"]
        return (
            segment.text &&
            segment.text.split(" ").length <= 5 &&
            possibleSubmitText.includes(segment.text.toLowerCase()) 
        )
    }
}
// =========
class IPicture extends MediaSeg{
    constructor(element){
        super(element);
        this.name = "Image"
    }
    static isType(element) {
        return (
            (
                getElementTagname(element) == "img" &&
                element.getAttribute("src") != null &&
                MediaElement.isMinImageSize(element)
            ) 
        )
    }
}
class IVideo extends MediaSeg{
    constructor(element){
        super(element);
        this.name = "Video"
    }
    static isType(element) {
        return (
            (
                getElementTagname(element) == "video" &&
                MediaElement.isMinMediaSize(element)
            )
        )
    }
}
class IAudio extends MediaSeg{
    constructor(element){
        super(element);
        this.name = "Audio"
    }
    static isType(element) {
        return (
            (
                getElementTagname(element) == "audio" &&
                MediaElement.isMinMediaSize(element)
            )
        )
    }
}


function getSegments(doc){
    function traverseChildren(element, segments) {

        const rect = Rect.elementToRect(element)
        const style = getComputedStyle(element)

        if (Segment.toAvoid(element, rect, style)) {
            return segments
        }
        let segment = Segment.getSegment(element, rect, style);
        if (segment) {
            segments.push(segment);
            if (segment instanceof ISeg)
                return segments
        }
        for (let i = 0; i < element.children.length; i++) {
            segments = traverseChildren(element.children[i], segments);
        }
        return segments;
    }
    let segments = [];
    segments = traverseChildren(doc.body, segments);
    return segments
}
