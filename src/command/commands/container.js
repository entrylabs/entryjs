/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.containerSelectObject] = {
        do: function(objectId) {
            Entry.container.selectObject(objectId);
        },
        state: function(objectId) {
            return [
                Entry.playground.object.id,
                objectId
            ];
        },
        log: function(objectId) {
            return [
                ['objectId', objectId],
                ['objectIndex', Entry.container.getObjectIndex(objectId)],
            ];
        },
        restrict: function(data, domQuery, callback, restrictor) {
            Entry.container.scrollToObject(data.content[1][1]);
            
            return new Entry.Tooltip([{
                title: data.tooltip.title,
                content: data.tooltip.content,
                target: domQuery
            }], {
                dimmed: true,
                restrict: true,
                callBack: function(isFromInit) {
                }
            });
        },
        undo: "containerSelectObject",
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['container', 'objectIndex', '&1']
    };
})(Entry.Command);

