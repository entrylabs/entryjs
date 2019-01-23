import { IRawPicture } from './model/IRawPicture';
import { PrimitiveSet } from './structure/PrimitiveSet';
import { ImageRect } from '../../maxrect-packer/geom/ImageRect';
import { autoFit } from '../utils/AutoFit';

interface ISimpleRect {
    x:number; y:number; width:number, height:number;
}

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
     * EntryObject를 전부 조회하여 지정된 장면에서 사용하는 picture의 경로 set 객체를 리턴.
     * @param sceneID
     */
    getScenePathSet(sceneID:string):PrimitiveSet {
        var arrObj:any[] = Entry.container.getAllObjects();
        var pathSet = new PrimitiveSet();

        var LEN = arrObj.length;
        var LEN2;
        var pics:IRawPicture[];
        var obj:any;
        for (var i = 0; i < LEN; i++) {
            obj = arrObj[i];
            if( sceneID != obj.scene.id ) continue;
            pics = obj.pictures;
            if (!pics || !(LEN2 = pics.length)) continue;
            for (var j = 0; j < LEN2; j++) {
                pathSet.put(this.getRawPath(pics[j]));
            }
        }
        return pathSet;
    }

    getNewImageRect(pic:IRawPicture, texMaxRect:ISimpleRect):ImageRect {
        let w = pic.dimension.width,
            h = pic.dimension.height;
        let r = new ImageRect(0,0, w, h);
        if(w > texMaxRect.width || h > texMaxRect.height ) {
            autoFit.fit(texMaxRect, r, autoFit.ScaleMode.INSIDE, autoFit.AlignMode.TL);
            r.width = Math.ceil(r.width);
            r.height = Math.ceil(r.height);
            r.scaleFactor = w / r.width;
            r.scaleFactorX = w / r.width;
            r.scaleFactorY = h / r.height;
        }
        return r;
    }


}


export let PIXIAtlasHelper:_PIXIAtlasHelper = new _PIXIAtlasHelper();
