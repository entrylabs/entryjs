/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingExampleHelper");

goog.require("Entry.Dom")

Entry.TextCodingHelper = function() {
    if (!Entry.propertyPanel)
        return;
    this.createView();
    
};

(function (p) {
    p.createView = function() {
        this.parentView_ = Entry.propertyPanel.modes.helper.obj.blockHelperContent_;

        this.view = Entry.createElement('div', 'textCodingExampleView');

        this.codeMirror = CodeMirror(this.view, {
            lineNumbers: false,
            lineWrapping: true,
            value: "",
            mode: {name: "python"},
            theme: "default",
            styleActiveLine: false,
            lint: false
        });

        this.codeMirror.on("cursorActivity", function(cm, event) {
            cm.execCommand("goDocEnd");                                     
        });

        this.parentView_.appendChild(this.view);

        this._ExamplePanel = this.codeMirror;

        console.log("added text Helper");
    };

    p.getView = function() { 
        return this.view;
    };

})(Entry.TextCodingHelper.prototype)
