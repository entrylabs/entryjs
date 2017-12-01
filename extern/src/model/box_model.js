'use strict';

goog.provide('Entry.BoxModel');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.BoxModel = function() {
    Entry.Model(this);
};

Entry.BoxModel.prototype.schema = {
    id: 0,
    type: Entry.STATIC.BOX_MODEL,
    x: 0,
    y: 0,
    width: 0,
    height: 0
};
