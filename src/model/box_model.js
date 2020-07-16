'use strict';

Entry.BoxModel = class BoxModel {
    constructor() {
        this.schema = {
            id: 0,
            type: Entry.STATIC.BOX_MODEL,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        Entry.Model(this);
    }
};
