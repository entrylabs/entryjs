/*
 */
"use strict";

goog.provide("Entry.FieldTrashcan");

/*
 *
 */
Entry.FieldTrashcan = function(board) {
    this.board = board;
    this.svgGroup = board.snap.group();

    this._positionX = board.svgDom.width()-110;
    this._positionY = board.svgDom.height()-110;    
    this.renderStart();
    this.align(this._positionX,this._positionY ,false);
};

(function(p) {
    p.renderStart = function() {
        // this.rect = this.svgGroup.rect(this._positionx, this._positiony, 100, 100);
        // this.rect.attr({
        //     fill: "transparent"
        // });

        // var trashcanTop = Snap(100,100);
        // var trashTop = trashcanTop.image('/img/assets/delete_body.png',0,0,50,50);
        // var path = trashcanTop.path("M0,0h200v200h-200z").attr("fill", trashTop);
        this.trashcanTop = this.svgGroup.image (
            '/img/assets/delete_cover.png',
            0,
            0,
            80,
            20
            );
        // this.trashcanTop.attr({
        //     fill: 'none'
        // });
        this.trashcan = this.svgGroup.image (
            '/img/assets/delete_body.png',
            0,
            20,
            80,
            80
            );

        // function animateTrashCan() {
        //     this.trashcanTop.stop().animate(
        //             { transform: 'r90,0,0'},
        //             1000
        //             // function() {
        //             //     this.trashcanTop.animate(
        //             //         { transform: 'r-90,0,0'},
        //             //         1000
        //             //         );}
        //         );
        // };
        // this.trashcan.attr({
        //     fill: 'none'
        // });
        // this.svgGroup.g(this.trashcanTop , this.trashcan);
        

        // this._imgElement = this.svgGroup.image(
        //     this._imgUrl,
        //     this._size * -1,
        //     this._size * -1,
        //     this._size * 2,
        //     this._size * 2
        // );

        // var path = "m 0,-%s a %s,%s 0 1,1 -0.1,0 z"
        //     .replace(/%s/gi, this._size);
        // this._path = this.svgGroup.path(path);
        // this._path.attr({
        //     stroke: "none",
        //     fill: "none"
        // });

        // var path = "m 0,-%s a %s,%s 0 1,1 -0.1,0 z"
        //     .replace(/%s/gi, this._size);
        // this._path = this.svgGroup.path(path);
        // this._path.attr({
        //     stroke: "none",
        //     fill: "none"
        // });
    };
    p.align = function(x, y, animate) {
        if (this._position) x = this._positionX;
        if (this._position) y = this._positionX;

        var transform = "t" + x + " " + y;

        this.svgGroup.attr({
            transform: transform
        }); 
    
        if(animate) {
            this.trashcanTop.animate({
                transform: "t5 -18 r30"
            },100);
        } else {
            this.trashcanTop.animate({
                transform: "r0"
            },100);
        }
        
        
        // console.log(animate);
        // console.log(this);
        // animate = animate === undefined ? true : animate;
        // var svgGroup = this.svgGroup;

        // if (animate)
        //     svgGroup.animate({
        //         transform: transform
        //     }, 300, mina.easeinout);
        // else
        //     svgGroup.attr({
        //         transform: transform
        //     });

        
    };

})(Entry.FieldTrashcan.prototype);
