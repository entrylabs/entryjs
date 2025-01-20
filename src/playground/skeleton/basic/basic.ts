Entry.skeleton.basic = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(28, height + 2);
        width = Math.max(0, width + 6 - height / 2);
        const halfHeight = height / 2;
        return `M 0 0
        l 6 6
        l 6 -6
        h ${width}
        a ${halfHeight} ${halfHeight} 0 0 1 0 ${height}
        h -${width}
        l -6 6
        l -6 -6
        z`;
    },
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 150;
        const height = blockView ? blockView.contentHeight : 28;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 30,
            height: Math.max(28, height + 2),
            marginBottom: 0,
        };
    },
    magnets(blockView) {
        // apply scale required.
        const height = blockView ? Math.max(blockView.height, 28) : 28;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + blockView.offsetY },
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 };
    },
};

Entry.skeleton.basic_without_next = {
    executable: true,
    outerLine: '#13bf68',
    box: Entry.skeleton.basic.box,
    contentPos: Entry.skeleton.basic.contentPos,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(28, height + 2);
        width = Math.max(0, width + 6 - height / 2);
        const halfHeight = height / 2;

        return `m 0 0
        l 6 6
        l 6 -6
        h ${width}
        a ${halfHeight} ${halfHeight} 0 0 1 0 ${height}
        H 0
        z`;
    },
    magnets() {
        return {
            previous: { x: 0, y: 0 },
        };
    },
};
