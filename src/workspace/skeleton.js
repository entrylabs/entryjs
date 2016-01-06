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
    path: function(block) {
        var width = block.contentWidth;
        width = Math.max(0, width - 6);
        return "m -8,0 l 8,8 8,-8 h %w a 15,15 0 0,1 0,30 h -%w l -8,8 -8,-8 v -30 z"
            .replace(/%w/gi, width);
    },
    box: function(block) {
        var width = block ? block.contentWidth : 150;
        return {
            offsetX: -8, offsetY: 0,
            width: width + 30,
            height: 30,
            marginBottom: 0
        };
    },
    magnets: {
        // apply scale required.
        previous: {},
        next: {x: 0, y: 31}
    },
    contentPos: function(block) {
        // apply scale required.
        return {x: 14, y: 15};
    }

};

Entry.skeleton.basic_event = {
    path: function(block) {
        var width = block.contentWidth;
        width = Math.max(0, width);
        return ("m -8,0 m 0,-5 a 19.5,19.5 0, 0,1 16,0 c 10,5 15,5 20,5 h %w " +
            "a 15,15 0 0,1 0,30 H 8 l -8,8 -8,-8 l 0,0.5 a 19.5,19.5 0, 0,1 0,-35 z")
            .replace(/%w/gi, width - 30);
    },
    box: function(block) {
        return {
            offsetX: 0, offsetY: 0,
            width: block.contentWidth + 30,
            height: 30,
            marginBottom: 0
        };
    },
    magnets: {
        // apply scale required.
        previous: {},
        next: {x: 0, y: 31}
    },
    contentPos: function(block) {
        // apply scale required.
        return {x: 1, y: 15};
    }
};

Entry.skeleton.basic_loop = {
    path: function(block) {
        var contentWidth = Math.max(0, block.contentWidth - 6);
        var contentHeight = Math.max(block.contentHeight, 25);
        return ("m -8,0 l 8,8 8,-8 h %cw a 15,15 0 0,1 0,30 H 24 l -8,8 -8,-8 h -0.4 v %ch h 0.4 l 8,8 8,-8 h %cw h -8 a 8,8 0 0,1 0,16 H 8 l -8,8 -8,-8 z")
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
    box: function(block) {
        var contentWidth = block.contentWidth;
        var contentHeight = Math.max(block.contentHeight, 25);
        return {
            offsetX: -8, offsetY: 0,
            width: contentWidth + 30,
            height: contentHeight + 46,
            marginBottom: 0
        };
    },
    contentPos: function() {
        // apply scale required.
        return {x: 14, y: 15};
    }
};


Entry.skeleton.basic_define = {
    path: function(block) {
        var contentWidth = Math.max(0, block.contentWidth - 6);
        var contentHeight = Math.max(block.contentHeight, 25);
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
    box: function(block) {
        var contentWidth = block.contentWidth;
        var contentHeight = Math.max(block.contentHeight, 25);
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
    path: function(block) {
        var width = block.contentWidth;
        return "m 0,0 a 25,25 0 0,1 9,48.3 a 9,9 0 0,1 -18,0 a 25,25 0 0,1 9,-48.3 z";
    },
    box: function(block) {
        return {
            offsetX: -25, offsetY: 0,
            width: 50,
            height: 48.3,
            marginBottom: 0
        };
    },
    magnets: function(block) {
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
    path: function(block) {
        var contentWidth = 124;
        var contentHeight = Math.max(block.contentHeight, 50);
        return ("M 0,9 a 9,9 0 0,0 9,-9 h %cw q 25,0 25,25 v %ch q 0,25 -25,25 h -%cw a 9,9 0 0,1 -18,0 " +
            "h -%cw q -25,0 -25,-25 v -%ch q 0,-25 25,-25 h %cw a 9,9 0 0,0 9,9 " +
            "M 0,49 a 9,9 0 0,1 -9,-9 h -28 a 25,25 0 0,0 -25,25 v %cih a 25,25 0 0,0 25,25 h 28 a 9,9 0 0,0 18,0 " +
            "h 28 a 25,25 0 0,0 25,-25 v -%cih a 25,25 0 0,0 -25,-25 h -28 a 9,9 0 0,1 -9,9 z")
            .replace(/%cw/gi, contentWidth/2 - 21)
            .replace(/%ch/gi, contentHeight + 4)
            .replace(/%cih/gi, contentHeight - 50);
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
    box: function(block) {
        var contentWidth = 124;
        var contentHeight = Math.max(block.contentHeight, 50);
        return {
            offsetX: -(contentWidth / 2 + 13), offsetY: 0,
            width: contentWidth + 26,
            height: contentHeight + 54,
            marginBottom: 0
        };
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

Entry.skeleton.basic_field = {
    path: function(block) {
        var width = block.contentWidth;
        var height = block.contentHeight;
        width = Math.max(0, width - 2);
        height = Math.max(0, height + 6);
        return "m 11,0 h %w a 10,10 0 1,1 0,%h H 11 a 10,10 0 1,1 0,-%h z"
            .replace(/%w/gi, width)
            .replace(/%h/gi, height);
    },
    box: function(block) {
        var width = block ? block.contentWidth : 150;
        var height = block.contentHeight;
        return {
            offsetX: 0, offsetY: 0,
            width: width + 10,
            height: height,
            marginBottom: 0
        };
    },
    magnets: {
        // apply scale required.
        previous: {},
        next: {x: 0, y: 31}
    },
    contentPos: function(block) {
        // apply scale required.
        return {x: 11, y: 11};
    }

};

