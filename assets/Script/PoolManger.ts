// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolManager extends cc.Component {

    private static instance: PoolManager;
    private pools: Map<string, cc.Node[]> = new Map();

    public static getInstance(): PoolManager {
        if (!this.instance) {
            this.instance = new PoolManager();
        }
        return this.instance;
    }

    // 初始化对象池
    initPool(name: string, prefab: cc.Prefab, size: number, parent: cc.Node) {
        if (!this.pools.has(name)) {
            this.pools.set(name, []);
        }

        const pool = this.pools.get(name);
        for (let i = 0; i < size; i++) {
            const node = cc.instantiate(prefab);
            node.parent = parent;
            node.active = false;
            pool.push(node);
        }
    }

    // 获取对象
    getNode(name: string, prefab: cc.Prefab, parent: cc.Node): cc.Node {
        if (!this.pools.has(name)) {
            this.pools.set(name, []);
        }

        const pool = this.pools.get(name);
        let node: cc.Node;

        if (pool.length > 0) {
            node = pool.pop();
            node.parent = parent;
        } else {
            node = cc.instantiate(prefab);
            node.parent = parent;
        }

        node.active = true;
        return node;
    }

    // 放回对象
    putNode(name: string, node: cc.Node) {
        node.active = false;
        node.removeFromParent(false);

        if (!this.pools.has(name)) {
            this.pools.set(name, []);
        }

        this.pools.get(name).push(node);
    }

    // 清理对象池
    clearPool(name: string) {
        if (this.pools.has(name)) {
            const pool = this.pools.get(name);
            pool.forEach(node => {
                node.destroy();
            });
            this.pools.delete(name);
        }
    }

    // 清理所有对象池
    clearAll() {
        this.pools.forEach((pool, name) => {
            pool.forEach(node => {
                node.destroy();
            });
        });
        this.pools.clear();
    }
}
