'use strict';

Entry.Activity = function(name, data) {
    this.name = name;
    this.timestamp = new Date();
    const arr = [];
    if (data !== undefined) {
        for (let i = 0, len = data.length; i < len; i++) {
            const datum = data[i];
            arr.push({
                key: datum[0],
                value: datum[1],
            });
        }
    }
    this.data = arr;
};
