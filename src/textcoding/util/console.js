/*
 *
 */
'use strict';

Entry.Console = function() {
    if (!Entry.propertyPanel) return;
    this.createView();
    Entry.propertyPanel.addMode('console', this);
    Entry.console = this;

    this._isEditing = false;
    this._inputData = null;
};

(function(p) {
    p.createView = function() {
        this.view = Entry.Dom('div', {
            id: 'entryConsole',
        });

        this.codeMirror = CodeMirror(this.view[0], {
            readOnly: 'nocursor',
            lineNumbers: false,
            lineWrapping: true,
            value: '',
            mode: {},
            theme: 'default',
            styleActiveLine: false,
            //gutters: ["CodeMirror-lint-markers"],
            lint: false,
        });
        this._doc = this.codeMirror.getDoc();

        this.codeMirror.on(
            'beforeChange',
            function(cm, change) {
                if (!this._isEditing) change.cancel();
                else if (change.origin === '+delete' && change.to.ch === 0) {
                    change.cancel();
                }
            }.bind(this)
        );

        this.codeMirror.on(
            'keyup',
            function(cm, event) {
                if (this._isEditing && event.keyCode === 13) {
                    this.endInput();
                }
            }.bind(this)
        );

        this.codeMirror.on('cursorActivity', function(cm, event) {
            cm.execCommand('goDocEnd');
        });

        Entry.addEventListener('stop', this.clear.bind(this));

        this.clear();
    };

    p.getView = function() {
        return this.view;
    };

    p.clear = function() {
        this.setEditing(true);
        this.codeMirror.setValue('Entry Console \n');
        this.codeMirror.execCommand('goDocEnd');
        this.setEditing(false);
    };

    p.print = function(message, mode) {
        if (!this.visible) return;

        if (mode !== 'ask') {
            this._doc.cm.options.readOnly = 'nocursor';
        }
        this.setEditing(true);
        this.codeMirror.execCommand('goDocEnd');
        var cursor = this._doc.getCursor();
        var pos = {
            line: cursor.line,
            ch: 0,
        };
        this._doc.replaceRange(message + '\n', pos);
        this._doc.addLineClass(cursor.line, 'text', mode);
        if (mode === 'speak') this.setEditing(false);
        this.codeMirror.execCommand('goDocEnd');
        if (mode === 'ask') {
            this._doc.cm.options.readOnly = false;
            this._doc.addLineClass(cursor.line + 1, 'text', 'answer');
            this.codeMirror.focus();
        }
    };

    p.endInput = function() {
        var cursor = this._doc.getCursor();
        var lineInfo = this.codeMirror.lineInfo(cursor.line);
        if (lineInfo.textClass === 'answer') {
            this._inputData = lineInfo.text;
            var pos = {
                line: cursor.line,
                ch: lineInfo.text.length,
            };
            this._doc.replaceRange('\n', pos);
        } else this._inputData = this._doc.getLine(cursor.line - 1);
        Entry.container.setInputValue(this._inputData);
        this.setEditing(false);
    };

    p.stopInput = function(inputValue) {
        this.setEditing(false);
    };

    p.setEditing = function(set) {
        if (this._isEditing === set) return;
        this._isEditing = set;
    };
})(Entry.Console.prototype);
