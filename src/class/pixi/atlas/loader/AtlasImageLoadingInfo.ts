import { IRawPicture } from '../model/IRawPicture';

declare let Entry:any;
declare let _:any;


enum LoadingState {
    NONE = 1,
    LOADING = 2,
    COMPLETE = 3
}


export class AtlasImageLoadingInfo {

    loadState:LoadingState = LoadingState.NONE;
    img:HTMLImageElement;

    private _refPicID:SetStructure = new SetStructure();
    private _realPath:string;
    private _modelPath:string;

    constructor(model:IRawPicture, private _onLoadCallback:(info:AtlasImageLoadingInfo) => void) {
        this._realPath = this._getImageSrc(model);
        this._modelPath = model.fileurl || model.filename;
    }


    addRefModel(model:IRawPicture) {
        this._refPicID.put(model.id);
    }

    removeRefModel(model:IRawPicture) {
        this._refPicID.remove(model.id);
    }

    eachRefID(callback:(value:string)=>void) {
        this._refPicID.each(callback);
    }


    load() {
        if(this.loadState != LoadingState.NONE) return;
        this.loadState = LoadingState.LOADING;
        var img:HTMLImageElement = new Image();
        this.img = img;

        img.onload = ()=>{
            this.loadState = LoadingState.COMPLETE;
            this._onLoadCallback(this);
            this._onLoadCallback = null;
            this._realPath = null;
            img.onload = null;
        };

        img.src = this._realPath;
    }

    get isReady() {
        return this.loadState == LoadingState.COMPLETE;
    }


    private _getImageSrc(picture:IRawPicture) {
        if (picture.fileurl) return picture.fileurl;

        var fileName = picture.filename;
        return (
            Entry.defaultPath +
            '/uploads/' +
            fileName.substring(0, 2) +
            '/' +
            fileName.substring(2, 4) +
            '/image/' +
            fileName +
            '.png'
        );
    }

}


class SetStructure {
    private _map:any = {};
    hasValue(value:string):boolean {
        return this._map[value];
    }
    put(value:string) {
        this._map[value] = true;
    }

    remove(value:string) {
        delete this._map[value];
    }

    each(callback:(value:string)=>void) {
        _.each(this._map, (v:boolean, key:string)=>{
            callback(key);
        });
    }
}