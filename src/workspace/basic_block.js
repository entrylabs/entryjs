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
    event: "start",
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

        Ntry.unitComp = Ntry.entityManager.getComponent(
        this._unit.id, Ntry.STATIC.UNIT);
    }
};

Entry.block.jr_repeat = {
    skeleton: "pebble_loop",
    color: "#127CDB",
    contents: [
        {
            type: "Dropdown",
            key: "REPEAT",
            options: [1,2,3,4,5,6,7,8,9,10],
            value: 1
        },
        "반복",
        {
            type: "Statement",
            key: "STATEMENT",
            accept: "pebble_basic"
        }
    ],
    func: function() {
        if (this.repeatCount === undefined) {
            this.repeatCount = this.block.values.REPEAT;
            return Entry.STATIC.CONTINUE;
        } else if (this.repeatCount > 0) {
            console.log(this.repeatCount);
            this.repeatCount--;
            this.executor.stepInto(this.block.values.STATEMENT);
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.repeatCount;
        }
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
        if (!this.isContinue) {
            this.isContinue = true;
            this.isAction = true;
            var self = this;
            var callBack = function() {
                Ntry.dispatchEvent("getItem");
                self.isAction = false;
            };
            Ntry.dispatchEvent("unitAction", Ntry.STATIC.GET_ITEM , callBack);
            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;

        }
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
                window.setTimeout(
                    function() { Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
                        self.isAction = false;
                        }
                    );}, 3);
            };
            switch (Ntry.unitComp.direction) {
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
                    callBack();
                    break;

            }
            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
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
                window.setTimeout(
                    function() { Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK,
                        function() { self.isAction = false; } );}, 3);
            };

            // turn direction
            switch (Ntry.unitComp.direction) {
                case Ntry.STATIC.SOUTH:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, callBack);
                    break;
                case Ntry.STATIC.WEST:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, callBack);
                    break;
                case Ntry.STATIC.NORTH:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, callBack);
                    break;
                default:
                    callBack();
                    break;

            }
            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }
    }
};

Entry.block.jr_south = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "아래쪽",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_down_image.png",
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
                window.setTimeout(
                    function() { Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK,
                        function() { self.isAction = false; } );}, 3);
            };

            // turn direction
            switch (Ntry.unitComp.direction) {
                case Ntry.STATIC.EAST:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, callBack);
                    break;
                case Ntry.STATIC.NORTH:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, callBack);
                    break;
                case Ntry.STATIC.WEST:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, callBack);
                    break;
                default:
                    callBack();
                    break;

            }
            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }


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
        if (!this.isContinue) {

            this.isContinue = true;
            this.isAction = true;
            var self = this;
            var callBack = function() {
                window.setTimeout(
                    function() { Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK,
                        function() { self.isAction = false; } );}, 3);
            };

            // turn direction
            switch (Ntry.unitComp.direction) {
                case Ntry.STATIC.SOUTH:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, callBack);
                    break;
                case Ntry.STATIC.EAST:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.HALF_ROTATION, callBack);
                    break;
                case Ntry.STATIC.NORTH:
                    Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, callBack);
                    break;
                default:
                    callBack();
                    break;
            }
            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }
    }
};

//maze 명세의 주니버 시작

Entry.block.jr_go_straight = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "앞으로 가기",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/cparty_go_straight.png",
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
            Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, callBack);

            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }
    }
};

Entry.block.jr_turn_left = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "왼쪽으로 돌기",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/cparty_rotate_l.png",
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
            Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, callBack);

            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }
    }
};

Entry.block.jr_turn_right = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "오른쪽으로 돌기",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/cparty_rotate_r.png",
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
            Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, callBack);

            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }
    }
};

Entry.block.jr_go_slow = {
    skeleton: "pebble_basic",
    color: "#A751E3",
    contents: [
        "천천히 가기",
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/cparty_rotate_r.png",
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
            Ntry.dispatchEvent("unitAction", Ntry.STATIC.GO_SLOW, callBack);

            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }
    }
};

