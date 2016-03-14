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
    this.nowPopup;
    if(reset) {
        window.popupHelper = null;
    }
    Entry.assert(!window.popupHelper, 'Popup exist');    

    var spanArea = ['entryPopupHelperTopSpan', 'entryPopupHelperBottomSpan', 'entryPopupHelperLeftSpan', 'entryPopupHelperRightSpan'];
    this.body_ = Entry.Dom('div', {
        classes: ['entryPopup', 'hiddenPopup', 'popupHelper'],
    })
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
    this.body_.prop('popup', this);

    Entry.Dom('div', {
        class: 'entryPopupHelperTopSpan',
        parent: this.body_
    });
    var middle = Entry.Dom('div', {
        class: 'entryPopupHelperMiddleSpan',
        parent: this.body_
    });
    Entry.Dom('div', {
        class: 'entryPopupHelperBottomSpan',
        parent: this.body_
    });
    Entry.Dom('div', {
        class: 'entryPopupHelperLeftSpan',
        parent: middle
    });
    this.window_ = Entry.Dom('div', {
        class: 'entryPopupHelperWindow',
        parent: middle
    });
    Entry.Dom('div', {
        class: 'entryPopupHelperRightSpan',
        parent: middle
    });

    $('body').append(this.body_);
};

Entry.popupHelper.prototype.clearPopup = function() {
    var maxCnt = this.popupWrapper_.children.length - 1;
    for(var i = maxCnt;  i > 2; i--) {
        this.popupWrapper_.removeChild(this.popupWrapper_.children[i]);
    }
};

Entry.popupHelper.prototype.addPopup = function(key, popupObject) {
    var content_ = Entry.Dom('div');

    var title_ = Entry.Dom('div', {
        class: 'entryPopupHelperTitle'
    });

    var titleButton_ = Entry.Dom('div', {
        class: 'entryPopupHelperCloseButton'
    });

    titleButton_.bindOnClick((function () {
        this.hide();
    }).bind(this));

    var popupWrapper_ = Entry.Dom('div', {
        class: 'entryPopupHelperWrapper'
    });
    popupWrapper_.append(titleButton_);
    popupWrapper_.append(title_);

    content_.append(popupWrapper_);
    content_.popupWrapper_ = popupWrapper_;

    title_.text(popupObject.title);
    if(typeof popupObject.setPopupLayout === 'function') {
        popupObject.setPopupLayout(content_);
        content_.prop('popup', popupObject);
    }

    this.popupList[key] = content_;
};

Entry.popupHelper.prototype.hasPopup = function(key) {
    return !!this.popupList[key];
}

/**
 * Remove this popup
 */
Entry.popupHelper.prototype.remove = function() {
    var popupObject = this.nowPopup.prop('popup');
    if(popupObject && 'onRemove' in popupObject) {
        popupObject.onRemove();
    }
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
    if(this.window_.children().length > 0) {
        this.window_.children().detach();   
    }

    this.nowPopup = this.popupList[key];
    this.window_.append(this.nowPopup);
    var popupObject = this.nowPopup.prop('popup');
    if(popupObject && 'onShow' in popupObject) {
        popupObject.onShow();
    }
    this.body_.removeClass('hiddenPopup');
};


Entry.popupHelper.prototype.hide = function() {
    var popupObject = this.nowPopup.prop('popup');
    if(popupObject && 'onHide' in popupObject) {
        popupObject.onHide();
    }
    this.body_.addClass('hiddenPopup');
};