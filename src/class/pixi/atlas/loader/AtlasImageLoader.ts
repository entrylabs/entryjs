import { AtlasImageLoadingInfo } from './AtlasImageLoadingInfo';
import { IRawPicture } from '../model/IRawPicture';
import { PrimitiveSet } from '../structure/PrimitiveSet';


type LoadingInfoMap = {[key:string]:AtlasImageLoadingInfo};

declare let _:any;

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


    invalidate(pathSet:PrimitiveSet) {
        var unusedInfo:AtlasImageLoadingInfo[] = [];
        _.each(this._path_info_map, (info:AtlasImageLoadingInfo, path:string)=>{
            if( pathSet.hasValue(path) ) return;
            unusedInfo.push(info);
        });
        unusedInfo.forEach((info:AtlasImageLoadingInfo)=>{
            delete this._path_info_map[info.path];
            info.destroy();
        });
    }
}