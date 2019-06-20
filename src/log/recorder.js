'use strict';

Entry.Recorder = class Recorder {
    constructor() {
        this._recordData = [];
        Entry.commander.addReporter(this);
    }

    add = function(data) {
        const commandType = data[0];
        if (!commandType) {
            return;
        }
        const command = Entry.Command[commandType];
        switch (command.recordable) {
            case Entry.STATIC.RECORDABLE.SUPPORT:
                this._recordData.push(data);
                Entry.toast.warning('Record', Lang.Command[`${commandType}`]);
                return;
            case Entry.STATIC.RECORDABLE.SKIP:
                return;
            case Entry.STATIC.RECORDABLE.ABANDON:
                Entry.toast.alert('지원하지 않음');
                return;
        }
    };

    getData = function() {
        return this._recordData;
    };
};
