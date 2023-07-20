







class IElement{


}
class InputField extends IElement{


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


function getIElement(el){

}

function getTextElement(el){

}

