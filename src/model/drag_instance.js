'use strict';

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
    absX: 0,
    absY: 0,
    prev: null,
    height: 0,
    mode: 0,
    isNew: false,
};
