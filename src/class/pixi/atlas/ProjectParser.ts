interface IObjectPicture {
    id:string;
    dimension: { width:number, height:number },
    fileurl:string,
    filename:string,
    name:string,
}
interface IRawObject {
    id: string,
    name: string,
    script: string,
    objectType: string,
    rotateMethod: string,
    scene: string,
    sprite:{ pictures:IObjectPicture[], sounds:any[] },
    text: string,
    lock: boolean,
    entity: any
}

export class ProjectParser {

    static parse(objects:IRawObject[]) {
        var LEN = objects.length;
        var sceneMap:any = {};
        var scene;
        var obj:IRawObject;
        var sceneID;
        for (var i = 0 ; i < LEN ; i++) {
            obj = objects[i];

            sceneID = obj.scene;
            scene = sceneMap[sceneID];
            if(!scene) {
                scene = sceneMap[sceneID] = [];
            }
            this._pushPictures(sceneID, scene, obj.sprite && obj.sprite.pictures);
        }
    }


    static _pushPictures(sceneID:string, scene:PicInfo[], pics:any[]) {
        if(!pics || !pics.length) return;
        var LEN = pics.length;
        var info;
        for(var i = 0 ; i < LEN ; i++) {
            info = new PicInfo(sceneID, pics[i]);
            scene.push(info);
        }
    }
}

export class PicInfo {
    public url:string;
    public height:number;
    private width:number;
    private filename:string;
    private id:string;

    constructor(public sceneID:string, rawInfo:IObjectPicture) {
        var d = rawInfo.dimension;
        this.width = d.width;
        this.height = d.height;
        this.url = rawInfo.fileurl;
        this.filename = rawInfo.filename;
        this.id = rawInfo.id;
        return this;
    }
}