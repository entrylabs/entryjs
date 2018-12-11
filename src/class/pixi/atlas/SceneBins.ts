/**
 * 하나의 Scene에서 사용하는 이미지들을 TextureAtlas 로 만들어줌.
 */

import { IRawPicture } from './model/IRawPicture';
import PIXIHelper from '../helper/PIXIHelper';
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { PrimitiveSet } from './structure/PrimitiveSet';
import { MaxRectsPacker } from '../../maxrect-packer/maxrects_packer';
import { MaxRectsBin } from '../../maxrect-packer/maxrects_bin';
import { AtlasTexture } from './texture/AtlasTexture';
import { AtlasBaseTexture } from './texture/AtlasBaseTexture';
import { PrimitiveMap } from './structure/PrimitiveMap';
import { AtlasImageLoader } from './loader/AtlasImageLoader';
import { PIXIAtlasHelper } from './PIXIAtlasHelper';
import { TimeoutTimer } from '../utils/TimeoutTimer';
import { ImageRect } from '../../maxrect-packer/geom/ImageRect';
import { autoFit } from '../utils/AutoFit';

declare let _:any;
declare let Entry:any;


/** BaseTextureOption **/
let OP = {
    scaleMode: PIXI.SCALE_MODES.LINEAR,
    mipmap: false,
    useOffscreenCanvas: false
};



let TIMEOUT_INTERVAL = 250;

/** base texture max pixel size */
const BASE_TEX_MAX_SIZE = computeMaxTextureSize(4096);

/** 텍스쳐의 최대 사이즈. 이미지가 이 크기보다 크면 리사이즈 하여 사용함. */
const TEX_MAX_SIZE = Math.min(BASE_TEX_MAX_SIZE, 2048);

/**
 * 텍스쳐를 최대 몇으로 할지의 값을 Canvas.width , height 기준으로 몇배로 할 지에 대한 값.
 */
const RATIO:number = 1;

//todo 640, 320을 리터럴이 아닌 canvas ( w, h ) 로 변경 필요.
const TEX_MAX_SIZE_RECT = new ImageRect(
    0,0,
    Math.min(Math.round(640 * RATIO), TEX_MAX_SIZE),
    Math.min(Math.round(320 * RATIO), TEX_MAX_SIZE)
);

const EXTRUDE_SIZE = 2;
function newPacker():MaxRectsPacker{
    //https://www.npmjs.com/package/maxrects-packer
    const PADDING = 6; //텍스쳐 사이의 간격.
    const BORDER = 2; //베이스 텍스쳐 테두리 간격
    const OPTION = {
        smart: false,
        pot: true,
        square: false,

    };
    return new MaxRectsPacker(BASE_TEX_MAX_SIZE, BASE_TEX_MAX_SIZE, BORDER, PADDING, OPTION);
}

/**
 * packing 이 되기전에 texture 객체를 생성하기 위한 BaseTexture
 */
let EMPTY_BASE_TEX:AtlasBaseTexture = new AtlasBaseTexture();
EMPTY_BASE_TEX.width = EMPTY_BASE_TEX.height = EMPTY_BASE_TEX.realHeight = EMPTY_BASE_TEX.realWidth = BASE_TEX_MAX_SIZE;
EMPTY_BASE_TEX.dispose();


export class SceneBins {

    //private _pathSet:PrimitiveSet = new PrimitiveSet();//패킹 전/후 pathf르 모두 저장.
    private _packedRects:ImageRect[] = [];
    private _notPackedRects:ImageRect[] = [];
    private _arrBaseTexture:AtlasBaseTexture[] = [];
    private _packer:MaxRectsPacker = newPacker();
    private _path_tex_map:PrimitiveMap<AtlasTexture> = new PrimitiveMap();
    private _activated:boolean;
    private _imageRemoved:boolean;
    private _timer:TimeoutTimer = new TimeoutTimer();

    constructor(public sceneID:string, private _loader:AtlasImageLoader, private _viewer:AtlasCanvasViewer) {

    }

    addPicInfo(pic:IRawPicture):void {
        var path = PIXIAtlasHelper.getRawPath(pic);
        if(this._path_tex_map.hasValue(path)) return;

        var w = pic.dimension.width,
            h = pic.dimension.height;
        var rect:ImageRect = this._getNewImageRect(w, h );
        this._loader.load(pic, rect);
        var tex:AtlasTexture = this._newTexture(path, rect);
        rect.data = { path: path, tex:tex };
        this._notPackedRects.push(rect);

        if(!this._activated) return;

        if(this._timer.isRunning) return;

        console.log('pack scheduled');
        this._timer.timeout(TIMEOUT_INTERVAL, () => {
            if(this._imageRemoved) {
                console.log('삭제된 이미지가 있어서 invalidate');
                this._invalidate();
            } else {
                console.log('just packing');
                this._pack();
            }
        });
    }

    private _newTexture(path:string, rect:ImageRect):AtlasTexture {
        var tex = new AtlasTexture(EMPTY_BASE_TEX, rect);
        this._path_tex_map.add(path, tex);
        return tex;
    }

    /** 패킹 하지 않은 Rect를 packing 한다. */
    private _pack() {
        if(!this._notPackedRects.length) return;

        var len = this._notPackedRects.length;
        var time = new Date().getTime();
        this._packer.addArray(this._notPackedRects);
        var willUpdateBaseTextures:AtlasBaseTexture[] = [];

        this._notPackedRects.forEach((r:ImageRect)=>{
            var base:AtlasBaseTexture = this._getBaseTexture(r.binIndex);
            r.data.tex.updateBaseAndUVs(base);

            var imgInfo = this._loader.getImageInfo(r.data.path);
            if(!imgInfo.isReady) return;
            
            this.putImage(imgInfo, false);
            if(willUpdateBaseTextures.indexOf(base) == -1) {
                willUpdateBaseTextures.push(base);
            }
        });

        willUpdateBaseTextures.forEach((base:AtlasBaseTexture)=>{
            base.update();
        });

        this._destroyBaseTextureAfter(this._packer.bins.length);
        this._packedRects = this._packedRects.concat(this._notPackedRects);
        this._notPackedRects = [];
        time = new Date().getTime() - time;
        console.log(`pack ${len} items. time:${time}`);
    }


    activate():void {

        this._activated = true;

        this._invalidate();

        _.each(this._packer.bins, (bin:MaxRectsBin, index:number)=>{
            var base:AtlasBaseTexture = this._arrBaseTexture[index];
            base.activate(BASE_TEX_MAX_SIZE);
            base.update();
        });

        this._path_tex_map.each((t:AtlasTexture, path:string)=>{
            var info = this._loader.getImageInfo(path);
            if(!info || !info.isReady ) {
                return;
            }
            t.drawImageAtBaseTexture(info, EXTRUDE_SIZE);
        });
    }


    private _getBaseTexture(index:number):AtlasBaseTexture {
        var base:AtlasBaseTexture = this._arrBaseTexture[index];
        if(base) return base;
        base = new AtlasBaseTexture(this._viewer, OP.scaleMode);
        base.setCanvas(PIXIHelper.getOffScreenCanvas(!OP.useOffscreenCanvas));
        base.imageType = "png";
        base.realWidth = base.realHeight = base.width = base.height = BASE_TEX_MAX_SIZE;
        base.mipmap = OP.mipmap;
        this._arrBaseTexture[index] = base;
        return base;
    }


    deactivate() {
        this._timer.reset();
        this._activated = false;
        _.each(this._arrBaseTexture, (b:AtlasBaseTexture)=>{
            b.deactivate();
        });
    }


    getTexture(path:string):AtlasTexture {
        return this._path_tex_map.getValue(path);
    }


    /**
     * Scene이 활성화 되어 있을때 이미지가 로드 되면 이 함수를 통해 로드된 이미지 정보가 주입됨.
     * @param info
     * @param forceUpdateBaseTexture
     */
    putImage(info:AtlasImageLoadingInfo, forceUpdateBaseTexture:boolean = true) {
        if(!info) return;
        var t:AtlasTexture = this.getTexture(info.path);

        if(!t) return;//이 Scene에서 사용안함
        if(t.isEmptyTexture) return;

        // console.log("put imgageData");

        var base:AtlasBaseTexture = t.getBaseTexture();

        if(!base.activated) {
            base.activate(BASE_TEX_MAX_SIZE);
        }
        t.drawImageAtBaseTexture(info, EXTRUDE_SIZE);
        if(forceUpdateBaseTexture) {
            base.update();
        }
        Entry.requestUpdate = true;
    }


    /**
     * 모든 텍스쳐 패킹을 다시 한다.
     * @private
     */
    private _invalidate():void {
        if(!this._activated) return;
        this._imageRemoved = false;
        let usedPathSet:PrimitiveSet = PIXIAtlasHelper.getScenePathSet(this.sceneID);
        this._notPackedRects.length = 0;
        this._packedRects.length = 0;

        var unusedPath:string[] = [];

        //사용안하는 path를 검색, 패킹을 다시 할 것이기 때문에 사용하는 텍스쳐의 rect 정보를 저장.
        this._path_tex_map.each((tex:AtlasTexture, path:string)=>{
            if( usedPathSet && usedPathSet.hasValue(path) ) {
                this._notPackedRects.push(this._path_tex_map.getValue(path).imageRect);
            } else {
                unusedPath.push(path);
            }
        });

        console.log("unusedPath", unusedPath);

        //사용안하는 texture를 제거
        unusedPath.forEach((path:string)=>{
            this._path_tex_map.remove(path).destroy(false);
        });

        this._packer.empty();
        this._cleanCanvas();

        this._pack();
    }


    private _cleanCanvas() {
        var LEN = this._arrBaseTexture.length;
        for( var i = 0 ; i < LEN ; i++ ) {
            this._arrBaseTexture[i].cleanCanvas();
        }
    }

    _internal_imageRemoved():void {
        this._imageRemoved = true;
    }


    private _destroyBaseTextureAfter(startIndex:number) {
        var LEN = this._arrBaseTexture.length;
        for( var i = startIndex ; i < LEN ; i++ ) {
            this._arrBaseTexture[i].destroy();
        }
        this._arrBaseTexture.length = startIndex;
    }


    destroy() {
        this._timer.reset();
        this._path_tex_map.each((tex:AtlasTexture, path:string)=>{
            tex.destroy(false);
        });
        this._path_tex_map.destroy();

        this._destroyBaseTextureAfter(0);

        this._timer = null;
        this._arrBaseTexture = null;
        this._path_tex_map = null;
        this._packer = null;
        this._viewer = null;
        this._packedRects = null;
        this._notPackedRects = null;
    }

    private _getNewImageRect(w:number, h:number):ImageRect {
        var r = new ImageRect(0,0, w, h);
        if(w > TEX_MAX_SIZE_RECT.width || h > TEX_MAX_SIZE_RECT.height ) {
            autoFit.fit(TEX_MAX_SIZE_RECT, r, autoFit.ScaleMode.INSIDE, autoFit.AlignMode.TL);
            r.width = Math.ceil(r.width);
            r.height = Math.ceil(r.height);
            r.scaleFactor = w / r.width;
        }
        return r;
    }
}


function computeMaxTextureSize(LIMIT:number):number {
    var canvas:HTMLCanvasElement = PIXIHelper.getOffScreenCanvas(true);
    var ctx:WebGLRenderingContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    var size = ctx ? ctx.getParameter(ctx.MAX_TEXTURE_SIZE) : 2048;
    size = Math.min(size, LIMIT);
    console.log("Max texture size : " + size);
    return size;

}