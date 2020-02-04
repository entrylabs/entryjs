import { debounce } from 'lodash';

class Helper {
    constructor() {
        this.visible = false;
        Entry.addEventListener('workspaceChangeMode', () => {
            if (this._blockView) {
                this.renderBlock(this._blockView.type);
            }
        });
        this.resize = debounce(this.resize, 300);
    }

    generateView(parentView) {
        if (this.parentView_) {
            return;
        }
        /** @type {!Element} parent view */
        this.parentView_ = parentView;
        const helper = this;
        helper.blockHelpData = EntryStatic.blockInfo;
        const blockHelperWrapper = Entry.createElement('div', 'entryBlockHelperWorkspaceWrapper');
        const blockHelperView = Entry.createElement('div', 'entryBlockHelperWorkspace');
        blockHelperWrapper.appendChild(blockHelperView);
        this.view = blockHelperWrapper;
        if (Entry.isForLecture) {
            blockHelperView.addClass('lecture');
        }
        helper.parentView_.appendChild(blockHelperWrapper);

        const blockHelperContent = Entry.createElement('div', 'entryBlockHelperContentWorkspace');
        this._contentView = blockHelperContent;

        const commandTitle = Entry.createElement('div');
        commandTitle.addClass('entryBlockHelperTitle textModeElem');
        commandTitle.innerHTML = 'Command';
        blockHelperContent.appendChild(commandTitle);

        blockHelperContent.addClass('entryBlockHelperIntro');
        if (Entry.isForLecture) {
            blockHelperContent.addClass('lecture');
        }
        blockHelperView.appendChild(blockHelperContent);
        helper.blockHelperContent_ = blockHelperContent;
        helper.blockHelperView_ = blockHelperView;

        const blockHelperBlock = Entry.createElement('div', 'entryBlockHelperBlockWorkspace');
        helper.blockHelperContent_.appendChild(blockHelperBlock);

        const descTitle = Entry.createElement('div');
        descTitle.addClass('entryBlockHelperTitle textModeElem');
        descTitle.innerHTML = 'Explanation';
        blockHelperContent.appendChild(descTitle);

        const blockHelperDescription = Entry.createElement(
            'div',
            'entryBlockHelperDescriptionWorkspace'
        );
        blockHelperDescription.addClass('entryBlockHelperContent selectAble');
        helper.blockHelperContent_.appendChild(blockHelperDescription);
        blockHelperDescription.innerHTML = Lang.Helper.Block_click_msg;
        this.blockHelperDescription_ = blockHelperDescription;

        const elementsTitle = Entry.createElement('div');
        elementsTitle.addClass('entryBlockHelperTitle textModeElem');
        elementsTitle.innerHTML = 'Element';
        blockHelperContent.appendChild(elementsTitle);
        this._elementsTitle = elementsTitle;

        this._elementsContainer = Entry.createElement('div', 'entryBlockHelperElementsContainer');

        this._elementsContainer.addClass('entryBlockHelperContent textModeElem selectAble');
        blockHelperContent.appendChild(this._elementsContainer);

        if (typeof CodeMirror !== 'undefined') {
            const codeMirrorTitle = Entry.createElement('div');
            codeMirrorTitle.addClass('entryBlockHelperTitle textModeElem');
            codeMirrorTitle.innerHTML = 'Example Code';
            blockHelperContent.appendChild(codeMirrorTitle);

            const codeMirrorView = Entry.createElement(
                'div',
                'entryBlockHelperCodeMirrorContainer'
            );
            codeMirrorView.addClass('textModeElem');
            blockHelperContent.appendChild(codeMirrorView);

            this.codeMirror = CodeMirror(codeMirrorView, {
                lineNumbers: true,
                value: '',
                mode: { name: 'python' },
                indentUnit: 4,
                theme: 'default',
                viewportMargin: 10,
                styleActiveLine: false,
                readOnly: true,
            });

            this._doc = this.codeMirror.getDoc();
            this._codeMirror = this.codeMirror;

            const codeMirrorDescTitle = Entry.createElement('div');
            codeMirrorDescTitle.addClass('entryBlockHelperTitle textModeElem');
            codeMirrorDescTitle.innerHTML = 'Example Explanation';
            blockHelperContent.appendChild(codeMirrorDescTitle);

            this._codeMirrorDesc = Entry.createElement('div');
            this._codeMirrorDesc.addClass('entryBlockHelperContent textModeElem selectAble');
            blockHelperContent.appendChild(this._codeMirrorDesc);
        }

        this._renderView = new Entry.RenderView($(blockHelperBlock), 'LEFT_MOST');
        this.code = new Entry.Code([]);
        this.code.isFor = 'blockHelper';
        this._renderView.changeCode(this.code);

        this.first = true;
    }

    bindWorkspace(workspace) {
        if (!workspace) {
            return;
        }

        if (this._blockViewObserver) {
            this._blockViewObserver.destroy();
        }

        this.workspace = workspace;
        if (this._renderView) {
            this._renderView.workspace = workspace;
        }
        this._blockViewObserver = workspace.observe(this, '_updateSelectedBlock', [
            'selectedBlockView',
        ]);
    }

    renderBlock(type) {
        const description = Lang.Helper[type];
        if (!type || !this.visible || !description || Entry.block[type].isPrimitive) {
            return;
        }

        if (this.first) {
            this.blockHelperContent_.removeClass('entryBlockHelperIntro');
            this.first = false;
        }

        const code = this.code;
        code.clear();
        let def = Entry.block[type].def || { type };

        if (this.workspace.getMode() === Entry.Workspace.MODE_VIMBOARD) {
            this._contentView.addClass('textMode');
            this.blockHelperDescription_.innerHTML = Lang.PythonHelper[`${type}_desc`];

            let elements = Lang.PythonHelper[`${type}_elements`];
            this._elementsContainer.innerHTML = '';
            if (elements) {
                this._elementsTitle.removeClass('entryRemove');
                elements = elements.split('%next');
                while (elements.length) {
                    (function(elems) {
                        const contents = elems.split('-- ');
                        const box = Entry.createElement('div');
                        box.addClass('entryBlockHelperElementsContainer');
                        const left = Entry.createElement('div');

                        left.innerHTML = contents[0];
                        left.addClass('elementLeft');

                        const right = Entry.createElement('div');
                        right.addClass('elementRight');
                        right.innerHTML = contents[1];
                        box.appendChild(left);
                        box.appendChild(right);
                        this._elementsContainer.appendChild(box);
                    }.bind(this)(elements.shift()));
                }
            } else {
                this._elementsTitle.addClass('entryRemove');
            }
            this._codeMirrorDesc.innerHTML = Lang.PythonHelper[`${type}_exampleDesc`];

            const exampleCode = Lang.PythonHelper[`${type}_exampleCode`];
            this._codeMirror.setValue(exampleCode);
            this.codeMirror.refresh();
            def = Entry.block[type].pyHelpDef || def;
        } else {
            this._contentView.removeClass('textMode');
            this.blockHelperDescription_.innerHTML = description;
        }

        code.createThread([def]);

        code.board.align();
        code.board.resize();

        this._renderView.align();
        this._renderView.setDomSize();
    }

    getView() {
        return this.view;
    }

    resize() {
        this.codeMirror && this.codeMirror.refresh();
    }

    _updateSelectedBlock() {
        const blockView = this.workspace.selectedBlockView;
        // noinspection EqualityComparisonWithCoercionJS
        if (!blockView || !this.visible || blockView == this._blockView) {
            return;
        }

        const type = blockView.block.type;
        this._blockView = blockView;
        this.renderBlock(type);
    }
}

Entry.Helper = Helper;
