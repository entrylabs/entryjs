'use strict';

goog.provide("Entry.ActivityReporter");

Entry.ActivityReporter = function() {
    this._activities = [];
};

(function(p) {
    p.add = function(activity) {
        if (!(activity instanceof Entry.Activity))
            return console.error("Activity must be an instanceof Entry.MazeActivity");
        this._activities.push(activity);
    };

    p.clear = function() {
        this._activities = [];
    };

    p.get = function() {
        return this._activities;
    };
})(Entry.ActivityReporter.prototype);
