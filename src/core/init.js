"use strict";

goog.provide("Entry.init");

Entry.initialize = function() {
    if (!Entry.windowReszied) {
        Entry.windowResized = new Entry.Event(window);
        $(window).on('resize', (function() {
            Entry.windowResized.notify();
        }));
    }
    if (!Entry.documentMousedown) {
        Entry.documentMousedown = new Entry.Event(window);
        $(document).on('mousedown', (function(e) {
            Entry.documentMousedown.notify(e);
        }));
    }
};

Entry.loadProject = function(project) {

};
