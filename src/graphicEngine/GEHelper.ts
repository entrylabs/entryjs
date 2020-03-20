import PIXIHelper from '../class/pixi/helper/PIXIHelper';
import { PIXIGlobal } from '../class/pixi/init/PIXIGlobal';
import { GEDragHelper } from './GEDragHelper';
import { IGEResManager } from './IGEResManager';
import { EaselResManager } from './EaselResManager';
import { PIXIBrushAdaptor } from '../class/pixi/etc/PIXIBrushAdaptor';
import { PIXIScaleAdaptor } from '../class/pixi/atlas/PIXIScaleAdaptor';

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
        const stage = new createjs.Stage(canvas.id);
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

    /**
     * 비디오 블록용 컨테이너, index = 2 , 기존의 오브젝트 컨테이너 = index3;
     */
    private videoContainer: PIXI.Container | createjs.Container;

    INIT(isWebGL: boolean) {
        super.INIT(isWebGL);
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        GEDragHelper.INIT(isWebGL);
        (this.colorFilter = new _ColorFilterHelper()).INIT(isWebGL);
        (this.textHelper = new _TextHelper()).INIT(isWebGL);
        (this.brushHelper = new _BrushHelper()).INIT(isWebGL);
        if (this._isWebGL) {
            // this.rndPosition = ()=>{ return Math.random() * 0.8 - 0.4; };
            this.rndPosition = () => 0;
            this.rotateRead = 180 / Math.PI;
            this.rotateWrite = Math.PI / 180;
            PIXIGlobal.initOnce();
            this.resManager = PIXIGlobal.atlasManager;
            this.Ticker = {
                reset: emptyFn,
                setFPS: emptyFn,
            };
        } else {
            this.rndPosition = () => 0;
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
            const orgObj = entity.object;
            const orgTex = orgObj.internal_getOriginalTex && orgObj.internal_getOriginalTex();
            const object = PIXIHelper.sprite('StampEntity', orgTex || orgObj.texture);
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
            const object = entity.object.clone();
            object.mouseEnabled = false;
            object.tickEnabled = false;
            object.filters = null;
            return object;
        }
    }

    hitTestMouse(object: any): boolean {
        if (this._isWebGL) {
            const pixiApp: PIXI.Application = Entry.stage._app;
            const im = pixiApp.renderer.plugins.interaction;
            const hitObject = im.hitTest(im.mouse.global, object);
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

    getNewContainer(): any {
        if (this._isWebGL) {
            return new PIXI.Container();
        } else {
            return new createjs.Container();
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

    drawVideoElement(videoElement: PIXI.Sprite | createjs.Bitmap): any {
        if (!this.videoContainer) {
            this.videoContainer = Entry.stage.canvas.getChildAt(2);
        }

        this.videoContainer.addChild(videoElement);
        // Entry.stage.canvas.addChildAt(videoElement, 2);
        if (!this.poseIndicatorGraphic) {
            this.poseIndicatorGraphic = this.createNewIndicatorGraphic();
            Entry.stage.canvas.addChild(this.poseIndicatorGraphic);
        }
        if (!this.faceIndicatorGraphic) {
            this.faceIndicatorGraphic = this.createNewIndicatorGraphic();
            Entry.stage.canvas.addChild(this.faceIndicatorGraphic);
        }
        if (!this.objectIndicatorGraphic) {
            this.objectIndicatorGraphic = this.createNewIndicatorGraphic();
            Entry.stage.canvas.addChild(this.objectIndicatorGraphic);
        }
        this.tickByEngine();
    }

    turnOffWebcam(canvasVideo: PIXI.Sprite | createjs.Bitmap) {
        if (!canvasVideo) {
            return;
        }
        const targetContainer = Entry.stage.canvas.getChildAt(2);
        targetContainer.removeChild(canvasVideo);
    }

    hFlipVideoElement(canvasVideo: PIXI.Sprite | createjs.Bitmap): any {
        const { x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY } = canvasVideo;
        canvasVideo.setTransform(-x, y, -scaleX, scaleY, rotation, skewX, skewY, regX, regY);
    }

    vFlipVideoElement(canvasVideo: PIXI.Sprite | createjs.Bitmap): any {
        const { x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY } = canvasVideo;
        canvasVideo.setTransform(x, -y, scaleX, -scaleY, rotation, skewX, skewY, regX, regY);
    }

    resetCanvasBrightness(canvasVideo: PIXI.Sprite | createjs.Bitmap) {
        if (this._isWebGL) {
            if (canvasVideo.filters && canvasVideo.filters[0]) {
                canvasVideo.filters[0].enabled = false;
                canvasVideo.filters = [];
            }
        } else {
            canvasVideo.uncache();
        }
    }

    setVideoBrightness(canvasVideo: PIXI.Sprite | createjs.Bitmap, value: number): any {
        const filter = this.colorFilter.brightness(value);
        if (this._isWebGL) {
            canvasVideo.filters = [filter];
            filter.enabled = true;
        } else {
            canvasVideo.uncache();
            canvasVideo.filters = [filter];
            canvasVideo.tickEnabled = true;
            canvasVideo.cache(0, 0, canvasVideo.image.videoWidth, canvasVideo.image.videoHeight);
        }
        return canvasVideo;
    }

    setVideoAlpha(canvasVideo: PIXI.Sprite | createjs.Bitmap, value: number): any {
        canvasVideo.alpha = (100 - value) / 100;
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
            const handler = this.objectIndicatorGraphic;
            while (handler.children.length > 0) {
                const child = handler.getChildAt(0);
                handler.removeChild(child);
            }
        } else {
            this.faceIndicatorGraphic.graphics.clear();
            this.poseIndicatorGraphic.graphics.clear();
            this.objectIndicatorGraphic.graphics.clear();
        }
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
        const coordList: any = [];
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
        } else {
            handler = handler.graphics;
            handler.setStrokeStyle(8, 'round').beginStroke('blue');
        }
        coordList.forEach((coord: any) => {
            const { start, end } = coord;
            handler.moveTo(start.x, start.y).lineTo(end.x, end.y);
        });
    }

    drawFaceEdges(faces: any, flipStatus: any) {
        let handler = this.faceIndicatorGraphic;

        if (this._isWebGL) {
            handler.clear();
            handler.lineStyle(2, 0xff0000);
        } else {
            handler = handler.graphics;
            handler.clear();
            handler.setStrokeStyle(2, 'round').beginStroke('red');
        }
        faces.forEach((face: { landmarks: { _positions: any[] } }) => {
            const positions = face.landmarks._positions;
            positions.forEach((item, i) => {
                if (
                    i === 0 ||
                    i === 17 ||
                    i === 27 ||
                    i === 31 ||
                    i === 36 ||
                    i === 42 ||
                    i === 48
                ) {
                    return;
                }

                const prev = face.landmarks._positions[i - 1];
                this.drawEdge(prev, item, handler, flipStatus);
            });
            // compensation for missing edges
            this.drawEdge(positions[42], positions[47], handler, flipStatus);
            this.drawEdge(positions[41], positions[36], handler, flipStatus);
            this.drawEdge(positions[60], positions[67], handler, flipStatus);
            this.drawEdge(positions[0], positions[17], handler, flipStatus);
            this.drawEdge(positions[16], positions[26], handler, flipStatus);
            this.drawEdge(positions[27], positions[31], handler, flipStatus);
            this.drawEdge(positions[27], positions[35], handler, flipStatus);
            this.drawEdge(positions[30], positions[31], handler, flipStatus);
            this.drawEdge(positions[30], positions[35], handler, flipStatus);
        });
    }

    drawEdge(
        pos1: { _x: number; _y: number },
        pos2: { _x: number; _y: number },
        handler: PIXI.Graphics | createjs.Graphics,
        flipStatus: any
    ) {
        const { WIDTH, HEIGHT } = INITIAL_VIDEO_PARAMS;

        let { _x, _y } = pos2;
        let prevX = pos1._x;
        let prevY = pos1._y;
        if (flipStatus.horizontal) {
            _x = WIDTH - _x;
            prevX = WIDTH - prevX;
        }
        if (flipStatus.vertical) {
            _y = HEIGHT - _y;
            prevY = HEIGHT - prevY;
        }

        handler.moveTo(prevX, prevY).lineTo(_x, _y);
    }

    drawObjectBox(objects: Array<any>, flipStatus: any) {
        const objectsList: any = [];
        objects.forEach((object: any) => {
            const bbox = object.bbox;
            const name = object.class ? Lang.video_object_params[object.class] : '';
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
            while (handler.children.length > 0) {
                const child = handler.getChildAt(0);
                handler.removeChild(child);
            }
            handler.lineStyle(5, 0xff0000);
            objectsList.forEach((target: any) => {
                const { textpoint, name, x, y, width, height } = target;
                if (name) {
                    const text = PIXIHelper.text(name, '20px Nanum Gothic', '', 'middle', 'center');
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
                    handler.append({
                        exec: (ctx: any) => {
                            ctx.font = '20px Nanum Gothic';
                            ctx.fillText(name, textpoint.x - 5, textpoint.y + 5);
                        },
                    });
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
            const img: HTMLImageElement = new Image();
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
        const img = new Image();
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
            const m = new PIXI.filters.ColorMatrixFilter();
            m.matrix = matrixValue;
            return m;
        } else {
            //createjs matrix 는 5*5
            const cm = new createjs.ColorMatrix();
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
            const t = new createjs.Text(str, font, color);
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
            const shape = PIXIHelper.newPIXIGraphics();
            brush.internal_setShape(shape);
            return shape;
        } else {
            return new createjs.Shape(brush);
        }
    }
}
