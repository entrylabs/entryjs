import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import Texture = PIXI.Texture;
import { IRawPicture } from './model/IRawPicture';

export interface ISceneTextures {
    addPicInfo(info:IRawPicture):void;
    activate():void;
    deactivate():void;
    getTexture(path:string):Texture;
    putImage(info:AtlasImageLoadingInfo, forceUpdateBaseTexture?:boolean):void;
    _internal_imageRemoved():void;
    destroy():void;
}


