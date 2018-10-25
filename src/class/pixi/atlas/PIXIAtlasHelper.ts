import { IRawPicture } from './model/IRawPicture';
import { PrimitiveSet } from './structure/PrimitiveSet';


declare let Entry:any;
declare let _:any;

class _PIXIAtlasHelper {
    /**
     * rawData.fileurl || rawData.filename
     * @param rawData
     */
    getRawPath(rawData:IRawPicture):string {
        return rawData.fileurl || rawData.filename;
    }

    /**
     * EntryObject를 전부 조회하여 지정된 장명에서 사용하는 picture의 경로 set 객체를 리턴.
     * @param sceneID
     */
    getScenePathSet(sceneID:string):PrimitiveSet {

        var arrObj:any[] = Entry.container.getAllObjects();
        var pathSet = new PrimitiveSet();

        var LEN = arrObj.length;
        var LEN2;
        var pics:IRawPicture[];
        var obj:any;
        var nowSceneID:string;
        for (var i = 0; i < LEN; i++) {
            obj = arrObj[i];
            pics = obj.pictures;
            nowSceneID = obj.scene.id;
            if (!pics || !(LEN2 = pics.length)) return;
            for (var j = 0; j < LEN2; j++) {
                pathSet.put(this.getRawPath(pics[j]));
            }
        }
    }


}


export let PIXIAtlasHelper:_PIXIAtlasHelper = new _PIXIAtlasHelper();
