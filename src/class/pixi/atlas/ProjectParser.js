export class ProjectParser {

    static parse(objects) {
        var LEN = objects.length;
        var sceneMap = {};
        var scene;
        var obj;
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


    static _pushPictures(sceneID, scene, pics) {
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
    constructor(sceneID, rawInfo) {
        this.sceneID = sceneID;
        var d = rawInfo.dimension;
        this.w = d.width;
        this.h = d.height;
        this.url = rawInfo.fileurl;
        this.filename = rawInfo.filename;
        this.id = rawInfo.id;
        return this;
    }
}