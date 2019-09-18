Entry.skeleton.basic_string_field = {
    path(blockView) {
        let width =
            blockView.contentWidth < 10 ? blockView.contentWidth : blockView.contentWidth + 2;
        let height = blockView.contentHeight;
        height = Math.max(20, height);
        width = Math.max(0, width - height + 12);
        const halfHeight = height / 2;

        return `m ${halfHeight} 0
                h ${width}
                a ${halfHeight} ${halfHeight} 0 1 1 0 ${height}
                H ${halfHeight}
                a ${halfHeight} ${halfHeight} 0 0 1 0 -${height}
                z`;
    },
    color: '#FFF',
    outerLine: '#FF9C00',
    fontSize: 10,
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 5;
        const height = blockView ? blockView.contentHeight : 0;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 15,
            height: Math.max(height, 20),
            marginBottom: 0,
        };
    },
    magnets() {
        return {
            string: {},
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 20);
        return { x: 7, y: height / 2 };
    },
};
