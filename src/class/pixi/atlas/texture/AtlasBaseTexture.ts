import BaseTexture = PIXI.BaseTexture;

export class AtlasBaseTexture extends BaseTexture {

    private _canvas:HTMLCanvasElement;
    private _ctx:CanvasRenderingContext2D;

    constructor(source?: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, scaleMode?: number,resolution?: number ) {
        super(source, scaleMode, resolution);
    }

    setCanvas(canvas:HTMLCanvasElement) {
        this.source = canvas;
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
    }

    getCanvas():HTMLCanvasElement {
        return this._canvas;
    }

    getCtx():CanvasRenderingContext2D {
        return this._ctx;
    }

    cleanCanvas():void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }


    activate(MAX_SIZE:number) {
        this._canvas.width = MAX_SIZE;
        this._canvas.height = MAX_SIZE;
        this.hasLoaded = true;
    }

    deactivate() {
        this._canvas.width = 1;
        this._canvas.height = 1;
        this.dispose();
    }

    destroy() {
        super.destroy();
        this._canvas = null;
        this._ctx = null;
    }
}