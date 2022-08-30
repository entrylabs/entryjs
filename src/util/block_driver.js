'use strict';

Entry.BlockDriver = class BlockDriver {
    convert() {
        const time = new Date();
        for (const blockType in Entry.block) {
            if (typeof Entry.block[blockType] === 'function') {
                this._convertBlock(blockType);
            }
        }
        console.log(new Date().getTime() - time.getTime());
    }

    _convertBlock(blockType) {
        const blocklyInfo = Blockly.Blocks[blockType];
        const blockInfo = EntryStatic.blockInfo[blockType];
        let className;
        let isNotFor;
        if (blockInfo) {
            className = blockInfo.class;
            isNotFor = blockInfo.isNotFor;

            //add block definition by xml to json
            let xml = blockInfo.xml;
            if (xml) {
                xml = $.parseXML(xml);
                const child = xml.childNodes[0];
                var def = generateBlockDef(child);
            }
        }
        const mockup = new Entry.BlockMockup(blocklyInfo, def, blockType);

        const blockObject = mockup.toJSON();
        blockObject.class = className;
        blockObject.isNotFor = isNotFor;

        if (_.isEmpty(blockObject.paramsKeyMap)) {
            delete blockObject.paramsKeyMap;
        }
        if (_.isEmpty(blockObject.statementsKeyMap)) {
            delete blockObject.statementsKeyMap;
        }

        blockObject.func = Entry.block[blockType];

        const PRIMITIVES = [
            'NUMBER',
            'TRUE',
            'FALSE',
            'TEXT',
            'FUNCTION_PARAM_BOOLEAN',
            'FUNCTION_PARAM_STRING',
            'TRUE_UN',
        ];

        if (PRIMITIVES.indexOf(blockType.toUpperCase()) > -1) {
            blockObject.isPrimitive = true;
        }
        Entry.block[blockType] = blockObject;

        function generateBlockDef(block) {
            const def = {
                type: block.getAttribute('type'),
                index: {},
            };

            const children = $(block).children();
            if (!children) {
                return def;
            }
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const tagName = child.tagName;
                const subChild = $(child).children()[0];
                const key = child.getAttribute('name');
                if (tagName === 'value') {
                    if (subChild.nodeName == 'block') {
                        if (!def.params) {
                            def.params = [];
                        }
                        def.params.push(generateBlockDef(subChild));
                        def.index[key] = def.params.length - 1;
                    }
                } else if (tagName === 'field') {
                    if (!def.params) {
                        def.params = [];
                    }
                    def.params.push(child.textContent);
                    def.index[key] = def.params.length - 1;
                }
            }
            return def;
        }
    }
};

Entry.BlockMockup = class BlockMockup {
    constructor(blocklyInfo, def, blockType) {
        this.templates = [];
        this.params = [];
        this.statements = [];
        this.color = '';
        this.isPrev = false;
        this.isNext = false;
        this.output = false;
        this.fieldCount = 0;
        this.events = {};
        this.def = def || {};
        this.paramsKeyMap = {};
        this.statementsKeyMap = {};
        this.definition = {
            params: [],
            type: this.def.type,
        };

        this.simulate(blocklyInfo);
        this.def = this.definition;
    }

    simulate(blocklyInfo) {
        if (blocklyInfo.sensorList) {
            this.sensorList = blocklyInfo.sensorList;
        }
        if (blocklyInfo.portList) {
            this.portList = blocklyInfo.portList;
        }
        blocklyInfo.init.call(this);
        if (blocklyInfo.whenAdd) {
            if (!this.events.blockViewAdd) {
                this.events.blockViewAdd = [];
            }
            this.events.blockViewAdd.push(blocklyInfo.whenAdd);
        }

        if (blocklyInfo.whenRemove) {
            if (!this.events.blockViewDestroy) {
                this.events.blockViewDestroy = [];
            }
            this.events.blockViewDestroy.push(blocklyInfo.whenRemove);
        }
    }

    toJSON() {
        let skeleton = '';
        if (this.output) {
            if (this.output === 'Boolean') {
                skeleton = 'basic_boolean_field';
            } else {
                skeleton = 'basic_string_field';
            }
        } else if (!this.isPrev && this.isNext) {
            skeleton = 'basic_event';
        } else if (this.statements.length == 1) {
            skeleton = 'basic_loop';
        } else if (this.statements.length == 2) {
            skeleton = 'basic_double_loop';
        } else if (this.isPrev && this.isNext) {
            skeleton = 'basic';
        } else if (this.isPrev && !this.isNext) {
            skeleton = 'basic_without_next';
        }

        const def = this.def;
        removeIndex(def);

        function removeIndex(def) {
            if (!def) {
                return;
            }
            const params = def.params;
            if (!params) {
                return;
            }
            for (let i = 0; i < params.length; i++) {
                const param = params[i];
                if (!param) {
                    continue;
                }
                delete param.index;
                removeIndex(param);
            }
        }

        const reg = /dummy_/im;
        for (var key in this.paramsKeyMap) {
            if (reg.test(key)) {
                delete this.paramsKeyMap[key];
            }
        }

        for (key in this.statementsKeyMap) {
            if (reg.test(key)) {
                delete this.statementsKeyMap[key];
            }
        }

        return {
            color: this.color,
            skeleton,
            statements: this.statements,
            template: this.templates.filter((p) => typeof p === 'string').join(' '),
            params: this.params,
            events: this.events,
            def: this.def,
            paramsKeyMap: this.paramsKeyMap,
            statementsKeyMap: this.statementsKeyMap,
        };
    }

    appendDummyInput() {
        return this;
    }

    appendValueInput(key) {
        // field block
        if (this.def && this.def.index) {
            if (this.def.index[key] !== undefined) {
                this.definition.params.push(this.def.params[this.def.index[key]]);
            } else {
                this.definition.params.push(null);
            }
        }
        this.params.push({
            type: 'Block',
            accept: 'string',
        });

        this._addToParamsKeyMap(key);
        this.templates.push(this.getFieldCount());
        return this;
    }

    appendStatementInput(key) {
        const statement = {
            accept: 'basic',
        };
        this._addToStatementsKeyMap(key);
        this.statements.push(statement);
    }

    setCheck(accept) {
        //add value
        const params = this.params;
        if (accept === 'Boolean') {
            params[params.length - 1].accept = 'boolean';
        }
    }

    appendField(field, opt) {
        if (!field) {
            return this;
        }
        if (typeof field === 'string' && field.length > 0) {
            if (opt) {
                field = {
                    type: 'Text',
                    text: field,
                    color: opt,
                };
                this.params.push(field);
                this._addToParamsKeyMap();
                this.templates.push(this.getFieldCount());
                if (this.def && this.def.index && this.def.index[opt] !== undefined) {
                    this.definition.params.push(this.def.params[this.def.index[opt]]);
                } else {
                    this.definition.params.push(undefined);
                }
            } else {
                this.templates.push(field);
            }
        } else {
            if (field.constructor == Blockly.FieldIcon) {
                if (field.type === 'start') {
                    this.params.push({
                        type: 'Indicator',
                        img: field.src_,
                        size: 17,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    });
                } else {
                    this.params.push({
                        type: 'Indicator',
                        img: field.src_,
                        size: 12,
                    });
                }
                this._addToParamsKeyMap();
                this.templates.push(this.getFieldCount());
                if (this.definition) {
                    this.definition.params.push(null);
                }
            } else if (field.constructor == Blockly.FieldDropdown) {
                this.params.push({
                    type: 'Dropdown',
                    options: field.menuGenerator_,
                    value: field.menuGenerator_[0][1],
                    fontSize: 11,
                });
                this._addToParamsKeyMap(opt);

                this.templates.push(this.getFieldCount());
                if (this.def && this.def.index && this.def.index[opt] !== undefined) {
                    this.definition.params.push(this.def.params[this.def.index[opt]]);
                } else {
                    this.definition.params.push(undefined);
                }
            } else if (field.constructor == Blockly.FieldDropdownDynamic) {
                this.params.push({
                    type: 'DropdownDynamic',
                    value: null,
                    menuName: field.menuName_,
                    fontSize: 11,
                    defaultValue: (_value, options) => {
                        if (options[0] && options[0][1]) {
                            return options[0][1];
                        }
                        return null;
                    },
                });
                this.templates.push(this.getFieldCount());
                if (this.def && this.def.index && this.def.index[opt] !== undefined) {
                    this.definition.params.push(this.def.params[this.def.index[opt]]);
                } else {
                    this.definition.params.push(undefined);
                }
                this._addToParamsKeyMap(opt);
            } else if (field.constructor == Blockly.FieldTextInput) {
                this.params.push({
                    type: 'TextInput',
                    value: 10,
                });
                this.templates.push(this.getFieldCount());
                this._addToParamsKeyMap(opt);
            } else if (field.constructor == Blockly.FieldAngle) {
                this.params.push({
                    type: 'Angle',
                });
                this.templates.push(this.getFieldCount());
                if (this.def && this.def.index && this.def.index[opt] !== undefined) {
                    this.definition.params.push(this.def.params[this.def.index[opt]]);
                } else {
                    this.definition.params.push(null);
                }
                this._addToParamsKeyMap(opt);
            } else if (field.constructor == Blockly.FieldKeydownInput) {
                this.params.push({
                    type: 'Keyboard',
                    value: 81,
                });
                this.templates.push(this.getFieldCount());
                if (this.def.index[opt] !== undefined) {
                    this.definition.params.push(this.def.params[this.def.index[opt]]);
                } else {
                    this.definition.params.push(undefined);
                }
                this._addToParamsKeyMap(opt);
            } else if (field.constructor == Blockly.FieldColour) {
                this.params.push({
                    type: 'Color',
                });
                this.templates.push(this.getFieldCount());
                this._addToParamsKeyMap(opt);
            } else {
                console.log('else', field);
                //console.log('else', field);
            }
        }
        return this;
    }

    setColour(color) {
        this.color = color;
    }

    setInputsInline() {}

    setOutput(bool, type) {
        if (!bool) {
            return;
        }
        this.output = type;
    }

    setPreviousStatement(bool) {
        this.isPrev = bool;
    }

    setNextStatement(bool) {
        this.isNext = bool;
    }

    setEditable(bool) {
        // Not implemented
    }

    getFieldCount() {
        this.fieldCount++;
        return `%${this.fieldCount}`;
    }

    _addToParamsKeyMap(key) {
        key = key ? key : `dummy_${Entry.Utils.generateId()}`;
        const map = this.paramsKeyMap;
        map[key] = Object.keys(map).length;
    }

    _addToStatementsKeyMap(key) {
        key = key ? key : `dummy_${Entry.Utils.generateId()}`;
        const map = this.statementsKeyMap;
        map[key] = Object.keys(map).length;
    }
};
