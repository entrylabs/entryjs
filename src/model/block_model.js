'use strict';

goog.provide('Entry.BlockModel');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.BlockModel = function() {
    Entry.Model(this);
};

Entry.BlockModel.prototype.schema = {
    id: 0,
    type: Entry.STATIC.BLOCK_MODEL,
    x: 0,
    y: 0,
    type: 0,
    params: {},
    statements: {},
    prev: null,
    next: null,
    render: null
};
