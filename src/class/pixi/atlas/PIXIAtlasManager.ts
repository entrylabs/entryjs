import { IRawObject } from './model/IRawObject';
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

    /** @readonly */
    public imageLoader:AtlasImageLoader;

    private _viewer:AtlasCanvasViewer;
    private _invalidate:boolean;
    private _timer:TimeoutTimer;

    /**
     * @private
     * @constructor
     */
    public INIT() {
        if(this.imageLoader) {
            throw new Error("do not call twice");
        }
        this._timer = new TimeoutTimer();
        this._viewer = new AtlasCanvasViewer();
        this.imageLoader = new AtlasImageLoader(this._onImageLoaded.bind(this));
    }

    private _onImageLoaded(info:AtlasImageLoadingInfo) {
        this._activatedScene && this._activatedScene.putImage(info);
    }

    loadProject(objects:IRawObject[]) {
        // console.log("PIXIAtlasManager - loadProject");
        // if(1)return;
        // var sceneBins:SceneBins;
        // var obj:IRawObject;
        // var sceneID;
        // var LEN = objects.length;
        // for (var i = 0 ; i < LEN ; i++) {
        //     obj = objects[i];
        //     sceneID = obj.scene;
        //     sceneBins = this._getSceneBin(obj.scene);
        //     sceneBins.addRawPicInfos(obj.sprite && obj.sprite.pictures);
        // }
    }

    activateScene(sceneID:string) {
        console.log("PIXIAtlasManager - activateScene");
        if(this._activatedScene) {
            this._activatedScene.deactivate();
        }
        this._activatedScene = this._getSceneBin(sceneID);
        this._activatedScene.activate(this._getActivatedScenePathSet());
    }

    getTextureWithModel(sceneID:string, pic:IRawPicture):Texture {
        this.imageLoader.load(pic);
        var bin:SceneBins = this._getSceneBin(sceneID);
        bin.addPicInfo(pic);
        return bin.getTexture(pic.fileurl || pic.filename);
    }

    private _getSceneBin(sceneID:string, createIfNotExist:boolean = true):SceneBins {
        var s:SceneBins = this._sceneID_sceneBin_map[sceneID];
        if(!s && createIfNotExist) {
            s = this._sceneID_sceneBin_map[sceneID] = new SceneBins(sceneID, this._viewer);
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
            console.log(pics);
            if(!pics || !pics.length) return;

            var sceneID:string = obj.scene.id;

            _.each(pics, (pic:IRawPicture)=>{
                var path = pic.filename || pic.fileurl;
                allPathSet.put(path);
                console.log(sceneID, activatedSceneID);
                if(sceneID == activatedSceneID) {
                    activatedScenePathSet.put(path);
                }
            });
        });
        this.imageLoader.invalidate(allPathSet);
        return activatedScenePathSet;
    }

    requestInvalidate():void {
        if(this._invalidate) return;
        this._invalidate = true;
        this._timer.timeout(500, ()=>{
            this._gcTexture();
        });
    }

    clearProject():void {

    }
}

export let PIXIAtlasManager:_PIXIAtlasManager = new _PIXIAtlasManager();

PIXIAtlasManager.INIT();
var w:any = window;
w.PIXIAtlasManager = PIXIAtlasManager;
w.PIXIDebugHelper = PIXIDebugHelper;


