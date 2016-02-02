/*
 *
 */
"use strict";

goog.provide("Entry.skeleton");


/*
 *
 */
Entry.skeleton = function() {
};

Entry.skeleton.basic = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);
        return "m -8,0 l 8,8 8,-8 h %w a %h,%h 0 0,1 0,%wh h -%w l -8,8 -8,-8 v -%wh z"
            .replace(/%wh/gi, height)
            .replace(/%w/gi, width)
            .replace(/%h/gi, height / 2);
    },
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 150;
        var height = blockView ? blockView.contentHeight : 28;
        return {
            offsetX: -8, offsetY: 0,
            width: width + 30,
            height: Math.max(30, height + 2),
            marginBottom: 0
        };
    },
    magnets: function() {
        // apply scale required.
        return {
            previous: {},
            next: {x: 0, y: 31}
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 28);
        return {x: 14, y: height / 2 + 1};
    }

};

Entry.skeleton.basic_event = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        width = Math.max(0, width);
        return ("m -8,0 m 0,-5 a 19.5,19.5 0, 0,1 16,0 c 10,5 15,5 20,5 h %w " +
            "a 15,15 0 0,1 0,30 H 8 l -8,8 -8,-8 l 0,0.5 a 19.5,19.5 0, 0,1 0,-35 z")
            .replace(/%w/gi, width - 30);
    },
    box: function(blockView) {
        return {
            offsetX: -19, offsetY: -7,
            width: blockView.contentWidth + 30,
            height: 30,
            marginBottom: 0
        };
    },
    magnets: function() {
        // apply scale required.
        return {
            next: {x: 0, y: 31}
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        return {x: 1, y: 15};
    }
};

Entry.skeleton.basic_loop = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(30, height + 2);
        width = Math.max(0, width + 9 - height / 2);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].box.height : 30;
        return ("m -8,0 l 8,8 8,-8 h %w a %h,%h 0 0,1 0,%wh H 24 l -8,8 -8,-8 h -0.4 v %sh h 0.4 l 8,8 8,-8 h %w h -8 a 8,8 0 0,1 0,16 H 8 l -8,8 -8,-8 z")
            .replace(/%wh/gi, height)
            .replace(/%w/gi, width)
            .replace(/%h/gi, height / 2)
            .replace(/%sh/gi, statementHeight + 1);
    },
    magnets: function() {
        var contentWidth = 124;
        var contentHeight = 50;
        // apply scale required.
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: contentHeight + 55}
        };
    },
    box: function(blockView) {
        var contentWidth = blockView.contentWidth;
        var contentHeight = Math.max(blockView.contentHeight + 2, 30);
        var statementHeight = blockView._statements[0] ? blockView._statements[0].box.height : 30;
        return {
            offsetX: -8, offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight + statementHeight + 17,
            marginBottom: 0
        };
    },
    statementPos: function(blockView) {
        var height = Math.max(30, blockView.contentHeight + 2);
        return [{
            x: 16, y: height
        }];
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 28);
        return {x: 14, y: height / 2 + 1};
    }
};


Entry.skeleton.basic_define = {
    path: function(blockView) {
        var contentWidth = Math.max(0, blockView.contentWidth - 6);
        var contentHeight = Math.max(blockView.contentHeight, 25);
        return ("m -8,0 h 16 h %cw a 15,15 0 0,1 0,30 H 24 l -8,8 -8,-8 h -0.4 v %ch h 0.4 l 8,8 8,-8 h %cw h -8 a 8,8 0 0,1 0,16 H 8 l -8,8 -8,-8 z")
            .replace(/%cw/gi, contentWidth)
            .replace(/%ch/gi, contentHeight);
    },
    magnets: function() {
        var contentWidth = 124;
        var contentHeight = 50;
        // apply scale required.
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: contentHeight + 55}
        };
    },
    box: function(blockView) {
        var contentWidth = blockView.contentWidth;
        var contentHeight = Math.max(blockView.contentHeight, 25);
        return {
            offsetX: 0, offsetY: 0,
            width: contentWidth,
            height: contentHeight + 46,
            marginBottom: 0
        };
    },
    contentPos: function() {
        // apply scale required.
        return {x: 14, y: 15};
    }
};


Entry.skeleton.pebble_event = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        return "m 0,0 a 25,25 0 0,1 9,48.3 a 9,9 0 0,1 -18,0 a 25,25 0 0,1 9,-48.3 z";
    },
    box: function(blockView) {
        return {
            offsetX: -25, offsetY: 0,
            width: 50,
            height: 48.3,
            marginBottom: 0
        };
    },
    magnets: function(blockView) {
        // apply scale required.
        return {
            next: {x: 0, y: 49.3}
        };
    },
    contentPos: function() {
        // apply scale required.
        return {x: 0, y: 25};
    }
};

Entry.skeleton.pebble_loop = {
    fontSize: 16,
    dropdownHeight: 23,
    path: function(blockView) {
        var contentWidth = 124;
        var contentHeight = Math.max(blockView.contentHeight, 50);
        var statementHeight = Math.max(blockView._statements[0] ? blockView._statements[0].box.height : 50, 50);
        return ("M 0,9 a 9,9 0 0,0 9,-9 h %cw q 25,0 25,25 v %ch q 0,25 -25,25 h -%cw a 9,9 0 0,1 -18,0 " +
            "h -%cw q -25,0 -25,-25 v -%ch q 0,-25 25,-25 h %cw a 9,9 0 0,0 9,9 " +
            "M 0,49 a 9,9 0 0,1 -9,-9 h -28 a 25,25 0 0,0 -25,25 v %cih a 25,25 0 0,0 25,25 h 28 a 9,9 0 0,0 18,0 " +
            "h 28 a 25,25 0 0,0 25,-25 v -%cih a 25,25 0 0,0 -25,-25 h -28 a 9,9 0 0,1 -9,9 z")
            .replace(/%cw/gi, contentWidth/2 - 21)
            .replace(/%ch/gi, statementHeight + 4)
            .replace(/%cih/gi, statementHeight - 50);
    },
    magnets: function() {
        var contentWidth = 124;
        var contentHeight = 50;
        // apply scale required.
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: contentHeight + 55}
        };
    },
    box: function(blockView) {
        var contentWidth = 124;
        var statementHeight = Math.max(blockView._statements[0] ? blockView._statements[0].box.height : 50, 50);
        return {
            offsetX: -(contentWidth / 2 + 13), offsetY: 0,
            width: contentWidth + 26,
            height: statementHeight + 54,
            marginBottom: 0
        };
    },
    statementPos: function(blockView) {
        var height = 39;
        return [{
            x: 0, y: height
        }];
    },
    contentPos: function() {
        // apply scale required.
        return {x: -46, y: 25};
    }
};

Entry.skeleton.pebble_basic = {
    fontSize: 16,
    morph: [
        "prev", "next"
    ],
    path: function(blockView) {
        var block = blockView.block;
        var isPrevSame = block.prev && block.prev._schema.skeleton === "pebble_basic";
        var isNextSame = block.next && block.next._schema.skeleton === "pebble_basic";

        return "m 0,9 a 9,9 0 0,0 9,-9 h 28 " +
            (isPrevSame ? "l 25,0 0,25" : "q 25,0 25,25") +
            (isNextSame ? "l 0,25 -25,0" : "q 0,25 -25,25") +
            "h -28 a 9,9 0 0,1 -18,0 h -28 " +
            (isNextSame ? "l -25,0 0,-25" : "q -25,0 -25,-25") +
            (isPrevSame ? "l 0,-25 25,0" : "q 0,-25 25,-25") +
            "h 28 a 9,9 0 0,0 9,9 z";
    },
    magnets: function() {
        // apply scale required.
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: 51}
        };
    },
    box: function() {
        return {
            offsetX: -62, offsetY: 0,
            width: 124,
            height: 50,
            marginBottom: 0
        };
    },
    contentPos: function() {
        // apply scale required.
        return {x: -46, y: 25};
    }
};

Entry.skeleton.basic_string_field = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(18, height + 2);
        width = Math.max(0, width - height + 4);
        return "m %h,0 h %w a %h,%h 0 1,1 0,%wh H %h A %h,%h 0 1,1 %h,0 z"
            .replace(/%wh/gi, height)
            .replace(/%w/gi, width)
            .replace(/%h/gi, height / 2);
    },
    color: "#000",
    outerLine: true,
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 5;
        var height = blockView ? blockView.contentHeight : 18;
        return {
            offsetX: 0, offsetY: 0,
            width: width + 4,
            height: Math.max(height + 2, 18),
            marginBottom: 0
        };
    },
    magnets: function() {
        return {
            string: {}
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 16);
        return {x: 2, y: height / 2 + 1};
    }
};

Entry.skeleton.basic_boolean_field = {
    path: function(blockView) {
        var width = blockView.contentWidth;
        var height = blockView.contentHeight;
        height = Math.max(18, height + 2);
        width = Math.max(0, width - height + 9);
        return "m %h,0 h %w l %h,%h -%h,%h H %h l -%h,-%h %h,-%h z "
            .replace(/%wh/gi, height)
            .replace(/%w/gi, width)
            .replace(/%h/gi, height / 2);
    },
    color: "#000",
    outerLine: true,
    box: function(blockView) {
        var width = blockView ? blockView.contentWidth : 5;
        var height = blockView ? blockView.contentHeight : 18;
        return {
            offsetX: 0, offsetY: 0,
            width: width + 8,
            height: Math.max(height + 2, 18),
            marginBottom: 0
        };
    },
    magnets: function() {
        return {
            bool: {}
        };
    },
    contentPos: function(blockView) {
        // apply scale required.
        var height = Math.max(blockView.contentHeight, 16);
        return {x: 4, y: height / 2 + 1};
    }
};

Entry.skeleton.basic_button = {
    path: function() {
        return "m -64,0 h 128 a 6,6 0, 0,1 6,6 v 18 a 6,6 0, 0,1 -6,6 h -128 a 6,6 0, 0,1 -6,-6 v -18 a 6,6 0, 0,1 6,-6 z";
    },
    box: function() {
        return {
            offsetX: -70, offsetY: 0,
            width: 140,
            height: 30
        };
    },
    contentPos: function() {
        // apply scale required.
        return {x: 0, y: 15};
    },
    movable: false,
    readOnly: true
};

