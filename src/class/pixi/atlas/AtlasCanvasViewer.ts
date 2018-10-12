/**
 * BaseTexture 의 canvas 에 drawing이 잘 되는지 확인하기 위한 debug 클라스.
 */

let style = `<style>
    .atlas-canvas-container {
        position: absolute;
        width: 100%;
        pointer-events: none;
    }
    .atlas-canvas {
        width: auto; height: 100px; float: right;
    }
</style>
`;

let dom = `<div class='atlas-canvas-container'></div>`;
declare let $:any;
export class AtlasCanvasViewer {

    private $style:any;
    private $container:any;
    private attached:boolean;

    constructor() {
        this.$style = $(style);
        this.$container = $(dom);
    }

    private attachToBody() {
        if(this.attached) return;
        this.attached = true;
        setTimeout(()=>{
            this.$container.click(function(){return false;});
            $("head").append(this.$style);
            $("body").append(this.$container);
        }, 500);
    }

    add(c:any) {
        this.attachToBody();
        var isCanvas = c instanceof HTMLCanvasElement;
        if(!isCanvas) return;
        var cc = $(c);
        this.$container.append(cc);
        cc.addClass("atlas-canvas");
    }

    empty() {
        this.$container.empty();
    }
}