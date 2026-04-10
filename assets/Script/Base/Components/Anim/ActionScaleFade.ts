import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('循环动画/ActionScaleFade(缩放带重影)')
export default class ActionScaleFade extends ActionBase {

    @property
    dura: number = ActionUtil.ScaleData.dura;
    @property
    minScale: number = ActionUtil.ScaleData.minScale;
    @property
    maxScale: number = ActionUtil.ScaleData.maxScale;

    @property
    fadeDura: number = ActionUtil.ScaleFadeData.dura;
    @property
    fadeMaxScale: number = ActionUtil.ScaleFadeData.maxScale;

    @property
    loop: number = ActionUtil.ScaleData.loop;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.FunScaleFade(this.node, { dura: this.dura, minScale: this.minScale, maxScale: this.maxScale, loop: this.loop }, { dura: this.fadeDura, maxScale: this.fadeMaxScale });
                })
                .start();
        } else {
            this._act = ActionUtil.FunScaleFade(this.node, { dura: this.dura, minScale: this.minScale, maxScale: this.maxScale, loop: this.loop }, { dura: this.fadeDura, maxScale: this.fadeMaxScale });
        }
    }
}
