import { ActionBase } from "./ActionBase";
import { ActionUtil } from "./ActionUtil";

const { ccclass, property,menu } = cc._decorator;

@ccclass
@menu('高级动画/ActionGoldEffect(飞金币效果)')
export default class ActionGoldEffect extends ActionBase {
    @property(cc.Node)
    tagetNode: cc.Node = ActionUtil.GoldEffectData.targetNode;
    @property(cc.Node)
    startNode: cc.Node = ActionUtil.GoldEffectData.startNode;
    @property([cc.SpriteFrame])
    goldFrame: cc.SpriteFrame[] =ActionUtil.GoldEffectData.goldFrame;

    @property
    dura: number = ActionUtil.GoldEffectData.dura;
    @property
    goldNum: number = ActionUtil.GoldEffectData.goldNum;
    @property
    minAngle:number = ActionUtil.GoldEffectData.minAngle;
    @property
    maxAngle:number = ActionUtil.GoldEffectData.maxAngle;
    @property
    minDis:number = ActionUtil.GoldEffectData.minDis;
    @property
    maxDis:number = ActionUtil.GoldEffectData.maxDis;


    onLoad() {
        if (this.delay >= 0) {
            this._act = cc.tween(this.node)
                .delay(this.delay)
                .call(() => {
                    this._act = ActionUtil.RunShowGoldEff(this.node, { targetNode: this.tagetNode, startNode: this.startNode, goldFrame: this.goldFrame, dura: this.dura, goldNum: this.goldNum, minAngle: this.minAngle, maxAngle: this.maxAngle, minDis: this.minDis, maxDis: this.maxDis});
                })
                .start();
        } else {
            this._act = ActionUtil.RunShowGoldEff(this.node, { targetNode: this.tagetNode, startNode: this.startNode, goldFrame: this.goldFrame, dura: this.dura, goldNum: this.goldNum, minAngle: this.minAngle, maxAngle: this.maxAngle, minDis: this.minDis, maxDis: this.maxDis});        }
    }
}
