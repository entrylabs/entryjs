"use strict";

goog.provide("Entry.Loader");

Entry.Loader = {
    queueCount: 0
};

Entry.Loader.addQueue = function(type) {
    if (!this.queueCount)
        Entry.dispatchEvent("loadStart");
    this.queueCount++;
};

Entry.Loader.removeQueue = function(type) {
    this.queueCount--;
    if (!this.queueCount)
        Entry.dispatchEvent("loadComplete");
};
