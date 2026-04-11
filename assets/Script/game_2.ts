// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

enum LevelType {
    chuang = 1,
    deng = 2,
    tong = 3,
}
const levelTypeDict = {
    [LevelType.chuang]: 'chuang',
    [LevelType.deng]: 'deng',
    [LevelType.tong]: 'tong',
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

    // 棋盘尺寸 行x列（ROW=行，COL=列）
    public ROW: number = 3;
    public COL: number = 3;//列数（横向）
    public distance: number = 14;//方块间距
    public cellSize: number = 160;//方块大小

    public isGameEnd: boolean = false;//是否游戏结束
    public isSwapping: boolean = false;//是否交换中
    public selectedNode: cc.Node = null!;//当前选中的方块
    public DestroyItem: cc.Node[] = [];//要消除的方块数组
    private grides: cc.Node[][] = [];//所有方块的节点数组 [行][列]
    private countdownTimer: number = 0; // 倒计时定时器
    private level: string = null!; // 关卡名称

    set Level(value: string) {
        this.level = value;
    }
    get Level(): string {
        return this.level;
    }

    start() {
        // 初始化单例
        Game.instance = this;

        this.Level = LevelType.deng.toString();
        this.changpPic(this.Level);

        if (this.Level == LevelType.tong.toString()) {
            this.ROW = 3;
            this.COL = 4;
            this.distance = 16;
            this.board.setPosition(cc.v2(this.board.position.x, this.board.position.y));
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
        console.log("时间到！游戏结束");
    }

    // 停止倒计时
    stopCountdown() {
        clearInterval(this.countdownTimer);
    }

    async initBoard() {
        const loadPromises: Promise<void>[] = [];
        // 清空棋盘
        this.board.removeAllChildren();
        this.grides = [];

        // 初始化棋盘数组 [行][列]
        for (let i = 0; i < this.ROW; i++) {
            this.grides[i] = [];
            for (let j = 0; j < this.COL; j++) {
                const item = cc.instantiate(this.itemPrefab);
                item.parent = this.board;
                // 修复：使用getPosByIndex统一坐标计算，保证初始化和下落坐标体系一致
                item.setPosition(this.getPosByIndex(i, j));

                this.grides[i][j] = item;
                // 获取1到4之间的随机整数
                let randomType = Math.floor(Math.random() * 4) + 1;
                loadPromises.push(this.setItemType(i, j, randomType));
                item.on(cc.Node.EventType.TOUCH_END, () => this.onItemClick(item));
            }
        }

        // 等待所有图片加载完成
        await Promise.all(loadPromises);

        // 检查是否有可消除方块
        const hasMatches = this.checkAllMatches();
        if (hasMatches) {
            console.log("有可消除方块的可能性，重新生成");
            await this.initBoard();
        } else {
            // 检查是否存在可消除的可能性
            if (!this.hasPossibleMatches()) {
                console.log("无可能消除的方块 重新生成");
                await this.initBoard();
            }
        }
    }

    // 检测是否存在可消除的可能性
    hasPossibleMatches(): boolean {
        // 遍历所有相邻的方块对
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                // 尝试与右侧方块交换（同行了，列+1）
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

                // 尝试与下方方块交换（列相同，行+1）
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
            let dir = levelTypeDict[this.Level];
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

    // 点击方块
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
                this.selectedNode = item;
            }
        }
    }

    //判断是否相邻
    isAdjacent(a: cc.Node, b: cc.Node) {
        let aIdx = this.getIndexByNode(a);
        let bIdx = this.getIndexByNode(b);
        // 相邻判断：行差1且列相同，或列差1且行相同
        let dx = Math.abs(aIdx.i - bIdx.i);
        let dy = Math.abs(aIdx.j - bIdx.j);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    // 根据节点获取行列索引 [行i][列j]
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
            let aIdx = this.getIndexByNode(a);
            let bIdx = this.getIndexByNode(b);
            let aPos = a.position.clone();
            let bPos = b.position.clone();

            // 使用动作系统交换位置
            cc.tween(a)
                .to(0.3, { position: bPos }, { easing: 'quadOut' })
                .start();

            cc.tween(b)
                .to(0.3, { position: aPos }, { easing: 'quadOut' })
                .call(async () => {
                    // 动画完成后更新数组索引
                    [this.grides[aIdx.i][aIdx.j], this.grides[bIdx.i][bIdx.j]] =
                        [this.grides[bIdx.i][bIdx.j], this.grides[aIdx.i][aIdx.j]];

                    // 检查是否形成三连
                    let hasMatch = this.checkAllMatches();
                    if (!hasMatch) {
                        // 无三连，交换回去
                        console.log("无三连，交换回去");

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
                        await this.destroyMatches();
                        this.isSwapping = false;
                        resolve();
                    }
                })
                .start();
        });
    }

    async destroyMatches(): Promise<void> {
        console.log("有三连，执行消除三连");
        // 收集要消除的唯一方块（避免重复）
        const uniqueDestroyItems = Array.from(new Set(this.DestroyItem));
        // 移除并销毁方块
        for (let item of uniqueDestroyItems) {
            if (item && item.isValid) {
                let idx = this.getIndexByNode(item);
                // 清空数组中对应的位置
                this.grides[idx.i][idx.j] = null;
                item.removeFromParent();
                item.destroy();
            }
        }
        this.DestroyItem = []; // 清空消除数组

        await this.dropDownItems(); // 方块下落
        await this.fillEmpty();    // 填充新方块

        // 检查下落填充后是否有新的三连（连锁消除）
        const newMatches = this.checkAllMatches();
        if (newMatches) {
            await this.destroyMatches();
        }
    }

    /*
        * 检查交换后是否有三连
    **/
    checkAllMatches(): boolean {
        // 清空要消除的方块数组
        this.DestroyItem = [];
        let matched = false;
        // 横向三连检查（行不变，列递增）
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL - 2; j++) {
                const current = this.grides[i][j];
                const next1 = this.grides[i][j + 1];
                const next2 = this.grides[i][j + 2];
                if (!current || !next1 || !next2) continue;

                const type1 = this.getItemType(current);
                const type2 = this.getItemType(next1);
                const type3 = this.getItemType(next2);

                if (type1 === type2 && type2 === type3) {
                    console.log("横向三连", i, j);
                    this.DestroyItem.push(current, next1, next2);
                    matched = true;
                }
            }
        }

        // 纵向三连检查（列不变，行递增）
        for (let j = 0; j < this.COL; j++) {
            for (let i = 0; i < this.ROW - 2; i++) {
                const current = this.grides[i][j];
                const next1 = this.grides[i + 1][j];
                const next2 = this.grides[i + 2][j];
                if (!current || !next1 || !next2) continue;

                const type1 = this.getItemType(current);
                const type2 = this.getItemType(next1);
                const type3 = this.getItemType(next2);

                if (type1 === type2 && type2 === type3) {
                    console.log("纵向三连", i, j);
                    this.DestroyItem.push(current, next1, next2);
                    matched = true;
                }
            }
        }
        return matched;
    }

    // 方块下落核心逻辑（修复版）
    async dropDownItems() {
        // 按列遍历，每一列单独处理下落
        for (let j = 0; j < this.COL; j++) {
            // 收集当前列的有效方块（未被消除的）
            const validItems: cc.Node[] = [];
            for (let i = 0; i < this.ROW; i++) {
                if (this.grides[i][j] && this.grides[i][j].isValid) {
                    validItems.push(this.grides[i][j]);
                }
            }

            // 重新填充当前列：先填充有效方块，再留空
            for (let i = 0; i < this.ROW; i++) {
                if (i < validItems.length) {
                    this.grides[i][j] = validItems[i];
                    // 移动方块到目标位置（下落动画）
                    this.moveNodeToPosition(this.getIndexByNode(validItems[i]).i, j, i, j);
                } else {
                    this.grides[i][j] = null; // 空位置
                }
            }
        }
        await this.waitTime(0.3); // 等待下落动画完成
    }

    // 移动节点到目标位置并更新数组
    moveNodeToPosition(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        let node = this.grides[fromRow][fromCol];
        if (!node) return;

        // 更新数组索引
        this.grides[toRow][toCol] = node;
        this.grides[fromRow][fromCol] = null;

        // 移动节点位置（动画）
        cc.tween(node)
            .to(0.2, { position: this.getPosByIndex(toRow, toCol) }, { easing: 'quadOut' })
            .start();
    }

    // 顶部填充新方块（修复版）
    async fillEmpty() {
        const loadPromises: Promise<void>[] = [];
        // 遍历所有空位，填充新方块
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (!this.grides[i][j] || !this.grides[i][j].isValid) {
                    // 创建新方块
                    let item = cc.instantiate(this.itemPrefab);
                    item.parent = this.board;
                    // 初始位置在棋盘顶部（视觉效果更好）
                    item.setPosition(this.getPosByIndex(-1, j)); // 先放在行-1的位置
                    // 随机类型
                    let randomType = Math.floor(Math.random() * 4) + 1;
                    // 加载图片并设置类型
                    loadPromises.push(new Promise((resolve) => {
                        let dir = levelTypeDict[this.Level];
                        cc.loader.loadRes(`qipan/${dir}/wp_${dir}_${randomType}`, cc.SpriteFrame, (err, spriteFrame) => {
                            if (err) console.error(err);
                            item.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                            // 移动到目标位置（下落动画）
                            cc.tween(item)
                                .to(0.2, { position: this.getPosByIndex(i, j) }, { easing: 'quadOut' })
                                .start();
                            this.grides[i][j] = item;
                            // 添加点击事件
                            item.on(cc.Node.EventType.TOUCH_END, () => this.onItemClick(item));
                            resolve();
                        });
                    }));
                }
            }
        }
        await Promise.all(loadPromises);
        await this.waitTime(0.1);
    }

    // 统一坐标计算方法（行i，列j）
    getPosByIndex(i: number, j: number): cc.Vec3 {
        // 棋盘居中计算：起始X/Y基于棋盘尺寸
        const totalWidth = (this.COL - 1) * (this.cellSize + this.distance);
        const totalHeight = (this.ROW - 1) * (this.cellSize + this.distance);
        const startX = -totalWidth / 2; // 棋盘左边界
        const startY = totalHeight / 2; // 棋盘上边界

        // 计算当前方块的坐标：列j对应X轴，行i对应Y轴（Y轴向下递减）
        const x = startX + j * (this.cellSize + this.distance);
        const y = startY - i * (this.cellSize + this.distance);
        return new cc.Vec3(x, y, 0);
    }

    // 等待指定时间（秒）
    waitTime(sec: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }

    // 获取方块类型（从spriteFrame名称解析）
    getItemType(node: cc.Node): number {
        if (!node || !node.getChildByName('icon')) return -1;
        const spriteFrame = node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
        if (!spriteFrame || !spriteFrame.name) return -1;
        return Number(spriteFrame.name.split('_').pop() || -1);
    }
}