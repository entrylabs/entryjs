import { SceneBins } from './SceneBins';
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoader } from './loader/AtlasImageLoader';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { IRawPicture } from './model/IRawPicture';
import Texture = PIXI.Texture;
import { PIXIDebugHelper } from '../helper/PIXIDebugHelper';
import { PrimitiveSet } from './structure/PrimitiveSet';
import { TimeoutTimer } from './TimeoutTimer';


declare let _:any;
declare let Entry:any;


type SceneBinsMap = {[key:string]: SceneBins};

class _PIXIAtlasManager {

    private _sceneID_sceneBin_map:SceneBinsMap = {};
    private _activatedScene:SceneBins;

    private _imageLoader:AtlasImageLoader;

    private _viewer:AtlasCanvasViewer;
    private _invalidate:boolean;
    private _timer:TimeoutTimer;

    /**
     * @private
     * @constructor
     */
    public INIT() {
        if(this._imageLoader) {
            throw new Error("do not call twice");
        }
        this._timer = new TimeoutTimer();
        this._viewer = new AtlasCanvasViewer();
        this._imageLoader = new AtlasImageLoader(this._onImageLoaded.bind(this));
    }

    private _onImageLoaded(info:AtlasImageLoadingInfo) {
        this._activatedScene && this._activatedScene.putImage(info);
    }

    activateScene(sceneID:string) {
        if(this._activatedScene) {
            this._activatedScene.deactivate();
        }
        this._activatedScene = this._getSceneBin(sceneID);
        this._activatedScene.activate(this._getActivatedScenePathSet());
    }

    getTextureWithModel(sceneID:string, pic:IRawPicture):Texture {
        this._imageLoader.load(pic);
        var bin:SceneBins = this._getSceneBin(sceneID);
        bin.addPicInfo(pic);
        return bin.getTexture(pic.fileurl || pic.filename);
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

    private _gcTexture():void {
        if(!this._invalidate) return;
        if(!this._activatedScene) return;

        this._activatedScene.invalidate(this._getActivatedScenePathSet());
        this._invalidate = false;
    }

    private _getActivatedScenePathSet():PrimitiveSet {
        var activatedSceneID:string = this._activatedScene.sceneID;

        var arrObj:any[] = Entry.container.getAllObjects();
        var allPathSet:PrimitiveSet = new PrimitiveSet();
        var activatedScenePathSet = new PrimitiveSet();

        _.each(arrObj, (obj:any, index:number)=>{
            var pics:IRawPicture[] = obj.pictures;
            if(!pics || !pics.length) return;

            var sceneID:string = obj.scene.id;

            _.each(pics, (pic:IRawPicture)=>{
                var path = pic.filename || pic.fileurl;
                allPathSet.put(path);
                if(sceneID == activatedSceneID) {
                    activatedScenePathSet.put(path);
                }
            });
        });
        this._imageLoader.invalidate(allPathSet);
        return activatedScenePathSet;
    }

    requestInvalidate(reason:string):void {
        console.log("AtlasManager::requestInvalidate - "+reason);
        if(this._invalidate) return;
        this._invalidate = true;
        this._timer.timeout(500, ()=>{
            this._gcTexture();
        });
    }

    clearProject():void {
        this._timer.reset();
    }
}

export let PIXIAtlasManager:_PIXIAtlasManager = new _PIXIAtlasManager();

PIXIAtlasManager.INIT();
var w:any = window;
w.PIXIAtlasManager = PIXIAtlasManager;
w.PIXIDebugHelper = PIXIDebugHelper;


