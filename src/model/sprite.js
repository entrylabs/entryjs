'use strict';

goog.provide('Entry.Sprite');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.Sprite = function() {
    var schema = {
        id: 0,
        type: Entry.STATIC.SPRITE,
        name: 0,
        pictures: 0,
        sounds: 0
    };

    Entry.Model(this, schema);
};
