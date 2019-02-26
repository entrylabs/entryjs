import { IRawObject } from '../atlas/model/IRawObject';
import { IRawPicture } from '../atlas/model/IRawPicture';

declare let Entry:any;
var w:any = window;
export class PIXIDebugHelper {
    static printPicSize() {
        var arr:any[] = [];
        var s:IRawObject[] = Entry.exportProject().objects;
        s.forEach((o:IRawObject)=>{
            o.sprite.pictures.forEach((pic:IRawPicture)=>{
                var obj:any = {};
                obj.name = pic.name;
                obj.w = pic.dimension.width;
                obj.h = pic.dimension.height;
                arr.push(obj);
            });
        });
        console.log("[DebugHelper::printPicSize()] ---------");
        console.log(arr);
    }
}
