import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('简单动画/ActionShow(显示)')
export default class ActionShow extends ActionBase {
    @property
    dura: number = ActionUtil.ShowData.dura;
    @property
    targetScale: number = ActionUtil.ShowData.targetScale;
    @property
    targetAlpah: number = ActionUtil.ShowData.targetAlpah;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunShow(this.node, { dura: this.dura, targetScale: this.targetScale, targetAlpah: this.targetAlpah });
                })
                .start();
        } else {
            this._act = ActionUtil.RunShow(this.node, { dura: this.dura, targetScale: this.targetScale, targetAlpah: this.targetAlpah });
        }
    }
}
