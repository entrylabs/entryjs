"use strict";

goog.provide("Entry.FieldTrashcan");

Entry.FieldTrashcan = function(board) {
    if (board) this.setBoard(board);

    this.dragBlock = null;
    this.dragBlockObserver = null;
    this.isOver = false;

    if (Entry.windowResized)
        Entry.windowResized.attach(this, this.setPosition);
};

(function(p) {
    p._generateView = function() {
        this.svgGroup = this.board.svg.elem("g");
        this.renderStart();
    };

    p.renderStart = function() {
        var path = Entry.mediaFilePath + 'delete_';
        this.trashcanTop = this.svgGroup.elem("image", {
            href: path + 'cover.png',
            width: 60,
            height: 20
        });

        this.svgGroup.elem("image", {
            href: path + 'body.png',
            y: 20,
            width: 60,
            height: 60
        });
    };

    p.updateDragBlock = function() {
        var block = this.board.dragBlock;
        var observer = this.dragBlockObserver;

        if (observer) {
            observer.destroy();
            this.dragBlockObserver = null;
        }

        if (block) {
            this.dragBlockObserver = block.observe(this, "checkBlock", ["x", "y"]);
        } else {
            if (this.isOver && this.dragBlock) {
                var prevBlock = this.dragBlock.block.getPrevBlock();
                if (!prevBlock) {
                    this.dragBlock.block.doDestroyBelow(true);
                    createjs.Sound.play('entryDelete');
                }
            }
            this.tAnimation(false);
        }
        this.dragBlock = block;
    };

    p.checkBlock = function() {
        var dragBlock = this.dragBlock;
        if (!dragBlock || !dragBlock.block.isDeletable()) return;

        var boardOffset = this.board.offset;
        var position = this.getPosition();
        var trashcanX = position.x + boardOffset.left;
        var trashcanY = position.y + boardOffset.top;

        var mouseX, mouseY;
        var instance = dragBlock.dragInstance;
        if (instance) {
            mouseX = instance.offsetX;
            mouseY = instance.offsetY;
        }
        var isOver = mouseX >= trashcanX &&
            mouseY >= trashcanY;
        this.tAnimation(isOver);
    };

    p.align = function() {
        var position = this.getPosition();
        var transform = "translate(" + position.x + "," + position.y + ")";

        this.svgGroup.attr({
            transform: transform
        });
    };

    p.setPosition = function() {
        if (!this.board) return;
        var svgDom = this.board.svgDom;
        this._x = svgDom.width()-110;
        this._y = svgDom.height()-110;
        this.align();
    };

    p.getPosition = function() {
        return {
            x: this._x,
            y: this._y
        };
    };

    p.tAnimation = function(isOver) {
        if (isOver === this.isOver) return;

        isOver = isOver === undefined ? true : isOver;
        var animation;
        var trashTop = this.trashcanTop;
        if(isOver)
            animation = {
                translateX:15,
                translateY:-25,
                rotateZ:30
            };
        else
            animation = {
                translateX:0,
                translateY:0,
                rotateZ: 0
            };

        $(trashTop).velocity(
            animation, {duration:50}
        );
        this.isOver = isOver;
    };

    p.setBoard = function(board) {
        if (this._dragBlockObserver) this._dragBlockObserver.destroy();
        this.board = board;
        if (!this.svgGroup) this._generateView();

        //control z-index
        var svg = board.svg;
        var firstChild = svg.firstChild;
        if (firstChild) svg.insertBefore(this.svgGroup, firstChild);
        else svg.appendChild(this.svgGroup);

        this._dragBlockObserver = board.observe(this, "updateDragBlock", ["dragBlock"]);
        this.setPosition();
    };

})(Entry.FieldTrashcan.prototype);


