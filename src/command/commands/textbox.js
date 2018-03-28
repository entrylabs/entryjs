/*
 *
 */
'use strict';

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.editText] = {
        do: function(text, prevText) {
            Entry.playground.object.setText(text);
            Entry.playground.object.entity.setText(text);
            Entry.dispatchEvent('textEdited');
        },
        state: function(text, prevText) {
            return [prevText, text];
        },
        log: function() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'editText',
    };
})(Entry.Command);
