'use strict';

Entry.skeleton = function() {};

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

Entry.skeleton.basic = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(28, height + 2);
        width = Math.max(0, width + 6 - height / 2);
        const halfHeight = height / 2;
        return `M 0 0
        l 6 6
        l 6 -6
        h ${width}
        a ${halfHeight} ${halfHeight} 0 0 1 0 ${height}
        h -${width}
        l -6 6
        l -6 -6
        z`;
    },
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 150;
        const height = blockView ? blockView.contentHeight : 28;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 30,
            height: Math.max(28, height + 2),
            marginBottom: 0,
        };
    },
    magnets(blockView) {
        // apply scale required.
        const height = blockView ? Math.max(blockView.height, 28) : 28;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + blockView.offsetY },
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 };
    },
};

Entry.skeleton.basic_without_next = {
    executable: true,
    outerLine: '#13bf68',
    box: Entry.skeleton.basic.box,
    contentPos: Entry.skeleton.basic.contentPos,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(28, height + 2);
        width = Math.max(0, width + 6 - height / 2);
        const halfHeight = height / 2;

        return `m 0 0
        l 6 6
        l 6 -6
        h ${width}
        a ${halfHeight} ${halfHeight} 0 0 1 0 ${height}
        H 0
        z`;
    },
    magnets() {
        return {
            previous: { x: 0, y: 0 },
        };
    },
};

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

Entry.skeleton.basic_create = {
    executable: true,
    path(blockView) {
        let width = blockView.contentWidth;
        width = Math.max(0, width + 4);

        return `M 12 29
                l -6 6 -6 -6
                V 1
                h ${width}
                c 7.732 0 14 6.268 14 14
                s -6.268 14 -14 14
                H 13
                z`;
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
    magnets(blockView) {
        const height = blockView ? Math.max(blockView.height, 30) : 30;
        return {
            next: { x: 0, y: height + blockView.offsetY - 1 },
        };
    },
    contentPos(blockView) {
        const height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 + 1 };
    },
};

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
            .replace(/%h/gi, height / 2)
            .replace(/%bw/gi, width - 8)
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
            'M 0,9 a 9,9 0 0,0 9,-9 h %cw q 25,0 25,25 v' +
            '%ch q 0,25 -25,25 h -%cw a 9,9 0 0,1 -18,0 ' +
            'h -%cw q -25,0 -25,-25 v -%ch q 0,-25 25,-25 h %cw a 9,9 0 0,0 9,9 ' +
            'M 0,49 a 9,9 0 0,1 -9,-9 h -28 a 25,25 0 0,0 -25,25 v' +
            '%cih a 25,25 0 0,0 25,25 h 28 a 9,9 0 0,0 18,0 ' +
            'h 28 a 25,25 0 0,0 25,-25 v -%cih a 25,25 0 0,0 -25,-25 h -28 a 9,9 0 0,1 -9,9 z'
        )
            .replace(/%cw/gi, contentWidth / 2 - 21)
            .replace(/%ch/gi, statementHeight + 4)
            .replace(/%cih/gi, statementHeight - 50);
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

Entry.skeleton.basic_string_field = {
    path(blockView) {
        let width =
            blockView.contentWidth < 10 ? blockView.contentWidth : blockView.contentWidth + 2;
        let height = blockView.contentHeight;
        height = Math.max(20, height);
        width = Math.max(0, width - height + 12);
        const halfHeight = height / 2;

        return `m ${halfHeight} 0
                h ${width}
                a ${halfHeight} ${halfHeight} 0 1 1 0 ${height}
                H ${halfHeight}
                a ${halfHeight} ${halfHeight} 0 0 1 0 -${height}
                z`;
    },
    color: '#FFF',
    outerLine: '#FF9C00',
    fontSize: 10,
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 5;
        const height = blockView ? blockView.contentHeight : 0;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 15,
            height: Math.max(height, 20),
            marginBottom: 0,
        };
    },
    magnets() {
        return {
            string: {},
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 20);
        return { x: 7, y: height / 2 };
    },
};

Entry.skeleton.basic_boolean_field = {
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(20, height);
        width = Math.max(0, width - height + 19);
        const halfHeight = height / 2;
        const x = height * 0.4;

        return `m ${halfHeight} 0
                l -${x} ${halfHeight}
                l ${x} ${halfHeight}
                h ${width}
                l ${x} -${halfHeight}
                l -${x} -${halfHeight}
                z`;
    },
    color: '#FFF',
    outerLine: '#6173F5',
    fontSize: 10,
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 5;
        const height = blockView ? blockView.contentHeight : 18;
        return {
            offsetX: 0,
            offsetY: 0,
            width: width + 19,
            height: Math.max(height, 20),
            marginBottom: 0,
        };
    },
    magnets() {
        return {
            boolean: {},
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 20);
        return { x: 10, y: height / 2 };
    },
};

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

Entry.skeleton.basic_text = {
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(18, height + 2);
        width = Math.max(0, width - height + 12);
        const halfHeight = height / 2;
        return (
            `m ${halfHeight},0 h ${width} a ${halfHeight},${halfHeight} 0 1,1 0,${height}` +
            `H ${halfHeight} A ${halfHeight},${halfHeight} 0 1,1 ${halfHeight},0 z`
        );
    },
    box(blockView) {
        const width = blockView ? blockView.contentWidth : 5;
        const height = blockView ? blockView.contentHeight : 18;
        return {
            offsetX: 0,
            offsetY: 0,
            width: width + 12,
            height: Math.max(height + 2, 18),
            marginBottom: 0,
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 16);
        const width = Math.max(blockView.contentWidth, 16);
        return { x: width / 2 + 5, y: height / 2 + 1 };
    },
    movable: false,
    readOnly: true,
    nextShadow: false,
    classes: ['basicText'],
};

Entry.skeleton.comment = {
    executable: false,
    path(blockView) {
        let width = blockView.contentWidth;
        let height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);
        const halfHeight = height / 2;

        return (
            `m -8,0 l 8,8 8,-8 h ${width} a ${halfHeight},${halfHeight} 0 0,1 0,${height}` +
            `h -${width} l -8,8 -8,-8 v -${height} z`
        );
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
    magnets(blockView) {
        // apply scale required.
        const height = blockView ? Math.max(blockView.height, 30) : 30;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + 1 + blockView.offsetY },
        };
    },
    contentPos(blockView) {
        // apply scale required.
        const height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 + 1 };
    },
};
