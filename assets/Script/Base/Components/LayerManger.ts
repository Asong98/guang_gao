
import CpSDK from "../CpSDK";
import Util from "../Util";
import { BaseComponent } from "../Base";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LayerManger extends cc.Component {

    private _version = '2.3.0';

    private _resizeCallFunc: Array<Function> = [];

    public static Instance: LayerManger = null;

    private _isVisiable = true;

    protected onLoad() {
        LayerManger.Instance = this;
        Util.Log('工程版本：' + this._version);
        Util.Log('SDK版本：' + CpSDK._Version);

        // let _collisionManager = cc.director.getCollisionManager();
        // if (!_collisionManager) return;
        // _collisionManager.enabled = collisionManagerSwitch;
        // _collisionManager.enabledDebugDraw = DebugDrawSwitch;
        // _collisionManager.enabledDrawBoundingBox = DrawBoundingBoxSwitch;

        cc.view.setResizeCallback(() => {
            this._resizeCallFunc.forEach((element) => {
                element();
            });
        });

        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHidden, this);
        cc.macro.ENABLE_MULTI_TOUCH=false;
    }

    public GetLayer<T extends BaseComponent>(type: { prototype: T }): T {
        return this.node.getComponentInChildren<T>(type);
    }
    public GetStageW(): number {
        return cc.view.getVisibleSize().width;
    }
    public GetStageH(): number {
        return cc.view.getVisibleSize().height;
    }

    public AddResizeCallback(func: Function) {
        this._resizeCallFunc.push(func);
    }
    public RemoveResizeCallback(callback: Function) {
        Util.removeItem(this._resizeCallFunc, callback);
    }

    public isVisiable(): boolean {
        return this._isVisiable;
    }

    public onShow() {
        this._isVisiable=true;
        cc.game.emit("stageVisibilityChange");
    }
    public onHidden() {
        this._isVisiable=false;
        cc.game.emit("stageVisibilityChange");
    }

    // update (dt) {}

}

