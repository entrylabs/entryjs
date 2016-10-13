"use strict";

goog.provide("Entry.ExtGuide");

Entry.ExtGuide = function(content, blockView, mode) {
    this.blockView = blockView;
    this.block = blockView.block;
    this.model = content.model ? content.model : []

    this.render();
};

(function(p) {
    p.render = function() {
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
        var thread = code.createThread(this.model);
        !thread.view && thread.createView(board);
        this.svgGroup.appendChild(thread.getFirstBlock().view.clone());
        this.updatePos();
        this.block.getThread().view.setHasGuide(true);
        thread.destroy(false);
    };

    p.updatePos = function() {
        this.svgGroup.attr('transform', this._getTransform());
    };

    p._getTransform = function() {
        return 'translate(0,%y)'.replace('%y',
            this.blockView.magnet.next.y);
    };
})(Entry.ExtGuide.prototype);
