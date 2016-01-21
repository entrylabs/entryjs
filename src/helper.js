/**
 * @fileoverview Object for help message
 */
'use strict';

/**
 * Helper provide block description with 'blockHelper'
 */
Entry.Helper = function() {
};

var p = Entry.Helper.prototype;

/**
 * initialize block helper
 * @param {!Element} parentView
 */
p.initBlockHelper = function(parentView) {
    if (this.parentView_)
        return;
    /** @type {!Element} parent view */
    this.parentView_ = parentView;
};

/**
 * toggle on block helper
 */
p.blockHelperOn = function() {
    if (this.blockHelperView_)
        return this.blockHelperOff();
    var helper = this;
    helper.blockHelpData = EntryStatic.blockInfo;
    var blockHelperView = Entry.createElement('div',
                            'entryBlockHelperWorkspace');
    if (Entry.isForLecture)
        blockHelperView.addClass('lecture');
    helper.parentView_.appendChild(blockHelperView);
    if (!Entry.isForLecture) {
        var blockHelperHeader = Entry.createElement('div',
                                'entryBlockHelperHeaderWorkspace');
        blockHelperHeader.innerHTML = Lang.Helper.Block_info;
        var blockHelperDispose = Entry.createElement('button',
                                'entryBlockHelperDisposeWorkspace');
        blockHelperDispose.addClass('entryBtn');
        blockHelperDispose.bindOnClick(function() {
            helper.blockHelperOff();
        });
        blockHelperHeader.appendChild(blockHelperDispose);
        blockHelperView.appendChild(blockHelperHeader);
    }
    var blockHelperContent = Entry.createElement('div',
                            'entryBlockHelperContentWorkspace');
    blockHelperContent.addClass('entryBlockHelperIntro');
    if (Entry.isForLecture)
        blockHelperContent.addClass('lecture');
    blockHelperView.appendChild(blockHelperContent);
    helper.blockHelperContent_ = blockHelperContent;
    helper.blockHelperView_ = blockHelperView;

    var blockHelperBlock = Entry.createElement('div',
                            'entryBlockHelperBlockWorkspace');
    helper.blockHelperContent_.appendChild(blockHelperBlock);

    var blockHelperDescription = Entry.createElement('div',
                            'entryBlockHelperDescriptionWorkspace');
    helper.blockHelperContent_.appendChild(blockHelperDescription);
    blockHelperDescription.innerHTML = Lang.Helper.Block_click_msg;
    this.blockHelperDescription_ = blockHelperDescription;

    this.blockMenu_ = new Entry.BlockMenu($(blockHelperBlock), 'LEFT');
    this.blockMenu_.viewOnly = true;
    var ws = Entry.playground.mainWorkspace;
    if (ws)
        this.workspace = ws;
        this._blockViewObserver =
        ws.observe(this, "updateSelectedBlock", ['selectedBlockView']);
    this.first = true;
};

/**
 * toggle on block helper
 */
p.blockHelperOff = function() {
    if (!this.blockHelperView_ || Entry.isForLecture)
        return;
    var helper = this;
    helper.blockHelperView_.addClass('dispose');

    Entry.bindAnimationCallback(helper.blockHelperView_, function(e) {
        helper.parentView_.removeChild(helper.blockHelperView_);
        delete helper.blockHelperContent_;
        delete helper.blockHelperView_;
    });

    if (this._blockViewObserver)
        this._blockViewObserver.destroy();
    this.code = null;
};

/**
 * toggle on block helper
 */
p.updateSelectedBlock = function() {
    var blockView = this.workspace.selectedBlockView;
    if (!blockView) return;

    if (this.first) {
        this.blockHelperContent_.removeClass('entryBlockHelperIntro');
        this.first = false;
    }
    var type = blockView.block.type;
    this.renderBlock(type);
};

p.renderBlock = function(type) {
    if (!type) return;
    if (this.code) this.code = null;

    this.code = new Entry.Code([
        [
            {
                type:type,
                readOnly: true
            }
        ]
    ]);

    this.blockMenu_.changeCode(this.code);

    var blockView = this.code.getThreads()[0].getFirstBlock().view;
    var bBox = blockView.svgGroup.getBBox();
    var blockWidth = bBox.width;
    var blockHeight = bBox.height;
    var offsetX =blockView.getSkeleton().box(blockView).offsetX;
    if (isNaN(offsetX)) offsetX = 0;
    this.blockHelperDescription_.innerHTML = Lang.Helper[type];

    $(this.blockHelperDescription_).css({
        top: blockHeight + 30
    });

    var blockMenu = this.blockMenu_;
    var dom = blockMenu.svgDom;
    dom.css({
        'margin-left':-(blockWidth/2) -20 - offsetX
    });
};
