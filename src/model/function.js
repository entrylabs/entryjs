'use strict';

goog.provide('Entry.Function');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.Function = function() {
    var schema = {
        id: 0,
        type: Entry.STATIC.FUNCTION,
        block: 0,
        content: 0,
        fieldNames: 0
    };

    Entry.Model(this, schema);
};
