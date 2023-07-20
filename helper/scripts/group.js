

function getGroups(contextPath, floorPath, segments){
    const context = getContextObj(contextPath)
    const floor = getFloorObj(context, floorPath)
    

}

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

function highlightSegments(segments){

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
    const IElementClasses = [InputField, SubmitElement]
    let IElementInstance = null
    for (let index = 0; index < IElementClasses.length; index++) {
        const IElementClass = IElementClasses[index];
        if(IElementClass.isThisType(el)){
            IElementInstance = new IElementClass(el)
            break
        }
    }
    return IElementInstance;
}
function getTextElement(el){
    if(TextElement.isThisType(el)){
        return new TextElement(el)
    }
    return null
}



class Segment{


    constructor(element){
        this.element = element
        this.name = ""
    }
    static isThisType(){

    }
}

class IElement extends Segment{


}

class TextElement extends Segment{
    constructor(element){
        super(element);
        this.element = element
        this.name = "Text"
    }
    static isThisType(element){
        if(getElementText(element))
            return true
        return false
    }
}


class SubmitElement extends IElement{
    constructor(element){
        super(element);
        this.element = element
        this.name = "Submit"
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
}

class InputField extends IElement{
    constructor(element){
        super(element);
        this.element = element
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
}



let segments = getFloorSegments("", "body")

segments.forEach((segment, i)=>{
    highlightElement(segment.element, "red", `${segment.name}`)
})
