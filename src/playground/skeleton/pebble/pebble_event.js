Entry.skeleton.pebble_event = {
    executable: true,
    path() {
        return 'm 0,0 a 25,25 0 0,1 9,48.3 a 9,9 0 0,1 -18,0 a 25,25 0 0,1 9,-48.3 z';
    },
    box() {
        return {
            offsetX: -25,
            offsetY: 0,
            width: 50,
            height: 48.3,
            marginBottom: 0,
        };
    },
    magnets(blockView) {
        // apply scale required.
        const height = blockView ? Math.max(blockView.height, 49.3) : 49.3;
        return {
            next: { x: 0, y: height + blockView.offsetY },
        };
    },
    contentPos() {
        // apply scale required.
        return { x: 0, y: 25 };
    },
};
