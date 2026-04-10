import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('循环动画/ActionRotate(旋转)')
export default class ActionRotate extends ActionBase {

    @property
    dura: number = ActionUtil.RoatateData.dura;
    @property
    angle: number = ActionUtil.RoatateData.angle;
    @property
    loop: number = ActionUtil.RoatateData.loop;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunRoatate(this.node, { dura: this.dura, angle:this.angle, loop: this.loop });
                })
                .start();
        } else {
            this._act = ActionUtil.RunRoatate(this.node, { dura: this.dura, angle:this.angle, loop: this.loop });
        }
    }
}
