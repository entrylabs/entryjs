import { MaxRectsPacker } from 'maxrects-packer/lib/maxrects_packer';
import { AtlasCanvasViewer } from '../atlas/AtlasCanvasViewer';
import { IRectangle } from 'maxrects-packer/lib/geom/Rectangle';
import PIXIHelper from '../helper/PIXIHelper';
import { Bin } from 'maxrects-packer/lib/abstract_bin';

declare let _:any;

function newPacker():MaxRectsPacker {
    //https://www.npmjs.com/package/maxrects-packer
    const MAX_SIZE = 2048;
    const PADDING = 2;
    const OPTION = {
        smart: true,
        pot: true,
        square: false
    };
    return new MaxRectsPacker(MAX_SIZE, MAX_SIZE, PADDING, OPTION);
}

export class BinTest {
    static A:any;
    private _cnt:number = 0;
    public packer:MaxRectsPacker;
    _viewer:AtlasCanvasViewer = new AtlasCanvasViewer();
    _arrCanvas:HTMLCanvasElement[] = [];
    constructor() {
        this.packer = newPacker();

    }

    add(w:number, h:number) {
        this._viewer.empty();
        let c = (n:number = 255):number => {
            return Math.floor(Math.random()*n);
        };
        w = w || c(2000) + 1;
        h = h || c(2000) + 1;
        this.packer.add(w, h, `rgb(${c()},${c()},${c()})`);

        _.each(this.packer.bins,(bin:Bin, index:number)=>{
            var canvas:HTMLCanvasElement = this._arrCanvas[index];
            if(!canvas) {
                let S = 2048;
                canvas = this._arrCanvas[index] = PIXIHelper.getOffScreenCanvas(true);
                canvas.width = S;
                canvas.height = S;
                var ctx:CanvasRenderingContext2D = canvas.getContext("2d");
                ctx.fillStyle = `rgba(${c()},${c()},${c()}, 0.3)`;
                ctx.fillRect(0,0, S, S);
            }

            _.each(bin.rects, (r:IRectangle)=>{
                this._printColor(canvas, r);
            });
            this._viewer.add(canvas);
        });
    }

    _printColor(canvas:HTMLCanvasElement, rect:IRectangle) {

        var ctx:CanvasRenderingContext2D = canvas.getContext("2d");
        // ctx.fillStyle = ;
        ctx.fillStyle = rect.data;
        ctx.fillRect(rect.x,rect.y, rect.width, rect.height);
    }



}
let WW:any = window;
WW.bin = new BinTest();