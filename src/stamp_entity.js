/**
 * @fileoverview stamp entity object is class for entry stamp entity canvas view.
 */
'use strict';

/**
 * Construct stamp entity class
 * @param {!Entry.EntryObject} object
 * @param {!Entry.EntityObject} entity
 * @constructor
 */
Entry.StampEntity = function(object, entity) {
    /** @type {!string} */
    this.parent = object;
    this.type = object.objectType;
    this.isClone = true;
    this.isStamp = true;
    this.width = entity.getWidth();
    this.height = entity.getHeight();
    if (this.type == 'sprite') {
        this.object = entity.object.clone();
        this.object.mouseEnabled = false;
        this.object.tickEnabled = false;
        this.object.filters = null;
        if (entity.effect) {
            this.effect = Entry.cloneSimpleObject(entity.effect);
            this.applyFilter();
        }
    } else if (this.type == 'textBox') {}

    this.object.entity = entity;
};


(function(p, origin) {
    [
        'applyFilter',
        'getWidth',
        'getHeight',
        'getInitialEffectValue',
        'destroy',
        'cache'
    ].forEach(function(key) { p[key] = origin[key]; });
})(Entry.StampEntity.prototype, Entry.EntityObject.prototype);

