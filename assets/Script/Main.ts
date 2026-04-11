// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameData, { LevelType } from "./GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MAin extends cc.Component {

    @property(cc.Button)
    btn_tong: cc.Button = null;

    @property(cc.Button)
    btn_chuang: cc.Button = null;

    @property(cc.Button)
    btn_deng : cc.Button = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化游戏数据
        
        this.btn_tong.node.on(cc.Node.EventType.TOUCH_END, this.changeScene_tong, this)
        this.btn_chuang.node.on(cc.Node.EventType.TOUCH_END, this.changeScene_chuang, this)
        this.btn_deng.node.on(cc.Node.EventType.TOUCH_END, this.changeScene_deng, this)
    }
    
 // 刷新关卡按钮状态
    refresh() {
        // this.btn_tong.node.active = !GameData.Instance.getFinishLevelType().includes(LevelType.tong)
        // this.btn_chuang.node.active = !GameData.Instance.getFinishLevelType().includes(LevelType.chuang)
        // this.btn_deng.node.active = !GameData.Instance.getFinishLevelType().includes(LevelType.deng)   
    }

    start() {
        this.refresh()
    }

    changeScene_tong() {
        console.log("选关tong");
        let levelType = GameData.getInstance().getFinishLevelType()
        if(levelType.length <= 3){
            GameData.getInstance().setCurrentLevelType(LevelType.tong.toString())
        }
        // GameData.Instance.setFinishLevelType(type);
        cc.director.loadScene("game");
    }

    changeScene_chuang() {
        console.log("选关chuang");
        let levelType = GameData.getInstance().getFinishLevelType()
        if(levelType.length <= 3){
            GameData.getInstance().setCurrentLevelType(LevelType.chuang.toString())
        }
        // GameData.Instance.setFinishLevelType(type);
        cc.director.loadScene("game");
    }
    
    changeScene_deng() {
        console.log("选关deng");
        let levelType = GameData.getInstance().getFinishLevelType()
        if(levelType.length <= 3){
            GameData.getInstance().setCurrentLevelType(LevelType.deng.toString())
        }
        // GameData.Instance.setFinishLevelType(type);
        cc.director.loadScene("game");
    }
        
    // update (dt) {}
}
