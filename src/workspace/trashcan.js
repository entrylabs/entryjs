"use strict";

goog.provide("Entry.FieldTrashcan");

Entry.FieldTrashcan = function(board) {
    this.board = board;
    this.svgGroup = board.snap.group();

    var svgDom = board.svgDom;
    this._positionX = svgDom.width()-110;
    this._positionY = svgDom.height()-110;
    this.renderStart();
    this.align(this._positionX,this._positionY,false);


    if (Entry.windowResized)
        Entry.windowResized.attach(this, this.align);
};

(function(p) {
    p.renderStart = function() {
        var path = '/img/assets/delete_';
        this.trashcanTop = this.svgGroup.image (
            path + 'cover.png', 0, 0, 80, 20);

        this.trashcan = this.svgGroup.image (
            path + 'body.png', 0, 20, 80, 80);
    };

    p.align = function(x, y, animate) {
        if (this._positionX) x = this._positionX;
        if (this._positionY) y = this._positionY;

        var transform = "t" + x + " " + y;

        this.svgGroup.attr({
            transform: transform
        });

        var trashTop = this.trashcanTop;
        if(animate)
            trashTop.animate({
                transform: "t5 -20 r30"}, 50);
        else
            trashTop.animate({
                transform: "r0"}, 50);
    };
})(Entry.FieldTrashcan.prototype);
