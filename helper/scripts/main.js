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
function highlight(rect, color, label) {
    const svgNS = 'http://www.w3.org/2000/svg';

    // Create SVG element
    const svg = document.createElementNS(svgNS, 'svg');
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

class Action {
    constructor(actionType, path, optionIndex) {
        this.actionType = actionType
        this.path = path
        this.optionIndex = optionIndex
    }
}
class Chain {
    constructor(text, actions) {
        this.text = text
        this.actions = actions
    }
}
class Cable {
    constructor(chains, isComparable) {
        this.chains = chains
        this.isComparable = isComparable

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

    class Segment {
        constructor(element) {
            this.element = element
            this.labelName = ""
            this.verboseName = ""
            this.color = "white"
            this.rect = Rect.elementToRect(element)
            this.cluster = null
            this.path = this.getPath()
        }
        static toAvoid(el) {
            return (
                Segment.isLink(el) 
                ||
                Segment.isOverflow(el)
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
        static isOverflow(el){
            const style = window.getComputedStyle(el);

            return(
                style.overflow == "auto" || style.overflow == "scroll" ||
                style.overflowX == "auto" || style.overflowX == "scroll" ||
                style.overflowY == "auto" || style.overflowY == "scroll"
            )
        }
        setCluster(cluster) {
            this.cluster = cluster
        }
        getChatVerbose() {
            throw new Error('==== Abstract class ====');
        }
        getSearchVerbose() {
            throw new Error('==== Abstract class ====');
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
            this.text = element.getAttribute("placeholder") || getDirectText(element) || ""
        }
        getAction(optionIndex) {
            throw new Error('==== Abstract class ====');
        }
        getChatVerbose() {
            let text = ` [input:${this.verboseName} id:${this.group.getIElementIndex(this)}] ${this.text}`
            return text.trim()
        }
        getSearchVerbose() {
            return this.text
        }
        getDict() {
            return {
                action_type: this.actionType,
                path: this.path,
            }
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
            this.labelName = "Media"
            this.verboseName = "Media"
            this.color = "cyan"
        }
        static isType(element) {
            throw new Error('==== Abstract class ====');
        }
        getChatVerbose() {
            return `[${this.verboseName}]`
        }
        getSearchVerbose() {
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
            this.labelName = "Text"
            this.verboseName = "Text"
            this.color = "green"
            this.text = getDirectText(element) || ""
        }
        static isType(element) {
            throw new Error('==== Abstract class ====');
        }
        getChatVerbose() {
            return this.text
        }
        getSearchVerbose() {
            return this.text
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
            this.labelName = "Text"
            this.verboseName = "Text"
            this.color = "blue"
        }
        static isType(element) {
            return getDirectText(element) != null
        }
    }
    class Instruction extends TextElement{
        constructor(element) {
            super(element);
            this.labelName = "Instruction"
            this.verboseName = "Instruction"
            this.color = "green"
        }
        static isType(segments, segment) {
            return false
        }
    }
    // =======================
    class ISelect extends IElement {
        constructor(element) {
            super(element);
            this.labelName = "Select"
            this.verboseName = "Select"
            this.color = "red"
            this.text = getAllText(element) || getDirectText(element) || ""
        }
        getAction(optionIndex) {
            return Action(ActionType.select, this.path, null)
        }
        static isType(element) {
            if (
                (
                    getElementTagname(element) == "input" &&
                    (
                        element.getAttribute("type") == "radio" ||
                        element.getAttribute("type") == "checkbox"
                    )
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
                style.cursor === 'pointer'
            )
        }
    }
    class IField extends IElement {
        constructor(element) {
            super(element);
            this.labelName = "Field"
            this.verboseName = "Field"
        }
        getAction(optionIndex) {
            return Action(ActionType.field, this.path, null)
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
            this.labelName = "Dropdown"
            this.verboseName = "Dropdown"
            this.options = this.getOptions()
            this.text = this.options[0] || ""
        }
        getAction(optionIndex) {
            return Action(ActionType.dropdown, this.path, optionIndex)
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
        getDict() {
            return {
                action_type: this.actionType,
                path: this.path,
                options: this.options
            }
        }
        getChatVerbose() {
            let text = `[input:${this.verboseName} id:${this.group.getIElementIndex(this)}`
            this.options.forEach(option => {
                text += ` Option: ${option}`
            })
            text += "]\n"
            return text.trim()
        }
        getSearchVerbose() {
            let text = ""
            this.options.forEach(option => {
                text += ` ${option}`
            })
            return text
        }
    }
    class CustomDropdown extends IElement{
        constructor(element){
            super(element);
            this.labelName = "Custom Dropdown"
            this.verboseName = "Custom Dropdown"
            this.options = this.getOptions()
            this.text = null
        }
        static isType(el){
            const rect = Rect.elementToRect(el)
            const innerText = getAllText(el)
            const texts = el.textContent.split('\n')
                        .map(s => s.trim())
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

        }
        getAction(optionIndex){

        }
    }
    // =========
    class ISubmit extends IElement{
        static isType(segments, segment) {
            return false
        }
    }
    // =======================
    class IPicture extends MediaElement{
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

        static isType(element) {
            return (
                (
                    getElementTagname(element) == "audio" &&
                    MediaElement.isMinMediaSize(element)
                )
            )
        }
    }

    // strategist

    class Group {
        constructor(initSegment) {
            this.rect = initSegment.rect
            this.segments = [initSegment]
        }
        updateRect(segment) {
            this.rect = Rect.combineRects([this.rect, segment.rect])
        }
        isSoloGroup(initSegment) {
            return initSegment instanceof ISubmit
        }
        isGroup(segment) {
            if (
                segment instanceof Segment &&
                !(segment instanceof ISubmit) &&
                segment.group == null &&
                Rect.isWithinMargin(this.rect, segment.rect, innerGroupMargin * unit, "l,r,t,b")
            ) {
                return true
            }
            return false
        }
        isInstruction(textElement) {
            if (
                textElement.group == null &&
                Rect.isWithinMargin(this.rect, textElement.rect, instructionMargin * unit, "t")
            ) {
                return true
            }
            return false
        }
        addToGroup(segment) {
            this.segments.push(segment)
            this.updateRect(segment)
        }

        getChatVerbose() {
            return this.segments
                .sort((a, b) => {
                    // const isXLapping = Rect.areXBoundsOverlaping(a.rect, b.rect);
                    const isYLapping = Rect.areYBoundsOverlaping(a.rect, b.rect);
                    if (!isYLapping) {
                        return a.rect.y - b.rect.y
                    }
                    return a.rect.x - b.rect.x
                })
                .reduce((acc, curr, index, arr) => {
                    let text = curr.getChatVerbose();
                    let divider = "";
                    if (index > 0) {
                        const lastSegment = arr[index - 1]
                        const isYLapping = Rect.areYBoundsOverlaping(lastSegment.rect, curr.rect);
                        if (!isYLapping) {
                            divider = "\n"
                        } else {
                            divider = " "
                        }
                    }
                    return acc + divider + text;
                }, "")
                .trim()
        }
        getSearchVerbose() {
            return this.segments
                .sort((a, b) => {
                    // const isXLapping = Rect.areXBoundsOverlaping(a.rect, b.rect);
                    const isYLapping = Rect.areYBoundsOverlaping(a.rect, b.rect);
                    if (!isYLapping) {
                        return a.rect.y - b.rect.y
                    }
                    return a.rect.x - b.rect.x
                })
                .reduce((acc, curr, index, arr) => {
                    let text = curr.getSearchVerbose();
                    let divider = "";
                    if (index > 0) {
                        divider = " "
                    }
                    return acc + divider + text;
                }, "")
                .trim()
        }
        getIElementsDicts() {
            const ielements = this.segments.filter(segment => segment instanceof IElement)
            return ielements.map(ielement => ielement.getDict())
        }
        getIElementIndex(ielement) {
            const ielements = this.segments.filter(segment => segment instanceof IElement)
            return ielements.findIndex(iel => iel === ielement)
        }
        getMediaDicts() {
            const medias = this.segments.filter(segment => segment instanceof MediaElement)
            return medias.map(media => media.getDict())
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
        getDict() {
            return {
                "id": this.getID(),
                "context_path": contextPath,
                "chat_verbose": this.getChatVerbose(),
                "search_verbose": this.getSearchVerbose(),
                "imedia": this.getMediaDicts(),
                "instruction": null,
                "cables": null,
            }
        }
    }

    function highlightSegments(segments) {
        segments.forEach((segment, i) => {
            highlight(segment.rect, segment.color, `${i}`)
        });
    }
    function highlightGroups(groups) {
        groups.forEach((group, i) => {
            if (i == 0) {
                highlight(group.rect, "#09E912", ``)
            } else if (i == groups.length - 1) {
                highlight(group.rect, "#fc0303", ``)
            } else {
                highlight(group.rect, "#ace010", ``)
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
        for (let index = 0; index < segments.length; index++) {
            const segment = segments[index];
            const ContextualClass = ContextualClasses.find(ContextualClass => ContextualClass.isType(segments, segment))
                if (ContextualClass)
                    segments[index] = new ContextualClass(segment.element)
        }
        return segments
    }
    // ====================== grouping ==========================

    // ====================== Grouping ==========================
    function getGroups(segments) {
        function isRectOnEdge(group) {
            // let leftSide = FLOOR_EDGE * unit;
            let topSide = FLOOR_EDGE * unit;
            // let rightSide = page.w - leftSide;
            let bottomSide = page.h - topSide;
            return (
                !group.segments.length == 1 &&
                !group.segments.some(segment => segment instanceof ISubmit) &&
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
        function getLvl1Grouping(ielements, segments) {
            let groups = []
            ielements.forEach(ielement => {
                if (ielement.group == null) {
                    const group = new Group(ielement)
                    ielement.setGroup(group)
                    groups.push(group)
                    if (group.isSoloGroup(ielement))
                        return
                    segments.forEach(segment => {
                        if (segment.group != null)
                            return
                        if (ielement.group.isGroup(segment)) {
                            ielement.group.addToGroup(segment)
                            segment.setGroup(ielement.group)
                        }
                    });
                }
            });
            return groups;
        }
        function getLvl2Grouping(groups, textElements) {
            groups.forEach(group => {
                const instructionIndex = textElements.findIndex(textElement => group.isInstruction(textElement))
                if (instructionIndex == -1)
                    return
                group.addToGroup(textElements[instructionIndex])
                textElements.splice(instructionIndex, 1)
            });
        }
        function removeEdgeGroups(groups) {
            return groups.filter(group => {
                return !isRectOnEdge(group);
            })
        }
        function sortGroups(groups) {
            return groups.sort((a, b) => {
                const con = a.rect.y - b.rect.y
                if (con === 0)
                    return b.rect.x - a.rect.x
                return con
            })
        }
        const ielements = segments.filter(element => element instanceof IElement);
        const textElements = segments.filter(element => element instanceof TextElement);

        // ============ lvl1 grouping ==============
        let groups = []
        groups = getLvl1Grouping(ielements, segments)

        // ============ lvl2 grouping ==============
        getLvl2Grouping(groups, textElements)

        // ============ remove edge groups ==============
        groups = removeEdgeGroups(groups)

        // ============ sort groups ==============
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

    highlightSegments(gSegments)

    // const gGroups = getGroups(gSegments)
    const gGroups = []

    console.log("groups:", gGroups)

    highlightGroups(gGroups)

    if (gGroups.length == 0)
        return null

    return gGroups.slice(0, 100).map(group => group.getDict())

}



const HIERARCHY_COEFFICIENT = 10;
const AREA_COEFFICIENT = 10;
const POS_COEFFICIENT = 10;

const innerGroupMargin = 1.4;
const instructionMargin = 6;

const customDropdownHeight = 3

const minMediaSize = 3;
const minImageSize = 5;

const FLOOR_EDGE = 18
const FLOOR_MULT = 4

// document.body.style.zoom='25%'

const page = new Rect(0, 0, document.body.clientWidth, document.body.clientHeight)
const unit = parseFloat(getComputedStyle(document.documentElement).fontSize);

console.log("page:", page)

const msFloorInfo = getFloorInfo()

console.log("context:", msFloorInfo.context)

const msGroups = getTopGroups(msFloorInfo)

const msResult = msGroups

console.log("result:", msResult)

// document.body.style.zoom='100%'

