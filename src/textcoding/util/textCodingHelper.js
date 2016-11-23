/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingHelper");

goog.require("Entry.Dom")

Entry.TextCodingHelper = function() {
    if (!Entry.propertyPanel)
        return;
    this.createView();
    Entry.textCodingHelper = this;
    
};

(function (p) {
    p.createView = function() {
        this.parentView_ = Entry.propertyPanel.modes.helper.obj.blockHelperContent_;
        this.view = Entry.createElement('div', 'textCodingExampleView');

        this.codeMirror = CodeMirror(this.view, { 
            lineNumbers: true,
            lineWrapping: true, 
            value: "", 
            mode: {name: "python"},
            theme: "default",
            styleActiveLine: false
        });

        
        this.parentView_.appendChild(this.view);
        this._doc = this.codeMirror.getDoc();
        this._codeMirror = this.codeMirror; 

        var exampleText = "def when_start():"; 
        this._codeMirror.setValue(exampleText);
    };

    p.getView = function() { 
        return this.view;
    };

    p.removeView = function() {
        this.parentView_.removeChild(this.view);
    };

})(Entry.TextCodingHelper.prototype)
