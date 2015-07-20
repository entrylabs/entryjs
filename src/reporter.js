/**
 * @fileoverview Show dialog on canvas
 */

Entry.Reporter = function() {
    this.userId;
    this.projectId;
};

Entry.Reporter.prototype.start = function(projectId, userId, startTime) {
    this.io = io(window.location.href.split("/")[2]);
    this.io.emit('activity', {
        message: 'start',
        userId: userId,
        projectId: projectId,
        time: startTime
    });
    this.userId = userId;
    this.projectId = projectId;
};

Entry.Reporter.prototype.report = function(state) {
    if (!this.io)
        return;
    var params = [];
    for (var i in state.params) {
        var param = state.params[i];
        if (typeof param !== "object")
            params.push(param);
        else if (param.id)
            params.push (param.id);
    }
    this.io.emit('activity', {
        message: state.message,
        userId: this.userId,
        projectId: this.projectId,
        time: state.time,
        params: params
    });
};
