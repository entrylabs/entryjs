'use strict';

Entry.BlockRenderModel = class BlockRenderModel {
    constructor() {
        this.schema = {
            id: 0,
            type: Entry.STATIC.BLOCK_RENDER_MODEL,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            magneting: false,
        };
        Entry.Model(this);
    }
};
