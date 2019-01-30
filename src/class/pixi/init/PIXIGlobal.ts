import { PIXIBaseAsset } from './PIXIBaseAsset';
require("./../etc/PIXI-ndgmr.Collision");
require("./../etc/PIXICanvasInput");
let entryIsWebGLSupported = require("./entryIsWebGLSupported").entryIsWebGLSupported;

import { PIXIAtlasManager } from '../atlas/PIXIAtlasManager';
import { PIXIZeroAlphaNoneInteractionPlugins } from '../plugins/PIXIZeroAlphaNoneInteractionPlugins';
import { PIXIPixelPerfectInteractionPlugIn } from '../plugins/PIXIPixelPerfectInteractionPlugIn';
import { PIXITempStore } from '../etc/PIXITempStore';
import { PIXITextMetricsPlugIn } from '../plugins/PIXITextMetricsPlugIn';
import { PIXIDebug } from '../debugs/Debugs';
import { PIXIShortPropPlugin } from '../plugins/PIXIShortPropPlugin';
import { PIXIGraphicOverride } from '../plugins/PIXIGraphicOverride';


declare let ndgmr:any;

class _PIXIGlobal {
    
    private _init:boolean;
    /** @readonly */
    baseAsset:PIXIBaseAsset;
    atlasManager:PIXIAtlasManager;

    initOnce() {
        if(this._init) return;
        entryIsWebGLSupported();
        this._init = true;
        PIXIDebug.internal_init();
        //this.baseAsset = new PIXIBaseAsset();
        ndgmr.initTempObject();
        PIXITempStore.init();
        this.atlasManager = new PIXIAtlasManager();
        PIXIShortPropPlugin();
        new PIXIZeroAlphaNoneInteractionPlugins();
        new PIXIPixelPerfectInteractionPlugIn();
        PIXITextMetricsPlugIn();
        PIXIGraphicOverride();
    }

    getNewApp(canvas:HTMLCanvasElement):PIXI.Application {
        let app = new PIXI.Application({
            view: canvas,
            width: canvas.width,
            height: canvas.height,
            autoStart: false,
            // autoStart: true,
            antialias:true,
            transparent: true
        });
        (app.stage as any).canvas = canvas;
        return app;
    }
}

export let PIXIGlobal:_PIXIGlobal = new _PIXIGlobal();