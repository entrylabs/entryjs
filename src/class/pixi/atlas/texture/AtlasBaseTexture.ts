import { BaseTexture, resources } from 'pixi.js';
import { AtlasCanvasViewer } from '../AtlasCanvasViewer';

export class AtlasBaseTexture extends BaseTexture {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _activated: boolean;

    constructor(private _viewer?: AtlasCanvasViewer, scaleMode?: number) {
        super(null, { scaleMode });
    }

    get activated(): boolean {
        return this._activated;
    }

    setCanvas(canvas: HTMLCanvasElement) {
        const resource = new resources.CanvasResource(canvas);
        this.setResource(resource);
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
    }

    getCanvas(): HTMLCanvasElement {
        return this._canvas;
    }

    cleanCanvas(): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    activate(MAX_SIZE: number) {
        this._activated = true;
        this._canvas.width = MAX_SIZE;
        this._canvas.height = MAX_SIZE;
        // this.hasLoaded = true; deprecated v5
        this._viewer.add(this._canvas);
    }

    deactivate() {
        this._activated = false;
        this._canvas.width = 1;
        this._canvas.height = 1;
        this.dispose();
    }

    destroy() {
        super.destroy();
        this._canvas = null;
        this._ctx = null;
    }

    dispose() {
        super.dispose();
        if (this._viewer) {
            this._viewer.removeCanvas(this._canvas);
        }
    }

    getCtx() {
        return this._ctx;
    }
}
