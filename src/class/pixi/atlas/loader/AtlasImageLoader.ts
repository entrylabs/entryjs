import { AtlasImageLoadingInfo } from './AtlasImageLoadingInfo';
import { IRawPicture } from '../model/IRawPicture';
import { PrimitiveSet } from '../structure/PrimitiveSet';
import { TimeoutTimer } from '../../utils/TimeoutTimer';
import { PIXIAtlasHelper } from '../PIXIAtlasHelper';
import { ImageRect } from '../../../maxrect-packer/geom/ImageRect';
import { clog } from '../../utils/logs';

var TIME_OUT_DELAY:number = 1000;

type LoadingInfoMap = {[key:string]:AtlasImageLoadingInfo};

export type ImageLoaderHandler = (info:AtlasImageLoadingInfo)=>void;

declare let _:any;
declare let Entry:any;

export class AtlasImageLoader {

    private _path_info_map:LoadingInfoMap = {};
    private _timer:TimeoutTimer = new TimeoutTimer();
    private _syncRequested:boolean;

    constructor(private _onLoadCallback:ImageLoaderHandler) {
    }

    /**
     * model 의 이미지를 로드 후, rect.scaleFactor가 1이 아닐경우 rect 만큼 리사이즈한 canvas 를 소스로 설정하긔
     * @param model
     * @param imgRect
     * @param subCallback
     */
    load(model:IRawPicture, imgRect:ImageRect) {
        var path = PIXIAtlasHelper.getRawPath(model);
        var info:AtlasImageLoadingInfo = this._path_info_map[path];

        if(info) return;

        info = new AtlasImageLoadingInfo(model, imgRect, this._onLoadCallback);
        this._path_info_map[path] = info;
        info.load();
    }

    getImageInfo(rawPath:string):AtlasImageLoadingInfo {
        return this._path_info_map[rawPath];
    }

    /**
     * 엔트리오브젝트에서 사용중인 이미지 리스트와 싱크를 맞춰 사용하지 않는 이미지 정보를 삭제함.
     */
    private _syncWithEntryObjects() {
        this._syncRequested = false;
        var arrObj:any[] = Entry.container.getAllObjects();
        var allPathSet:PrimitiveSet = new PrimitiveSet();

        var LEN = arrObj.length;
        var LEN2;
        var pics:IRawPicture[];
        var pic:IRawPicture;
        for( var i = 0 ; i < LEN ; i++ ) {
            pics = arrObj[i].pictures;
            if(!pics || !(LEN2 = pics.length)) continue;
            for(var j = 0 ; j < LEN2 ; j++) {
                pic = pics[j];
                allPathSet.put(pic.filename || pic.fileurl);
            }
        }

        let deleteCnt = 0;
        _.each(this._path_info_map, (info:AtlasImageLoadingInfo, path:string)=>{
            if(allPathSet.hasValue(path)) return;
            info.destroy();
            deleteCnt++;
            delete this._path_info_map[path];
        });

        if(deleteCnt>0) {
            clog(`${deleteCnt} image item(s) deleted`);
        }
    }

    /**
     * 로드/케시된 모든 정보를 지움.
     */
    empty() {
        this._timer.reset();
        this._syncRequested = false;
        _.each(this._path_info_map, (info:AtlasImageLoadingInfo, path:string)=>{
            info.destroy();
        });
        this._path_info_map = {};
    }

    requestSync() {
        if(this._syncRequested) return;
        this._syncRequested = true;

        this._timer.timeout(TIME_OUT_DELAY, ()=>{
            this._syncWithEntryObjects();
        });
    }
}