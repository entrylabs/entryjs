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
import { EntryTextureOption } from './EntryTextureOption';
import { ISceneTextures } from './ISceneTextures';
// @ts-ignore
import each from 'lodash/each';

let TIMEOUT_INTERVAL = 250;

/**
 * packing 이 되기전에 texture 객체를 생성하기 위한 BaseTexture
 */
let EMPTY_BASE_TEX: AtlasBaseTexture;

export class SceneBins implements ISceneTextures {
    private static initEmptyTex(maxSize: number) {
        if (EMPTY_BASE_TEX) return;
        const TEX = new AtlasBaseTexture();
        EMPTY_BASE_TEX = TEX;
        TEX.setRealSize(maxSize, maxSize);
        TEX.setSize(maxSize, maxSize);

        const tex: any = TEX;
        const emptyEmit = function() {};
        tex.destroy = emptyEmit;
        tex.on = emptyEmit;
        tex.once = emptyEmit;
        tex.emit = emptyEmit;
    }

    //private _pathSet:PrimitiveSet = new PrimitiveSet();//패킹 전/후 pathf르 모두 저장.
    private _packedRects: ImageRect[] = [];
    private _notPackedRects: ImageRect[] = [];
    private _arrBaseTexture: AtlasBaseTexture[] = [];
    private _packer: MaxRectsPacker;
    private _path_tex_map: PrimitiveMap<AtlasTexture> = new PrimitiveMap();
    private _activated: boolean;
    private _imageRemoved: boolean;
    private _timer: TimeoutTimer = new TimeoutTimer();

    constructor(
        public sceneID: string,
        private _option: EntryTextureOption,
        private _loader: AtlasImageLoader,
        private _viewer: AtlasCanvasViewer
    ) {
        SceneBins.initEmptyTex(_option.atlasOption.atlasSize);
        this._packer = _option.atlasOption.newPacker();
    }

    addPicInfo(pic: IRawPicture): void {
        let path = PIXIAtlasHelper.getRawPath(pic);
        if (this._path_tex_map.hasValue(path)) return;

        let rect: ImageRect = PIXIAtlasHelper.getNewImageRect(pic, this._option.texMaxRect);
        this._loader.load(pic, rect);
        let tex: AtlasTexture = this._newTexture(path, rect);
        rect.data = { path: path, tex: tex };
        this._notPackedRects.push(rect);

        if (!this._activated) return;

        if (this._timer.isRunning) return;

        console.log('pack scheduled');
        this._timer.timeout(TIMEOUT_INTERVAL, () => {
            if (this._imageRemoved) {
                console.log('삭제된 이미지가 있어서 invalidate');
                this._invalidate();
            } else {
                console.log('just packing');
                this._pack();
            }
        });
    }

    private _newTexture(path: string, rect: ImageRect): AtlasTexture {
        let tex = new AtlasTexture(EMPTY_BASE_TEX, rect);
        this._path_tex_map.add(path, tex);
        return tex;
    }

    /** 패킹 하지 않은 Rect를 packing 한다. */
    private _pack() {
        if (!this._notPackedRects.length) return;

        let len = this._notPackedRects.length;
        let time = new Date().getTime();
        this._packer.addArray(this._notPackedRects);
        let willUpdateBaseTextures: AtlasBaseTexture[] = [];

        this._notPackedRects.forEach((r: ImageRect) => {
            let base: AtlasBaseTexture = this._getBaseTexture(r.binIndex);
            r.data.tex.updateBaseAndUVs(base);

            let imgInfo = this._loader.getImageInfo(r.data.path);
            if (!imgInfo.isReady) return;

            this.putImage(imgInfo, false);
            if (willUpdateBaseTextures.indexOf(base) == -1) {
                willUpdateBaseTextures.push(base);
            }
        });

        willUpdateBaseTextures.forEach((base: AtlasBaseTexture) => {
            base.update();
        });

        this._destroyBaseTextureAfter(this._packer.bins.length);
        this._packedRects = this._packedRects.concat(this._notPackedRects);
        this._notPackedRects = [];
        time = new Date().getTime() - time;
        console.log(`pack ${len} items. time:${time}`);
    }

    activate(): void {
        this._activated = true;
        this._invalidate();
        const BASE_TEX_MAX_SIZE = this._option.atlasOption.atlasSize;
        each(this._packer.bins, (bin: MaxRectsBin, index: number) => {
            let base: AtlasBaseTexture = this._arrBaseTexture[index];
            base.activate(BASE_TEX_MAX_SIZE);
            base.update();
        });

        const EXTRUDE_SIZE = this._option.atlasOption.extrudeSize;
        this._path_tex_map.each((t: AtlasTexture, path: string) => {
            let info = this._loader.getImageInfo(path);
            if (!info || !info.isReady) {
                return;
            }
            t.drawImageAtBaseTexture(info, EXTRUDE_SIZE);
        });
    }

    private _getBaseTexture(index: number): AtlasBaseTexture {
        let base: AtlasBaseTexture = this._arrBaseTexture[index];
        if (base) return base;
        const OP = this._option;
        base = new AtlasBaseTexture(this._viewer, OP.scaleMode);
        base.setCanvas(PIXIHelper.getOffScreenCanvas());
        // base.imageType = 'png'; deprecated v5
        base.setRealSize(OP.atlasOption.atlasSize, OP.atlasOption.atlasSize);
        base.setSize(OP.atlasOption.atlasSize, OP.atlasOption.atlasSize);
        base.mipmap = OP.mipmap;
        this._arrBaseTexture[index] = base;
        return base;
    }

    deactivate() {
        this._timer.reset();
        this._activated = false;
        each(this._arrBaseTexture, (b: AtlasBaseTexture) => {
            b.deactivate();
        });
    }

    getTexture(path: string): AtlasTexture {
        return this._path_tex_map.getValue(path);
    }

    /**
     * Scene이 활성화 되어 있을때 이미지가 로드 되면 이 함수를 통해 로드된 이미지 정보가 주입됨.
     * @param info
     * @param forceUpdateBaseTexture
     */
    putImage(info: AtlasImageLoadingInfo, forceUpdateBaseTexture: boolean = true) {
        if (!info) return;
        let t: AtlasTexture = this.getTexture(info.path);

        if (!t) return;//이 Scene에서 사용안함
        if (t.isEmptyTexture) return;

        // console.log("put imgageData");
        let atlasOption = this._option.atlasOption;

        let base: AtlasBaseTexture = t.getBaseTexture();
        if (!base.activated) {
            base.activate(atlasOption.atlasSize);
        }
        t.drawImageAtBaseTexture(info, atlasOption.extrudeSize);
        if (forceUpdateBaseTexture) {
            base.update();
        }
        Entry.requestUpdate = true;
    }

    /**
     * 모든 텍스쳐 패킹을 다시 한다.
     * @private
     */
    private _invalidate(): void {
        if (!this._activated) return;
        this._imageRemoved = false;
        let usedPathSet: PrimitiveSet = PIXIAtlasHelper.getScenePathSet(this.sceneID);
        this._notPackedRects.length = 0;
        this._packedRects.length = 0;

        let unusedPath: string[] = [];

        //사용안하는 path를 검색, 패킹을 다시 할 것이기 때문에 사용하는 텍스쳐의 rect 정보를 저장.
        this._path_tex_map.each((tex: AtlasTexture, path: string) => {
            if (usedPathSet && usedPathSet.hasValue(path)) {
                this._notPackedRects.push(this._path_tex_map.getValue(path).imageRectForPacking);
            } else {
                unusedPath.push(path);
            }
        });

        console.log('unusedPath', unusedPath);

        //사용안하는 texture를 제거
        unusedPath.forEach((path: string) => {
            this._path_tex_map.remove(path).destroy(false);
        });

        this._packer.empty();
        this._cleanCanvas();

        this._pack();
    }

    private _cleanCanvas() {
        let LEN = this._arrBaseTexture.length;
        for (let i = 0; i < LEN; i++) {
            this._arrBaseTexture[i].cleanCanvas();
        }
    }

    _internal_imageRemoved(): void {
        this._imageRemoved = true;
    }

    private _destroyBaseTextureAfter(startIndex: number) {
        let LEN = this._arrBaseTexture.length;
        for (let i = startIndex; i < LEN; i++) {
            this._arrBaseTexture[i].destroy();
        }
        this._arrBaseTexture.length = startIndex;
    }

    destroy() {
        this._timer.reset();
        this._path_tex_map.each((tex: AtlasTexture, path: string) => {
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
}
