/**
 * @fileoverview stamp entity object is class for entry stamp entity canvas view.
 */

'use strict';



import PIXIHelper from './pixi/helper/PIXIHelper';

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

        var orgObj = entity.object;
        // this.object = new PIXI.Sprite(orgObj.texture);
        this.object = PIXIHelper.sprite("StampEntity", orgObj.texture);
        this.object.visible = orgObj.visible;
        this.object.interactive = false;
        this.object.interactiveChildren = false;
        this.object.setTransform(
            orgObj.x,
            orgObj.y,
            orgObj.scale.x,
            orgObj.scale.y,
            orgObj.rotation,
            orgObj.skew.x,
            orgObj.skew.y,
            orgObj.pivot.x,
            orgObj.pivot.y
        );

        if (entity.effect) {
            this.effect = _.clone(entity.effect);
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
        'cache',
        'uncache'
    ].forEach(function(key) { p[key] = origin[key]; });
})(Entry.StampEntity.prototype, Entry.EntityObject.prototype);

