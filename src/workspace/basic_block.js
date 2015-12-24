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
    template: "%1",
    params: [
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
    template: "%1 반복",
    params: [
        {
            type: "Dropdown",
            options: [
                [1,1],
                [2,2],
                [3,3],
                [4,4],
                [5,5],
                [6,6],
                [7,7],
                [8,8],
                [9,9],
                [10,10]
            ],
            value: 3,
            fontSize: 14,
            roundValue: 3
        }
    ],
    statements: [
        {
            accept: "pebble_basic",
            position: {
                 x: 46,
                 y: 14
            }
        }
    ],
    func: function() {
        if (this.repeatCount === undefined) {
            this.repeatCount = this.block.params[0];
            return Entry.STATIC.CONTINUE;
        } else if (this.repeatCount > 0) {
            this.repeatCount--;
            this.executor.stepInto(this.block.statements[0]);
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.repeatCount;
        }
    }
};

Entry.block.jr_item = {
    skeleton: "pebble_basic",
    color: "#F46C6C",
    template: "꽃 모으기 %1",
    params: [
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

Entry.block.cparty_jr_item = {
    skeleton: "pebble_basic",
    color: "#8ABC1D",
    template: "연필 줍기 %1",
    params: [
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/cpartyjr/pen.png",
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
    template: "위쪽 %1",
    params: [
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
            var STATIC = Ntry.STATIC;
            var self = this;
            var callBack = function() {
                window.setTimeout(
                    function() { Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
                        self.isAction = false;
                        }
                    );}, 3);
            };
            var actionType;
            switch (Ntry.unitComp.direction) {
                case Ntry.STATIC.EAST:
                    actionType = STATIC.TURN_LEFT;
                    break;
                case Ntry.STATIC.SOUTH:
                    actionType = STATIC.HALF_ROTATION;
                    break;
                case Ntry.STATIC.WEST:
                    actionType = STATIC.TURN_RIGHT;
                    break;
                default:
                    callBack();
                    break;
            }
            if (actionType)
                Ntry.dispatchEvent("unitAction", actionType, callBack);
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
    template: "오른쪽 %1",
    params: [
        {
            type: "Indicator",
            img: "/img/assets/ntry/bitmap/jr/block_right_image.png",
            position: {x: 83, y: 0},
            size: 22
        }
    ],
    func: function() {
        var STATIC = Ntry.STATIC;

         if (!this.isContinue) {
            this.isContinue = true;
            this.isAction = true;
            var self = this;
            var callBack = function() {
                window.setTimeout(
                    function() {
                        Ntry.dispatchEvent(
                            "unitAction",
                            STATIC.WALK,
                            function() { self.isAction = false; } );},
                    3);
            };

            // turn direction
            var actionType;
            switch (Ntry.unitComp.direction) {
                case STATIC.SOUTH:
                    actionType = STATIC.TURN_LEFT;
                    break;
                case STATIC.WEST:
                    actionType = STATIC.HALF_ROTATION;
                    break;
                case STATIC.NORTH:
                    actionType = STATIC.TURN_RIGHT;
                    break;
                default:
                    callBack();
                    break;
            }
            if (actionType)
                Ntry.dispatchEvent("unitAction", actionType, callBack);
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
    template: "아래쪽 %1",
    params: [
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
            var STATIC = Ntry.STATIC;
            var self = this;
            var callBack = function() {
                window.setTimeout(
                    function() {
                        Ntry.dispatchEvent(
                            "unitAction",
                            Ntry.STATIC.WALK,
                            function() { self.isAction = false; } );},
                3);
            };

            // turn direction
            var actionType;
            switch (Ntry.unitComp.direction) {
                case STATIC.EAST:
                    actionType = STATIC.TURN_RIGHT;
                    break;
                case STATIC.NORTH:
                    actionType = STATIC.HALF_ROTATION;
                    break;
                case STATIC.WEST:
                    actionType = STATIC.TURN_LEFT;
                    break;
                default:
                    callBack();
                    break;
            }
            if (actionType)
                Ntry.dispatchEvent("unitAction", actionType, callBack);
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
    template: "왼쪽 %1",
    params: [
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
            var STATIC = Ntry.STATIC;
            var self = this;
            var callBack = function() {
                window.setTimeout(
                    function() { Ntry.dispatchEvent(
                        "unitAction",
                        STATIC.WALK,
                        function() { self.isAction = false; } );},
                3);
            };

            // turn direction
            var actionType;
            switch (Ntry.unitComp.direction) {
                case STATIC.SOUTH:
                    actionType = STATIC.TURN_RIGHT;
                    break;
                case STATIC.EAST:
                    actionType = STATIC.HALF_ROTATION;
                    break;
                case STATIC.NORTH:
                    actionType = STATIC.TURN_LEFT;
                    break;
                default:
                    callBack();
                    break;
            }
            if (actionType)
                Ntry.dispatchEvent("unitAction", actionType, callBack);
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
Entry.block.jr_start_basic = {
    skeleton: "basic_event",
    event: "start",
    color: "#3BBD70",
    template: "%1 시작 버튼을 눌렀을 떄",
    params: [
        {
            type: "Indicator",
            boxMultiplier: 1,
            img: "/img/assets/block_icon/start_icon_play.png",
            highlightColor: "#3BBD70",
            size: 17,
            position: {
                 x: 0, y: -2
            }
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

Entry.block.jr_go_straight = {
    skeleton: "basic",
    color: "#A751E3",
    template: "앞으로 가기 %1",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/cparty_go_straight.png",
            size: 24
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
    skeleton: "basic",
    color: "#A751E3",
    template: "왼쪽으로 돌기 %1",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/cparty_rotate_l.png",
            size: 24
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
    skeleton: "basic",
    color: "#A751E3",
    template: "오른쪽으로 돌기 %1",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/cparty_rotate_r.png",
            size: 24
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
    skeleton: "basic",
    color: "#f46c6c",
    template: "천천히 가기 %1",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/cparty_go_slow.png",
            size: 24
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

Entry.block.jr_repeat_until_dest = {
    skeleton: "basic_loop",
    color: "#498DEB",
    template: "%1 만날 때 까지 반복하기 %2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/jr_goal_image.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/for.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        var statement = this.block.statements[0];
        if (statement.getBlocks().length === 1)
            return;

        this.executor.stepInto(statement);
        return Entry.STATIC.CONTINUE;
    }
};

Entry.block.jr_if_construction = {
    skeleton: "basic_loop",
    color: "#498DEB",
    template: "만약 %1 앞에 있다면 %2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/jr_construction_image.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/for.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        if (this.isContinue)
            return;
        var entities = Ntry.entityManager.getEntitiesByComponent(
        Ntry.STATIC.UNIT);

        var entity;
        for (var key in entities)
            entity = entities[key];

        var unitComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.UNIT);
        var gridComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.GRID);

        var grid = {x: gridComp.x, y: gridComp.y};
        Ntry.addVectorByDirection(grid, unitComp.direction, 1);

        var fitEntities = Ntry.entityManager.find(
            {
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y
            },
            {
                type: Ntry.STATIC.TILE,
                tileType: Ntry.STATIC.OBSTACLE_REPAIR
            }
        );

        this.isContinue = true;

        var statement = this.block.statements[0];
        if (fitEntities.length === 0) return;
        else if (statement.getBlocks().length === 1) return;
        else {
            this.executor.stepInto(statement);
            return Entry.STATIC.CONTINUE;
        }
    }
};

Entry.block.jr_if_speed = {
    skeleton: "basic_loop",
    color: "#498DEB",
    template: "만약 %1 앞에 있다면 %2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/jr_speed_image.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/for.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function()  {
        if (this.isContinue)
            return;
        var entities = Ntry.entityManager.getEntitiesByComponent(
        Ntry.STATIC.UNIT);

        var entity;
        for (var key in entities)
            entity = entities[key];

        var unitComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.UNIT);
        var gridComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.GRID);

        var grid = {x: gridComp.x, y: gridComp.y};
        Ntry.addVectorByDirection(grid, unitComp.direction, 1);

        var fitEntities = Ntry.entityManager.find(
            {
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y
            },
            {
                type: Ntry.STATIC.TILE,
                tileType: Ntry.STATIC.OBSTACLE_SLOW
            }

        );

        this.isContinue = true;

        var statement = this.block.statements[0];
        if (fitEntities.length === 0) return;
        else if(statement.getBlocks().length === 1) return;
        else {
            this.executor.stepInto(statement);
            return Entry.STATIC.CONTINUE;
        }
    }
};

// Entry.block.jr_promise_call = Entry.block.jr_promise_wrap;
// maze start block

Entry.block.maze_step_start = {
    skeleton: "basic_event",
    mode: "maze",
    event: "start",
    color: "#3BBD70",
    template: "%1 시작하기를 클릭했을 때",
    syntax: ["Program"],
    params: [
        {
            type: "Indicator",
            boxMultiplier: 1,
            img: "/img/assets/block_icon/start_icon_play.png",
            highlightColor: "#3BBD70",
            size: 17,
            position: {
                 x: 0, y: -2
            }
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

Entry.block.maze_step_jump = {
    skeleton: "basic",
    mode: "maze",
    color: "#FF6E4B",
    template: "뛰어넘기%1",
    params: [
        {
            type: "Image",
            img: "/img/assets/week/blocks/jump.png",
            size: 24
        }
    ],
    syntax: ["this", "jump"],
    func: function() {
        if (!this.isContinue) {

            this.isContinue = true;
            this.isAction = true;
            var self = this;
            var callBack = function() {
                self.isAction = false;
            };

            // turn direction

            Ntry.dispatchEvent("unitAction", Ntry.STATIC.JUMP, callBack);

            return Entry.STATIC.CONTINUE;
        } else if (this.isAction) {
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.isAction;
            delete this.isContinue;
        }
    }
};

Entry.block.maze_step_for = {
    skeleton: "basic_loop",
    mode: "maze",
    color: "#127CDB",
    template: "%1 번 반복하기%2",
    params: [
        {
            type: "Dropdown",
            key: "REPEAT",
            options: [
                [1,1],
                [2,2],
                [3,3],
                [4,4],
                [5,5],
                [6,6],
                [7,7],
                [8,8],
                [9,9],
                [10,10]
            ],
            value: 1
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/for.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        if (this.repeatCount === undefined) {
            this.repeatCount = this.block.params[0];
            return Entry.STATIC.CONTINUE;
        } else if (this.repeatCount > 0) {
            this.repeatCount--;
            this.executor.stepInto(this.block.statements[0]);
            return Entry.STATIC.CONTINUE;
        } else {
            delete this.repeatCount;
        }
    }
};

Entry.block.test = {
    skeleton: "basic",
    mode: "maze",
    color: "#3BBD70",
    template: "키를 눌렀을 때 %1",
    params: [
        {
            type: "Angle",
            value: 550
        }
    ],
    func: function() {
    }
};

Entry.block.maze_repeat_until_1 = {
    skeleton: "basic_loop",
    mode: "maze",
    color: "#498DEB",
    template: "%1 만날 때 까지 반복%2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/block_inner/repeat_goal_1.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/for.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        var statement = this.block.statements[0];
        if (statement.getBlocks().length === 1)
            return;

        this.executor.stepInto(statement);
        return Entry.STATIC.CONTINUE;
    }
};


Entry.block.maze_step_if_1 = {
    skeleton: "basic_loop",
    mode: "maze",
    color: "#498DEB",
    template: "만약 앞에 %1 있다면%2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/block_inner/if_target_1.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/if.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        if (this.isContinue)
            return;
        var entities = Ntry.entityManager.getEntitiesByComponent(
        Ntry.STATIC.UNIT);

        var entity;
        for (var key in entities)
            entity = entities[key];

        var unitComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.UNIT);
        var gridComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.GRID);

        var grid = {x: gridComp.x, y: gridComp.y};
        Ntry.addVectorByDirection(grid, unitComp.direction, 1);

        var existEntities = Ntry.entityManager.find(
        {
            type: Ntry.STATIC.GRID,
            x: grid.x,
            y: grid.y
        });

        var statement = this.block.statements[0];

        if (existEntities.length === 0) {
            this.executor.stepInto(statement);
            return Entry.STATIC.CONTINUE;
        }



        var fitEntities = Ntry.entityManager.find(
            {
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y
            },
            {
                type: Ntry.STATIC.TILE,
                tileType: Ntry.STATIC.WALL
            }
        );

        this.isContinue = true;


        if (fitEntities.length === 0) {
            return;
        } else if (statement.getBlocks().length === 1)
            return;
        else {
            this.executor.stepInto(statement);
            return Entry.STATIC.CONTINUE;
        }
    }
};

Entry.block.maze_step_if_2 = {
    skeleton: "basic_loop",
    mode: "maze",
    color: "#498DEB",
    template: "만약 앞에 %1 있다면%2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/maze2/obstacle_01.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/if.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        if (this.isContinue)
            return;
        var entities = Ntry.entityManager.getEntitiesByComponent(
        Ntry.STATIC.UNIT);

        var entity;
        for (var key in entities)
            entity = entities[key];

        var unitComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.UNIT);
        var gridComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.GRID);

        var grid = {x: gridComp.x, y: gridComp.y};
        Ntry.addVectorByDirection(grid, unitComp.direction, 1);

        var fitEntities = Ntry.entityManager.find(
            {
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y
            },
            {
                type: Ntry.STATIC.TILE,
                tileType: Ntry.STATIC.OBSTACLE_BEE
            }
        );

        this.isContinue = true;

        var statement = this.block.statements[0];
        if (fitEntities.length === 0) {
            return;
        } else if (statement.getBlocks().length === 1)
            return;
        else {
            this.executor.stepInto(statement);
            return Entry.STATIC.CONTINUE;
        }
    }
};

Entry.block.maze_call_function = {
    skeleton: "basic",
    mode: "maze",
    color: "#B57242",
    template: "약속 불러오기%1",
    params: [
        {
            type: "Image",
            img: "/img/assets/week/blocks/function.png",
            size: 24
        }
    ],
    func: function() {
        if (!this.funcExecutor) {
            var codes = Ntry.entityManager.getEntitiesByComponent(
            Ntry.STATIC.CODE);

            for (var key in codes) {
                var code = codes[key].components[Ntry.STATIC.CODE].code;
                this.funcExecutor = new Entry.Executor(
                    code.getEventMap("define")[0]
                );
            }
        }

        this.funcExecutor.execute();
        if (this.funcExecutor.scope.block === null)
            return;
        else
            return Entry.STATIC.CONTINUE;
    }
};

Entry.block.maze_define_function = {
    skeleton: "basic_define",
    mode: "maze",
    color: "#B57242",
    event: "define",
    template: "약속하기%1",
    params: [
        {
            type: "Image",
            img: "/img/assets/week/blocks/function.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function(executor) {
        if (this.executed)
            return;
        this.executor.stepInto(this.block.statements[0]);
        this.executed = true;
        return Entry.STATIC.CONTINUE;
    }
};

Entry.block.maze_step_if_3 = {
    skeleton: "basic_loop",
    mode: "maze",
    color: "#498DEB",
    template: "만약 앞에 %1 있다면%2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/block_inner/if_target_3.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/if.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        if (this.isContinue)
            return;
        var entities = Ntry.entityManager.getEntitiesByComponent(
        Ntry.STATIC.UNIT);

        var entity;
        for (var key in entities)
            entity = entities[key];

        var unitComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.UNIT);
        var gridComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.GRID);

        var grid = {x: gridComp.x, y: gridComp.y};
        Ntry.addVectorByDirection(grid, unitComp.direction, 1);

        var fitEntities = Ntry.entityManager.find(
            {
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y
            },
            {
                type: Ntry.STATIC.TILE,
                tileType: Ntry.STATIC.OBSTACLE_BANANA
            }
        );

        this.isContinue = true;

        var statement = this.block.statements[0];
        if (fitEntities.length === 0) {
            return;
        } else if (statement.getBlocks().length === 1)
            return;
        else {
            this.executor.stepInto(statement);
            return Entry.STATIC.CONTINUE;
        }
    }
};

Entry.block.maze_step_if_4 = {
    skeleton: "basic_loop",
    mode: "maze",
    color: "#498DEB",
    template: "만약 앞에 %1 있다면%2",
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/block_inner/if_target_2.png",
            size: 18
        },
        {
            type: "Image",
            img: "/img/assets/week/blocks/if.png",
            size: 24
        }
    ],
    statements: [
        {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        }
    ],
    func: function() {
        if (this.isContinue)
            return;
        var entities = Ntry.entityManager.getEntitiesByComponent(
        Ntry.STATIC.UNIT);

        var entity;
        for (var key in entities)
            entity = entities[key];

        var unitComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.UNIT);
        var gridComp = Ntry.entityManager.getComponent(
            entity.id, Ntry.STATIC.GRID);

        var grid = {x: gridComp.x, y: gridComp.y};
        Ntry.addVectorByDirection(grid, unitComp.direction, 1);

        var fitEntities = Ntry.entityManager.find(
            {
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y
            },
            {
                type: Ntry.STATIC.TILE,
                tileType: Ntry.STATIC.WALL
            }
        );

        this.isContinue = true;

        var statement = this.block.statements[0];
        if (fitEntities.length === 0) {
            return;
        } else if (statement.getBlocks().length === 1)
            return;
        else {
            this.executor.stepInto(statement);
            return Entry.STATIC.CONTINUE;
        }
    }
};

Entry.block.maze_step_move_step = {
    skeleton: "basic",
    mode: "maze",
    color: "#A751E3",
    template: "앞으로 한 칸 이동%1",
    syntax: ["this", "move"],
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/cparty_go_straight.png",
            size: 24
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

Entry.block.maze_step_rotate_left= {
    skeleton: "basic",
    mode: "maze",
    color: "#A751E3",
    template: "왼쪽으로 회전%1",
    syntax: ["this", "left"],
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/cparty_rotate_l.png",
            size: 24
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

Entry.block.maze_step_rotate_right = {
    skeleton: "basic",
    mode: "maze",
    color: "#A751E3",
    template: "오른쪽으로 회전%1",
    syntax: ["this", "right"],
    params: [
        {
            type: "Image",
            img: "/img/assets/ntry/bitmap/jr/cparty_rotate_r.png",
            size: 24
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

