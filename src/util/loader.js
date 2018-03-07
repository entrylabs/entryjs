'use strict';

Entry.Loader = {
    queueCount: 0,
    totalCount: 0,
    loaded: false,
};

Entry.Loader.addQueue = function(type) {
    if (!this.queueCount) Entry.dispatchEvent('loadStart');
    this.queueCount++;
    this.totalCount++;
};

Entry.Loader.removeQueue = function(type) {
    this.queueCount--;
    if (!this.queueCount) {
        this.totalCount = 0;
        this.handleLoad();
    }
};

Entry.Loader.getLoadedPercent = function() {
    if (this.totalCount === 0) return 1;
    else return this.queueCount / this.totalCount;
};

Entry.Loader.isLoaded = function() {
    return !this.queueCount && !this.totalCount;
};

Entry.Loader.handleLoad = function() {
    if (this.loaded) return;
    this.loaded = true;
    Entry.dispatchEvent('loadComplete');
};
