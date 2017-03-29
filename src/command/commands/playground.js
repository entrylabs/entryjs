/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.playgroundChangeViewMode] = {
        do: function(newType, oldType) {
            Entry.playground.changeViewMode(newType);
        },
        state: function(newType, oldType) {
            return [oldType, newType];
        },
        log: function(newType, oldType) {
            oldType = oldType || 'code';
            return [
                ['newType', newType],
                ['oldType', oldType],
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "playgroundChangeViewMode",
        dom: ['playground', 'tabViewElements', '&0']
    };

    c[COMMAND_TYPES.playgroundClickAddPicture] = {
        do: function() {
            Entry.dispatchEvent('openPictureManager');
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        validate: false,
        //skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "playgroundClickAddPictureCancel",
        dom: ['playground', 'pictureAddButton']
    };

    c[COMMAND_TYPES.playgroundClickAddPictureCancel] = {
        do: function() {
            Entry.dispatchEvent('dismissModal');
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        validate: false,
        //skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "",
        dom: ['playground', 'pictureAddButton']
    };

    c[COMMAND_TYPES.playgroundClickAddSound] = {
        do: function() {
            Entry.dispatchEvent('openSoundManager');
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "playgroundClickAddSoundCancel",
        dom: ['playground', 'soundAddButton']
    };

    c[COMMAND_TYPES.playgroundClickAddSoundCancel] = {
        do: function() {
            Entry.dispatchEvent('dismissModal');
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "",
        dom: ['playground', 'soundAddButton']
    };
})(Entry.Command);

