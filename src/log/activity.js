'use strict';

Entry.Activity = function(name, data) {
    this.name = name;
    this.timestamp = new Date();
    var arr = [];
    if (data !== undefined) {
        for (var i = 0, len = data.length; i < len; i++) {
            var datum = data[i];
            arr.push({
                key: datum[0],
                value: datum[1],
            });
        }
    }
    this.data = arr;
};
