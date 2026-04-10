import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('循环动画/ActionJelly(果冻效果)')
export default class ActionJelly extends ActionBase {

    @property
    dura: number = ActionUtil.JellyData.dura;
    @property
    interval: number = ActionUtil.JellyData.interval;
    @property
    originalScale: number = ActionUtil.JellyData.originalScale;
    @property
    deltaScale: number = ActionUtil.JellyData.deltaScale;
    @property
    frequency: number = ActionUtil.JellyData.frequency;
    @property
    decay: number = ActionUtil.JellyData.decay;
    @property
    loop: number = ActionUtil.JellyData.loop;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunJelly(this.node, { dura: this.dura, interval: this.interval, originalScale: this.originalScale, deltaScale: this.deltaScale, frequency: this.frequency, decay: this.decay, loop: this.loop });
                })
                .start();
        } else {
            ActionUtil.RunJelly(this.node, { dura: this.dura, interval: this.interval, originalScale: this.originalScale, deltaScale: this.deltaScale, frequency: this.frequency, decay: this.decay, loop: this.loop });
        }
    }
}
