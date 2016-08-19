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
    this.nowContent;
    if(reset) {
        window.popupHelper = null;
    }
    Entry.assert(!window.popupHelper, 'Popup exist');    

    var ignoreCloseType = ['confirm', 'spinner'];
    var spanArea = ['entryPopupHelperTopSpan', 'entryPopupHelperBottomSpan', 'entryPopupHelperLeftSpan', 'entryPopupHelperRightSpan'];
    this.body_ = Entry.Dom('div', {
        classes: ['entryPopup', 'hiddenPopup', 'popupHelper'],
    })
    var that = this;
    this.body_.bindOnClick(function(e) {
        if(that.nowContent && ignoreCloseType.indexOf(that.nowContent.prop('type')) > -1) {
            return;
        }
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

    this.body_.bind('touchstart', function(e) {
        if(that.nowContent && ignoreCloseType.indexOf(that.nowContent.prop('type')) > -1) {
            return;
        }
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

    var titleButton_ = Entry.Dom('div', {
        class: 'entryPopupHelperCloseButton'
    });

    titleButton_.bindOnClick((function () {
        if(popupObject.closeEvent) {
            popupObject.closeEvent(this);   
        } else {
            this.hide();
        }
    }).bind(this));

    var self = this;
    
    titleButton_.bind('touchstart', function() {
        if(popupObject.closeEvent) {
            popupObject.closeEvent(self);   
        } else {
            self.hide();
        }
    });

    var popupWrapper_ = Entry.Dom('div', {
        class: 'entryPopupHelperWrapper'
    });
    popupWrapper_.append(titleButton_);

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
    }

    this.popupList[key] = content_;
};

Entry.popupHelper.prototype.hasPopup = function(key) {
    return !!this.popupList[key];
}

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
    this.window_.append(this.popupList[key]);
    this.nowContent = this.popupList[key];
    this.body_.removeClass('hiddenPopup');
};


Entry.popupHelper.prototype.hide = function() {
    this.nowContent = undefined;
    this.body_.addClass('hiddenPopup');
};