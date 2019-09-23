export class EntryBaseTexture extends PIXI.BaseTexture {
    private _hasSource: boolean;

    updateSource(src: HTMLImageElement | HTMLCanvasElement) {
        if (this._hasSource) return;
        this._hasSource = true;
        try {
            this.loadSource(src);
        } catch (e) {
            this.width = src.clientWidth;
            this.height = src.clientHeight;
            this.loadSource(src);
        }
    }

    dispose(): void {
        this._hasSource = false;
        super.dispose();
    }
}
