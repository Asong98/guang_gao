// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



import BaseLayer from "./Base/BaseLayer";
import { ActionUtil } from "./Base/Components/Anim/ActionUtil";
import VideoPlayerSprite from "./Base/Components/VideoPlayerSprite";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    upNode: cc.Node = null;
    @property(cc.Node)
    downNode: cc.Node = null;
    @property(cc.Node)
    midNode: cc.Node = null;

    @property(cc.Node)
    btn:cc.Node = null;

    onLoad() {
        super.onLoad();
        this.btn.on("click",()=>{
            ActionUtil.RunShow(this.btn)
        })
        this.node.getComponentInChildren(cc.VideoPlayer).play();
    }

    start() {
        //this.node.parent.getComponentInChildren(VideoPlayerSprite).play(null)
    }

    // update (dt) {}

    // protected setAdaptionPosV() {
    //     this.upNode.x = 0;
    //     this.upNode.y = 534.599;
    //     this.midNode.x = 0;
    //     this.midNode.y = 34.537;
    //     this.downNode.x = 0;
    //     this.downNode.y = -428.379;
    // }

    // protected setAdaptionPosH() {
    //     this.upNode.x = 800;
    //     this.upNode.y = 200;
    //     this.midNode.x = -0;
    //     this.midNode.y = 0;
    //     this.downNode.x = this.upNode.x;
    //     this.downNode.y = -200;
    // }

}
