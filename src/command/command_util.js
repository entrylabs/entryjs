'use strict';

var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

var obj = {
    createTooltip(title, content, target, callback, option = {}) {
        return new Entry.Tooltip(
            [
                {
                    title,
                    content,
                    target,
                },
            ],
            Object.assign(
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                },
                option
            )
        );
    },
    returnEmptyArr() {
        return [];
    },
    checkIsSkip(commandType) {
        var { skipUndoStack } = Entry.Command[commandType];
        return (
            skipUndoStack === true ||
            (!Entry.doCommandAll &&
                _.contains(Entry.STATIC.COMMAND_TYPES_NOT_ALWAYS, commandType))
        );
    },
};

Entry.Command[COMMAND_TYPES.dismissModal] = {
    do() {
        Entry.dispatchEvent('dismissModal');
    },
    state: obj.returnEmptyArr,
    log: obj.returnEmptyArr,
    undo: 'dismissModal',
    recordable: Entry.STATIC.RECORDABLE.SKIP,
    validate: false,
    dom: [],
};

module.exports = obj;
