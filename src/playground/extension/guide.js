'use strict';

const TRANSFORM = 'transform';

Entry.ExtGuide = class ExtGuide {
    constructor(content, blockView, mode) {
        this.blockView = blockView;
        this.block = blockView.block;
        this.model = content.model ? content.model : [];

        this.render();
    }

    render() {
        if (!this.model) {
            return;
        }

        const board = this.blockView.getBoard();
        this.svgGroup = this.blockView.svgGroup.elem('g', {
            class: 'extension guideGroup',
        });
        this.blockView.guideSvgGroup = this.svgGroup;
        $(this.svgGroup).bind('mousedown touchstart', (e) => {
            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
        });

        const block = this.block;
        const code = block.getCode();

        //move blocks off the screen
        //in order to prevent magneting for some reasons
        this.model[0].x = -99999;
        this.model[0].y = -99999;

        const thread = code.createThread(this.model);
        !thread.view && thread.createView(board);
        const cloned = thread.getFirstBlock().view.clone();
        cloned.removeAttribute(TRANSFORM);
        this.svgGroup.appendChild(cloned);
        this.updatePos();
        this.block.getThread().view.setHasGuide(true);
        thread.destroy(false);
    }

    updatePos() {
        this.svgGroup.attr(TRANSFORM, this._getTransform());
    }

    _getTransform() {
        return 'translate(0,%y)'.replace('%y', this.blockView.magnet.next.y);
    }
};
