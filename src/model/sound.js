'use strict';

goog.provide('Entry.Sound');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.Sound = function() {
    Entry.Model(this);
};

Entry.Sound.prototype.schema = {
    id: 0,
    type: Entry.STATIC.SOUND,
    name: 0,
    filename: 0,
    ext: 0,
    duration: 0
};

