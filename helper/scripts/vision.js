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

function isSpatial(el, rect) {
    if (!(rect.width > 0 && rect.height > 0)) { return false }
    let style = window.getComputedStyle(el);
    if (style.display === 'none') { return false }
    if (style.visibility === 'hidden') { return false }
    return true;
}

function getHierarchyScore(style) {
    const position = style.getPropertyValue('position');
    const zIndex = style.getPropertyValue('z-index');
    const tagName = element.tagName.toLowerCase();
    let order;

    if (tagName === 'dialog') {
        order = 30000;
    } else if (position === 'absolute' ||
        position === 'relative' ||
        position === 'fixed') {
        order = parseInt(zIndex, 10) || 0;
        order += 20000;
    } else if (style.getPropertyValue('display').startsWith('inline')) {
        order = 10000;
    } else {
        order = parseInt(zIndex, 10) || 0;
    }

    return order;
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

function getRectArea(rect){
    return rect.width * rect.height
}

function getGroupPosScore(rect, bodyRect){
    const [x, y] = getRectCenter(rect);
    const [bx, by] = getRectCenter(bodyRect);
    return distanceBetweenCenters(x,y,bx,by)
}
function getGroupAreaScore(rect, bodyRect){
    const areaRatio = getRectArea(rect)/getRectArea(bodyRect);
    return 1/Math.abs(AVG_GROUP_BODY_RATIO-areaRatio)
}




function resultScore(hierarchyScore, posScore, areaScore){
    return 0
}


function getGroupElementScore(el, bodyRect){

    const rect = el.getBoundingClientRect();
    
    if(!isSpatial(el, rect))
        return 0

    const style = window.getComputedStyle(el);

    const hierarchyScore = getHierarchyScore(style);
    const posScore = getGroupPosScore(rect, bodyRect);
    const areaScore = getGroupAreaScore(rect, bodyRect);
    
    return resultScore(hierarchyScore, posScore, areaScore)
}


function getGroupElementByContext(context){
    let elements = context.body.querySelectorAll("*");
    let bodyRect = context.body.getBoundingClientRect();

    
    const groupScores = Array.from(elements).map(el=>{
        return getGroupElementScore(el, bodyRect)
    })

    const biggestInx = indexOfMax(groupScores)

    if(groupScores[biggestInx] <  MIN_GROUP_SCORE)
        return null

    return {
        context:context,
        element: elements[biggestInx],
        score:groupScores[biggestInx],
    }

}






const AVG_GROUP_BODY_RATIO = 0.2;
const MIN_GROUP_SCORE = 10;

function getGroupElement(){

    let groups = []

    const group = getGroupElementByContext(document)
    if(group!=null)
        groups.push(group)
    
    Array.from(getAllIframes(document)).forEach(iframe => {
        try {
            let iframeContent = iframe.contentWindow.document;
            const iframeGroup = getGroupElementByContext(iframeContent)
            if(iframeGroup!=null)
                groups.push(iframeGroup)
        }catch(e){
            console.log(e)
        }
    });

    if(groups.length>0)
        return groups.sort((a,b) => b.score - a.score)[0];

    return null
}