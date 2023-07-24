function getAllVerbose(elements){
    return elements.map(ielement=>ielement.getVerbose())
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
    svg.style.position = 'fixed';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';
    svg.style.fontSize = unit;

    // Create Rectangle
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttribute('x', rect.x);
    rectangle.setAttribute('y', rect.y);
    rectangle.setAttribute('width', rect.w);
    rectangle.setAttribute('height', rect.h);
    rectangle.setAttribute('stroke-width', unit/8);
    rectangle.setAttribute('stroke', color);
    rectangle.setAttribute('fill', 'none');

    // Create Label
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', rect.x);
    text.setAttribute('y', Number(rect.y) + Number(rect.h)); // Position below the rectangle
    text.setAttribute('dy', '1.2em'); // Offset below the rectangle
    text.setAttribute('font-size', unit); 
    text.setAttribute('fill', color); // Color of text same as box's
    text.setAttribute('stroke', "none");
    text.textContent = label;

    // Add elements to SVG and then to Body
    svg.appendChild(rectangle);
    svg.appendChild(text);
    document.body.appendChild(svg);

}
function randomColor() {
    // Method to generate a hexadecimal number till the range of 80
    var randomColorComponent = function() {
        return ('0' + Math.floor(Math.random() * Math.floor(128)).toString(16)).substr(-2);
    }

    // Generate a dark color by generating a random number till 80 for each component.
    var color = "#" + randomColorComponent() + randomColorComponent() + randomColorComponent();
    
    return color;
}
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
function getElementTagname(el){
    return el.tagName.toLowerCase();
}
function getDirectText(el) {
    let directText = '';
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3) {
            directText += el.childNodes[i].nodeValue;
        }
    }
    return directText.trim()
}



function getFloorInfo(){

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
    function avgScore(numbers){
        const sum = numbers.reduce((a, b) => a + b, 0);
        return (sum / numbers.length) || 0;
    }
    function getContextFloorInfos(context, contextPath){
        let elements = context.body.querySelectorAll("*");
        let bodyInfo = {
            bodyRect: Rect.elementToRect(context.body),
            // bodyHtmlSize: context.body.innerHTML.length,
        }
        const floorInfos = Array.from(elements).map(el=>{
            return new FloorInfo(
                contextPath=contextPath,
                floorPath=getUniqueCssPath(el),
                
            )
        })
        return floorInfos
    }
    function getAllIframes(document){
        return document.querySelectorAll("iframe")
    }
    function getAllFloorInfos(){
        let floorInfos = []
    
        const bodyFloors = getContextFloorInfos(document, "")
        if(bodyFloors!=null)
            floorInfos.push(...bodyFloors)
        
        Array.from(getAllIframes(document)).forEach(iframe => {
            try {
                let iframeContent = iframe.contentWindow.document;
                const contextPath = getUniqueCssPath(iframe)
                const iframeFloors = getContextFloorInfos(iframeContent, contextPath)
                if(iframeFloors!=null)
                    floorInfos.push(...iframeFloors)
            }catch(e){
                console.log(e)
            }
        });
    
        return orderFloorInfos(floorInfos)
    }
    function orderFloorInfos(floorInfos){
        return floorInfos.sort((a,b) => b.score - a.score)
    }
    
    
    // ====================================================================
    
    
    const HIERARCHY_COEFFICIENT = 10;
    const AREA_COEFFICIENT = 5;
    const POS_COEFFICIENT = 10;
    const MIN_Floor_SCORE = 2.0;
    
    const floorInfos = getAllFloorInfos()

    
    
    // getOrderedFloors(floors).slice(0,20).forEach((floor, i)=>{
    //     if(floor["score"]>MIN_Floor_SCORE)
    //         highlightElement(floor["element"], "red", `${i}`)
    // })
    
    return floorInfos[0]
}

function getGroup(floorInfo){



    
    // ====================== Floor Segments ==========================
    
    function getSegments(floor){
        let elements = floor.querySelectorAll("*");
        
        let segments = []
        Array.from(elements).forEach(element => {

            if(element

            let segment = Segment.getSegment(element);
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

    // ====================== Grouping ==========================
    
    function isRectOnFloorEdge(rect, floorRect){
        // Calculate 10% of floorRect's dimensions
        let leftPercentage = FLOOR_EDGE_PERC * floorRect.w;
        let topPercentage = FLOOR_EDGE_PERC * floorRect.h;
        let rightPercentage = floorRect.w - leftPercentage;
        let bottomPercentage = floorRect.h - topPercentage;
    
        // check the rect's center if it is in 10% edge of floorRect
        if (rect.cx > (floorRect.x + leftPercentage) && rect.cx < (floorRect.x + rightPercentage)
            && rect.cy > (floorRect.y + topPercentage) && rect.cy < (floorRect.y + bottomPercentage)) {
            // rect's center falls within the 10% range of each side of floorRect
            return true;
        } else {
            // rect 's center does not falls within the 10% range of any side of floorRect
            return false;
        }
    }
    function getGroups(floor, segments){
        const floorRect = Rect.elementToRect(floor)
    
        const ielements = segments.filter(element => element instanceof IElement); 
        const textElements = segments.filter(element => element instanceof TextElement); 
    
        // ============ labels ==============
        ielements.forEach(ielement => {
            const labelIndex = textElements.findIndex(textElement=>ielement.isLabel(textElement))
            if(labelIndex==-1)
                return 
                ielement.setLabel(textElements[labelIndex])
                textElements.splice(labelIndex,1)
        });
        
        // ============ clusters ==============
        let clusters = []
        ielements.forEach(ielement => {
            if(!ielement.cluster){
                const cluster = new Cluster()
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
    
    
        // console.log(clusters)
    
        // clusters.forEach(cluster => {
        //     highlight(cluster.rect, "#05B8CC", "group")
        // });
    
    
        // ============ groups ==============
        const groups = clusters.map(cluster => {
            const group = new Group(cluster)
            const labelIndex = textElements.findIndex(textElement=>group.isInstruction(textElement))
            if(labelIndex==-1)
                return group
            group.addInstruction(textElements[labelIndex])
            textElements.splice(labelIndex,1)
            return group
        });
        
        groups.sort((a,b)=>{
            const aOnEdge = isRectOnFloorEdge(a, floorRect);
            const bOnEdge = isRectOnFloorEdge(b, floorRect);
            if(!aOnEdge && bOnEdge){
                return 1
            }
            if(aOnEdge && !bOnEdge){
                return -1
            }
            if(!aOnEdge && !bOnEdge){
                if(a.rect.cy > b.rect.cy){
                    return 1
                }
                if(a.rect.cy < b.rect.cy){
                    return -1
                }
                return 0
            }
            return 0
    
        })
    
        
    
        return groups
    }

    // ====================== EXE ==========================
    const IElementClasses = [InputField, SubmitElement, IRadio]
    const FLOOR_EDGE_PERC = 0.2
    const contextPath = floorInfo.contextPath;
    const floorPath = floorInfo.floorPath;
    const floor = getFloorObj(getContextObj(contextPath), floorPath)
    
    let segments = getSegments(floor)
    
    // segments.forEach((segment, i)=>{
    //     highlightElement(segment.element, segment.color, `${segment.labelName}`)
    // })
    
    let groups = getGroups(floor, segments)
    
    groups.forEach((group,i) => {
        if(i==0){
            highlight(group.rect, "#09E912", "group")
        }else{
            highlight(group.rect, "#ff0000", "group")
        }
    });
    
    if(groups.length == 0)
        return null

    return groups[0].getDict()
}


const screen = new Rect(window.scrollX, window.scrollY, window.screen.width,  window.screen.height)

const unit = parseFloat(getComputedStyle(document.documentElement).fontSize);
 
const msFloorInfo = getFloorInfo()

console.log("floorInfo:",msFloorInfo)

const msGroup = getGroup(msFloorInfo)

const msResult = msGroup

console.log("result:",msResult)

