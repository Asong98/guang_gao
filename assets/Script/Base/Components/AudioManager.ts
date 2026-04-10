import Util from "../Util"

const { ccclass, property, menu } = cc._decorator

@ccclass('Audio')
class Audio {
    @property()
    name = ''

    @property({
        'type': cc.AudioClip
    })
    audioClip: cc.AudioClip = null

    relativeVolume = 1
}

@ccclass
@menu('通用组件/AudioManager(音频管理器)')
export default class AudioManager extends cc.Component {
    nowBgm: cc.AudioClip = null
    bgmPlaying = false
    canPlayAudio = false

    static instance: AudioManager = null


    @property({
        'type': cc.AudioClip
    }) defaultM: cc.AudioClip = null

    @property({
        'type': cc.AudioClip
    }) bgm: cc.AudioClip = null
    @property() bgmVolume = 1

    bgmRelativeVolume = 1

    @property({
        'type': [Audio]
    })
    audios: Audio[] = []

    private _globalvolume = 1;
    private _isPauseMusic = false;

    private _havePlayBgm = false;

    private ac = null as AudioContext

    constructor() {
        super()
        AudioManager.instance = this
    }


    canPlay() {
        return new Promise<Boolean>((resolve) => {
            
            // @ts-ignore
            if( window.wx && wx.version ){
                this.canPlayAudio = true
                resolve(true)
                return
            }

            if (this.canPlayAudio == true) {
                resolve(true)
                return
            }

            if (!this.defaultM) {
                console.error('未设置 AduioManager 的 defaultM !')
                resolve(true)
                return
            }

            // @ts-ignore
            const buffer = this.defaultM._audio as AudioBuffer
            const audioNode = this.ac.createBufferSource()

            audioNode.loop = true
            audioNode.buffer = buffer
            audioNode.connect(this.ac.destination)
            audioNode.start()

            setTimeout(() => {
                if (this.ac.state == 'running') {
                    if( this.canPlayAudio != true ){
                        this.canPlayAudio = true
                        resolve(true)
                    }
                }
                else {
                    this.canPlayAudio = false
                    resolve(false)
                }
            }, 100)

        })
    }

    tryPlayBgm = async (e?: Event) => {
        if (this.bgmPlaying == true) {
            return
        }

        if( 
            e && (e.type == 'mouseup' || e.type == 'touchend') &&
            this.ac && this.ac.state == 'running' 
        ){
            return
        } 

        AudioManager.playBgm()
        if (await this.canPlay()) {

            
            // @ts-ignore
            if( window.wx && wx.version ){
            }
            else{
                let ev = document.createEvent('UIEvent');
                if (e) {
                    if (e.type == 'touchstart' || e.type == 'mousedown') {
                       
                        ev.initEvent('audio-canplay-start');
                    }
                    else {
                     
                        ev.initEvent('audio-canplay-end');
                    }
                }
                else {
                  
                    ev.initEvent('audio-canplay-auto');
                }
                document.dispatchEvent(ev);
            }

            this.bgmPlaying = true
            document.removeEventListener('mousedown', this.tryPlayBgm, true)
            document.removeEventListener('mouseup', this.tryPlayBgm, true)

            document.removeEventListener('touchstart', this.tryPlayBgm, true)
            document.removeEventListener('touchend', this.tryPlayBgm, true)
            document.removeEventListener('touchcancel', this.tryPlayBgm, true)
        }
        else {
            AudioManager.stopBgm()
        }
    }


    protected onLoad(): void {

        // 阻止两次播放
        // @ts-ignore
        if (cc.Audio) {
            // @ts-ignore
            cc.Audio.prototype._touchToPlay = () => { }
        }

        // @ts-ignore
        if( window.wx && wx.version ){
            this.ac = null
        }
        else{
            this.ac = new AudioContext()
        }

        document.addEventListener('mousedown', this.tryPlayBgm, true)
        document.addEventListener('mouseup', this.tryPlayBgm, true)

        document.addEventListener('touchstart', this.tryPlayBgm, true)
        document.addEventListener('touchend', this.tryPlayBgm, true)
        document.addEventListener('touchcancel', this.tryPlayBgm, true)

        if (window['notAutoPlayBgm']) {
            this.canPlayAudio = false
            cc.game.emit('audioUnlock');
            return
        }

        this.tryPlayBgm()



        // const playBgmCallback = () => {
        //     document.addEventListener('mousedown', playBgmCallback, true)
        //     document.addEventListener('touchstart', playBgmCallback, true)
        //     cc.audioEngine.play(this.defaultM, false, 1);
        //     if (window['notAutoPlayBgm']) {
        //         AudioManager.playBgm()
        //     }
        //     this.canPlayAudio = true
        // }


        // document.addEventListener('mousedown', playBgmCallback, true)
        // document.addEventListener('touchstart', playBgmCallback, true)

        // if (window['notAutoPlayBgm']) {
        //     this.canPlayAudio = false
        //     cc.game.emit('audioUnlock');
        //     return
        // }
        // AudioManager.playBgm()
    }

    static getAudioClipByName(name: string): cc.AudioClip {
        return AudioManager.instance.audios.find((audio) => audio.name === name).audioClip
    }


    /**
     * 播放指定的bgm或者默认bgm(同一个bgm重复调用并不会重复播放)
     * @param name
     */
    static playBgm(name?: string): void {
        // if(window['audioManager'] == true) return;
        // window['audioManager'] = true;

        if (name) {
            const audio = AudioManager.instance.audios.find((_audio) => _audio.name === name)

            AudioManager._playBgm(audio.audioClip, AudioManager.instance.bgmVolume * AudioManager.instance.bgmRelativeVolume * AudioManager.instance._globalvolume)
            AudioManager.instance.nowBgm = audio.audioClip
        }
        else {
            AudioManager._playBgm(AudioManager.instance.bgm, AudioManager.instance.bgmVolume * AudioManager.instance.bgmRelativeVolume * AudioManager.instance._globalvolume)
            AudioManager.instance.nowBgm = AudioManager.instance.bgm
        }
    }

    /**
     * 停止播放当前bgm
     * @param name
     */
    static stopBgm(): void {
        AudioManager._stopAudio(AudioManager.instance.nowBgm)
    }

    /**
     * 恢复播放当前的bgm
     */
    static resumeBgm(): void {
        AudioManager._resumeAudio(AudioManager.instance.nowBgm)
    }

    /**
     * 暂停播放当前的bgm
     */
    static pauseBgm(): void {
        AudioManager._pauseAudio(AudioManager.instance.nowBgm)
    }

    /**
     * 停止播放一个指定的音效
     * @param name
     */
    static stop(name: string): void {
        AudioManager._stopAudio(AudioManager.getAudioClipByName(name))
    }

    /**
     * 播放一个指定的音效
     * @param name
     */
    static play(name: string, volume = 1, isLoop = false): void {
        const audio = AudioManager.instance.audios.find((audio) => audio.name === name)
        if (audio) {
            AudioManager._playAudio(audio.audioClip, volume, audio.relativeVolume, volume * audio.relativeVolume * AudioManager.instance._globalvolume, isLoop)
        }
    }

    static firstPlay(name: string, volume = 1, isLoop = false){
        const audio = AudioManager.instance.audios.find((audio) => audio.name === name)
        if( !audio ){
            return
        }

        AudioManager.play(name,volume,isLoop)

        setTimeout(() => {
            if( cc.audioEngine.getState( AudioManager.audioIds[audio.audioClip as any] ) != cc.audioEngine.AudioState.PLAYING ){
                AudioManager.firstPlay(name,volume,isLoop)
            }
        }, 50)
    }

    private static audioIds = {}
    private static audioV = {};
    private static audioIdsTimeouts = {}

    static stopAll() {
        cc.audioEngine.stopAll()
        this.audioIds = {}
        this.audioV = {};
    }

    /**
     * 播放一个指定路径的音效
     * @param src
     * @param volume
     */
    private static _playAudio(src: any, v1: number, v2: number, volume = 1, isLoop = false): void {

        if (!src || AudioManager.instance.canPlayAudio == false) {
            return
        }
        if (AudioManager.instance._isPauseMusic) return;

        // (防抖动)33毫秒内只播放一次相同的音频
        if (src in AudioManager.audioIdsTimeouts && AudioManager.audioIdsTimeouts[src] + 33 > Date.now()) {
            return
        }

        AudioManager.audioIdsTimeouts[src] = Date.now()
        AudioManager.audioIds[src] = cc.audioEngine.play(src, isLoop, volume)
        AudioManager.audioV[src] = { v: v1, v2: v2 };
    }

    /**
     * 播放一个指定路径的bgm
     * @param src
     * @param volume
     */
    private static _playBgm(src: any, volume = 1): void {
        if (!src) {
            return
        }

        if (AudioManager.instance._havePlayBgm && AudioManager.instance._isPauseMusic) return;


        if (src in AudioManager.audioIds && !Util.IsIos()) {
            if (cc.audioEngine.getState(AudioManager.audioIds[src]) !== cc.audioEngine.AudioState.PLAYING) {
                cc.audioEngine.resume(AudioManager.audioIds[src])
            }
            return
        }

        AudioManager.audioIds[src] = cc.audioEngine.play(src, true, volume)
        AudioManager.audioV[src] = { v: AudioManager.instance.bgmVolume, v2: AudioManager.instance.bgmRelativeVolume };

        if (!AudioManager.instance._havePlayBgm) {
            AudioManager.instance._havePlayBgm = true;
            if (AudioManager.instance._isPauseMusic) {
                cc.audioEngine.pauseAll();
            }
        }
    }

    /**
     * 恢复一个指定路径的音效
     * @param src
     */
    private static _resumeAudio(src: any): void {
        if (AudioManager.instance._isPauseMusic) return;
        if (!src) {
            return
        }

        if (src in AudioManager.audioIds) {
            cc.audioEngine.resume(AudioManager.audioIds[src])
        }
    }

    /**
     * 暂停一个指定路径的音效
     * @param src
     */
    private static _pauseAudio(src: any): void {
        if (!src) {
            return
        }
        if (src in AudioManager.audioIds) {
            cc.audioEngine.pause(AudioManager.audioIds[src])
        }
    }


    /**
     * 停止一个指定路径的音效
     * @param src
     */
    private static _stopAudio(src: any): void {
        if (!src) {
            return
        }
        if (src in AudioManager.audioIds) {
            cc.audioEngine.stop(AudioManager.audioIds[src])
            delete AudioManager.audioIds[src]
            // audioIds[src] = null
        }
        if (src in AudioManager.audioV) {
            delete AudioManager.audioV[src];
        }
    }

    public static SetGlobalVolume(num: number) {
        if (num < 0) num = 0;
        if (num > 1) num = 1;

        AudioManager.instance._globalvolume = num;

        for (let src in AudioManager.audioIds) {
            cc.audioEngine.setVolume(AudioManager.audioIds[src], AudioManager.audioV[src].v * AudioManager.audioV[src].v2 * num);
        }
    }

    public static PauseAllMuisc() {
        if (AudioManager.instance._isPauseMusic) return;
        AudioManager.instance._isPauseMusic = true;
        cc.audioEngine.pauseAll();
    }
    public static ResumeAllMuisc() {
        if (!AudioManager.instance._isPauseMusic) return;
        AudioManager.instance._isPauseMusic = false;
        cc.audioEngine.resumeAll();
    }
}
window['AudioManager'] = AudioManager




