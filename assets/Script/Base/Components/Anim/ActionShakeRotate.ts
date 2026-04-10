import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('循环动画/ActionShakeRotate(摇晃)')
export default class ActionShakeRotate extends ActionBase {

    @property
    dura: number = ActionUtil.ShakeRotateData.dura;
    @property
    timesDura: number = ActionUtil.ShakeRotateData.timesDura;
    @property
    times: number = ActionUtil.ShakeRotateData.times;
    @property
    angle: number = ActionUtil.ShakeRotateData.angle;
    @property
    loop: number = ActionUtil.ShakeRotateData.loop;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunShakeRotate(this.node, { dura: this.dura, timesDura: this.timesDura, times: this.times, angle: this.angle, loop: this.loop });
                })
                .start();
        } else {
            this._act = ActionUtil.RunShakeRotate(this.node, { dura: this.dura, timesDura: this.timesDura, times: this.times, angle: this.angle, loop: this.loop });
        }
    }
}
