/**
 * @fileoverview Popup object for generate popup.
 */
'use strict';

/**
 * Constructor of popup
 * @constructor
 */
Entry.popupHelper = function() {
    Entry.assert(!window.popupHelper, 'Popup exist');

    this.pageIndex = 0;
    
    this.body_ = Entry.createElement('div');
    this.body_.addClass('entryPopup hiddenPopup');
    this.body_.bindOnClick(function(e) {
        if (e.target==this) {
            this.popup.hide();
        }
    });
    window.popupHelper = this;
    this.body_.popup = this;
    this.window_ = Entry.createElement('div');
    this.window_.addClass('entryPopupHelperWindow');
    this.body_.appendChild(this.window_);
    document.body.appendChild(this.body_);
};

Entry.popupHelper.prototype.setPopup = function(func, content) {
    func(this);
    // content;
};

/**
 * Remove this popup
 */
Entry.popupHelper.prototype.remove = function() {
    Entry.removeElement(this.body_);
    window.popupHelper = null;
};

/**
 * Resize this view size when window size modified
 * @param {event} e
 */
Entry.popupHelper.prototype.resize = function(e) {
    
};


Entry.popupHelper.prototype.show = function() {
    this.body_.removeClass('hiddenPopup');
};


Entry.popupHelper.prototype.hide = function() {
    this.body_.addClass('hiddenPopup');
};
