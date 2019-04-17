/*
 *
 */
'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.editPicture] = {
        do() {
            if (Entry.playground.painter.entryPaint.canRedo()) {
                Entry.playground.painter.entryPaint.redo();
            }
        },
        state() {},
        log(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: 'uneditPicture',
    };

    c[COMMAND_TYPES.uneditPicture] = {
        type: Entry.STATIC.COMMAND_TYPES.uneditPicture,
        do() {
            Entry.playground.painter.entryPaint.undo();
        },
        state() {},
        log(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: 'editPicture',
    };

    c[COMMAND_TYPES.processPicture] = {
        do() {
            if (Entry.playground.painter.entryPaint.canRedo()) {
                Entry.playground.painter.entryPaint.redo();
            }
        },
        state() {},
        log(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: 'unprocessPicture',
        isPass: true,
    };

    c[COMMAND_TYPES.unprocessPicture] = {
        do() {
            Entry.playground.painter.entryPaint.undo();
        },
        state() {},
        log(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: 'processPicture',
        isPass: true,
    };
})(Entry.Command);
