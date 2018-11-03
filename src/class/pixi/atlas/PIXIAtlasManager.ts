import { SceneBins } from './SceneBins';
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoader } from './loader/AtlasImageLoader';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { IRawPicture } from './model/IRawPicture';
import Texture = PIXI.Texture;
import { PIXIDebugHelper } from '../helper/PIXIDebugHelper';
import { PIXIAtlasHelper } from './PIXIAtlasHelper';

declare let Entry:any;
declare let _:any;


type SceneBinsMap = {[key:string]: SceneBins};

class _PIXIAtlasManager {

    private _sceneID_sceneBin_map:SceneBinsMap = {};
    private _activatedScene:SceneBins;

    private _imageLoader:AtlasImageLoader;

    private _viewer:AtlasCanvasViewer;

    /**
     * @private
     * @constructor
     */
    public INIT() {
        if(this._imageLoader) {
            throw new Error("do not call twice");
        }
        this._viewer = new AtlasCanvasViewer();
        this._imageLoader = new AtlasImageLoader(this._onImageLoaded.bind(this));

        Entry.addEventListener('saveCanvasImage', ()=>{
            this.imageRemoved("canvas image saved");
        });
    }

    private _onImageLoaded(info:AtlasImageLoadingInfo) {
        this._activatedScene && this._activatedScene.putImage(info);
    }

    activateScene(sceneID:string) {
        if(this._activatedScene) {
            this._activatedScene.deactivate();
        }
        this._activatedScene = this._getSceneBin(sceneID);
        this._activatedScene.activate();
    }

    getTextureWithModel(sceneID:string, pic:IRawPicture):Texture {
        var bin:SceneBins = this._getSceneBin(sceneID);
        bin.addPicInfo(pic);
        return bin.getTexture(PIXIAtlasHelper.getRawPath(pic));
    }

    private _getSceneBin(sceneID:string, createIfNotExist:boolean = true):SceneBins {
        var s:SceneBins = this._sceneID_sceneBin_map[sceneID];
        if(!s && createIfNotExist) {
            s = this._sceneID_sceneBin_map[sceneID] = new SceneBins(sceneID, this._imageLoader, this._viewer);
        }
        return s;
    }

    removeScene(sceneID:string):void {
        var s:SceneBins = this._getSceneBin(sceneID, false);
        if(!s) return;
        if(this._activatedScene == s ) {
            this._activatedScene = null;
        }
        s.destroy();
        delete this._sceneID_sceneBin_map[sceneID];
    }


    imageRemoved(reason:string):void {
        console.log("AtlasManager::imageRemoved - "+reason);
        this._activatedScene && this._activatedScene._internal_imageRemoved();
        this._imageLoader.requestSync();
    }

    clearProject():void {
        console.log("clearProject");
        this._imageLoader.empty();
        _.each(this._sceneID_sceneBin_map, (bin:SceneBins)=>{
            bin.destroy();
        });
        this._sceneID_sceneBin_map = {};
        this._activatedScene = null;
    }
}

export let PIXIAtlasManager:_PIXIAtlasManager = new _PIXIAtlasManager();


var w:any = window;
w.PIXIAtlasManager = PIXIAtlasManager;
w.PIXIDebugHelper = PIXIDebugHelper;


