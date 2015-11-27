/**
 * @fileoverview Toast object for notification
 */
'use strict';

/**
 * Constructor of toast
 * @constructor
 */
Entry.Toast = function() {
    this.toasts_ = [];
    /** @type {Element} */
    var exist = document.getElementById('entryToastContainer');
    if (exist)
        document.body.removeChild(exist);
    this.body_ = Entry.createElement('div', 'entryToastContainer');
    this.body_.addClass('entryToastContainer');
    document.body.appendChild(this.body_);
};

Entry.Toast.prototype.warning = function(title, message, isNotAutoDispose) {
    var toast = Entry.createElement('div', 'entryToast');
    toast.addClass('entryToast');
    toast.addClass('entryToastWarning');
    toast.bindOnClick(function() {Entry.toast.body_.removeChild(this);});
    var toastTitle = Entry.createElement('div', 'entryToast');
    toastTitle.addClass('entryToastTitle');
    toastTitle.innerHTML = title;
    toast.appendChild(toastTitle);
    var toastMessage = Entry.createElement('p', 'entryToast');
    toastMessage.addClass('entryToastMessage');
    toastMessage.innerHTML = message;
    toast.appendChild(toastMessage);
    this.toasts_.push(toast);
    this.body_.appendChild(toast);
    var f = function() {
        toast.style.opacity = 1;
        var timer = setInterval(function () {
            if (toast.style.opacity < 0.05) {
                clearInterval(timer);
                toast.style.display = 'none';
                Entry.removeElement(toast);
            }
            toast.style.opacity *= 0.90;
        }, 20);
    };
    if (!isNotAutoDispose)
        window.setTimeout(f, 1000);
};

Entry.Toast.prototype.success = function(title, message, isNotAutoDispose) {
    var toast = Entry.createElement('div', 'entryToast');
    toast.addClass('entryToast');
    toast.addClass('entryToastSuccess');
    toast.bindOnClick(function() {Entry.toast.body_.removeChild(this);});
    var toastTitle = Entry.createElement('div', 'entryToast');
    toastTitle.addClass('entryToastTitle');
    toastTitle.innerHTML = title;
    toast.appendChild(toastTitle);
    var toastMessage = Entry.createElement('p', 'entryToast');
    toastMessage.addClass('entryToastMessage');
    toastMessage.innerHTML = message;
    toast.appendChild(toastMessage);
    this.toasts_.push(toast);
    this.body_.appendChild(toast);
    var f = function() {
        toast.style.opacity = 1;
        var timer = setInterval(function () {
            if (toast.style.opacity < 0.05) {
                clearInterval(timer);
                toast.style.display = 'none';
                Entry.removeElement(toast);
            }
            toast.style.opacity *= 0.90;
        }, 20);
    };
    if (!isNotAutoDispose)
        window.setTimeout(f, 1000);
};

Entry.Toast.prototype.alert = function(title, message, isNotAutoDispose) {
    var toast = Entry.createElement('div', 'entryToast');
    toast.addClass('entryToast');
    toast.addClass('entryToastAlert');
    toast.bindOnClick(function() {Entry.toast.body_.removeChild(this);});
    var toastTitle = Entry.createElement('div', 'entryToast');
    toastTitle.addClass('entryToastTitle');
    toastTitle.innerHTML = title;
    toast.appendChild(toastTitle);
    var toastMessage = Entry.createElement('p', 'entryToast');
    toastMessage.addClass('entryToastMessage');
    toastMessage.innerHTML = message;
    toast.appendChild(toastMessage);
    this.toasts_.push(toast);
    this.body_.appendChild(toast);
    var f = function() {
        toast.style.opacity = 1;
        var timer = setInterval(function () {
            if (toast.style.opacity < 0.05) {
                clearInterval(timer);
                toast.style.display = 'none';
                Entry.toast.body_.removeChild(toast);
            }
            toast.style.opacity *= 0.90;
        }, 20);
    };
    if (!isNotAutoDispose)
        window.setTimeout(f, 5000);
};
