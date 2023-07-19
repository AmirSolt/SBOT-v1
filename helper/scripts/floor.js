
const HIERARCHY_COEFFICIENT = 10;
const AREA_COEFFICIENT = 5;
const POS_COEFFICIENT = 10;
// const INNERHTML_COEFFICIENT = 5;

const MIN_Floor_SCORE = 2.0;


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


function getDistanceRatio(p0, p1, size){
    return Math.abs(p0 - p1)/size
}

function getRectCenter(x, y, w, h){
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    
    return [centerX, centerY]
}

function distanceBetweenCenters(x0, y0, x1, y1) {
    const xDiff = x1 - x0;
    const yDiff = y1 - y0;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function getAllIframes(document){
    return document.querySelectorAll("iframe")
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    let max = arr[0];
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

function hasInnerText(el){
    if(el.innerText==null)
        return false
    if(el.innerText.length>0)
        return true
    return false
}

function isSpatial(el, rect) {
    if (!(rect.width > 0 && rect.height > 0)) { return false }
    let style = window.getComputedStyle(el);
    if (style.display === 'none') { return false }
    if (style.visibility === 'hidden') { return false }
    return true;
}

function getRectArea(rect){
    return rect.width * rect.height
}

function getHierarchyScore(el, style) {
    const position = style.getPropertyValue('position');
    const zIndex = style.getPropertyValue('z-index');
    const tagName = el.tagName.toLowerCase();
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

function getFloorPosScore(rect){
    
    const [x, y] = getRectCenter(rect.left, rect.top, rect.width, rect.height);
    const [sx, sy] = getRectCenter(0, 0, window.screen.width, window.screen.height);

    let xScore = getDistanceRatio(x, sx, window.screen.width);
    let yScore = getDistanceRatio(y, sy, window.screen.height);

    xScore = 1-xScore
    yScore = 1-yScore

    return ((xScore*0.5) + (yScore*0.5)) * POS_COEFFICIENT
}
function getFloorAreaScore(rect, bodyRect){
    const areaRatio = getRectArea(rect)/getRectArea(bodyRect);
    return areaRatio * AREA_COEFFICIENT;
}

function getInnerHtmlScore(el, bodyHtmlSize){
    return (el.innerHTML.length / bodyHtmlSize) * INNERHTML_COEFFICIENT
}

function avgScore(numbers){
    const sum = numbers.reduce((a, b) => a + b, 0);
    return (sum / numbers.length) || 0;
}


function getFloorElementScore(el, bodyInfo){

    const rect = el.getBoundingClientRect();
    
    if(!isSpatial(el, rect))
        return 0

    if(!hasInnerText(el))
        return 0

    const style = window.getComputedStyle(el);

    const scores = [
        getHierarchyScore(el, style),
        getFloorAreaScore(rect, bodyInfo.bodyRect),
        getFloorPosScore(rect, bodyInfo.bodyRect),
        // getInnerHtmlScore(el, bodyInfo.bodyHtmlSize),
    ]
    
    return avgScore(scores)
}


function getFloorElementsByContext(context, contextPath){
    let elements = context.body.querySelectorAll("*");
    let bodyInfo = {
        bodyRect: context.body.getBoundingClientRect(),
        bodyHtmlSize: context.body.innerHTML.length,
    }

    
    const FloorInfos = Array.from(elements).map(el=>{

        return {
            contextPath:contextPath,
            element:el,
            score:getFloorElementScore(el, bodyInfo)

        }
    })
    return FloorInfos
}


function getFloors(){
    let Floors = []

    const bodyFloors = getFloorElementsByContext(document, "")
    if(bodyFloors!=null)
        Floors.push(...bodyFloors)
    
    Array.from(getAllIframes(document)).forEach(iframe => {
        try {
            let iframeContent = iframe.contentWindow.document;
            const contextPath = getUniqueCssPath(iframe)
            const iframeFloors = getFloorElementsByContext(iframeContent, contextPath)
            if(iframeFloors!=null)
                Floors.push(...iframeFloors)
        }catch(e){
            console.log(e)
        }
    });

    return Floors
}


function getOrderedFloors(Floors){
    return Floors.sort((a,b) => b.score - a.score)
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




function highlightFloor(){
    const Floors = getFloors()

    getOrderedFloors(Floors).slice(0,20).forEach((floor, i)=>{
        if(floor["score"]>MIN_Floor_SCORE)
            // highlightElement(floor["element"], "red", `${floor["score"].toFixed(2)}`)
            highlightElement(floor["element"], "red", `${i}`)
    })



    // const FloorInfo = getOrderedFloorByIndex(Floors, orderIndex=0)
    // highlightElement(FloorInfo["element"], "red", `${FloorInfo["score"].toFixed(2)}`)

    // const FloorInfo1 = getOrderedFloorByIndex(Floors, orderIndex=1)
    // highlightElement(FloorInfo1["element"], "green", `${FloorInfo1["score"].toFixed(2)}`)

    // const FloorInfo2 = getOrderedFloorByIndex(Floors, orderIndex=2)
    // highlightElement(FloorInfo2["element"], "blue", `${FloorInfo2["score"].toFixed(2)}`)
}

highlightFloor()