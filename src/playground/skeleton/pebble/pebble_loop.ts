Entry.skeleton.pebble_loop = {
    executable: true,
    fontSize: 16,
    dropdownHeight: 23,
    path(blockView) {
        const contentWidth = 124;
        const statementHeight = Math.max(
            blockView._statements[0] ? blockView._statements[0].height : 50,
            50
        );
        return (
            (
                'M 0,9 a 9,9 0 0,0 9,-9 h %cw q 25,0 25,25 v' +
                '%ch q 0,25 -25,25 h -%cw a 9,9 0 0,1 -18,0 ' +
                'h -%cw q -25,0 -25,-25 v -%ch q 0,-25 25,-25 h %cw a 9,9 0 0,0 9,9 ' +
                'M 0,49 a 9,9 0 0,1 -9,-9 h -28 a 25,25 0 0,0 -25,25 v' +
                '%cih a 25,25 0 0,0 25,25 h 28 a 9,9 0 0,0 18,0 ' +
                'h 28 a 25,25 0 0,0 25,-25 v -%cih a 25,25 0 0,0 -25,-25 h -28 a 9,9 0 0,1 -9,9 z'
            )
                // TODO blockView 인터페이스 완성시 삭제
                .replace(/%cw/gi, (contentWidth / 2 - 21) as any)
                .replace(/%ch/gi, (statementHeight + 4) as any)
                .replace(/%cih/gi, (statementHeight - 50) as any)
        );
    },
    magnets(blockView) {
        const contentHeight = Math.max(blockView.contentHeight + 2, 41);
        let statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 51);
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: statementHeight + contentHeight + 13 + blockView.offsetY },
        };
    },
    box(blockView) {
        const contentWidth = blockView.contentWidth;
        const contentHeight = Math.max(blockView.contentHeight + 2, 41);
        let statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 51);
        return {
            topFieldHeight: contentHeight,
            offsetX: -(contentWidth / 2 + 13),
            offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight + statementHeight + 13,
            marginBottom: 0,
        };
    },
    statementPos(blockView) {
        const height = Math.max(39, blockView.contentHeight + 2) + 1.5;
        return [{ x: 0, y: height }];
    },
    contentPos() {
        // apply scale required.
        return { x: -46, y: 25 };
    },
};
