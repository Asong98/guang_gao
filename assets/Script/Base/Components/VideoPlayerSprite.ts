import { ActionUtil } from "./Anim/ActionUtil";
import AudioManager from "./AudioManager";
import LayerManger from "./LayerManger";

class WebGLVideo extends cc.Texture2D {
    private _video: HTMLVideoElement = null;
    // private _canvas: HTMLImageElement = null;
    public constructor() {
        super();

        this._video = document.createElement('video');
        // this._canvas = new Image(720, 1280);

        // this.initWithElement(this._canvas);
        // const _texture = this._texture;
        // if (_texture) {
        //     if (!_texture.__Player) {
        //         _texture.__Player = this
        //         _texture.__setImage = _texture._setImage
        //         _texture._setImage = function (glFmt: any, options: any) {
        //             options.image = this.__Player._video;
        //             this.__setImage(glFmt, options)
        //         }
        //     }
        // }

        // const gl = cc.renderer.device._gl;
        // gl.bindTexture(gl.TEXTURE_2D, this._texture._glID);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.bindTexture(gl.TEXTURE_2D, null);

    }
    private _appendSource(src: string, type: string) {
        const s = document.createElement("source");
        s.src = src;
        s.type = type;
        this._video.appendChild(s);

    }
    public SetSource(src: string) {
        const video = this._video;
        for (; video && video.childElementCount && video.firstChild;) {
            video.firstChild.remove();
        }
        this._appendSource(src, 'video/mp4');
    }
    public GetVideo(): HTMLVideoElement {
        return this._video;
    }

    public UpdateTexture() {
        const gl = cc.renderer.device._gl
        // console.log(this);
        if (!this._texture && this._video && this._video.videoHeight > 10) {

            this.initWithData(null, cc.Texture2D.PixelFormat.RGB888, this._video.videoWidth, this._video.videoHeight);

            // this._canvas = new Image(600, 600)
            // this.initWithElement(this._canvas);
            // // const gl = cc.renderer.device._gl
            gl.bindTexture(gl.TEXTURE_2D, this._texture._glID);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);

        }

        if (this._texture && this._video && this._video.videoHeight > 10) {
            gl.bindTexture(gl.TEXTURE_2D, this._texture._glID);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this._video);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
        }

        //this.handleLoadedTexture()

    }

    
}

class VideoSpr extends cc.SpriteFrame {
    public videoElement: HTMLVideoElement = null;
    get currentTime() {
        return this.videoElement ? this.videoElement.currentTime : 0
    }
    set currentTime(time: number) {
        this.videoElement && (this.videoElement.currentTime = time)
    }
    get volume() {
        return this.videoElement.volume
    }
    set volume(num: number) {
        this.videoElement.volume = num;
    }
    get readyState() {
        return this.videoElement.readyState;
    }
    get duration() {
        return this.videoElement.duration;
    }
    get playbackRate() {
        return this.videoElement.playbackRate;
    }
    set playbackRate(rate: number) {
        this.videoElement.playbackRate = rate;
    }
    get muted() {
        return this.videoElement.muted
    }
    set muted(isMuted: boolean) {
        this.videoElement.muted = isMuted;
    }
    get paused() {
        return this.videoElement.paused
    }
    get preload() {
        return this.videoElement.preload
    }
    set preload(state: "none" | "metadata" | "auto" | "") {
        this.videoElement.preload = state;
    }
    get seeking() {
        return this.videoElement.seeking
    }
    get width() {
        return this.width
    }
    set width(w: number) {
        this.videoElement.width = w / cc.view.getDevicePixelRatio()
        this.width = w;
    }
    get height() {
        return this.height
    }
    set height(h) {
        this.videoElement.height = h / cc.view.getDevicePixelRatio();
        this.height = h;
    }

    public webGLVideo: WebGLVideo = null;
    private updateCount = 0;
    private _renderring: boolean = false;

    public internalTexture: cc.Texture2D = null;

    public constructor() {
        super();
        this.webGLVideo = new WebGLVideo();
        this.setTexture(this.webGLVideo)
        this.videoElement = this.webGLVideo.GetVideo();


        this.videoElement.addEventListener('ended', () => {
            this._renderring = false;
        })
        const videoElem = this.videoElement as any;
        this.internalTexture = this.webGLVideo;
        videoElem.preload = 'auto';
        if (cc.sys.isMobile) {
            videoElem["x5-playsInline"] = !0,
                videoElem["x5-playsinline"] = !0,
                videoElem.x5PlaysInline = !0,
                videoElem.playsInline = !0,
                videoElem["webkit-playsInline"] = !0,
                videoElem["webkit-playsinline"] = !0,
                videoElem.webkitPlaysInline = !0,
                videoElem.playsinline = !0,
                videoElem.style.playsInline = !0,
                videoElem.crossOrigin = "anonymous",
                videoElem.setAttribute("crossorigin", "anonymous"),
                videoElem.setAttribute("playsinline", "true"),
                videoElem.setAttribute("x5-playsinline", "true"),
                videoElem.setAttribute("webkit-playsinline", "true"),
                videoElem.autoplay = !0
        }
    }

    public Update(dt: number): void {
        if (!this._renderring) return;
        this.updateCount++;
        if (this.updateCount >= 3) {
            this.updateCount = 0;
            this.renderCanvas();
        }
    }

    public load(str: string) {
        str.indexOf("data:video/mp4;base64") === 0 && this.videoElement ? this.videoElement.src = str : this.webGLVideo && str.indexOf(".mp4") > -1 && this.webGLVideo.SetSource(str);
    }
    public play() {
        const elem = this.videoElement;
        elem && elem.play().catch(err => {
            elem && (elem.muted = true,
                elem.play().catch(s => {
                    console.warn(s)
                }),
                console.warn(err)
            )
        });
        this._renderring = true;
    }
    public pause() {
        this.videoElement.pause();
        this._renderring = false;
    }
    public reload() {
        this.videoElement && this.videoElement.load()
    }
    public renderCanvas() {
        if (!this.videoElement || this.readyState === 0)
            return;
        this.webGLVideo.UpdateTexture();

    }

    destroy(): boolean {
        this.pause();
        const t = this.videoElement;
        t.removeAttribute("src");
        t.load();
        this.webGLVideo.destroy();

        return super.destroy();
    }
}

const { ccclass, property, executionOrder,menu } = cc._decorator;
@ccclass
@menu('通用组件/VideoPlayerSprite(视频播放器)')
export default class VideoPlayerSprite extends cc.Component {
    @property({ type: cc.Asset })
    private videoRes: cc.Asset = null;

    @property()
    private initVolume = 1;
    @property()
    private initLoop = false;
    @property()
    private isAutoPlay = false;


    private _sprite: cc.Sprite = null;

    private _elapsedTime = 0;
    private _isEnded = false;

    private _endLoop = false;
    private cutSetting = void 0;
    private _timer = null;
    private _seekingCount = 0;
    private _playThrough = false;
    private _url = "";
    private _muted = false;
    private _duration = 0;

    private _originalVolume = 1;
    private _playing = false;
    private _playbackRate = 1;


    private _video: VideoSpr = null;
    private _video1: VideoSpr = null;
    private _videoElem0: HTMLVideoElement = null;
    private _videoElem1: HTMLVideoElement = null;
    private _webGLVideo0: WebGLVideo = null;
    private _webGLVideo1: WebGLVideo = null;
    private _texture0: cc.Texture2D = null;
    private _texture1: cc.Texture2D = null;

    private _onBackStageRecover: Function = null;

    public endCallBack: Function = null;

    constructor() {
        super();
    }
    protected onLoad(): void {

        this._video = new VideoSpr();
        this.url = this.videoRes.url;

        let w = this.node.width;
        let h = this.node.height;
        this._sprite = this.node.getComponent(cc.Sprite) || this.node.addComponent(cc.Sprite);
        this._sprite.spriteFrame = this._video;
        this.node.width = w;
        this.node.height = h;

        if (cc.sys.os === cc.sys.OS_IOS && cc.sys.osMainVersion === 14) {
            this._video.muted = true;
        } else {
            this._video.muted = false;
        }

        this._addEventListener(this._video.videoElement)
        this._video.videoElement.addEventListener("stalled", this._onStalled.bind(this));

        if (cc.sys.os === cc.sys.OS_IOS && cc.sys.osMainVersion === 14) {
            let subVision = Number.parseInt(cc.sys.osVersion.split(/_/)[1]);
            if (subVision <= 4) {
                this._onBackStageRecover = this._reload;
            } else {
                this._onBackStageRecover = this._onVisibilityChange;
            }
        } else {
            this._onBackStageRecover = this._onVisibilityChange;
        }

        this.initLoading();


        this.volume = this.initVolume;
        this.loop = this.initLoop;

        this.play()
        setTimeout(() => {
            if (!this.isAutoPlay)
                this.stop()
        }, 1);


    }

    private _onError(e) {
        cc.log(e, this.name)
    }
    private _onLoadedMetaData() {

        (navigator.userAgent.toLowerCase().match(/ipad/ig)) && this._canplaythrough();
        cc.log('loadedmetadata', this.name)
    }
    private _onLoadedData() {
        cc.log("loadeddata", this.name);
    }
    private _onCanplay() {
        cc.log("canplay", this.name);
    }
    private _onCanplayThrough() {
        (navigator.userAgent.toLowerCase().match(/ipad/ig)) && this._canplaythrough();
        this.node.emit("canplaythrough");
        console.log("canplaythrough", this.name);
    }
    private _onStalledLoad() {
        if (this.loop) {
            const elem = this._video.videoElement;
            let tmp;
            elem === this._videoElem0 ? tmp = this._videoElem0 : tmp = this._videoElem1;
            tmp.load();
        }
    }
    private _onStalled() {
        try {
            const video = this._video;
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                video.play();
                video.videoElement.addEventListener('playing', () => {
                    !this._playing && video.pause();
                }, { once: true, capture: true });
            }
            if (this._playing) {
                //cc.director.pause();
                this._elapsedTime = video.currentTime;
                this._timer = setTimeout(() => {
                    cc.log("------------------------videoResume");
                    cc.director.resume();
                    this._playThrough = true;
                    this._canplaythrough();
                    video.currentTime = this._elapsedTime;
                }, 3e3);
            }
        } catch (e) {
            console.log(e);

        }

    }
    private _onAbort() {
        cc.log("abort", this.name, this._video.currentTime)
    }
    private _onEmptied() {
        const video = this._video;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            video.play();
            video.videoElement.addEventListener('playing', () => {
                !this._playing && video.pause()
            }, { once: true, capture: true });
            video.videoElement.addEventListener("canplaythrough", () => {
                video.currentTime = this._elapsedTime + 0.1 >= video.duration ? video.duration - 0.1 : this._elapsedTime;
                cc.log("---------------emptiedTime", this.name, video.currentTime, video.duration, this._elapsedTime);
            }, { once: true, capture: true });
            cc.log("emptied", this.name, video.currentTime);
        }
    }
    private _onPlay() {
        cc.log("play", this.name, this._video.currentTime);
    }
    private _onPlaying() {
        this._seekingCount = 0;
        cc.director.resume();
        cc.log("playing", this.name, this._video.currentTime);
    }
    private _onPause() {
        this._playing && this._video.currentTime + 0.5 < this._video.duration && this._video.play();
        cc.log("pause", this.name);
    }
    private _onWaiting() {
        cc.log("waiting", this.name, this._video.currentTime);
    }
    private _onSuspend() {
        this._playing && this._video.currentTime + 0.5 < this._video.duration && this._video.play();
        console.log("suspend", this.name, this._video.currentTime);
    }
    private _onTimeUpdate() {
        const video = this._video;
        video.currentTime >= this._elapsedTime && (this._elapsedTime = video.currentTime);
        video.currentTime === video.duration ? !this._isEnded && this._end() : this._isEnded = false;
    }
    private _onSeeking() {
        const video = this._video;
        cc.log("seeking", this.name, video.currentTime);
        this._seekingCount++;
        if (this.playing && this._seekingCount > 3) {
            this._seekingCount = 0;
            video.pause();
            video.play();
        };
    }
    private _onSeeked() {
        const video = this._video;
        cc.director.resume();
        this._drawGraphics();
        this._seekingCount = 0;
        cc.log("seeked", this.name, video.currentTime);
        if (!this.loop && video.currentTime === 0 && this._elapsedTime) {
            video.currentTime = this._elapsedTime;
        }
    }
    private _onEnded() {
        this._drawGraphics()
        console.log("ended", this.name, this._video.currentTime);
    }

    get loop() {
        return this.initLoop;
    }
    set loop(isLoop) {

        if (this.initLoop != isLoop) {
            this.initLoop = isLoop;
        }
        if (isLoop && !this._video1) {
            this._video1 = new VideoSpr();
            this._videoElem0 = this._video.videoElement;
            this._videoElem1 = this._video1.videoElement;
            this._webGLVideo0 = this._video.webGLVideo;
            this._webGLVideo1 = this._video1.webGLVideo;
            this._texture0 = this._video.internalTexture;
            this._texture1 = this._video1.internalTexture;
            this._addEventListener(this._videoElem1);
            this._videoElem1.addEventListener('stalled', this._onStalledLoad.bind(this));
            this._load(this._url, this._video1);
        }
    }

    get url() {
        return this._url;
    }
    set url(str: string) {
        if (this._url != str) {
            this._url = str;
            if (this._url) {
                this._load(str, this._video);

                if (cc.sys.os === cc.sys.OS_IOS && cc.sys.osMainVersion === 14) {
                    let subVision = Number.parseInt(cc.sys.osVersion.split(/_/)[1]);
                    if (subVision <= 4) {
                        cc.game.on("stageVisibilityChange", this._onVisibilityChange.bind(this), this);
                    }
                }
            }
        }
    }
    get muted() {
        return this._muted;
    }
    set muted(enable: boolean) {
        this._muted = enable;
        this._video.muted = !(this.enabled && this.node.activeInHierarchy && AudioManager.instance.canPlayAudio);
    }

    protected onEnable(): void {

        this.muted = this._muted;
    }
    protected onDisable(): void {

        this.muted = this._muted;
    }


    get duration() {
        return this._duration || this._calculateOriginalDuration();
    }
    set duration(dura: number) {
        if (this._duration != dura) {
            this._duration = dura;
            this._changePlayRate();
        }
    }

    _calculateOriginalDuration() {
        return this.cutSetting && (this.cutSetting.cutTo || this.cutSetting.cutFrom) ? Math.max(this._video.duration * 1e3 - this.cutSetting.cutTo - this.cutSetting.cutFrom, 0) : this._video.duration * 1e3
    }

    get currentTime() {
        let time = this._video.currentTime * 1e3;
        if (this.cutSetting && this.cutSetting.cutFrom) {
            time -= this.cutSetting.cutFrom;
        }
        return time / this.playbackRate;
    }
    set currentTime(time) {
        if (!time || time && Math.abs(this._video.currentTime - time / 1e3) > .1 && this.cutSetting && this.cutSetting.cutFrom) {
            time += this.cutSetting.cutFrom
        }
        this._video.currentTime = time ? time / 1e3 : 0.1;
        this._elapsedTime = this._video.currentTime;
    }

    get volume() {
        return this.initVolume;
    }
    set volume(num: number) {
        if (num < 0) {
            num = 0;
        } else if (num > 1) {
            num = 1
        }
        this._video.volume = num;
    }

    get playing() {
        return this._playing;
    }

    get playbackRate() {
        return this._video.playbackRate
    }
    set playbackRate(num: number) {
        if (num > 2) {
            num = 2
        } else if (num < 0.1) {
            num = 0.1;
        }
        if (this._playbackRate != num) {
            this._playbackRate = num;
            this._video.playbackRate = num;
        }
    }

    private _addEventListener(content) {
        content.addEventListener("error", this._onError.bind(this), this);
        content.addEventListener("loadedmetadata", this._onLoadedMetaData.bind(this), this);
        content.addEventListener("loadeddata", this._onLoadedData.bind(this), this);
        content.addEventListener("canplay", this._onCanplay.bind(this), this);
        content.addEventListener("canplaythrough", this._onCanplayThrough.bind(this), this);
        content.addEventListener("abort", this._onAbort.bind(this), this);
        content.addEventListener("emptied", this._onEmptied.bind(this), this);
        content.addEventListener("play", this._onPlay.bind(this), this);
        content.addEventListener("playing", this._onPlaying.bind(this), this);
        content.addEventListener("pause", this._onPause.bind(this), this);
        content.addEventListener("waiting", this._onWaiting.bind(this), this);
        content.addEventListener("suspend", this._onSuspend.bind(this), this);
        content.addEventListener("timeupdate", this._onTimeUpdate.bind(this), this);
        content.addEventListener("seeking", this._onSeeking.bind(this), this);
        content.addEventListener("seeked", this._onSeeked.bind(this), this);
        content.addEventListener("ended", this._onEnded.bind(this), this);
    }
    private _removeEventListener(content) {

        content.removeEventListener("error", this._onError.bind(this), this);
        content.removeEventListener("loadedmetadata", this._onLoadedMetaData.bind(this), this);
        content.removeEventListener("loadeddata", this._onLoadedData.bind(this), this);
        content.removeEventListener("canplay", this._onCanplay.bind(this), this);
        content.removeEventListener("canplaythrough", this._onCanplayThrough.bind(this), this);
        content.removeEventListener("stalled", this._onStalled.bind(this), this);
        content.removeEventListener("stalled", this._onStalledLoad.bind(this), this);
        content.removeEventListener("abort", this._onAbort.bind(this), this);
        content.removeEventListener("emptied", this._onEmptied.bind(this), this);
        content.removeEventListener("play", this._onPlay.bind(this), this);
        content.removeEventListener("playing", this._onPlaying.bind(this), this);
        content.removeEventListener("pause", this._onPause.bind(this), this);
        content.removeEventListener("waiting", this._onWaiting.bind(this), this);
        content.removeEventListener("suspend", this._onSuspend.bind(this), this);
        content.removeEventListener("timeupdate", this._onTimeUpdate.bind(this), this);
        content.removeEventListener("seeking", this._onSeeking.bind(this), this);
        content.removeEventListener("seeked", this._onSeeked.bind(this), this);
        content.removeEventListener("ended", this._onEnded.bind(this), this);
    }


    private _load(url: string, video: VideoSpr) {
        video.load(url);
    }

    private _onAudioUnlock() {
        this.muted = this._muted;
        this.volume = this.initVolume;
    }
    private _reload() {
        if (LayerManger.Instance.isVisiable()) {
            //cc.director.pause();
            this._video.reload();
        } else {
            if (!this._video.paused) {
                cc.log("reload-------------", this._elapsedTime, this.name);
            }
        }
    }

    private _onVisibilityChange() {
        if (LayerManger.Instance.isVisiable()) {
            const time = this._video.currentTime > this._elapsedTime ? this._video.currentTime : this._elapsedTime;
            this._video.currentTime = time + 0.1 >= this._video.duration ? this._video.duration - 0.1 : time;
            //cc.director.pause();
            if (this.isAutoPlay || cc.sys.os == cc.sys.OS_ANDROID) {
                this._video.play();
            } else {
                this._video.playbackRate = this._playbackRate;
                if (this._video.paused) {
                    this._video.play();
                    cc.log("backVideoPause-------------------------", this.name);
                }
                cc.log("------------------backStage", this.name, this._video.currentTime);
            }
        } else {
            if (!this._video.paused) {
                this._elapsedTime = this._video.currentTime;
                if (this.isAutoPlay || cc.sys.os == cc.sys.OS_ANDROID) {
                    this._video.pause();
                } else {
                    this._video.playbackRate = 0;
                }
                cc.log("outStage--------------------", this.name, this._video.currentTime);
            }
        }
    }

    private _changePlayRate() {
        if (this.duration && this._video.duration) {
            const dura = this._calculateOriginalDuration();
            const tmp = dura / this.duration;
            if (dura && tmp) {
                this.playbackRate = tmp * cc.director.getScheduler().getTimeScale();
                if (this.cutSetting && this.cutSetting.fadeOut) {
                    this.cutSetting.fadeOutStart = dura - this.cutSetting.fadeOut
                }
            }
        }
    }

    private _end() {
        if (this.loop) {
            this._endLoop = true;
            this._video.pause();
            this.gotoAndStop(null)
        }
        this._isEnded = true;
        this.node.emit('ended');
        if (this.endCallBack) {
            this.endCallBack();
        }
        this._drawGraphics();

        cc.game.off("stageVisibilityChange", this._onBackStageRecover.bind(this), this);
    }

    private _canplaythrough() {
        if (cc.isValid(this)) {
            if (!this._playThrough) {
                this._playThrough = true;
                this._changePlayRate();
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    this._video.currentTime = 0.03;
                }
                if (this._elapsedTime > this._video.currentTime || this.cutSetting && this.cutSetting.cutFrom) {
                    this.currentTime = this._elapsedTime * this.playbackRate * 1e3
                    setTimeout(() => {
                        this._drawGraphics()
                    }, 20);
                }
            }
            if (this.node.activeInHierarchy && this.enabled) {
                cc.director.resume();
            }
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            if (this._playing) {
                this.play();
            }
        }

    }
    private _drawGraphics() {
        this._video.renderCanvas()
    }

    private _changeVolumeCount = 0;
    protected update(dt: number): void {
        let width = this.node.width;
        let height = this.node.height
        if (!this._isEnded && this._playing) {
            this._changeVolumeCount++;
            if (this._changeVolumeCount >= 2) {
                this._changeVolume();
                this._changeVolumeCount = 0;
            }
        }
        if (this._video) {
            this._video.Update(dt);
        }
        this.node.width = width;
        this.node.height = height;
    }

    public play(data: { loop: boolean, isAuto: boolean } = null) {

        if (cc.isValid(this)) {
            if (data) {
                this._setPlayConfig(data);
                this.isAutoPlay = this.isAutoPlay
            }

            this._playing = true;
            this._isEnded = false;
            this._elapsedTime = 0;
            if (this._playThrough) {
                this.HiddenLoading();
                cc.game.on("stageVisibilityChange", this._onBackStageRecover.bind(this), this);
                if (AudioManager.instance.canPlayAudio && this.cutSetting && (this.cutSetting.fadeIn || this.cutSetting.fadeOut)) {
                    this._originalVolume = this.initVolume;
                    if (this.cutSetting.fadeIn) {
                        this.volume = 0;
                    }
                }
                cc.game.on('audioUnlock', this._onAudioUnlock.bind(this), this);
                this.muted = this._muted;
                this._video.play();
            } else {
                this.ShowLoading();
                //cc.director.pause();
                this._timer = setTimeout(() => {
                    cc.log("------------------------videoResume");
                    cc.director.resume();
                    this._playThrough = true;
                    this._canplaythrough();
                }, 3e3);
            }
        }

    }
    private _changeVolume() {
        var cut = this.cutSetting, cut2 = this.cutSetting;
        const time = this.currentTime;

        ((cut = this.cutSetting) == null ? void 0 : cut.fadeIn) && time <= this.cutSetting.fadeIn && (this.volume = this._originalVolume * time / this.cutSetting.fadeIn);
        ((cut2 = this.cutSetting) == null ? void 0 : cut2.fadeOut) && time >= this.cutSetting.fadeOutStart && (this.volume = this._originalVolume * (1 - (time - this.cutSetting.fadeOutStart) / this.cutSetting.fadeOut));
    }
    public stop() {
        this.HiddenLoading();
        this._playing = false;
        this._video.pause();
        this._removeEvents();
    }
    private _removeEvents() {
        if (AudioManager.instance.canPlayAudio)
            cc.game.off('audioUnlock', this._onAudioUnlock.bind(this), this)
    }
    public gotoAndStop(time: number) {

        let t = time || 0;

        const video = this._video
        if (this._endLoop && t === 0) {
            this._endLoop = false;
            this._elapsedTime = 0;
            this._videoElem0.currentTime = this._videoElem1.currentTime = 0;
            setTimeout(() => {
                video.pause();
                if (video.videoElement == this._videoElem0) {
                    this._videoElem0.removeEventListener("stalled", this._onStalled.bind(this));
                    this._videoElem0.addEventListener("stalled", this._onStalledLoad.bind(this));
                    this._videoElem1.removeEventListener("stalled", this._onStalledLoad.bind(this));
                    this._videoElem1.addEventListener("stalled", this._onStalled.bind(this));
                    video.videoElement = this._videoElem1;
                    video.webGLVideo = this._webGLVideo1;
                    video.internalTexture = this._texture1;
                } else {
                    if (video.videoElement === this._videoElem1) {
                        this._videoElem1.removeEventListener("stalled", this._onStalled.bind(this));
                        this._videoElem1.addEventListener("stalled", this._onStalledLoad.bind(this));
                        this._videoElem0.removeEventListener("stalled", this._onStalledLoad.bind(this));
                        this._videoElem0.addEventListener("stalled", this._onStalled.bind(this));
                        video.videoElement = this._videoElem0;
                        video.webGLVideo = this._webGLVideo0;
                        video.internalTexture = this._texture0;
                    }
                }
                this.volume = this.initVolume;
                this.muted = this._muted;
                this._video.play();
                let w = this.node.width;
                let h = this.node.height;
                this._sprite.spriteFrame = new cc.SpriteFrame(video.internalTexture);
                this.node.width = w;
                this.node.height = h;
            }, 50);
        } else {
            cc.game.off("stageVisibilityChange", this._onBackStageRecover.bind(this), this);
            t = Math.max(0, t) * this.playbackRate;
            cc.log("------------gotoAndStop", this.name, t, this._elapsedTime);
            if (video.readyState !== 0 && Math.abs(t - this.currentTime) > 100) {
                this.currentTime = Math.min(t, (video.duration - 0.1) * 1e3)
            }
        }

    }
    private _setPlayConfig(data) {
        //data.duration && (this.duration = data.duration);
        data.loop && (this.loop = data.loop);
    }
    destroy(): boolean {
        if (cc.isValid(this)) {
            this.stop();
            cc.game.off("stageVisibilityChange", this._onBackStageRecover.bind(this), this);
            this._removeEventListener(this._video.videoElement);
            this._video.destroy();
            if (this.loop) {
                this._removeEventListener(this._videoElem1);
                this._video1.destroy();
            }
        }
        return super.destroy();
    }

    private _loadingSpr: cc.Node = null;
    private _loadAngle: number = 0;
    get loadAngle() {
        return this._loadAngle;
    }
    set loadAngle(value) {
        this._loadAngle = value;
        let dangle = 360 / 8;
        this._loadingSpr.angle = Math.floor(value / dangle) * dangle;
    }
    private ShowLoading() {
        this._loadingSpr.active = true;
    }
    private HiddenLoading() {
        this._loadingSpr.active = false;
    }

    private initLoading() {
        let strImg = "data:image/png;base64,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";
        let img = new Image();
        img.src = strImg
        let texture = new cc.Texture2D();
        texture.initWithElement(img);
        texture.handleLoadedTexture();
        this._loadingSpr = new cc.Node();
        this.node.addChild(this._loadingSpr)
        this._loadingSpr.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);

        ActionUtil.RunRoatate(this._loadingSpr);
        cc.tween<VideoPlayerSprite>(this)
            .by(2, { loadAngle: 360 })
            .repeatForever()
            .start();

        this.HiddenLoading();
    }
}
