import { AtlasImageLoadingInfo } from './AtlasImageLoadingInfo';
import { IRawPicture } from '../model/IRawPicture';


type LoadingInfoMap = {[key:string]:AtlasImageLoadingInfo};


export class AtlasImageLoader {

    private _pathMap:LoadingInfoMap = {};
    private _picIDMap:LoadingInfoMap = {};

    constructor(private _onLoadCallback:(info:AtlasImageLoadingInfo) => void) {
    }

    load(model:IRawPicture) {
        var path = model.filename || model.fileurl;
        var info:AtlasImageLoadingInfo = this._pathMap[path];
        if(!info) {
            info = new AtlasImageLoadingInfo(model, this._onLoadCallback);
            this._pathMap[path] = info;
        }
        info.addRefModel(model);
        this._picIDMap[model.id] = info;
        info.load();
    }

    getImageInfo(picID:string):AtlasImageLoadingInfo {
        return this._picIDMap[picID];
    }


}