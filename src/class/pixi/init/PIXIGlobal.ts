import { PIXIBaseAsset } from './PIXIBaseAsset';

require("./../etc/PIXI-ndgmr.Collision");
import { PIXIAtlasManager } from '../atlas/PIXIAtlasManager';
import { PIXIZeroAlphaNoneInteractionPlugins } from '../plugins/PIXIZeroAlphaNoneInteractionPlugins';
import { PIXIPixelPerfectInteractionPlugIn } from '../plugins/PIXIPixelPerfectInteractionPlugIn';
import { PIXITempStore } from '../etc/PIXITempStore';
require("./../etc/PIXICanvasInput");

declare let ndgmr:any;

class _PIXIGlobal {

    private _init:boolean;

    readonly baseAsset:PIXIBaseAsset = new PIXIBaseAsset();

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


}

export let PIXIGlobal:_PIXIGlobal = new _PIXIGlobal();