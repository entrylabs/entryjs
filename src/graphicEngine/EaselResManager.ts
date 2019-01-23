import { IGEResManager } from './IGEResManager';
import { IRawPicture } from '../class/pixi/atlas/model/IRawPicture';
import { AtlasImageLoader } from '../class/pixi/atlas/loader/AtlasImageLoader';
import { AtlasImageLoadingInfo } from '../class/pixi/atlas/loader/AtlasImageLoadingInfo';
import { PIXIAtlasHelper } from '../class/pixi/atlas/PIXIAtlasHelper';

export class EaselResManager implements IGEResManager {

    private _imgLoader:AtlasImageLoader;
    private _MAX_TEX_RECT = {x:0, y:0, width:99999, height:99999 };

    INIT():void {
        this._imgLoader = new AtlasImageLoader(this._onImageLoad.bind(this));
    }

    private _onImageLoad(info:AtlasImageLoadingInfo):void {
        //do nothing
    }

    imageRemoved(reason:string):void {
        this._imgLoader.requestSync();
    }

    activateScene(sceneID:string):void {
        //do nothing
    }

    reqResource(spriteNullable:PIXI.Sprite | any, sceneID:string, pic:IRawPicture):void {
        const loader = this._imgLoader;
        let path = PIXIAtlasHelper.getRawPath(pic);
        let info = loader.getImageInfo(path);
        if(!info) {
            loader.load(pic,  PIXIAtlasHelper.getNewImageRect(pic, this._MAX_TEX_RECT));
            info = loader.getImageInfo(path);
        }
        if(spriteNullable) {
            spriteNullable.image = info.source();
        }
    }

    clearProject():void {
        this._imgLoader.empty();
    }

    removeScene(sceneID:string):void {
        this._imgLoader.requestSync();
    }

}