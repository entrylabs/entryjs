import { BaseTexture, resources } from 'pixi.js';

export class EntryBaseTexture extends BaseTexture {
    private _hasSource: boolean;

    updateSource(src: HTMLImageElement | HTMLCanvasElement) {
        if (this._hasSource) return;
        this._hasSource = true;
        const source = resources.autoDetectResource(src);
        this.setResource(source);
        this.update();
    }

    dispose(): void {
        this._hasSource = false;
        super.dispose();
    }
}
