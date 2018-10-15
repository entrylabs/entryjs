import { IRectangle } from "./geom/Rectangle";
import { IOption } from "./maxrects_packer";
import { InputRect } from './geom/InputRect';

export interface IBin {
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    index:number;
    freeRects: IRectangle[];
    rects: InputRect[];
    options: IOption;
}

export abstract class Bin implements IBin {
    public width: number;
    public height: number;
    public maxWidth: number;
    public maxHeight: number;
    public index:number;
    public freeRects: IRectangle[];
    public rects: InputRect[];
    public options: IOption;
    public abstract add (rect:InputRect): boolean;

    protected pushRect(rect:InputRect, oversized:boolean) {
        rect.binIndex = this.index;
        rect.oversized = oversized;
        this.rects.push(rect);
    }
}
