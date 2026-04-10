import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('简单动画/ActionFade(隐藏)')
export default class ActionHide extends ActionBase {
    @property
    dura: number = ActionUtil.HideData.dura;
    @property
    isScale: boolean = ActionUtil.HideData.isScale;
    
    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunHide(this.node, { dura: this.dura, isScale: this.isScale });
                })
                .start();
        } else {
            this._act = ActionUtil.RunHide(this.node, { dura: this.dura, isScale: this.isScale });
        }
    }
}
