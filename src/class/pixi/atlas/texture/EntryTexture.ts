import { ImageRect } from '../../../maxrect-packer/geom/ImageRect';
import { EntryBaseTexture } from './EntryBaseTexture';
import { EntryTextureBase } from './EntryTextureBase';

export class EntryTexture extends EntryTextureBase {
    constructor(baseTexture: EntryBaseTexture, imageRect: ImageRect) {
        super(baseTexture, imageRect);
    }

    getBaseTexture(): EntryBaseTexture {
        const result = this.baseTexture as EntryBaseTexture;
        result._frame = this._frame;
        return result;
    }
}
