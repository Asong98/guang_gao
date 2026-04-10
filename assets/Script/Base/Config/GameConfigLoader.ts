
import AudioManager from '../Components/AudioManager'
import { BaseBooleanValue, BaseColorValue, BaseIntValue, BaseNumberValue, BaseStringValue , createConfigs } from './GameConfigTypes'
const { ccclass , executionOrder } = cc._decorator

const baseGameConfig = {
    global : {
        props : {}
    }
}

@ccclass
@executionOrder(-Infinity)
export default class GameConfigLoader extends cc.Component {
    static instance : GameConfigLoader = null

    config : any = null

    constructor() {
        super()
        GameConfigLoader.instance = this
    }
    
    onLoad(){

        this.config = window['gameConfig'] || createConfigs(baseGameConfig)

        if(!this.config){
            return
        }

        this.initProps()
        this.initAudios()
    }

    private initProps(){

        const baseComponents = [
            ...cc.Canvas.instance.getComponents(BaseConfigComponent),
            ...cc.Canvas.instance.getComponentsInChildren(BaseConfigComponent)
        ]

        baseComponents.forEach((component)=>{
            const froms = component.__from || {}
            Object.keys( froms ).forEach((propertyName)=>{
                const { value , finded } = GameConfigLoader.getValueByPath( this.config , froms[propertyName])

                if(!finded){
                    return
                }

                if(typeof value=='object' && value.type){
                    switch(value.type){
                        case 'number':
                        case 'boolean':
                        case 'int':
                        case 'string':
                            component[propertyName] = value.value
                            break
                        case 'color':
                            component[propertyName] = cc.color(value.value)
                            break
                    }
                }
                else{
                    component[propertyName] = value
                }
            })
        })
    }

    private initAudios(){
        let allAudioConfig = {}

        for(let configName in this.config){
            if(this.config[configName].audios){
                Object.assign(allAudioConfig, this.config[configName].audios)
            }
        }

        if(AudioManager.instance.bgm){
            const audioUrl = AudioManager.instance.bgm.url
        
            if(audioUrl && audioUrl.match(/\/[^\/]+$/)){
                const bgmKey = audioUrl.match(/\/[^\/]+$/)[0].slice(1).match(/^[^\.]+/)[0].replace(/-/g,'')
                if(allAudioConfig[bgmKey]){
                    AudioManager.instance.bgmRelativeVolume = allAudioConfig[bgmKey].volume
                }
            }
        }

        AudioManager.instance.audios.forEach((audio)=>{
            if(audio.audioClip && audio.audioClip.url && audio.audioClip.url.match(/\/[^\/]+$/)){
                const audioKey = audio.audioClip.url.match(/\/[^\/]+$/)[0].slice(1).match(/^[^\.]+/)[0].replace(/-/g,'')
                if(allAudioConfig[audioKey]){
                    audio.relativeVolume = allAudioConfig[audioKey].volume
                }
            }
        })
    }

    private static getValueByPath(obj:any , path:string){

        const pathArr = path.split('.').map(value=>value.trim())
        const result = {
            finded : false,
            value : null,
        }

        for(let i=0,tempValue=obj ; i<pathArr.length ; i++){
            const name = pathArr[i]

            if(tempValue && name in tempValue){
                tempValue = tempValue[name]
                if(i===pathArr.length-1){
                    result.finded = true
                    result.value = tempValue
                }
            }
            else{
                break
            }
        }

        return result
    }

    static setValueToPath(obj:any , path:string,value:any){
        const pathArr = path.split('.').map(value=>value.trim())
        let tempObj=obj
        for(let i=0 ; i<pathArr.length-1 ; i++){
            const name = pathArr[i]
            if( ! tempObj[name] ){
                tempObj[name] = {}
            }

            tempObj = tempObj[name]
        }

        tempObj[pathArr[pathArr.length-1]] = value
    }
}


window['__GameConfigLoader'] = GameConfigLoader

export class BaseConfigComponent extends cc.Component {
    __from !: Record<string,string>
}

export function from(path:string , value : string|number|boolean|BaseBooleanValue|BaseNumberValue|BaseIntValue|BaseStringValue|BaseColorValue = ''){
    return function (Class: BaseConfigComponent, propertyName: string) {

        GameConfigLoader.setValueToPath(baseGameConfig, path , value)
        createConfigs(baseGameConfig)

        Class.__from = Class.__from || {}
        Class.__from[propertyName] = path
    }
}

export function isXJDownload(){
    return function (Class: BaseConfigComponent, propertyName: string) {
        if( ! Class.__from || !Class.__from[propertyName] ){
            console.error('@isXJDownload() 必须在 @from() 前面')
        }
        else{
            (baseGameConfig.global as any).__XJ_transformTextPath = Class.__from[propertyName]
            createConfigs(baseGameConfig)
        }
    }
}





