function getAllVerbose(elements){
    return elements.map(ielement=>ielement.getVerbose())
}
function highlightElement(target, color, text){
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
    rectangle.setAttribute('stroke-width', unit/8);
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
    var randomColorComponent = function() {
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
function getElementTagname(el){
    return el.tagName.toLowerCase();
}
function getDirectText(el) {
    let directText = '';
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
            directText += el.childNodes[i].nodeValue;
        }
    }
    return directText.trim()
}


class Vis{
    static isSpatial(style, rect) {
        if (!(rect.w > 0 && rect.h > 0)) { return false }
        if (style.display === 'none') { return false }
        if (style.visibility === 'hidden') { return false }
        return true;
    }
    static isLowVis(style){
        if (style.filter !== "none" || style.opacity < "1") {
            return true;
        } 
        return false;
    }
    static hasInnerText(el){
        const innerText = el.innerText
        if(innerText==null)
            return false
        if(innerText.length>0)
            return true
        return false
    }
    static hasBG(style){
        return !(style.backgroundColor === 'rgba(0, 0, 0, 0)' || 
                    style.backgroundColor === 'transparent')
    }
}
class Rect{
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.cx = this.x + this.w / 2;
        this.cy = this.y + this.h / 2;
    }
    get area(){
        return this.w*this.h
    }
    static elementToRect(element){
        const domRect =  element.getBoundingClientRect()
        // new Rect(domRect.left + window.scrollX, domRect.top + window.scrollY, domRect.width, domRect.height)
        return new Rect(domRect.left, domRect.top, domRect.width, domRect.height)
    }
    static isWithinMargin(rect0, rect1, distance, directions){
        const directionsArr = directions.split(",")
        const conditions = directionsArr.map(direction=>{
            switch(direction.toLowerCase().trim()) {
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

        return conditions.some(v=>v==true)
    }
    static areXBoundsOverlaping(rect0, rect1){
        return (
            (rect0.x < rect1.x+rect1.w) &&
            (rect0.x + rect0.w > rect1.x)
        )
    }
    static areYBoundsOverlaping(rect0, rect1){
        return (rect0.y < rect1.y+rect1.h) &&
                (rect0.y + rect0.h > rect1.y)
    }
    static isWithinXMargin(rect0, rect1, distance){
        // <0 is left
        let d = rect1.cx - rect0.cx
        const direction = (d/Math.abs(d))
        let margin = d - ((rect0.w/2 + rect1.w/2) * direction)
        return (margin*direction) < (distance*direction)
    }
    static isWithinYMargin(rect0, rect1, distance){
        // <0 is top
        let d = rect1.cy - rect0.cy
        const direction = (d/Math.abs(d))
        let margin = d - ((rect0.h/2 + rect1.h/2) * direction)
        return (margin*direction) < (distance*direction)
    }
    static combineRects(rects){
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        rects.forEach(function(rect) {
            if(rect == null)
                return null

            minX = Math.min(minX, rect.x);
            minY = Math.min(minY, rect.y);
            maxX = Math.max(maxX, rect.x + rect.w);
            maxY = Math.max(maxY, rect.y + rect.h);
        });
        
        return new Rect(minX, minY, maxX - minX, maxY - minY);
    }
}
class FloorInfo{

    constructor(context, contextPath, element, bodyInfo){
        this.context = context
        this.contextPath = contextPath
        this.element = element
        this.score = this.getFloorScore(element, bodyInfo)
    }
    static isType(el){
        const rect = Rect.elementToRect(el)
        const style = window.getComputedStyle(el);
        if(!Vis.isSpatial(style, rect))
            return false
        if(Vis.isLowVis(style))
            return false
        if(!Vis.hasBG(style))
            return false
        if(!Vis.hasInnerText(el))
            return false
        return true
    }
    static getDistanceRatio(p0, p1, size){
        return Math.abs(p0 - p1)/size
    }
    getFloorPosScore(rect){
    
        let xScore = FloorInfo.getDistanceRatio(rect.cx, screen.cx, screen.w);
        let yScore = FloorInfo.getDistanceRatio(rect.cy, screen.cy, screen.h);
    
        xScore = 1-xScore
        yScore = 1-yScore
    
        return ((xScore*0.5) + (yScore*0.5)) * POS_COEFFICIENT
    }
    getFloorAreaScore(rect, bodyRect){
        const areaRatio = rect.area/bodyRect.area;
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
    
        if(parseInt(zIndex, 10) > 0){
            order += 0.05
        }
    
        if(order>1)order=1
    
        return order*HIERARCHY_COEFFICIENT;
    }
    getInnerHtmlScore(el, bodyHtmlSize){
        return (el.innerHTML.length / bodyHtmlSize) * INNERHTML_COEFFICIENT
    }
    avgScore(scores){
        const sum = scores.reduce((a, b) => a + b, 0);
        return (sum / scores.length) || 0;
    }
    getFloorScore(el, bodyInfo){
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


function getFloorInfo(){

    function getFloorInfosByContext(context, contextPath){
        let elements = context.body.querySelectorAll("*");
        let bodyInfo = {
            bodyRect: Rect.elementToRect(context.body),
            // bodyHtmlSize: context.body.innerHTML.length,
        }
        const floorInfos = []
        Array.from(elements).forEach(el=>{
            if(FloorInfo.isType(el)){
                floorInfos.push(new FloorInfo(
                    context=context,
                    contextPath=contextPath,
                    element=el,
                    bodyInfo=bodyInfo,
                ))
            }
        })
        return floorInfos
    }
    function getAllIframes(document){
        return document.querySelectorAll("iframe")
    }
    function getAllFloorInfos(){
        let floorInfos = []
    
        const bodyFloors = getFloorInfosByContext(document, "")
        if(bodyFloors!=null)
            floorInfos.push(...bodyFloors)
        
        Array.from(getAllIframes(document)).forEach(iframe => {
            try {
                let iframeContent = iframe.contentWindow.document;
                const contextPath = getUniqueCssPath(iframe)
                const iframeFloors = getFloorInfosByContext(iframeContent, contextPath)
                if(iframeFloors!=null)
                    floorInfos.push(...iframeFloors)
            }catch(e){
                console.log(e)
            }
        });
    
        return orderFloorInfos(floorInfos)
    }
    function orderFloorInfos(floorInfos){
        return floorInfos.sort((a,b) => b.score - a.score)
    }
    
    // ====================================================================
    
    const floorInfos = getAllFloorInfos()

    // floorInfos.slice(0,20).forEach((floor, i)=>{
    //     if(floor["score"]>MIN_Floor_SCORE)
    //         highlightElement(floor["element"], "red", `${i}`)
    // })
    
    return floorInfos[0]

    
}

function getGroup(floorInfo){

    class Segment{
        constructor(element){
            this.element = element
            this.labelName = ""
            this.verboseName = ""
            this.color = "white"
            this.rect = Rect.elementToRect(element)
        }
        static isThisType(el){
            const rect = Rect.elementToRect(el)
            const style = window.getComputedStyle(el);
            if(!Vis.isSpatial(style, rect))
                return false
            if(Vis.isLowVis(style))
                return false
            return true
        }
        getVerbose(){
            throw new Error('==== Abstract class ====');
        }
        getPath(){
            return getUniqueCssPath(this.element)
        }
        static getSegment(el){
            let segment = IElement.getIElement(el);
            if(segment == null)
                segment = TextElement.getTextElement(el)
            if(segment == null || segment.rect == null)
                return null
            return segment
        }
    }
    class TextElement extends Segment{
        constructor(element){
            super(element);
            this.element = element
            this.labelName = "Text"
            this.verboseName = "Text"
            this.color = "green"
            this.text = getDirectText(element)
        }
        static isThisType(element){
            // NOTE: if it's not obstructed by blur
            if(getDirectText(element))
                return true
            return false
        }
        getVerbose(){
            return this.text
        }
        static getTextElement(el){
            if(TextElement.isThisType(el)){
                return new TextElement(el)
            }
            return null
        }
    }
    class IElement extends Segment{
        constructor(element){
            super(element);
            this.label = null
            this.color = "blue"
            this.cluster = null
        }
        isLabel(textElement){
            throw new Error('==== Abstract class ====');
        }
        setLabel(textElement){
            textElement.labelName = "Label"
            textElement.verboseName = "Label"
            textElement.color = "purple"
            this.label = textElement
        }
        isClustter(ielement){
            throw new Error('==== Abstract class ====');
        }
        setCluster(cluster){
            this.cluster = cluster
        }
        getOuterRect(){
            const rects = [this.rect]
            if(this.label!=null){
                rects.push(this.label.rect)
            }
            return Rect.combineRects(rects)
        }
        getVerbose(){
            let text = `[Input: ${this.labelName}]`+" : "
            if(this.label!=null)
                text += this.label.getVerbose()
            return text
        }
        static getIElement(el){
    
            const IElementClass = IElementClasses.find(IElementClass=>IElementClass.isThisType(el))
            if(!IElementClass)
                return null
            return new IElementClass(el);
        }
    }
    class SubmitElement extends IElement{
        constructor(element){
            super(element);
            this.labelName = "Submit"
            this.verboseName = "Submit"
            this.color = "cyan"
            this.text = getDirectText(element) | element.getAttribute("value")
        }
        static isThisType(element){
            if(
                (
                    getElementTagname(element) == "input" &&
                    element.getAttribute("type") == "submit"
                ) ||
                getElementTagname(element) == "button"
            ) return true
            return false
        }
        isLabel(textElement){
            return false
        }
        isClustter(ielement){
            return false
        }
    }
    class IRadio extends IElement{
        constructor(element){
            super(element);
            this.labelName = "Radio"
            this.verboseName = "Option"
            this.color = "red"
        }
        static isThisType(element){
            if(
                (
                    getElementTagname(element) == "input" &&
                    element.getAttribute("type") == "radio"
                ) 
                // if it's clickable from css or js point of view
            ) return true
            return false
        }
        isLabel(textElement){
            if(
                Rect.isWithinMargin(this.rect, textElement.rect, smallMargin*unit, "l,r")
            ){
                return true
            }
            return false
        }
        isClustter(ielement){
            if(
                (
                    Rect.isWithinMargin(this.rect, ielement.rect, medMargin*unit, "l,r,t,b")
                ) &&
                (
                    getElementTagname(this.element) == getElementTagname(ielement.element)
                )
            ){
                return true
            }
            return false
        }
    }
    class InputField extends IElement{
        constructor(element){
            super(element);
            this.labelName = "Field"
            this.verboseName = "Text Field"
            this.placeHolder = ""
            this.value = ""
        }
        static isThisType(element){
            if(
                (
                    getElementTagname(element) == "input" &&
                    element.getAttribute("type") == "text"
                ) ||
                getElementTagname(element) == "textarea"
            ) return true
            return false
        }
        isLabel(textElement){
            if(
                Rect.isWithinMargin(this.rect, textElement.rect, medMargin*unit, "l,t")
            ){
                return true
            }
            return false
        }
        isClustter(ielement){
            return false
        }
    }
    class Cluster{
        constructor(){
            this.ielements = []
            this.rect = null
        }
        addElement(element){
            this.ielements.push(element)
            this.updateRect(element)
        }
        updateRect(element){
            if(this.rect == null){
                this.rect = element.getOuterRect()
            }else{
                this.rect = Rect.combineRects([this.rect, element.getOuterRect()])
            }
        }
        getIElementsDict(){
            return this.ielements.map(ielement=>{
                return{
                    "label":ielement.label,
                    "path":ielement.getPath(),
                }
            })
        }
        getVerbose(){
            return getAllVerbose(this.ielements).join("\n")
        }
    }
    class Group{
    
        constructor(cluster){
            this.instructions = []
            this.cluster = cluster
            this.rect = cluster.rect
        }
        updateRect(element){
            this.rect = Rect.combineRects([this.rect, element.rect])
        }
        isInstruction(textElement){
            if(
                Rect.isWithinMargin(this.cluster.rect, textElement.rect, largeMargin*unit, "t")
            ){
                return true
            }
            return false
        }
        addInstruction(textElement){
            this.instructions.push(textElement)
            this.updateRect(textElement)
        }
        getDict(){
            return {
                "context_path":contextPath,
                "floor_path":floorPath,
                "action_type":"uknown",
                "verbose":this.getVerbose(),
                "instructions": getAllVerbose(this.instructions).join("\n"),
                "ielements":this.cluster.getIElementsDict(),
            }
        }
        getVerbose(){
            return getAllVerbose(this.instructions).join("\n") + "\n" + this.cluster.getVerbose()
        }
    }
    // ====================== Floor Segments ==========================

    function getSegments(floor){
        let elements = floor.querySelectorAll("*");
        
        let segments = []
        Array.from(elements).forEach(element => {

            if(Segment.isThisType(element)){
                let segment = Segment.getSegment(element);
                if(segment)
                    segments.push(segment)
            }
        });
    
        return segments
    }

    // ====================== Grouping ==========================
    
    function isRectOnFloorEdge(rect, floorRect){
        // Calculate 10% of floorRect's dimensions
        let leftPercentage = FLOOR_EDGE_PERC * floorRect.w;
        let topPercentage = FLOOR_EDGE_PERC * floorRect.h;
        let rightPercentage = floorRect.w - leftPercentage;
        let bottomPercentage = floorRect.h - topPercentage;
    
        // check the rect's center if it is in 10% edge of floorRect
        if (rect.cx > (floorRect.x + leftPercentage) && rect.cx < (floorRect.x + rightPercentage)
            && rect.cy > (floorRect.y + topPercentage) && rect.cy < (floorRect.y + bottomPercentage)) {
            // rect's center falls within the 10% range of each side of floorRect
            return true;
        } else {
            // rect 's center does not falls within the 10% range of any side of floorRect
            return false;
        }
    }
    function getGroups(floor, segments){
        const floorRect = Rect.elementToRect(floor)
    
        const ielements = segments.filter(element => element instanceof IElement); 
        const textElements = segments.filter(element => element instanceof TextElement); 
    
        // ============ labels ==============
        ielements.forEach(ielement => {
            const labelIndex = textElements.findIndex(textElement=>ielement.isLabel(textElement))
            if(labelIndex==-1)
                return 
                ielement.setLabel(textElements[labelIndex])
                textElements.splice(labelIndex,1)
        });
        
        // ============ clusters ==============
        let clusters = []
        ielements.forEach(ielement => {
            if(!ielement.cluster){
                const cluster = new Cluster()
                cluster.addElement(ielement)
                ielement.setCluster(cluster)
                clusters.push(cluster)
            }
            ielements.forEach(ielement2 => {
                if(ielement2.cluster)
                    return
                if(ielement.isClustter(ielement2)){
                    ielement.cluster.addElement(ielement2)
                    ielement2.setCluster(ielement.cluster)
                }
            });
        });
    
    
        // console.log(clusters)
    
        // clusters.forEach(cluster => {
        //     highlight(cluster.rect, "#05B8CC", "group")
        // });
    
    
        // ============ groups ==============
        const groups = clusters.map(cluster => {
            const group = new Group(cluster)
            const labelIndex = textElements.findIndex(textElement=>group.isInstruction(textElement))
            if(labelIndex==-1)
                return group
            group.addInstruction(textElements[labelIndex])
            textElements.splice(labelIndex,1)
            return group
        });
        
        groups.sort((a,b)=>{
            const aOnEdge = isRectOnFloorEdge(a, floorRect);
            const bOnEdge = isRectOnFloorEdge(b, floorRect);
            if(!aOnEdge && bOnEdge){
                return 1
            }
            if(aOnEdge && !bOnEdge){
                return -1
            }
            if(!aOnEdge && !bOnEdge){
                if(a.rect.cy > b.rect.cy){
                    return 1
                }
                if(a.rect.cy < b.rect.cy){
                    return -1
                }
                return 0
            }
            return 0
    
        })
    
        
    
        return groups
    }

    // ====================== EXE ==========================
    const IElementClasses = [InputField, SubmitElement, IRadio]
    const FLOOR_EDGE_PERC = 0.2
    const contextPath = floorInfo.contextPath;
    const floorPath = floorInfo.floorPath;
    const floor = floorInfo.element
    
    const segments = getSegments(floor)

    console.log("segments:",segments.length)
    
    // segments.forEach((segment, i)=>{
        //     highlightElement(segment.element, segment.color, `${segment.labelName}`)
        // })
        
    const groups = getGroups(floor, segments)
    
    console.log("groups:",groups.length)

    groups.forEach((group,i) => {
        if(i==0){
            highlight(group.rect, "#09E912", "group")
        }else{
            highlight(group.rect, "#ff0000", "group")
        }
    });
    
    if(groups.length == 0)
        return null

    return groups[0].getDict()

}

const HIERARCHY_COEFFICIENT = 10;
const AREA_COEFFICIENT = 10;
const POS_COEFFICIENT = 20;
const smallMargin = 1; 
const medMargin = 1.5; 
const largeMargin = 2; 


const screen = new Rect(window.scrollX, window.scrollY, window.screen.width,  window.screen.height)
const unit = parseFloat(getComputedStyle(document.documentElement).fontSize);


const msFloorInfo = getFloorInfo()

console.log("floorInfo:",msFloorInfo)

const msGroup = getGroup(msFloorInfo)

const msResult = msGroup

console.log("result:",msResult)
