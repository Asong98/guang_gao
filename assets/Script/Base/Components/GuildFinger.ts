// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('通用组件/GuildFinger(引导手指)')
export default class GuildFinger extends cc.Component {
    @property(cc.Node)
    finger: cc.Node = null;
    @property(cc.Node)
    circle_1: cc.Node = null;
    @property(cc.Node)
    circle_2: cc.Node = null;

    @property
    duraParm: number = 1;
    @property
    scaleParm: number = 1;
    @property
    disX: number = -5;
    @property
    disY: number = 5;

    @property({ type: [cc.Node] })
    targetNodes: cc.Node[] = [];
    @property
    mutilDura: number = 0.2;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.targetNodes.length == 0) {
            this.circle_1 && (this.circle_1.opacity = 0);
            this.circle_2 && (this.circle_2.opacity = 0);
            cc.tween(this.finger)
                .by(0.2 * this.duraParm, { x: this.disX, y: this.disY, scale: -0.1 * this.scaleParm })
                .call(() => {
                    this.circle_1 && this.circle_1.active && cc.tween(this.circle_1)
                        .set({ scale: 0.3 * this.scaleParm })
                        .to(0.3 * this.duraParm, { scale: 0.8 * this.scaleParm, opacity: 255 })
                        .to(0.6 * this.duraParm, { scale: 1.5 * this.scaleParm, opacity: 0 })

                        .start();
                    this.circle_2 && this.circle_2.active && cc.tween(this.circle_2)
                        .set({ scale: 0.3 * this.scaleParm })
                        .to(0.2 * this.duraParm, { scale: 1.1 * this.scaleParm, opacity: 255 })
                        .to(0.4 * this.duraParm, { scale: 1.8 * this.scaleParm, opacity: 0 })

                        .start();
                })
                .by(0.2 * this.duraParm, { x: -this.disX, y: -this.disY, scale: 0.1 * this.scaleParm })
                .delay(1 * this.duraParm)
                .union()
                .repeatForever()
                .start();
        } else {
            this.circle_1 && (this.circle_1.opacity = 0);
            this.circle_2 && (this.circle_2.opacity = 0);

            let index = 0;

            cc.tween(this.finger)
                .call(() => {
                    this.node.position = this.node.parent.convertToNodeSpaceAR(this.targetNodes[index].parent.convertToWorldSpaceAR(this.targetNodes[index].position))
                    index++;
                    if (index >= this.targetNodes.length) {
                        index = 0;
                    }
                })
                .to(this.mutilDura, { opacity: 255 })
                .by(0.2 * this.duraParm, { x: this.disX, y: this.disY, scale: -0.1 * this.scaleParm })
                .call(() => {
                    this.circle_1 && this.circle_1.active && cc.tween(this.circle_1)
                        .set({ scale: 0.3 * this.scaleParm })
                        .to(0.3 * this.duraParm, { scale: 0.8 * this.scaleParm, opacity: 255 })
                        .to(0.6 * this.duraParm, { scale: 1.5 * this.scaleParm, opacity: 0 })

                        .start();
                    this.circle_2 && this.circle_2.active && cc.tween(this.circle_2)
                        .set({ scale: 0.3 * this.scaleParm })
                        .to(0.2 * this.duraParm, { scale: 1.1 * this.scaleParm, opacity: 255 })
                        .to(0.4 * this.duraParm, { scale: 1.8 * this.scaleParm, opacity: 0 })

                        .start();
                })
                .by(0.2 * this.duraParm, { x: -this.disX, y: -this.disY, scale: 0.1 * this.scaleParm })
                .delay(0.6 * this.duraParm)
                .to(this.mutilDura, { opacity: 0 })
                .delay(this.mutilDura)
                .union()
                .repeatForever()
                .start();
        }

    }

    start() {

    }

    // update (dt) {}
}
