'use strict';

goog.provide("Entry.Recorder");

goog.require("Entry.STATIC");

Entry.Recorder = function() {
    this._recordData = [];
    Entry.commander.addReporter(this);
};

(function(p) {
    p.add = function(data) {
        var commandType = data[0];
        if (!commandType)
            return;
        var command = Entry.Command[commandType];
        switch (command.recordable) {
            case undefined:
                return;
            case Entry.STATIC.RECORDABLE.SUPPORT:
                this._recordData.push(data);
                Entry.toast.warning(commandType);
                return;
            case Entry.STATIC.RECORDABLE.SKIP:
                return;
            case Entry.STATIC.RECORDABLE.ABANDONE:
                Entry.toast.alert("지원하지 않음");
                return;
        }
    };

    p.getData = function() {
        return this._recordData;
    }

})(Entry.Recorder.prototype);
