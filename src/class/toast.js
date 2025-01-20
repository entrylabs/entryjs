/**
 * @fileoverview Toast object for notification
 */
'use strict';

/**
 * Constructor of toast
 * @constructor
 */
Entry.Toast = class Toast {
    constructor() {
        this.toasts_ = [];
        /** @type {Element} */
        const exist = document.getElementById('entryToastContainer');
        if (exist) {
            Entry.modalContainer.removeChild(exist);
        }
        this.body_ = Entry.createElement('div', 'entryToastContainer');
        this.body_.addClass('entryToastContainer');
        Entry.modalContainer.appendChild(this.body_);
    }

    warning(title, message, isNotAutoDispose) {
        const toast = Entry.createElement('div', 'entryToast');
        toast.addClass('entryToast');
        toast.addClass('entryToastWarning');
        toast.bindOnClick(() => {
            Entry.toast.body_.removeChild(toast);
        });
        const toastTitle = Entry.createElement('div', 'entryToast');
        toastTitle.addClass('entryToastTitle');
        toastTitle.textContent = title;
        toast.appendChild(toastTitle);
        const toastMessage = Entry.createElement('p', 'entryToast');
        toastMessage.addClass('entryToastMessage');
        toastMessage.textContent = message;
        toast.appendChild(toastMessage);
        this.toasts_.push(toast);
        this.body_.appendChild(toast);
        const f = () => {
            toast.style.opacity = 1;
            var timer = setInterval(() => {
                if (toast.style.opacity < 0.05) {
                    clearInterval(timer);
                    toast.style.display = 'none';
                    Entry.removeElement(toast);
                }
                toast.style.opacity *= 0.9;
            }, 20);
        };
        if (!isNotAutoDispose) {
            window.setTimeout(f, 1000);
        }
    }

    success(title, message, isNotAutoDispose) {
        const toast = Entry.createElement('div', 'entryToast');
        toast.addClass('entryToast');
        toast.addClass('entryToastSuccess');
        toast.bindOnClick(() => {
            Entry.toast.body_.removeChild(toast);
        });
        const toastTitle = Entry.createElement('div', 'entryToast');
        toastTitle.addClass('entryToastTitle');
        toastTitle.textContent = title;
        toast.appendChild(toastTitle);
        const toastMessage = Entry.createElement('p', 'entryToast');
        toastMessage.addClass('entryToastMessage');
        toastMessage.textContent = message;
        toast.appendChild(toastMessage);
        this.toasts_.push(toast);
        this.body_.appendChild(toast);
        const f = () => {
            toast.style.opacity = 1;
            var timer = setInterval(() => {
                if (toast.style.opacity < 0.05) {
                    clearInterval(timer);
                    toast.style.display = 'none';
                    Entry.removeElement(toast);
                }
                toast.style.opacity *= 0.9;
            }, 20);
        };
        if (!isNotAutoDispose) {
            window.setTimeout(f, 1000);
        }
    }

    alert(title, message, isNotAutoDispose) {
        const toast = Entry.createElement('div', 'entryToast');
        let timer;
        toast.addClass('entryToast');
        toast.addClass('entryToastAlert');
        toast.bindOnClick(() => {
            Entry.toast.body_.removeChild(toast);
            if (timer) {
                clearInterval(timer);
            }
        });
        const toastTitle = Entry.createElement('div', 'entryToast');
        toastTitle.addClass('entryToastTitle');
        toastTitle.textContent = title;
        toast.appendChild(toastTitle);
        const toastMessage = Entry.createElement('p', 'entryToast');
        toastMessage.addClass('entryToastMessage');

        if (Array.isArray(message)) {
            toastMessage.textContent = message.reduce(
                (total, current) => `${total}\n${current}`,
                ''
            );
        } else {
            toastMessage.textContent = message;
        }

        toast.appendChild(toastMessage);
        this.toasts_.push(toast);
        this.body_.appendChild(toast);
        const f = () => {
            toast.style.opacity = 1;
            timer = setInterval(() => {
                if (toast.style.opacity < 0.05) {
                    clearInterval(timer);
                    toast.style.display = 'none';
                    //check element already removed from parent
                    if (toast.parentElement) {
                        Entry.toast.body_.removeChild(toast);
                    }
                }
                toast.style.opacity *= 0.9;
            }, 20);
        };
        if (!isNotAutoDispose) {
            window.setTimeout(f, 5000);
        }
        return toast;
    }

    isOpen(target) {
        const activated = this.toasts_.filter((toast) => toast.style.display !== 'none');
        if (target) {
            return activated.includes(target);
        }
        return activated.length > 0;
    }
};
