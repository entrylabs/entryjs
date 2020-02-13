/**
 * PIXI.DisplayObject.cacheAsBitmap 이 원하는대로 작동을 안함.
 * var sp = new PIXI.Sprite(texture);
 * sp.scale.set(2)
 * sp.cacheAsBitmap = true; 이렇게 하면 케시된 텍스쳐가 localTransform에 영향을 받아서 스케일이 2배가 되어버림. 원본과 동일해야 하는데...
 *
 * 그래서 setFilterAndCache() 로 비슷하게 구현.
 */
import { Texture, Sprite, RenderTexture, Matrix, Renderer } from 'pixi.js';
import { EntryTextureBase } from '../atlas/texture/EntryTextureBase';

class FilterData {
    private _orgTex: EntryTextureBase | RenderTexture;
    private _renderTex: RenderTexture;

    filters: any[];
    invalidate: boolean;

    setOrgTex(orgTex: EntryTextureBase) {
        this._orgTex = orgTex;
    }

    isSameRenderTex(tex: any): boolean {
        return tex == this._renderTex;
    }

    get orgTex(): EntryTextureBase | RenderTexture {
        return this._orgTex;
    }

    getRenderTexture(width: number, height: number): RenderTexture {
        if (!this._renderTex) {
            this._renderTex = RenderTexture.create({ width, height });
            return;
        }
        const tex = this._renderTex;
        if (tex.width != width || tex.height != height) {
            this.destroyRenderTexture();
            return this.getRenderTexture(width, height);
        }
        return this._renderTex;
    }

    destroyRenderTexture() {
        if (!this._renderTex) {
            return;
        }
        this._renderTex.destroy(true);
        this._renderTex = null;
    }

    destroy() {
        this.destroyRenderTexture();
        this._orgTex = null;
        this.filters = null;
    }
}

var EMPTY_SP = new Sprite();
var MAT:any = new Matrix();

export class PIXISprite extends Sprite {
    private _filterData: FilterData;
    // public _filterData:FilterData;

    //PIXIPixelPerfectInteractionPlugIn 에서 호출함.
    internal_getOriginalTex() {
        return (this._filterData && this._filterData.orgTex) || this.texture;
    }

    setFilterAndCache(filters: any[] | null) {
        if (!filters || !filters.length) {
            if (this._filterData) {
                this.texture = this._filterData.orgTex;
                this._filterData.destroy();
                this._filterData = null;
            }
        } else {
            if (!this._filterData) {
                this._filterData = new FilterData();
                this._filterData.setOrgTex(this.texture as EntryTextureBase);
            } else if (!this._filterData.isSameRenderTex(this.texture)) {
                this._filterData.setOrgTex(this.texture as EntryTextureBase);
            }
            this._filterData.filters = filters;
            this._filterData.invalidate = true;
        }
    }

    /**
     * filter + cache 가 이미 설정되고, 다른 텍스쳐로 할당 되었을때 filter를 다시 설정하기 위한 메서드
     * set texture 를 override 하지 못해서...
     */
    refreshFilter() {
        if (!this._filterData) return;
        if (!this._filterData.filters) return;
        this.setFilterAndCache(this._filterData.filters);
    }

    destroy(options?: any) {
        super.destroy(options);
        if (this._filterData) {
            this._filterData.destroy();
            this._filterData = null;
        }
    }

    renderWebGL(renderer: Renderer): void {
        if (this._filterData && this._filterData.invalidate) {
            this._filterData.invalidate = false;
            this._initFilterCache(renderer);
        }
        super.render(renderer);
    }

    private _initFilterCache(renderer: Renderer) {
        const fd: FilterData = this._filterData;
        const tex: Texture = fd.orgTex;

        const w = tex.orig.width;
        const h = tex.orig.height;
        const renderTex: RenderTexture = fd.getRenderTexture(w, h);
        if (fd.orgTex instanceof EntryTextureBase) {
            // filter 된 sprite 를 도장찍기 하면 sprite.texture 의 type 는 RenderTexture 가 된다.
            fd.orgTex.assignTextureScaleFactor(renderTex);
        }
        const sp = EMPTY_SP;
        sp.filters = this._filterData.filters;
        sp.texture = tex;

        // TODO. 구현필요.
        // const cachedRenderTarget = renderer._activeRenderTarget;
        // renderer.currentRenderer.flush();
        // renderer.render(sp, renderTex, true, MAT , false);
        // renderer.bindRenderTarget(cachedRenderTarget);

        this.texture = renderTex;
        sp.texture = null;
    }
}
