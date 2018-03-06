'use strict';

Entry.Recorder = function() {
    this._recordData = [];
    Entry.commander.addReporter(this);
};

(function(p) {
    p.add = function(data) {
        var commandType = data[0];
        if (!commandType) return;
        var command = Entry.Command[commandType];
        switch (command.recordable) {
            case Entry.STATIC.RECORDABLE.SUPPORT:
                this._recordData.push(data);
                Entry.toast.warning('Record', Lang.Command[commandType + '']);
                return;
            case Entry.STATIC.RECORDABLE.SKIP:
                return;
            case Entry.STATIC.RECORDABLE.ABANDON:
                Entry.toast.alert('지원하지 않음');
                return;
        }
    };

    p.getData = function() {
        return this._recordData;
    };
})(Entry.Recorder.prototype);
