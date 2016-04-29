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
<<<<<<< HEAD
    this.nowPopup;
=======
    this.nowContent;
>>>>>>> master
    if(reset) {
        window.popupHelper = null;
    }
    Entry.assert(!window.popupHelper, 'Popup exist');    

<<<<<<< HEAD
=======
    var ignoreCloseType = ['confirm', 'spinner'];
>>>>>>> master
    var spanArea = ['entryPopupHelperTopSpan', 'entryPopupHelperBottomSpan', 'entryPopupHelperLeftSpan', 'entryPopupHelperRightSpan'];
    this.body_ = Entry.Dom('div', {
        classes: ['entryPopup', 'hiddenPopup', 'popupHelper'],
    })
<<<<<<< HEAD
    this.body_.bindOnClick(function(e) {
=======
    var that = this;
    this.body_.bindOnClick(function(e) {
        if(that.nowContent && ignoreCloseType.indexOf(that.nowContent.prop('type')) > -1) {
            return;
        }
>>>>>>> master
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

<<<<<<< HEAD
    var title_ = Entry.Dom('div', {
        class: 'entryPopupHelperTitle'
    });

=======
>>>>>>> master
    var titleButton_ = Entry.Dom('div', {
        class: 'entryPopupHelperCloseButton'
    });

    titleButton_.bindOnClick((function () {
<<<<<<< HEAD
        this.hide();
=======
        if(popupObject.closeEvent) {
            popupObject.closeEvent(this);   
        } else {
            this.hide();
        }
>>>>>>> master
    }).bind(this));

    var popupWrapper_ = Entry.Dom('div', {
        class: 'entryPopupHelperWrapper'
    });
    popupWrapper_.append(titleButton_);
<<<<<<< HEAD
    popupWrapper_.append(title_);

    content_.append(popupWrapper_);
    content_.popupWrapper_ = popupWrapper_;

    title_.text(popupObject.title);
    if(typeof popupObject.setPopupLayout === 'function') {
        popupObject.setPopupLayout(content_);
        content_.prop('popup', popupObject);
=======

    if(popupObject.title) {
        var title_ = Entry.Dom('div', {
            class: 'entryPopupHelperTitle'
        });
        popupWrapper_.append(title_);
        title_.text(popupObject.title);
    }

    content_.addClass(key);
    content_.append(popupWrapper_);
    content_.popupWrapper_ = popupWrapper_;
    content_.prop('type', popupObject.type);
    
    if(typeof popupObject.setPopupLayout === 'function') {
        popupObject.setPopupLayout(content_);
>>>>>>> master
    }

    this.popupList[key] = content_;
};

Entry.popupHelper.prototype.hasPopup = function(key) {
    return !!this.popupList[key];
}

<<<<<<< HEAD
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
=======
Entry.popupHelper.prototype.setPopup = function(popupObject) {

};

/**
 * Remove this popup
 */
Entry.popupHelper.prototype.remove = function(key) {
    if(this.window_.children().length > 0) {
        this.window_.children().remove();   
    }
    this.window_.remove();
    delete this.popupList[key];
    this.nowContent = undefined;
    this.body_.addClass('hiddenPopup');
>>>>>>> master
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
<<<<<<< HEAD

    this.nowPopup = this.popupList[key];
    this.window_.append(this.nowPopup);
    var popupObject = this.nowPopup.prop('popup');
    if(popupObject && 'onShow' in popupObject) {
        popupObject.onShow();
    }
=======
    this.window_.append(this.popupList[key]);
    this.nowContent = this.popupList[key];
>>>>>>> master
    this.body_.removeClass('hiddenPopup');
};


Entry.popupHelper.prototype.hide = function() {
<<<<<<< HEAD
    var popupObject = this.nowPopup.prop('popup');
    if(popupObject && 'onHide' in popupObject) {
        popupObject.onHide();
    }
=======
    this.nowContent = undefined;
>>>>>>> master
    this.body_.addClass('hiddenPopup');
};