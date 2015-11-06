'use strict';

goog.provide('Entry.DragInstance');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.DragInstance = function(model) {
    Entry.Model(this);

    this.set(model);
};

Entry.DragInstance.prototype.schema = {
    type: Entry.STATIC.DRAG_INSTANCE,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    prev: null,
    height: 0,
    mode: 0
};
