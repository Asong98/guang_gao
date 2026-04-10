// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CanvasVideoPlayer {

    private static _isPause = false;
    public static __VIDEOLOAD__ = 0

    public static pause() {
        if (this._isPause == false) {
            cc.director.emit('visibleChange');
        }
        this._isPause = true;
    }
    public static resume() {
        if (this._isPause == true) {
            cc.director.emit('visibleChange');
        }
        this._isPause = false;
    }
    public static IsPause() {
        return this._isPause;
    }
}
window['CanvasVideoPlayer'] = CanvasVideoPlayer
