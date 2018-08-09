/*
 *
 */
'use strict';

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.toggleRun] = {
        do: function(callerName) {
            Entry.engine.toggleRun();
        },
        state: function() {
            return [];
        },
        log: function(callerName) {
            return [['callerName', callerName]];
        },
        restrict: function(data, domQuery, callback, restrictor) {
            var engine = Entry.engine;
            if (!engine.isState('stop')) engine.toggleStop();

            var isDone = false;
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
                    callBack: function(isFromInit) {},
                }
            );
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'toggleStop',
        dom: ['engine', '&0'],
    };

    c[COMMAND_TYPES.toggleStop] = {
        do: function(callerName) {
            Entry.engine.toggleStop();
        },
        state: function() {
            return [];
        },
        log: function(callerName) {
            return [['callerName', callerName]];
        },
        restrict: function(data, domQuery, callback, restrictor) {
            var engine = Entry.engine;
            if (Entry.engine.popup) Entry.engine.closeFullScreen();
            if (!engine.isState('run')) engine.toggleRun(false);

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
                    callBack: function(isFromInit) {
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
