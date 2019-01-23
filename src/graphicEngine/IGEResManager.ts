import { IRawPicture } from '../class/pixi/atlas/model/IRawPicture';

export interface IGEResManager {
    INIT():void;
    activateScene(sceneID:string):void;
    removeScene(sceneID:string):void;
    imageRemoved(reason:string):void;
    clearProject():void

    /**
     * textrue( or createjs.Bitmap ) 를 요청하고, spriteNullable 에 할당.
     * @param spriteNullable
     * @param sceneID
     * @param pic
     */
    reqResource(spriteNullable:PIXI.Sprite|any, sceneID:string, pic:IRawPicture):void;
}