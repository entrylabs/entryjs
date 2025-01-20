Entry.skeleton.basic_double_loop = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        let height1 = blockView.contentHeight % 1000000;
        height1 = Math.max(30, height1 + 2);
        width = Math.max(0, width + 2 - height1 / 2);
        const statements = blockView._statements;
        let statementHeight1 = statements[0] ? statements[0].height : 20;
        let statementHeight2 = statements[1] ? statements[1].height : 20;
        const bw = width - 8;

        statementHeight1 = Math.max(statementHeight1, 20);
        statementHeight2 = Math.max(statementHeight2, 20);

        return `m 0 0
        l 6 6
        l 6 -6
        h ${width}
        a 14 14 0 0 1 0 28
        H 26
        l -6 6
        l -6 -6
        v ${statementHeight1}
        l 6 6
        l 6 -6
        h ${bw - 6}
        a 14 14 0 0 1 0 28
        H 26
        l -6 6
        l -6 -6
        v ${statementHeight2}
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
        const contentHeight1 = Math.max((blockView.contentHeight % 1000000) + 2, 30);
        const contentHeight2 = Math.max(Math.floor(blockView.contentHeight / 1000000) + 2, 30);
        let statementHeight1 = blockView._statements[0] ? blockView._statements[0].height : 20;
        let statementHeight2 = blockView._statements[1] ? blockView._statements[1].height : 20;
        statementHeight1 = Math.max(statementHeight1, 20);
        statementHeight2 = Math.max(statementHeight2, 20);
        return {
            previous: { x: 0, y: 0 },
            next: {
                x: 0,
                y:
                    statementHeight1 +
                    statementHeight2 +
                    contentHeight1 +
                    contentHeight2 +
                    11 +
                    blockView.offsetY,
            },
        };
    },
    box(blockView) {
        const contentWidth = blockView.contentWidth;
        const contentHeight1 = Math.max(Math.floor(blockView.contentHeight / 1000000) + 2, 30);
        const contentHeight2 = Math.max((blockView.contentHeight % 1000000) + 2, 30);
        let statementHeight1 = blockView._statements[0]
            ? blockView._statements[0].height % 1000000
            : 20;
        let statementHeight2 = blockView._statements[1] ? blockView._statements[1].height : 20;
        statementHeight1 = Math.max(statementHeight1, 20);
        statementHeight2 = Math.max(statementHeight2, 20);
        return {
            offsetX: -8,
            offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight1 + contentHeight2 + statementHeight1 + statementHeight2 + 17,
            marginBottom: 0,
            topFieldHeight: contentHeight1,
        };
    },
    statementPos(blockView) {
        const statementHeight1 = blockView._statements[0]
            ? blockView._statements[0].height % 1000000
            : 20;
        const height1 = Math.max(30, (blockView.contentHeight % 1000000) + 2) + 1;
        const height2 =
            height1 +
            Math.max(statementHeight1, 20) +
            Math.max(Math.floor(blockView.contentHeight / 1000000) + 2, 30) +
            1;

        return [{ x: 14, y: height1 - 3 }, { x: 14, y: height2 - 6 }];
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight % 1000000, 28);
        return { x: 14, y: height / 2 };
    },
};
