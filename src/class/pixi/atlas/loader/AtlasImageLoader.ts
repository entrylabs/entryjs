import { AtlasImageLoadingInfo } from './AtlasImageLoadingInfo';
import { IRawPicture } from '../model/IRawPicture';


type LoadingInfoMap = {[key:string]:AtlasImageLoadingInfo};


export class AtlasImageLoader {

    private _path_info_map:LoadingInfoMap = {};

    constructor(private _onLoadCallback:(info:AtlasImageLoadingInfo) => void) {
    }

    load(model:IRawPicture) {
        var path = model.filename || model.fileurl;
        var info:AtlasImageLoadingInfo = this._path_info_map[path];

        if(info) return;

        info = new AtlasImageLoadingInfo(model, this._onLoadCallback);
        this._path_info_map[path] = info;
        info.load();
    }

    getImageInfo(rawPath:string):AtlasImageLoadingInfo {
        return this._path_info_map[rawPath];
    }


}