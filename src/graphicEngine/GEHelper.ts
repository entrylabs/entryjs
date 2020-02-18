import PIXIHelper from '../class/pixi/helper/PIXIHelper';
import { PIXIGlobal } from '../class/pixi/init/PIXIGlobal';
import { GEDragHelper } from './GEDragHelper';
import { IGEResManager } from './IGEResManager';
import { EaselResManager } from './EaselResManager';
import { PIXISprite } from '../class/pixi/plugins/PIXISprite';
import { PIXIBrushAdaptor } from '../class/pixi/etc/PIXIBrushAdaptor';
import { PIXIScaleAdaptor } from '../class/pixi/atlas/PIXIScaleAdaptor';
import { connectedPartIndices } from '@tensorflow-models/posenet/dist/keypoints';

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

    /**  pixi Graphics로 비디오 감지 표현하기 위한 PIXI.Graphics */
    public poseIndicatorGraphic: PIXI.Graphics | createjs.Graphics;
    public faceIndicatorGraphic: PIXI.Graphics | createjs.Graphics;
    public objectIndicatorGraphic: PIXI.Graphics | createjs.Graphics;

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

    createNewIndicatorGraphic() {
        const graphic = this.newGraphic();
        graphic.width = 640;
        graphic.height = 360;
        graphic.x = INITIAL_VIDEO_PARAMS.X;
        graphic.y = INITIAL_VIDEO_PARAMS.Y;
        return graphic;
    }

    drawVideoElement(videoElement: HTMLVideoElement): any {
        Entry.stage.canvas.addChildAt(videoElement, 2);

        this.poseIndicatorGraphic = this.createNewIndicatorGraphic();
        this.faceIndicatorGraphic = this.createNewIndicatorGraphic();
        this.objectIndicatorGraphic = this.createNewIndicatorGraphic();
        Entry.stage.canvas.addChild(this.poseIndicatorGraphic);
        Entry.stage.canvas.addChild(this.faceIndicatorGraphic);
        Entry.stage.canvas.addChild(this.objectIndicatorGraphic);

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

    resetHandlers() {
        if (
            !this.faceIndicatorGraphic ||
            !this.poseIndicatorGraphic ||
            !this.objectIndicatorGraphic
        ) {
            return;
        }
        if (this.isWebGL) {
            this.faceIndicatorGraphic.clear();
            this.poseIndicatorGraphic.clear();
            this.objectIndicatorGraphic.clear();
        } else {
            this.faceIndicatorGraphic.graphics.clear();
            this.poseIndicatorGraphic.graphics.clear();
            this.objectIndicatorGraphic.graphics.clear();
        }
        this.tickByEngine();
    }

    drawHumanPoints(poses: Array<any>, flipStatus: any) {
        const R = 5;
        let handler = this.poseIndicatorGraphic;
        if (this._isWebGL) {
        } else {
            handler = this.poseIndicatorGraphic.graphics;
        }
        handler.clear();

        poses.map((pose: any) => {
            pose.keypoints.map((item: any) => {
                const { x, y } = item.position;
                const recalculatedY = flipStatus.vertical ? INITIAL_VIDEO_PARAMS.HEIGHT - y : y;

                handler.beginFill(0x0000ff);
                handler.drawCircle(x, recalculatedY, R);
                handler.endFill();
            });
        });
    }

    drawHumanSkeletons(adjacents: Array<any>, flipStatus: any) {
        let coordList: any = [];
        let handler = this.poseIndicatorGraphic;
        adjacents.forEach((adjacentList: any) => {
            adjacentList.forEach((pair: any) => {
                const start = pair[0].position;
                const end = pair[1].position;
                if (flipStatus.vertical) {
                    start.y = INITIAL_VIDEO_PARAMS.HEIGHT - start.y;
                    end.y = INITIAL_VIDEO_PARAMS.HEIGHT - end.y;
                }
                coordList.push({ start, end });
            });
        });

        if (this._isWebGL) {
            handler.lineStyle(5, 0x0000ff);
            coordList.forEach((coord: any) => {
                const { start, end } = coord;
                handler.moveTo(start.x, start.y).lineTo(end.x, end.y);
            });
        } else {
            handler = handler.graphics;
            handler.setStrokeStyle(8, 'round').beginStroke('blue');
            coordList.forEach((coord: any) => {
                const { start, end } = coord;
                handler.moveTo(start.x, start.y).lineTo(end.x, end.y);
            });
        }
    }

    drawFaceBoxes(faces: Array<any>, flipStatus: any) {
        let handler = this.faceIndicatorGraphic;
        let faceBoxList: Array = [];

        const { WIDTH, HEIGHT } = INITIAL_VIDEO_PARAMS;
        faces.forEach((face) => {
            const target = face.alignedRect._box;

            let x = target._x;
            let y = target._y;
            const width = target._width;
            const height = target._height;
            if (flipStatus.horizontal) {
                x = INITIAL_VIDEO_PARAMS.WIDTH - x - width;
            }
            if (flipStatus.vertical) {
                y = INITIAL_VIDEO_PARAMS.HEIGHT - y - height;
            }
            faceBoxList.push({ x, y, width, height });
        });

        if (this._isWebGL) {
            handler.clear();
            handler.lineStyle(5, 0xff0000);
            faceBoxList.forEach((item: any) => {
                const { x, y, width, height } = item;
                handler.drawRect(x, y, width, height);
            });
        } else {
            handler = handler.graphics;
            handler.clear();
            faceBoxList.forEach((item: any) => {
                const { x, y, width, height } = item;
                handler
                    .setStrokeStyle(8, 'round')
                    .beginStroke('red')
                    .drawRect(x, y, width, height);
            });
        }
    }

    drawObjectBox(objects: Array<any>, flipStatus: any) {
        let objectsList: any = [];

        objects.forEach((object: any) => {
            const bbox = object.bbox;
            const name = object.class || '';

            let x = bbox[0];
            let y = bbox[1];
            const width = bbox[2];
            const height = bbox[3];

            if (flipStatus.horizontal) {
                x = INITIAL_VIDEO_PARAMS.WIDTH - x - width;
            }
            if (flipStatus.vertical) {
                y = INITIAL_VIDEO_PARAMS.HEIGHT - y - height;
            }
            const textpoint = { x: x + 20, y: y + 20 };
            objectsList.push({ textpoint, name, x, y, width, height });
        });

        let handler = this.objectIndicatorGraphic;

        if (this._isWebGL) {
            handler.clear();
            handler.lineStyle(5, 0xff0000);
            objectsList.forEach((target: any) => {
                const { textpoint, name, x, y, width, height } = target;
                if (name) {
                    const text = new PIXI.Text(name);
                    text.x = textpoint.x;
                    text.y = textpoint.y;

                    handler.addChild(text);
                }

                handler.drawRect(x, y, width, height);
            });
        } else {
            handler = handler.graphics;
            handler.clear();
            objectsList.forEach((target: any) => {
                const { textpoint, name, x, y, width, height } = target;

                if (name) {
                    const ctx = Entry.stage.canvas.canvas.getContext('2d');
                    ctx.font = '30px Arial';
                    ctx.fillText(name, textpoint.x, textpoint.y + 10);
                }
                handler
                    .setStrokeStyle(8, 'round')
                    .beginStroke('red')
                    .drawRect(x, y, width, height);
            });
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
