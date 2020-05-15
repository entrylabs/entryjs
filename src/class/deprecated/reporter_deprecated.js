'use strict';
/**
 * @fileoverview Show dialog on canvas
 */

Entry.Reporter = function(isRealTime) {
    this.userId = null;
    this.projectId = null;
    this.isRealTime = isRealTime;
    this.activities = [];
};

Entry.Reporter.prototype.start = function(projectId, userId, startTime) {
    //this.io = io(window.location.href.split("/")[2]);
    if (this.isRealTime) {
        if (window.location.href.indexOf('localhost') > -1) {
            this.io = io('localhost:7000');
        } else {
            this.io = io('play04.play-entry.com:7000');
        }
        this.io.emit('activity', {
            message: 'start',
            userId,
            projectId,
            time: startTime,
        });
    }
    this.userId = userId;
    this.projectId = projectId;
};

Entry.Reporter.prototype.report = function(state) {
    if (this.isRealTime && !this.io) {
        return;
    }
    const params = [];
    for (const i in state.params) {
        const param = state.params[i];
        if (typeof param !== 'object') {
            params.push(param);
        } else if (param.id) {
            params.push(param.id);
        }
    }
    const activity = {
        message: state.message,
        userId: this.userId,
        projectId: this.projectId,
        time: state.time,
        params,
    };
    if (this.isRealTime) {
        this.io.emit('activity', activity);
    } else {
        this.activities.push(activity);
    }
};
