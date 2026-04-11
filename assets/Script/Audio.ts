const { ccclass, property } = cc._decorator;

@ccclass
export default class Audio extends cc.Component {
    private static instance: Audio = null!;

    @property([cc.AudioClip])
    bgmClips: cc.AudioClip[] = [];

    @property([cc.AudioClip])
    sfxClips: cc.AudioClip[] = [];

    private bgmId: number = -1;
    private bgmVolume: number = 1.0;
    private sfxVolume: number = 1.0;
    private currentBgm: string = "";
    private __isBgmMuted: boolean = false;
    private __isSfxMuted: boolean = false;

    public static getInstance(): Audio {
        if (!this.instance) {
            this.instance = new Audio();
        }
        return this.instance;
    }

    onLoad() {
        if (Audio.instance) {
            // this.node.destroy();
            return;
        }
        Audio.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.loadVolumeSettings();
    }

    private loadVolumeSettings() {
        const bgmVol = cc.sys.localStorage.getItem("bgmVolume");
        const sfxVol = cc.sys.localStorage.getItem("sfxVolume");
        const bgmMuted = cc.sys.localStorage.getItem("bgmMuted");
        const sfxMuted = cc.sys.localStorage.getItem("sfxMuted");

        if (bgmVol !== null) this.bgmVolume = parseFloat(bgmVol);
        if (sfxVol !== null) this.sfxVolume = parseFloat(sfxVol);
        if (bgmMuted !== null) this.__isBgmMuted = bgmMuted === "true";
        if (sfxMuted !== null) this.__isSfxMuted = sfxMuted === "true"; 
    }

    private saveVolumeSettings() {
        cc.sys.localStorage.setItem("bgmVolume", this.bgmVolume.toString());
        cc.sys.localStorage.setItem("sfxVolume", this.sfxVolume.toString());
        cc.sys.localStorage.setItem("bgmMuted", this.isBgmMuted.toString());
        cc.sys.localStorage.setItem("sfxMuted", this.isSfxMuted.toString());
    }

    playBgm(clipName: string, loop: boolean = true) {
        if (this.isBgmMuted) return;

        const clip = this.getBgmClipByName(clipName);
        if (!clip) {
            console.warn(`BGM clip not found: ${clipName}`);
            return;
        }

        if (this.currentBgm === clipName && this.bgmId !== -1) {
            return;
        }

        if (this.bgmId !== -1) {
            cc.audioEngine.stop(this.bgmId);
        }

        this.bgmId = cc.audioEngine.play(clip, loop, this.bgmVolume);
        this.currentBgm = clipName;
    }

    stopBgm() {
        if (this.bgmId !== -1) {
            cc.audioEngine.stop(this.bgmId);
            this.bgmId = -1;
            this.currentBgm = "";
        }
    }

    pauseBgm() {
        if (this.bgmId !== -1) {
            cc.audioEngine.pause(this.bgmId);
        }
    }

    resumeBgm() {
        if (this.bgmId !== -1) {
            cc.audioEngine.resume(this.bgmId);
        }
    }

    playSfx(clipName: string, volumeScale: number = 1.0): number {
        if (this.isSfxMuted) return -1;

        const clip = this.getSfxClipByName(clipName);
        if (!clip) {
            console.warn(`SFX clip not found: ${clipName}`);
            return -1;
        }

        const finalVolume = this.sfxVolume * volumeScale;
        return cc.audioEngine.play(clip, false, finalVolume);
    }

    stopSfx(audioId: number) {
        if (audioId !== -1) {
            cc.audioEngine.stop(audioId);
        }
    }

    stopAllSfx() {
        cc.audioEngine.stopAllEffects();
    }

    setBgmVolume(volume: number) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmId !== -1) {
            cc.audioEngine.setVolume(this.bgmId, this.bgmVolume);
        }
        this.saveVolumeSettings();
    }

    getBgmVolume(): number {
        return this.bgmVolume;
    }

    setSfxVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveVolumeSettings();
    }

    getSfxVolume(): number {
        return this.sfxVolume;
    }

    muteBgm(mute: boolean) {
        this.__isBgmMuted = mute;
        if (mute) {
            this.pauseBgm();
        } else {
            this.resumeBgm();
        }
        this.saveVolumeSettings();
    }

    isBgmMuted(): boolean {
        return this.__isBgmMuted;
    }

    muteSfx(mute: boolean) {
        this.__isSfxMuted = mute;
        if (mute) {
            this.stopAllSfx();
        }
        this.saveVolumeSettings();
    }

    isSfxMuted(): boolean {
        return this.__isSfxMuted;
    }

    private getBgmClipByName(name: string): cc.AudioClip | null {
        for (const clip of this.bgmClips) {
            if (clip.name === name) {
                return clip;
            }
        }
        return null;
    }

    private getSfxClipByName(name: string): cc.AudioClip | null {
        for (const clip of this.sfxClips) {
            if (clip.name === name) {
                return clip;
            }
        }
        return null;
    }

    preloadAudioClips() {
        this.bgmClips.forEach(clip => {
            cc.audioEngine.preload(clip.name);
        });
        this.sfxClips.forEach(clip => {
            cc.audioEngine.preload(clip.name);
        });
    }

    stopAll() {
        this.stopBgm();
        this.stopAllSfx();
    }

    onDestroy() {
        this.stopAll();
        cc.audioEngine.uncacheAll();
    }
}
