/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    c.playgroundChangeViewMode = (function() {
        var commandType = "changeViewMode";
        return {
            type: commandType,
            do: function(newType, oldType) {
                oldType = oldType || 'code';
                var playground = Entry.playground;
                playground.changeViewMode(newType);
                if (newType === 'code')
                    playground.blockMenu.reDraw();
            },
            state: function(newType, oldType) {
                return [oldType, newType];
            },
            log: function(newType, oldType, domData) {
                return [
                    commandType,
                    ['oldType', oldType],
                    ['newType', newType]
                ];
            },
            undo: "playgroundChangeViewMode",
            dom: ['playground', '&0']
        };
    })();
})(Entry.Command);

