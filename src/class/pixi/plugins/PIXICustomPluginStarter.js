
import { PIXIPixelPerfectInteractionPlugIn } from './PIXIPixelPerfectInteractionPlugIn';
import { PIXIZeroAlphaNoneInteractionPlugins } from './PIXIZeroAlphaNoneInteractionPlugins';

export class PIXICustomPluginStarter {
    constructor() {
        new PIXIZeroAlphaNoneInteractionPlugins();
        new PIXIPixelPerfectInteractionPlugIn();
    }
}