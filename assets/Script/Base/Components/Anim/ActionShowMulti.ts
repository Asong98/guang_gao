

import ActionShow from "./ActionShow";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('高级动画/ActionShowMulti(多节点依次显示)')
export default class ActionShowMulti extends ActionShow {

    @property([cc.Node])
    targetNode: cc.Node[] = [];

    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunShowMulti(this.node, this.targetNode, { dura: this.dura, targetScale: this.targetScale, targetAlpah: this.targetAlpah });
                })
                .start();
        } else {
            this._act = ActionUtil.RunShowMulti(this.node, this.targetNode, { dura: this.dura, targetScale: this.targetScale, targetAlpah: this.targetAlpah });
        }
    }
}
