'use strict';

Entry.FieldBlock = class FieldBlock extends Entry.Field {
    constructor(content, blockView, index, mode, contentIndex) {
        super(content, blockView, index, mode, contentIndex);
        Entry.Model(this, false);
        this._blockView = blockView;
        this._block = blockView.block;
        this._valueBlock = null;
        this._oldPrimitiveValue = null;

        this.box = new Entry.BoxModel();
        this.changeEvent = new Entry.Event(this);

        this._index = index;
        this.contentIndex = contentIndex;
        this._content = content;

        this.acceptType = content.accept;
        this.defaultType = content.defaultType;
        this._restoreCurrent = content.restore;

        this.view = this;

        this.svgGroup = null;

        this._position = content.position;

        this.observe(this, '_updateBG', ['magneting'], false);

        this.renderStart(this.getBoard(), mode);

        this.schema = {
            magneting: false,
        };
        this.calcHeight = this.calcWH;
        this.doSeparate = this.separate;
    }

    getBoard() {
        return _.result(this._blockView, 'getBoard');
    }

    getBlockType = () => 'field';

    getBlockList(excludePrimitive, type) {
        const { value } = this;
        try {
            return _.chain(value.getBlockList(excludePrimitive, type))
                .flatten()
                .compact()
                .value();
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    stringify(excludeData, isNew) {
        try {
            return JSON.stringify(this.toJSON(isNew, undefined, excludeData));
        } catch (e) {
            console.error(e);
            return '';
        }
    }

    toJSON(isNew, index, excludeData, option) {
        try {
            const { value } = this;
            return [value.toJSON(isNew, excludeData, option)];
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    renderStart(board, mode, renderMode, isReDraw) {
        if (!this.svgGroup) {
            this.svgGroup = this._blockView.contentSvgGroup.elem('g');
        }

        this.renderMode = !_.isUndefined(mode) ? mode : this._blockView.renderMode;

        this.view = this;
        this._nextGroup = this.svgGroup;

        this.updateValueBlock(this.getValue());

        const valueBlockView = this._valueBlock.view;
        valueBlockView.renderByMode(this.renderMode, isReDraw);

        if (this.getBoard().constructor !== Entry.Board) {
            valueBlockView.removeControl();
        }

        this.box.observe(this._blockView, 'dAlignContent', ['width', 'height'], false);
    }

    align(x, y, animate = true) {
        const svgGroup = this.svgGroup;
        if (this._position) {
            if (this._position.x) {
                x = this._position.x;
            }
            if (this._position.y) {
                y = this._position.y;
            }
        }

        const blockView = _.result(this._valueBlock, 'view');

        if (blockView) {
            y = blockView.height * -0.5;
        }

        if (!(x || y)) {
            svgGroup.removeAttr('transform');
        } else {
            const transform = `translate(${x},${y})`;
            if (animate) {
                svgGroup.animate(
                    {
                        transform,
                    },
                    300,
                    mina.easeinout
                );
            } else {
                svgGroup.attr({
                    transform,
                });
            }
        }

        x = Math.round(x * 100) / 100;
        y = Math.round(y * 100) / 100;

        const box = this.box;
        if (box.x === x && box.y === y) {
            return;
        }

        box.set({ x, y });
    }

    calcWH() {
        const block = this._valueBlock;
        const box = this.box;
        const oldWidth = box.width;
        const oldHeight = box.height;
        let newWidth;
        let newHeight;
        const blockView = block && block.view;
        if (blockView) {
            newWidth = blockView.width;
            newHeight = blockView.height;
        } else {
            newWidth = 15;
            newHeight = 20;
        }

        if (newWidth !== oldWidth) {
            box.set({ width: newWidth });
        }

        if (newHeight !== oldHeight) {
            box.set({ height: newHeight });
        }
    }

    destroy() {
        _.result(this._valueBlock, 'destroyView');
    }

    inspectBlock() {
        let blockType = null;
        if (this._originBlock) {
            blockType = this._originBlock.type;
            delete this._originBlock;
        } else if (this._content.defaultType) {
            blockType = this._content.defaultType;
        } else {
            switch (this.acceptType.toLowerCase()) {
                case 'boolean':
                    blockType = 'True';
                    break;
                case 'string':
                    blockType = 'text';
                    break;
                case 'number':
                    blockType = 'number';
                    break;
                case 'param':
                default:
                    blockType = 'function_field_label';
                    break;
            }
        }

        return this._createBlockByType(blockType);
    }

    _setValueBlock(block) {
        if (this._restoreCurrent) {
            this._originBlock = this._valueBlock;
        }

        block = block || this.inspectBlock();

        this._valueBlock = block;
        this.setValue(block);

        block.setThread(this);
        this.view.setParent(this);

        return this._valueBlock;
    }

    getValueBlock() {
        return this._valueBlock;
    }

    updateValueBlock(block) {
        if (!(block instanceof Entry.Block)) {
            block = undefined;
        }

        block = this._ensureBlock(block);

        if (block && block === this._valueBlock) {
            return this.calcWH();
        }

        this._destroyObservers();

        const { view } = this._setValueBlock(block);
        view.bindPrev(this);
        this._blockView.alignContent();
        this._posObserver = view.observe(this, 'updateValueBlock', ['x', 'y'], false);
        this._sizeObserver = view.observe(this, 'calcWH', ['width', 'height']);
    }

    _destroyObservers() {
        const _destroyFunc = _.partial(_.result, _, 'destroy');
        _destroyFunc(this._sizeObserver);
        _destroyFunc(this._posObserver);
    }

    getPrevBlock(block) {
        if (this._valueBlock === block) {
            return this;
        } else {
            return null;
        }
    }

    getNextBlock() {
        return null;
    }

    requestAbsoluteCoordinate(blockView) {
        const board = this.getBoard();
        const { scale = 1 } = board || {};
        var blockView = this._blockView;
        const contentPos = blockView.contentPos;
        const pos = blockView.getAbsoluteCoordinate();
        pos.x += (this.box.x + contentPos.x) * scale;
        pos.y += this.box.y + contentPos.y;
        return pos;
    }

    requestPartHeight(blockView, forAll) {
        return blockView ? (blockView.magnet.next ? blockView.magnet.next.y : blockView.height) : 0;
    }

    getCount() {
        return 0;
    }

    dominate() {
        this._blockView.dominate();
    }

    isGlobal() {
        return false;
    }

    separate(block) {
        this.getCode().createThread([block]);
        this.calcWH();
        this.changeEvent.notify();
    }

    getCode() {
        return this._block.thread.getCode();
    }

    cut(block) {
        if (this._valueBlock === block) {
            return [block];
        }
        return null;
    }

    replace(block) {
        if (typeof block === 'string') {
            block = this._createBlockByType(block);
        }

        const valueBlock = this._valueBlock;

        if (Entry.block[valueBlock.type].isPrimitive) {
            valueBlock.doNotSplice = true;
            this._oldPrimitiveValue = valueBlock.getParam(0);
            valueBlock.destroy();
        } else if (this.acceptType === 'param') {
            this._destroyObservers();
            valueBlock.view._toGlobalCoordinate();
            block.getTerminateOutputBlock().view._contents[1].replace(valueBlock);
        } else {
            this._destroyObservers();
            valueBlock.view._toGlobalCoordinate();

            Entry.do('separateBlockByCommand', valueBlock).isPass(true);
            const board = this.getBoard();
            const { scale = 1 } = board || {};
            valueBlock.view.bumpAway(30 * scale, 150);
        }
        this.updateValueBlock(block);
        block.view._toLocalCoordinate(this);
        this.calcWH();
        this.changeEvent.notify();
    }

    setParent(parent) {
        this._parent = parent;
    }

    getParent() {
        return this._parent;
    }

    get parent() {
        return this._parent;
    }

    _createBlockByType(blockType) {
        const board = this._blockView.getBoard();
        const selected = _.result(board.workspace, 'selectedBlockView');
        let isFromUserAction = false;
        if (selected) {
            isFromUserAction = !!_.result(selected, 'dragInstance');
        }

        const block = new Entry.Block(
            {
                type: blockType,
                defaultType: this.defaultType,
                params: [isFromUserAction ? undefined : this._oldPrimitiveValue],
                copyable: blockType !== 'function_field_label',
            },
            this
        );

        block.createView(board, this.renderMode);

        delete this._oldPrimitiveValue;
        return block;
    }

    _updateBG() {
        if (this.magneting) {
            this._bg = this.svgGroup.elem('path', {
                d: 'm 8,12 l -4,0 -2,-2 0,-3 3,0 1,-1 0,-12 -1,-1 -3,0 0,-3 2,-2 l 4,0 z',
                fill: '#fff',
                stroke: '#fff',
                'fill-opacity': 0.7,
                transform: 'translate(0,12)',
            });
        } else {
            _.result(this._bg, 'remove');
            delete this._bg;
        }
    }

    getThread() {
        return this;
    }

    getParentThread() {
        return this._block.getThread();
    }

    pointer(pointer = []) {
        return this._block.pointer([Entry.PARAM, this._index, ...pointer]);
    }

    targetPointer(pointer = []) {
        const _pointer = this._block.pointer([Entry.PARAM, this._index, ...pointer]);
        return _pointer;
    }

    isParamBlockType() {
        return true;
    }

    //check block schema and view
    _ensureBlock(block) {
        if (!block) {
            return;
        }

        if (block.constructor !== Entry.Block) {
            block = new Entry.Block(block, this._block.thread);
        }

        //if block schema is not present
        //and can't load schema, then destroy and return undefined
        if (!block.getSchema()) {
            this._destroyObservers();
            block.destroy();
            return;
        }

        block.defaultType = this.defaultType;

        if (!block.view) {
            block.setThread(this);
            block.createView(this.getBoard(), this.renderMode);
            this.view.setParent(this);
        }

        return block;
    }
};
