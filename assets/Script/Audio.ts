const { ccclass, property } = cc._decorator;


@ccclass
export default class Audio extends cc.Component {
    public bgmVolume: number = 1;
    public sfxVolume: number = 1;

    bgmAudioID: number = -1;
    audioId: number = -1;


    private static instance: Audio = null
    public static getInstance() {
        if (!Audio.instance) {
            Audio.instance = new Audio()
        }
        return Audio.instance
    }

    async loadSounds() {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        var t1 = cc.sys.localStorage.getItem("sfxVolume");

        this.bgmVolume = t == 0 ? Number(t) : 1;
        this.sfxVolume = t1 == 0 ? Number(t1) : 1;
        return new Promise<void>((resolve, reject) => {
            cc.loader.loadResDir("sounds", () => {
                console.log("loadSounds success")
                resolve();
            },() => {
                    console.log("loadSounds error")
                    resolve();
                }) 
        })

    }

    getUrl(url: string): cc.AudioClip {
        return cc.loader.getRes("sounds/" + url);
    }

    private bgm_url: string = ""
    playBGM(url: string) {
        this.bgm_url = url;
        var audioUrl = this.getUrl(url);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        if (this.bgmVolume > 0) {
            this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
        }
    }

    stopSFX(audioId: number) {
        var ok = cc.audioEngine.stop(audioId);
        return ok;
    }

    private lastplaysfxtime = {};
    private sfxcd = {
        "ui_button_click_1": 300,
        "cash_register_1_1": 500,
        "cash_register_2_1": 500,
        "cash_register_3_1": 500,
        "cash_register_4_1": 500
    }

    playSFX(url: string) {
        if (!this.lastplaysfxtime[url])
            this.lastplaysfxtime[url] = 0;

        var audioUrl = this.getUrl(url);
        if (this.sfxVolume > 0) {
            this.audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
            return this.audioId;
        }
    }

    pauseBGM() {
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.pause(this.bgmAudioID);
            // cc.log("暂停bgm")
        }
    }

    resumBGM() {
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.resume(this.bgmAudioID);
            // cc.log("恢复bgm")
        }
    }

    setBGMVolume(v: number, force: boolean = false) {
        if (this.bgmVolume != v || force) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
        } else {
            this.playBGM(this.bgm_url);
        }
    }

    setSFXVolume(v: number, force: boolean = false) {
        if (this.sfxVolume != v || force) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
            //设置音效大小会同时设置背景音乐的声音，不设置音效大小，本地音效依然可以受控使用，暂未找到原因
            // cc.audioEngine.setEffectsVolume(v);
        }
    }
}


