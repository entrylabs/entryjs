import { ISceneTextures } from './ISceneTextures';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { PrimitiveMap } from './structure/PrimitiveMap';
import { ImageRect } from '../../maxrect-packer/geom/ImageRect';
import { AtlasImageLoader } from './loader/AtlasImageLoader';
import { EntryTextureOption } from './EntryTextureOption';
import { EntryTexture } from './texture/EntryTexture';
import { EntryBaseTexture } from './texture/EntryBaseTexture';
import { IRawPicture } from './model/IRawPicture';
import { PIXIAtlasHelper } from './PIXIAtlasHelper';
import { clog } from '../utils/logs';
import { PrimitiveSet } from './structure/PrimitiveSet';
import { TimeoutTimer } from '../utils/TimeoutTimer';

export class SceneTextures implements ISceneTextures {
    private _path_tex_map: PrimitiveMap<EntryTexture> = new PrimitiveMap();
    private _activated: boolean;
    private _gcTimer: TimeoutTimer = new TimeoutTimer();

    constructor(
        public sceneID: string,
        private _option: EntryTextureOption,
        private _loader: AtlasImageLoader
    ) {}

    _internal_imageRemoved(): void {
        if (this._gcTimer.isRunning) return;
        this._gcTimer.timeout(500, () => {
            this._gcTexture();
        });
    }

    _gcTexture(): void {
        let usedPathSet: PrimitiveSet = PIXIAtlasHelper.getScenePathSet(this.sceneID);
        let deleteCnt = 0;
        this._path_tex_map.each((tex: EntryTexture, path: string) => {
            if (usedPathSet.hasValue(path)) return;
            tex.destroy(true);
            this._path_tex_map.remove(path);
            deleteCnt++;
        });
        if (deleteCnt) {
            clog(`[SceneTextures] ${deleteCnt} textures deleted`);
        }
    }

    activate(): void {
        this._activated = true;
        this._path_tex_map.each((tex: EntryTexture, path: string) => {
            let info = this._loader.getImageInfo(path);
            if (!info || !info.isReady) {
                return;
            }
            this.putImage(info, false);
        });
    }

    addPicInfo(pic: IRawPicture): void {
        let path = PIXIAtlasHelper.getRawPath(pic);
        let map = this._path_tex_map;
        if (map.hasValue(path)) return;

        let info = this._loader.getImageInfo(path);
        let rect: ImageRect = PIXIAtlasHelper.getNewImageRect(pic, this._option.texMaxRect);
        if (!info) {
            this._loader.load(pic, rect);
        }
        let tex = this._newTexture(path, rect);
        map.add(path, tex);
        if (info && info.isReady) {
            this.putImage(info, false);
        }
    }

    private _newTexture(path: string, rect: ImageRect): EntryTexture {
        let baseTex: EntryBaseTexture = new EntryBaseTexture();
        baseTex.width = rect.width;
        baseTex.height = rect.height;
        baseTex.mipmap = this._option.mipmap;
        baseTex.scaleMode = this._option.scaleMode;
        let tex = new EntryTexture(baseTex, rect);
        this._path_tex_map.add(path, tex);
        return tex;
    }

    deactivate(): void {
        this._activated = false;
        this._path_tex_map.each((tex: EntryTexture, path: string) => {
            tex.getBaseTexture().dispose();
        });
    }

    getTexture(path: string): EntryTexture {
        return this._path_tex_map.getValue(path);
    }

    putImage(info: AtlasImageLoadingInfo, forceUpdateBaseTexture: boolean): void {
        let tex: EntryTexture = this._path_tex_map.getValue(info.path);
        if (!tex) {
            return;
        }
        let baseTex = tex.getBaseTexture();
        const source = info.source();
        if (tex._frame) {
            if (tex._frame.height != info.srcHeight) {
                tex._frame.height = info.srcHeight;
            }
            if (tex._frame.width != info.srcWidth) {
                tex._frame.width = info.srcWidth;
            }
        }
        baseTex.updateSource(source);

        Entry.requestUpdate = true;
    }

    destroy(): void {
        clog('destroy', this.sceneID);
        this._gcTimer.reset();
        this._gcTimer = null;

        this._path_tex_map.each((tex: EntryTexture, path: string) => {
            tex.destroy(true);
        });
        this._path_tex_map.destroy();
        this._path_tex_map = null;
    }
}
