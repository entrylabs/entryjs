/*
 *
 */
'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.editText] = {
        do(text) {
            Entry.playground.object.setText(text);
            Entry.playground.object.entity.setText(text);
            Entry.dispatchEvent('textEdited');
        },
        state(text, prevText) {
            return [prevText, text];
        },
        log() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'editText',
    };
})(Entry.Command);
