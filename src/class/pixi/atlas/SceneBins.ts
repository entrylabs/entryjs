import { IBin } from 'maxrects-packer/lib/abstract_bin';
import { MaxRectsPacker } from 'maxrects-packer/lib/maxrects_packer';
import { IRawPicture } from './model/IRawPicture';
import { MaxRectsBin } from 'maxrects-packer/lib/maxrects_bin';
import PIXIHelper from '../helper/PIXIHelper';
import { IRectangle } from 'maxrects-packer/lib/geom/Rectangle';
import BaseTexture = PIXI.BaseTexture;
import { AtlasTexture } from './AtlasTexture';

export type TextureMap = {[key:string]:AtlasTexture};

declare let _:any;

let OP = {
    scaleMode: PIXI.SCALE_MODES.LINEAR,
    mipmap: false
};

function newPacker():MaxRectsPacker {
    //https://www.npmjs.com/package/maxrects-packer
    const MAX_SIZE = 2048;
    const PADDING = 2;
    const OPTION = {
        smart: true,
        pot: true,
        square: false
    };
    return new MaxRectsPacker(MAX_SIZE, MAX_SIZE, PADDING, OPTION);
}

export class SceneBins {

    private _rawPics:any[] = [];
    private _arrBaseTexture:BaseTexture[] = [];
    private _bins:IBin[];
    private _packer:MaxRectsPacker;
    private _textureMap:TextureMap = {};

    constructor(public sceneID:string, private _globalTextureMap:TextureMap) {

    }


    addRawPicInfos(pics:IRawPicture[]) {
        var pic:IRawPicture;
        var LEN = pics.length;
        for(var i = 0 ; i < LEN ; i++ ) {
            pic = pics[i];
            this._rawPics.push({
                data:pic,
                width: pic.dimension.width,
                height: pic.dimension.height
            });
        }
    }

    pack() {
        var packer = this._packer = this._packer || newPacker();
        packer.addArray(this._rawPics);
        this._bins = packer.bins;

        _.each(this._bins, (bin:MaxRectsBin, binIndex:number)=>{

            var base:BaseTexture = new BaseTexture(null, OP.scaleMode);
            base.mipmap = OP.mipmap;
            this._arrBaseTexture.push(base);

            // sub-texture 생성.
            _.each(bin.rects, (r:IRectangle, rectIndex:number)=>{
                var texture:AtlasTexture = new AtlasTexture(base, new PIXI.Rectangle(r.x, r.y, r.width, r.height));
                var picID:string = (r.data as IRawPicture).id;
                this._globalTextureMap[picID] = texture;
                this._textureMap[picID] = texture;
            });
        });
    }

    activate() {
        _.each(this._bins, (bin:MaxRectsBin, index:number)=>{
            var canvas = PIXIHelper.getOffScreenCanvas(true);

            canvas.width = bin.width;
            canvas.height = bin.height;
            var base:BaseTexture = this._arrBaseTexture[index];
            base.source = canvas;
            base.update();
        });
    }

    deactivate() {
        _.each(this._arrBaseTexture, (b:BaseTexture)=>{
            b.dispose();
        });
    }

    getTexture(id:string) {
        return this._textureMap[id];
    }

    destroy() {

    }


}