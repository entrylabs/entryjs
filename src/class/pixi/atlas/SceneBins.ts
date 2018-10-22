/**
 * 하나의 Scene에서 사용하는 이미지들을 TextureAtlas 로 만들어줌.
 */

import { IRawPicture } from './model/IRawPicture';
import PIXIHelper from '../helper/PIXIHelper';
import { PIXIAtlasManager } from './PIXIAtlasManager';
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { PrimitiveSet } from './structure/PrimitiveSet';
import { MaxRectsPacker } from '../../maxrect-packer/maxrects_packer';
import { MaxRectsBin } from '../../maxrect-packer/maxrects_bin';
import { InputRect } from '../../maxrect-packer/geom/InputRect';
import { AtlasTexture } from './texture/AtlasTexture';
import { AtlasBaseTexture } from './texture/AtlasBaseTexture';

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

    private _pathSet:PrimitiveSet = new PrimitiveSet();//패킹 전/후 pathf르 모두 저장.
    private _packedBinData:InputRect[] = [];
    private _notPackedBindData:InputRect[] = [];
    private _arrBaseTexture:AtlasBaseTexture[] = [];
    private _packer:MaxRectsPacker;
    private _path_tex_map:TextureMap = {};
    private _activated:boolean;


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
        this._packer.addArray(this._notPackedBindData.concat());

        var willUpdateBaseTextures:AtlasBaseTexture[] = [];

        this._notPackedBindData.forEach((r:InputRect)=>{
            var base:AtlasBaseTexture = this._getBaseTexture(r.binIndex);
            this._createOrUpdateTexture(r, base);
            willUpdateBaseTextures.push(base);
        });

        willUpdateBaseTextures.forEach((base:AtlasBaseTexture)=>{
            base.update();
        });

        this._destroyBaseTextureAfter(this._packer.bins.length);

        this._packedBinData = this._packedBinData.concat(this._notPackedBindData);

        this._notPackedBindData.length = 0;
    }

    activate() {
        this._activated = true;
        _.each(this._packer.bins, (bin:MaxRectsBin, index:number)=>{
            var base:AtlasBaseTexture = this._arrBaseTexture[index];
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

    private _activateBaseTexture(base:AtlasBaseTexture) {
        base.activate(MAX_SIZE);
        //----------- debug code ---------------
        // var ctx:CanvasRenderingContext2D = canvas.getContext("2d");
        // ctx.fillStyle = `rgba(${c()},${c()},${c()}, 0.3)`;
        // ctx.fillRect(0,0, MAX_SIZE, MAX_SIZE);
        this._viewer.add(base.getCanvas());
        //----------- debug code ---------------
    }

    private _getBaseTexture(index:number):AtlasBaseTexture {
        var base:AtlasBaseTexture = this._arrBaseTexture[index];
        if(base) return base;
        base = new AtlasBaseTexture(null, OP.scaleMode);
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
        this._viewer.empty();
    }

    getTexture(path:string):AtlasTexture {
        return this._path_tex_map[path];
    }

    _createOrUpdateTexture(r:InputRect, base:AtlasBaseTexture) {
        var path:string = r.data.path;
        var tex:AtlasTexture = this.getTexture(path);
        if (!tex) {
            tex = new AtlasTexture(base, new PIXI.Rectangle(r.x, r.y, r.width, r.height));
            this._path_tex_map[path] = tex;
        } else {
            tex.baseTexture = base;
            tex.frame.x = r.x;
            tex.frame.y = r.y;
        }
        this.putImage(PIXIAtlasManager.imageLoader.getImageInfo(path), false);
    }

    destroy() {
        this._viewer.empty();
        _.each(this._path_tex_map, (tex:AtlasTexture)=>{
            tex.destroy(false);
        });
        _.each(this._arrBaseTexture, (base:AtlasBaseTexture)=>{
            this._viewer.removeCanvas(base.getCanvas());
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
        var t:AtlasTexture = this.getTexture(info.path);

        if(!t) return;//이 Scene에서 사용안하는 이미지가 로드 된것임.
        if(!t.baseTexture.hasLoaded) {
            this._activateBaseTexture(t.baseTexture);
        }
        t.drawImageAtBaseTexture(info.img);
        if(forceUpdateBaseTexture) {
            t.baseTexture.update();
        }
    }


    invalidate(usedPathSet:PrimitiveSet | null | undefined):void {
        var unusedPath:string[] = [];
        _.each(this._path_tex_map, (texture:AtlasTexture, path:string)=>{
            if( usedPathSet && usedPathSet.hasValue(path) ) return;
            texture.destroy(false);
            unusedPath.push(path);
        });
        unusedPath.forEach((path:string)=>{
            this._pathSet.remove(path);
            delete this._path_tex_map[path];
        });

        var inputs:InputRect[] = this._packedBinData.concat(this._notPackedBindData);
        this._notPackedBindData = [];
        inputs.forEach((r:InputRect)=>{
            if(this._pathSet.hasValue(r.data.path)) {
                this._notPackedBindData.push(r);
            }
        });
        this._packedBinData.length = 0;

        if(this._activated) {
            this._packer.empty();
            this._cleanCanvas();
            this.pack();
        }
    }

    private _destroyBaseTextureAfter(startIndex:number) {
        var LEN = this._arrBaseTexture.length;
        for( var i = startIndex ; i < LEN ; i++ ) {
            this._viewer.removeCanvas(this._arrBaseTexture[i].getCanvas());
            this._arrBaseTexture[i].destroy();
        }
        this._arrBaseTexture.length = startIndex;
    }

    private _cleanCanvas() {
        var LEN = this._arrBaseTexture.length;
        for( var i = 0 ; i < LEN ; i++ ) {
            this._arrBaseTexture[i].cleanCanvas();
        }
    }
}
