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
import { InputRect } from '../../maxrect-packer/geom/InputRect';
import { AtlasTexture } from './texture/AtlasTexture';
import { AtlasBaseTexture } from './texture/AtlasBaseTexture';
import { PrimitiveMap } from './structure/PrimitiveMap';
import { AtlasImageLoader } from './loader/AtlasImageLoader';


declare let _:any;
declare let Entry:any;

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

/** base texture max pixel size */
const MAX_SIZE = 4096;
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

/**
 * packing 이 되기전에 texture 객체를 생성하기 위한 BaseTexture
 */
let EMPTY_BASE_TEX:AtlasBaseTexture = new AtlasBaseTexture();
EMPTY_BASE_TEX.width = EMPTY_BASE_TEX.height = EMPTY_BASE_TEX.realHeight = EMPTY_BASE_TEX.realWidth = MAX_SIZE;
EMPTY_BASE_TEX.hasLoaded = true;
EMPTY_BASE_TEX.IS_EMPTY = true;
EMPTY_BASE_TEX.dispose();


export class SceneBins {

    //private _pathSet:PrimitiveSet = new PrimitiveSet();//패킹 전/후 pathf르 모두 저장.
    private _packedRects:InputRect[] = [];
    private _notPackedRects:InputRect[] = [];
    private _arrBaseTexture:AtlasBaseTexture[] = [];
    private _packer:MaxRectsPacker = newPacker();
    private _path_tex_map:PrimitiveMap<AtlasTexture> = new PrimitiveMap();
    private _activated:boolean;


    constructor(public sceneID:string, private _loader:AtlasImageLoader, private _viewer:AtlasCanvasViewer) {

    }

    addRawPicInfos(pics:IRawPicture[]) {
        var LEN = pics.length;
        for(var i = 0 ; i < LEN ; i++ ) {
            this.addPicInfo(pics[i]);
        }
    }

    addPicInfo(pic:IRawPicture):void {

        var path = getRawPath(pic);
        if(this._path_tex_map.hasValue(path)) return;

        var w = pic.dimension.width,
            h = pic.dimension.height;
        var rect:InputRect = new InputRect(0, 0, w, h);
        var tex:AtlasTexture = this._newTexture(path, rect);
        rect.data = { path: path, tex:tex };
        this._notPackedRects.push(rect);

        this._pack();
    }

    private _newTexture(path:string, rect:InputRect):AtlasTexture {
        var tex = new AtlasTexture(EMPTY_BASE_TEX, rect);
        this._path_tex_map.add(path, tex);
        return tex;
    }

    private _pack() {
        this._packer.addArray(this._notPackedRects);

        var willUpdateBaseTextures:AtlasBaseTexture[] = [];

        this._notPackedRects.forEach((r:InputRect)=>{
            var base:AtlasBaseTexture = this._getBaseTexture(r.binIndex);
            r.data.tex.updateBaseAndUVs(base);
            this.putImage(this._loader.getImageInfo(r.data.path), false);
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
    }

    activate(usedPathSet:PrimitiveSet) {

        this._activated = true;

        this.invalidate(usedPathSet);

        _.each(this._packer.bins, (bin:MaxRectsBin, index:number)=>{
            var base:AtlasBaseTexture = this._arrBaseTexture[index];
            base.activate(MAX_SIZE);
            base.update();
        });

        _.each(this._path_tex_map, (t:AtlasTexture, path:string)=>{
            var info = this._loader.getImageInfo(path);
            if(!info || !info.isReady ) {
                return;
            }
            t.drawImageAtBaseTexture(info.img);
        });
    }


    private _getBaseTexture(index:number):AtlasBaseTexture {
        var base:AtlasBaseTexture = this._arrBaseTexture[index];
        if(base) return base;
        base = new AtlasBaseTexture(this._viewer, OP.scaleMode);
        base.setCanvas(PIXIHelper.getOffScreenCanvas(!OP.useOffscreenCanvas));
        base.imageType = "png";
        base.realWidth = base.realHeight = base.width = base.height = MAX_SIZE;
        base.mipmap = OP.mipmap;
        this._arrBaseTexture[index] = base;
        return base;
    }

    deactivate() {
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

        if(!t.baseTexture.hasLoaded) {
            t.getBaseTexture().activate(MAX_SIZE);
        }
        t.drawImageAtBaseTexture(info.img);
        if(forceUpdateBaseTexture) {
            t.baseTexture.update();
        }
        Entry.requestUpdate = true;
    }

    invalidate(usedPathSet:PrimitiveSet|null):void {
        if(!this._activated) return;

        this._notPackedRects.length = 0;
        this._packedRects.length = 0;

        var unusedPath:string[] = [];

        //사용안하는 path를 검색, 패킹을 다시 할 것이기 때문에 사용하는 텍스쳐의 rect 정보를 저장.
        this._path_tex_map.each((tex:AtlasTexture, path:string)=>{
            if( usedPathSet && usedPathSet.hasValue(path) ) {
                this._notPackedRects.push(this._path_tex_map.getValue(path).inputRect);
            } else {
                unusedPath.push(path);
            }
        });

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

    private _destroyBaseTextureAfter(startIndex:number) {
        var LEN = this._arrBaseTexture.length;
        for( var i = startIndex ; i < LEN ; i++ ) {
            this._arrBaseTexture[i].destroy();
        }
        this._arrBaseTexture.length = startIndex;
    }

    destroy() {
        _.each(this._path_tex_map, (tex:AtlasTexture)=>{
            tex.destroy(false);
        });

        this._destroyBaseTextureAfter(0);

        this._arrBaseTexture = null;
        this._path_tex_map = null;
        this._packer = null;
        this._viewer = null;
        this._packedRects = null;
        this._notPackedRects = null;
    }
}
