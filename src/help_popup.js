/**
 * @fileoverview Popup object for generate popup.
 */
'use strict';

/**
 * Constructor of popup
 * @constructor
 */
Entry.HelpPopup = function() {
    Entry.assert(!window.HelpPopup, 'Popup exist');

    this.HelpBody_ = Entry.createElement('div');
    this.HelpBody_.addClass('entryPopup');
    this.HelpBody_.bindOnClick(function(e) {
        if (e.target==this){
            this.popup.remove();
        }
    });
    this.HelpBody_.popup = this;
    this.HelpWindow_ = Entry.createElement('div');
    this.HelpWindow_.addClass('entryHelpPopupWindow');
    this.HelpWindow_.bindOnClick(function() {
    });
    window.HelpPopup = this;
    this.HelpBody_.appendChild(this.HelpWindow_);
    document.body.appendChild(this.HelpBody_);
};

/**
 * Remove this popup
 */
Entry.HelpPopup.prototype.remove = function() {
    $('body').css('overflow', 'auto');
    Entry.removeElement(this.HelpBody_);
    window.HelpPopup = null;
    Entry.removeEventListener('windowResized', this.resize);
};

/**
 * Resize this view size when window size modified
 * @param {event} e
 */
Entry.HelpPopup.prototype.resize = function(e) {
    
};
