/*
 *
 */
'use strict';

/*
 *
 */
Entry.skeleton = function() {};

Entry.skeleton.basic_event = {
    executable: true,
    path: function(blockView) {
        var width = blockView.contentWidth + 20;
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
    box: function(blockView) {
        return {
            offsetX: 0,
            offsetY: -2,
            width: blockView.contentWidth + 30,
            height: 30,
            marginBottom: 0,
        };
    },
    magnets: function(blockView) {
        // apply scale required.
        var height = blockView ? Math.max(blockView.height + blockView.offsetY + 7, 30) : 30;
        return {
            next: { x: 12, y: height - 1 },
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        return { x: 18, y: 20 };
    },
};

Entry.skeleton.basic = {
    executable: true,
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(28, height + 2);
        width = Math.max(0, width + 6 - height / 2);
        var halfHeight = height / 2;
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
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 150;
        var height = blockView ? blockView.contentHeight : 28;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 30,
            height: Math.max(28, height + 2),
            marginBottom: 0,
        };
    },
    magnets: function(blockView) {
        // apply scale required.
        var height = blockView ? Math.max(blockView.height, 28) : 28;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + blockView.offsetY },
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 };
    },
};

Entry.skeleton.basic_without_next = {
    executable: true,
    outerLine: '#13bf68',
    box: Entry.skeleton.basic.box,
    contentPos: Entry.skeleton.basic.contentPos,
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(28, height + 2);
        width = Math.max(0, width + 6 - height / 2);
        var halfHeight = height / 2;

        return `m 0 0
        l 6 6
        l 6 -6
        h ${width}
        a ${halfHeight} ${halfHeight} 0 0 1 0 ${height}
        H 0
        z`;
    },
    magnets: function(blockView) {
        // apply scale required.
        var height = blockView ? Math.max(blockView.height, 28) : 28;
        return {
            previous: { x: 0, y: 0 },
        };
    },
};

Entry.skeleton.basic_loop = {
    executable: true,
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(28, height);
        width = Math.max(0, width + 6 - height / 2);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 20);
        var bw = width - 8;
        var halfHeight = height / 2;

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
    magnets: function(blockView) {
        var contentHeight = Math.max(blockView.contentHeight + 2, 28);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 20);
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: statementHeight + contentHeight + 15 + blockView.offsetY },
        };
    },
    box: function(blockView) {
        var contentWidth = blockView.contentWidth;
        var contentHeight = Math.max(blockView.contentHeight + 2, 28);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 20);
        return {
            offsetX: -8,
            offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight + statementHeight + 17,
            marginBottom: 0,
        };
    },
    statementPos: function(blockView) {
        var height = Math.max(30, blockView.contentHeight + 2);
        return [{ x: 14, y: height - 2 }];
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 };
    },
};

Entry.skeleton.basic_double_loop = {
    executable: true,
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height1 = blockView.contentHeight % 1000000;
        var height2 = Math.floor(blockView.contentHeight / 1000000);
        height1 = Math.max(30, height1 + 2);
        height2 = Math.max(30, height2 + 2);
        width = Math.max(0, width + 2 - height1 / 2);
        var statements = blockView._statements;
        var statementHeight1 = statements[0] ? statements[0].height : 20;
        var statementHeight2 = statements[1] ? statements[1].height : 20;
        var bw = width - 8;

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
    magnets: function(blockView) {
        var contentHeight1 = Math.max(blockView.contentHeight % 1000000 + 2, 30);
        var contentHeight2 = Math.max(Math.floor(blockView.contentHeight / 1000000) + 2, 30);
        var statementHeight1 = blockView._statements[0] ? blockView._statements[0].height : 20;
        var statementHeight2 = blockView._statements[1] ? blockView._statements[1].height : 20;
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
    box: function(blockView) {
        var contentWidth = blockView.contentWidth;
        var contentHeight1 = Math.max(Math.floor(blockView.contentHeight / 1000000) + 2, 30);
        var contentHeight2 = Math.max(blockView.contentHeight % 1000000 + 2, 30);
        var statementHeight1 = blockView._statements[0]
            ? blockView._statements[0].height % 1000000
            : 20;
        var statementHeight2 = blockView._statements[1] ? blockView._statements[1].height : 20;
        statementHeight1 = Math.max(statementHeight1, 20);
        statementHeight2 = Math.max(statementHeight2, 20);
        return {
            offsetX: -8,
            offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight1 + contentHeight2 + statementHeight1 + statementHeight2 + 17,
            marginBottom: 0,
        };
    },
    statementPos: function(blockView) {
        var statementHeight1 = blockView._statements[0]
            ? blockView._statements[0].height % 1000000
            : 20;
        var height1 = Math.max(30, blockView.contentHeight % 1000000 + 2) + 1;
        var height2 =
            height1 +
            Math.max(statementHeight1, 20) +
            Math.max(Math.floor(blockView.contentHeight / 1000000) + 2, 30) +
            1;

        return [{ x: 14, y: height1 - 3 }, { x: 14, y: height2 - 6 }];
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight % 1000000, 28);
        return { x: 14, y: height / 2 };
    },
};

Entry.skeleton.basic_create = {
    executable: true,
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);

        return 'm -8,0 l 16,0 h %w a %h,%h 0 0,1 0,%wh h -%w l -8,8 -8,-8 v -%wh z'
            .replace(/%wh/gi, height)
            .replace(/%w/gi, width)
            .replace(/%h/gi, height / 2);
    },
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 150;
        var height = blockView ? blockView.contentHeight : 28;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 30,
            height: Math.max(30, height + 2),
            marginBottom: 0,
        };
    },
    magnets: function(blockView) {
        // apply scale required.
        var height = blockView ? Math.max(blockView.height, 30) : 30;
        return {
            next: { x: 0, y: height + 1 + blockView.offsetY },
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 + 1 };
    },
};

Entry.skeleton.basic_define = {
    executable: true,
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].height : 30;
        statementHeight = Math.max(statementHeight, 20);
        return 'm -8,0 l 16,0 h %w a %h,%h 0 0,1 0,%wh H 24 l -8,8 -8,-8 h -0.4 v %sh h 0.4 l 8,8 8,-8 h %bw a 8,8 0 0,1 0,16 H -8 z'
            .replace(/%wh/gi, height)
            .replace(/%w/gi, width)
            .replace(/%h/gi, height / 2)
            .replace(/%bw/gi, width - 8)
            .replace(/%sh/gi, statementHeight + 1);
    },
    magnets: function() {
        return {};
    },
    box: function(blockView) {
        var contentWidth = blockView.contentWidth;
        var contentHeight = Math.max(blockView.contentHeight, 25);
        return {
            offsetX: 0,
            offsetY: 0,
            width: contentWidth,
            height: contentHeight + 46,
            marginBottom: 0,
        };
    },
    statementPos: function(blockView) {
        var height = Math.max(30, blockView.contentHeight + 2);
        return [
            {
                x: 16,
                y: height,
            },
        ];
    },
    contentPos: function() {
        // apply scale required.
        return { x: 14, y: 15 };
    },
};

Entry.skeleton.pebble_event = {
    executable: true,
    path: function(blockView) {
        var width = blockView.contentWidth;
        return 'm 0,0 a 25,25 0 0,1 9,48.3 a 9,9 0 0,1 -18,0 a 25,25 0 0,1 9,-48.3 z';
    },
    box: function(blockView) {
        return {
            offsetX: -25,
            offsetY: 0,
            width: 50,
            height: 48.3,
            marginBottom: 0,
        };
    },
    magnets: function(blockView) {
        // apply scale required.
        var height = blockView ? Math.max(blockView.height, 49.3) : 49.3;
        return {
            next: { x: 0, y: height + blockView.offsetY },
        };
    },
    contentPos: function() {
        // apply scale required.
        return { x: 0, y: 25 };
    },
};

Entry.skeleton.pebble_loop = {
    executable: true,
    fontSize: 16,
    dropdownHeight: 23,
    path: function(blockView) {
        var contentWidth = 124;
        var contentHeight = Math.max(blockView.contentHeight, 50);
        var statementHeight = Math.max(
            blockView._statements[0] ? blockView._statements[0].height : 50,
            50
        );
        return (
            'M 0,9 a 9,9 0 0,0 9,-9 h %cw q 25,0 25,25 v %ch q 0,25 -25,25 h -%cw a 9,9 0 0,1 -18,0 ' +
            'h -%cw q -25,0 -25,-25 v -%ch q 0,-25 25,-25 h %cw a 9,9 0 0,0 9,9 ' +
            'M 0,49 a 9,9 0 0,1 -9,-9 h -28 a 25,25 0 0,0 -25,25 v %cih a 25,25 0 0,0 25,25 h 28 a 9,9 0 0,0 18,0 ' +
            'h 28 a 25,25 0 0,0 25,-25 v -%cih a 25,25 0 0,0 -25,-25 h -28 a 9,9 0 0,1 -9,9 z'
        )
            .replace(/%cw/gi, contentWidth / 2 - 21)
            .replace(/%ch/gi, statementHeight + 4)
            .replace(/%cih/gi, statementHeight - 50);
    },
    magnets: function(blockView) {
        var contentHeight = Math.max(blockView.contentHeight + 2, 41);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 51);
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: statementHeight + contentHeight + 13 + blockView.offsetY },
        };
    },
    box: function(blockView) {
        var contentWidth = blockView.contentWidth;
        var contentHeight = Math.max(blockView.contentHeight + 2, 41);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].height : 20;
        statementHeight = Math.max(statementHeight, 51);
        return {
            offsetX: -(contentWidth / 2 + 13),
            offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight + statementHeight + 13,
            marginBottom: 0,
        };
    },
    statementPos: function(blockView) {
        var height = Math.max(39, blockView.contentHeight + 2) + 1.5;
        return [{ x: 0, y: height }];
    },
    contentPos: function() {
        // apply scale required.
        return { x: -46, y: 25 };
    },
};

Entry.skeleton.pebble_basic = {
    executable: true,
    fontSize: 15,
    morph: ['prev', 'next'],
    path: function(blockView) {
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
    //path: function(blockView) {
    //var block = blockView.block;
    //var prev = block.getPrevBlock();
    //var next = block.getNextBlock();
    //var isPrevSame = prev && prev._schema.skeleton === "pebble_basic";
    //var isNextSame = next && next._schema.skeleton === "pebble_basic";

    //return "m 0,9 a 9,9 0 0,0 9,-9 h 28 " +
    //(isPrevSame ? "l 25,0 0,25" : "q 25,0 25,25") +
    //(isNextSame ? "l 0,25 -25,0" : "q 0,25 -25,25") +
    //"h -28 a 9,9 0 0,1 -18,0 h -28 " +
    //(isNextSame ? "l -25,0 0,-25" : "q -25,0 -25,-25") +
    //(isPrevSame ? "l 0,-25 25,0" : "q 0,-25 25,-25") +
    //"h 28 a 9,9 0 0,0 9,9 z";
    //},
    magnets: function(blockView) {
        // apply scale required.
        var height = blockView ? Math.max(blockView.height, 51) : 51;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + blockView.offsetY },
        };
    },
    box: function() {
        return {
            offsetX: -62,
            offsetY: 0,
            width: 124,
            height: 50,
            marginBottom: 0,
        };
    },
    contentPos: function() {
        // apply scale required.
        return { x: -46, y: 25 };
    },
};

Entry.skeleton.basic_string_field = {
    path: function(blockView) {
        var width =
            blockView.contentWidth < 10 ? blockView.contentWidth : blockView.contentWidth + 2;
        var height = blockView.contentHeight;
        height = Math.max(20, height);
        width = Math.max(0, width - height + 12);
        var halfHeight = height / 2;

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
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 5;
        var height = blockView ? blockView.contentHeight : 0;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 15,
            height: Math.max(height, 0),
            marginBottom: 0,
        };
    },
    magnets: function() {
        return {
            string: {},
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 20);
        return { x: 7, y: height / 2 };
    },
};

Entry.skeleton.basic_boolean_field = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(18, height + 2);
        width = Math.max(0, width - height + 19);
        var halfHeight = height / 2;
        var x = height * 0.4;

        return `m ${halfHeight} 0
        l -${x} ${halfHeight}
        l ${x} ${halfHeight}
        h ${width}
        l ${x} -${halfHeight}
        l -${x} -${halfHeight}
        z
        `;
    },
    color: '#FFF',
    outerLine: '#6173F5',
    fontSize: 10,
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 5;
        var height = blockView ? blockView.contentHeight : 18;
        return {
            offsetX: 0,
            offsetY: 0,
            width: width + 19,
            height: Math.max(height + 2, 18),
            marginBottom: 0,
        };
    },
    magnets: function() {
        return {
            boolean: {},
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 16);
        return { x: 10, y: height / 2 + 1 };
    },
};

Entry.skeleton.basic_param = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        var output = blockView._contents[blockView._contents.length - 1];
        if (output) width -= output.box.width + Entry.BlockView.PARAM_SPACE - 2;
        width = Math.max(0, width);
        return `m 2 0
        h ${width + 11}
        a 3 3 0 0 1 3 3
        h 1.775
        a 2 2 0 0 1 2 2
        v 14
        a 2 2 0 0 1 -2 2
        h -1.775
        a 3 3 0 0 1 -3 3
        H 3
        a 3 3 0 0 1 -3 -3
        h 2
        a 2 2 0 0 0 2 -2
        V 5
        a 2 2 0 0 0 -2 -2
        H 0
        a 3 3 0 0 1 3 -3
        z
        `
    },
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 5;
        return {
            offsetX: 0,
            offsetY: 0,
            width: width + 11,
            height: 24,
            marginBottom: 0,
        };
    },
    magnets: function() {
        return {
            param: {},
        };
    },
    contentPos: function({ data } = {}) {
        const { type } = data || {};
        if (type === 'function_field_string') {
            return { x: 11, y: 7.5 };
        }
        return { x: 11, y: 12 };
    },
};

Entry.skeleton.basic_button = {
    path: function() {
        return 'm -64,0 h 128 a 6,6 0, 0,1 6,6 v 18 a 6,6 0, 0,1 -6,6 h -128 a 6,6 0, 0,1 -6,-6 v -18 a 6,6 0, 0,1 6,-6 z';
    },
    box: function() {
        return {
            offsetX: -80,
            offsetY: 0,
            width: 140,
            height: 30,
        };
    },
    contentPos: function() {
        // apply scale required.
        return { x: 0, y: 15 };
    },
    movable: false,
    readOnly: true,
    nextShadow: true,
    classes: ['basicButtonView'],
};

Entry.skeleton.basic_text = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(18, height + 2);
        width = Math.max(0, width - height + 12);
        var halfHeight = height / 2;
        return (
            'm ' +
            halfHeight +
            ',0 h ' +
            width +
            ' a ' +
            halfHeight +
            ',' +
            halfHeight +
            ' 0 1,1 0,' +
            height +
            ' H ' +
            halfHeight +
            ' A ' +
            halfHeight +
            ',' +
            halfHeight +
            ' 0 1,1 ' +
            halfHeight +
            ',0 z'
        );
    },
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 5;
        var height = blockView ? blockView.contentHeight : 18;
        return {
            offsetX: 0,
            offsetY: 0,
            width: width + 12,
            height: Math.max(height + 2, 18),
            marginBottom: 0,
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 16);
        var width = Math.max(blockView.contentWidth, 16);
        return { x: width / 2 + 5, y: height / 2 + 1 };
    },
    movable: false,
    readOnly: true,
    nextShadow: false,
    classes: ['basicText'],
};

Entry.skeleton.comment = {
    executable: false,
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);
        var halfHeight = height / 2;

        return (
            'm -8,0 l 8,8 8,-8 h ' +
            width +
            ' a ' +
            halfHeight +
            ',' +
            halfHeight +
            ' 0 0,1 0,' +
            height +
            ' h -' +
            width +
            ' l -8,8 -8,-8 v -' +
            height +
            ' z'
        );
    },
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 150;
        var height = blockView ? blockView.contentHeight : 28;
        return {
            offsetX: -8,
            offsetY: 0,
            width: width + 30,
            height: Math.max(30, height + 2),
            marginBottom: 0,
        };
    },
    magnets: function(blockView) {
        // apply scale required.
        var height = blockView ? Math.max(blockView.height, 30) : 30;
        return {
            previous: { x: 0, y: 0 },
            next: { x: 0, y: height + 1 + blockView.offsetY },
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 28);
        return { x: 14, y: height / 2 + 1 };
    },
};
