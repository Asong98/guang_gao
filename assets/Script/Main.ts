// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioManager from "./Base/Components/AudioManager";
import GameData, { LevelType } from "./GameData";
import PoolManager from "./PoolManger";

const { ccclass, property } = cc._decorator;

const JIANTOU_POSITION = {
    0: cc.v2(27.234, 324.713),
    1: cc.v2(58.658, -90.082),
    2: cc.v2(-186.448, -33.518),
};

@ccclass
export default class MAin extends cc.Component {

    @property(cc.Button)
    btn_tong: cc.Button = null;

    @property(cc.Button)
    btn_chuang: cc.Button = null;

    @property(cc.Button)
    btn_deng: cc.Button = null;

    @property(cc.Node)
    jiantou: cc.Node = null;

    @property(cc.Node)
    bg_1: cc.Node = null;

    @property(cc.Node)
    bg_2: cc.Node = null;

    @property(cc.Node)
    fire: cc.Node = null;

    @property(cc.Node)
    xue: cc.Node = null;

    @property(cc.Prefab)
    dianji: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化游戏数据
        let btn_names = ["btn_tong", "btn_chuang", "btn_deng"]
        btn_names.forEach((name) => {
            let btn: cc.Node = cc.find("Layer_1/" + name, this.node)
            if (btn) {
                btn.on(cc.Node.EventType.TOUCH_END, this.onClickBtn, this)
            }
        })
        this.node.on(cc.Node.EventType.TOUCH_START, this.click, this) 
        this.refresh()
        PoolManager.getInstance().initPool("dianji", this.dianji, 5, this.node)
        
        // this.btn_tong.node.on(cc.Node.EventType.TOUCH_END, this.changeScene_tong, this)
        // this.btn_chuang.node.on(cc.Node.EventType.TOUCH_END, this.changeScene_chuang, this)
        // this.btn_deng.node.on(cc.Node.EventType.TOUCH_END, this.changeScene_deng, this) 
    }

    click(event: cc.Event.EventTouch) {
        AudioManager.play("点击2")
        
        console.log("点击了屏幕");
        console.log("点击位置:", event.getLocation());
        let node = PoolManager.getInstance().getNode("dianji", this.dianji, this.node)
        
        //将屏幕点击位置转换为节点位置的坐标系
         const localPos = this.node.convertToNodeSpaceAR(event.getLocation());
        node.setPosition(localPos)
        console.log("获取到的节点：" + node.name+"位置："+localPos);
        node.active = true
    }




    // 刷新关卡按钮状态
    refresh() {
        this.btn_tong.node.active = !GameData.getInstance().getFinishLevelType().includes(LevelType.tong)
        this.btn_chuang.node.active = !GameData.getInstance().getFinishLevelType().includes(LevelType.chuang)
        this.btn_deng.node.active = !GameData.getInstance().getFinishLevelType().includes(LevelType.deng)

        
        this.jiantou.active = GameData.getInstance().getStep() < 3
        if(this.jiantou.active){
            this.jiantou.setPosition(JIANTOU_POSITION[GameData.getInstance().getStep()])
        }
        if (GameData.getInstance().getStep() == 2) {
            this.jiantou.scaleX = -1;
        }

        this.bg_1.active = GameData.getInstance().getStep() < 2
        this.bg_2.active = GameData.getInstance().getStep() >= 2
        this.fire.active = GameData.getInstance().getStep() >= 2
        this.xue.active = GameData.getInstance().getStep() == 0

        console.log("当前步骤：" + GameData.getInstance().getStep());





        //判断屏幕是否被点击

    }

    start() {

    }

    onClickBtn(event: cc.Event.EventTouch) {
        let btn = event.target.getComponent(cc.Button).node.name
        console.log("点击了按钮：" + btn);
        switch (btn) {
            case "btn_chuang":
                // this.changeScene_tong()
                if (GameData.getInstance().getStep() == 0 || GameData.getInstance().getStep() == 3) {
                    GameData.getInstance().setCurrentLevelType(LevelType.chuang)
                    cc.director.loadScene("game");
                }
                break;
            case "btn_deng":
                // this.changeScene_chuang()
                if (GameData.getInstance().getStep() == 1 || GameData.getInstance().getStep() == 3) {
                    GameData.getInstance().setCurrentLevelType(LevelType.deng)
                    cc.director.loadScene("game");
                }
                break;
            case "btn_tong":
                // this.changeScene_deng()
                if (GameData.getInstance().getStep() == 2 || GameData.getInstance().getStep() == 3) {
                    GameData.getInstance().setCurrentLevelType(LevelType.tong)
                    cc.director.loadScene("game");
                }
                break;
        }

    }

    changeScene_tong() {
        console.log("选关tong");
        let levelType = GameData.getInstance().getFinishLevelType()
        if (levelType.length <= 3) {
            GameData.getInstance().setCurrentLevelType(LevelType.tong)
        }
        // GameData.Instance.setFinishLevelType(type);
        cc.director.loadScene("game");
    }

    changeScene_chuang() {
        console.log("选关chuang");
        let levelType = GameData.getInstance().getFinishLevelType()
        if (levelType.length <= 3) {
            GameData.getInstance().setCurrentLevelType(LevelType.chuang)
        }
        // GameData.Instance.setFinishLevelType(type);
        cc.director.loadScene("game");
    }

    changeScene_deng() {
        console.log("选关deng");
        let levelType = GameData.getInstance().getFinishLevelType()
        if (levelType.length <= 3) {
            GameData.getInstance().setCurrentLevelType(LevelType.deng)
        }
        // GameData.Instance.setFinishLevelType(type);
        cc.director.loadScene("game");
    }

    // update (dt) {}
}
