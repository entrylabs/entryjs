/*
 *
 */
'use strict';

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.playgroundChangeViewMode] = {
        do: function(newType, oldType) {
            Entry.playground.changeViewMode(newType);
            if (Entry.disposeEvent) {
                Entry.disposeEvent.notify();
            }
        },
        state: function(newType, oldType) {
            return [oldType, newType];
        },
        log: function(newType, oldType) {
            oldType = oldType || 'code';
            return [['newType', newType], ['oldType', oldType]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'playgroundChangeViewMode',
        dom: ['playground', 'tabViewElements', '&0'],
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
        restrict: function(data, domQuery, callback, restrictor) {
            Entry.dispatchEvent('dismissModal');
            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                }
            );
            return tooltip;
        },
        undo: 'playgroundClickAddPictureCancel',
        dom: ['playground', 'pictureAddButton'],
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
        undo: '',
        dom: ['playground', 'pictureAddButton'],
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
        restrict: function(data, domQuery, callback, restrictor) {
            Entry.dispatchEvent('dismissModal');
            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                }
            );
            return tooltip;
        },
        undo: 'playgroundClickAddSoundCancel',
        dom: ['playground', 'soundAddButton'],
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
        undo: '',
        dom: ['playground', 'soundAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddExpansionBlock] = {
        do: function() {
            Entry.dispatchEvent('openExpansionBlockManager');
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict: function(data, domQuery, callback, restrictor) {
            Entry.dispatchEvent('dismissModal');
            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                }
            );
            return tooltip;
        },
        undo: 'playgroundClickAddExpansionBlockCancel',
        dom: ['playground', 'soundAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddExpansionBlockCancel] = {
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
        undo: '',
        dom: ['playground', 'soundAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddAIUtilizeBlock] = {
        do: function() {
            Entry.dispatchEvent('openAIUtilizeBlockManager');
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict: function(data, domQuery, callback, restrictor) {
            Entry.dispatchEvent('dismissModal');
            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                }
            );
            return tooltip;
        },
        undo: 'playgroundClickAddAIUtilizeBlockCancel',
        dom: ['playground', 'soundAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddAIUtilizeBlockCancel] = {
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
        undo: '',
        dom: ['playground', 'soundAddButton'],
    };
})(Entry.Command);
