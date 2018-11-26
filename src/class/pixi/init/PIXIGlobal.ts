import { PIXIBaseAsset } from './PIXIBaseAsset';
require("./../etc/PIXI-ndgmr.Collision");
require("./../etc/PIXICanvasInput");
require("../__testfiles/testcodes");
import { PIXIAtlasManager } from '../atlas/PIXIAtlasManager';
import { PIXIZeroAlphaNoneInteractionPlugins } from '../plugins/PIXIZeroAlphaNoneInteractionPlugins';
import { PIXIPixelPerfectInteractionPlugIn } from '../plugins/PIXIPixelPerfectInteractionPlugIn';
import { PIXITempStore } from '../etc/PIXITempStore';
import { PIXITextMetricsPlugIn } from '../plugins/PIXITextMetricsPlugIn';


declare let ndgmr:any;

class _PIXIGlobal {

    private _init:boolean;
    /** @readonly */
    baseAsset:PIXIBaseAsset;
    private _app:PIXI.Application;

    initOnce() {
        if(this._init) return;
        this._init = true;
        this.baseAsset = new PIXIBaseAsset();
        ndgmr.initTempObject();
        PIXITempStore.init();
        PIXIAtlasManager.INIT();
        new PIXIZeroAlphaNoneInteractionPlugins();
        new PIXIPixelPerfectInteractionPlugIn();
        PIXITextMetricsPlugIn();
    }

    getNewApp(canvas:HTMLCanvasElement):PIXI.Application {
        return new PIXI.Application({
            view: canvas,
            width: canvas.width,
            height: canvas.height,
            autoStart: false,
            // autoStart: true,
            antialias:true,
            transparent: true
        });
    }
}

export let PIXIGlobal:_PIXIGlobal = new _PIXIGlobal();