import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('循环动画/ActionFade(透明度变化)')
export default class ActionFade extends ActionBase {

    @property
    dura: number = ActionUtil.FadeData.dura;
    @property
    minFade: number = ActionUtil.FadeData.minFade;
    @property
    maxFade: number = ActionUtil.FadeData.maxFade;
    @property
    loop: number = ActionUtil.FadeData.loop;

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunFade(this.node, { dura: this.dura, minFade: this.minFade, maxFade: this.maxFade, loop: this.loop });
                })
                .start();
        } else {
            this._act = ActionUtil.RunFade(this.node, { dura: this.dura, minFade: this.minFade, maxFade: this.maxFade, loop: this.loop });
        }
    }
}
