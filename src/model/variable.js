'use strict';

goog.provide('Entry.Variable');

goog.require('Entry.Model');
goog.require('Entry.STATIC');

Entry.Variable = function() {
    Entry.Model(this);
};

Entry.Variable.prototype.schema = {
    id: 0,
    type: Entry.STATIC.VARIABLE,
    variableType: 0,
    name: 0,
    value: 0,
    minValue: 0,
    maxValue: 0,
    visible: true,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isCloud: false,
    object: null,
    array: 0
};
