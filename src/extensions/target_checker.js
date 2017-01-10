/**
 * @fileoverview TargetChecker for courseware.
 */
'use strict';

goog.provide("Entry.TargetChecker");

goog.require("Entry.Extension");

/**
 * @constructor
 */
Entry.TargetChecker = function() {
    this.isForEdit;
    this.goals = [];
    this.blocks = [
        "check_object_property",
        "check_block_execution",
        "check_lecture_goal"
    ];
};

Entry.Utils.inherit(Entry.Extension, Entry.TargetChecker);

(function(p) {
    p.renderView = function() {
        this._view = Entry.Dom('li', {
            class: "targetChecker"
        });
        return this._view;
    };

})(Entry.TargetChecker.prototype);
