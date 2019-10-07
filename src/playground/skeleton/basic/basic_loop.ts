Entry.skeleton.basic_loop = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(28, height);
        width = Math.max(0, width + 6 - height / 2);
        let statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 20);
        const bw = width - 8;
        const halfHeight = height / 2;

        return `m 0 0
        l 6 6
        l 6 -6
        h ${width}
        a ${halfHeight} ${halfHeight} 0 0 1 0 ${height}
        H 26
        l -6 6
        l -6 -6
        v ${statementHeight}
        l 6 6
        l 6 -6
        h ${bw}
        a 7.5 7.5 0 0 1 0 15
        H 12
        l -6 6
        l -6 -6
        z`;
    },
    magnets(blockView) {
        const contentHeight = Math.max(blockView.contentHeight + 2, 28);
        let statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 20);
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: statementHeight + contentHeight + 15 + blockView.offsetY },
        };
    },
    box(blockView) {
        const contentWidth = blockView.contentWidth;
        const contentHeight = Math.max(blockView.contentHeight + 2, 28);
        let statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 20);
        return {
            topFieldHeight: contentHeight,
            offsetX: -8,
            offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight + statementHeight + 17,
            marginBottom: 0,
        };
    },
    statementPos(blockView) {
        const height = Math.max(30, blockView.contentHeight + 2);
        return [{ x: 14, y: height - 2 }];
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 };
    },
};
