Entry.skeleton.basic_button = {
    path() {
        return `m 6 0
            h 150
            a 6 6 0 0 1 6 6
            v 28
            a 6 6 0 0 1 -6 6
            h -150
            a 6 6 0 0 1 -6 -6
            v -28
            a 6 6 0 0 1 6 -6
            z`;
    },
    box() {
        return {
            offsetX: -5,
            offsetY: 0,
            width: 162,
            height: 40,
            marginBottom: 3,
        };
    },
    contentPos() {
        // apply scale required.
        return { x: 81, y: 20 };
    },
    movable: false,
    readOnly: true,
    nextShadow: true,
    fontSize: 14,
    classes: ['basicButtonView'],
};
