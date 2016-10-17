"use strict";

goog.provide("Entry.ExtGuide");

Entry.ExtGuide = function(content, blockView, mode) {
    this.blockView = blockView;
    this.block = blockView.block;
    this.model = content.model ? content.model : []

    this.render();
};

(function(p) {
    var TRANSFORM = "transform";
    p.render = function() {
        if (!this.model) return;

        var board =  this.blockView.getBoard();
        this.svgGroup = this.blockView.svgGroup.elem("g", {
            class: 'extension guideGroup'
        });
        this.blockView.guideSvgGroup = this.svgGroup;
        $(this.svgGroup).bind(
            'mousedown touchstart',
            function(e) {
                e.stopPropagation && e.stopPropagation();
                e.preventDefault && e.preventDefault();
            }
        );

        var block = this.block;
        var code = block.getCode();

        //move blocks off the screen
        //in order to prevent magneting for some reasons
        this.model[0].x = -99999;
        this.model[0].y = -99999;

        var thread = code.createThread(this.model);
        !thread.view && thread.createView(board);
        var cloned = thread.getFirstBlock().view.clone();
        cloned.removeAttribute(TRANSFORM);
        this.svgGroup.appendChild(cloned);
        this.updatePos();
        this.block.getThread().view.setHasGuide(true);
        thread.destroy(false);
    };

    p.updatePos = function() {
        this.svgGroup.attr(TRANSFORM, this._getTransform());
    };

    p._getTransform = function() {
        return 'translate(0,%y)'.replace('%y',
            this.blockView.magnet.next.y);
    };
})(Entry.ExtGuide.prototype);
