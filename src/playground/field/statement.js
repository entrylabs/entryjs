/*
 */
'use strict';

/*
 *
 */
Entry.FieldStatement = function(content, blockView, index) {
    Entry.Model(this, false);

    this._blockView = blockView;
    this.block = blockView.block;

    this.view = this;

    this._index = index;

    this.acceptType = content.accept;

    this.svgGroup = null;
    this.commentGroup = null;
    this.statementSvgGroup = null;
    this.statementCommentGroup = null;
    this._thread = null;

    this._position = content.position;

    this._events = [];

    this.observe(blockView, 'alignContent', ['height'], false);
    this.observe(this, '_updateBG', ['magneting'], false);

    this.renderStart(blockView.getBoard());
};

(function(p) {
    p.schema = {
        x: 0,
        y: 0,
        width: 100,
        height: 31,
        magneting: false,
    };

    p.magnet = { next: { x: 0, y: 0 } };

    p.renderStart = function(board) {
        this.svgGroup = this._blockView.statementSvgGroup.elem('g');
        this.statementSvgGroup = this.svgGroup.elem('g');
        this._nextGroup = this.statementSvgGroup;
        if (this._blockView.statementCommentGroup) {
            this.commentGroup = this._blockView.statementCommentGroup.elem('g');
            this.statementCommentGroup = this.commentGroup.elem('g');
            this._nextCommentGroup = this.statementCommentGroup;
        }
        this._initThread(board);
        this._board = board;
    };

    p._initThread = function(board) {
        const thread = this.getValue();
        this._thread = thread;
        thread.createView(board);
        thread.view.setParent(this);
        const firstBlock = thread.getFirstBlock();
        if (firstBlock) {
            firstBlock.view._toLocalCoordinate(this);
            this.firstBlock = firstBlock;
        }

        const event = thread.changeEvent;

        const calcEvent = event.attach(this, this.calcHeight);
        const checkTopEvent = event.attach(this, this.checkTopBlock);

        this._events.push(calcEvent);
        this._events.push(checkTopEvent);

        this.calcHeight();
    };

    p.align = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        const svgGroup = this.svgGroup;
        const commentGroup = this.commentGroup;
        if (this._position) {
            if (this._position.x) {
                x = this._position.x;
            }
            if (this._position.y) {
                y = this._position.y;
            }
        }

        const transform = `translate(${x},${y})`;

        if (this.x !== x || this.y !== y) {
            this.set({ x, y });
        }

        if (animate) {
            svgGroup.animate(
                {
                    transform,
                },
                300,
                mina.easeinout
            );
            if (commentGroup) {
                commentGroup.animate(
                    {
                        transform,
                    },
                    300,
                    mina.easeinout
                );
            }
        } else {
            svgGroup.attr({
                transform,
            });
            if (commentGroup) {
                commentGroup.attr({
                    transform,
                });
            }
        }
    };

    p.calcHeight = function() {
        const height = this._thread.view.requestPartHeight(null);
        if (this.height === height) {
            return;
        }
        this.set({ height });
    };

    p.getValue = function() {
        return this.block.statements[this._index];
    };

    p.requestAbsoluteCoordinate = function() {
        const { scale = 1 } = this._board || {};
        const pos = this._blockView.getAbsoluteCoordinate();
        pos.x += this.x * scale;
        pos.y += this.y * scale;
        return pos;
    };

    p.dominate = function() {
        this._blockView.dominate();
    };

    p.destroy = function() {
        while (this._events.length) {
            this._events.pop().destroy();
        }
    };

    p._updateBG = function() {
        const dragBlock = this._board.dragBlock;
        if (!dragBlock || !dragBlock.dragInstance) {
            return;
        }

        const blockView = this;
        const magneting = blockView.magneting;
        const { scale = 1 } = this._board || {};

        if (magneting) {
            const shadow = dragBlock.getShadow();
            const pos = this.requestAbsoluteCoordinate();
            const transform = `translate(${pos.x / scale}, ${pos.y / scale})`;
            $(shadow).attr({
                transform,
                display: 'block',
            });
            this._clonedShadow = shadow;

            if (blockView.background) {
                blockView.background.remove();
                blockView.nextBackground.remove();
                delete blockView.background;
                delete blockView.nextBackground;
            }
            const height = dragBlock.getBelowHeight();

            this.statementSvgGroup.attr({
                transform: `translate(0,${height})`,
            });
            this.statementCommentGroup.attr({
                transform: `translate(0,${height})`,
            });

            this.set({ height: this.height + height });
        } else {
            if (this._clonedShadow) {
                this._clonedShadow.attr({ display: 'none' });
                delete this._clonedShadow;
            }

            const height = blockView.originalHeight;
            if (height !== undefined) {
                if (blockView.background) {
                    blockView.background.remove();
                    blockView.nextBackground.remove();
                    delete blockView.background;
                    delete blockView.nextBackground;
                }
                delete blockView.originalHeight;
            }
            this.statementSvgGroup.attr({
                transform: 'translate(0,0)',
            });
            this.statementCommentGroup.attr({
                transform: 'translate(0,0)',
            });
            this.calcHeight();
        }
        const changeEvent = blockView.block.thread.changeEvent;
        if (changeEvent) {
            changeEvent.notify();
        }
    };

    p.insertTopBlock = function(newBlock) {
        if (this._posObserver) {
            this._posObserver.destroy();
        }

        const block = this.firstBlock;
        this.firstBlock = newBlock;
        if (newBlock) {
            newBlock.doInsert(this._thread);
        }
        return block;
    };

    p.getNextBlock = function() {
        return this.firstBlock;
    };

    p.checkTopBlock = function() {
        const firstBlock = this._thread.getFirstBlock();
        if (firstBlock && this.firstBlock !== firstBlock) {
            this.firstBlock = firstBlock;
            firstBlock.view.bindPrev(this);
            firstBlock._updatePos();
        } else if (!firstBlock) {
            this.firstBlock = null;
        }
    };

    p.pointer = function(pointer) {
        pointer = pointer || [];
        pointer.unshift(this._index);
        return this.block.pointer(pointer);
    };

    p.isParamBlockType = function() {
        return false;
    };
})(Entry.FieldStatement.prototype);
