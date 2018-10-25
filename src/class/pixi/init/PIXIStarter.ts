import { PIXIAtlasManager } from '../atlas/PIXIAtlasManager';

export class PIXIStarter {

    private static _init:boolean;

    static initOnce() {
        if(this._init) return;
        this._init = true;

        PIXIAtlasManager.INIT();
    }
}