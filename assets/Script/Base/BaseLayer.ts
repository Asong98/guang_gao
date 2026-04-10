// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseComponent } from "./Base";
import LayerManger from "./Components/LayerManger";

enum AdaptionType{
    FixHeight,
    FixWidth,
    AutoRotation,
}


const { ccclass, property } = cc._decorator;


@ccclass
export default class BaseLayer extends BaseComponent {

    @property({ type: cc.Enum(AdaptionType) })
    Adaption: AdaptionType = AdaptionType.FixHeight;

    @property({
        type: cc.Node,
        visible() {
            return this.Adaption == AdaptionType.AutoRotation;
        }
    })
    adaptionLeft: cc.Node = null;
    @property({
        type: cc.Node,
        visible() {
            return this.Adaption == AdaptionType.AutoRotation;
        }
    })
    adaptionRight: cc.Node = null;
    @property({
        visible() {
            return this.Adaption == AdaptionType.AutoRotation;
        }
    })
    adaptionScale: number = 1.9;


    private _resizeFunc: any = null;

    protected onLoad() {
        this.onResize();

        this._resizeFunc = () => {
            this.onResize();
        }
        LayerManger.Instance.AddResizeCallback(this._resizeFunc);
    }

    // protected onDestroy() {
    //     LayerManger.Instance.RemoveResizeCallback(this._resizeFunc);
    // }

    protected onResize() {
        let stageW = LayerManger.Instance.GetStageW();
        let stageH = LayerManger.Instance.GetStageH();

        switch (this.Adaption) {
            case AdaptionType.FixHeight: {
                if (this.node.width > stageW) {
                    this.node.scale = stageW / this.node.width;
                } else {
                    this.node.scale = 1;
                }
                break;
            }
            case AdaptionType.FixWidth: {
                if (this.node.height > stageH) {
                    this.node.scale = stageH / this.node.height;
                } else {
                    this.node.scale = 1;
                }
                break;
            }
            case AdaptionType.AutoRotation: {
                if (stageW < LayerManger.Instance.GetStageH()) {
                    this.setAdaptionPosV();

                    if (this.node.width > stageW) {
                        this.node.scale = stageW / this.node.width;
                    } else {
                        this.node.scale = 1;
                    }
                    this.node.x = 0;
                } else {
                    this.setAdaptionPosH();

                    this.node.scale = this.adaptionScale;
                    this.node.x = 0;

                    let posRight = this.adaptionRight.parent.convertToWorldSpaceAR(this.adaptionRight.position.add(cc.v3(this.adaptionRight.width * 0.5 * this.adaptionRight.scale + 10, 0)));
                    let posLeft = this.adaptionLeft.parent.convertToWorldSpaceAR(this.adaptionLeft.position.sub(cc.v3(this.adaptionLeft.width * 0.5 * this.adaptionLeft.scale + 10, 0)));

                    let nodePosRight = this.node.convertToNodeSpaceAR(posRight);
                    let nodePosLeft = this.node.convertToNodeSpaceAR(posLeft);

                    let w = posRight.x - posLeft.x;

                    if (w > LayerManger.Instance.GetStageW()) {
                        this.node.scale *= LayerManger.Instance.GetStageW() / w;
                    }

                    this.node.x = -(nodePosRight.x + nodePosLeft.x) * 0.5 * this.node.scale;
                }
                break;
            }
        }
    }
    protected setAdaptionPosV() {

    }
    protected setAdaptionPosH() {

    }

    
}
