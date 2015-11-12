/*
 *
 */
"use strict";

goog.provide("Entry.ThreadView");

/*
 *
 */
Entry.ThreadView = function(thread, board) {
    Entry.Model(this, false);

    this.thread = thread;

    this.svgGroup = board.svgThreadGroup.group();
};

(function(p) {
    p.schema = {
        scrollX: 0,
        scrollY: 0
    };

    p.destroy = function() {
        this.svgGroup.remove();
    };

    p.changeBoard = function(board) {
        this.svgGroup.remove();
        board.svgThreadGroup.append(this.svgGroup);

        var blocks = this.thread.getBlocks();
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (!block.type)
                continue;
            block.view.changeBoard(board);
            var schema = Entry.block[block.type];
            var contents = schema.contents;
            for (var j = 0; j < contents.length; j++) {
                var content = contents[j];
                if (content.type == "Statement")
                    block.values[content.key].changeBoard(board);
            }
        }
    };

})(Entry.ThreadView.prototype);
