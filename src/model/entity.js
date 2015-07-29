'use strict';

goog.provide('Entry.Entity');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.Entity = function() {
    var schema = {
        id: 0,
        type: Entry.STATIC.ENTITY,
        rotation: 0,
        direction: 0,
        x: 0,
        y: 0,
        regX: 0,
        regY: 0,
        scaleX: 0,
        scaleY: 0,
        width: 0,
        height: 0,
        imageIndex: 0,
        visible: 0,
        colour: 0,
        font: 0,
        bgColor: 0,
        textAlign: 0,
        lineBreak: false,
        underLine: false,
        strike: false
    };

    Entry.Model(this, schema);
};
