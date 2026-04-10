import Base from "./Base"

type FindScope = string | cc.Node | cc.Component | cc.Component[] | FindArgs

interface find {
    (name: string, parent?: FindScope): cc.Node
    <T extends cc.Component>(type: { prototype: T }, parent?: FindScope): T
    <T extends cc.Component>(type: [{ prototype: T }], parent?: FindScope): T[]
}

export class FindArgs {
    constructor(public name: any, public parent: any) { }
}

export class FindParentArgs {
    constructor(public target: any, public type: any) { }
}


export const find: find = function <T extends cc.Component>(name: string | { prototype: T } | [{ prototype: T }], parent?: FindScope) {

    if (Base.instance == null || !Base.instance.ready) {
        return new FindArgs(name, parent)
    }

    if (parent instanceof FindArgs) {
        return find(name as any, find(parent.name, parent.parent))
    }

    if (typeof name == 'string') {
        return findNode(name, parent)
    }
    if (Array.isArray(name)) {
        return findComponents(name[0], parent)
    }
    return findComponent(name, parent)
}

export function findComponents<T extends cc.Component>(type: { prototype: T }, parent?: FindScope): T[] {
    if (typeof parent === 'string') {
        return findComponentsInChildren(type, findNode(parent))
    }
    if (parent instanceof cc.Node) {
        return findComponentsInChildren(type, parent)
    }
    if (parent instanceof cc.Component) {
        return findComponentsInChildren(type, parent.node)
    }
    if (Array.isArray(parent)) {
        for (let i = 0; i < parent.length; i++) {
            const result = findComponentsInChildren(type, parent[i].node)
            if (result) {
                return result
            }
        }
        return []
    }
    return findComponentsInChildren(type)
}

export function findComponent<T extends cc.Component>(type: { prototype: T }, parent?: FindScope): T {

    if (typeof parent === 'string') {
        return findComponentInChildren(type, findNode(parent))
    }
    if (parent instanceof cc.Node) {
        return findComponentInChildren(type, parent)
    }
    if (parent instanceof cc.Component) {
        return findComponentInChildren(type, parent.node)
    }

    if (Array.isArray(parent)) {
        for (let i = 0; i < parent.length; i++) {
            const result = findComponentInChildren(type, parent[i].node)
            if (result) {
                return result
            }
        }
        return null
    }
    return findComponentInChildren(type)
}

export function findComponentInChildren<T extends cc.Component>(type: { prototype: T }, parent = cc.Canvas.instance.node): T {
    return parent.getComponent(type) || parent.getComponentInChildren(type)
}

export function findComponentsInChildren<T extends cc.Component>(type: { prototype: T }, parent = cc.Canvas.instance.node): T[] {
    return [...parent.getComponents(type), ...parent.getComponentsInChildren(type)]
}

export function findNode(name: string, parent?: FindScope): cc.Node {

    if (typeof parent === 'string') {
        return findNodeInChildren(name, findNode(parent))
    }
    if (parent instanceof cc.Node) {
        return findNodeInChildren(name, parent)
    }
    if (parent instanceof cc.Component) {
        if (parent.node === null) {
            console.log(name, parent)
        }
        return findNodeInChildren(name, parent.node)
    }
    if (Array.isArray(parent)) {
        for (let i = 0; i < parent.length; i++) {
            const result = findNodeInChildren(name, parent[i].node)
            if (result) {
                return result
            }
        }
        return null
    }
    return findNodeInChildren(name)
}

export function findNodeInChildren(name: string, parent = cc.Canvas.instance.node): cc.Node {
    for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].name === name) {
            return parent.children[i]
        }
        let childrenTarget = findNodeInChildren(name, parent.children[i])

        if (childrenTarget !== null) {
            return childrenTarget
        }
    }
    return null
}


export function findComponentInParents<T extends cc.Component>(self: cc.Node | cc.Component, type: { prototype: T }): T {

    if (Base.instance == null || !Base.instance.ready) {
        return new FindParentArgs(self, type) as any
    }

    let targetNode: cc.Node = self instanceof cc.Node ? self : self.node
    let targetComponent: T = null

    while (targetNode && !(targetNode instanceof cc.Scene)) {
        targetComponent = targetNode.getComponent(type)
        if (targetComponent !== null) {
            return targetComponent
        }
        targetNode = targetNode.parent
    }

    return null
}



export default class Util {

    /**
     * 复制一个Json类型的纯数据
     * @param data
     */
    public static CloneJsonData<T>(data: T): T {
        return JSON.parse(JSON.stringify(data))
    }

    /**
     * 根据角度返回半径为 1 的点的坐标
     * @param deg
     */
    public static AngleToDir(deg: number) {
        let x = Math.cos(deg * (Math.PI / 180))
        let y = Math.sin(deg * (Math.PI / 180))

        if (deg == 0) {
            x = 1;
            y = 0;
        }
        if (deg == 90) {
            x = 0;
            y = 1;
        }

        if (deg == 180) {
            x = -1;
            y = 0;
        }
        if (deg == 270) {
            x = 0;
            y = -1;
        }

        return cc.v2(x, y)
    }


    /**
     * 以 a 点为坐标原点 , 返回 b 点所处的角度
     * @param a :number | cc.Vec2
     * @param b :number
    */
    public static PosttionToAngle(a: cc.Vec2 | cc.Vec3, b: cc.Vec2 | cc.Vec3 = cc.v2(0, 0)): number {
        const radian = Math.atan2(b.x - a.x, b.y - a.y)
        const deg = -radian * 180 / Math.PI - 90;

        if (deg > 360) {
            return deg - 360
        }
        if (deg < 0) {
            return deg + 360
        }
        return deg
    }

    /**
     * 获取a到b之间的随机整数
     * @param a
     * @param b
     */
    public static RandomRange(a: number, b: number): number {
        return a + Math.random() * (b - a)
    }

    /**
     * 获取a到b之间的随机整数(不包含b)
     * @param a
     * @param b
     */
    public static RandomRangeInt(a: number, b: number): number {
        return Math.floor(this.RandomRange(a, b))
    }

    /**
     * 数组的随机子项
     * @param arr : T[] 数组
     * @param oddsList : T[] 数组每个元素的运气值加权 , 默认为1
     */
    public static randomItem<T>(arr: T[], oddsList?: number[]): T {
        if (Array.isArray(oddsList)) {
            const oddsCount = oddsList.reduce((value, odds) => value + (odds || 1), 0)
            let randomNumber = Math.random() * oddsCount

            return arr.find((item, index) => {
                randomNumber -= oddsList[index]
                if (randomNumber <= 0) {
                    return item
                }
            })
        }

        return arr[this.RandomRangeInt(0, arr.length)]
    }

    /**
     * 创建一个随机数生成器
     * @param seed 随机数种子
     */
    public static seedRandom(seed: number = Date.now()) {
        const readomer = () => {
            readomer._seed = (readomer._seed * 9301 + 49297) % 233280
            return readomer._seed / 233280
        }
        readomer._seed = seed
        return
    }

    /**
     * 删除数组里的子项
     * @param arr
     * @param item
     */
    public static removeItem<T>(arr: T[], item: T): boolean {
        const index = arr.indexOf(item)

        if (index !== -1) {
            arr.splice(index, 1)
            return true
        }
        return false
    }

    /**
     * 创建一个数组随机后的副本
     * @param arr 
     */
    public static arrayRandomSort<T>(arr: T[]): T[] {
        return [...arr].sort(() => Math.random() - 0.5)
    }

    /**
     * 把一个一维数组按照指定长度分割为二维数组
     * @param arr
     * @param length
     */
    public static splitByLength<T>(arr: T[], length: number): T[][] {
        var newArr = []

        for (let i = 0; i < arr.length; i += length) {
            newArr.push([...arr.slice(i, i + length)])
        }
        return newArr
    }

    /**
     * 冒泡派发一个事件给父节点们
     * @param type
     */
    public static emit(self: cc.Node | cc.Component, type: string, data?: any) {
        const e = new cc.Event.EventCustom(type, true);

        e.setUserData(data)
        if (self instanceof cc.Component) {
            self.node.dispatchEvent(e)
        }
        else {
            self.dispatchEvent(e)
        }
    }

    public static copyText(text: string | number) {
        const _text = text.toString()
        const input = document.createElement('input')
        input.style.cssText = 'position:fixed !important;  top:0 !important;  left:0 !important;  opacity:0 !important;  pointer-events:none !important;  '
        input.value = _text
        document.body.appendChild(input)
        input.select()
        input.setSelectionRange(0, _text.length)
        document.execCommand('copy')
        document.body.removeChild(input)
    }

    public static copyText_2() {

    }

    /**
    * 精确到小数点后多少位（舍尾）
    * @param {number} 精确值
    * @param {number} 精确位数
    * @return {number}
    * */
    public static exactCount(exactValue: number, count: number = 0): number {
        let num = Math.pow(10, count);
        let value = (exactValue * num) | 0;
        return value / num;
    }

    public static Log(data: any) {
        if (CC_DEBUG) {
            console.log(data);
        }
    }
    public static IsIos(): boolean {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        return isiOS;
    }
}
