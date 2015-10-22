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
        return Entry.STATIC.RETURN;
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
        var entities = Ntry.entityManager.getEntitiesByComponent(
        Ntry.STATIC.UNIT);

        for (var key in entities)
            this._unit = entities[key];

        this.unitComp = Ntry.entityManager.getComponent(
        this._unit.id, Ntry.STATIC.UNIT);

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
        Ntry.dispatchEvent("unitAction", Ntry.STATIC.GET_ITEM);
        return Entry.STATIC.RETURN;
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
          
        if (!this.isContinue) {

            this.isContinue = true;
            this.isAction = true;
            var self = this;
            var callBack = function() {
                 self.isAction = false;
            };
            

            // turn direction
            switch (this.unitComp.direction) {
                case Ntry.STATIC.EAST: 
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, callBack);
                    break;
                case Ntry.STATIC.SOUTH: 
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, callBack);
                    break;
                case Ntry.STATIC.WEST: 
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, callBack);
                    break;
                default:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, callBack);
                    break;

            }
            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
            return Entry.STATIC.RETURN;
        }

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
        if (!this.isContinue) {
            this.isContinue = true;
            this.isAction = true;
            var self = this;
            var callBack = function() {
                self.isAction = false;
            };
            Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, callBack);
            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;

            return Entry.STATIC.RETURN;
        }
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
        return Entry.STATIC.RETURN;
    }
};
