
import ActionScale from "./ActionScale";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('高级动画/ActionScaleMulti(多节点循环缩放)')
export default class ActionScaleMulti extends ActionScale {

    @property([cc.Node])
    targetNode: cc.Node[] = [];

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunScaleMulti(this.node, this.targetNode, { dura: this.dura, minScale: this.minScale, maxScale: this.maxScale, loop: this.loop });
                })
                .start();
        } else {
            this._act = ActionUtil.RunScaleMulti(this.node, this.targetNode, { dura: this.dura, minScale: this.minScale, maxScale: this.maxScale, loop: this.loop });
        }
    }
}
