import { IRectangle } from "./geom/Rectangle";
import { IOption } from "./maxrects_packer";
import { ImageRect } from './geom/ImageRect';

export interface IBin {
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    index:number;
    freeRects: IRectangle[];
    rects: ImageRect[];
    options: IOption;
}

export abstract class Bin implements IBin {
    public width: number;
    public height: number;
    public maxWidth: number;
    public maxHeight: number;
    public index:number;
    public freeRects: IRectangle[];
    public rects: ImageRect[];
    public options: IOption;
    public abstract add (rect:ImageRect): boolean;

    protected pushRect(rect:ImageRect, oversized:boolean) {
        rect.binIndex = this.index;
        rect.oversized = oversized;
        this.rects.push(rect);
    }
}
