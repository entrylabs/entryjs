"use strict";

goog.provide("Entry.FieldTrashcan");

Entry.FieldTrashcan = function(board) {
    this.board = board;
    this.svgGroup = board.svg.elem("g");

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
        var path = Entry.mediaFilePath + 'delete_';
        this.trashcanTop = this.svgGroup.elem("image", {
            href: path + 'cover.png',
            width: 60,
            height: 20
        });

        this.trashcanTop = this.svgGroup.elem("image", {
            href: path + 'body.png',
            y: 20,
            width: 60,
            height: 60
        });

        //var filter = this.svgGroup.filter(Snap.filter.shadow(1,1,2));
        //this.svgGroup.attr({filter: filter});
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
                this.dragBlock.block.doDestroy(true);
                createjs.Sound.play('entryDelete');
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
        var trashTop = this.trashcanTop;
        if(isOver) {
            trashTop.animate({
                transform: "translate(5, -20) rotate(30)"}, 50);
        } else {
            trashTop.animate({
                transform: "rotate(0)"}, 50);
        }
        this.isOver = isOver;
    };
})(Entry.FieldTrashcan.prototype);


