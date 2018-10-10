import { IRawObject } from './model/IRawObject';
import { SceneBins, TextureMap } from './SceneBins';
import Texture = PIXI.Texture;
import Sprite = PIXI.Sprite;


//underscore
declare let _:any;

declare let $:any;


var ccc:any[] = (window as any).ccc = [];



type SceneBinsMap = {[key:string]: SceneBins};

export class PIXIAtlasManager {

    private static _globalTextureMap:TextureMap = {};
    private static _sceneBinsMap:SceneBinsMap = {};
    private static _activatedScene:SceneBins;

    static loadProject(objects:IRawObject[]) {
        console.log("loadProject");
        var sceneBinsMap:SceneBinsMap = this._sceneBinsMap;
        var sceneBins:SceneBins;
        var obj:IRawObject;
        var sceneID;
        var LEN = objects.length;
        for (var i = 0 ; i < LEN ; i++) {
            obj = objects[i];
            sceneID = obj.scene;
            sceneBins = sceneBinsMap[sceneID];
            if(!sceneBins) {
                sceneBins = sceneBinsMap[sceneID] = new SceneBins(sceneID, this._globalTextureMap);
            }
            sceneBins.addRawPicInfos(obj.sprite && obj.sprite.pictures);
        }

        this.pack();
    }

    static pack() {
        _.each(this._sceneBinsMap, (sceneBins:SceneBins, id:string)=>{
            sceneBins.pack();
        });
    }

    static activateScene(sceneID:string) {
        if(this._activatedScene) {
            this._activatedScene.deactivate();
        }
        console.log("active scene");
        console.log(sceneID);

        this._activatedScene = this._sceneBinsMap[sceneID];
        this._activatedScene.activate();
    }

    static getTexture(id:string):Texture {
        return this._globalTextureMap[id];
        // return this._activatedScene.getTexture(id);
    }

    static newSprite(id:string):Sprite {
        return new Sprite(this._activatedScene.getTexture(id));
    }

    static putImage(picID:string, image:HTMLImageElement ):void {
        // var texture:Texture = this._textureMap[picID];
        // var canvas:HTMLCanvasElement = texture.baseTexture.source as HTMLCanvasElement;
        // var ctx:CanvasRenderingContext2D = canvas.getContext("2d");
        // var r = texture.frame;
        // ctx.drawImage(image, 0, 0, image.width, image.height, r.x, r.y, r.width, r.height);
        // texture.baseTexture.update();
    }

    static clearProject():void {

    }


}
