import { IRawObject } from './model/IRawObject';
import { SceneBins, TextureMap } from './SceneBins';
import Texture = PIXI.Texture;
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoader } from './loader/AtlasImageLoader';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';


declare let _:any;


type SceneBinsMap = {[key:string]: SceneBins};

export class PIXIAtlasManager {

    private static _path_tex_globalMap:TextureMap = {};
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
        var sceneBinsMap:SceneBinsMap = this._sceneID_sceneBin_map;
        var sceneBins:SceneBins;
        var obj:IRawObject;
        var sceneID;
        var LEN = objects.length;
        for (var i = 0 ; i < LEN ; i++) {
            obj = objects[i];
            sceneID = obj.scene;
            sceneBins = sceneBinsMap[sceneID];
            if(!sceneBins) {
                sceneBins = sceneBinsMap[sceneID] = new SceneBins(sceneID, this._path_tex_globalMap, this._viewer);
            }
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


    static clearProject():void {

    }
}

PIXIAtlasManager.INIT();

