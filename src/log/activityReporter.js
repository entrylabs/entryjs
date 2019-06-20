'use strict';

Entry.ActivityReporter = class ActivityReporter {
    constructor() {
        this._activities = [];
    }

    add(data) {
        if (!data || data.length === 0) {
            return;
        }
        let activity;
        if (data instanceof Entry.Activity) {
            activity = data;
        } else {
            const type = data.shift();
            activity = new Entry.Activity(type, data);
        }

        this._activities.push(activity);
    }

    clear() {
        this._activities = [];
    }

    get() {
        return this._activities;
    }

    report() {}
};
