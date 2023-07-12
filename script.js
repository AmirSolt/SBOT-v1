function getUniqueCssPath(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }
    const path = [];
    while (el.nodeType === Node.ELEMENT_NODE && el.nodeName.toLowerCase() !== 'html') {
        const selector = el.nodeName.toLowerCase() +
            (el.id ? `#${el.id}` : '') +
            (el.className && typeof el.className === 'string'
                ? '.' + el.className.trim().replace(/\s+/g, ".")
                : '');
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(' > ');
}
function getAllAttrs(el) {
    const attributes = {};
    for (let i = 0; i < el.attributes.length; i++) {
        attributes[el.attributes[i].name] = el.attributes[i].value;
    }
    return attributes
}
function getElementText(el) {
    let directText = '';
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
            directText += el.childNodes[i].nodeValue;
        }
    }
    return directText
}
function isElementVisible(el, rect) {
    if (!(rect.width > 0 && rect.height > 0)) { return false }
    let style = window.getComputedStyle(el);
    if (style.display === 'none') { return false }
    if (style.visibility === 'hidden') { return false }
    return true;
}
function getZIndex(el) {
    return parseInt(el.style.zIndex ? el.style.zIndex : 0)
}



function getChildrenInfo(parent) {
    let children = Array.from(parent.children).map(el=>{
        let rect = el.getBoundingClientRect();
        if(!isElementVisible(el, rect)){
            return null
        }
        // switch context if iframe
        return {
            iframe_path:"",
            path: getUniqueCssPath(el),
            name: el.tagName,
            width: rect.width,
            height: rect.height,
            attrs: getAllAttrs(el),
            text: getElementText(el).trim(),
            allText: el.innerText,
            z_index: getZIndex(el),
            children: getChildrenInfo(el)
        }

    })
    return children.filter(el=> el)
}


let elementsInfo = getChildrenInfo(document.body);

console.log(elementsInfo)



//   var iframeContent = iframe.contentWindow.document;