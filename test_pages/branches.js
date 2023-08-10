function getPageRect(doc) {
    const zBody = doc.body,
        zHtml = document.documentElement;
    const zWidth = Math.max(zBody.scrollWidth, zBody.offsetWidth,
        zHtml.clientWidth, zHtml.scrollWidth, zHtml.offsetWidth);
    const zHeight = Math.max(zBody.scrollHeight, zBody.offsetHeight,
        zHtml.clientHeight, zHtml.scrollHeight, zHtml.offsetHeight);
    return new Rect(0, 0, zWidth, zHeight)
}
function getElementTagname(el) {
    return el.tagName.toLowerCase();
}
function getUniqueCssPath(el, root) {
    if(el === root)
        return ""
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }
    const path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el !== root) {
        let selector = el.nodeName.toLowerCase();
        if (el.parentNode) {
            const siblings = Array.from(el.parentNode.children);
            const sameTagSiblings = siblings.filter(sibling => sibling.nodeName.toLowerCase() === selector);
            if (sameTagSiblings.length > 1) {
                selector += `:nth-child(${siblings.indexOf(el) + 1})`;
            }
        }
        path.unshift(selector);
        el = el.parentElement;
    }
    if(path.length === 0 )
        return ""
    return path.join(' > ');
}
function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}
function getAllText(element) {
    const text = element.innerText || '';
    return cleanText(text)
}
function getContentTexts(el) {
    if (el.textContent == null)
        return []
    return el.textContent.split('\n')
        .map(s => cleanText(s))
        .filter(Boolean)
}
function getDirectText(el) {
    let directText = '';
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
            directText += el.childNodes[i].nodeValue;
        }
    }
    return cleanText(directText)
}
function compareArrs(a, b){
    return a.length === b.length &&
    a.every(element => b.some(el=>element===el));
}
function isValidHttpUrl(string) {
    if (string[0] == "/")
        return true

    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:"
}
function highlight(rect, color, label, id) {
    const svgNS = 'http://www.w3.org/2000/svg';

    // var idElements = document.querySelectorAll(`#${id}`);
    // Array.from(idElements).forEach(function(element) {
    //     element.remove();
    // });

    // Create SVG element
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute("id", id)
    svg.style.position = 'fixed';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';
    svg.style.fontSize = zUnit;

    // Create Rectangle
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttribute('x', rect.x);
    rectangle.setAttribute('y', rect.y);
    rectangle.setAttribute('width', rect.w);
    rectangle.setAttribute('height', rect.h);
    rectangle.setAttribute('stroke-width', zUnit / 8);
    rectangle.setAttribute('stroke', color);
    rectangle.setAttribute('fill', 'none');

    // Create Label
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', rect.x);
    text.setAttribute('y', Number(rect.y) + Number(rect.h)); // Position below the rectangle
    text.setAttribute('dy', '1.2em'); // Offset below the rectangle
    text.setAttribute('font-size', zUnit);
    text.setAttribute('fill', color); // Color of text same as box's
    text.setAttribute('stroke', "none");
    text.textContent = label;

    // Add elements to SVG and then to Body
    svg.appendChild(rectangle);
    svg.appendChild(text);
    document.body.appendChild(svg);

}

class Rect {
    AlignIds = {
        x0: "left",
        x1: "center_x",
        x2: "right",
        y0: "top",
        y1: "center_y",
        y2: "bottom",
    }

    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.cx = this.x + this.w / 2;
        this.cy = this.y + this.h / 2;
    }
    get area() {
        return this.w * this.h
    }
    getAlignment(alignId) {
        switch (alignId.toLowerCase().trim()) {
            case Rect.AlignIds.x0:
                return this.x
            case Rect.AlignIds.x1:
                return this.cx
            case Rect.AlignIds.x2:
                return this.x + this.w
            case Rect.AlignIds.y0:
                return this.y
            case Rect.AlignIds.y1:
                return this.cy
            case Rect.AlignIds.y2:
                return this.y + this.h
            default:
                throw new Error(`direction: ${direction} doesnt exist`);
        }
    }
    static elementToRect(element) {
        const domRect = element.getBoundingClientRect()
        return new Rect(domRect.left + window.scrollX, domRect.top + window.scrollY, domRect.width, domRect.height)
        // return new Rect(domRect.left, domRect.top, domRect.width, domRect.height)
    }
    static isWithinMargin(rect0, rect1, distance, directions) {
        const directionsArr = directions.split(",")
        const conditions = directionsArr.map(direction => {
            switch (direction.toLowerCase().trim()) {
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

        return conditions.some(v => v == true)
    }
    static areXBoundsOverlaping(rect0, rect1) {
        return (
            (rect0.x < rect1.x + rect1.w) &&
            (rect0.x + rect0.w > rect1.x)
        )
    }
    static areYBoundsOverlaping(rect0, rect1) {
        return (rect0.y < rect1.y + rect1.h) &&
            (rect0.y + rect0.h > rect1.y)
    }
    static isWithinXMargin(rect0, rect1, distance) {
        // <0 is left
        let d = rect1.cx - rect0.cx
        const direction = (d / Math.abs(d))
        let margin = d - ((rect0.w / 2 + rect1.w / 2) * direction)
        return (margin * direction) < (distance * direction)
    }
    static isWithinYMargin(rect0, rect1, distance) {
        // <0 is top
        let d = rect1.cy - rect0.cy
        const direction = (d / Math.abs(d))
        let margin = d - ((rect0.h / 2 + rect1.h / 2) * direction)
        return (margin * direction) < (distance * direction)
    }
    static combineRects(rects) {
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        rects.forEach(function (rect) {
            if (rect == null)
                return null

            minX = Math.min(minX, rect.x);
            minY = Math.min(minY, rect.y);
            maxX = Math.max(maxX, rect.x + rect.w);
            maxY = Math.max(maxY, rect.y + rect.h);
        });

        return new Rect(minX, minY, maxX - minX, maxY - minY);
    }
    static isContaining(parentRect, childRect) {
        return (
            (parentRect.x <= childRect.x) &&
            (parentRect.y <= childRect.y) &&
            (parentRect.y + parentRect.h >= childRect.y) &&
            (parentRect.x + parentRect.w >= childRect.x)
        )
    }
}
class Vis {
    static isSpatial(style, rect) {
        if (!(rect.w > 0 && rect.h > 0)) { return false }
        if (style.display === 'none') { return false }
        if (style.visibility === 'hidden') { return false }
        return true;
    }
    static isLowVis(style) {
        if (style.filter !== "none" || parseInt(style.opacity) < 1) {
            return true;
        }
        return false;
    }
    static hasInnerText(el) {
        const innerText = el.innerText
        if (innerText == null)
            return false
        if (innerText.length > 0)
            return true
        return false
    }
    static hasBG(style) {
        return !(style.backgroundColor === 'rgba(0, 0, 0, 0)' ||
            style.backgroundColor === 'transparent')
    }
}

// ================================

class Leaf {
    constructor(element) {
        this.element = element
    }
    static isToAvoide(element) {
        return (
            element == null ||
            Leaf.isLink(element)
        )
    }
    static isLink(el) {
        return (
            getElementTagname(el) === "a" &&
            (
                (
                    el.getAttribute("href") != null &&
                    isValidHttpUrl(el.getAttribute("href"))
                ) ||
                el.getAttribute("target") == "_blank"
            )
        )
    }
    static getLeaf(element) {
        const LeafClass = LeafClasses.find(LeafClass => LeafClass.isType(element))
        if (!LeafClass)
            return null
        return new LeafClass(element);
    }
}
// ======
class LInteractive extends Leaf {
}
class LInput extends LInteractive {
    static isType(element) {
        const tagName = getElementTagname(element)
        const attrType = element.getAttribute("type")

        return (
            tagName == "input" &&
            (
                attrType == "text" ||
                attrType == "textarea" ||
                attrType == "date" ||
                attrType == "email" ||
                attrType == "number" ||
                attrType == "password" ||
                attrType == "range" ||
                attrType == "tel" ||
                attrType == "email"
            )
        ) ||
            tagName == "textarea"
    }
}
class LSelect extends LInteractive {
    static isType(element) {
        return getElementTagname(element) == "select"
    }
}
// ======
class LString extends Leaf {
}
class LText extends LString {
    static isType(element) {
        return getDirectText(element) !== ""
    }
}
class LOption extends LString {
    constructor(element) {
        super(element)
        this.parent = element.parentElement
    }
    static isType(el) {

        // if(el !== zDoc.querySelector("#custom-dropdown > div:nth-child(1)"))
        //     return false

        const allText = getContentTexts(el)
        if (allText.length !== 1)
            return false
        const parent = el.parentElement
        if (parent == null)
            return false
        const parentTexts = getContentTexts(parent)
        if(parentTexts.length<=1)
            return false
        const siblings =  Array.from(parent.children)
        if(siblings.length<=1)
            return false
        const textPath = LOption.getTextPath(el, allText[0])
        const monozygoSiblings = siblings.filter(sib =>
             LOption.isElementMonozygotic(allText, textPath, sib))
        
        const monozygoTexts = monozygoSiblings.map(sib=>getContentTexts(sib)[0])
        monozygoTexts.push(allText[0])
    
        return compareArrs(parentTexts, monozygoTexts)
    }

    static isElementMonozygotic(allText, textPath, targetEl){
        if(targetEl == null)
            return false
        const sibAllText = getContentTexts(targetEl)
        if (sibAllText.length !== 1)
            return false
        if (sibAllText[0] === allText[0])
            return false
        const sibTextPath = LOption.getTextPath(targetEl, sibAllText[0])
        if(sibTextPath == null)
            return false

        return textPath === sibTextPath
    }
    static getTextPath(el, text) {
        const targetEl = LOption.getElementWithText(el, text);
        if (targetEl == null)
            return null
        return getUniqueCssPath(targetEl, el)
    }
    static getElementWithText(el, text) {
        function search(element) {
            if (getDirectText(element) === text) {
                return element
            } else {
                let result = null
                Array.from(element.children).forEach(child => {
                    if(result!= null)
                        return
                    result = search(child)
                })
                return result
            }
        }
        return search(el);
    }
}
// ======
class LMedia extends Leaf {
}
class LImage extends LMedia {
    static isType(element) {
        return (
            getElementTagname(element) == "img" &&
            element.getAttribute("src") != null &&
            LImage.isMinImageSize(element)
        )
    }
    static isMinImageSize(el) {
        const rect = Rect.elementToRect(el)
        return (
            rect.w > minImageSize * zUnit &&
            rect.h > minImageSize * zUnit
        )
    }
}

function getLeafs(doc) {
    function traverseChildren(element, leafs) {
        if (Leaf.isToAvoide(element)) {
            return leafs
        }

        const leaf = Leaf.getLeaf(element);
        if(leaf){
            leafs.push(leaf);
            if( SoloParentLeafs.some(SoloParentLeaf=> 
                    leaf instanceof SoloParentLeaf))
                return leafs
        }

        Array.from(element.children).forEach(child => {
            leafs = traverseChildren(child, leafs);
        })

        return leafs;
    }
    let leafs = [];
    leafs = traverseChildren(doc.body, leafs);
    return leafs
}


// ================================


// calc proximity of Leafs based on html cusin or sibling or parent or child

class Branch {
    constructor() {
        this.guide = ""
        this.label = this.getLabel()
        this.context = this.getContext()
    }
    updateRect(elements) {
        const rects = elements.map(el=>Rect.elementToRect(el))
        if(this.rect!=null)
            rects.push(this.rect)
        this.rect = Rect.combineRects(rects)
    }
    getLabel() {
        // gonna depend on element
    }
    getContext() {
        // sort leafs by proximity
        // loop
        // if media and instructions is empty add
        // if text add
        // if anything else break
    }
    static produceBranches(){

    }
}

class BOptions extends Branch {
    // LOptions>1 spatial
    // no other Leafs between them
    static produceBranches(leafs){
        let clusters = [[]]
        leafs.forEach(leaf=>{
            if(clusters.at(-1).length ==0 || leaf.parent == clusters.at(-1).at(-1).parent){
                clusters.at(-1).push(leaf)
            }else{
                clusters.push([leaf])
            }
        })
        clusters = clusters.filter(cluster=>cluster.length>=2)

        const branches = clusters.map(cluster => {
            new BOptions(cluster)
        });

        return branches
    }
}
class BInput extends Branch {
    // LInput and spatial
}
class BSelect extends Branch {
    // LSelect and spatial
    // LOptions>1 and non spatial
    // Children
}
class BDropdown extends Branch {
    // LText is spatial
    // LOptions>1 and non spatial
    // Cusin score
}
class BSubmit extends Branch {
    // LText and pointer and spatial
}

function getBranches(leafs) {
    const branches = []
    BranchClasses.forEach(BranchClass=>{
        branches.push(...BranchClass.produceBranches(leafs))
    })
}



const LeafClasses = [LOption, LText, LInput, LSelect, LImage]
const SoloParentLeafs = [LOption, LImage]
const BranchClasses = [BInput, BSelect, BDropdown, BSubmit, BOptions]

const zDoc = document
const pageRect = getPageRect(zDoc)

const minMediaSize = 3;
const minImageSize = 5;
const zUnit = parseFloat(getComputedStyle(zDoc.documentElement).fontSize);

const zLeafs = getLeafs(zDoc)

// zLeafs.forEach(leaf=>{
//     if(leaf instanceof LOption)
//         highlight(Rect.elementToRect(leaf.element), "yellow", "", "test")
// })

const zBranches = getBranches(zLeafs)

zBranches.forEach(branch=>{
    highlight(branch.rect, "yellow", "", "test")
})

// const zBranches = getBranches(zLeafs)
console.log(zLeafs)