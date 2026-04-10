// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseComponent } from "../Base";
import LayerManger from "./LayerManger";

enum BgType{
    Default,
    FixAll,
    ShowAll,
    NoBoder
}

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('通用组件/BackGround(背景图)')
export default class BackGround extends BaseComponent {

    @property({ type: cc.Enum(BgType) })
    Adaption: BgType = BgType.Default;

    private _resizeFunc: any = null;

    protected onLoad() {
        this.onResize();

        this._resizeFunc = () => {
            this.onResize();
        }
        LayerManger.Instance.AddResizeCallback(this._resizeFunc);
    }
    protected onDestroy() {
        LayerManger.Instance.RemoveResizeCallback(this._resizeFunc);
    }

    protected onResize() {
        switch (this.Adaption) {
            case BgType.Default: {
                this.node.scaleX = 1;
                break;
            }
            case BgType.FixAll: {
                this.node.scaleX = LayerManger.Instance.GetStageW() / this.node.width;
                this.node.scaleY = LayerManger.Instance.GetStageH() / this.node.height;
                break;
            }
            case BgType.ShowAll: {
                if (this.node.width > LayerManger.Instance.GetStageW()) {
                    this.node.scale = LayerManger.Instance.GetStageW() / this.node.width;
                } else {
                    this.node.scale = 1;
                }
                break;
            }
            case BgType.NoBoder: {
                let scale = 1;
                if (this.node.width < LayerManger.Instance.GetStageW()) {
                    scale = LayerManger.Instance.GetStageW() / this.node.width;
                }
                if (this.node.height < LayerManger.Instance.GetStageH()) {
                    let tmp = LayerManger.Instance.GetStageH() / this.node.height;
                    if (tmp > scale) scale = tmp;
                }
                this.node.scale = scale;
                break;
            }
        }

    }
}
