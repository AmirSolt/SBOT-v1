function getPage(context){
    const zBody = context.body,
    zHtml = document.documentElement;
    const zWidth = Math.max( zBody.scrollWidth, zBody.offsetWidth, 
        zHtml.clientWidth, zHtml.scrollWidth, zHtml.offsetWidth );
    const zHeight = Math.max( zBody.scrollHeight, zBody.offsetHeight, 
                        zHtml.clientHeight, zHtml.scrollHeight, zHtml.offsetHeight );
    return new Rect(0, 0, zWidth, zHeight)
}

class EInfo{
}
// ============================================
class Segment{
}
class IElement extends Segment {
}
class MediaElement extends Segment {
}
class TextElement extends Segment {
}
// ===============
class IText extends TextElement{
}
class Instruction extends TextElement{
}
class ISelect extends IElement{
}
class IField extends IElement{
}
class IDropdown extends IElement{
}
class CustomDropdown extends IElement{
}
class ISubmit extends IElement{
}
// ===============
class IPicture extends MediaElement{
}
class IVideo extends MediaElement{
}
class IAudio extends MediaElement{
}
// ============================================
class Action{
}
class Chain{
}








function getSegments(context){

}


const zContext = document
const pageRect = getPage(zContext)

const minMediaSize = 3;
const minImageSize = 5;
const zunit = parseFloat(getComputedStyle(zContext.documentElement).fontSize);

const zSegments = getSegments(zContext)

// cables
    // cable: needsAI, context, instructions, actions, actionType, path