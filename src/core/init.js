"use strict";

goog.provide("Entry.init");

Entry.init = function() {
    if (!Entry.windowReszied) {
        Entry.windowResized = new Entry.Event(window);
        $(window).resize(function() {
            Entry.windowResized.notify();
        });
    }
};

Entry.loadProject = function(project) {

};
