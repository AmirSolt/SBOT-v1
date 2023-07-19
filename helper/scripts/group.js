

function isLowVis(style) {
    let filter = style.filter;
    let opacity = style.opacity;

    if (filter !== "none" || opacity < "1") {
        return true;
    } else {
        return false;
    }
}
