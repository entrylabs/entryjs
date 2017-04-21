/**
 * @fileoverview Popup object for generate popup.
 */
'use strict';

/**
 * Constructor of popup
 * @constructor
 */
Entry.Popup = function(className) {
    Entry.assert(!window.popup, 'Popup exist');

    this.body_ = Entry.createElement('div');
    this.body_.addClass('entryPopup');
    if (className)
        this.body_.addClass(className);
    this.body_.bindOnClick(function(e) {
        if (e.target==this){
            this.popup.remove();
        }
    });
    this.body_.popup = this;
    document.body.appendChild(this.body_);
    this.window_ = Entry.createElement('div');
    this.window_.addClass('entryPopupWindow');
    if (Entry.device === 'tablet')
        this.window_.addClass('tablet');
    this.window_.bindOnClick(function() {
    });
    Entry.addEventListener('windowResized', this.resize);
    window.popup = this;
    this.resize();
    this.body_.appendChild(this.window_);
};

/**
 * Remove this popup
 */
Entry.Popup.prototype.remove = function() {
    while (this.window_.hasChildNodes()) {
        if (Entry.type == 'workspace')
            Entry.view_.insertBefore(this.window_.firstChild,
                                     Entry.container.view_);
        else{
            Entry.view_.insertBefore(this.window_.lastChild, Entry.view_.firstChild);
        }
    }
    $('body').css('overflow', 'auto');
    Entry.removeElement(this.body_);
    window.popup = null;
    Entry.removeEventListener('windowResized', this.resize);
    Entry.engine.popup = null;
    Entry.windowResized.notify();
    if (Entry.type === "workspace" && Entry.targetChecker)
        Entry.targetChecker.getStatusView().remove();
};

/**
 * Resize this view size when window size modified
 * @param {event} e
 */
Entry.Popup.prototype.resize = function(e) {
    var popup = window.popup;
    var popupWindow = popup.window_;
    var bottomOffset = Entry.targetChecker ? 91 + 35 : 35;
    var maxWidth = window.innerWidth * 0.9;
    var maxHeight = window.innerHeight * 0.9 - bottomOffset;
    if (maxWidth * 9 <= maxHeight * 16) {
        maxHeight = maxWidth / 16 * 9;
        maxHeight += bottomOffset;
        popupWindow.style.width = String(maxWidth) + 'px';
        popupWindow.style.height = String(maxHeight) + 'px';
    } else {
        maxWidth = maxHeight * 16 / 9;
        maxHeight += bottomOffset;
        popupWindow.style.width = String(maxWidth) + 'px';
        popupWindow.style.height = String(maxHeight) + 'px';
    }

    Entry.stage && Entry.stage.updateBoundRect();
};

Entry.Popup.prototype.removeMouseDispose = function(e) {
    this.body_.unBindOnClick();
};
