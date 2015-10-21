"use strict";
goog.require('Entry.STATIC');

Entry.block.run = {
    skeleton: "basic",
    color: "#3BBD70",
    contents: [
        "this is",
        "basic block"
    ],
    func: function() {

    }
};


Entry.block.jr_start = {
    skeleton: "pebble_event",
    color: "#3BBD70",
    contents: [
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_play_image.png",
            highlightColor: "#3BBD70",
            size: 22
        }
    ],
    func: function() {
        return Entry.STATIC.RETURN;
    }
};

Entry.block.jr_repeat = {
    skeleton: "pebble_loop",
    color: "#3BBD70",
    contents: [
        "1",
        "반복"
    ],
    func: function() {
        console.log('repeat');

    }
};

Entry.block.jr_item = {
    skeleton: "pebble_basic",
    color: "#F46C6C",
    contents: [
        "꽃 모으기",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_item_image.png",
            highlightColor: "#FFF",
            position: {x: 83, y: 0},
            size: 22
        }
    ],
    func: function() {

    }
};

Entry.block.jr_north = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "   위로",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_up_image.png",
            position: {x: 83, y: 0},
            size: 22
        }
    ],
    func: function() {
        console.log('up');
        return Entry.STATIC.RETURN;
    }
};

Entry.block.jr_east = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "오른쪽",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_right_image.png",
            position: {x: 83, y: 0},
            size: 22
        }
    ],
    func: function() {
        console.log('east');
        return Entry.STATIC.RETURN;
    }
};

Entry.block.jr_south = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "아래로",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_down_image.png",
            position: {x: 83, y: 0},
            size: 22
        }
    ],
    func: function() {
        console.log('south');
        return Entry.STATIC.RETURN;

    }
};

Entry.block.jr_west = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "   왼쪽",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_left_image.png",
            position: {x: 83, y: 0},
            size: 22
        }
    ],
    func: function() {
        console.log('west');
        return Entry.STATIC.RETURN;
    }
};
