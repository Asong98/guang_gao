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



    // 棋盘尺寸 8x8
    public ROW: number = 3;
    public COL: number = 3;//横数
    public distance: number = 14;//方块间距
    public cellSize: number = 160;//方块大小
    public background: cc.Sprite = null!;//背景图片

    public isSwapping: boolean = false;//是否交换中

    public selectedNode: cc.Node = null!;//当前选中的方块

    /**
     * 关卡名称
     */
    private level: string = null!;

    set Level(value: string) {
        this.level = value;
    }
    get Level(): string {
        return this.level;
    }


    private grides: cc.Node[][] = [];//所有方块的节点数组



    start() {
        this.Level = LevelType.tong.toString();
        // this.Level = LevelType.chuang.toString();
        let dir = levelTypeDict[this.Level];
        // let pic=cc.loader.loadRes("qipan" + "/" + dir + '/' + "wp" + "_" + dir + "_" + 1, cc.SpriteFrame);


        // this.background = this.node.getChildByName('background').getComponent(cc.Sprite);
        if(this.Level == LevelType.tong.toString()){
            this.ROW = 3;
            this.COL = 4;
            this.distance = 16;
            this.board.setPosition(cc.v2(this.board.position.x, this.board.position.y));
        }

        this.initBoard();
    }





    async initBoard() {
        const loadPromises: Promise<void>[] = [];
        for (let i = 0; i < this.ROW; i++) {
            this.grides[i] = []
            for (let j = 0; j < this.COL; j++) {
                const item = cc.instantiate(this.itemPrefab)
                item.parent = this.board;
                item.setPosition(cc.v2(i * this.cellSize + i * this.distance, -(j * this.cellSize + j * this.distance)))

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

        if (this.checkAllMatches()) {
            console.log("有可消除方块 重新生成");
            // 清除所有方块
            this.board.removeAllChildren();
            this.grides = [];
            await this.initBoard();
        }
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
        this.isSwapping = true;
        let tempPos = a.position.clone();
        a.setPosition(b.position);
        b.setPosition(tempPos);

        // 更新数组索引
        let aIdx = this.getIndexByNode(a);
        let bIdx = this.getIndexByNode(b);
        [this.grides[aIdx.i][aIdx.j], this.grides[bIdx.i][bIdx.j]] =
            [this.grides[bIdx.i][bIdx.j], this.grides[aIdx.i][aIdx.j]];

        // 检查是否形成三连
        let hasMatch = this.checkAllMatches();
        if (!hasMatch) {
            // 无三连，交换回去
            console.log("无三连，交换回去")
            b.setPosition(a.position);
            a.setPosition(tempPos);

            [this.grides[aIdx.i][aIdx.j], this.grides[bIdx.i][bIdx.j]] =
                [this.grides[bIdx.i][bIdx.j], this.grides[aIdx.i][aIdx.j]];
        } else {
            // 有三连，执行消除
            await this.destroyMatches();
        }

        this.isSwapping = false;
    }

    destroyMatches() {
        console.log("有三连，执行消除三连")
    }

    checkAllMatches(): boolean {
        let matched = false;
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                let type = this.getItemType(this.grides[i][j]);
                console.log("type", type, i, j)
                // 横向三连
                if (j < this.COL - 2 &&
                    type === this.getItemType(this.grides[i][j + 1]) &&
                    type === this.getItemType(this.grides[i][j + 2])) {
                    console.log("type", type, "横向三连", i, j)
                    matched = true;
                }
                // 纵向三连
                if (i < this.ROW - 2 &&
                    type === this.getItemType(this.grides[i + 1][j]) &&
                    type === this.getItemType(this.grides[i + 2][j])) {
                    console.log("type", type, "纵向三连", i, j)
                    matched = true;
                }
            }
        }
        return matched;
    }

    getItemType(node: cc.Node): number {
        return Number(node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame.name.split('_').slice(-1));
    }

}
