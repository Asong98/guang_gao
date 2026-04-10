// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameData extends cc.Component {

    private level :string =null!;
    set Level(value: string) {
        this.level = value;
    }
    get Level() {
        return this.level;
    }

    onLoad () {
        // 常驻节点 , 不随场景切换而销毁
        cc.game.addPersistRootNode(this.node);  
    }

    start () {

    }

    public changeScene() {
        cc.director.loadScene("game");
    }

    // update (dt) {}
}
