'use strict';
Entry.FieldTrashcan = class FieldTrashcan {
    constructor(board) {
        if (board) this.setBoard(board);
        this.dragBlock = null;
        this.dragBlockObserver = null;
        this.isOver = false;
        if (Entry.windowResized) Entry.windowResized.attach(this, this.setPosition);
    }

    _generateView() {
        this.svgGroup = this.board.svg.elem('g');
        this.renderStart();
        this._addControl();
    }

    renderStart() {
        var path = Entry.mediaFilePath + 'delete_';
        this.svgGroup.elem('image', {
            href: path + 'body.svg',
            y: 19,
            width: 61,
            height: 70,
        });
        this.trashcanTop = this.svgGroup.elem('image', {
            href: path + 'cover.svg',
            width: 60,
            height: 27,
        });
    }

    _addControl() {
        var that = this;
        $(this.svgGroup).bind('mousedown', function(e) {
            if (Entry.Utils.isRightButton(e)) {
                e.stopPropagation();
                $('#entryWorkspaceBoard').css('background', 'white');
            }
        });
    }

    updateDragBlock() {
        var block = this.board.dragBlock;
        var observer = this.dragBlockObserver;

        if (observer) {
            observer.destroy();
            this.dragBlockObserver = null;
        }

        if (block) {
            this.dragBlockObserver = block.observe(this, 'checkBlock', ['x', 'y']);
        } else {
            if (this.isOver && this.dragBlock) {
                var prevBlock = this.dragBlock.block.getPrevBlock();
                if (!prevBlock) {
                    Entry.do('destroyThread', this.dragBlock.block.thread, 'trashcan').isPass(
                        true,
                        true
                    );
                    createjs.Sound.play('entryDelete');
                }
            }
            this.tAnimation(false);
        }
        this.dragBlock = block;
    }

    checkBlock() {
        var dragBlock = this.dragBlock;
        if (!dragBlock || !dragBlock.block.isDeletable()) return;

        var boardOffset = this.board.offset();
        var position = this.getPosition();
        var trashcanX = position.x + boardOffset.left;
        var trashcanY = position.y + boardOffset.top;

        var mouseX, mouseY;
        var instance = dragBlock.dragInstance;
        if (instance) {
            mouseX = instance.offsetX;
            mouseY = instance.offsetY;
        }
        var isOver = mouseX >= trashcanX && mouseY >= trashcanY;
        this.tAnimation(isOver);
    }

    align() {
        var position = this.getPosition();
        var transform = 'translate(' + position.x + ',' + position.y + ')';

        this.svgGroup.attr({
            transform: transform,
        });
    }

    setPosition() {
        if (!this.board) return;
        var svgDom = this.board.svgDom;
        this._x = svgDom.width() - 110;
        this._y = svgDom.height() - 110;
        this.align();
    }

    getPosition() {
        return {
            x: this._x,
            y: this._y,
        };
    }

    tAnimation(isOver) {
        if (isOver === this.isOver) return;

        isOver = isOver === undefined ? true : isOver;
        var animation;
        var trashTop = this.trashcanTop;
        if (isOver) {
            $(trashTop).attr('class', 'trashcanOpen');
        } else {
            $(trashTop).attr('class', 'trashcanClose');
        }
        
        this.isOver = isOver;
    }

    setBoard(board) {
        if (this._dragBlockObserver) this._dragBlockObserver.destroy();
        this.board = board;
        if (!this.svgGroup) this._generateView();

        //control z-index
        var svg = board.svg;
        var firstChild = svg.firstChild;
        if (firstChild) svg.insertBefore(this.svgGroup, firstChild);
        else svg.appendChild(this.svgGroup);

        this._dragBlockObserver = board.observe(this, 'updateDragBlock', ['dragBlock']);
        this.svgGroup.attr({
            filter: 'url(#entryTrashcanFilter_' + board.suffix + ')',
        });
        this.setPosition();
    }
};
