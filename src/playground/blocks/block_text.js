module.exports = {
    getBlocks() {
        return {
            text_read: {
                color: '#FFCA36',
                fontColor: '#FFFFFF',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'textBoxWithSelf',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_TEXT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/text.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'text_read',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'text_read',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'text',
                isNotFor: ['sprite'],
                func(sprite, script) {
                    const targetId = script.getField('VALUE', script);
                    let targetEntity;
                    if (targetId === 'self') {
                        console.log(sprite);
                        if (sprite.type !== 'textBox') {
                            throw new Error('textBox가 아닙니다.');
                        }
                        targetEntity = sprite;
                    } else {
                        targetEntity = Entry.container.getEntity(targetId);
                    }
                    let value = targetEntity.getText() || '';
                    value = value.replace(/\n/gim, ' ');
                    return value;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.contents_of_textbox(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'textBoxWithSelf',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.ARROW_COLOR_TEXT,
                                    converter:
                                        Entry.block.converters.returnStringKey,
                                    codeMap: 'Entry.CodeMap.Entry.text_read[0]',
                                },
                            ],
                        },
                    ],
                },
            },
            text_write: {
                color: '#FFCA36',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/text.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'text',
                            params: [Lang.Blocks.entry],
                        },
                        null,
                    ],
                    type: 'text_write',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'text_write',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'text',
                isNotFor: ['sprite'],
                func(sprite, script) {
                    const text = script.getStringValue('VALUE', script);
                    sprite.setText(text);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.write_text(%1)'] },
            },
            text_append: {
                color: '#FFCA36',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/text.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'text',
                            params: [Lang.Blocks.entry],
                        },
                        null,
                    ],
                    type: 'text_append',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'text_append',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'text',
                isNotFor: ['sprite'],
                func(sprite, script) {
                    const text = script.getStringValue('VALUE', script);
                    sprite.setText(`${sprite.getText()  }${  text}`);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.append_text(%1)'] },
            },
            text_prepend: {
                color: '#FFCA36',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/text.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'text',
                            params: [Lang.Blocks.entry],
                        },
                        null,
                    ],
                    type: 'text_prepend',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'text_prepend',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'text',
                isNotFor: ['sprite'],
                func(sprite, script) {
                    const text = script.getStringValue('VALUE', script);
                    sprite.setText(`${text  }${  sprite.getText()}`);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.prepend_text(%1)'] },
            },
            text_flush: {
                color: '#FFCA36',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/text.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'text_flush',
                },
                class: 'text',
                isNotFor: ['sprite'],
                func(sprite, script) {
                    sprite.setText('');
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.clear_text()'] },
            },
        };
    },
};
