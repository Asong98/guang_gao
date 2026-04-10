const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('通用组件/ConterLabel(数字逐步增加)')
export default class CounterLabel extends cc.Label {

    @property({ tooltip: '保持数值为几位小数' })
    public points: number = 0;

    private _value: number = 0;

    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
        this.string = value.toFixed(this.points);
    }

    private _act: cc.Tween<CounterLabel> = null;
    protected onLoad() {
       
    }

    /**
     * 滚动数值
     * @param target 目标值
     * @param time 时间
     * @param callback 完成回调
     */
    public to(target: number, dura: number = 0.3, callback?: Function) {
        if (this._act != null) {
            this._act.stop();
            this._act = null;
        }
        this._act = cc.tween<CounterLabel>(this)
            .to(dura, { value: target })
            .call(() => {
                callback && callback();
                this._act = null;
            })
            .start();
    }

    /**
     * 相对滚动数值
     * @param diff 差值
     * @param time 时间
     * @param callback 完成回调
     */
    public by(diff: number, dura: number = 0.3, callback?: Function) {
        if (this._act != null) {
            this._act.stop();
            this._act = null;
        }
        this._act = cc.tween<CounterLabel>(this)
            .by(dura, { value: diff })
            .call(() => {
                callback && callback();
                this._act = null;
            })
            .start();
    }

}
