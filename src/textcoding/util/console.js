/*
 *
 */
"use strict";

goog.provide("Entry.Console");

goog.require("Entry.Dom")

Entry.Console = function() {
    if (!Entry.propertyPanel)
        return;
    this.createView();
    Entry.propertyPanel.addMode("console", this);
    Entry.console = this;

    this._isEditing = false;
    this._inputData = null;
};

(function (p) {
    p.createView = function() {
        this.view = new Entry.Dom('div', {
            id: 'entryConsole'
        });

        this.codeMirror = CodeMirror(this.view[0], {
            lineNumbers: false,
            lineWrapping: true,
            value: "",
            mode:  {},
            theme: "default",
            styleActiveLine: false,
            //gutters: ["CodeMirror-lint-markers"],
            lint: false,
            viewportMargin: 10
        });
        this._doc = this.codeMirror.getDoc();

        this.codeMirror.on('beforeChange', function(cm, change) {
            if (!this._isEditing)
                change.cancel();
        }.bind(this));

        this.codeMirror.on("keyup", function (cm, event) {
            if (this._isEditing && event.keyCode == 13) {
                this.endInput();
            }
        }.bind(this));

        Entry.addEventListener("stop", this.clear.bind(this))

        this.clear();
    };

    p.getView = function() {
        return this.view;
    };

    p.clear = function() {
        this.setEditing(true);
        this.codeMirror.setValue("Entry Console\n")
        this.setEditing(false);
    };

    p.print = function(message, mode) {
        this.setEditing(true);
        var cursor = this._doc.getCursor();
        var line = this._doc.getLine(cursor.line);
        var pos = {
            line: cursor.line,
            ch: line.length - 1
        }
        this._doc.replaceRange(message + '\n', pos);
        this._doc.addLineClass(cursor.line, "text", mode);
        if (mode === 'speak')
            this.setEditing(false);
        this.codeMirror.execCommand("goLineEnd");
        if (mode === 'ask')
            this.codeMirror.focus();
    };

    p.endInput = function() {
        this._inputData = this._doc.getLine(this._doc.getCursor().line);
        Entry.container.setInputValue(this._inputData);
        this.codeMirror.execCommand("newlineAndIndent")
        this.setEditing(false);
    };

    p.stopInput = function(inputValue) {
        this.codeMirror.execCommand("newlineAndIndent")
        this.setEditing(false);
    };

    p.setEditing = function(set) {
        if (this._isEditing === set)
            return;
        this._isEditing = set;
    };

})(Entry.Console.prototype)
