'use strict';

Entry.ActivityReporter = function() {
    this._activities = [];
};

(function(p) {
    p.add = function(data) {
        if (!data || data.length === 0) return;
        var activity;
        if (data instanceof Entry.Activity) activity = data;
        else {
            var type = data.shift();
            activity = new Entry.Activity(type, data);
        }

        this._activities.push(activity);
    };

    p.clear = function() {
        this._activities = [];
    };

    p.get = function() {
        return this._activities;
    };

    p.report = function() {};
})(Entry.ActivityReporter.prototype);
