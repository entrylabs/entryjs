'use strict';

goog.provide("Entry.Vim");

Entry.Vim = function(dom) {
    if (typeof dom === "string")
        dom = $('#' + dom);
    else
        dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    this.createDom(dom);

    Entry.Model(this, false);
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
            value: "this.move();\nthat.move();\nthis.move();\n",
            mode:  {name:"javascript", globalVars: true},
            theme: "default",
            indentUnit: 4,
            styleActiveLine: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            // gutters: ["CodeMirror-lint-markers"],
            lint: true
        });
    };

    p.hide = function() {this.view.addClass('entryRemove');};

    p.show = function() {this.view.removeClass('entryRemove');};
})(Entry.Vim.prototype);


