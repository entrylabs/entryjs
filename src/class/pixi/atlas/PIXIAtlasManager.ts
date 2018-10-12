import { IRawObject } from './model/IRawObject';
import { SceneBins, TextureMap } from './SceneBins';
import Texture = PIXI.Texture;
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoader } from './loader/AtlasImageLoader';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';


//underscore
declare let _:any;


type SceneBinsMap = {[key:string]: SceneBins};

export class PIXIAtlasManager {

    private static _globalTextureMap:TextureMap = {};
    private static _sceneBinsMap:SceneBinsMap = {};
    private static _activatedScene:SceneBins;

    public static imageLoader:AtlasImageLoader;

    private static _viewer:AtlasCanvasViewer;



    /**
     * @private
     * @constructor
     */
    public static INIT() {
        if(this.imageLoader) {
            throw new Error("do not call twice");
        }
        this._viewer = new AtlasCanvasViewer();
        this.imageLoader = new AtlasImageLoader(this._onImageLoaded.bind(this));
    }

    private static _onImageLoaded(info:AtlasImageLoadingInfo) {
        this._activatedScene && this._activatedScene.putImage(info);
    }

    static loadProject(objects:IRawObject[]) {
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
                sceneBins = sceneBinsMap[sceneID] = new SceneBins(sceneID, this._globalTextureMap, this._viewer);
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
        this._activatedScene = this._sceneBinsMap[sceneID];
        this._activatedScene.activate();
    }

    static getTexture(id:string):Texture {
        return this._globalTextureMap[id];
    }


    static clearProject():void {

    }
}

PIXIAtlasManager.INIT();

