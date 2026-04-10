
export default class CpSDK {
    public static SectionType = {
        Start: 'section_start',
        Mainscene: 'section_mainscene',
        Finish: 'section_finish'
    }
    public static EndStrType = { win: "win", lose: 'lose', timer: 'timer' } as const;

    private static _isEnd = false;

    private static _nowSection = 0;

    public static _Version = "Cool Playable SDK Version: 1.2.2" as const;

    public static GameEnd(isWin: boolean = true) {
        if (this._isEnd) return;
        this._isEnd = true;
        try {
            Yeah.end(isWin);
            if (Yeah.isFunPlus()) {
                Yeah.funPlusSend('finish');
                if (isWin) {
                    Yeah.funPlusSend('win');
                } else {
                    Yeah.funPlusSend('lose');
                }
            }


        } catch (e) {
            console.log("%c【CoolplayableSDK】GameEnd " + `${isWin ? "【win】" : "【lose】"}`, "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }
    public static ClickDownloadBar(area: number, remark?: string) {
        try {
            Yeah.clickDownloadBar(this._nowSection, area, remark);
            if (Yeah.isFunPlus()) {
                Yeah.funPlusSend('goStore');
            }
        } catch (e) {
            cc.sys.openURL("");
            console.log("%c【CoolplayableSDK】ClickDownloadBar:(section" + this._nowSection + ", area" + area + ', remark:' + remark + ")", "background: rgb(255, 0, 0); color: rgb(0, 0, 0)");
        }
    }

    public static ClickArea(area: number, remark?: string) {
        try {
            Yeah.clickArea(this._nowSection, area, remark);
        } catch (e) {
            console.log("%c【CoolplayableSDK】ClickArea:(section" + this._nowSection + ", area" + area + ', remark:' + remark + "))", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }

    public static ClickReborn(area: number, remark?: string) {
        try {
            Yeah.clickReborn(this._nowSection, area, remark);
        } catch (e) {
            console.log("%c【CoolplayableSDK】ClickReborn:(section" + this._nowSection + ", area" + area + ', remark:' + remark + ")", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
        this._nowSection = 0;
        this._isEnd = false;
    }

    public static EnterSection(section: number, remark?: string, type?: string) {
        if (section > this._nowSection) {
            this._nowSection = section;
            try {
                Yeah.enterSection(section, remark, type);
            } catch (e) {
                console.log("%c【CoolplayableSDK】EnterSection:(section:" + this._nowSection + ', remark:' + remark + ', type:' + type + ")", "background: rgb(0, 255, 255); color: rgb(0, 0, 0)");
            }
        }
    }

    //ironsource tack

    //用户无操作时触发
    public static touchEnd() {
        try {
            Yeah.touchEnd();
        } catch (e) {
            console.log("%c【CoolplayableSDK Iron Track】touchEnd", "background: rgb(248, 177, 173); color: rgb(63, 172, 203)", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }
    //用户交互时触发
    public static touchStart() {
        try {
            Yeah.touchStart();
        } catch (e) {
            console.log("%c【CoolplayableSDK Iron Track】touchStart", "background: rgb(248, 177, 173); color: rgb(63, 172, 203)", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }
    //关卡开始时调用
    public static startLevel() {
        try {
            Yeah.startLevel();
        } catch (e) {
            console.log("%c【CoolplayableSDK Iron Track】startLevel", "background: rgb(248, 177, 173); color: rgb(63, 172, 203)", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }
    //关卡结束时触发
    public static endLevel() {
        try {
            Yeah.endLevel();
        } catch (e) {
            console.log("%c【CoolplayableSDK Iron Track】endLevel", "background: rgb(248, 177, 173); color: rgb(63, 172, 203)", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }

    //对于没有关卡的，使用游戏到达中间时间点调用
    public static midProgress() {
        try {
            Yeah.midProgress();
        } catch (e) {
            console.log("%c【CoolplayableSDK Iron Track】midProgress", "background: rgb(248, 177, 173); color: rgb(63, 172, 203)", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }
    //结束界面
    //  type: 'win' | 'lose' | 'timer'
    public static gameEnding(type: 'win' | 'lose' | 'timer') {
        try {
            Yeah.gameEnding(type);
        } catch (e) {
            console.log("%c【CoolplayableSDK Iron Track】gameEnding:(type: " + type + ")", "background: rgb(248, 177, 173); color: rgb(63, 172, 203)", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }
    //用户自定义事件
    public static customEvent(eventType: string, eventName: string) {
        try {
            Yeah.customEvent(eventType, eventName);
        } catch (e) {
            console.log("%c【CoolplayableSDK Iron Track】customEvent:(eventType: " + eventType + ", eventName: " + eventName + ")", "background: rgb(248, 177, 173); color: rgb(63, 172, 203)", "background: rgb(255, 255, 0); color: rgb(0, 0, 0)");
        }
    }

    // funplus sdk
    public static Tutorial() {

        try {
            if (Yeah.isFunPlus()) {
                Yeah.funPlusSend('tutorial');
            }
        } catch (e) {
            console.log("%c【FunPlusSDK】tutorial:", "background: rgb(0, 255, 0); color: rgb(0, 0, 0)");

        }
    }
}


declare module Yeah {
    function end(iswin?: boolean);
    function getLang();

    //穿山甲追踪事件

    function clickDownloadBar(section: number, area: number, remark?: string);
    function clickArea(section: number, area: number, remark?: string);
    function clickReborn(section: number, area: number, remark?: string);

    function enterSection(section: number, remark?: string, type?: string);
    // function autoClick(section: number);
}

//ironsource track
declare module Yeah {
    //用户无操作时触发
    function touchEnd();
    //交互时候触发
    function touchStart();

    //关卡结束
    function endLevel();
    //关卡开始
    function startLevel();

    //对于没有关卡的，使用中点
    function midProgress();

    //  type: 'win' | 'lose' | 'timer'
    function gameEnding(type);

    //try again
    function clickReborn();

    //跳转商店
    function click();

    //自定义事件
    function customEvent(eventType, eventName);

}

//funplus Sdk

declare module Yeah {
    function isFunPlus(): boolean;
    function funPlusSend(msg: string);
}