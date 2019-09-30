export class EntryBaseTexture extends PIXI.BaseTexture {
    private _hasSource: boolean;
    updateSource(src: HTMLImageElement | HTMLCanvasElement) {
        if (this._hasSource) return;
        this._hasSource = true;
        this.loadSource(src);
    }

    dispose(): void {
        this._hasSource = false;
        super.dispose();
    }
}
