/*
 *
 */
'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.toggleRun] = {
        do() {
            Entry.engine.toggleRun();
        },
        state() {
            return [];
        },
        log(callerName) {
            return [['callerName', callerName]];
        },
        restrict(data, domQuery) {
            const engine = Entry.engine;
            if (!engine.isState('stop')) {
                engine.toggleStop();
            }

            return new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    dimmed: true,
                    restrict: true,
                    callBack() {},
                }
            );
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'toggleStop',
        dom: ['engine', '&0'],
    };

    c[COMMAND_TYPES.toggleStop] = {
        do() {
            Entry.engine.toggleStop();
        },
        state() {
            return [];
        },
        log(callerName) {
            return [['callerName', callerName]];
        },
        restrict(data, domQuery, callback) {
            const engine = Entry.engine;
            if (Entry.engine.popup) {
                Entry.engine.closeFullScreen();
            }
            if (!engine.isState('run')) {
                engine.toggleRun(false);
            }

            return new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    dimmed: true,
                    restrict: true,
                    callBack() {
                        callback();
                    },
                }
            );
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'toggleRun',
        dom: ['engine', '&0'],
    };
})(Entry.Command);
