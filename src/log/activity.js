'use strict';

goog.provide("Entry.Activity");

Entry.Activity = function(name, data) {
    this.name = name;
    this.timestamp = new Date();
    if (data !== undefined) {
        var arr = [];
        for (var i=0, len=data.length; i<len; i++) {
            var datum = data[i];
            var key = Object.keys(datum)[0];
            arr.push({
                key: key,
                value: datum[key]
            });
        }
        this.data = arr;
    } else this.data = [];
};
