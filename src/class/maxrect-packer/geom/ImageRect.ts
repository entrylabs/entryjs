import { Rectangle } from './Rectangle';
import { AtlasTexture } from '../../pixi/atlas/texture/AtlasTexture';

export class ImageRect extends Rectangle {
    constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) {
        super(...arguments);
        this.dataWidth = width;
        this.dataHeight = height;
    }
    /** @deprecated */
    scaleFactor:number = 1;
    scaleFactorX:number = 1;
    scaleFactorY:number = 1;
    binIndex:number = -1;
    /**
     * 이 값은 bin-packer 에서 할당하는데데, packing 하기 전에 AtlasImageLoadingInfo 에서 resize 를 하기 때문에 true가 될 일이 없음.
     */
    oversized:boolean;
    data:{path:string, tex:AtlasTexture};

    dataWidth:number = 0;
    dataHeight:number = 0;


}