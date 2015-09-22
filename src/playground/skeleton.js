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
        var width = Math.random() * 200;
        return "m 0,0 l 8,8 8,-8 h %w a 15,15 0 0,1 0,30 h -%w l -8,8 -8,-8 v -30 z".replace(/%w/gi, width);
    },
    magnets: function() {
        return {
            previous: {x: 0, y: 0},
            next: {x: 0, y: 31}
        };
    },
    contentPos: function() {
        return {x: 16, y: 15};
    }
};
