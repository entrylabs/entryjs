Entry.skeleton.comment = {
    executable: false,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);
        const halfHeight = height / 2;

        return (
            `m -8,0 l 8,8 8,-8 h ${width} a ${halfHeight},${halfHeight} 0 0,1 0,${height}` +
            `h -${width} l -8,8 -8,-8 v -${height} z`
        );
    },
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 150;
        const height = blockView ? blockView.contentHeight : 28;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 30,
            height: Math.max(30, height + 2),
            marginBottom: 0,
        };
    },
    magnets(blockView) {
        // apply scale required.
        const height = blockView ? Math.max(blockView.height, 30) : 30;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + 1 + blockView.offsetY },
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 + 1 };
    },
};
