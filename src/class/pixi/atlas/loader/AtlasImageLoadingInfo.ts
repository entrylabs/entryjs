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

    private _triedCnt:number = 0;
    private _picName:string;

    constructor(model:IRawPicture, private _onLoadCallback:(info:AtlasImageLoadingInfo) => void) {
        this._realPath = this._getImageSrc(model);
        this._rawPath = model.fileurl || model.filename;
        this._picName = model.name;
    }

    load() {
        if(this.loadState != LoadingState.NONE) return;
        this.loadState = LoadingState.LOADING;
        var img:HTMLImageElement = new Image();
        this.img = img;

        img.onload = ()=>{
            Entry.Loader.removeQueue();
            if( this.loadState == LoadingState.DESTROYED ) return;
            this.loadState = LoadingState.COMPLETE;
            this._onLoadCallback(this);
            this._onLoadCallback = null;
            this._realPath = null;
            img.onload = null;
        };

        img.onerror = (err) => {
            Entry.Loader.removeQueue();
            if( this.loadState == LoadingState.DESTROYED ) return;
            if (!this._triedCnt) {
                if (Entry.type !== 'invisible') {
                    console.log('err=', this._picName, 'load failed');
                }
                this._triedCnt = 1;
                this._loadPath(this._realPath);
            } else if (this._triedCnt < 3) {
                this._triedCnt++;
                this._loadPath(Entry.mediaFilePath + '_1x1.png');
            } else {
                //prevent infinite call
                img.onerror = null;
            }
        };
        this._loadPath(this._realPath);
    }

    private _loadPath(path:string) {
        if(this.loadState == LoadingState.DESTROYED) return;
        Entry.Loader.addQueue();
        this.img.src = path;
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


