
const HIERARCHY_COEFFICIENT = 5;
const AREA_COEFFICIENT = 5;
const POS_COEFFICIENT = 5;
const INNERHTML_COEFFICIENT = 5;

const AVG_GROUP_BODY_RATIO = 0.2;
const MIN_GROUP_SCORE = 0.0;




function getDistanceRatio(p0, p1, size){
    return Math.abs(p0 - p1)/size
}

function getRectCenter(rect){
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
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
    } else if (position === 'absolute' ||
        position === 'relative' ||
        position === 'fixed') {
        order = 0.2;
    } else if (style.getPropertyValue('display').startsWith('inline')) {
        order = 0.1;
    }

    if(parseInt(zIndex, 10) > 0){
        order += 0.05
    }

    if(order>1)order=1

    return order*HIERARCHY_COEFFICIENT;
}

function getGroupPosScore(rect, bodyRect){
    const [x, y] = getRectCenter(rect);
    const [bx, by] = getRectCenter(bodyRect);

    const xScore = getDistanceRatio(x, bx, bodyRect.width);
    const yScore = getDistanceRatio(y, bodyRect.top+(bodyRect.height*0.2), bodyRect.height);

    return (xScore*0.8) * (yScore*0.2) * POS_COEFFICIENT
}
function getGroupAreaScore(rect, bodyRect){
    const areaRatio = getRectArea(rect)/getRectArea(bodyRect);
    return (1/Math.abs(AVG_GROUP_BODY_RATIO-areaRatio)) * AREA_COEFFICIENT;
}

function getInnerHtmlScore(el, bodyHtmlSize){
    return (el.innerHTML.length / bodyHtmlSize) * INNERHTML_COEFFICIENT
}

function avgScore(numbers){
    const sum = numbers.reduce((a, b) => a + b, 0);
    return (sum / numbers.length) || 0;
}


function getGroupElementScore(el, bodyInfo){

    const rect = el.getBoundingClientRect();
    
    if(!isSpatial(el, rect))
        return 0

    if(!hasInnerText(el))
        return 0

    const style = window.getComputedStyle(el);

    const scores = [
        getInnerHtmlScore(el, bodyInfo.bodyHtmlSize),
        getHierarchyScore(el, style),
        getGroupPosScore(rect, bodyInfo.bodyRect),
        getGroupAreaScore(rect, bodyInfo.bodyRect),
    ]
    
    return avgScore(scores)
}


function getGroupElementsByContext(context){
    let elements = context.body.querySelectorAll("*");
    let bodyInfo = {
        bodyRect: context.body.getBoundingClientRect(),
        bodyHtmlSize: context.body.innerHTML.length,
    }

    
    const groupInfos = Array.from(elements).map(el=>{

        return {
            context:context,
            element:el,
            score:getGroupElementScore(el, bodyInfo)

        }
    })
    return groupInfos
}


function getGroups(){
    let groups = []

    const bodyGroups = getGroupElementsByContext(document)
    if(bodyGroups!=null)
        groups.push(...bodyGroups)
    
    Array.from(getAllIframes(document)).forEach(iframe => {
        try {
            let iframeContent = iframe.contentWindow.document;
            const iframeGroups = getGroupElementsByContext(iframeContent)
            if(iframeGroups!=null)
                groups.push(...iframeGroups)
        }catch(e){
            console.log(e)
        }
    });

    return groups
}


function getOrderedGroupByIndex(groups, orderIndex=0){
    if(groups.length>orderIndex)
        return groups.sort((a,b) => b.score - a.score)[orderIndex];

    return null
}

function highlightElement(target, color, text){
    console.log(target)
    console.log(target.style)
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


function highlightGroup(){
    const groups = getGroups()

    // console.log(groups)

    const groupInfo = getOrderedGroupByIndex(groups, orderIndex=0)
    highlightElement(groupInfo["element"], "red", "group 0")

    const groupInfo1 = getOrderedGroupByIndex(groups, orderIndex=1)
    highlightElement(groupInfo1["element"], "green", "group 1")

    const groupInfo2 = getOrderedGroupByIndex(groups, orderIndex=2)
    highlightElement(groupInfo2["element"], "blue", "group 2")
}

highlightGroup()