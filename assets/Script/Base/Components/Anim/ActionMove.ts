import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('循环动画/ActionMove(移动)')
export default class ActionMove extends ActionBase {

    @property
    dura: number = ActionUtil.MoveData.dura;
    @property
    timesDura: number = ActionUtil.MoveData.timesDura;
    @property
    times: number = ActionUtil.MoveData.times;
    @property
    disX: number = ActionUtil.MoveData.disX;
    @property
    disY: number = ActionUtil.MoveData.disY;
    @property
    loop: number = ActionUtil.MoveData.loop;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunMove(this.node, { dura: this.dura, timesDura: this.timesDura, times: this.times, disX: this.disX, disY: this.disY, loop: this.loop })
                })
                .start();
        } else {
            this._act = ActionUtil.RunMove(this.node, { dura: this.dura, timesDura: this.timesDura, times: this.times, disX: this.disX, disY: this.disY, loop: this.loop })
        }
    }
}
