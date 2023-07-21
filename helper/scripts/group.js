class Rect{
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.cx = this.x + this.w / 2;
        this.cy = this.y + this.h / 2;
    }
    static get1DDistance(p0, p1){
        return Math.abs(p0-p1)
    }
    static get2DDistance(x0, y0, x1, y1){
        const xDiff = x1 - x0;
        const yDiff = y1 - y0;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
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

class Segment{


    constructor(element){
        this.element = element
        this.name = ""
        this.color = "white"

        const domRect =  element.getBoundingClientRect()
        this.rect = new Rect(domRect.left, domRect.top, domRect.width, domRect.height)
    }
    static isThisType(element){
        throw new Error('==== Abstract class ====');
    }
    

}

class TextElement extends Segment{
    constructor(element){
        super(element);
        this.element = element
        this.name = "Text"
        this.color = "green"
    }
    static isThisType(element){
        if(getElementText(element))
            return true
        return false
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
        textElement.name = "Label"
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
        return Rect.combineRects([this.rect, this.label.rect])
    }
}

class SubmitElement extends IElement{
    constructor(element){
        super(element);
        this.name = "Submit"
        this.color = "cyan"
        this.text = getElementText(element) | element.getAttribute("value")
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
        this.name = "Radio"
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
            Rect.get1DDistance(textElement.rect.cx, this.rect.cx) < (textElement.rect.w/2 + this.rect.w/2 + (4 * unit))
        ){
            return true
        }
        return false
    }
    isClustter(ielement){
        if(
            (
                (
                    Rect.get1DDistance(ielement.rect.cx, this.rect.cx)< 1 * unit &&
                    Rect.get1DDistance(ielement.rect.cy, this.rect.cy)< 4 * unit
                ) ||
                (
                    Rect.get1DDistance(ielement.rect.cx, this.rect.cx)< 4 * unit &&
                    Rect.get1DDistance(ielement.rect.cy, this.rect.cy)< 1 * unit
                )
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
        this.name = "Field"
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
            (
                Rect.get1DDistance(textElement.rect.x, this.rect.x)< 2 * unit &&
                Rect.get1DDistance(textElement.rect.cy, this.rect.cy)< 4 * unit
            ) ||
            (
                Rect.get1DDistance(textElement.rect.y, this.rect.y)< 2 * unit &&
                Rect.get1DDistance(textElement.rect.cx, this.rect.cx) < (textElement.rect.w/2 + this.rect.w/2 + (4 * unit))
            )
        ){
            return true
        }
        return false
    }
    isClustter(ielement){
        return false
    }
}


class Group{
}

class ICluster{
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
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';

    // Create Rectangle
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttribute('x', rect.x);
    rectangle.setAttribute('y', rect.y);
    rectangle.setAttribute('width', rect.w);
    rectangle.setAttribute('height', rect.h);
    rectangle.setAttribute('stroke', color);
    rectangle.setAttribute('fill', 'none');

    // Create Label
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', rect.x);
    text.setAttribute('y', Number(rect.y) + Number(rect.h)); // Position below the rectangle
    text.setAttribute('dy', '1.2em'); // Offset below the rectangle
    text.setAttribute('fill', color); // Color of text same as box's
    text.textContent = label;

    // Add elements to SVG and then to Body
    svg.appendChild(rectangle);
    svg.appendChild(text);
    document.body.appendChild(svg);
}



// ====================== Floor Segments ==========================

function getFloorSegments(contextPath, floorPath){
    
    const context = getContextObj(contextPath)
    const floor = getFloorObj(context, floorPath)
    let elements = floor.querySelectorAll("*");
    

    let segments = []
    Array.from(elements).forEach(element => {
        let segment = getSegment(element);
        if(segment)
            segments.push(segment)
    });

    return segments
}
function getFloorObj(context, floorPath){
    return context.querySelector(floorPath);
}
function getContextObj(contextPath){
    let context = document
    if(contextPath.length>0){
        const iframe = document.body.querySelectorAll(contextPath);
        context = iframe.contentWindow.document;
    }
    return context;
}
function isLowVis(style) {
    let filter = style.filter;
    let opacity = style.opacity;

    if (filter !== "none" || opacity < "1") {
        return true;
    } else {
        return false;
    }
}
function getSegment(el){
    let segment = getIElement(el);
    if(!segment)
        segment = getTextElement(el)
    return segment
}
function getElementTagname(el){
    return el.tagName.toLowerCase();
}
function getElementText(el) {
    let directText = '';
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
            directText += el.childNodes[i].nodeValue;
        }
    }
    return directText.trim()
}
function getIElement(el){

    const IElementClass = IElementClasses.find(IElementClass=>IElementClass.isThisType(el))
    if(!IElementClass)
        return null
    ielementInstance = new IElementClass(el)
    return ielementInstance;
}
function getTextElement(el){
    if(TextElement.isThisType(el)){
        return new TextElement(el)
    }
    return null
}


// ====================== Grouping ==========================


function getGroups(contextPath, floorPath, segments){
    const context = getContextObj(contextPath)
    const floor = getFloorObj(context, floorPath)

    const ielements = segments.filter(element => element instanceof IElement); 
    const textElements = segments.filter(element => element instanceof TextElement); 

    ielements.forEach(ielement => {
        const labelIndex = textElements.findIndex(textElement=>ielement.isLabel(textElement))
        if(!labelIndex)
            return 
        ielement.setLabel({...textElements[labelIndex]})
        textElements.splice(labelIndex, 1)
    });

    let clusters = []
    ielements.forEach(ielement => {
        if(!ielement.cluster){
            const cluster = new ICluster()
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

    clusters.forEach(cluster => {
        highlight(cluster.rect, "#05B8CC", "cluster")
    });

    // find texts in group from iscluster
}



// ====================== EXE ==========================
const unit = parseFloat(getComputedStyle(document.documentElement).fontSize);
const IElementClasses = [InputField, SubmitElement, IRadio]
const contextPath = "";
const floorPath = "body";


let segments = getFloorSegments(contextPath, floorPath)

// segments.forEach((segment, i)=>{
//     highlightElement(segment.element, segment.color, `${segment.name}`)
// })

let groups = getGroups(contextPath, floorPath, segments)

