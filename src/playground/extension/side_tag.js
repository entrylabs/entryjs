/*
 *
 */
'use strict';

/*
 *
 */
Entry.ExtSideTag = function(content, blockView, mode) {
    this.blockView = blockView;
    this.color = content.color ? content.color : '#EBC576';
    this.text = content.text ? content.text : '';
    this.height = content.height ? Number(content.height) : Number(content.count) * 31;

    this.render();
    this.updatePos();
};

(function(p) {
    p.render = function() {
        this.svgGroup = this.blockView.svgGroup.elem('g');
        $(this.svgGroup).bind('mousedown touchstart', (e) => {
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
        });
        this.path = this.svgGroup.elem('path').attr({
            d: `m0,2 h-9 v${this.height - 4} h9`,
            stroke: this.color,
            fill: 'transparent',
            'stroke-width': '3',
        });
        this.textElement = this.svgGroup.elem('text').attr({
            style: 'white-space: pre;',
            'font-size': '10px',
            'font-family': EntryStatic.fontFamily || 'NanumGothic',
            class: 'dragNone',
            fill: '#000000',
        });
        let textArray = this.text.split('\n');
        this.tspans = textArray.map((t) => {
            var tspan = this.textElement.elem('tspan').attr({
                dy: '1.2em',
                x: '0',
                class: 'extension sideTagTspan',
            });
            tspan.textContent = t;
            return tspan;
        });
    };

    p.updatePos = function() {
        let pointer = this.blockView.block.pointer();
        this.positionX = -(pointer.length - 2) * 8;
        this.svgGroup.attr('transform', `translate(${this.positionX},0)`);
        this.textElement.attr({
            y: this.height / 2 - 12 * (this.tspans.length - 1) - 2,
        });
        let bBox = this.textElement.getBoundingClientRect();

        this.tspans.map((tspan) => {
            tspan.attr({ x: -bBox.width - 14 });
        });
    };
})(Entry.ExtSideTag.prototype);
