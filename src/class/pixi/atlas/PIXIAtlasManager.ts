import { Sprite } from 'pixi.js';
import { SceneBins } from './SceneBins';
import { AtlasCanvasViewer } from './AtlasCanvasViewer';
import { AtlasImageLoader, ImageLoaderHandler } from './loader/AtlasImageLoader';
import { AtlasImageLoadingInfo } from './loader/AtlasImageLoadingInfo';
import { IRawPicture } from './model/IRawPicture';
import { PIXIAtlasHelper } from './PIXIAtlasHelper';
import { EntryTextureOption } from './EntryTextureOption';
import { ISceneTextures } from './ISceneTextures';
import { SceneTextures } from './SceneTextures';
import { clog } from '../utils/logs';
import { IGEResManager } from '../../../graphicEngine/IGEResManager';
import each from 'lodash-es/each';

type SceneBinsMap = { [key: string]: ISceneTextures };

export class PIXIAtlasManager implements IGEResManager {
    private _sceneID_sceneBin_map: SceneBinsMap = {};
    private _activatedScene: ISceneTextures;
    private _imageLoader: AtlasImageLoader;
    private _viewer: AtlasCanvasViewer;
    private _option: EntryTextureOption;

    /**
     * @private
     * @constructor
     */
    public INIT() {
        if (this._imageLoader) {
            throw new Error('do not call twice');
        }
        this._option = new EntryTextureOption(640, 360);
        this._viewer = new AtlasCanvasViewer();
        this._imageLoader = new AtlasImageLoader(this._onImageLoaded.bind(this));

        Entry.addEventListener('saveCanvasImage', () => {
            this.imageRemoved('canvas image saved');
        });
    }

    private _onImageLoaded(info: AtlasImageLoadingInfo) {
        this._activatedScene && this._activatedScene.putImage(info);
    }

    activateScene(sceneID: string) {
        if (this._activatedScene) {
            this._activatedScene.deactivate();
        }
        this._activatedScene = this._getSceneBin(sceneID);
        this._activatedScene.activate();
    }

    reqResource(
        spriteNullable: Sprite,
        sceneID: string,
        pic: IRawPicture,
        callback: ImageLoaderHandler
    ): void {
        const bin: ISceneTextures = this._getSceneBin(sceneID);
        bin.addPicInfo(pic);
        const tex = bin.getTexture(PIXIAtlasHelper.getRawPath(pic));
        if (spriteNullable) {
            spriteNullable.texture = tex;
        }
    }

    private _getSceneBin(sceneID: string, createIfNotExist: boolean = true): ISceneTextures {
        let s: ISceneTextures = this._sceneID_sceneBin_map[sceneID];
        if (!s && createIfNotExist) {
            if (this._option.USE_ATLAS) {
                s = new SceneBins(sceneID, this._option, this._imageLoader, this._viewer);
            } else {
                s = new SceneTextures(sceneID, this._option, this._imageLoader);
            }
            this._sceneID_sceneBin_map[sceneID] = s;
        }
        return s;
    }

    removeScene(sceneID: string): void {
        const s: ISceneTextures = this._getSceneBin(sceneID, false);
        if (!s) return;
        if (this._activatedScene == s) {
            this._activatedScene = null;
        }
        s.destroy();
        delete this._sceneID_sceneBin_map[sceneID];
        this.imageRemoved(`scend(${sceneID}) removed.`);
    }

    imageRemoved(reason: string): void {
        clog(`AtlasManager::imageRemoved - ${reason}`);
        this._activatedScene && this._activatedScene._internal_imageRemoved();
        this._imageLoader.requestSync();
    }

    clearProject(): void {
        clog('clearProject');
        this._imageLoader.empty();
        each(this._sceneID_sceneBin_map, (bin: ISceneTextures) => {
            bin.destroy();
        });
        this._sceneID_sceneBin_map = {};
        this._activatedScene = null;
    }
}
