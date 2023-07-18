

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

function isLowVis(style) {
    let filter = style.filter;
    let opacity = style.opacity;

    if (filter !== "none" || opacity < "1") {
        return true;
    } else {
        return false;
    }
}


function isSpatial(el, rect) {
    if (!(rect.width > 0 && rect.height > 0)) { return false }
    let style = window.getComputedStyle(el);
    if (style.display === 'none') { return false }
    if (style.visibility === 'hidden') { return false }
    return true;
}

function getFocusPosScore(x, y){

}

function getGroupAreaScore(w, h){

}

function getGroupElement(document){

}