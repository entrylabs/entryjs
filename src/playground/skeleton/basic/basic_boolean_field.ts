Entry.skeleton.basic_boolean_field = {
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(20, height);
        width = Math.max(0, width - height + 19);
        const halfHeight = height / 2;
        const x = height * 0.4;

        return `m ${halfHeight} 0
                l -${x} ${halfHeight}
                l ${x} ${halfHeight}
                h ${width}
                l ${x} -${halfHeight}
                l -${x} -${halfHeight}
                z`;
    },
    color: '#FFF',
    outerLine: '#1b3ad8',
    fontSize: 10,
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 5;
        const height = blockView ? blockView.contentHeight : 18;
        return {
            offsetX: 0,
            offsetY: 0,
            width: width + 19,
            height: Math.max(height, 20),
            marginBottom: 0,
        };
    },
    magnets() {
        return {
            boolean: {},
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 20);
        return { x: 10, y: height / 2 };
    },
};
