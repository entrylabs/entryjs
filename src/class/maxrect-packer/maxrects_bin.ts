import { EDGE_MAX_VALUE, IOption } from "./maxrects_packer";
import { Rectangle, IRectangle } from "./geom/Rectangle";
import { Bin } from "./abstract_bin";
import { ImageRect } from './geom/ImageRect';

export class MaxRectsBin extends Bin {
    public width: number;
    public height: number;
    public freeRects: Rectangle[] = [];
    public rects: ImageRect[] = [];
    private verticalExpand: boolean = false;
    private stage: Rectangle;

    constructor (
        public index:number,
        public maxWidth: number = EDGE_MAX_VALUE,
        public maxHeight: number = EDGE_MAX_VALUE,
        public border: number = 0,
        public padding: number = 0,
        public options: IOption = { smart: true, pot: true, square: true }
    ) {
        super();
        this.width = this.options.smart ? 0 : maxWidth;
        this.height = this.options.smart ? 0 : maxHeight;
        this.freeRects.push(new Rectangle(border, border, this.maxWidth + this.padding*2 - this.border, this.maxHeight + this.padding*2 - this.border));
        this.stage = new Rectangle(0, 0, this.width, this.height);
    }

    public add (rect:ImageRect): boolean {
        var PAD = this.padding * 2;
        var width:number = rect.width;
        var height:number = rect.height;
        let node: Rectangle | undefined = this.findNode(width + PAD, height + PAD);
        if (node) {
            this.updateBinSize(node);
            let numRectToProcess = this.freeRects.length;
            let i: number = 0;
            while (i < numRectToProcess) {
                if (this.splitNode(this.freeRects[i], node)) {
                    this.freeRects.splice(i, 1);
                    numRectToProcess--;
                    i--;
                }
                i++;
            }
            this.pruneFreeList();
            this.verticalExpand = this.width > this.height ? true : false;
            rect.x = node.x;
            rect.y = node.y;
            this.pushRect(rect, false);
            return true;
        } else if (!this.verticalExpand) {
            if (this.updateBinSize(new Rectangle(this.width + PAD, 0, width + this.padding, height + PAD))
                || this.updateBinSize(new Rectangle(0, this.height + PAD, width + PAD, height + PAD))) {
                return this.add(rect);
            }
        } else {
            if (this.updateBinSize(new Rectangle(
                0, this.height + PAD,
                width + PAD, height + PAD
            )) || this.updateBinSize(new Rectangle(
                this.width + PAD, 0,
                width + PAD, height + PAD
            ))) {
                return this.add(rect);
            }
        }
        return undefined;
    }
    /*
    public add (width: number, height: number, data: any): Rectangle | undefined {
        let node: Rectangle | undefined = this.findNode(width + this.padding, height + this.padding);
        if (node) {
            this.updateBinSize(node);
            let numRectToProcess = this.freeRects.length;
            let i: number = 0;
            while (i < numRectToProcess) {
                if (this.splitNode(this.freeRects[i], node)) {
                    this.freeRects.splice(i, 1);
                    numRectToProcess--;
                    i--;
                }
                i++;
            }
            this.pruneFreeList();
            this.verticalExpand = this.width > this.height ? true : false;
            let rect: Rectangle = new Rectangle(node.x, node.y, width, height);
            rect.data = data;
            this.rects.push(rect);
            return rect;
        } else if (!this.verticalExpand) {
            if (this.updateBinSize(new Rectangle(this.width + this.padding, 0, width + this.padding, height + this.padding))
                || this.updateBinSize(new Rectangle(0, this.height + this.padding, width + this.padding, height + this.padding))) {
                return this.add(width, height, data);
            }
        } else {
            if (this.updateBinSize(new Rectangle(
                0, this.height + this.padding,
                width + this.padding, height + this.padding
            )) || this.updateBinSize(new Rectangle(
                this.width + this.padding, 0,
                width + this.padding, height + this.padding
            ))) {
                return this.add(width, height, data);
            }
        }
        return undefined;
    }
    */

    private findNode (width: number, height: number): Rectangle | undefined {
        let score: number = Number.MAX_VALUE;
        let areaFit: number;
        let r: Rectangle;
        let bestNode: Rectangle | undefined;
        for (let i in this.freeRects) {
            r = this.freeRects[i];
            if (r.width >= width && r.height >= height) {
                areaFit = r.width * r.height - width * height;
                if (areaFit < score) {
                    // bestNode.x = r.x;
                    // bestNode.y = r.y;
                    // bestNode.width = width;
                    // bestNode.height = height;
                    bestNode = new Rectangle(r.x, r.y, width, height);
                    score = areaFit;
                }
            }
        }
        return bestNode;
    }

    private splitNode (freeRect: Rectangle, usedNode: Rectangle): boolean {
        // Test if usedNode intersect with freeRect
        if (!freeRect.collide(usedNode)) return false;

        // Do vertical split
        if (usedNode.x < freeRect.x + freeRect.width && usedNode.x + usedNode.width > freeRect.x) {
            // New node at the top side of the used node
            if (usedNode.y > freeRect.y && usedNode.y < freeRect.y + freeRect.height) {
                let newNode: Rectangle = new Rectangle(freeRect.x, freeRect.y, freeRect.width, usedNode.y - freeRect.y);
                this.freeRects.push(newNode);
            }
            // New node at the bottom side of the used node
            if (usedNode.y + usedNode.height < freeRect.y + freeRect.height) {
                let newNode = new Rectangle(
                    freeRect.x,
                    usedNode.y + usedNode.height,
                    freeRect.width,
                    freeRect.y + freeRect.height - (usedNode.y + usedNode.height)
                );
                this.freeRects.push(newNode);
            }
        }

        // Do Horizontal split
        if (usedNode.y < freeRect.y + freeRect.height &&
            usedNode.y + usedNode.height > freeRect.y) {
            // New node at the left side of the used node.
            if (usedNode.x > freeRect.x && usedNode.x < freeRect.x + freeRect.width) {
                let newNode = new Rectangle(freeRect.x, freeRect.y, usedNode.x - freeRect.x, freeRect.height);
                this.freeRects.push(newNode);
            }
            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeRect.x + freeRect.width) {
                let newNode = new Rectangle(
                    usedNode.x + usedNode.width,
                    freeRect.y,
                    freeRect.x + freeRect.width - (usedNode.x + usedNode.width),
                    freeRect.height
                );
                this.freeRects.push(newNode);
            }
        }
        return true;
    }

    private pruneFreeList () {
        // Go through each pair of freeRects and remove any rects that is redundant
        let i: number = 0;
        let j: number = 0;
        let len: number = this.freeRects.length;
        while (i < len) {
            j = i + 1;
            let tmpRect1 = this.freeRects[i];
            while (j < len) {
                let tmpRect2 = this.freeRects[j];
                if (tmpRect2.contain(tmpRect1)) {
                    this.freeRects.splice(i, 1);
                    i--;
                    len--;
                    break;
                }
                if (tmpRect1.contain(tmpRect2)) {
                    this.freeRects.splice(j, 1);
                    j--;
                    len--;
                }
                j++;
            }
            i++;
        }
    }

    private updateBinSize (node: Rectangle): boolean {
        if (!this.options.smart) return false;
        if (this.stage.contain(node)) return false;
        var PAD = this.padding * 2;
        let tmpWidth: number = Math.max(this.width, node.x + node.width - PAD);
        let tmpHeight: number = Math.max(this.height, node.y + node.height - PAD);
        if (this.options.pot) {
            tmpWidth = Math.pow(2, Math.ceil(Math.log(tmpWidth) * Math.LOG2E));
            tmpHeight = Math.pow(2, Math.ceil(Math.log(tmpHeight) * Math.LOG2E));
        }
        if (this.options.square) {
            tmpWidth = tmpHeight = Math.max(tmpWidth, tmpHeight);
        }
        if (tmpWidth > this.maxWidth + PAD || tmpHeight > this.maxHeight + PAD) {
            return false;
        }
        this.expandFreeRects(tmpWidth + PAD, tmpHeight + PAD);
        this.width = this.stage.width = tmpWidth;
        this.height = this.stage.height = tmpHeight;
        return true;
    }

    private expandFreeRects (width: number, height: number) {
        var PAD = this.padding * 2;
        this.freeRects.forEach((freeRect, index) => {
            if (freeRect.x + freeRect.width >= Math.min(this.width + PAD, width)) {
                freeRect.width = width - freeRect.x;
            }
            if (freeRect.y + freeRect.height >= Math.min(this.height + PAD, height)) {
                freeRect.height = height - freeRect.y;
            }
        }, this);
        this.freeRects.push(new Rectangle(this.width + PAD, 0, width - this.width - PAD, height));
        this.freeRects.push(new Rectangle(0, this.height + PAD, width, height - this.height - PAD));
        this.freeRects.forEach((freeRect, index) => {
            if (freeRect.width <= 0 || freeRect.height <= 0) {
                this.freeRects.splice(index, 1);
            }
        }, this);
        this.pruneFreeList();
    }
}
