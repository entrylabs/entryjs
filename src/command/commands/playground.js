/*
 *
 */
'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.playgroundChangeViewMode] = {
        do(newType, oldType) {
            Entry.variableContainer.selected = null;
            Entry.variableContainer.updateList();
            Entry.playground.changeViewMode(newType);
            if (Entry.disposeEvent) {
                Entry.disposeEvent.notify();
            }
        },
        state(newType, oldType) {
            return [oldType, newType];
        },
        log(newType, oldType) {
            oldType = oldType || 'code';
            return [['newType', newType], ['oldType', oldType]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'playgroundChangeViewMode',
        dom: ['playground', 'tabViewElements', '&0'],
    };

    c[COMMAND_TYPES.playgroundClickAddPicture] = {
        do() {
            Entry.dispatchEvent('openPictureManager');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        //skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict(data, domQuery, callback, restrictor) {
            Entry.dispatchEvent('dismissModal');
            const tooltip = new Entry.Tooltip(
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
        do() {
            Entry.dispatchEvent('dismissModal');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        //skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: '',
        dom: ['playground', 'pictureAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddSound] = {
        do() {
            Entry.dispatchEvent('openSoundManager');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict(data, domQuery, callback, restrictor) {
            Entry.dispatchEvent('dismissModal');
            const tooltip = new Entry.Tooltip(
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
        do() {
            Entry.dispatchEvent('dismissModal');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: '',
        dom: ['playground', 'soundAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddTable] = {
        do() {
            Entry.dispatchEvent('openTableManager');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        undo: 'playgroundClickAddTableCancel',
        dom: ['playground', 'tableAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddTableCancel] = {
        do() {
            Entry.dispatchEvent('dismissModal');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: '',
        dom: ['playground', 'tableAddButton'],
    };

    c[COMMAND_TYPES.playgroundClickAddExpansionBlock] = {
        do() {
            Entry.dispatchEvent('openExpansionBlockManager');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict(data, domQuery, callback, restrictor) {
            Entry.dispatchEvent('dismissModal');
            const tooltip = new Entry.Tooltip(
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
        do() {
            Entry.dispatchEvent('dismissModal');
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: '',
        dom: ['playground', 'soundAddButton'],
    };
})(Entry.Command);
