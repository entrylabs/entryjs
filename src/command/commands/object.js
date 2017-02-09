/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.selectObject] = {
        do: function(objectId) {
            return Entry.container.selectObject(objectId);
        },
        state: function(objectId) {
            var playground = Entry.playground;
            if (playground && playground.object)
                return [playground.object.id];
        },
        log: function(objectId) {
            return [objectId];
        },
        undo: "selectObject"
    };

    c[COMMAND_TYPES.objectEditButtonClick] = {
        do: function(objectId) {
            Entry.container.getObject(objectId).toggleEditObject();
        },
        state: function(objectId) {
                return [];
        },
        log: function(objectId) {
            return [
                ['objectId', objectId],
                ['objectIndex', Entry.container.getObjectIndex(objectId)],
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['container', 'objectIndex', '&1', 'editButton'],
        undo: "selectObject"
    };
})(Entry.Command);
