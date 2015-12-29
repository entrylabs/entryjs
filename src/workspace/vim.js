'use strict';

goog.provide("Entry.Vim");

Entry.Vim = function(dom) {
    if (typeof dom === "string")
        dom = $('#' + dom);
    else
        dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");


    this._parser = new Entry.Parser("maze", "js", this.codeMirror);
    this._blockParser = new Entry.Parser("maze", "block");

    this.createDom(dom);

    Entry.Model(this, false);
    window.eventset = [];
};

(function(p) {
    p.createDom = function (dom) {
        var parent = dom;
        this.view = Entry.Dom('div', {
            parent:parent,
            class: 'entryVimBoard'
        });

        this.codeMirror = CodeMirror(this.view[0], {
            lineNumbers: true,
            value: "this.move();\nthis.move();\nthis.move();\n",
            mode:  {name:"javascript", globalVars: true},
            theme: "default",
            indentUnit: 4,
            styleActiveLine: true,
            extraKeys: {"Shift-Space": "autocomplete"},
            // gutters: ["CodeMirror-lint-markers"],
            lint: true,
            viewportMargin: 10
        });
        var cm = this.codeMirror;
        var parent = this;
        window.c = this.codeMirror;
        document.addEventListener('dragEnd', function (e) {
            // var textCode = parent.getCodeToText(e.block);
            parent.codeMirror.display.dragFunctions.leave(e);
            console.log(e);
            CodeMirror.signal(cm, 'mousedown', e);
            // parent.codeMirror.replaceSelection(textCode);
            console.log(parent.codeMirror.getCursor());
        });
        document.addEventListener('dragOver', function (e) {
            parent.codeMirror.display.dragFunctions.over(e);
        });
    };

    p.hide = function() {
        this.view.addClass('entryRemove');
    };

    p.show = function() {this.view.removeClass('entryRemove');};

    p.textToCode = function() {
        var textCode = this.codeMirror.getValue();
        return [this._parser.parse(textCode)];
    };

    p.codeToText = function(code) {
        var textCode = this._blockParser.parse(code);
        this.codeMirror.setValue(textCode);
    };

    p.getCodeToText = function(code) {
        var textCode = this._blockParser.parse(code);
        return textCode;
    }

})(Entry.Vim.prototype);
