Entry.skeleton.basic_define = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);
        let statementHeight = blockView._statements[0] ? blockView._statements[0].height : 30;
        statementHeight = Math.max(statementHeight, 20);
        return (
            'm -8,0 l 16,0 h %w a %h,%h 0 0,1 0,%wh H 24 l -8,8 -8,-8 h -0.4 v' +
            '%sh h 0.4 l 8,8 8,-8 h %bw a 8,8 0 0,1 0,16 H -8 z'
        )
            .replace(/%wh/gi, height)
            .replace(/%w/gi, width)
            .replace(/%h/gi, (height / 2) as any) // TODO blockView 인터페이스 완성시 삭제
            .replace(/%bw/gi, (width - 8) as any)
            .replace(/%sh/gi, statementHeight + 1);
    },
    magnets() {
        return {};
    },
    box(blockView) {
        const contentWidth = blockView.contentWidth;
        const contentHeight = Math.max(blockView.contentHeight, 25);
        return {
            offsetX: 0,
            offsetY: 0,
            width: contentWidth,
            height: contentHeight + 46,
            marginBottom: 0,
        };
    },
    statementPos(blockView) {
        const height = Math.max(30, blockView.contentHeight + 2);
        return [
            {
                x: 16,
                y: height,
            },
        ];
    },
    contentPos() {
        // apply scale required.
        return { x: 14, y: 15 };
    },
};
