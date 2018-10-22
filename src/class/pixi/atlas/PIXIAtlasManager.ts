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

    pack() {
        _.each(this._sceneID_sceneBin_map, (sceneBins:SceneBins, sceneID:string)=>{
            sceneBins.pack();
        });
    }

    activateScene(sceneID:string) {
        if(this._activatedScene) {
            this._activatedScene.deactivate();
        }
        this._activatedScene = this._getSceneBin(sceneID);
        this._activatedScene.activate();
    }


    getTexture(sceneID:string, path:string):Texture {
        return this._sceneID_sceneBin_map[sceneID].getTexture(path);
    }

    getTextureWithModel(sceneID:string, pic:IRawPicture):Texture {
        this.imageLoader.load(pic);
        this._addPicAtScene(sceneID, pic);
        return this.getTexture(sceneID, pic.fileurl || pic.filename);
    }

    _addPicAtScene(sceneID:string, pic:IRawPicture):void {
        this._getSceneBin(sceneID)
            .addPicInfo(pic)
            .pack();
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

    private gcTexture():void {
        if(!this._invalidate) return;

        var arrObj:any[] = Entry.container.getAllObjects();
        var allPathSet:PrimitiveSet = new PrimitiveSet();
        var scenePathMap:{[sceneID:string]:PrimitiveSet} = {};
        _.each(arrObj, (obj:any, index:number)=>{
            console.log(obj);
            var pics:IRawPicture[] = obj.pictures;
            if(!pics || !pics.length) return;

            var sceneID:string = obj.scene.id;
            var scenePathSet:PrimitiveSet = scenePathMap[sceneID];
            if(!scenePathSet) {
                scenePathMap[sceneID] = scenePathSet = new PrimitiveSet();
            }
            _.each(pics, (pic:IRawPicture)=>{
                var path = pic.filename || pic.fileurl;
                allPathSet.put(path);
                scenePathSet.put(path);
            });
        });

        _.each(this._sceneID_sceneBin_map,(bin:SceneBins, sceneID:string):void => {
            bin.invalidate(scenePathMap[sceneID]);
        });

        // _.each(scenePathMap, (pathSet:PrimitiveSet, sceneID:string)=>{
        //     console.log("loop :: ", sceneID);
        //     var bin:SceneBins = this._getSceneBin(sceneID, false);
        //     if(!bin) return;
        //     bin.invalidate(pathSet);
        // });

        this.imageLoader.invalidate(allPathSet);
        this._invalidate = false;
    }

    requestInvalidate():void {
        console.log("requestInvalidate");
        if(this._invalidate) return;
        this._invalidate = true;
        this._timer.timeout(500, ()=>{
            this.gcTexture();
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


