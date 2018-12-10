module.exports = {
    getBlocks() {
        function moveInToBound(object, wall) {
            if (wall.up.y > object.y) {
                object.y = wall.up.y;
            }

            if (wall.down.y < object.y) {
                object.y = wall.down.y;
            }

            if (wall.right.x < object.x) {
                object.x = wall.right.x;
            }

            if (wall.left.x > object.x) {
                object.x = wall.left.x;
            }
        }

        return {
            move_direction: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'move_direction',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'move_direction',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'walk',
                isNotFor: [],
                func(sprite, script) {
                    const value = script.getNumberValue('VALUE', script);
                    sprite.setX(
                        sprite.getX() +
                            value *
                                Math.cos(
                                    (sprite.getRotation() + sprite.getDirection() - 90) /
                                        180 *
                                        Math.PI
                                )
                    );
                    sprite.setY(
                        sprite.getY() -
                            value *
                                Math.sin(
                                    (sprite.getRotation() + sprite.getDirection() - 90) /
                                        180 *
                                        Math.PI
                                )
                    );
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.move_to_direction(%1)'] },
            },
            bounce_wall: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'bounce_wall',
                },
                class: 'walk',
                isNotFor: [],
                func(sprite, script) {
                    const threshold = 0;
                    const method = sprite.parent.getRotateMethod();

                    let angle;
                    if (method === 'free') {
                        angle = (sprite.getRotation() + sprite.getDirection()).mod(360);
                    } else {
                        angle = sprite.getDirection();
                    }

                    let skip = Entry.Utils.COLLISION.NONE;
                    if ((angle < 90 && angle >= 0) || (angle < 360 && angle >= 270)) {
                        skip = sprite.collision == Entry.Utils.COLLISION.UP;
                        let up = ndgmr.checkPixelCollision(
                            Entry.stage.wall.up,
                            sprite.object,
                            threshold,
                            false
                        );
                        if (!up && skip) {
                            sprite.collision = Entry.Utils.COLLISION.NONE;
                        }

                        if (up && skip) {
                            up = false;
                        }

                        if (up) {
                            if (method === 'free') {
                                sprite.setRotation(
                                    -sprite.getRotation() - sprite.getDirection() * 2 + 180
                                );
                            } else {
                                sprite.setDirection(-sprite.getDirection() + 180);
                            }

                            sprite.collision = Entry.Utils.COLLISION.UP;
                        } else {
                            skip = sprite.collision == Entry.Utils.COLLISION.DOWN;
                            let down = ndgmr.checkPixelCollision(
                                Entry.stage.wall.down,
                                sprite.object,
                                threshold,
                                false
                            );
                            if (!down && skip) {
                                sprite.collision = Entry.Utils.COLLISION.NONE;
                            }

                            if (down && skip) {
                                down = false;
                            }

                            if (down) {
                                if (method === 'free') {
                                    sprite.setRotation(
                                        -sprite.getRotation() - sprite.getDirection() * 2 + 180
                                    );
                                } else {
                                    sprite.setDirection(-sprite.getDirection() + 180);
                                }

                                sprite.collision = Entry.Utils.COLLISION.DOWN;
                            }
                        }
                    } else if (angle < 270 && angle >= 90) {
                        skip = sprite.collision == Entry.Utils.COLLISION.DOWN;
                        let down = ndgmr.checkPixelCollision(
                            Entry.stage.wall.down,
                            sprite.object,
                            threshold,
                            false
                        );
                        if (!down && skip) {
                            sprite.collision = Entry.Utils.COLLISION.NONE;
                        }

                        if (down && skip) {
                            down = false;
                        }

                        if (down) {
                            if (method === 'free') {
                                sprite.setRotation(
                                    -sprite.getRotation() - sprite.getDirection() * 2 + 180
                                );
                            } else {
                                sprite.setDirection(-sprite.getDirection() + 180);
                            }

                            sprite.collision = Entry.Utils.COLLISION.DOWN;
                            //sprite.setY(-135 + bound.height/2 + 1);
                        } else {
                            skip = sprite.collision == Entry.Utils.COLLISION.UP;
                            let up = ndgmr.checkPixelCollision(
                                Entry.stage.wall.up,
                                sprite.object,
                                threshold,
                                false
                            );
                            if (!up && skip) {
                                sprite.collision = Entry.Utils.COLLISION.NONE;
                            }

                            if (up && skip) {
                                up = false;
                            }

                            if (up) {
                                if (method === 'free') {
                                    sprite.setRotation(
                                        -sprite.getRotation() - sprite.getDirection() * 2 + 180
                                    );
                                } else {
                                    sprite.setDirection(-sprite.getDirection() + 180);
                                }

                                sprite.collision = Entry.Utils.COLLISION.UP;
                                //sprite.setY(135 - bound.height/2 - 1);
                            }
                        }
                    }
                    if (angle < 360 && angle >= 180) {
                        skip = sprite.collision == Entry.Utils.COLLISION.LEFT;
                        let left = ndgmr.checkPixelCollision(
                            Entry.stage.wall.left,
                            sprite.object,
                            threshold,
                            false
                        );
                        if (!left && skip) {
                            sprite.collision = Entry.Utils.COLLISION.NONE;
                        }

                        if (left && skip) {
                            left = false;
                        }

                        if (left) {
                            if (method === 'free') {
                                sprite.setRotation(
                                    -sprite.getRotation() - sprite.getDirection() * 2
                                );
                            } else {
                                sprite.setDirection(-sprite.getDirection() + 360);
                            }

                            sprite.collision = Entry.Utils.COLLISION.LEFT;
                        } else {
                            skip = sprite.collision == Entry.Utils.COLLISION.RIGHT;
                            let right = ndgmr.checkPixelCollision(
                                Entry.stage.wall.right,
                                sprite.object,
                                threshold,
                                false
                            );
                            if (!right && skip) {
                                sprite.collision = Entry.Utils.COLLISION.NONE;
                            }

                            if (right && skip) {
                                right = false;
                            }

                            if (right) {
                                if (method === 'free') {
                                    sprite.setRotation(
                                        -sprite.getRotation() - sprite.getDirection() * 2
                                    );
                                } else {
                                    sprite.setDirection(-sprite.getDirection() + 360);
                                }

                                sprite.collision = Entry.Utils.COLLISION.RIGHT;
                            }
                        }
                    } else if (angle < 180 && angle >= 0) {
                        skip = sprite.collision == Entry.Utils.COLLISION.RIGHT;
                        let right = ndgmr.checkPixelCollision(
                            Entry.stage.wall.right,
                            sprite.object,
                            threshold,
                            false
                        );
                        if (!right && skip) {
                            sprite.collision = Entry.Utils.COLLISION.NONE;
                        }

                        if (right && skip) {
                            right = false;
                        }

                        if (right) {
                            if (method === 'free') {
                                sprite.setRotation(
                                    -sprite.getRotation() - sprite.getDirection() * 2
                                );
                            } else {
                                sprite.setDirection(-sprite.getDirection() + 360);
                            }

                            sprite.collision = Entry.Utils.COLLISION.RIGHT;
                        } else {
                            skip = sprite.collision == Entry.Utils.COLLISION.LEFT;
                            let left = ndgmr.checkPixelCollision(
                                Entry.stage.wall.left,
                                sprite.object,
                                threshold,
                                false
                            );
                            if (!left && skip) {
                                sprite.collision = Entry.Utils.COLLISION.NONE;
                            }

                            if (left && skip) {
                                left = false;
                            }

                            if (left) {
                                if (method === 'free') {
                                    sprite.setRotation(
                                        -sprite.getRotation() - sprite.getDirection() * 2
                                    );
                                } else {
                                    sprite.setDirection(-sprite.getDirection() + 360);
                                }

                                sprite.collision = Entry.Utils.COLLISION.LEFT;
                            }
                        }
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.bounce_on_edge()'] },
            },
            move_x: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'move_x',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'move_x',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'move_relative',
                isNotFor: [],
                func(sprite, script) {
                    const value = script.getNumberValue('VALUE', script);
                    sprite.setX(sprite.getX() + value);
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_x(%1)'] },
            },
            move_y: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'move_y',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'move_y',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'move_relative',
                isNotFor: [],
                func(sprite, script) {
                    const value = script.getNumberValue('VALUE', script);
                    sprite.setY(sprite.getY() + value);
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_y(%1)'] },
            },
            move_xy_time: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['2'],
                        },
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'move_xy_time',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['C&value'],
                        },
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'move_xy_time',
                },
                paramsKeyMap: {
                    VALUE1: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                },
                class: 'move_relative',
                isNotFor: [],
                func(sprite, script) {
                    if (!script.isStart) {
                        let [timeValue, xValue, yValue] = script.getValues(
                            ['VALUE1', 'VALUE2', 'VALUE3'],
                            script
                        );
                        timeValue = Number(timeValue);
                        xValue = Number(xValue);
                        yValue = Number(yValue);

                        script.isStart = true;
                        script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                        script.dX = xValue / script.frameCount;
                        script.dY = yValue / script.frameCount;

                        if (script.frameCount == 1) {
                            action();
                        }
                    }

                    if (script.frameCount != 0) {
                        action();
                        return script;
                    } else {
                        delete script.isStart;
                        delete script.frameCount;
                        return script.callReturn();
                    }

                    function action() {
                        sprite.setX(sprite.getX() + script.dX);
                        sprite.setY(sprite.getY() + script.dY);
                        script.frameCount--;
                        if (sprite.brush && !sprite.brush.stop) {
                            sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                        }
                    }
                },
                syntax: { js: [], py: ['Entry.add_xy_for_sec(%2, %3, %1)'] },
            },
            locate_x: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'locate_x',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'locate_x',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'move_absolute',
                isNotFor: [],
                func(sprite, script) {
                    const value = script.getNumberValue('VALUE', script);
                    sprite.setX(value);
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_x(%1)'] },
            },
            locate_y: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'locate_y',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'locate_y',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'move_absolute',
                isNotFor: [],
                func(sprite, script) {
                    const value = script.getNumberValue('VALUE', script);
                    sprite.setY(value);
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_y(%1)'] },
            },
            locate_xy: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        null,
                    ],
                    type: 'locate_xy',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                    ],
                    type: 'locate_xy',
                },
                paramsKeyMap: {
                    VALUE1: 0,
                    VALUE2: 1,
                },
                class: 'move_absolute',
                isNotFor: [],
                func(sprite, script) {
                    let [value1, value2] = script.getValues(['VALUE1', 'VALUE2'], script);
                    value1 = Number(value1);
                    value2 = Number(value2);

                    sprite.setX(value1);
                    sprite.setY(value2);
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_xy(%1, %2)'] },
            },
            locate_xy_time: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['2'],
                        },
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'locate_xy_time',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['C&value'],
                        },
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'locate_xy_time',
                },
                paramsKeyMap: {
                    VALUE1: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                },
                class: 'move_absolute',
                isNotFor: [],
                func(sprite, script) {
                    if (!script.isStart) {
                        let [timeValue, xValue, yValue] = script.getValues(
                            ['VALUE1', 'VALUE2', 'VALUE3'],
                            script
                        );
                        timeValue = Number(timeValue);
                        xValue = Number(xValue);
                        yValue = Number(yValue);

                        script.x = xValue;
                        script.y = yValue;
                        script.isStart = true;
                        script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                        if (script.frameCount == 1) {
                            action();
                        }
                    }

                    if (script.frameCount != 0) {
                        action();
                        return script;
                    } else {
                        delete script.isStart;
                        delete script.frameCount;
                        return script.callReturn();
                    }

                    function action() {
                        let dX = script.x - sprite.getX();
                        let dY = script.y - sprite.getY();
                        dX /= script.frameCount;
                        dY /= script.frameCount;
                        sprite.setX(sprite.getX() + dX);
                        sprite.setY(sprite.getY() + dY);
                        script.frameCount--;
                        if (sprite.brush && !sprite.brush.stop) {
                            sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                        }
                    }
                },
                syntax: { js: [], py: ['Entry.set_xy_for_sec(%2, %3, %1)'] },
            },
            locate: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'spritesWithMouse',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.MOVING,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'locate',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'locate',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'move_absolute',
                isNotFor: [],
                func(sprite, script) {
                    const targetId = script.getField('VALUE', script);
                    let x;
                    let y;
                    if (targetId === 'mouse') {
                        x = Entry.stage.mouseCoordinate.x;
                        y = Entry.stage.mouseCoordinate.y;
                    } else {
                        const targetEntity = Entry.container.getEntity(targetId);
                        x = targetEntity.getX();
                        y = targetEntity.getY();
                    }
                    sprite.setX(Number(x));
                    sprite.setY(Number(y));
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(x, y * -1);
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.move_to(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'spritesWithMouse',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.MOVING,
                                    converter: Entry.block.converters.returnStringKey,
                                    codeMap: 'Entry.CodeMap.Entry.locate[0]',
                                },
                            ],
                        },
                    ],
                },
            },
            locate_object_time: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'spritesWithMouse',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.MOVING,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['2'],
                        },
                        null,
                        null,
                    ],
                    type: 'locate_object_time',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        'A&value',
                    ],
                    type: 'locate_object_time',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    TARGET: 1,
                },
                class: 'move_absolute',
                isNotFor: [],
                func(sprite, script) {
                    if (!script.isStart) {
                        let xValue;
                        let yValue;
                        const targetId = script.getField('TARGET', script);
                        const timeValue = script.getNumberValue('VALUE', script);
                        const frameCount = Math.floor(timeValue * Entry.FPS);
                        const mouseCoordi = Entry.stage.mouseCoordinate;

                        if (frameCount != 0) {
                            if (targetId === 'mouse') {
                                xValue = mouseCoordi.x - sprite.getX();
                                yValue = mouseCoordi.y - sprite.getY();
                            } else {
                                const targetEntity = Entry.container.getEntity(targetId);
                                xValue = targetEntity.getX() - sprite.getX();
                                yValue = targetEntity.getY() - sprite.getY();
                            }
                            script.isStart = true;
                            script.frameCount = frameCount;
                            script.dX = xValue / script.frameCount;
                            script.dY = yValue / script.frameCount;
                        } else {
                            //frame count is zero so execute immediately
                            if (targetId === 'mouse') {
                                xValue = Number(mouseCoordi.x);
                                yValue = Number(mouseCoordi.y);
                            } else {
                                const targetEntity = Entry.container.getEntity(targetId);
                                xValue = targetEntity.getX();
                                yValue = targetEntity.getY();
                            }
                            sprite.setX(xValue);
                            sprite.setY(yValue);
                            if (sprite.brush && !sprite.brush.stop) {
                                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                            }
                            return script.callReturn();
                        }
                    }
                    if (script.frameCount != 0) {
                        sprite.setX(sprite.getX() + script.dX);
                        sprite.setY(sprite.getY() + script.dY);
                        script.frameCount--;
                        if (sprite.brush && !sprite.brush.stop) {
                            sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                        }
                        return script;
                    } else {
                        delete script.isStart;
                        delete script.frameCount;
                        return script.callReturn();
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.move_to_for_sec(%2, %1)',
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'spritesWithMouse',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.MOVING,
                                    converter: Entry.block.converters.returnStringKey,
                                    codeMap: 'Entry.CodeMap.Entry.locate_object_time[1]',
                                },
                            ],
                        },
                    ],
                },
            },
            rotate_relative: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'angle',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'angle',
                            params: ['90'],
                        },
                        null,
                    ],
                    type: 'rotate_relative',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'angle',
                            params: ['A&value'],
                        },
                    ],
                    type: 'rotate_relative',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'rotate',
                isNotFor: [],
                func(entity, script) {
                    const value = script.getNumberValue('VALUE', script);
                    entity.setRotation(value + entity.getRotation());
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_rotation(%1)'] },
            },
            direction_relative: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        defaultType: 'angle',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'angle',
                            params: ['90'],
                        },
                        null,
                    ],
                    type: 'direction_relative',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'angle',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'direction_relative',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'rotate',
                isNotFor: [],
                func(entity, script) {
                    const value = script.getNumberValue('VALUE', script);
                    entity.setDirection(value + entity.getDirection());
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_direction(%1)'] },
            },
            rotate_by_time: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'angle',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['2'],
                        },
                        {
                            type: 'angle',
                            params: ['90'],
                        },
                        null,
                    ],
                    type: 'rotate_by_time',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        {
                            type: 'angle',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'rotate_by_time',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    ANGLE: 1,
                },
                class: 'rotate',
                isNotFor: [],
                func(sprite, script) {
                    if (!script.isStart) {
                        let [timeValue, angleValue] = script.getValues(['VALUE', 'ANGLE'], script);
                        timeValue = Number(timeValue);
                        angleValue = Number(angleValue);

                        script.isStart = true;
                        script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                        script.dAngle = angleValue / script.frameCount;

                        if (script.frameCount == 1) {
                            action();
                        }
                    }
                    if (script.frameCount != 0) {
                        action();
                        return script;
                    } else {
                        delete script.isStart;
                        delete script.frameCount;
                        return script.callReturn();
                    }

                    function action() {
                        sprite.setRotation(sprite.getRotation() + script.dAngle);
                        script.frameCount--;
                    }
                },
                syntax: { js: [], py: ['Entry.add_rotation_for_sec(%2, %1)'] },
            },
            direction_relative_duration: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'angle',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['2'],
                        },
                        {
                            type: 'angle',
                            params: ['90'],
                        },
                        null,
                    ],
                    type: 'direction_relative_duration',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'angle',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'direction_relative_duration',
                },
                paramsKeyMap: {
                    DURATION: 0,
                    AMOUNT: 1,
                },
                class: 'rotate',
                isNotFor: [],
                func(sprite, script) {
                    if (!script.isStart) {
                        let [timeValue, directionValue] = script.getValues(
                            ['DURATION', 'AMOUNT'],
                            script
                        );
                        timeValue = Number(timeValue);
                        directionValue = Number(directionValue);

                        script.isStart = true;
                        script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                        script.dDirection = directionValue / script.frameCount;

                        if (script.frameCount == 1) {
                            action();
                        }
                    }
                    if (script.frameCount != 0) {
                        action();
                        return script;
                    } else {
                        delete script.isStart;
                        delete script.frameCount;
                        delete script.dDirection;
                        return script.callReturn();
                    }

                    function action() {
                        sprite.setDirection(sprite.getDirection() + script.dDirection);
                        script.frameCount--;
                    }
                },
                syntax: { js: [], py: ['Entry.add_direction_for_sec(%2, %1)'] },
            },
            rotate_absolute: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        defaultType: 'angle',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'angle',
                            params: ['90'],
                        },
                        null,
                    ],
                    type: 'rotate_absolute',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'angle',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'rotate_absolute',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'rotate_absolute',
                isNotFor: [],
                func(entity, script) {
                    const value = script.getNumberValue('VALUE', script);
                    entity.setRotation(value);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_rotation(%1)'] },
            },
            direction_absolute: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        defaultType: 'angle',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'angle',
                            params: ['90'],
                        },
                        null,
                    ],
                    type: 'direction_absolute',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'angle',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'direction_absolute',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'rotate_absolute',
                isNotFor: [],
                func(entity, script) {
                    const value = script.getNumberValue('VALUE', script);
                    entity.setDirection(value);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_direction(%1)'] },
            },
            see_angle_object: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'spritesWithMouse',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.MOVING,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'see_angle_object',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'see_angle_object',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'rotate_absolute',
                isNotFor: [],
                func(sprite, script) {
                    const targetId = script.getField('VALUE', script);
                    const spriteX = sprite.getX();
                    const spriteY = sprite.getY();
                    let deltaX;
                    let deltaY;
                    let value;

                    if (sprite.parent.id == targetId) {
                        return script.callReturn();
                    }

                    if (targetId === 'mouse') {
                        const mX = Entry.stage.mouseCoordinate.x;
                        const mY = Entry.stage.mouseCoordinate.y;

                        deltaX = mX - spriteX;
                        deltaY = mY - spriteY;
                    } else {
                        const targetEntity = Entry.container.getEntity(targetId);
                        deltaX = targetEntity.getX() - spriteX;
                        deltaY = targetEntity.getY() - spriteY;
                    }

                    if (deltaX === 0 && deltaY === 0) {
                        value = sprite.getDirection() + sprite.getRotation();
                    } else if (deltaX >= 0) {
                        value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 90;
                    } else {
                        value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 270;
                    }
                    if (this.entity.parent.getRotateMethod() === 'free') {
                        const nativeDirection = sprite.getDirection() + sprite.getRotation();
                        sprite.setRotation(sprite.getRotation() + value - nativeDirection);
                    } else {
                        sprite.setDirection(value);
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.look_at(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'spritesWithMouse',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.MOVING,
                                    converter: Entry.block.converters.returnStringKey,
                                    codeMap: 'Entry.CodeMap.Entry.see_angle_object[0]',
                                },
                            ],
                        },
                    ],
                },
            },
            move_to_angle: {
                color: EntryStatic.colorSet.block.default.MOVING,
                outerLine: EntryStatic.colorSet.block.darken.MOVING,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'angle',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/moving_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'angle',
                            params: ['90'],
                        },
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'move_to_angle',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'angle',
                            params: ['B&value'],
                        },
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'move_to_angle',
                },
                paramsKeyMap: {
                    ANGLE: 0,
                    VALUE: 1,
                },
                class: 'move_rotate',
                isNotFor: [],
                func(sprite, script) {
                    let [value, angle] = script.getValues(['VALUE', 'ANGLE'], script);
                    value = Number(value);
                    angle = Number(angle);

                    sprite.setX(sprite.getX() + value * Math.cos((angle - 90) / 180 * Math.PI));
                    sprite.setY(sprite.getY() - value * Math.sin((angle - 90) / 180 * Math.PI));
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.move_to_degree(%2, %1)'] },
            },
        };
    },
};
