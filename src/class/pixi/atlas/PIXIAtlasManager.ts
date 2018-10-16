import { IRawObject } from './model/IRawObject';
import { SceneBins, TextureMap } from './SceneBins';
import Texture = PIXI.Texture;
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoader } from './loader/AtlasImageLoader';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { IRawPicture } from './model/IRawPicture';


declare let _:any;


type SceneBinsMap = {[key:string]: SceneBins};

export class PIXIAtlasManager {

    private static _sceneID_sceneBin_map:SceneBinsMap = {};
    private static _activatedScene:SceneBins;

    /** @readonly */
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
        var sceneBins:SceneBins;
        var obj:IRawObject;
        var sceneID;
        var LEN = objects.length;
        for (var i = 0 ; i < LEN ; i++) {
            obj = objects[i];
            sceneID = obj.scene;
            sceneBins = this._getSceneBin(obj.scene);
            sceneBins.addRawPicInfos(obj.sprite && obj.sprite.pictures);
        }
        this.pack();
    }

    static pack() {
        _.each(this._sceneID_sceneBin_map, (sceneBins:SceneBins, sceneID:string)=>{
            sceneBins.pack();
        });
    }

    static activateScene(sceneID:string) {
        if(this._activatedScene) {
            this._activatedScene.deactivate();
        }
        this._activatedScene = this._getSceneBin(sceneID);
        this._activatedScene.activate();
    }


    static getTexture(sceneID:string, path:string):Texture {
        return this._sceneID_sceneBin_map[sceneID].getTexture(path);
    }

    static getTextureWithModel(sceneID:string, pic:IRawPicture):Texture {
        this.imageLoader.load(pic);
        this._addPicAtScene(sceneID, pic);
        return this.getTexture(sceneID, pic.fileurl || pic.filename);
    }



    static _addPicAtScene(sceneID:string, pic:IRawPicture):void {
        this._getSceneBin(sceneID)
            .addPicInfo(pic)
            .pack();
    }

    private static _getSceneBin(sceneID:string, createIfNotExist:boolean = true):SceneBins {
        var s:SceneBins = this._sceneID_sceneBin_map[sceneID];
        if(!s && createIfNotExist) {
            s = this._sceneID_sceneBin_map[sceneID] = new SceneBins(sceneID, this._viewer);
        }
        return s;
    }

    static removeScene(sceneID:string):void {
        var s:SceneBins = this._getSceneBin(sceneID, false);
        if(!s) return;
        if(this._activatedScene == s ) {
            this._activatedScene = null;
        }
        s.destroy();
        delete this._sceneID_sceneBin_map[sceneID];
    }


    static clearProject():void {

    }
}

PIXIAtlasManager.INIT();

