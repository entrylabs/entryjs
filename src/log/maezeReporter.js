'use strict';

goog.provide("Entry.MazeReporter");

Entry.MazeReporter = function() {
    this._activities = [];
};

(function(p) {
    p.add = function(activity) {
        if (!(activity instanceof Entry.MazeActivity))
            return console.error("Activity must be an instanceof Entry.MazeActivity");
        this._activities.push(activity);
    };

    p.clear = function() {
        this._activities = [];
    };

    p.get = function() {
        return this._activities;
    };
})(Entry.MazeReporter.prototype);
