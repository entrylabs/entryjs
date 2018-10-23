import { IRawPicture } from '../model/IRawPicture';

declare let Entry:any;
declare let _:any;

enum LoadingState {
    NONE = 1,
    LOADING = 2,
    COMPLETE = 3,
    DESTROYED = 4
}


export class AtlasImageLoadingInfo {

    loadState:LoadingState = LoadingState.NONE;
    img:HTMLImageElement;

    /**  계산된 이미지 경로. */
    private _realPath:string;

    /**  picture json 에 정의된 경로. fileurl or filename */
    private _rawPath:string;

    constructor(model:IRawPicture, private _onLoadCallback:(info:AtlasImageLoadingInfo) => void) {
        this._realPath = this._getImageSrc(model);
        this._rawPath = model.fileurl || model.filename;
    }

    load() {
        if(this.loadState != LoadingState.NONE) return;
        this.loadState = LoadingState.LOADING;
        var img:HTMLImageElement = new Image();
        this.img = img;

        Entry.Loader.addQueue();

        img.onload = ()=>{
            Entry.Loader.removeQueue();
            if( this.loadState == LoadingState.DESTROYED ) return;
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

    /** pictureModel.fileurl or pictureModel.filename **/
    get path():string { return this._rawPath; }

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

    destroy() {
        this.loadState = LoadingState.DESTROYED;
        console.log("[AtlasInfo::destroy] " + this._rawPath);
        this.img.onload = this.img.onerror = null;
        this.img = null;
        this._rawPath = this._realPath = null;
    }
}


