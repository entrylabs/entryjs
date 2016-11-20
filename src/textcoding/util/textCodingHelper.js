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
            mode: {},
            theme: "default",
            styleActiveLine: false,
            //gutters: ["CodeMirror-lint-markers"],
            lint: false
        });
        this._doc = this.codeMirror.getDoc(); 
        this.codeMirror.setValue("Hi! TextCoding...");

        /*this.codeMirror.on('beforeChange', function(cm, change) {
            if (!this._isEditing)
                change.cancel();
            else if (change.origin === "+delete" && change.to.ch === 0) {
                change.cancel();
            }
        }.bind(this));*/

        this.codeMirror.on("keyup", function (cm, event) {
            if (this._isEditing && event.keyCode === 13) {
                this.endInput();
            }
        }.bind(this));

        this.codeMirror.on("cursorActivity", function(cm, event) {
            cm.execCommand("goDocEnd");                                     
        });

        this.parentView_.appendChild(this.view);

        console.log("added text Helper");
    };

    p.getView = function() { 
        return this.view;
    };

})(Entry.TextCodingHelper.prototype)
