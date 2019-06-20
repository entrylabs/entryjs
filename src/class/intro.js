/**
 * @fileoverview PropertyPanel shows project's property
 */
'use strict';

Entry.Intro = class Intro {
    constructor() {
        this.modes = {};
        this.selected = null;
    }

    /**
     * Generate View
     */
    generateView = function(introView, option) {
        this.view_ = introView;
        this.view_.addClass('entryPlaygroundIntro');
    };

    setView = function(view) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.addClass('active');
        view.appendTo(this.view_);
    };

    removeView = function(mode) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.removeClass('active');
    };
};
