"use strict";

goog.provide("Entry.EntryObject");

goog.require("Entry.LoopModel");

Entry.EntryObject = function() {
    Entry.LoopModel.call(this);

};

Entry.EntryObject.prototype = new Entry.LoopModel;

(function (p) {

    p.base = Entry.LoopModel;

    p.schema = {
        id: null,
        name: null,
        order: null,
        objectType: null,
        scene: null,
        lock: null,
        rotateMethod: null,
        entity: null,
        script: null,
        sprite: null
    };

})(Entry.EntryObject.prototype);
