/*
 *
 */
'use strict';

var UTIL = require('./command_util');

Entry.Commander = function(injectType) {
    if (injectType == 'workspace' || injectType == 'phone') {
        /**
         * Initialize stateManager for redo and undo.
         * @type {!Entry.StateManager}
         * @type {!object}
         */
        Entry.stateManager = new Entry.StateManager();
    }
    Entry.do = this.do.bind(this);

    Entry.undo = this.undo.bind(this);

    this.editor = {};

    this.reporters = [];

    Entry.Command.editor = this.editor;

    this.doEvent = new Entry.Event(this);
    this.logEvent = new Entry.Event(this);

    this.doCommandAll = Entry.doCommandAll;
};

(function(p) {
    p.do = function(commandType, ...args) {
        var {
            stateManager,
            Command: EntryCommand,
            STATIC: { COMMAND_TYPES, getCommandName },
        } = Entry;

        if (typeof commandType === 'string') {
            commandType = COMMAND_TYPES[commandType];
        }

        //intentionally delay reporting
        this.report(COMMAND_TYPES.do);
        this.report(commandType, args);

        var command = EntryCommand[commandType];

        console.log('commandType', commandType, getCommandName(commandType));

        var state;

        if (stateManager && !UTIL.checkIsSkip(commandType)) {
            state = stateManager.addCommand.apply(
                stateManager,
                [commandType, this, this.do, command.undo].concat(
                    command.state.apply(this, args)
                )
            );
        }
        var value = command.do.apply(this, args);
        this.doEvent.notify(commandType, args);
        var id = state ? state.id : null;

        return {
            value: value,
            isPass: function(isPass, skipCount) {
                this.isPassById(id, isPass, skipCount);
            }.bind(this),
        };
    };

    p.undo = function(commandType, ...args) {
        this.report(Entry.STATIC.COMMAND_TYPES.undo);

        var command = Entry.Command[commandType];

        var state;
        if (Entry.stateManager && command.skipUndoStack !== true) {
            state = Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.do, command.undo].concat(
                    command.state.apply(this, args)
                )
            );
        }
        return {
            value: command.do.apply(this, args),
            isPass: function(isPass) {
                this.isPassById(state.id, isPass);
            }.bind(this),
        };
    };

    p.redo = function(commandType, ...args) {
        this.report(Entry.STATIC.COMMAND_TYPES.redo);

        var command = Entry.Command[commandType];

        if (Entry.stateManager && command.skipUndoStack !== true) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.undo, commandType].concat(
                    command.state.apply(null, args)
                )
            );
        }
        command.undo.apply(this, args);
    };

    p.setCurrentEditor = function(key, object) {
        this.editor[key] = object;
    };

    p.isPass = function(isPass = true) {
        if (!Entry.stateManager) return;

        var lastCommand = Entry.stateManager.getLastCommand();
        if (lastCommand) lastCommand.isPass = isPass;
    };

    p.isPassById = function(id, isPass = true, skipCount = 0) {
        if (!id || !Entry.stateManager) return;

        var lastCommand = Entry.stateManager.getLastCommandById(id);
        if (lastCommand) {
            lastCommand.isPass = isPass;
            if (skipCount) lastCommand.skipCount = !!skipCount;
        }
    };

    p.addReporter = function(reporter) {
        reporter.logEventListener = this.logEvent.attach(
            reporter,
            reporter.add
        );
    };

    p.removeReporter = function(reporter) {
        if (reporter.logEventListener)
            this.logEvent.detatch(reporter.logEventListener);
        delete reporter.logEventListener;
    };

    p.report = function(commandType, argumentsArray) {
        var data;

        if (
            commandType &&
            Entry.Command[commandType] &&
            Entry.Command[commandType].log
        )
            data = Entry.Command[commandType].log.apply(this, argumentsArray);
        else data = argumentsArray;
        data.unshift(commandType);
        this.logEvent.notify(data);
    };

    p.applyOption = function() {
        this.doCommandAll = Entry.doCommandAll;
    };
})(Entry.Commander.prototype);
