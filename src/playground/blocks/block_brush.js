module.exports = {
    getBlocks() {
        return {
            brush_stamp: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'brush_stamp',
                },
                class: 'stamp',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    sprite.addStamp();

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.stamp()'] },
            },
            start_drawing: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'start_drawing',
                },
                class: 'brush_control',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    if (sprite.brush) {
                        sprite.brush.stop = false;
                    } else {
                        Entry.setBasicBrush(sprite);
                    }

                    sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.start_drawing()'] },
            },
            stop_drawing: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'stop_drawing',
                },
                class: 'brush_control',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    if (sprite.brush) {
                        sprite.brush.stop = true;
                    }

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.stop_drawing()'] },
            },
            set_color: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Color',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'set_color',
                },
                pyHelpDef: {
                    params: ['A&value'],
                    type: 'set_color',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'brush_color',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    const colour = script.getField('VALUE', script);

                    if (!sprite.brush || !sprite.shapes.length) {
                        Entry.setBasicBrush(sprite);
                        sprite.brush.stop = true;
                    }

                    if (sprite.brush) {
                        const rgb = Entry.hex2rgb(colour);
                        sprite.brush.rgb = rgb;
                        sprite.brush.endStroke();
                        sprite.brush.beginStroke(
                            `rgba(${rgb.r},${rgb.g},${rgb.b},${1 - sprite.brush.opacity / 100})`
                        );

                        sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
                    }

                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.set_brush_color_to(%1)',
                            textParams: [
                                {
                                    type: 'Color',
                                    converter: Entry.block.converters.returnStringValueUpperCase,
                                    codeMap: 'Entry.CodeMap.Entry.set_color[0]',
                                },
                            ],
                        },
                    ],
                },
            },
            set_random_color: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'set_random_color',
                },
                class: 'brush_color',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    if (!sprite.brush || !sprite.shapes.length) {
                        Entry.setBasicBrush(sprite);
                        sprite.brush.stop = true;
                    }

                    if (sprite.brush) {
                        const rgb = Entry.generateRgb();
                        sprite.brush.rgb = rgb;
                        sprite.brush.endStroke();
                        sprite.brush.beginStroke(
                            `rgba(${rgb.r},${rgb.g},${rgb.b},${1 - sprite.brush.opacity / 100})`
                        );

                        sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_brush_color_to_random()'] },
            },
            change_thickness: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
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
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        null,
                    ],
                    type: 'change_thickness',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'change_thickness',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'brush_thickness',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    const thickness = script.getNumberValue('VALUE', script);

                    if (!sprite.brush || !sprite.shapes.length) {
                        Entry.setBasicBrush(sprite);
                        sprite.brush.stop = true;
                    }

                    if (sprite.brush) {
                        sprite.brush.thickness += thickness;
                        if (sprite.brush.thickness < 1) {
                            sprite.brush.thickness = 1;
                        }

                        sprite.brush.setStrokeStyle(sprite.brush.thickness);

                        sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
                    }

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_brush_size(%1)'] },
            },
            set_thickness: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
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
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        null,
                    ],
                    type: 'set_thickness',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'set_thickness',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'brush_thickness',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    const thickness = script.getNumberValue('VALUE', script);

                    if (!sprite.brush || !sprite.shapes.length) {
                        Entry.setBasicBrush(sprite);
                        sprite.brush.stop = true;
                    }

                    if (sprite.brush) {
                        sprite.brush.thickness = thickness;
                        sprite.brush.setStrokeStyle(sprite.brush.thickness);

                        sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
                    }

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_brush_size(%1)'] },
            },
            change_brush_transparency: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
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
                        img: 'block_icon/brush_icon.svg',
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
                    type: 'change_brush_transparency',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'change_brush_transparency',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'brush_opacity',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    let opacity = script.getNumberValue('VALUE', script);

                    if (!sprite.brush || !sprite.shapes.length) {
                        Entry.setBasicBrush(sprite);
                        sprite.brush.stop = true;
                    }
                    opacity = Entry.adjustValueWithMaxMin(sprite.brush.opacity + opacity, 0, 100);

                    if (sprite.brush) {
                        sprite.brush.opacity = opacity;
                        sprite.brush.endStroke();
                        const rgb = sprite.brush.rgb;
                        sprite.brush.beginStroke(
                            `rgba(${rgb.r},${rgb.g},${rgb.b},${1 - sprite.brush.opacity / 100})`
                        );
                        sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
                    }

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_brush_transparency(%1)'] },
            },
            set_brush_tranparency: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
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
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['50'],
                        },
                        null,
                    ],
                    type: 'set_brush_tranparency',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'set_brush_tranparency',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'brush_opacity',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    const opacity = script.getNumberValue('VALUE', script);

                    if (!sprite.brush || !sprite.shapes.length) {
                        Entry.setBasicBrush(sprite);
                        sprite.brush.stop = true;
                    }

                    if (sprite.brush) {
                        sprite.brush.opacity = Entry.adjustValueWithMaxMin(opacity, 0, 100);
                        sprite.brush.endStroke();
                        const rgb = sprite.brush.rgb;
                        sprite.brush.beginStroke(
                            `rgba(${rgb.r},${rgb.g},${rgb.b},${1 - sprite.brush.opacity / 100})`
                        );
                        sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
                    }

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_brush_transparency(%1)'] },
            },
            brush_erase_all: {
                color: EntryStatic.colorSet.block.default.BRUSH,
                outerLine: EntryStatic.colorSet.block.darken.BRUSH,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/brush_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'brush_erase_all',
                },
                class: 'brush_clear',
                isNotFor: ['textBox'],
                func(sprite, script) {
                    sprite.eraseBrush && sprite.eraseBrush();
                    sprite.removeStamps();
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.clear_drawing()'] },
            },
        };
    },
};
