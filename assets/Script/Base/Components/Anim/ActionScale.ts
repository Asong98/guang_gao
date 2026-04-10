import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('循环动画/ActionScale(缩放)')
export default class ActionScale extends ActionBase {

    @property
    dura: number =ActionUtil.ScaleData.dura;
    @property
    minScale: number = ActionUtil.ScaleData.minScale;
    @property
    maxScale: number = ActionUtil.ScaleData.maxScale;
    @property
    loop: number = ActionUtil.ScaleData.loop;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunScale(this.node, { dura: this.dura, minScale: this.minScale, maxScale: this.maxScale, loop: this.loop });
                })
                .start();
        } else {
            this._act = ActionUtil.RunScale(this.node, { dura: this.dura, minScale: this.minScale, maxScale: this.maxScale, loop: this.loop });
        }
    }
}
