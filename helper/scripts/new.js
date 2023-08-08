function getPage(context){
    const zBody = context.body,
    zHtml = document.documentElement;
    const zWidth = Math.max( zBody.scrollWidth, zBody.offsetWidth, 
        zHtml.clientWidth, zHtml.scrollWidth, zHtml.offsetWidth );
    const zHeight = Math.max( zBody.scrollHeight, zBody.offsetHeight, 
                        zHtml.clientHeight, zHtml.scrollHeight, zHtml.offsetHeight );
    return new Rect(0, 0, zWidth, zHeight)
}

class Fel{
}
class Fub{
}
// ============================================
class Zel{
}
class Zub{
}
// ============================================
const ActionType = {
    field: "field",
    select: "select",
    dropdown: "dropdown",
}
class Action {
    constructor({actionType, path, optionIndex}) {
        this.actionType = actionType
        this.path = path
        this.optionIndex = optionIndex
    }
    getDict(){
        return{
            action_type:this.actionType,
            path:this.path,
            option_index:this.optionIndex,
        }
    }
}
class Chain {
    constructor({wire, label, actions}) {
        this.wire = wire
        this.label = label
        this.actions = actions
    }
    getDict(){
        return{
            wire:this.wire,
            label:this.label,
            actions:this.actions.map(action=>action.getDict()),
        }
    }
}
class Cable {
    constructor({chains, instruction}) {
        this.instruction = instruction
        this.chains = chains
    }
    getDict(){
        return{
            instruction:this.instruction,
            chains:this.chains.map(chain=>chain.getDict()),
        }
    }
}



function getFels(context){
    // loop through elements get fels
    // loop through fegs get fubs

}
function getZels(fels){

}
function getCables(zels){

}


const zContext = document
const pageRect = getPage(zContext)

const minMediaSize = 3;
const minImageSize = 5;
const zunit = parseFloat(getComputedStyle(zContext.documentElement).fontSize);

const fels = getFels(zContext)
const zels = getZels(fels)
const cables = getCables(zels)

