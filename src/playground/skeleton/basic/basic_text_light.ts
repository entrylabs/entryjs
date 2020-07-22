import _get from 'lodash/get';

/**
 * line entry 의 hardware font-light-weight noti 를 위해 만든 스켈레톤
 */
Entry.skeleton.basic_text_light = {
    path(blockView) {
        const paramText = _get(blockView, ['_schema', 'params', '0', 'text'], '').match(/[\r\n]/g);
        const textLines = paramText ? paramText.length + 1 : 1;
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(18, height + 2) * textLines;
        width = Math.max(0, width - height + 12);
        const halfHeight = height / 2;
        return (
            `m ${halfHeight},0 h ${width} a ${halfHeight},${halfHeight} 0 1,1 0,${height}` +
            `H ${halfHeight} A ${halfHeight},${halfHeight} 0 1,1 ${halfHeight},0 z`
        );
    },
    box(blockView) {
        const paramText = _get(blockView, ['_schema', 'params', '0', 'text'], '').match(/[\r\n]/g);
        const textLines = paramText ? paramText.length + 1 : 1;
        const width = blockView ? blockView.contentWidth : 5;
        const height = (blockView ? blockView.contentHeight : 18) * textLines;
        const { skeletonOptions = {} } = blockView._schema;
        const { box = {} } = skeletonOptions;
        return Object.assign(
            {
                offsetX: 0,
                offsetY: 0,
                width: width + 12,
                height: Math.max(height + 2, 18),
                marginBottom: 0,
            },
            box
        );
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 16);
        const width = Math.max(blockView.contentWidth, 16);
        return { x: width / 2 + 5, y: height / 2 + 1 };
    },
    movable: false,
    readOnly: true,
    nextShadow: false,
    classes: ['basicTextLight'],
};
