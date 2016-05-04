/**
 * @fileoverview Object for help message
 */
'use strict';

/**
 * Helper provide block description with 'blockHelper'
 */
Entry.Helper = function() {
    this.visible = false;
};

var p = Entry.Helper.prototype;

p.generateView = function(parentView, option) {
    if (this.parentView_) return;
    /** @type {!Element} parent view */
    this.parentView_ = parentView;
    var helper = this;
    helper.blockHelpData = EntryStatic.blockInfo;
    var blockHelperView = Entry.createElement('div',
                            'entryBlockHelperWorkspace');
    this.view = blockHelperView;
    if (Entry.isForLecture)
        blockHelperView.addClass('lecture');
    helper.parentView_.appendChild(blockHelperView);
    if (!Entry.isForLecture) {
        var blockHelperHeader = Entry.createElement('div',
                                'entryBlockHelperHeaderWorkspace');
        blockHelperHeader.innerHTML = Lang.Helper.Block_info;
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

    this._renderView = new Entry.RenderView($(blockHelperBlock), 'LEFT');
    this.code = new Entry.Code([]);
    this._renderView.changeCode(this.code);

    this.first = true;
};

p.bindWorkspace = function(workspace) {
    if (!workspace) return;

    if (this._blockViewObserver) this._blockViewObserver.destroy();

    this.workspace = workspace;
    this._blockViewObserver =
        workspace.observe(this, "_updateSelectedBlock", ['selectedBlockView']);
};

/**
 * toggle on block helper
 */
p._updateSelectedBlock = function() {
    var blockView = this.workspace.selectedBlockView;
    if (!blockView || !this.visible || blockView == this._blockView) return;

    if (this.first) {
        this.blockHelperContent_.removeClass('entryBlockHelperIntro');
        this.first = false;
    }

    var type = blockView.block.type;
    this._blockView = blockView;
    this.renderBlock(type);
};

p.renderBlock = function(type) {
    if (!type || !this.visible) return;
    var code = this.code;
    this.code.clear();

    var def = Entry.block[type].def;
    def = def || {type:type};
    this.code.createThread([def]);

    this.code.board.align();
    this.code.board.resize();


    var blockView = this.code.getThreads()[0].getFirstBlock().view;
    var bBox = blockView.svgGroup.getBBox();
    var blockWidth = bBox.width;
    var blockHeight = bBox.height;
    var offsetX =blockView.getSkeleton().box(blockView).offsetX;
    if (isNaN(offsetX)) offsetX = 0;
    this.blockHelperDescription_.innerHTML = Lang.Helper[type];
    this._renderView.align();

    $(this.blockHelperDescription_).css({
        top: blockHeight + 30
    });

    var renderView = this._renderView;
    var dom = renderView.svgDom;
    dom.css({
        'margin-left':-(blockWidth/2) -20 - offsetX
    });
};

p.getView = function() {
    return this.view;
};

p.resize = function() {};
