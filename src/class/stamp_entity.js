/**
 * @fileoverview stamp entity object is class for entry stamp entity canvas view.
 */

'use strict';

import { GEHelper } from '../graphicEngine/GEHelper';

/**
 * Construct stamp entity class
 * @param {!Entry.EntryObject} object
 * @param {!Entry.EntityObject} entity
 * @constructor
 */
Entry.StampEntity = class StampEntity {
    constructor(object, entity) {
        /** @type {!string} */
        this.parent = object;
        this.type = object.objectType;
        this.isClone = true;
        this.isStamp = true;
        this.width = entity.getWidth();
        this.height = entity.getHeight();
        if (this.type == 'sprite') {
            this.object = GEHelper.cloneStamp(entity);
            if (entity.effect) {
                this.effect = _.clone(entity.effect);
                this.applyFilter();
            }
        } else if (this.type == 'textBox') {
        }

        this.object.entity = entity;
    }
};

(function(p, origin) {
    ['applyFilter', 'getWidth', 'getHeight', 'getInitialEffectValue', 'destroy', 'cache'].forEach(
        (key) => {
            p[key] = origin[key];
        }
    );
})(Entry.StampEntity.prototype, Entry.EntityObject.prototype);
