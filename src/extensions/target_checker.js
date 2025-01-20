/**
 * @fileoverview TargetChecker for courseware.
 */
'use strict';


require("../util/utils")
require("../extensions/extension")

/**
 * @constructor
 */
Entry.TargetChecker = function(code, isForEdit, type) {
    this.isForEdit = isForEdit;
    this.goals = [];
    this.publicGoals = [];
    this.unachievedGoals = [];
    this.listener = {};
    this.remainPublicGoal = 0;
    this.lastMessage = "";
    if (this.isForEdit) {
        this.watchingBlocks = [];
        Entry.playground.mainWorkspace.blockMenu.unbanClass("checker");
        Entry.addEventListener("run", this.reRegisterAll.bind(this));
    }

    this.type = type || "mission";

    this.isFail = false;
    this.isSuccess = false;

    this.entity = this;
    this.parent = this;

    Entry.achieveEvent = new Entry.Event();
    Entry.addEventListener("stop", this.reset.bind(this));

    Entry.registerAchievement = this.registerAchievement.bind(this);
    this.script = new Entry.Code(code ? code : [], this);
    Entry.targetChecker = this;
};

(function(p) {
    p.renderView = function() {
        this._view = Entry.Dom('li', {
            class: "targetChecker"
        });

        this._view.bindOnClick(function(e) {
            Entry.playground.injectObject(this);
        }.bind(this));
        this.updateView();
        if (!this.isForEdit)
            this._view.addClass("entryRemove");
        return this._view;
    };

    p.generateStatusView = function(isForIframe) {
        if(this.statusViewDisabled) {
            return ;
        }
        this._statusView = Entry.Dom('div', {
            class: "entryTargetStatus"
        });
        var innerWrapper = Entry.Dom('div', {
            class: "innerWrapper",
            parent: this._statusView
        });
        this._statusViewIndicator = Entry.Dom('div', {
            class: "statusIndicator",
            parent: innerWrapper
        });
        var statusViewContentWrapper = Entry.Dom('div', {
            class: "statusMessage",
            parent: innerWrapper
        });
        this._statusViewContent = Entry.Dom('p', {
            parent: statusViewContentWrapper
        });
        if (isForIframe) {
            $(Entry.view_).addClass("iframeWithTargetStatus")
            Entry.view_.appendChild(this._statusView[0]);
        }
        this.updateView();
        this.showDefaultMessage();
    };

    p.updateView = function() {
        if (this._view) {
            this.renderViewMessage();
            if (this.isSuccess)
                this._view.addClass("success");
            else
                this._view.removeClass("success");
            if (this.isFail)
                this._view.addClass("fail");
            else
                this._view.removeClass("fail");
        }
        if (this._statusView) {
            this.renderIndicatorMessage();
        }
    };

    p.getStatusView = function() {
         if (!this._statusView)
             this.generateStatusView();
         return this._statusView;
    }

    p.showStatusMessage = function(message) {
        this.lastMessage = message;
        this.lastIndicatorMessage = null;
        this.renderIndicatorMessage();
        if (this._statusViewContent && !this.isFail)
            this._statusViewContent.text(message);
        this.renderViewMessage();
    };

    p.achieveCheck = function(isSuccess, id) {
        if (this.isFail || !Entry.engine.achieveEnabled)
            return;
        if (isSuccess)
            this.achieveGoal(id);
        else
            this.fail(id);
    };

    p.achieveGoal = function(id) {
        if (this.isSuccess || this.isFail || this.unachievedGoals.indexOf(id) < 0)
            return;
        this.unachievedGoals.splice(this.unachievedGoals.indexOf(id), 1);
        if (this.publicGoals.indexOf(id) > -1)
            this.remainPublicGoal--;
        if (this.remainPublicGoal === 0) {
            this.isSuccess = true;
            this.showSuccessMessage();
            Entry.achieveEvent.notify("success", id);
        }
        this.updateView()
    };

    p.fail = function(id) {
        if (this.isSuccess || this.isFail)
            return;
        this.showStatusMessage(id);
        this.isFail = true;
        Entry.achieveEvent.notify("fail", id);
        this.updateView();
    };

    p.reset = function() {
        this.unachievedGoals = this.goals.concat();
        this.remainPublicGoal = this.publicGoals.length;
        this.isFail = false;
        this.isSuccess = false;
        this.updateView();
        this.showDefaultMessage();
    };

    p.showDefaultMessage = function() {
        switch(this.type) {
            case "mission":
                this.showStatusMessage("작품을 실행 해봅시다.");
                break;
            case "mission_intro":
                this.showStatusMessage("작품을 실행하며 미션을 파악해 봅시다.");
                this.renderIndicatorMessage("미션");
                break;
            case "guide_intro":
                this.showStatusMessage("작품을 실행하며 무엇을 만들지 알아 봅시다.");
                this.renderIndicatorMessage("안내");
                break;
        }
    };

    p.showSuccessMessage = function() {
        switch(this.type) {
            case "mission":
                break;
            case "mission_intro":
                this.showStatusMessage("이제 작품을 만들며 미션을 해결해 봅시다.");
                this.renderIndicatorMessage("미션");
                break;
            case "guide_intro":
                this.showStatusMessage("이제 학습을 시작해 봅시다.");
                this.renderIndicatorMessage("안내");
                break;
        }
    };

    p.checkGoal = function(goalName) {
        return this.goals.indexOf(goalName) > -1 &&
            this.unachievedGoals.indexOf(goalName) < 0;
    };

    p.registerAchievement = function(originBlock) {
        const block = $.extend(true, {}, originBlock);
        block.params = originBlock.params.map(p => p instanceof Entry.Block ? p.data.params[0] : p);

        if (this.isForEdit)
            this.watchingBlocks.push(block);
        if (block.params[1] && this.goals.indexOf(block.params[0] + "") < 0) {
            this.goals.push(block.params[0] + "");
            if (block.params[2])
                this.publicGoals.push(block.params[0] + "");
            this.remainPublicGoal = this.publicGoals.length;
        }
        this.reset();
    };

    p.reRegisterAll = function() {
        const blocks = this.script.getBlockList(false, 'check_lecture_goal').map(originBlock => {
            const block = $.extend(true, {}, originBlock);
            block.params = originBlock.params.map(p => p instanceof Entry.Block ? p.data.params[0] : p);
            return block;
        });

        this.watchingBlocks = blocks;
        this.goals = _.uniq(
            blocks.filter(function(b) {return b.params[1] === 1})
                  .map(function(b) {return b.params[0] + ""})
        );
        this.publicGoals = _.uniq(
            blocks.filter(function(b) {return b.params[1] === 1 && b.params[2] === 1})
                  .map(function(b) {return b.params[0] + ""})
        );
        this.remainPublicGoal = this.publicGoals.length;
    };

    p.clearExecutor = function() {
        this.script.clearExecutors();
    };

    p.clearListener = function () {
        Object.values(this.listener).forEach((listener) => {
            listener.destroy();
        });
        this.listener = {};
    }

    p.destroy = function() {
        this.reset();
        Entry.achieveEvent.clear();
        this.script.destroy();
        $(this._view).remove();
    };

    p.renderViewMessage = function() {
        var len = this.goals.length;
        var publicLen = this.publicGoals.length;
        if (this._view)
            this._view.html("목표 : " + (len - this.unachievedGoals.length) +
                            " / " + len + " , 공식 목표 : " +
                           (publicLen - this.remainPublicGoal) + " / " + publicLen + "<br>" +
                           this.lastMessage);
    };

    p.renderIndicatorMessage = function(message) {
        if (!this._statusViewIndicator)
            return;
        if (message)
            this.lastIndicatorMessage = message;

        var publicLen = this.publicGoals.length;
        this._statusViewIndicator.text(
            this.lastIndicatorMessage ||
                Math.min(publicLen - this.remainPublicGoal + 1, publicLen) +
                "/" + publicLen
        )
    }

})(Entry.TargetChecker.prototype);
