// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameData, { LevelType, levelTypeDict } from "./GameData";
import Audio from "./Audio";

const { ccclass, property } = cc._decorator;

enum ItemType {
    None = 1,
    Wall = 2,
    Player = 3,
    Enemy = 4,
}

/**
 * 方块类型字典
 */
const itemTypeDict = {
    [ItemType.None]: 'None',
    [ItemType.Wall]: 'Wall',
    [ItemType.Player]: 'Player',
    [ItemType.Enemy]: 'Enemy',
}






@ccclass
export default class Game extends cc.Component {

    /**
     * 单例 GameManager
     */
    public static instance: Game = null!;
    public static get GameInstance(): Game {
        return Game.instance;
    }


    @property(cc.Node)
    board: cc.Node = null!; // 棋盘父节点

    @property(cc.Sprite)
    sprites: cc.Sprite[] = []; // 方块素材

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null!; // 方块预制体

    @property(cc.ProgressBar)
    timeProgressBar: cc.ProgressBar = null!; // 倒计时进度条

    @property(Number)
    private timeLeft: number = 10; // 初始倒计时时间（秒）

    @property(cc.Node)
    private Bg: cc.Node = null!; // 场景背景图片

    @property(cc.Node)
    private qipan: cc.Node = null!; // 棋盘图片

    @property(cc.Node)
    private gift: cc.Node = null!; // 礼物图片

    @property(cc.Node)
    private faiil: cc.Node = null!; // 失败图片

    // 棋盘尺寸 8x8
    public ROW: number = 3;
    public COL: number = 3;//横数
    public distance: number = 14;//方块间距
    public cellSize: number = 160;//方块大小

    // public background: cc.Sprite = null!;//场景背景图片

    // public qipan: cc.Sprite = null!;//棋盘图片

    public isGameEnd: boolean = false;//是否游戏结束

    public isSwapping: boolean = false;//是否交换中

    public selectedNode: cc.Node = null!;//当前选中的方块

    public DestroyItem: cc.Node[] = [];//要消除的方块数组

    private grides: cc.Node[][] = [];//所有方块的节点数组

    // 倒计时相关
    private countdownTimer: number = 0; // 倒计时定时器

    //危险时间
    private dangerTime: number = 3;//危险时间（秒）
    private isDanger: boolean = false;//危险时间定时器


    /**
     * 关卡名称
     */
    private Level: LevelType = null!;//当前关卡(数字)

    onLoad() {
        // this.Level = GameData.getInstance().getCurrentLevelType();
        let item = this.gift.getChildByName("background");
        item.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene("Main");
        })
        this.faiil.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene("Main");
        })
    }



    start() {
        // 初始化单例
        // Game.instance = this;

        this.Level = GameData.getInstance().getCurrentLevelType();

        console.log("当前关卡：***********" + this.Level);

        // this.Level = this.Level;
        this.changpPic(this.Level);
        // let pic=cc.loader.loadRes("qipan" + "/" + dir + '/' + "wp" + "_" + dir + "_" + 1, cc.SpriteFrame);

        this.board.setPosition(-160, -210);
        // this.background = this.node.getChildByName('background').getComponent(cc.Sprite);
        if (this.Level == LevelType.tong.toString()) {
            this.ROW = 3;
            this.COL = 4;
            this.distance = 16;
            this.board.setPosition(-160, -390);
        }

        // 初始化倒计时
        this.initCountdown();
        // 初始化棋盘
        this.initBoard();
    }

    changpPic(level: string) {

        this.Bg.getChildByName('bg_chuang').active = LevelType.chuang.toString() == level;
        this.Bg.getChildByName('bg_deng').active = LevelType.deng.toString() == level;
        this.Bg.getChildByName('bg_tong').active = LevelType.tong.toString() == level;

        this.qipan.getChildByName('chuang').active = LevelType.chuang.toString() == level;
        this.qipan.getChildByName('deng').active = LevelType.deng.toString() == level;
        this.qipan.getChildByName('tong').active = LevelType.tong.toString() == level;

    }

    // 初始化倒计时
    initCountdown() {
        this.updateTimeLabel();
        // 启动倒计时定时器
        this.countdownTimer = setInterval(() => {
            this.timeLeft = this.timeLeft - 0.1;
            this.updateTimeLabel();
            // 危险时间
            if (this.timeLeft == this.dangerTime) {
                this.isDanger = true;


            }
            if (this.timeLeft <= 0) {
                this.onTimeUp();
            }
        }, 100);
    }

    // 更新倒计时标签
    updateTimeLabel() {
        if (this.timeProgressBar) {
            this.timeProgressBar.progress = this.timeLeft / 10;
        }
    }

    // 时间到处理
    onTimeUp() {
        clearInterval(this.countdownTimer);
        Audio.getInstance().playSFX("倒计时")
        console.log("时间到！游戏结束");
        //
        // 这里可以添加游戏结束逻辑
        this.faiil.active = true
        // this.gift.active = false
    }

    // 停止倒计时
    stopCountdown() {
        clearInterval(this.countdownTimer);
    }




    // 初始化棋盘
    async initBoard() {
        this.board.removeAllChildren();
        const loadPromises: Promise<void>[] = [];
        for (let i = 0; i < this.ROW; i++) {
            this.grides[i] = []
            for (let j = 0; j < this.COL; j++) {
                const item = cc.instantiate(this.itemPrefab)
                item.parent = this.board;
                item.setPosition(cc.v2(i * this.cellSize + i * this.distance, j * this.cellSize + j * this.distance))

                this.grides[i][j] = item;
                // 获取1到4之间的随机整数
                let randomType = Math.floor(Math.random() * 4) + 1;
                loadPromises.push(this.setItemType(i, j, randomType));
                item.on(cc.Node.EventType.TOUCH_END, () => this.onItemClick(item));
                // this.sprites.push(item.getComponent(cc.Sprite))
                // item.getComponent(cc.Sprite).spriteFrame = this.sprites[i*this.COL+j].spriteFrame
            }
        }

        // 等待所有图片加载完成
        await Promise.all(loadPromises);

        // 检查是否有可消除方块
        const hasMatches = this.checkAllMatches();
        if (hasMatches) {
            console.log("有可消除方块的可能性，消除三连");
            // 清除所有方块
            this.board.removeAllChildren();
            this.grides = [];
            await this.initBoard();
        } else {
            // 检查是否存在可消除的可能性
            if (!this.hasPossibleMatches()) {
                console.log("无可能消除的方块 重新生成");
                // 清除所有方块
                this.board.removeAllChildren();
                this.grides = [];
                await this.initBoard();
            }
        }
    }

    // 检测是否存在可消除的可能性
    hasPossibleMatches(): boolean {
        // 遍历所有相邻的方块对
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                // 尝试与右侧方块交换
                if (j < this.COL - 1) {
                    // 交换方块
                    [this.grides[i][j], this.grides[i][j + 1]] = [this.grides[i][j + 1], this.grides[i][j]];
                    // 检查交换后是否有三连
                    if (this.checkAllMatches()) {
                        // 恢复交换
                        [this.grides[i][j], this.grides[i][j + 1]] = [this.grides[i][j + 1], this.grides[i][j]];
                        return true;
                    }
                    // 恢复交换
                    [this.grides[i][j], this.grides[i][j + 1]] = [this.grides[i][j + 1], this.grides[i][j]];
                }

                // 尝试与下方方块交换
                if (i < this.ROW - 1) {
                    // 交换方块
                    [this.grides[i][j], this.grides[i + 1][j]] = [this.grides[i + 1][j], this.grides[i][j]];
                    // 检查交换后是否有三连
                    if (this.checkAllMatches()) {
                        // 恢复交换
                        [this.grides[i][j], this.grides[i + 1][j]] = [this.grides[i + 1][j], this.grides[i][j]];
                        return true;
                    }
                    // 恢复交换
                    [this.grides[i][j], this.grides[i + 1][j]] = [this.grides[i + 1][j], this.grides[i][j]];
                }
            }
        }
        return false;
    }

    async setItemType(x: number, y: number, type: number): Promise<void> {
        return new Promise((resolve, reject) => {
            let dir = levelTypeDict[this.Level].toString();
            if (!dir) {
                resolve();
                return;
            }
            cc.loader.loadRes("qipan" + "/" + dir + '/' + "wp" + "_" + dir + "_" + type.toString(), cc.SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(err);
                    resolve();
                    return;
                }
                this.grides[x][y].getChildByName('icon').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                resolve();
            });
        });
    }

    // 2. 点击方块
    onItemClick(item: cc.Node) {

        console.log("点击了方块", item)
        if (this.isSwapping) return;

        if (!this.selectedNode) {
            // 选中第一个
            this.selectedNode = item;


        } else {
            // 选中第二个，判断是否相邻
            if (this.isAdjacent(this.selectedNode, item)) {
                this.swapItem(this.selectedNode, item);

                this.selectedNode = null;

            } else {
                // 重新选择
                // this.selectedNode.color = Color.WHITE;
                this.selectedNode = item;

            }
        }
    }

    //判断是否相邻
    isAdjacent(a: cc.Node, b: cc.Node) {
        let aIdx = this.getIndexByNode(a);
        let bIdx = this.getIndexByNode(b);
        let dx = Math.abs(aIdx.i - bIdx.i);
        let dy = Math.abs(aIdx.j - bIdx.j);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    getIndexByNode(node: cc.Node): { i: number, j: number } {
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (this.grides[i][j] === node) return { i, j };
            }
        }
        return { i: -1, j: -1 };
    }

    async swapItem(a: cc.Node, b: cc.Node) {
        return new Promise<void>((resolve) => {
            this.isSwapping = true;
            let tempPos = a.position.clone();
            let aPos = a.position;
            let bPos = b.position;
            Audio.getInstance().playSFX("嗖")
            // 使用动作系统交换位置
            cc.tween(a)
                .to(0.3, { position: bPos }, { easing: 'quadOut' })
                .start();

            cc.tween(b)
                .to(0.3, { position: aPos }, { easing: 'quadOut' })
                .call(() => {
                    // 动画完成后更新数组索引
                    let aIdx = this.getIndexByNode(a);
                    let bIdx = this.getIndexByNode(b);
                    [this.grides[aIdx.i][aIdx.j], this.grides[bIdx.i][bIdx.j]] =
                        [this.grides[bIdx.i][bIdx.j], this.grides[aIdx.i][aIdx.j]];

                    // 检查是否形成三连
                    let hasMatch = this.checkAllMatches();
                    if (!hasMatch) {
                        // 无三连，交换回去
                        console.log("无三连，交换回去");
                        Audio.getInstance().playSFX("错误")

                        cc.tween(a)
                            .to(0.3, { position: aPos }, { easing: 'quadOut' })
                            .start();

                        cc.tween(b)
                            .to(0.3, { position: bPos }, { easing: 'quadOut' })
                            .call(() => {
                                // 动画完成后恢复数组索引
                                [this.grides[aIdx.i][aIdx.j], this.grides[bIdx.i][bIdx.j]] =
                                    [this.grides[bIdx.i][bIdx.j], this.grides[aIdx.i][aIdx.j]];

                                this.isSwapping = false;
                                resolve();
                            })
                            .start();
                    } else {
                        // 有三连，执行消除

                        this.destroyMatches().then(() => {
                            this.isSwapping = false;
                            resolve();
                        });
                    }
                })
                .start();
        });
    }

    async destroyMatches(): Promise<void> {
        cc.director.preloadScene("Main");
        console.log("有三连，执行消除三连");
        // 这里可以添加消除动画和逻辑
        for (let item of this.DestroyItem) {
            // if (this.getItemType(item) == 1) {
            //     //需要先完成填充逻辑，再消除
            //     continue;
            // }
            item.removeFromParent();
            item.destroy();
        }

        Audio.getInstance().playSFX("合成")
        this.gift.getChildByName("tong").active = LevelType.tong.toString() == this.Level;
        this.gift.getChildByName("deng").active = LevelType.deng.toString() == this.Level;
        this.gift.getChildByName("chuang").active = LevelType.chuang.toString() == this.Level;
        this.gift.getChildByName("background").active = true;

        GameData.getInstance().addStep();
        GameData.getInstance().setFinishLevelType(this.Level);
        //停止倒计时
        this.stopCountdown();





        // await this.waitTime(0.2);
        // await this.dropDownItems(); // 方块下落
        // await this.fillEmpty();    // 填充新方块
        // await this.waitTime(0.1);
        return Promise.resolve();
    }


    /*
        * 检查交换后是否有三连
    **/
    checkAllMatches(): boolean {
        // 清空要消除的方块数组
        this.DestroyItem = [];
        let matched = false;
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                let type = this.getItemType(this.grides[i][j]);
                // console.log("type", type, i, j)
                // 横向三连
                if (j < this.COL - 2 &&
                    type === this.getItemType(this.grides[i][j + 1]) &&
                    type === this.getItemType(this.grides[i][j + 2])) {
                    console.log("type", type, "横向三连", i, j)
                    this.DestroyItem.push(this.grides[i][j], this.grides[i][j + 1], this.grides[i][j + 2]);
                    matched = true;
                }
                // 纵向三连
                if (i < this.ROW - 2 &&
                    type === this.getItemType(this.grides[i + 1][j]) &&
                    type === this.getItemType(this.grides[i + 2][j])) {
                    // console.log("type", type, "纵向三连", i, j)
                    this.DestroyItem.push(this.grides[i][j], this.grides[i + 1][j], this.grides[i + 2][j]);
                    matched = true;
                }
            }
        }
        return matched;
    }

    // 8. 方块下落（暂未实现）
    async dropDownItems() {
        for (let col = 0; col < this.COL; col++) {
            let emptyRows = [];

            // 从下往上收集空位
            for (let row = this.ROW - 1; row >= 0; row--) {
                if (!this.grides[row][col] || !this.grides[row][col].isValid) {
                    emptyRows.push(row);
                } else if (emptyRows.length > 0) {
                    // 将有效方块下移到最底部的空位
                    let targetRow = emptyRows.shift();
                    this.moveNodeToPosition(row, col, targetRow, col);
                    emptyRows.push(row);
                }
            }
        }
        await this.waitTime(0.3);
    }

    moveNodeToPosition(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        let node = this.grides[fromRow][fromCol];
        this.grides[toRow][toCol] = node;
        this.grides[fromRow][fromCol] = null;

        // 移动节点位置
        cc.tween(node)
            .to(0.2, { position: this.getPosByIndex(toRow, toCol) }, { easing: 'quadOut' })
            .start();
    }

    // 7. 顶部填充新方块（暂未实现）
    async fillEmpty() {
        for (let col = 0; col < this.COL; col++) {
            for (let row = 0; row < this.ROW; row++) {
                if (!this.grides[row][col] || !this.grides[row][col].isValid) {
                    // 创建新方块
                    let item = cc.instantiate(this.itemPrefab);
                    item.parent = this.board;
                    item.setPosition(this.getPosByIndex(row, col));

                    let randomType = Math.floor(Math.random() * 4) + 1;
                    await this.setItemType(row, col, randomType);

                    this.grides[row][col] = item;

                    // 添加点击事件
                    item.on(cc.Node.EventType.TOUCH_END, () => this.onItemClick(item));
                }
            }
        }
        await this.waitTime(0.1);
    }

    getPosByIndex(i: number, j: number): cc.Vec3 {
        let startX = -(this.COL - 1) * (this.cellSize + this.distance) / 2;
        let startY = (this.ROW - 1) * (this.cellSize + this.distance) / 2;

        return new cc.Vec3(
            startX + j * (this.cellSize + this.distance),
            startY - i * (this.cellSize + this.distance),
            0
        );
    }

    waitTime(sec: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }


    getItemType(node: cc.Node): number {
        return Number(node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame.name.split('_').slice(-1));
    }

}
