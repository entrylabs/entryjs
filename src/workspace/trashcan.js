"use strict";

goog.provide("Entry.FieldTrashcan");

Entry.FieldTrashcan = function(board) {
    this.board = board;
    this.svgGroup = board.snap.group();

    var svgDom = board.svgDom;
    this._x = svgDom.width()-110;
    this._y = svgDom.height()-110;
    this.renderStart();
    this.align(this._x, this._y,false);


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
        if (this._x) x = this._x;
        if (this._y) y = this._y;

        var transform = "t" + x + " " + y;

        this.svgGroup.attr({
            transform: transform
        });
    };

    p.getPosition = function() {
        return {
            x: this._x,
            y: this._y
        };
    };
    p.tAnimation = function(bool) {
        var trashTop = this.trashcanTop;
        
        if(bool) {        
            trashTop.animate({
                transform: "t5 -20 r30"}, 50);
        } else { 
            trashTop.animate({
                transform: "r0"}, 50);
        }
    };
})(Entry.FieldTrashcan.prototype);
