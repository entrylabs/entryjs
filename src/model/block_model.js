'use strict';

Entry.BlockModel = function() {
    Entry.Model(this);
};

Entry.BlockModel.prototype.schema = {
    id: null,
    x: 0,
    y: 0,
    type: null,
    params: {},
    statements: {},
    prev: null,
    next: null,
    view: null,
};
