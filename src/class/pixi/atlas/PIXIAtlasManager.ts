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
            sceneBins = this.getSceneBin(obj.scene);
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
        this._activatedScene = this._sceneID_sceneBin_map[sceneID];
        this._activatedScene.activate();
    }


    static getTexture(sceneID:string, path:string):Texture {
        return this._sceneID_sceneBin_map[sceneID].getTexture(path);
    }

    static addPicAtScene(sceneID:string, pic:IRawPicture):void {
        this.getSceneBin(sceneID)
            .addPicInfo(pic)
            .pack();
    }

    private static getSceneBin(sceneID:string):SceneBins {
        var s:SceneBins = this._sceneID_sceneBin_map[sceneID];
        if(!s) {
            s = this._sceneID_sceneBin_map[sceneID] = new SceneBins(sceneID, this._viewer);
        }
        return s;
    }


    static clearProject():void {

    }
}

PIXIAtlasManager.INIT();

