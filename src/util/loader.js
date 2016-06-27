"use strict";

goog.provide("Entry.Loader");

Entry.Loader = {
    queueCount: 0,
    totalCount: 0
};

Entry.Loader.addQueue = function(type) {
    if (!this.queueCount)
        Entry.dispatchEvent("loadStart");
    this.queueCount++;
    this.totalCount++;
};

Entry.Loader.removeQueue = function(type) {
    this.queueCount--;
    if (!this.queueCount) {
        Entry.dispatchEvent("loadComplete");
        this.totalCount = 0;
    }
};

Entry.Loader.getLoadedPercent = function() {
    if (this.totalCount === 0) return 1;
    else return this.queueCount / this.totalCount;
};
