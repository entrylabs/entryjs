'use strict';

goog.provide('Entry.ThreadModel');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.ThreadModel = function() {
    Entry.Model(this);
};

Entry.ThreadModel.prototype.schema = {
    id: 0,
    type: Entry.STATIC.THREAD_MODEL,
    x: 0,
    y: 0,
    width: 0,
    minWidth: 0,
    height: 0,
};
