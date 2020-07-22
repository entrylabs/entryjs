Entry.skeleton.basic_event = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth + 20;
        width = Math.max(0, width);
        width -= 30;

        return `m 24 34
        h ${width}
        a 14 14 0 0 0 0 -28
        H 30
        A 17 17 0 0 0 18 1
        C 8.611 1 1 8.611 1 18
        c 0 7.2 4.5 13.5 11 16
        l 6 6
        l 6 -6
        z`;
    },
    box(blockView) {
        return {
            topFieldHeight: 40,
            offsetX: 0,
            offsetY: -2,
            width: blockView.contentWidth + 30,
            height: 30,
            marginBottom: 0,
        };
    },
    magnets(blockView) {
        // apply scale required.
        const height = blockView ? Math.max(blockView.height + blockView.offsetY + 7, 30) : 30;
        return {
            next: { x: 12, y: height - 1 },
        };
    },
    contentPos() {
        // apply scale required.
        return { x: 18, y: 20 };
    },
};
