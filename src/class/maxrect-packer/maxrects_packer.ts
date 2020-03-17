import { Rectangle, IRectangle } from "./geom/Rectangle";
import { MaxRectsBin } from "./maxrects_bin";
import { OversizedElementBin } from "./oversized_element_bin";
import { Bin, IBin } from "./abstract_bin";
import { ImageRect } from './geom/ImageRect';

export const EDGE_MAX_VALUE: number = 4096;
export const EDGE_MIN_VALUE: number = 128;

/**
 * Options for MaxRect Packer
 * @property {boolean} options.smart Smart sizing packer (default is true)
 * @property {boolean} options.pot use power of 2 sizing (default is true)
 * @property {boolean} options.square use square size (default is false)
 * @export
 * @interface Option
 */
export interface IOption {
    smart?: boolean;
    pot?: boolean;
    square?: boolean;
}

export class MaxRectsPacker {
    public bins: Bin[];
    /**
     * Creates an instance of MaxRectsPacker.
     * @param {number} width of the output atlas (default is 4096)
     * @param {number} height of the output atlas (default is 4096)
     * @param {number} border of bin-texture (default is 0)
     * @param {number} padding between glyphs/images (default is 0)
     * @param {IOption} [options={}] (Optional) packing options
     * @memberof MaxRectsPacker
     */
    constructor (
        public width: number = EDGE_MAX_VALUE,
        public height: number = EDGE_MAX_VALUE,
        public border: number = 0,
        public padding: number = 0,
        public options: IOption = { smart: true, pot: true, square: true }
    ) {
        this.bins = [];
    }

    public add(rect:ImageRect) {
        var width = rect.width;
        var height = rect.height;
        var binIndex:number = this.bins.length;
        if (width > this.width || height > this.height) {
            this.bins.push(new OversizedElementBin(binIndex, rect));
        } else {
            let added = this.bins.find(bin => bin.add(rect));
            if (!added) {
                let bin = new MaxRectsBin(binIndex, this.width, this.height, this.border, this.padding, this.options);
                bin.add(rect);
                this.bins.push(bin);
            }
        }
    }

    /**
     * Add an Array of bins/rectangles to the packer.
     * Object structure: { width, height, data }
     * @param {IRectangle[]} rects Array of bin/rectangles
     * @memberof MaxRectsPacker
     */
    public addArray (rects: ImageRect[]) {
        this.sort(rects).forEach((r:ImageRect) => this.add(r));
    }

    private sort (rects: IRectangle[]) {
        return rects.slice().sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height));
    }

    public empty() {
        this.bins.length = 0;
    }
}
