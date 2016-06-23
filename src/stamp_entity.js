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
    } else if (this.type == 'textBox') {
    }

    this.object.entity = this;
    if (entity.dialog) {
        var dialog = entity.dialog;
        new Entry.Dialog(this, dialog.message_, dialog.mode_, true);
        this.dialog.object = entity.dialog.object.clone(true);
        Entry.stage.loadDialog(this.dialog);
    }
};

var EntityPrototype = Entry.EntityObject.prototype;

Entry.StampEntity.prototype.applyFilter = EntityPrototype.applyFilter;

Entry.StampEntity.prototype.removeClone = EntityPrototype.removeClone;

Entry.StampEntity.prototype.getWidth = EntityPrototype.getWidth;

Entry.StampEntity.prototype.getHeight = EntityPrototype.getHeight;

Entry.StampEntity.prototype.getInitialEffectValue = EntityPrototype.getInitialEffectValue;
