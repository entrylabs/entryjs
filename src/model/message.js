'use strict';

goog.provide('Entry.Message');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.Message = function() {
    Entry.Model(this);
};

Entry.Message.prototype.schema = {
    id: 0,
    type: Entry.STATIC.MESSAGE,
    name: 0
};
