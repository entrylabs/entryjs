/**
 * 하나의 Scene에서 사용하는 이미지들을 TextureAtlas 로 만들어줌.
 */

import { IRawPicture } from './model/IRawPicture';
import PIXIHelper from '../helper/PIXIHelper';
import BaseTexture = PIXI.BaseTexture;
import { AtlasTexture } from './AtlasTexture';
import { PIXIAtlasManager } from './PIXIAtlasManager';
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { PrimitiveSet } from './structure/PrimitiveSet';
import { MaxRectsPacker } from '../../maxrect-packer/maxrects_packer';
import { MaxRectsBin } from '../../maxrect-packer/maxrects_bin';
import { InputRect } from '../../maxrect-packer/geom/InputRect';

export type TextureMap = {[key:string]:AtlasTexture};

declare let _:any;

let c = ():number => {
    return Math.floor(Math.random()*255);
};

/** BaseTextureOption **/
let OP = {
    scaleMode: PIXI.SCALE_MODES.LINEAR,
    mipmap: false,
    useOffscreenCanvas: false
};

function getRawPath(rawData:IRawPicture):string {
    return rawData.fileurl || rawData.filename;
}

/** base texture max size */
const MAX_SIZE = 2048;
function newPacker():MaxRectsPacker{
    //https://www.npmjs.com/package/maxrects-packer
    const PADDING = 2;
    const OPTION = {
        smart: true,
        pot: true,
        square: false
    };
    return new MaxRectsPacker(MAX_SIZE, MAX_SIZE, PADDING, OPTION);
}

export class SceneBins {

    private _pathSet:PrimitiveSet = new PrimitiveSet();
    private _packedBinData:InputRect[] = [];
    private _notPackedBindData:InputRect[] = [];
    private _arrBaseTexture:BaseTexture[] = [];
    private _packer:MaxRectsPacker;
    private _path_tex_map:TextureMap = {};

    constructor(public sceneID:string, private _viewer:AtlasCanvasViewer) {
        this._packer = newPacker();
    }


    addRawPicInfos(pics:IRawPicture[]) {
        var LEN = pics.length;
        for(var i = 0 ; i < LEN ; i++ ) {
            this.addPicInfo(pics[i]);
        }
    }

    addPicInfo(pic:IRawPicture):SceneBins {
        var path = getRawPath(pic);

        if(this._pathSet.hasValue(path)) return this;

        this._pathSet.put(path);
        var rect:InputRect = new InputRect(0, 0, pic.dimension.width, pic.dimension.height);
        rect.data = {
            path: path
        };
        this._notPackedBindData.push(rect);
        return this;
    }

    pack() {
        this._packer.addArray(this._notPackedBindData);

        this._notPackedBindData.forEach((r:InputRect)=>{
            var path:string = r.data.path;
            var base:BaseTexture = this._getBaseTexture(r.binIndex);
            this._path_tex_map[path] = new AtlasTexture(base, new PIXI.Rectangle(r.x, r.y, r.width, r.height));
            this.putImage(PIXIAtlasManager.imageLoader.getImageInfo(path), true); //업데이트 해야 할 baseTexture만 골라내기
        });

        this._packedBinData = this._packedBinData.concat(this._notPackedBindData);

        this._notPackedBindData = [];
    }

    activate() {
        console.log("activate scene");
        _.each(this._packer.bins, (bin:MaxRectsBin, index:number)=>{
            var base:BaseTexture = this._arrBaseTexture[index];
            this._activateBaseTexture(base);
            base.update();
        });

        _.each(this._path_tex_map, (t:AtlasTexture, path:string)=>{
            var info = PIXIAtlasManager.imageLoader.getImageInfo(path);
            if(!info || !info.isReady ) {
                return;
            }
            t.drawImageAtBaseTexture(info.img);
        });
    }

    private _activateBaseTexture(base:BaseTexture) {
        var canvas:HTMLCanvasElement = base.source as HTMLCanvasElement;
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        base.hasLoaded = true;

        //----------- debug code ---------------
        // var ctx:CanvasRenderingContext2D = canvas.getContext("2d");
        // ctx.fillStyle = `rgba(${c()},${c()},${c()}, 0.3)`;
        // ctx.fillRect(0,0, MAX_SIZE, MAX_SIZE);
        this._viewer.add(canvas);
        //----------- debug code ---------------
    }

    private _getBaseTexture(index:number):BaseTexture {
        var base:BaseTexture = this._arrBaseTexture[index];
        if(base) return base;
        base = new BaseTexture(null, OP.scaleMode);
        base.source = PIXIHelper.getOffScreenCanvas(!OP.useOffscreenCanvas);
        base.imageType = "png";
        base.realWidth = base.realHeight = base.width = base.height = MAX_SIZE;
        base.mipmap = OP.mipmap;
        this._arrBaseTexture[index] = base;
        return base;
    }

    deactivate() {
        console.log("deactivate scene");
        _.each(this._arrBaseTexture, (b:BaseTexture)=>{
            var canvas = (b.source as HTMLCanvasElement) ;
            canvas.width = 1;
            canvas.height = 1;
            b.dispose();
        });
        this._viewer.empty();
    }

    getTexture(path:string) {
        return this._path_tex_map[path];
    }

    destroy() {
        this._viewer.empty();
        _.each(this._path_tex_map, (tex:AtlasTexture)=>{
            tex.destroy(false);
        });
        _.each(this._arrBaseTexture, (base:BaseTexture)=>{
            base.destroy();
        });

        this._arrBaseTexture = null;
        this._path_tex_map = null;
        this._packer = null;
        this._pathSet = null;
        this._viewer = null;
        this._packedBinData = null;
        this._notPackedBindData = null;
    }

    /**
     * Scene이 활성화 되어 있을때 이미지가 로드 되면 이 함수를 통해 로드된 이미지 정보가 주입됨.
     * @param info
     * @param forceUpdateBaseTexture
     */
    putImage(info:AtlasImageLoadingInfo, forceUpdateBaseTexture:boolean = true) {
        if(!info) return;
        var t:AtlasTexture = this._path_tex_map[info.path];

        if(!t) return;//이 Scene에서 사용안하는 이미지가 로드 된것임.
        if(!t.baseTexture.hasLoaded) {
            this._activateBaseTexture(t.baseTexture);
        }
        t.drawImageAtBaseTexture(info.img);
        if(forceUpdateBaseTexture) {
            t.baseTexture.update();
        }
    }
}
