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

    var blockHelperContent =
        Entry.createElement('div', 'entryBlockHelperContentWorkspace');
    this._contentView = blockHelperContent;

    var commandTitle = Entry.createElement('div');
    commandTitle.addClass('entryBlockHelperTitle textModeElem');
    commandTitle.innerHTML = '명령어';
    blockHelperContent.appendChild(commandTitle);

    blockHelperContent.addClass('entryBlockHelperIntro');
    if (Entry.isForLecture)
        blockHelperContent.addClass('lecture');
    blockHelperView.appendChild(blockHelperContent);
    helper.blockHelperContent_ = blockHelperContent;
    helper.blockHelperView_ = blockHelperView;

    var blockHelperBlock = Entry.createElement('div',
                            'entryBlockHelperBlockWorkspace');
    helper.blockHelperContent_.appendChild(blockHelperBlock);

    var descTitle = Entry.createElement('div');
    descTitle.addClass('entryBlockHelperTitle textModeElem');
    descTitle.innerHTML = '설명';
    blockHelperContent.appendChild(descTitle);

    var blockHelperDescription = Entry.createElement('div',
                            'entryBlockHelperDescriptionWorkspace');
    blockHelperDescription.addClass('entryBlockHelperContent');
    helper.blockHelperContent_.appendChild(blockHelperDescription);
    blockHelperDescription.innerHTML = Lang.Helper.Block_click_msg;
    this.blockHelperDescription_ = blockHelperDescription;

    var elementsTitle = Entry.createElement('div');
    elementsTitle.addClass('entryBlockHelperTitle textModeElem');
    elementsTitle.innerHTML = '요소';
    blockHelperContent.appendChild(elementsTitle);


    this._elementsContainer =
        Entry.createElement('div', 'entryBlockHelperElementsContainer');

    this._elementsContainer.addClass('entryBlockHelperContent textModeElem');
    blockHelperContent.appendChild(this._elementsContainer);

    //TODO remove
    var box = Entry.createElement('div');
    box.addClass('entryBlockHelperElementsContainer');
    var left = Entry.createElement('div');
    left.innerHTML = 'A';
    left.addClass('elementLeft');
    var right = Entry.createElement('div');
    right.innerHTML = 'adsfdasfdsf<br/>nasdfdsfadfn';
    right.addClass('elementRight');
    box.appendChild(left);
    box.appendChild(right);
    this._elementsContainer.appendChild(box);

    var box = Entry.createElement('div');
    box.addClass('entryBlockHelperElementsContainer');
    var left = Entry.createElement('div');
    left.innerHTML = 'A';
    left.addClass('elementLeft');
    var right = Entry.createElement('div');
    right.innerHTML = 'adsfdasfdsf<br/>nasdfdsfadfn';
    right.addClass('elementRight');
    box.appendChild(left);
    box.appendChild(right);
    this._elementsContainer.appendChild(box);


    var codeMirrorTitle = Entry.createElement('div');
    codeMirrorTitle.addClass('entryBlockHelperTitle textModeElem');
    codeMirrorTitle.innerHTML = '예시 코드';
    blockHelperContent.appendChild(codeMirrorTitle);

    var codeMirrorView = Entry.createElement('div', 'entryBlockHelperCodeMirrorContainer');
    codeMirrorView.addClass('textModeElem');
    blockHelperContent.appendChild(codeMirrorView);

    this.codeMirror = CodeMirror(codeMirrorView, {
        lineNumbers: true,
        value: "",
        mode: {name: "python"},
        indentUnit: 4,
        theme: "default",
        viewportMargin: 10,
        styleActiveLine: false,
        readOnly: true
    });


    this._doc = this.codeMirror.getDoc();
    this._codeMirror = this.codeMirror;

    var codeMirrorDescTitle = Entry.createElement('div');
    codeMirrorDescTitle.addClass('entryBlockHelperTitle textModeElem');
    codeMirrorDescTitle.innerHTML = '예시 설명';
    blockHelperContent.appendChild(codeMirrorDescTitle);

    this._codeMirrorDesc = Entry.createElement('div');
    this._codeMirrorDesc.addClass('entryBlockHelperContent textModeElem');
    this._codeMirrorDesc.innerHTML = '오브젝트를 클릭하면 투명도를 50만큼 줌';
    blockHelperContent.appendChild(this._codeMirrorDesc);

    this._renderView = new Entry.RenderView($(blockHelperBlock), 'LEFT_MOST');
    this.code = new Entry.Code([]);
    this._renderView.changeCode(this.code);

    this.first = true;
};

p.bindWorkspace = function(workspace) {
    if (!workspace) return;

    if (this._blockViewObserver)
        this._blockViewObserver.destroy();

    this.workspace = workspace;
    if (this._renderView)
        this._renderView.workspace = workspace;
    this._blockViewObserver =
        workspace.observe(this, "_updateSelectedBlock", ['selectedBlockView']);
};

/**
 * toggle on block helper
 */
p._updateSelectedBlock = function() {
    var blockView = this.workspace.selectedBlockView;
    if (!blockView || !this.visible || blockView == this._blockView) return;

    var type = blockView.block.type;
    this._blockView = blockView;
    this.renderBlock(type);
};

p.renderBlock = function(type) {
    var description = Lang.Helper[type];
    if (!type || !this.visible || !description || Entry.block[type].isPrimitive) return;

    if (this.first) {
        this.blockHelperContent_.removeClass('entryBlockHelperIntro');
        this.first = false;
    }

    var code = this.code;
    this.code.clear();

    var def = Entry.block[type].def;
    def = def || {type:type};
    this.code.createThread([def]);

    this.code.board.align();
    this.code.board.resize();

    if (this.workspace.getMode() === Entry.Workspace.MODE_VIMBOARD) {
        this._contentView.addClass('textMode');
        var exampleText = "def when_start():\nsdfdasf\nddfdsfkjdajk";
        this._codeMirror.setValue(exampleText);
    } else {
        this._contentView.removeClass('textMode');
        this.blockHelperDescription_.innerHTML = description;
    }

    this._renderView.align();
    this._renderView.setDomSize();
};

p.getView = function() {
    return this.view;
};

p.resize = function() {};
