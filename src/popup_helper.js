/**
 * @fileoverview Popup object for generate popup.
 */
'use strict';

/**
 * Constructor of popup
 * @constructor
 */
Entry.popupHelper = function(reset) {
    this.popupList = {};
    if(reset) {
        window.popupHelper = null;
    }
    Entry.assert(!window.popupHelper, 'Popup exist');    
    this.body_ = Entry.createElement('div');
    this.body_.addClass('entryPopup hiddenPopup popupHelper');
    var spanArea = ['entryPopupHelperTopSpan', 'entryPopupHelperBottomSpan', 'entryPopupHelperLeftSpan', 'entryPopupHelperRightSpan'];
    this.body_.bindOnClick(function(e) {
        var $target = $(e.target);
        spanArea.forEach((function (className) {
            if($target.hasClass(className)) {
                this.popup.hide();
            }
        }).bind(this));
        if (e.target==this) {
            this.popup.hide();
        }
    });
    window.popupHelper = this;
    this.body_.popup = this;

    Ntry.createElement('div', this.body_, null, 'entryPopupHelperTopSpan');
    var middle = Ntry.createElement('div', this.body_, null, 'entryPopupHelperMiddleSpan');
    Ntry.createElement('div', this.body_, null, 'entryPopupHelperBottomSpan');

    Ntry.createElement('div', middle, null, 'entryPopupHelperLeftSpan');
    this.window_ = Ntry.createElement('div', middle, null, 'entryPopupHelperWindow');
    Ntry.createElement('div', middle, null, 'entryPopupHelperRightSpan');

    document.body.appendChild(this.body_);
};

Entry.popupHelper.prototype.clearPopup = function() {
    var maxCnt = this.popupWrapper_.children.length - 1;
    for(var i = maxCnt;  i > 2; i--) {
        this.popupWrapper_.removeChild(this.popupWrapper_.children[i]);
    }
};

Entry.popupHelper.prototype.addPopup = function(key, popupObject) {
    var content_ = Entry.createElement('div');

    var title_ = Entry.createElement('div');
    title_.addClass('entryPopupHelperTitle');    

    var titleButton_ = Entry.createElement('div');
    titleButton_.addClass('entryPopupHelperCloseButton');    

    titleButton_.addEventListener('click', (function () {
        this.hide();
    }).bind(this));

    var popupWrapper_ = Entry.createElement('div');
    popupWrapper_.appendChild(titleButton_);
    popupWrapper_.appendChild(title_);
    popupWrapper_.addClass('entryPopupHelperWrapper');

    content_.appendChild(popupWrapper_);
    content_.popupWrapper_ = popupWrapper_;

    title_.textContent = popupObject.title;
    if(typeof popupObject.setPopupLayout === 'function') {
        popupObject.setPopupLayout(content_);
    }

    this.popupList[key] = content_;
};

Entry.popupHelper.prototype.hasPopup = function(key) {
    return !!this.popupList[key];
}

Entry.popupHelper.prototype.setPopup = function(popupObject) {
    this.clearPopup();
    this.title_.textContent = popupObject.title;
    if(typeof popupObject.setPopupLayout === 'function') {
        popupObject.setPopupLayout(this);
    }
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

Entry.popupHelper.prototype.show = function(key) {
    if(this.window_.childNodes.length > 0) {
        this.window_.removeChild(this.window_.childNodes[0]);   
    }
    this.window_.appendChild(this.popupList[key]);
    this.body_.removeClass('hiddenPopup');
};


Entry.popupHelper.prototype.hide = function() {
    this.body_.addClass('hiddenPopup');
};