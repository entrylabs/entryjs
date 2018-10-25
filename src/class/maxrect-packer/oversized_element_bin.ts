import { IOption } from "./maxrects_packer";
import { Bin } from "./abstract_bin";
import { ImageRect } from './geom/ImageRect';

export class OversizedElementBin extends Bin {
    public maxWidth: number;
    public maxHeight: number;
    public options: IOption;

    constructor (public index:number, rect:ImageRect) {
        super();
        this.rects = [];
        this.freeRects = [];
        this.maxWidth = rect.width;
        this.maxHeight = rect.height;
        this.options = { smart: false, pot: false, square: false };
        this.pushRect(rect, true);
    }
    add (rect:ImageRect): boolean { return false; }

}
