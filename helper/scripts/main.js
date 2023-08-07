function highlightElement(target, color, text) {
    console.log(target)
    // console.log(target.style)
    target.style.borderColor = color;
    target.style.borderStyle = 'solid';
    var container = document.createElement('div');
    container.style.position = 'relative'
    var label = document.createElement('div');

    label.textContent = text;
    label.style.position = 'absolute';
    label.style.top = '-40px';
    label.style.left = '0';
    label.style.borderColor = color;
    label.style.borderStyle = 'solid';

    container.insertBefore(label, container.firstChild)
    target.insertBefore(container, target.firstChild);
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
function randomColor() {
    // Method to generate a hexadecimal number till the range of 80
    var randomColorComponent = function () {
        return ('0' + Math.floor(Math.random() * Math.floor(128)).toString(16)).substr(-2);
    }

    // Generate a dark color by generating a random number till 80 for each component.
    var color = "#" + randomColorComponent() + randomColorComponent() + randomColorComponent();

    return color;
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
function getElementTagname(el) {
    return el.tagName.toLowerCase();
}
function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
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
function getAllTagnames(el, tagNames = []){
    tagNames.push(element.tagName);
    for(let i = 0; i < element.children.length; i++){
        getAllTagNames(element.children[i], tagNames);
    }
    return tagNames;
}

const ActionType = {
    field: "field",
    select: "select",
    dropdown: "dropdown",
}
const GroupType = {
    list:"list",
    grid:"grid",
    submit:"submit",
    media:"media",
    other:"other",
}

class Vis {
    static isSpatial(style, rect) {
        if (!(rect.w > 0 && rect.h > 0)) { return false }
        if (style.display === 'none') { return false }
        if (style.visibility === 'hidden') { return false }
        return true;
    }
    static isLowVis(style) {
        if (style.filter !== "none" || style.opacity < "1") {
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
class FloorInfo {

    constructor(context, contextPath, element, bodyInfo) {
        this.context = context
        this.contextPath = contextPath
        this.element = element
        this.score = this.getFloorScore(element, bodyInfo)
    }
    static isType(el) {
        const rect = Rect.elementToRect(el)
        const style = window.getComputedStyle(el);
        if (!Vis.isSpatial(style, rect))
            return false
        if (Vis.isLowVis(style))
            return false
        if (!Vis.hasInnerText(el))
            return false
        return true
    }
    static getDistanceRatio(p0, p1, size) {
        return Math.abs(p0 - p1) / size
    }
    getFloorPosScore(rect) {

        let xScore = FloorInfo.getDistanceRatio(rect.cx, page.cx, page.w);
        // let yScore = FloorInfo.getDistanceRatio(rect.cy, page.cy, page.h);

        xScore = 1 - xScore
        // yScore = 1-yScore

        // return ((xScore*0.5) + (yScore*0.5)) * POS_COEFFICIENT
        return xScore * POS_COEFFICIENT
    }
    getFloorAreaScore(rect, bodyRect) {
        const areaRatio = rect.area / bodyRect.area;
        return areaRatio * AREA_COEFFICIENT;
    }
    getHierarchyScore(el, style) {
        const position = style.getPropertyValue('position');
        const zIndex = style.getPropertyValue('z-index');
        const tagName = getElementTagname(el)
        let order = 0.0;

        if (tagName === 'dialog') {
            order = 0.3;
        }
        else if (position === 'absolute' ||
            // position === 'relative' ||
            position === 'fixed') {
            order = 0.2;
        }
        // else if (style.getPropertyValue('display').startsWith('inline')) {
        //     order = 0.1;
        // }

        if (parseInt(zIndex, 10) > 0) {
            order += 0.05
        }

        if (order > 1) order = 1

        return order * HIERARCHY_COEFFICIENT;
    }
    getInnerHtmlScore(el, bodyHtmlSize) {
        return (el.innerHTML.length / bodyHtmlSize) * INNERHTML_COEFFICIENT
    }
    avgScore(scores) {
        const sum = scores.reduce((a, b) => a + b, 0);
        return (sum / scores.length) || 0;
    }
    getFloorScore(el, bodyInfo) {
        const rect = Rect.elementToRect(el)
        const style = window.getComputedStyle(el);

        const scores = [
            this.getHierarchyScore(el, style),
            this.getFloorAreaScore(rect, bodyInfo.bodyRect),
            this.getFloorPosScore(rect, bodyInfo.bodyRect),
            // getInnerHtmlScore(el, bodyInfo.bodyHtmlSize),
        ]
        return this.avgScore(scores)
    }
}





function getFloorInfo() {

    function getFloorInfosByContext(context, contextPath) {
        let elements = context.body.querySelectorAll("*");
        let bodyInfo = {
            bodyRect: Rect.elementToRect(context.body),
            // bodyHtmlSize: context.body.innerHTML.length,
        }
        const floorInfos = []
        Array.from(elements).forEach(el => {
            if (FloorInfo.isType(el)) {
                floorInfos.push(new FloorInfo(
                    context = context,
                    contextPath = contextPath,
                    element = el,
                    bodyInfo = bodyInfo,
                ))
            }
        })
        return floorInfos
    }
    function getAllIframes(document) {
        return document.querySelectorAll("iframe")
    }
    function getAllFloorInfos() {
        let floorInfos = []

        const bodyFloors = getFloorInfosByContext(document, "")
        if (bodyFloors != null)
            floorInfos.push(...bodyFloors)

        Array.from(getAllIframes(document)).forEach(iframe => {
            try {
                let iframeContent = iframe.contentWindow.document;
                const contextPath = getUniqueCssPath(iframe)
                const iframeFloors = getFloorInfosByContext(iframeContent, contextPath)
                if (iframeFloors != null)
                    floorInfos.push(...iframeFloors)
            } catch (e) {
                console.log(e)
            }
        });

        return orderFloorInfos(floorInfos)
    }
    function orderFloorInfos(floorInfos) {
        return floorInfos.sort((a, b) => b.score - a.score)
    }

    // ====================================================================

    const floorInfos = getAllFloorInfos()

    // floorInfos.slice(0,20).forEach((floor, i)=>{
    //     if(floor["score"]>MIN_Floor_SCORE)
    //         highlightElement(floor["element"], "red", `${i}`)
    // })

    return floorInfos[0]


}


function getTopGroups(floorInfo) {

    // throw new Error('==== Abstract class ====');


    class Action {
        constructor({actionType, path, optionIndex}) {
            this.actionType = actionType
            this.path = path
            this.optionIndex = optionIndex
        }
        getDict(){
            return{
                actionType:this.actionType,
                path:this.path,
                optionIndex:this.optionIndex,
            }
        }
    }
    class Chain {
        constructor({text, actions}) {
            this.text = text
            this.actions = actions
        }
        getDict(){
            return{
                text:this.text,
                actions:this.actions.map(action=>action.getDict()),
            }
        }
    }
    class Cable {
        constructor({chains, isComparable}) {
            this.chains = chains
            this.isComparable = isComparable
        }
        getDict(){
            return{
                chains:this.chains.map(chain=>chain.getDict()),
                isComparable:this.isComparable,
            }
        }
    }

    // =======================
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
        getInfo(){
            return ""
        }
        getCable(){
            return null
        }
        getChain(){
            return null
        }
        static toAvoid(el) {
            const style = window.getComputedStyle(el);

            return (
                Segment.isLink(el) 
                ||
                getElementTagname(el) === "a" &&
                style.pointerEvents === 'none'
                // ||
                // Segment.isOverflow(el, style)
            )
        }
        static isType(el) {
            const rect = Rect.elementToRect(el)
            const style = window.getComputedStyle(el);
            if (!Vis.isSpatial(style, rect))
                return false
            if (!Rect.isContaining(page, rect))
                return false
            if (Vis.isLowVis(style))
                return false
            return true
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
            let segment = IElement.getIElement(el);
            if (segment == null)
                segment = TextElement.getTextElement(el)
            if (segment == null)
                segment = MediaElement.getMediaElement(el)
            if (segment == null || segment.rect == null)
                return null
            return segment
        }
    }
    class IElement extends Segment {
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
    class MediaElement extends Segment {
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
    class TextElement extends Segment {
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
    // =======================

    class IText extends TextElement{
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
    class Instruction extends TextElement{
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
            return !segments.some(seg2=>
                Rect.areYBoundsOverlaping(segment.rect, seg2.rect) &&
                seg2.rect.cx < segment.rect.cx
            )
        }
    }
    // =======================
    class ISelect extends IElement {
        constructor(element) {
            super(element);
            this.name = "Select"
            this.color = "blue"
            this.wire = "[Option]"
            this.text = getAllText(element) || ""
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
    class IField extends IElement {
        constructor(element) {
            super(element);
            this.name = "Field"
            this.wire = "[Input Field]"
            this.text = element.getAttribute("placeholder") || getAllText(element) || ""
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
                        element.getAttribute("type") == "password" ||
                        element.getAttribute("type") == "range" ||
                        element.getAttribute("type") == "tel" ||
                        element.getAttribute("type") == "email"
                    )
                ) ||
                getElementTagname(element) == "textarea"
            ) return true
            return false
        }
    }
    class IDropdown extends IElement {
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
    class CustomDropdown extends IElement{
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
    class ISubmit extends IElement{
        constructor(element){
            super(element);
            this.name = "Submit"
            this.color = "red"
            this.wire = ""
            this.text = getAllText(element) ||  ""
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
            if(!ISubmit.hasSubmitBehaviour(segment, style))
                return false

            // check if bg is repeated
            if(Vis.hasBG(style)){
                const exsitsRepeatedColor = segments.some(seg=>{
                    if(seg===segment)
                        return false
                    const style2 = getComputedStyle(seg.element)
                    if(
                        ISubmit.hasSubmitBehaviour(seg, style2)&&
                            (
                                seg.rect.x == segment.rect.x ||
                                seg.rect.y == segment.rect.y 
                            )
                        ){
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
                (
                    segment.text &&
                    segment.text.split(" ").length <= 5 &&
                    possibleSubmitText.includes(segment.text.toLowerCase()) 
                )||
                Vis.hasBG(style)
            )
        }
    }
    // =======================
    class IPicture extends MediaElement{
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
    class IVideo extends MediaElement{
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
    class IAudio extends MediaElement{
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

    // =======================


    class Director{
        
        static getGroupType(group){
            if(Director.isGrid(group))
                return GroupType.grid
            if(Director.isList(group))
                return GroupType.list
            if(Director.isMedia(group))
                return GroupType.media
            if(Director.isSubmit(group))
                return GroupType.submit
            return GroupType.other
        }
        static isMedia(group){
            const segments = group.otherSegments
            return segments.some(seg=>seg instanceof MediaElement) &&
                    segments.some(seg=>seg instanceof IElement)
        }
        static isSubmit(group){
            const segments = group.otherSegments
            return segments.length === 1 && segments[0] instanceof ISubmit
        }
        static isGrid(group){
            return false
        }
        static isList(group){
            const segments = group.otherSegments
            return segments.filter(seg=>seg instanceof ISelect).length > 1 &&
                 !segments.some(seg=> seg instanceof IElement && !(seg instanceof ISelect))
        }
        static cleanListSegments(segments){
            const iselects = segments.filter(seg=> seg instanceof ISelect)
            const iselectTexted = iselects.filter(seg=> seg.text!=="")
            const iselectNonTexted = iselects.filter(seg=> seg.text==="")

            if(iselectTexted.length>1 || iselectTexted.length===iselectNonTexted.length)
                return iselectTexted

            const itexts = segments.filter(seg=> seg instanceof IText)
            const usedTexts = []
            iselectNonTexted.forEach(iselect=>{
                const matchingText = itexts.find(itext=>
                    Rect.isWithinMargin(iselect.rect, itext.rect, unit*innerGroupMargin, "r"))
                iselect.text = matchingText.text
                usedTexts.push(matchingText)
            })
            // return iselectNonTexted
            return segments.filter(seg=>!usedTexts.some(seg2 => seg2 === seg))
        }

        static isDead(group){
            const ielements = group.otherSegments.filter(seg=>seg instanceof IElement)
            return (
                ielements.length<=0 ||
                (
                    ielements.length==1 &&
                    ielements[0] instanceof ISelect
                 ) ||
                (
                    group.type!=GroupType.submit &&
                    Director.isGroupOnEdge(group)
                )
            )
        }
        static getCables(group){
            const segments = group.otherSegments
            switch (group.type) {
                case GroupType.other:
                    return segments.map(seg=>seg.getCable())
                case GroupType.media:
                    return []
                case GroupType.list:
                    return [new Cable({
                        chains : Director.cleanListSegments(segments)
                            .filter(seg=>seg instanceof ISelect)
                            .map(seg=>seg.getChain())
                            .filter(Boolean),
                        isComparable : true
                    })]
                case GroupType.submit:
                    return segments.map(seg=>seg.getCable())
                case GroupType.grid:
                    throw new Error('==== Not implemented ====');
                default:
                    throw new Error('==== Switch case no match ====: '+group.type);
            }
        }
        static getSegmentsSearchTexts(group){
            const segments = group.otherSegments
            switch (group.type) {
                case GroupType.other:
                    return segments.map(seg=>seg.text).filter(Boolean)
                case GroupType.media:
                    return []
                case GroupType.list:
                    return segments.map(seg=>seg.text).filter(Boolean)
                case GroupType.submit:
                    return segments.map(seg=>seg.text).filter(Boolean)
                case GroupType.grid:
                    throw new Error('==== Not implemented ====');
                default:
                    throw new Error('==== Switch case no match ====: '+group.type);
            }
        }
        static getSegmentsChatTexts(group){
            const segments = group.otherSegments
            switch (group.type) {
                case GroupType.other:
                    return segments.map(seg=>seg.getInfo()).filter(Boolean)
                case GroupType.media:
                    return []
                case GroupType.list:
                    return Director.cleanListSegments(segments).map(seg=>seg.getInfo()).filter(Boolean)
                case GroupType.submit:
                    return segments.map(seg=>seg.getInfo()).filter(Boolean)
                case GroupType.grid:
                    throw new Error('==== Not implemented ====');
                default:
                    throw new Error('==== Switch case no match ====: '+group.type);
            }
        }

        static isGroupOnEdge(group) {
            // let leftSide = FLOOR_EDGE * unit;
            let topSide = FLOOR_EDGE * unit;
            // let rightSide = page.w - leftSide;
            let bottomSide = page.h - topSide;
            return (
                (
                    group.rect.w < FLOOR_EDGE * FLOOR_MULT ||
                    group.rect.h < FLOOR_EDGE * FLOOR_MULT
                ) &&
                (
                    group.rect.cy > bottomSide ||
                    group.rect.cy < topSide
                )
            )
        }
    }

    class Group {
        constructor() {
            this.rect = null
            this.instructions = []
            this.otherSegments = []
            this.instruction = ""
            this.isDead = false
            this.type = GroupType.other
        }
        updateRect(segments) {
            const rects = segments.map(seg=>seg.rect)
            if(this.rect!=null)
                rects.push(this.rect)
            this.rect = Rect.combineRects(rects)
        }
        addInstruction(instruction){
            this.instructions.push(instruction)
            this.updateRect([instruction])

        }
        addSegment(segment) {
            this.otherSegments.push(segment)
            this.updateRect([segment])
        }
        addAllSegments(segments) {
            this.otherSegments.push(...segments)
            this.updateRect(segments)
        }
        update(){
            this.instruction = this.getInstructionText()
            this.type = Director.getGroupType(this)
            this.isDead = Director.isDead(this)
        }

        getID() {
            function roundToMultiple(num, mult) {
                const remainder = num % mult;

                if (Math.abs(remainder) >= mult / 2) {
                    if (num < 0) {
                        return Math.floor(num / mult) * mult;
                    } else {
                        return Math.ceil(num / mult) * mult;
                    }
                } else {
                    return Math.round(num / mult) * mult;
                }
            }
            const mult = 100;
            const x = roundToMultiple(parseInt(this.rect.x), mult);
            const y = roundToMultiple(parseInt(this.rect.y), mult);
            const w = roundToMultiple(parseInt(this.rect.w), mult);
            const h = roundToMultiple(parseInt(this.rect.h), mult);
            return `#${x}#${y}#${w}#${h}#`
        }
        getInstructionText(){
            return this.instructions.map(inst=>inst.text).join(" ")
        }
        static extendText(text, toAddTexts){
            toAddTexts.forEach(toAdd=>{
                if(text!==""){
                    text +=" \n"
                }
                text += toAdd
            }) 
            return text
        }
        getSearchVerbose(){
            let text = this.getInstructionText()
            const segTexts = Director.getSegmentsSearchTexts(this)
            return Group.extendText(text, segTexts)
        }
        getChatVerbose(){
            let text = this.getInstructionText()
            const segTexts = Director.getSegmentsChatTexts(this)
            return Group.extendText(text, segTexts)
        }
        getCables(){
            const cables = Director.getCables(this)
            return cables.map(cable=>cable.getDict())
        }

        getDict() {
            return {
                "id": this.getID(),
                "context_path": contextPath,
                "instruction": this.instruction,
                "search_verbose": this.getSearchVerbose(),
                "chat_verbose": this.getChatVerbose(),
                "type": this.type,
                "cables": this.getCables(),
            }
        }
    }

    function highlightSegments(segments) {
        segments.forEach((segment, i) => {
            highlight(segment.rect, segment.color, `${i}`, "segments-highlight")
        });
    }
    function highlightGroups(groups) {
        groups.forEach((group, i) => {
            if(group.type === GroupType.submit){
                highlight(group.rect, "#00FFFF", ``, "gruops-highlight")
                return
            }
            if (i == 0) {
                highlight(group.rect, "#09E912", ``, "gruops-highlight")
            } else if (i == groups.length - 1) {
                highlight(group.rect, "#fc0303", ``, "gruops-highlight")
            } else {
                highlight(group.rect, "#ace010", ``, "gruops-highlight")
            }
        });
    }
    // ====================== lvl1 segmenting ==========================
    function segmenting0(context) {
        function traverseChildren(element, segments) {
            if (Segment.isType(element)) {
                if (Segment.toAvoid(element)) {
                    return segments
                }
                let segment = Segment.getSegment(element);
                if (segment) {
                    segments.push(segment);
                    if (segment instanceof IElement)
                        return segments
                }
            }
            for (let i = 0; i < element.children.length; i++) {
                segments = traverseChildren(element.children[i], segments);
            }
            return segments;
        }
        let segments = [];
        segments = traverseChildren(context.body, segments);
        return segments
    }
    // ====================== lvl2 segmenting ==========================
    function segmenting1(segments) {
        ContextualClasses.forEach(ContextualClass=>{
            segments.forEach((segment,i)=>{
                if(ContextualClass.isType(segments, segment))
                    segments[i] = new ContextualClass(segment.element)
            })
        })
        return segments
    }
    // ====================== grouping ==========================

    // ====================== Grouping ==========================
    function getGroups(segments) {

        function getLvl1Grouping(instructions, otherSegments) {
            function isSegInBetween(otherSegments, instruction, diff){
                return otherSegments.some(segment=>{
                    const diff2 = (segment.rect.y+segment.rect.h) - instruction.rect.y 
                    return(
                        diff2>0&&
                        diff2<=diff
                    )
                })
            }

            let groups = []
            instructions.forEach(instruction => {
                if(instruction.group == null) {
                    const group = new Group()
                    instruction.setGroup(group)
                    group.addInstruction(instruction)
                    groups.push(group)
                    for (let index = 0; index < instructions.length; index++) {
                        const instruction2 = instructions[index];
                        if (instruction2.group != null)
                            continue
                        const diff = instruction2.rect.y - instruction.rect.y 
                        if(diff<=0)
                            continue
                        if(isSegInBetween(otherSegments, instruction, diff)){
                            break
                        }
                        else{
                            instruction2.setGroup(group)
                            group.addInstruction(instruction2)
                        }
                    }
                }
            });
            return groups;
        }
        function getLvl2Grouping(groups, otherSegments) {
            groups = groups.sort((a,b)=>a.rect.y - b.rect.y)
            for (let index = 0; index < groups.length; index++) {
                const group = groups[index];
                let nextY = -1
                if(index+1>=groups.length)
                    nextY = page.y+page.h
                else{
                    const group2 = groups[index+1]
                    nextY = group2.rect.y
                }
                const diff = nextY - group.rect.y 
                if(diff<=0)
                    continue
                const chosenSegs = otherSegments.filter(segment=>{
                    const diff2 = (segment.rect.y+segment.rect.h) - group.rect.y 
                    return(
                        diff2>0&&
                        diff2<=diff
                    )
                })
                group.addAllSegments(chosenSegs)
            }
        }
        function getLvl3Grouping(groups, submits) {
            if(submits.length<=0)
                return 
            const next = submits.sort((a,b)=>{
                const con = a.rect.y - b.rect.y
                if (con === 0)
                    return b.rect.x - a.rect.x
                return con
            })[0]

            const nGroup = new Group()
            next.setGroup(nGroup)
            nGroup.addSegment(next)
            groups.push(nGroup)
        }
        function directorUpdate(groups){
            groups.forEach(group=>group.update())
        }
        function cleanGroups(groups){
            return groups.filter(group=>!group.isDead)
        }
        function sortGroups(groups) {
            return groups.sort((a, b) => a.rect.y - b.rect.y)
        }
        const instructions = segments.filter(element => element instanceof Instruction);
        const submits = segments.filter(element => element instanceof ISubmit);
        const otherSegments = segments.filter(element => 
            !(element instanceof Instruction)&&
            !(element instanceof ISubmit)
        );

        console.log("submits:",submits)

        // ============ lvl1 grouping ==============
        let groups = []
        groups = getLvl1Grouping(instructions, otherSegments)

        // ============ lvl2 grouping ==============
        getLvl2Grouping(groups, otherSegments)
        
        // ============ lvl3 grouping ==============
        getLvl3Grouping(groups, submits)

        // ============ update ==============
        directorUpdate(groups)

        // ============ remove edge groups ==============
        groups = cleanGroups(groups)

        // // ============ sort groups ==============
        groups = sortGroups(groups)

        return groups
    }
    // ====================== EXE ==========================
    const TextClasses = [IText]
    const IElementClasses = [IField, IDropdown, CustomDropdown, ISelect]
    const MediaClasses = [IAudio, IVideo, IPicture]
    const ContextualClasses = [Instruction, ISubmit]
    const context = floorInfo.context;
    const contextPath = floorInfo.contextPath;


    let gSegments = segmenting0(context)

    gSegments = segmenting1(gSegments)

    console.log("segments:", gSegments)

    // highlightSegments(gSegments)

    const gGroups = getGroups(gSegments)
    // const gGroups = []

    console.log("groups:", gGroups)

    highlightGroups(gGroups)

    if (gGroups.length == 0)
        return null

    return gGroups.slice(0, 100).map(group => group.getDict())

}



const HIERARCHY_COEFFICIENT = 10;
const AREA_COEFFICIENT = 10;
const POS_COEFFICIENT = 10;

const innerGroupMargin = 2;

const customDropdownHeight = 3

const minMediaSize = 3;
const minImageSize = 5;

const FLOOR_EDGE = 4
const FLOOR_MULT = 4

// document.body.style.zoom='25%'

const zBody = document.body,
    zHtml = document.documentElement;

const zWidth = Math.max( zBody.scrollWidth, zBody.offsetWidth, 
    zHtml.clientWidth, zHtml.scrollWidth, zHtml.offsetWidth );

const zHeight = Math.max( zBody.scrollHeight, zBody.offsetHeight, 
                       zHtml.clientHeight, zHtml.scrollHeight, zHtml.offsetHeight );

const page = new Rect(0, 0, zWidth, zHeight)
const unit = parseFloat(getComputedStyle(document.documentElement).fontSize);

console.log("page:", page)

const msFloorInfo = getFloorInfo()

console.log("context:", msFloorInfo.context)

const msGroups = getTopGroups(msFloorInfo)

const msResult = msGroups

console.log("result:", msResult)

// document.body.style.zoom='100%'

