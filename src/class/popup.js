/**
 * @fileoverview Popup object for generate popup.
 */
'use strict';

/**
 * Constructor of popup
 * @constructor
 */
Entry.Popup = class Popup {
    constructor(className) {
        Entry.assert(!window.popup, 'Popup exist');

        this.body_ = Entry.createElement('div');
        this.body_.addClass('entryPopup');
        if (className) {
            this.body_.addClass(className);
        }
        this.body_.bindOnClick(function(e) {
            if (e.target == this) {
                this.popup.remove();
            }
        });
        this.body_.popup = this;
        Entry.modalContainer.appendChild(this.body_);
        this.window_ = Entry.createElement('div');
        this.window_.addClass('entryPopupWindow');
        if (Entry.targetChecker && !Entry.targetChecker.statusViewDisabled) {
            this.window_.addClass('targetCheckerPopup');
        }
        // if (Entry.device === 'tablet') this.window_.addClass('tablet');
        this.window_.bindOnClick(() => {});
        Entry.addEventListener('windowResized', this.resize);
        window.popup = this;
        this.resize();
        this.body_.appendChild(this.window_);
    }
    /**
     * Remove this popup
     */
    remove() {
        while (this.window_.hasChildNodes()) {
            if (Entry.type == 'workspace') {
                Entry.engineContainer.insertBefore(
                    Entry.engine.buttonWrapper,
                    Entry.engineContainer.firstChild
                );
                Entry.engineContainer.insertBefore(
                    this.window_.firstChild,
                    Entry.engineContainer.firstChild
                );
            } else if (Entry.type == 'minimize') {
                const wrapper = Entry.view_.querySelector('#entryCanvasWrapper');
                wrapper.insertBefore(this.window_.lastChild, wrapper.firstChild);
            } else {
                Entry.engineContainer.insertBefore(
                    this.window_.lastChild,
                    Entry.engineContainer.firstChild
                );
            }
        }
        $('body').css('overflow', 'auto');
        Entry.removeElement(this.body_);
        window.popup = null;
        Entry.removeEventListener('windowResized', this.resize);
        Entry.engine.popup = null;
        Entry.windowResized.notify();
        if (
            Entry.type === 'workspace' &&
            Entry.targetChecker &&
            !Entry.targetChecker.statusViewDisabled
        ) {
            Entry.targetChecker.getStatusView().remove();
        }
    }

    /**
     * Resize this view size when window size modified
     * @param {event} e
     */
    resize(e) {
        const popup = window.popup;
        const popupWindow = popup.window_;
        const bottomOffset =
            Entry.targetChecker && !Entry.targetChecker.statusViewDisabled ? 91 + 48 : 48;
        let maxWidth = window.innerWidth * 0.9;
        let maxHeight = window.innerHeight * 0.9 - bottomOffset;
        if (maxWidth * 9 <= maxHeight * 16) {
            maxHeight = (maxWidth / 16) * 9;
            maxHeight += bottomOffset;
            popupWindow.style.width = `${String(maxWidth)}px`;
            popupWindow.style.height = `${String(maxHeight)}px`;
        } else {
            maxWidth = (maxHeight * 16) / 9;
            maxHeight += bottomOffset;
            popupWindow.style.width = `${String(maxWidth)}px`;
            popupWindow.style.height = `${String(maxHeight)}px`;
        }

        Entry.stage && Entry.stage.updateBoundRect();
    }

    removeMouseDispose(e) {
        this.body_.unBindOnClick();
    }
};
