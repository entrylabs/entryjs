Entry.skeleton.clickable_text = {
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(18, height + 2);
        width = Math.max(0, width - height + 12);
        const halfHeight = height / 2;
        return (
            `m ${halfHeight},0 h ${width} a ${halfHeight},${halfHeight} 0 1,1 0,${height}` +
            `H ${halfHeight} A ${halfHeight},${halfHeight} 0 1,1 ${halfHeight},0 z`
        );
    },
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 5;
        const height = blockView ? blockView.contentHeight : 18;
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
    classes: ['clickableText'],
};
