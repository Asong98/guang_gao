import { find, FindArgs, findComponentInParents, FindParentArgs } from "./Util";

import { BaseConfigComponent, from } from "./Config/GameConfigLoader";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Base extends cc.Component {

    ready = false
    static instance: Base = null

    constructor() {
        super()
        // Base.instance = this
    }

    // onLoad() {

    //     this.ready = true

    //     this.getComponentsInChildren(BaseComponent).forEach((component) => {
    //         for (let key in component) {
    //             const value = component[key]
    //             if (value instanceof FindArgs) {
    //                 component[key] = find(value.name, value.parent)
    //             }
    //             else if (value instanceof FindParentArgs) {
    //                 component[key] = findComponentInParents(value.target, value.type)
    //             }
    //         }
    //     })


    //     this.initFrameAnimes()

    //     window['__coolplay_base'] = this

    //     try{
    //         const baseLoadedEvent = document.createEvent('UIEvent')
    //         baseLoadedEvent.initEvent('__coolplay_base:loaded', true, true)
    //         document.dispatchEvent(baseLoadedEvent)
    //     }catch(e){
            
    //     }
       
    // }

    

    initFrameAnimes() {
       
    }
}

   

export class BaseComponent extends BaseConfigComponent {

}
