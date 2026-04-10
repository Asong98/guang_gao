
    const { ccclass, property } = cc._decorator;
    @ccclass
    export abstract class ActionBase extends cc.Component {
        @property
        delay: number = 0;
    
        protected _act: cc.Tween<cc.Node> = null;
    
        public Stop() {
            if (this._act) {
                this._act.stop();
                this._act = null;
            }
        }
    }
    


