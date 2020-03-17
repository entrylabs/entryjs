'use strict';

Entry.RenderView = class RenderView {
    schema = {
        code: null,
        dragBlock: null,
        closeBlock: null,
        selectedBlockView: null,
    };

    constructor(dom, align, scale, parserType) {
        this._align = align || 'CENTER';

        if (typeof dom === 'string') {
            dom = $(`#${dom}`);
        } else {
            dom = $(dom);
        }

        if (dom.prop('tagName') !== 'DIV') {
            return console.error('Dom is not div element');
        }

        this.view = dom;
        this.viewOnly = true;
        this.suffix = 'renderView';
        this._scale = scale === undefined ? 1 : scale;

        this._parserType = parserType;

        this.visible = true;
        this.disableMouseEvent = true;
        this._svgId = `renderView_${new Date().getTime()}`;
        this._generateView();

        this.offset = this.svgDom.offset();
        this._minBlockOffsetX = 0;
        this._setSize();

        this.svg = Entry.SVG(this._svgId, this.svgDom[0]);
        Entry.Utils.addFilters(this.svg, this.suffix, true);

        if (this.svg) {
            this.svgGroup = this.svg.elem('g');

            this.svgThreadGroup = this.svgGroup.elem('g');
            this.svgThreadGroup.board = this;

            this.svgBlockGroup = this.svgGroup.elem('g');
            this.svgBlockGroup.board = this;

            this.svgCommentGroup = this.svgGroup.elem('g');
            this.svgCommentGroup.board = this;
        }
    }

    _generateView() {
        const parent = this.view;

        this.renderViewContainer = Entry.Dom('div', {
            class: 'renderViewContainer',
            parent,
        });

        this.svgDom = Entry.Dom(
            $(
                `<svg id="${
                    this._svgId
                }" class="renderView" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>`
            ),
            { parent: this.renderViewContainer }
        );
    }

    changeCode(code, resizeImmediately) {
        if (!(code instanceof Entry.Code)) {
            return console.error('You must inject code instance');
        }
        this.code = code;

        if (!this.svg) {
            this.svg = Entry.SVG(this._svgId, this.svgDom[0]);
            this.svgGroup = this.svg.elem('g');

            this.svgThreadGroup = this.svgGroup.elem('g');
            this.svgThreadGroup.board = this;

            this.svgBlockGroup = this.svgGroup.elem('g');
            this.svgBlockGroup.board = this;

            this.svgCommentGroup = this.svgGroup.elem('g');
            this.svgCommentGroup.board = this;
        }

        code.createView(this);
        this.align();
        this.resize(resizeImmediately);
    }

    align() {
        const threads = this.code.getThreads();
        if (!threads || threads.length === 0) {
            return;
        }
        const vPadding = 15;
        let marginFromTop = 0;
        const hPadding = this._getHorizontalPadding();

        for (let i = 0, len = threads.length; i < len; i++) {
            const thread = threads[i];
            const block = thread.getFirstBlock();
            const blockView = block.view;

            const height = blockView.svgGroup.getBBox().height;
            let xPos = 0;
            const extensions = $(blockView.svgGroup).find('.extension');
            if (extensions) {
                for (let j = 0; j < extensions.length; j++) {
                    const ext = extensions[j];
                    const currentXpos = parseFloat(ext.getAttribute('x'));
                    xPos = Math.min(xPos, currentXpos);
                }
            }
            this._minBlockOffsetX = Math.min(this._minBlockOffsetX, blockView.offsetX);
            blockView.moveTo(
                hPadding - xPos - blockView.offsetX,
                marginFromTop - blockView.offsetY,
                false
            );
            marginFromTop += height + vPadding;
        }
        this._setSize();
    }

    hide() {
        this.view.addClass('entryRemove');
    }

    show() {
        this.view.removeClass('entryRemove');
    }

    _setSize() {
        if (this.svgDom) {
            this._svgWidth = this.svgDom.width();
            this.offset = this.svgDom.offset();
        }
        if (this.svgGroup) {
            this._bBox = this.svgGroup.getBBox();
        }
    }

    bindCodeView(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgCommentGroup = codeView.svgCommentGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
        this.svgGroup.appendChild(this.svgCommentGroup);
    }

    resize(isImmediate) {
        if (!this.svg || !this._bBox) {
            return;
        }

        if (isImmediate) {
            run.call(this);
        } else {
            setTimeout(
                function() {
                    run.call(this);
                }.bind(this),
                0
            );
        }

        function run() {
            this._setSize();
            const width = Math.round(this._bBox.width);
            const height = Math.round(this._bBox.height);
            //svg is not on the screen
            if (width === 0 || height === 0) {
                return;
            }

            $(this.svg).css({
                width: width + this._getHorizontalPadding() - this._minBlockOffsetX + 5,
                height: height + 5,
            });

            //double check
            setTimeout(
                function() {
                    const bBox = this.svgGroup.getBBox();
                    if (Math.round(bBox.width) !== width || Math.round(bBox.height) !== height) {
                        this.resize();
                    }
                }.bind(this),
                1000
            );
        }
    }

    setDomSize(isImmediate) {
        if (this.svgBlockGroup) {
            this.svgBlockGroup.attr('transform', 'scale(1)');
        }
        this.code.view.reDraw();
        this.align();
        this.resize(isImmediate);
        if (this._scale !== 1) {
            window.setTimeout(
                function() {
                    this.svgBlockGroup.attr(
                        'transform',
                        'scale(%scale)'.replace('%scale', this._scale)
                    );
                    this.align();
                    this.resize();
                }.bind(this),
                0
            );
        }
    }

    _getHorizontalPadding() {
        const marginMap = {
            LEFT: 20,
            LEFT_MOST: 0,
        };
        const ret = marginMap[this._align];

        return ret !== undefined ? ret : this.svgDom.width() / 2;
    }

    getBlockSyntax(block, renderMode) {
        let syntax = null;
        if (renderMode === 2) {
            if (!this._parser) {
                this._parser = new Entry.Parser(null, null);
            }
            this._parser.setParser(1, this._parserType);
            if (this._parser._execParser) {
                syntax = this._parser._execParser.searchSyntax(block);
            }
        }

        return syntax;
    }

    setParserType(parserType) {
        this._parserType = parserType;
    }
};
