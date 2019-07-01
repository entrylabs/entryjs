'use strict';

Entry.Command = {};

(function(c) {
    c[Entry.STATIC.COMMAND_TYPES.do] = {
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        log(objectId) {
            return [];
        },
        skipUndoStack: true,
    };

    c[Entry.STATIC.COMMAND_TYPES.undo] = {
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        log(objectId) {
            return [];
        },
        skipUndoStack: true,
    };

    c[Entry.STATIC.COMMAND_TYPES.redo] = {
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        log(objectId) {
            return [];
        },
        skipUndoStack: true,
    };
})(Entry.Command);
