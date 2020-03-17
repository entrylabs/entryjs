Entry.skeleton.pebble_basic = {
    executable: true,
    fontSize: 15,
    morph: ['prev', 'next'],
    path() {
        return (
            'm 0,9 a 9,9 0 0,0 9,-9 h 28 ' +
            'q 25,0 25,25' +
            'q 0,25 -25,25' +
            'h -28 a 9,9 0 0,1 -18,0 h -28 ' +
            'q -25,0 -25,-25' +
            'q 0,-25 25,-25' +
            'h 28 a 9,9 0 0,0 9,9 z'
        );
    },
    magnets(blockView) {
        // apply scale required.
        const height = blockView ? Math.max(blockView.height, 51) : 51;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + blockView.offsetY },
        };
    },
    box() {
        return {
            offsetX: -62,
            offsetY: 0,
            width: 124,
            height: 50,
            marginBottom: 0,
        };
    },
    contentPos() {
        // apply scale required.
        return { x: -46, y: 25 };
    },
};
