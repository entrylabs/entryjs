Entry.skeleton.basic_param = {
    path(blockView) {
        let width = blockView.contentWidth;
        const output = blockView._contents[blockView._contents.length - 1];
        if (output) {
            width -= output.box.width + Entry.BlockView.PARAM_SPACE - 2;
        }
        width = Math.max(0, width);
        return `m 2 0
                h ${width + 11}
                a 3 3 0 0 1 3 3
                h 2.2
                a 2 2 0 0 1 2 2
                v 12
                a 2 2 0 0 1 -2 2
                h -2.2
                a 3 3 0 0 1 -3 3
                H 3
                a 3 3 0 0 1 -3 -3
                h 2
                a 2 2 0 0 0 2 -2
                V 5
                a 2 2 0 0 0 -2 -2
                H 0
                a 3 3 0 0 1 3 -3
                z`;
    },
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 5;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 11,
            height: 22,
            marginBottom: 0,
        };
    },
    magnets() {
        return {
            param: {},
        };
    },
    contentPos() {
        return { x: 11, y: 11 };
    },
};
