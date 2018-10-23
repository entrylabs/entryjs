
import { PIXIPixelPerfectInteractionPlugIn } from './PIXIPixelPerfectInteractionPlugIn';
import { PIXIZeroAlphaNoneInteractionPlugins } from './PIXIZeroAlphaNoneInteractionPlugins';

export class PIXICustomPluginStarter {

    private static _initialized:boolean;


    static INIT() {
        if(this._initialized) return;
        this._initialized = true;
        new PIXIZeroAlphaNoneInteractionPlugins();
        new PIXIPixelPerfectInteractionPlugIn();
    }


}