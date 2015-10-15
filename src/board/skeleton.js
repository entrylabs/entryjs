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
        return "m 0,0 l 8,8 8,-8 h %w a 15,15 0 0,1 0,30 h -%w l -8,8 -8,-8 v -30 z"
            .replace(/%w/gi, width);
    },
    box: function(block) {
        return {
            offsetX: 0, offsetY: 0,
            width: block.contentWidth + 30,
            height: 30
        }
    },
    magnets: function(block) {
        // apply scale required.
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: 31}
        };
    },
    contentPos: function(block) {
        // apply scale required.
        return {x: 16 + 4, y: 15};
    }
};

Entry.skeleton.pebble_event = {
    path: function(block) {
        var width = block.contentWidth;
        return "m 0,0 a 25,25 0 0,1 9,48.3 a 9,9 0 0,1 -18,0 a 25,25 0 0,1 9,-48.3 z"
    },
    box: function(block) {
        return {
            offsetX: -25, offsetY: 0,
            width: 50,
            height: 50
        }
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
    path: function(block) {
        var contentWidth = 124;
        var contentHeight = 50;
        return ("M 0,9 a 9,9 0 0,0 9,-9 h %cw a 25,25 0 0,1 25,25 v %ch a 25,25 0 0,1 -25,25 h -%cw a 9,9 0 0,1 -18,0 " +
            "h -%cw a 25,25 0 0,1 -25,-25 v -%ch a 25,25 0 0,1 25,-25 h %cw a 9,9 0 0,0 9,9 Z" +
            "M 0,40 a 9,9 0 0,0 9,-9 h 28 a 25,25 0 0,1 25,25 v %cih a 25,25 0 0,1 -25,25 h -28 a 9,9 0 0,1 -18,0 " +
            "h -28 a 25,25 0 0,1 -25,-25 v -%cih a 25,25 0 0,1 25,-25 h 28 a 9,9 0 0,0 9,9 Z")
            .replace(/%cw/gi, contentWidth/2 - 21)
            .replace(/%ch/gi, contentHeight + 4)
            .replace(/%cih/gi, contentHeight + -50);
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
            height: 50
        }
    },
    contentPos: function() {
        // apply scale required.
        return {x: -46, y: 25};
    }
};

Entry.skeleton.pebble_basic = {
    path: function(block) {
        return "m 0,9 a 9,9 0 0,0 9,-9 h 28 a 25,25 0 0,1 0,50 h -28 a 9,9 0 0,1 -18,0 h -28 a 25,25 0 0,1 0,-50 h 28 a 9,9 0 0,0 9,9 z"
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
            height: 50
        }
    },
    contentPos: function() {
        // apply scale required.
        return {x: -46, y: 25};
    }
};
