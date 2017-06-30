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
        this.object = entity.object.clone(true);
        this.object.filters = null;
        if (entity.effect) {
            this.effect = Entry.cloneSimpleObject(entity.effect);
            this.applyFilter();
        }
    } else if (this.type == 'textBox') {}

    this.object.entity = this;
};


(function(p, origin) {
    p.applyFilter = origin.applyFilter;

    p.removeClone = origin.removeClone;

    p.getWidth = origin.getWidth;

    p.getHeight = origin.getHeight;

    p.getInitialEffectValue = origin.getInitialEffectValue;

})(Entry.StampEntity.prototype, Entry.EntityObject.prototype);

