import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('简单动画/ActionShowByStamp(从大到小显示)')
export default class ActionShowByStamp extends ActionBase {
    @property
    dura: number = ActionUtil.ShowByStampData.dura;
    @property
    targetScale: number = ActionUtil.ShowByStampData.targetScale;
    @property
    targetAlpah: number = ActionUtil.ShowByStampData.targetAlpah;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunShowByStamp(this.node, { dura: this.dura, targetScale: this.targetScale, targetAlpah: this.targetAlpah });
                })
                .start();
        } else {
            this._act = ActionUtil.RunShowByStamp(this.node, { dura: this.dura, targetScale: this.targetScale, targetAlpah: this.targetAlpah });
        }
    }
}
