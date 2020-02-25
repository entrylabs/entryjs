require('../util/utils');

Entry.popupHelper = class PopupHelper {
    constructor(reset) {
        this.popupList = {};
        this.nextPopupList = [];
        this.nowContent;
        if (reset) {
            $('.entryPopup.popupHelper').remove();
            window.popupHelper = null;
        }
        Entry.assert(!window.popupHelper, 'Popup exist');

        const ignoreCloseType = ['confirm', 'spinner'];
        const spanArea = [
            'entryPopupHelperTopSpan',
            'entryPopupHelperBottomSpan',
            'entryPopupHelperLeftSpan',
            'entryPopupHelperRightSpan',
        ];
        this.body_ = Entry.Dom('div', {
            classes: ['entryPopup', 'hiddenPopup', 'popupHelper'],
        });
        const that = this;

        function popupClickEvent(e) {
            if (that.nowContent && ignoreCloseType.indexOf(that.nowContent.prop('type')) > -1) {
                return;
            }
            const $target = $(e.target);
            spanArea.forEach((className) => {
                if ($target.hasClass(className)) {
                    that.hide();
                }
            });
            if (e.target == that) {
                that.hide();
            }
        }

        this.body_.bindOnClick(popupClickEvent);

        window.popupHelper = this;
        this.body_.prop('popup', this);

        Entry.Dom('div', {
            class: 'entryPopupHelperTopSpan',
            parent: this.body_,
        });
        const middle = Entry.Dom('div', {
            class: 'entryPopupHelperMiddleSpan',
            parent: this.body_,
        });
        Entry.Dom('div', {
            class: 'entryPopupHelperBottomSpan',
            parent: this.body_,
        });
        Entry.Dom('div', {
            class: 'entryPopupHelperLeftSpan',
            parent: middle,
        });
        this.window_ = Entry.Dom('div', {
            class: 'entryPopupHelperWindow',
            parent: middle,
        });
        Entry.Dom('div', {
            class: 'entryPopupHelperRightSpan',
            parent: middle,
        });

        $('body').append(this.body_);
    }

    clearPopup() {
        const maxCnt = this.popupWrapper_.children.length - 1;
        for (let i = maxCnt; i > 2; i--) {
            this.popupWrapper_.removeChild(this.popupWrapper_.children[i]);
        }
    }

    addPopup(key, popupObject) {
        const content_ = Entry.Dom('div');

        const titleButton_ = Entry.Dom('div', {
            class: 'entryPopupHelperCloseButton',
        });

        titleButton_.bindOnClick(() => {
            if (popupObject.closeEvent) {
                popupObject.closeEvent(this);
            } else {
                this.hide();
            }
        });

        const self = this;

        const popupWrapper_ = Entry.Dom('div', {
            class: 'entryPopupHelperWrapper',
        });

        popupWrapper_.append(titleButton_);

        if (popupObject.title) {
            const title_ = Entry.Dom('div', {
                class: 'entryPopupHelperTitle',
            });
            popupWrapper_.append(title_);
            title_.text(popupObject.title);
        }

        content_.addClass(key);
        content_.append(popupWrapper_);
        content_.popupWrapper_ = popupWrapper_;
        content_.prop('type', popupObject.type);

        if (typeof popupObject.setPopupLayout === 'function') {
            popupObject.setPopupLayout(content_);
        }
        content_._obj = popupObject;

        this.popupList[key] = content_;
    }

    hasPopup(key) {
        return !!this.popupList[key];
    }

    remove(key) {
        if (key) {
            this.window_.find(`> .${key}`).remove();
        } else if (this.window_.children().length > 0) {
            this.window_.children().remove();
        }
        // 지워지면 안되는 요소인데 지워지고 있었음. 이유는? 잠시동안만 유지.
        // this.window_.remove();
        delete this.popupList[key];

        if (this.nowContent && this.nowContent.hasClass(key)) {
            this.nowContent = undefined;
            this.body_.addClass('hiddenPopup');
            if (this.nextPopupList.length > 0) {
                this.show(this.nextPopupList.shift());
            }
        }
    }

    resize(e) {}

    show(key, isNext) {
        const that = this;

        function showContent(key) {
            that.window_.append(that.popupList[key]);
            that.nowContent = that.popupList[key];
            that.body_.removeClass('hiddenPopup');
        }

        if (!isNext) {
            this.window_.children().detach();
            showContent(key);
        } else {
            if (this.window_.children().length > 0) {
                this.nextPopupList.push(key);
            } else {
                this.window_.children().detach();
                showContent(key);
            }
        }
        if (this.nowContent && this.nowContent._obj && this.nowContent._obj.onShow) {
            this.nowContent._obj.onShow();
        }
    }

    hide() {
        const popup = this.nowContent && this.nowContent._obj;
        if (popup && 'closeEvent' in popup) {
            popup.closeEvent(this);
        }
        this.nowContent = undefined;
        this.body_.addClass('hiddenPopup');
        this.window_.children().detach();
        if (this.nextPopupList.length > 0) {
            this.show(this.nextPopupList.shift());
        }
    }

    addClass(className) {
        className && this.body_.addClass(className);
    }
};
