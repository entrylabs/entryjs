/*
 *
 */
"use strict";

goog.provide("Entry.Commander");

goog.require("Entry.Command");

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

    this._tempStorage = null;

    Entry.Command.editor = this.editor;
};


(function(p) {
    p.do = function(commandType) {
        var that = this;
        var argumentArray = Array.prototype.slice.call(arguments);
        argumentArray.shift();
        var command = Entry.Command[commandType];
        if (Entry.stateManager) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.do, command.undo]
                    .concat(command.state.apply(this, argumentArray))
            );
        }
        var value = Entry.Command[commandType].do.apply(this, argumentArray);

        //intentionally delay reporting
        setTimeout(function() {
            that.report('do');
            that.report(commandType, argumentArray);
        }, 0);

        return {
            value: value,
            isPass: this.isPass.bind(this)
        }
    };

    p.undo = function() {
        var argumentArray = Array.prototype.slice.call(arguments);
        var commandType = argumentArray.shift();
        var commandFunc = Entry.Command[commandType];

        this.report('undo');

        if (Entry.stateManager) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.do, commandFunc.undo]
                    .concat(commandFunc.state.apply(this, argumentArray))
            );
        }
        return {
            value: Entry.Command[commandType].do.apply(this, argumentArray),
            isPass: this.isPass.bind(this)
        }
    };

    p.redo = function() {
        var argumentArray = Array.prototype.slice.call(arguments);
        var commandType = argumentArray.shift();
        var commandFunc = Entry.Command[commandType];

        that.report('redo');

        if (Entry.stateManager) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.undo, commandType]
                    .concat(commandFunc.state.apply(null, argumentArray))
            );
        }
        commandFunc.undo.apply(this, argumentArray);
    };

    p.setCurrentEditor = function(key, object) {
        this.editor[key] = object;
    };

    p.isPass = function(isPass) {
        isPass = isPass === undefined ? true : isPass;
        if (Entry.stateManager) {
            var lastCommand = Entry.stateManager.getLastCommand();
            if (lastCommand) lastCommand.isPass = isPass;
        }
    };

    p.addReporter = function(reporter) {
        this.reporters.push(reporter);
    };

    p.removeReporter = function(reporter) {
        var index = this.reporters.indexOf(reporter);
        if (index > -1) this.reporters.splice(index, 1);
    };

    p.report = function(commandType, argumentsArray) {
        //var reporters = this.reporters;
        //if (reporters.length === 0) return;

        var data;

        //if (commandType && Entry.Command[commandType] && Entry.Command[commandType].log)
            data = Entry.Command[commandType].log.apply(this, argumentsArray)
        //else data = argumentsArray;
        //reporters.forEach(function(reporter) {
            //reporter.add(data);
        //});
    };

})(Entry.Commander.prototype)

