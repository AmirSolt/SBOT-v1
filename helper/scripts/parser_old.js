

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
        selector += el.id ? `#${el.id}` : '';
        selector += el.className && typeof el.className === 'string' ? '.' + el.className.trim().replace(/\s+/g, ".") : '';
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

function getChildrenInfo(parent, context_path="") {
    let children = Array.from(parent.children).map(el=>{
        let rect = el.getBoundingClientRect();
        if(!isElementVisible(el, rect)){
            return null
        }

        

        return {
            iframe_path:context_path,
            path: getUniqueCssPath(el),
            name: el.tagName,
            width: rect.width,
            height: rect.height,
            attrs: getAllAttrs(el),
            text: getElementText(el).trim(),
            allText: el.innerText,
            z_index: getZIndex(el),
            children: getChildrenInfo(context, children_context_path)
        }

    })
    return children.filter(el=> el)
}


let elementsInfo = getChildrenInfo(document.body);

console.log(elementsInfo)


