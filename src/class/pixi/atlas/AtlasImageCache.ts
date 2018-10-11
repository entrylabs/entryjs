export class AtlasImageCache {
    constructor() {

    }

    cache(picID:string, image:HTMLImageElement) {
        console.log("add", picID);

    }

    unCache(picID:string) {
        console.log("remove", picID);
    }


}