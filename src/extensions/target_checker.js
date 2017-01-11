/**
 * @fileoverview TargetChecker for courseware.
 */
'use strict';

goog.provide("Entry.TargetChecker");

goog.require("Entry.Extension");

/**
 * @constructor
 */
Entry.TargetChecker = function(code, isForEdit) {
    this.isForEdit;
    this.goals = [];
    this.achievedGoals = [];
    this.blocks = [
        "check_object_property",
        "check_block_execution",
        "check_lecture_goal"
    ];

    this.isFail = false;

    this.script = new Entry.Code([]);

    Entry.achieve = this.achieveCheck.bind(this);
    Entry.addEventListener("stop", this.reset.bind(this));
};

Entry.Utils.inherit(Entry.Extension, Entry.TargetChecker);

(function(p) {
    p.renderView = function() {
        this._view = Entry.Dom('li', {
            class: "targetChecker"
        });

        this._view.bindOnClick(function(e) {
            Entry.playground.injectObject(this);
        }.bind(this));
        this.updateView();
        return this._view;
    };

    p.updateView = function() {
        this._view.text("목표 : " + this.achievedGoals.length +
                        " / " + this.goals.length);
    };

    p.achieveCheck = function(isSuccess, id) {
        if (this.isFail)
            return;
        if (isSuccess)
            this.achieveGoal(id);
        else
            this.fail(id);
    };

    p.achieveGoal = function(id) {
        this.achievedGoals.push(id);
        this.updateView();
    };

    p.fail = function() {
        this.updateView();
        this.isFail = true;
    };

    p.reset = function() {
        this.achievedGoals = [];
        this.isFail = false;
        this.updateView();
    };

})(Entry.TargetChecker.prototype);
