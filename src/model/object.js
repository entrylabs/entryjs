'use strict';

goog.provide('Entry.Object');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.Object = function() {
    var schema = {
        id: 0,
        type: Entry.STATIC.OBJECT,
        objectType: 0,
        name: 0,
        order: 0,
        scene: 0,
        active: true,
        lock: false,
        rotateMethod: 0,
        entity: 0,
        script: 0,
        sprite: 0,
        selectedPicture: 0
    };

    Entry.Model(this, schema);
};
