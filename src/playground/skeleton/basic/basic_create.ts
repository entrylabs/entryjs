Entry.skeleton.basic_create = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        width = Math.max(0, width + 4);

        return `M 12 29
                l -6 6 -6 -6
                V 1
                h ${width}
                c 7.732 0 14 6.268 14 14
                s -6.268 14 -14 14
                H 13
                z`;
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
        const height = blockView ? Math.max(blockView.height, 30) : 30;
        return {
            next: { x: 0, y: height + blockView.offsetY - 1 },
        };
    },
    contentPos(blockView) {
        const height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 + 1 };
    },
};
