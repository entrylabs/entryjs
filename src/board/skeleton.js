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
        var width = block.contentWidth;
        return "m 0,0 l 8,8 8,-8 h %w a 15,15 0 0,1 0,30 h -%w l -8,8 -8,-8 v -30 z"
            .replace(/%w/gi, width);
    },
    magnets: function() {
        // apply scale required.
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: 31}
        };
    },
    contentPos: function() {
        // apply scale required.
        return {x: 16 + 4, y: 15};
    }
};

Entry.skeleton.pebble_basic = {
    path: function(block) {
        return "m 0,9 a 9,9 0 0,0 9,-9 h 24 a 25,25 0 0,1 0,50 h -24 a 9,9 0 0,1 -18,0 h -24 a 25,25 0 0,1 0,-50 h 24 a 9,9 0 0,0 9,9 z"
    },
    magnets: function() {
        // apply scale required.
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: 51}
        };
    },
    contentPos: function() {
        // apply scale required.
        return {x: -46, y: 25};
    }
};
