import { PIXIBaseAsset } from './PIXIBaseAsset';
require("./../etc/PIXI-ndgmr.Collision");
require("./../etc/PIXICanvasInput");
import { PIXIAtlasManager } from '../atlas/PIXIAtlasManager';
import { PIXIZeroAlphaNoneInteractionPlugins } from '../plugins/PIXIZeroAlphaNoneInteractionPlugins';
import { PIXIPixelPerfectInteractionPlugIn } from '../plugins/PIXIPixelPerfectInteractionPlugIn';
import { PIXITempStore } from '../etc/PIXITempStore';


declare let ndgmr:any;

class _PIXIGlobal {

    private _init:boolean;
    readonly baseAsset:PIXIBaseAsset = new PIXIBaseAsset();
    private _app:PIXI.Application;

    initOnce() {
        if(this._init) return;
        this._init = true;
        console.log("[PIXIStarter.init()");

        ndgmr.initTempObject();
        PIXITempStore.init();
        PIXIAtlasManager.INIT();
        new PIXIZeroAlphaNoneInteractionPlugins();
        new PIXIPixelPerfectInteractionPlugIn();
    }

    getNewApp(canvas:HTMLCanvasElement):PIXI.Application {
        this._disposeApp();
        this._app = new PIXI.Application({
            view: canvas,
            width: canvas.width,
            height: canvas.height,
            autoStart: false,
            // autoStart: true,
            antialias:true,
            transparent: true
        });
        return this._app;
    }

    private _disposeApp() {
        if(!this._app) return;
        this._app.destroy(false, {children: true, texture: false, baseTexture: false});
        this._app = null;
    }


}

export let PIXIGlobal:_PIXIGlobal = new _PIXIGlobal();