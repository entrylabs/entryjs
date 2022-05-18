Entry.skeleton.basic_create_value = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight % 1000000;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 2 - height / 2);
        const statements = blockView._statements;
        let statementHeight = statements[0] ? statements[0].height : 20;
        const halfHeight = height / 2;

        statementHeight = Math.max(statementHeight, 20);

        return `M 0 0                
                V 1
                h ${width}
                a 14 14 0 0 1 0 28
                H 26
                l -6 6
                l -6 -6
                v ${statementHeight}
                l 6 6
                l 6 -6
                h ${width - 15}
                a ${halfHeight} ${halfHeight} 0 0 1 0 ${height}
                H 0
                z`;
    },
    magnets(blockView) {
        const height = blockView ? Math.max(blockView.height, 30) : 30;
        return {};
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
    statementPos(blockView) {
        const height1 = Math.max(30, (blockView.contentHeight % 1000000) + 2) + 1;
        return [{ x: 14, y: height1 - 3 }];
    },
    contentPos(blockView) {
        const height = Math.max(blockView.contentHeight % 1000000, 28);
        return { x: 14, y: height / 2 + 1 };
    },
};
