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
        var parent, _self, target;
        parent = dom;
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

        _self = this;
        target = this.view[0];
        function eventDragEnd(e) {
            var textCode = _self.getCodeToText(e.block);
            _self.codeMirror.display.dragFunctions.leave(e);
            var mousedown = new MouseEvent('mousedown', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'clientX' : e.clientX,
                'clientY' : e.clientY
            });

            _self.codeMirror.display.scroller.dispatchEvent(mousedown);
            _self.codeMirror.replaceSelection(textCode);
        }

        function eventDragOver(e) {
            _self.codeMirror.display.dragFunctions.over(e);
        }

        target.removeEventListener("dragEnd", eventDragEnd);
        target.removeEventListener("dragOver", eventDragOver);
        target.addEventListener('dragEnd', eventDragEnd);
        target.addEventListener('dragOver', eventDragOver);
    };

    p.hide = function() {
        this.view.addClass('entryRemove');
    };

    p.show = function() {
        this.view.removeClass('entryRemove');
    };

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
