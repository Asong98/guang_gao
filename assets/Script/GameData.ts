// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum LevelType {
    chuang = "1",
    deng = "2",
    tong = "3",
}

@ccclass
export default class GameData extends cc.Component {

    // 单例模式
    private static _instance: GameData = null!;
    public static getInstance() {
        if (this._instance == null) {
            this._instance = new GameData();
        }
        return this._instance;
    }


    private level :string =null!;
    set Level(value: string) {
        this.level = value;
    }
    get Level() {
        return this.level;
    }

    //已通关的关卡
    private finishLevelType: LevelType[] = [LevelType.tong];
    public getFinishLevelType() {
        return this.finishLevelType;
    }
    public setFinishLevelType(value: LevelType) {
        this.finishLevelType.push(value);
    }

    //当前关卡(字符串)
    private currentLevelType: string = '';
    public getCurrentLevelType() {
        return this.currentLevelType;
    }
    public setCurrentLevelType(value: string) {
        this.currentLevelType = value;
    }


    // onLoad () {
    //     // 常驻节点 , 不随场景切换而销毁
    //     cc.game.addPersistRootNode(this.node);  
    //     // 预加载所有资源
    //     cc.director.preloadScene("Main");
    //     cc.director.preloadScene("game");
    // }



}
