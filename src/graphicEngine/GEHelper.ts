import PIXIHelper from '../class/pixi/helper/PIXIHelper';
import { PIXIGlobal } from '../class/pixi/init/PIXIGlobal';
import { GEDragHelper } from './GEDragHelper';
import { IGEResManager } from './IGEResManager';
import { EaselResManager } from './EaselResManager';
import { PIXISprite } from '../class/pixi/plugins/PIXISprite';
import { PIXIBrushAdaptor } from '../class/pixi/etc/PIXIBrushAdaptor';
import { PIXIScaleAdaptor } from '../class/pixi/atlas/PIXIScaleAdaptor';

declare let $: any;
declare let createjs: any;

const INITIAL_VIDEO_PARAMS = {
    WIDTH: 480,
    HEIGHT: 270,
    X: -240,
    Y: -135,
    SCALE_X: 0.75,
    SCALE_Y: 0.75,
    ALPHA: 0.5,
};

interface IGraphicsEngineApplication {
    render(): void;
    stage: PIXI.Container | any;
    destroy(destroyOption: any): void;
}

interface ITicker {
    reset(): void;
    setFPS(n: number): void;
}

class CreateJsApplication implements IGraphicsEngineApplication {
    stage: any;

    constructor(canvas: HTMLCanvasElement) {
        let stage = new createjs.Stage(canvas.id);
        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;
        this.stage = stage;
    }
    render(): void {
        this.stage.update();
    }
    destroy(destroyOption: any) {
        this.stage = null;
    }
}

export class GEHelperBase {
    protected _isWebGL: boolean = false;
    INIT(isWebGL: boolean) {
        this._isWebGL = isWebGL;
    }
}

const emptyFn = (...arg: any[]) => {};

class _GEHelper extends GEHelperBase {
    get isWebGL(): boolean {
        return this._isWebGL;
    }
    public resManager: IGEResManager;
    public textHelper: _TextHelper;
    public colorFilter: _ColorFilterHelper;
    public brushHelper: _BrushHelper;
    public inMemoryCanvas: HTMLCanvasElement;

    /**  pixi 객체로부터 rotate를 읽을 때 사용할 값 */
    public rotateRead: number = 1;

    /**  pixi 객체에 rotate를 할당 할 때 사용할 값 */
    public rotateWrite: number = 1;

    public Ticker: ITicker;
    private _isInitialized: boolean;

    /**
     * issues/9422#issuecomment-2678582
     * 최종 좌표 결정 단계에서 약간의 오차를 주어 이 현상을 막음.
     */
    public rndPosition: () => number;

    INIT(isWebGL: boolean) {
        super.INIT(isWebGL);
        if (this._isInitialized) return;
        this._isInitialized = true;
        GEDragHelper.INIT(isWebGL);
        (this.colorFilter = new _ColorFilterHelper()).INIT(isWebGL);
        (this.textHelper = new _TextHelper()).INIT(isWebGL);
        (this.brushHelper = new _BrushHelper()).INIT(isWebGL);
        if (this._isWebGL) {
            // this.rndPosition = ()=>{ return Math.random() * 0.8 - 0.4; };
            this.rndPosition = () => {
                return 0;
            };
            this.rotateRead = 180 / Math.PI;
            this.rotateWrite = Math.PI / 180;
            PIXIGlobal.initOnce();
            this.resManager = PIXIGlobal.atlasManager;
            this.Ticker = {
                reset: emptyFn,
                setFPS: emptyFn,
            };
        } else {
            this.rndPosition = () => {
                return 0;
            };
            this.resManager = new EaselResManager();
            this.Ticker = {
                reset: createjs.Ticker.reset,
                setFPS: createjs.Ticker.setFPS,
            };
        }
        this.resManager.INIT();
    }

    newApp(canvas: HTMLCanvasElement): IGraphicsEngineApplication {
        let app: IGraphicsEngineApplication;
        if (this._isWebGL) {
            app = PIXIGlobal.getNewApp(canvas);
        } else {
            app = new CreateJsApplication(canvas);
        }
        return app;
    }

    cloneStamp(entity: any): any {
        if (this._isWebGL) {
            let orgObj = entity.object;
            const orgTex = orgObj.internal_getOriginalTex && orgObj.internal_getOriginalTex();
            let object = PIXIHelper.sprite('StampEntity', orgTex || orgObj.texture);
            object.visible = orgObj.visible;
            object.interactive = false;
            object.interactiveChildren = false;
            object.setTransform(
                orgObj.x,
                orgObj.y,
                orgObj.scale.x,
                orgObj.scale.y,
                orgObj.rotation,
                orgObj.skew.x,
                orgObj.skew.y,
                orgObj.pivot.x,
                orgObj.pivot.y
            );
            return object;
        } else {
            let object = entity.object.clone();
            object.mouseEnabled = false;
            object.tickEnabled = false;
            object.filters = null;
            return object;
        }
    }

    hitTestMouse(object: any): boolean {
        if (this._isWebGL) {
            let pixiApp: PIXI.Application = Entry.stage._app;
            let im = pixiApp.renderer.plugins.interaction;
            let hitObject = im.hitTest(im.mouse.global, object);
            return !!hitObject;
        } else {
            const stage = Entry.stage.canvas;
            const pt = object.globalToLocal(stage.mouseX, stage.mouseY);
            return object.hitTest(pt.x, pt.y);
        }
    }

    tickByEngine() {
        if (this._isWebGL) {
            Entry.stage._app.ticker.start();
        } else {
            createjs.Ticker.on('tick', Entry.stage.canvas);
        }
    }

    // this function returns corresponding VideoElement,
    getVideoElement(video: HTMLVideoElement): any {
        console.log('getVideoElement');
        let videoElement: any = null;
        const { WIDTH, HEIGHT, X, Y, SCALE_X, SCALE_Y, ALPHA } = INITIAL_VIDEO_PARAMS;

        if (this._isWebGL) {
            const videoTexture = PIXI.Texture.fromVideo(video);
            videoElement = new PIXI.Sprite(videoTexture);
        } else {
            videoElement = new createjs.Bitmap(video);
        }
        videoElement.width = WIDTH;
        videoElement.height = HEIGHT;
        videoElement.x = X;
        videoElement.y = Y;
        videoElement.alpha = ALPHA;

        if (this._isWebGL) {
            videoElement.scale.x = SCALE_X;
            videoElement.scale.y = SCALE_Y;
        } else {
            videoElement.scaleX = SCALE_X;
            videoElement.scaleY = SCALE_Y;
            videoElement.on('tick', () => {
                if (videoElement.cacheCanvas) {
                    videoElement.updateCache();
                }
            });
        }
        return videoElement;
    }

    drawVideoElement(videoElement: HTMLVideoElement): any {
        Entry.stage.canvas.addChildAt(videoElement, 2);
        this.tickByEngine();
    }

    turnOffWebcam(canvasVideo: PIXI.Sprite | createjs.Bitmap) {
        if (!canvasVideo) {
            return;
        }
        Entry.stage.canvas.removeChild(canvasVideo);
        this.tickByEngine();
    }

    hFlipVideoElement(canvasVideo: PIXI.Sprite | createjs.Bitmap): any {
        const { x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY } = canvasVideo;
        canvasVideo.setTransform(-x, y, -scaleX, scaleY, rotation, skewX, skewY, regX, regY);
        this.tickByEngine();
    }

    vFlipVideoElement(canvasVideo: PIXI.Sprite | createjs.Bitmap): any {
        const { x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY } = canvasVideo;
        canvasVideo.setTransform(x, -y, scaleX, -scaleY, rotation, skewX, skewY, regX, regY);
        this.tickByEngine();
    }
    resetCanvasBrightness(canvasVideo: PIXI.Sprite | createjs.Bitmap) {
        if (this._isWebGL) {
            canvasVideo.filters[0].enabled = false;
            canvasVideo.filters = [];
        } else {
            canvasVideo.uncache();
        }
    }

    setVideoBrightness(canvasVideo: PIXI.Sprite | createjs.Bitmap, value: number): any {
        if (this._isWebGL) {
            const recalculated = (value + 100) / 200;
            const colorMatrix = new PIXI.filters.ColorMatrixFilter();
            canvasVideo.filters = [colorMatrix];
            colorMatrix.brightness(recalculated);
            colorMatrix.enabled = true;
        } else {
            const recalculated = ((value + 100) * 255 - 25500) / 200;

            const colorMatrix = new createjs.ColorMatrix().adjustBrightness(recalculated);
            const filter = new createjs.ColorMatrixFilter();
            filter.matrix = colorMatrix;
            canvasVideo.filters = [filter];
            canvasVideo.cache(0, 0, canvasVideo.image.videoWidth, canvasVideo.image.videoHeight);
        }
        return canvasVideo;
    }
    setVideoAlpha(canvasVideo: PIXI.Sprite | createjs.Bitmap, value: number): any {
        if (this.isWebGL) {
            canvasVideo.alpha = (100 - value) / 100;
        } else {
            canvasVideo.uncache();
            canvasVideo.alpha = (100 - value) / 100;
            canvasVideo.cache(0, 0, canvasVideo.image.videoWidth, canvasVideo.image.videoHeight);
        }
    }

    drawPosePoint(ctx: any, position: any) {
        const { x, y } = position;
        if (this._isWebGL) {
        } else {
            const R = 5;
            ctx.beginPath();
            ctx.arc((x * 4) / 3, (y * 4) / 3, R, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    }
    drawPoseSkeleton(ctx: any, start: any, end: any) {
        if (this._isWebGL) {
        } else {
            ctx.beginPath();
            ctx.moveTo((start.x * 4) / 3, (start.y * 4) / 3);
            ctx.lineTo((end.x * 4) / 3, (end.y * 4) / 3);
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }
    }
    drawObjectBox(ctx: any, bbox: Array, name: String, flipStatus: any, videoDimension: any) {
        const { WIDTH, HEIGHT, SCALE_X, SCALE_Y } = INITIAL_VIDEO_PARAMS;
        const x = bbox[0] / SCALE_X;
        const y = bbox[1] / SCALE_Y;
        const width = bbox[2] / SCALE_X;
        const height = bbox[3] / SCALE_Y;

        const textpoint = { x: x + width - 10, y: y + 60 };
        const cp1 = { x, y };
        const cp2 = { x: x + width, y };
        const cp3 = { x: x + width, y: y + height };
        const cp4 = { x, y: y + height };
        if (flipStatus.horizontal) {
            textpoint.x = videoDimension.VIDEO_WIDTH - textpoint.x - 100;
            cp1.x = videoDimension.VIDEO_WIDTH - cp1.x;
            cp2.x = videoDimension.VIDEO_WIDTH - cp2.x;
            cp3.x = videoDimension.VIDEO_WIDTH - cp3.x;
            cp4.x = videoDimension.VIDEO_WIDTH - cp4.x;
        }
        if (flipStatus.vertical) {
            textpoint.y = videoDimension.VIDEO_HEIGHT - textpoint.y;
            cp1.y = videoDimension.VIDEO_HEIGHT - cp1.y;
            cp2.y = videoDimension.VIDEO_HEIGHT - cp2.y;
            cp3.y = videoDimension.VIDEO_HEIGHT - cp3.y;
            cp4.y = videoDimension.VIDEO_HEIGHT - cp4.y;
        }

        if (this._isWebGL) {
        } else {
            ctx.beginPath();
            ctx.font = '30px Arial';
            ctx.fillText(name, textpoint.x, textpoint.y + 10);
            ctx.moveTo(cp1.x, cp1.y);
            ctx.lineTo(cp2.x, cp2.y);
            ctx.lineTo(cp3.x, cp3.y);
            ctx.lineTo(cp4.x, cp4.y);
            ctx.lineTo(cp1.x, cp1.y);
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    }

    getTransformedBounds(sprite: PIXI.Sprite | any): PIXI.Rectangle | any {
        if (this._isWebGL) {
            return sprite.getBounds(false);
        } else {
            return sprite.getTransformedBounds();
        }
    }

    calcParentBound(obj: any): any {
        if (this._isWebGL) {
            return PIXIHelper.getTransformBound(obj);
        } else {
            return obj.getTransformedBounds();
        }
    }

    newContainer(debugName?: string): PIXI.Container | any {
        if (this._isWebGL) {
            return PIXIHelper.container(debugName);
        } else {
            return new createjs.Container();
        }
    }

    /**
     * stage wall 생성만을 위한 함수
     * @param path
     */
    newWallTexture(path: string): PIXI.Texture | HTMLImageElement {
        if (this._isWebGL) {
            return PIXI.Texture.fromImage(path);
        } else {
            let img: HTMLImageElement = new Image();
            img.src = path;
            return img;
        }
    }

    /**
     * stage wall 생성만을 위한 함수
     * @param tex
     */
    newWallSprite(tex: any) {
        if (this._isWebGL) {
            return new PIXI.Sprite(tex);
        } else {
            return new createjs.Bitmap(tex);
        }
    }

    newEmptySprite() {
        if (this._isWebGL) {
            return PIXIHelper.sprite();
        } else {
            return new createjs.Bitmap();
        }
    }

    newSpriteWithCallback(url: string, callback?: () => void) {
        let img = new Image();
        if (callback) {
            const $img = $(img);
            const handle = () => {
                $img.off('load', handle);
                callback();
            };
            $img.on('load', handle);
        }
        img.src = url;
        if (this._isWebGL) {
            return PIXI.Sprite.from(img);
        } else {
            return new createjs.Bitmap(img);
        }
    }

    newGraphic() {
        if (this._isWebGL) {
            return new PIXI.Graphics();
        } else {
            return new createjs.Shape();
        }
    }

    newAScaleAdaptor(target: any): any {
        if (this._isWebGL) {
            return PIXIScaleAdaptor.factory(target);
        }
        //createjs 는 사용하는 코드측에서 분기 처리.
        return null;
    }
}

export const GEHelper = new _GEHelper();

class _ColorFilterHelper extends GEHelperBase {
    hue(value: number) {
        if (this._isWebGL) {
            const cmHue = new PIXI.filters.ColorMatrixFilter();
            return cmHue.hue(value);
        } else {
            const cmHue = new createjs.ColorMatrix();
            cmHue.adjustColor(0, 0, 0, value);
            const hueFilter = new createjs.ColorMatrixFilter(cmHue);
            return hueFilter;
        }
    }

    brightness(value: number) {
        if (this._isWebGL) {
            value /= 255;
        }
        // pixi 필터에 brightness 가 있지만, createjs 와 matrix 값이 달라 결과가 다르게 보임. 그래서 동일하게 구현함.
        const matrix = [
            1,
            0,
            0,
            0,
            value,
            0,
            1,
            0,
            0,
            value,
            0,
            0,
            1,
            0,
            value,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1,
        ];
        return this.newColorMatrixFilter(matrix);
    }

    /**
     * @param matrixValue
     */
    newColorMatrixFilter(matrixValue: number[]) {
        if (this._isWebGL) {
            matrixValue.length = 20; // pixi matrix 는 5 * 4
            let m = new PIXI.filters.ColorMatrixFilter();
            m.matrix = matrixValue;
            return m;
        } else {
            //createjs matrix 는 5*5
            let cm = new createjs.ColorMatrix();
            cm.copy(matrixValue);
            return new createjs.ColorMatrixFilter(cm);
        }
    }

    /**
     *
     * @param entity - EntityObject
     * @param cache
     */
    setCache(entity: any, cache: boolean) {
        if (this._isWebGL) {
            //do nothing
        } else {
            cache ? entity.cache() : entity.object.uncache();
        }
    }
}

class _TextHelper extends GEHelperBase {
    setColor(target: PIXI.Text | any, color: string) {
        if (this._isWebGL) {
            target.style.fill = color;
        } else {
            target.color = color;
        }
    }

    /**
     * @param str
     * @param font size & fontface - 10pt NanumGothic
     * @param color css style color - #ffffff
     * @param textBaseline
     * @param textAlign
     * @
     */
    newText(
        str: string,
        font: string,
        color: string,
        textBaseline?: string,
        textAlign?: string
    ): PIXI.Text | any {
        if (this._isWebGL) {
            return PIXIHelper.text(str, font, color, textBaseline, textAlign);
        } else {
            let t = new createjs.Text(str, font, color);
            textBaseline ? (t.textBaseline = textBaseline) : 0;
            textAlign ? (t.textAlign = textAlign) : 0;
            return t;
        }
    }
}

class _BrushHelper extends GEHelperBase {
    newBrush() {
        if (this._isWebGL) {
            return new PIXIBrushAdaptor();
        } else {
            return new createjs.Graphics();
        }
    }

    newShape(brush: PIXIBrushAdaptor | any) {
        if (this._isWebGL) {
            let shape = PIXIHelper.newPIXIGraphics();
            brush.internal_setShape(shape);
            return shape;
        } else {
            return new createjs.Shape(brush);
        }
    }
}
