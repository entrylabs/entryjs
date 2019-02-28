/**
 * @fileoverview PropertyPanel shows project's property
 */
'use strict';

Entry.Intro = function() {
    this.modes = {};
    this.selected = null;
};

(function(p) {
    /**
     * Generate View
     */
    p.generateView = function(introView, option) {
        this.view_ = introView;
        this.view_.addClass('entryPlaygroundIntro');
    };

    p.setView = function(view) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.addClass('active');
        view.appendTo(this.view_);
    };

    p.removeView = function(mode) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.removeClass('active');
    };
})(Entry.Intro.prototype);
