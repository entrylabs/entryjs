/**
 * @fileoverview PropertyPanel shows project's property
 */
'use strict';

/**
 * doxdox 'src/class/hw.js' --layout markdown --output documentation/src/class/hw.md
 *
 * ```javascript
 * this = {
 *      modes
 *      selected
 *      view_
 * }
 * ```
 *
 * introClass
 */
Entry.Intro = function() {
    this.modes = {};
    this.selected = null;
};

(function(p) {
    /**
     * generateView, this.view_ == introView, append parameter view
     * @param {Entry.view} introView
     * @param @deprecated {Entry.view} option
     */
    p.generateView = function(introView, option) {
        this.view_ = introView;
        this.view_.addClass('entryPlaygroundIntro');
    };
    /**
     * setView, this.view_removeFirstChild, append parameter view
     * @param {Entry.view} view
     */
    p.setView = function(view) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.addClass('active');
        view.appendTo(this.view_);
    };
    /**
     * remove view, this.view_removeFirstChild
     * @param @deprecated mode
     */
    p.removeView = function(mode) {
        if (this.view_.firstChild) {
            this.view_.removeChild(this.view_.firstChild);
        }
        this.view_.removeClass('active');
    };
})(Entry.Intro.prototype);
