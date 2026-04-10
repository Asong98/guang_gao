
type ScaleType = {
    dura?: number,
    minScale?: number,
    maxScale?: number,
    loop?: number,
}
type FadeType = {
    dura?: number,
    minFade?: number,
    maxFade?: number,
    loop?: number
}
type ScaleFadeType = {
    dura?: number,
    maxScale?: number
}
type RotateType = {
    dura?: number,
    angle?: number,
    loop?: number
}
type ShakeRotateType = {
    dura?: number,
    timesDura?: number,
    times?: number,
    angle?: number,
    loop?: number
}
type MoveType = {
    dura?: number,
    timesDura?: number,
    times?: number,
    disX?: number,
    disY?: number,
    loop?: number
}
type JellyType = {
    dura?: number,
    interval?: number,
    originalScale?: number,
    deltaScale?: number,
    frequency?: number,
    decay?: number,
    loop?: number
}
type ShowType = {
    dura?: number,
    targetScale?: number,
    targetAlpah?: number,
    callBack?: Function
}
type HiddenType = {
    dura?: number,
    isScale?: boolean,
    callback?: Function
}

type GoldEffectType = {
    startNode: cc.Node,
    targetNode: cc.Node,
    goldFrame: cc.SpriteFrame[],
    dura?: number,
    goldNum?: number,
    minAngle?: number,
    maxAngle?: number,
    minDis?: number,
    maxDis?: number,
    callback?: Function
}



export class ActionUtil {
    public static readonly Easing = {
        exponentialIn: 'exponentialIn',
        exponentialOut: 'exponentialOut',
        exponentialInOut: 'exponentialInOut',
        sineIn: 'sineIn',
        sineOut: 'sineOut',
        sineInOut: 'sineInOut',
        elasticIn: 'elasticIn',
        elasticOut: 'elasticOut',
        elasticInOut: 'elasticInOut',
        bounceIn: 'bounceIn',
        bounceOut: 'bounceOut',
        bounceInOut: 'bounceInOut',
        backIn: 'backIn',
        backOut: 'backOut',
        backInOut: 'backInOut',
        quadraticActionIn: 'quadraticActionIn',
        quadraticActionOut: 'quadraticActionOut',
        quadraticActionInOut: 'quadraticActionInOut',
        quarticActionIn: 'quarticActionIn',
        quarticActionOut: 'quarticActionOut',
        quarticActionInOut: 'quarticActionInOut',
        quinticActionIn: 'quinticActionIn',
        quinticActionOut: 'quinticActionOut',
        quinticActionInOut: 'quinticActionInOut',
        circleActionIn: 'circleActionIn',
        circleActionOut: 'circleActionOut',
        circleActionInOut: 'circleActionInOut',
        cubicActionIn: 'cubicActionIn',
        cubicActionOut: 'cubicActionOut',
        cubicActionInOut: 'cubicActionInOut'
    };

    public static readonly Dura_0: number = 0.1;
    public static readonly Dura_1: number = 0.3;
    public static readonly Dura_2: number = 0.5;
    public static readonly Dura_3: number = 1.0;

    public static readonly ScaleData: ScaleType = { dura: ActionUtil.Dura_1, minScale: 1, maxScale: 1.1, loop: -1 };
    public static readonly FadeData: FadeType = { dura: ActionUtil.Dura_1, minFade: 150, maxFade: 255, loop: -1 };
    public static readonly ScaleFadeData: ScaleFadeType = { dura: ActionUtil.Dura_1, maxScale: 1.5 };

    public static readonly RoatateData: RotateType = { dura: 5, angle: 360, loop: -1 };
    public static readonly ShakeRotateData: ShakeRotateType = { dura: ActionUtil.Dura_1, timesDura: ActionUtil.Dura_1, times: 2, angle: 5, loop: -1 };

    public static readonly MoveData: MoveType = { dura: ActionUtil.Dura_1, timesDura: ActionUtil.Dura_1, times: 2, disX: 20, disY: 20, loop: -1 };

    public static readonly JellyData: JellyType = { dura: 1, interval: 1, originalScale: 1, deltaScale: 0.5, frequency: 4, decay: 2, loop: -1 };

    public static readonly ShowData: ShowType = { dura: 0.5, targetScale: 1, targetAlpah: 255, callBack: null };
    public static readonly ShowByStampData: ShowType = { dura: 0.3, targetScale: 1, targetAlpah: 255, callBack: null };

    public static readonly HideData: HiddenType = { dura: 0.3, isScale: false, callback: null };

    public static readonly GoldEffectData: GoldEffectType = { targetNode: null, startNode: null, goldFrame: [], dura: 0.02, goldNum: 10, minAngle: 45, maxAngle: 135, minDis: 100, maxDis: 150, callback: null }


    public static RunScale(node: cc.Node, option?: ScaleType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.ScaleData, ...option };

        if (option.loop <= 0) {
            return cc.tween(node)
                .to(option.dura, { scale: option.maxScale })
                .to(option.dura, { scale: option.minScale })
                .union()
                .repeatForever()
                .start();
        } else
            return cc.tween(node)
                .to(option.dura, { scale: option.maxScale })
                .to(option.dura, { scale: option.minScale })
                .union()
                .repeat(option.loop)
                .start();
    }
    public static RunFade(node: cc.Node, option?: FadeType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.FadeData, ...option };
        console.log(option);


        if (option.loop <= 0) {
            return cc.tween(node)
                .to(option.dura, { opacity: option.minFade })
                .to(option.dura, { opacity: option.maxFade })
                .union()
                .repeatForever()
                .start();
        } else
            return cc.tween(node)
                .to(option.dura, { opacity: option.minFade })
                .to(option.dura, { opacity: option.maxFade })
                .union()
                .repeat(option.loop)
                .start();
    }

    public static FunScaleFade(node: cc.Node, scaleOption?: ScaleType, fadeOption?: ScaleFadeType): cc.Tween<cc.Node> {
        fadeOption = { ...ActionUtil.ScaleFadeData, ...fadeOption };
        scaleOption = { ...ActionUtil.ScaleData, ...scaleOption };
        this.RunScale(node, scaleOption);


        let obj = new cc.Node();

        let fun = function (tmp: cc.Node, target: cc.Node) {
            let tmpObj = new cc.Node();
            tmp.addChild(tmpObj);
            let spr = target.getComponent(cc.Sprite);
            if (spr) {
                tmpObj.addComponent(cc.Sprite).spriteFrame = spr.spriteFrame;
            }

            target.children.forEach(element => {
                fun(tmpObj, element);
            });

        }
        fun(obj, node);

        obj.position = cc.Vec3.ZERO;
        node.addChild(obj);

        let tmpScale = obj.scale;
        let tmpAlpha = 200;
        obj.opacity = tmpAlpha;


        if (scaleOption.loop <= 0) {
            return cc.tween(obj)
                .to(fadeOption.dura, { scale: fadeOption.maxScale, opacity: 0 })
                .delay(scaleOption.dura - fadeOption.dura + scaleOption.dura)
                .call(() => {
                    obj.scale = tmpScale;
                    obj.opacity = tmpAlpha;
                })
                .union()
                .repeatForever()
                .start();
        } else {
            return cc.tween(obj)
                .to(fadeOption.dura, { scale: fadeOption.maxScale, opacity: 0 })
                .delay(scaleOption.dura - fadeOption.dura + scaleOption.dura)
                .call(() => {
                    obj.scale = tmpScale;
                    obj.opacity = tmpAlpha;
                })
                .union()
                .repeat(scaleOption.loop)
                .start();
        }

    }

    public static RunRoatate(node: cc.Node, option?: RotateType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.RoatateData, ...option };

        if (option.loop <= 0) {
            return cc.tween(node)
                .by(option.dura, { angle: option.angle })
                .repeatForever()
                .start();
        } else {
            return cc.tween(node)
                .by(option.dura, { angle: option.angle })
                .repeat(option.loop)
                .start();
        }
    }

    public static RunShakeRotate(node: cc.Node, option?: ShakeRotateType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.ShakeRotateData, ...option };

        if (option.loop <= 0) {
            return cc.tween(node)
                .call(() => {
                    cc.tween(node)
                        .to(option.timesDura * 0.5, { angle: option.angle })
                        .to(option.timesDura, { angle: -option.angle })
                        .to(option.timesDura * 0.5, { angle: 0 })
                        .union()
                        .repeat(option.times)
                        .start();
                })
                .delay(option.timesDura * 2 * option.times + option.dura)
                .union()
                .repeatForever()
                .start();
        } else {
            return cc.tween(node)
                .call(() => {
                    cc.tween(node)
                        .to(option.timesDura * 0.5, { angle: option.angle })
                        .to(option.timesDura, { angle: -option.angle })
                        .to(option.timesDura * 0.5, { angle: 0 })
                        .union()
                        .repeat(option.times)
                        .start();
                })
                .delay(option.timesDura * 2 * option.times + option.dura)
                .union()
                .repeat(option.loop)
                .start();
        }

    }

    public static RunMove(node: cc.Node, option?: MoveType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.MoveData, ...option };
        if (option.loop <= 0) {
            return cc.tween(node)
                .call(() => {
                    cc.tween(node)
                        .by(option.timesDura, { x: option.disX, y: option.disY })
                        .by(option.timesDura, { x: -option.disX, y: -option.disY })
                        .union()
                        .repeat(option.times)
                        .start();
                })
                .delay(option.timesDura * 2 * option.times + option.dura)
                .union()
                .repeatForever()
                .start();
        } else {
            return cc.tween(node)
                .call(() => {
                    cc.tween(node)
                        .by(option.timesDura, { x: option.disX, y: option.disY })
                        .by(option.timesDura, { x: -option.disX, y: -option.disY })
                        .union()
                        .repeat(option.times)
                        .start();
                })
                .delay(option.timesDura * 2 * option.times + option.dura)
                .union()
                .repeat(option.loop)
                .start();
        }

    }

    //弹窗动画 手指动画 果冻效果 按钮动画

    /***
     * @param node 节点
     * @param dura 效果总时长
     * @param interval 播放间隔
     * @param originalScale 节点原始缩放
     * @param deltaScale 节点缩放变化量
     * @param frequency 弹跳次数
     * @param decay 衰减指数
     * @param loop 播放次数
     */

    public static RunJelly(node: cc.Node, option?: JellyType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.JellyData, ...option };

        // 重复次数
        const times = (option.loop != undefined && option.loop > 0) ? option.loop : 10e8;
        // 时长
        const pressTime = option.dura * 0.2;         // 收缩时长
        const scaleBackTime = option.dura * 0.15;    // 缩放至原始大小时长
        const bouncingTime = option.dura * 0.65;     // 弹动时长
        // 振幅
        const amplitude = option.deltaScale / scaleBackTime;

        let getDifference = function (amplitude: number, time: number, frequency: number, decay: number) {
            // 角速度（ω=2nπ）
            const angularVelocity = frequency * Math.PI * 2;
            return amplitude * (Math.sin(time * angularVelocity) / Math.exp(decay * time) / angularVelocity);
        }

        // 播放
        return cc.tween(node)
            .repeat(times,
                cc.tween()
                    .to(pressTime, { scaleX: option.originalScale + option.deltaScale, scaleY: option.originalScale - option.deltaScale }, { easing: this.Easing.sineOut })
                    .to(scaleBackTime, { scaleX: option.originalScale, scaleY: option.originalScale })
                    .to(bouncingTime, {
                        scaleX: {
                            value: option.originalScale,
                            progress: (start: number, end: number, current: number, t: number) => {
                                return end - getDifference(amplitude, t, option.frequency, option.decay);
                            }
                        },
                        scaleY: {
                            value: option.originalScale,
                            progress: (start: number, end: number, current: number, t: number) => {
                                return end + getDifference(amplitude, t, option.frequency, option.decay);
                            }
                        }
                    })
                    .delay(option.interval)
            )
            .start();
    }

    public static RunShow(node: cc.Node, option?: ShowType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.ShowData, ...option };
        node.active = true;
        node.scale = 0;
        node.opacity = 0;
        return cc.tween(node)
            .to(option.dura, { scale: option.targetScale, opacity: option.targetAlpah }, { easing: ActionUtil.Easing.backOut })
            .call(() => {
                if (option.callBack)
                    option.callBack();
            })
            .start();
    }
    public static RunShowByStamp(node: cc.Node, option?: ShowType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.ShowByStampData, ...option };
        node.active = true;
        node.scale = 3 * option.targetScale;
        node.opacity = 0;
        return cc.tween(node)
            .to(option.dura, { opacity: option.targetAlpah, scale: option.targetScale }, { easing: ActionUtil.Easing.quarticActionInOut })
            .call(() => {
                if (option.callBack)
                    option.callBack();
            })
            .start();
    }

    public static RunHide(node: cc.Node, option?: HiddenType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.HideData, ...option };

        if (option.isScale) {
            return cc.tween(node)
                .to(option.dura, { scale: 0, opacity: 0 })
                .call(() => {
                    node.active = false;
                    if (option.callback) {
                        option.callback();
                    }
                })
                .start();
        } else {
            return cc.tween(node)
                .to(option.dura, { opacity: 0 })
                .call(() => {
                    node.active = false;
                    if (option.callback) {
                        option.callback();
                    }
                })
                .start();
        }
    }


    public static RunShowGoldEff(node: cc.Node, option: GoldEffectType): cc.Tween<cc.Node> {
        option = { ...ActionUtil.GoldEffectData, ...option };

        return cc.tween(node)
            .delay(option.dura)
            .call(() => {
                let obj = new cc.Node();
                obj.addComponent(cc.Sprite).spriteFrame = option.goldFrame[Math.floor(Math.random() * option.goldFrame.length)];
                node.addChild(obj)
                obj.opacity = 255;
                obj.position = node.convertToNodeSpaceAR(option.startNode.parent.convertToWorldSpaceAR(option.startNode.position));
                //obj.y += 100;

                let angle = (Math.random() * (option.maxAngle - option.minAngle) + option.minAngle) / 180 * Math.PI;
                let dir = cc.v3(Math.cos(angle), Math.sin(angle));
                cc.tween(obj)
                    .to(0.1, { opacity: 255 })
                    .start();
                cc.tween(obj)
                    .by(Math.random() * 0.1 + 0.1, { position: dir.mul(Math.random() * (option.maxDis - option.minDis) + option.minDis) })
                    .delay(Math.random() * 0.2 + 0.2)
                    .to(Math.random() * 0.2 + 0.2, { position: obj.parent.convertToNodeSpaceAR(option.targetNode.parent.convertToWorldSpaceAR(option.targetNode.position)) })
                    .to(0.2, { opacity: 0, scale: 2 })
                    .removeSelf()
                    .call(() => {
                        if (option.callback) {
                            option.callback();
                        }
                    })
                    .start();
            })
            .union()
            .repeat(option.goldNum)
            .start();
    }


    ///////////////multi obj Action//////////
    public static RunScaleMulti(runNode: cc.Node, nodes: cc.Node[], option?: ScaleType):cc.Tween<cc.Node> {
        option = { ...ActionUtil.ScaleData, ...option };

        if (!nodes || nodes.length == 0) {
            return ActionUtil.RunScale(runNode, option);
        } else {
            let index = 0;
            let loopNum = option.loop;
            option.loop = 2;
            if (loopNum <= 0) {
                return cc.tween(runNode)
                    .call(() => {
                        ActionUtil.RunScale(nodes[index], option);
                        index++;
                        if (index >= nodes.length) {
                            index = 0;
                        }
                    })
                    .delay(option.dura * 5)
                    .union()
                    .repeatForever()
                    .start();
            } else {
                return cc.tween(runNode)
                    .call(() => {
                        ActionUtil.RunScale(nodes[index], option);
                        index++;
                        if (index >= nodes.length) {
                            index = 0;
                        }
                    })
                    .delay(option.dura * 5)
                    .union()
                    .repeat(loopNum)
                    .start();
            }

        }
    }
    public static RunShowMulti(runNode: cc.Node, nodes: cc.Node[], option?: ShowType) {
    
        if (!nodes || nodes.length == 0) {
            return ActionUtil.RunShow(runNode, option);
        } else {
            option = { ...ActionUtil.ShowData, ...option };

            let index = 0;
            let callBack = option.callBack;
            option.callBack = null;
            return cc.tween(runNode)
                .call(() => {
                    ActionUtil.RunShow(nodes[index], option);
                    index++;
                    if (index >= nodes.length) {
                        index = 0;
                    }
                })
                .delay(option.dura * 0.4)
                .union()
                .repeat(nodes.length)
                .call(() => {
                    if (callBack)
                        callBack();
                })
                .start();
        }
    }
}



