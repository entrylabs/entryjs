"use strict";

goog.provide("Entry.FieldTrashcan");

Entry.FieldTrashcan = function(board) {
    this.board = board;
    this.svgGroup = board.snap.group();

    this.renderStart();
    this.dragBlock = null;
    this.dragBlockObserver = null;
    this.isOver = false;

    board.observe(this, "updateDragBlock", ["dragBlock"]);

    this.setPosition();

    if (Entry.windowResized)
        Entry.windowResized.attach(this, this.setPosition);
};

(function(p) {
    p.renderStart = function() {
        var path = '/img/assets/delete_';
        this.trashcanTop = this.svgGroup.image (
            path + 'cover.png', 0, 0, 80, 20);

        this.trashcan = this.svgGroup.image (
            path + 'body.png', 0, 20, 80, 80);
    };

    p.updateDragBlock = function() {
        var block = this.board.dragBlock;
        if (block) {
            this.dragBlockObserver = block.observe(this, "checkBlock", ["x", "y"]);
        } else {
            if (this.dragBlockObserver)
                this.dragBlockObserver.destroy();
            if (this.dragBlock && this.isOver)
                this.dragBlock.block.getThread().destroy(true);
            this.tAnimation(false);
        }
        this.dragBlock = block;
    };

    p.checkBlock = function() {
        var boardOffset = this.board.offset;
        var position = this.getPosition();
        var trashcanX = position.x + boardOffset.left;
        var trashcanY = position.y + boardOffset.top;

        var mouseX, mouseY;
        var dragBlock = this.dragBlock;
        var instance = dragBlock.dragInstance;
        if (instance) {
            mouseX = instance.offsetX;
            mouseY = instance.offsetY;
        } else {
            mouseX = dragBlock.x + boardOffset.left;
            mouseY = dragBlock.y + boardOffset.top;
        }

        var isOver = mouseX >= trashcanX &&
            mouseY >= trashcanY;
        this.tAnimation(this.isOver);
    };

    p.align = function() {
        var position = this.getPosition();
        var transform = "t" + position.x + " " + position.y;

        this.svgGroup.attr({
            transform: transform
        });
    };

    p.setPosition = function() {
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
        if (isOver === this.isOver)
            return;
        isOver = isOver === undefined ? true : isOver;
        var trashTop = this.trashcanTop;
        if(isOver) {
            trashTop.animate({
                transform: "t5 -20 r30"}, 50);
        } else {
            trashTop.animate({
                transform: "r0"}, 50);
        }
        this.isOver = isOver
    };
})(Entry.FieldTrashcan.prototype);


