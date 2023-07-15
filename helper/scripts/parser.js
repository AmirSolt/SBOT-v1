
function getAllIframes(document){
    return document.querySelectorAll("iframe")
}

// ==================================


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

function getElementText(el) {
    let directText = '';
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
            directText += el.childNodes[i].nodeValue;
        }
    }
    return directText
}
function getAllAttrs(el) {
    const attributes = {};
    for (let i = 0; i < el.attributes.length; i++) {
        attributes[el.attributes[i].name] = el.attributes[i].value;
    }
    return attributes
}
function getAllStyles(el){
    const styles = window.getComputedStyle(element);
    const stylesObject = {};
    for (let i = 0; i < styles.length; i++) {
      const property = styles[i];
      const value = styles.getPropertyValue(property);
      stylesObject[property] = value;
    }
    return stylesObject;
}

function getZIndex(el) {
    return parseInt(el.style.zIndex ? el.style.zIndex : 0)
}

function getCenterness(rectEl, rectBody) {
    // Calculate mid points of each element
    var elCenterX = rectEl.left + rectEl.width / 2;
    var elCenterY = rectEl.top + rectEl.height / 2;
    var bodyCenterX = rectBody.left + rectBody.width / 2;
    var bodyCenterY = rectBody.top + rectBody.height / 2;

    // Calculate distance between two points
    var dx = elCenterX - bodyCenterX;
    var dy = elCenterY - bodyCenterY;
    return Math.sqrt(dx * dx + dy * dy);
}

// ==================================

function isSpecialTag(el){
    if(el.tagName === "OPTION"){
        return true;
    }
    return false
}

function isElementVisible(el, rect) {
    if(isSpecialTag(el)) return true
    if (!(rect.width > 0 && rect.height > 0)) return false
    let style = window.getComputedStyle(el);
    if (style.display === 'none') return false
    if (style.visibility === 'hidden') return false
    return true;
}


function filterNonFocusedElements(){
    // opacity filter
    // being covered
}

// ==================================



function getParsedHtml(document, context_path){
    let elements = document.body.querySelectorAll("*");

    let bodyRect = document.body.getBoundingClientRect();

    // filterNonFocusedElements()
    
    let parsed_elements = elements.map(el=>{
        const rect = el.getBoundingClientRect();
 
        return {
            context_path:context_path,
            path: getUniqueCssPath(el),
            name: el.tagName,
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height,
            text: getElementText(el).trim(),
            allText: el.innerText,
            attrs: getAllAttrs(el),
            styles:getAllStyles(el),

            z_index: getZIndex(el),
            centerness: getCenterness(rect, bodyRect),
        }
    })

    return parsed_elements.filter(el=> el)
}


let parsed_elements = []

parsed_elements.push(...getParsedHtml(document, ""))

getAllIframes.array.forEach(iframe => {
    try {
        let iframeContent = iframe.contentWindow.document;
        context_path = getUniqueCssPath(iframe)
        parsed_elements.push(...getParsedHtml(iframeContent, context_path))
    }catch(e){
            return null
    }
});

console.log(parsed_elements)