import { IBin } from 'maxrects-packer/lib/abstract_bin';
import { MaxRectsPacker } from 'maxrects-packer/lib/maxrects_packer';
import { IRawPicture } from './model/IRawPicture';
import { MaxRectsBin } from 'maxrects-packer/lib/maxrects_bin';
import PIXIHelper from '../helper/PIXIHelper';
import { IRectangle } from 'maxrects-packer/lib/geom/Rectangle';
import BaseTexture = PIXI.BaseTexture;
import { AtlasTexture } from './AtlasTexture';
import { PIXIAtlasManager } from './PIXIAtlasManager';
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';

export type TextureMap = {[key:string]:AtlasTexture};

declare let _:any;

let ccc:any[] = (window as any).ccc = [];

let OP = {
    scaleMode: PIXI.SCALE_MODES.LINEAR,
    mipmap: false
};

interface PackCustomData {

}

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

    private _path_tex_map:TextureMap = {};

    constructor(public sceneID:string, private _globalTextureMap:TextureMap, private _viewer:AtlasCanvasViewer) {

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
            base.source = PIXIHelper.getOffScreenCanvas(true);
            base.imageType = "png";
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
        let c = ():number => {
            return Math.floor(Math.random()*255);
        };
        _.each(this._bins, (bin:MaxRectsBin, index:number)=>{
            var base:BaseTexture = this._arrBaseTexture[index];
            var canvas:HTMLCanvasElement = base.source as HTMLCanvasElement;
            canvas.width = bin.width;
            canvas.height = bin.height;
            base.hasLoaded = true;
            base.update();

            //----------- debug code ---------------
            var ctx:CanvasRenderingContext2D = canvas.getContext("2d");
            ctx.fillStyle = `rgb(${c()},${c()},${c()})`
            ctx.fillRect(0,0, bin.width, bin.height);
            this._viewer.add(canvas);
            //----------- debug code ---------------
        });

        _.each(this._textureMap, (t:AtlasTexture, picID:string)=>{
            var info = PIXIAtlasManager.imageLoader.getImageInfo(picID);
            if(!info || !info.isReady ) return;
            t.drawImageAtBaseTexture(info.img);
        });
    }

    deactivate() {
        _.each(this._arrBaseTexture, (b:BaseTexture)=>{
            var canvas = (b.source as HTMLCanvasElement) ;
            canvas.width = 1;
            canvas.height = 1;
            b.dispose();
        });
        this._viewer.empty();
        ccc.length = 0;
    }

    getTexture(id:string) {
        return this._textureMap[id];
    }

    destroy() {

    }

    /**
     * Scene이 활성화 되어 있을때 이미지가 로드 되면 이 함수를 통해 로드된 이미지와, 참조하는 picID 가 주입됨.
     * @param info
     */
    putImage(info:AtlasImageLoadingInfo) {
        var arr:BaseTexture[] = []; //BaseTexture.update() 가 중복 호출되는것을 막기 위해 이 배열에 담아둠.
        info.eachRefID((picID:string)=>{
            var t:AtlasTexture = this._textureMap[picID];
            if(!t) return;
            t.drawImageAtBaseTexture(info.img);
            if(arr.indexOf(t.baseTexture) < 0) {
                arr.push(t.baseTexture);
            }
        });

        _.each(arr, (bt:BaseTexture)=>{
            bt.update();
        });
    }
}