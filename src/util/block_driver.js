"use strict";

goog.provide("Entry.BlockDriver");

Entry.BlockDriver = function() {
};

(function(p) {
    p.convert = function() {
        var time = new Date();
        for (var blockType in Entry.block) {
            if (typeof Entry.block[blockType] === "function") {
                this._convertBlock(blockType);
            }
        }
        console.log(new Date().getTime() - time.getTime());
    };

    p._convertBlock = function(blockType) {
        var blocklyInfo = Blockly.Blocks[blockType];
        var mockup = new Entry.BlockMockup(blocklyInfo);

        var blockObject = mockup.toJSON();

        blockObject.func = Entry.block[blockType];

        var blockInfo = EntryStatic.blockInfo[blockType];
        if (blockInfo) {
            blockObject.class = blockInfo.class;
            blockObject.isNotFor = blockInfo.isNotFor;

            /*
            //add block definition by xml to json
            var xml = blockInfo.xml;
            if (xml) {
                xml = $.parseXML(xml);
                var child = xml.childNodes[0];
                var def = generateBlockDef(child);
                blockObject.def = def;
            }
            */
        }

        var PRIMITIVES = ['NUMBER', 'TRUE', 'FALSE',
            'TEXT', 'FUNCTION_PARAM_BOOLEAN', 'FUNCTION_PARAM_STRING', 'TRUE_UN'];

        if (PRIMITIVES.indexOf(blockType.toUpperCase()) > -1)
            blockObject.isPrimitive = true;
        Entry.block[blockType] = blockObject;

        function generateBlockDef(block) {
            var def = {type: block.getAttribute('type')};

            var children = $(block).children();
            if (!children) return def;
            for (var i =0; i<children.length; i++) {
                var child = children[i];
                var tagName = child.tagName;
                var subChild = $(child).children()[0];
                if (tagName === 'value') {
                    if (subChild.nodeName == 'block') {
                        if (!def.params) def.params = [];
                        def.params.push(generateBlockDef(subChild));
                    }
                } else if (tagName === 'field') {
                    if (!def.params) def.params = [];
                    def.params.push(child.textContent);
                }
            }
            return def;
        }
    };


})(Entry.BlockDriver.prototype);

Entry.BlockMockup = function(blocklyInfo) {
    this.templates = [];
    this.params = [];
    this.statements = [];
    this.color = "";
    this.isPrev = false;
    this.isNext = false;
    this.output = false;
    this.fieldCount = 0;
    this.events = {};

    this.simulate(blocklyInfo);
};

(function(p) {
    p.simulate = function(blocklyInfo) {
        blocklyInfo.init.call(this);
        if (blocklyInfo.whenAdd) {
            if (!this.events.whenBlockAdd)
                this.events.whenBlockAdd = [];
            this.events.whenBlockAdd.push(blocklyInfo.whenAdd);
        }

        if (blocklyInfo.whenRemove) {
            if (!this.events.whenBlockDestroy)
                this.events.whenBlockDestroy = [];
            this.events.whenBlockDestroy.push(blocklyInfo.whenRemove);
        }
    };

    p.toJSON = function() {
        var skeleton = "";
        if (this.output)
            if (this.output === "Boolean")
                skeleton = "basic_boolean_field";
            else
                skeleton = "basic_string_field";
        else if (!this.isPrev && this.isNext)
            skeleton = "basic_event";
        else if (this.statements.length == 1)
            skeleton = "basic_loop";
        else if (this.statements.length == 2)
            skeleton = "basic_double_loop";
        else if (this.isPrev && this.isNext)
            skeleton = "basic";
        else if (this.isPrev && !this.isNext)
            skeleton = "basic_without_next";
        return {
            color: this.color,
            skeleton: skeleton,
            statements: this.statements,
            template: this.templates.filter(function(p) {return typeof p === "string";}).join(" "),
            params: this.params,
            events: this.events
        };
    };

    p.appendDummyInput = function() {
        return this;
    };

    p.appendValueInput = function(key) {
        // field block
        this.params.push({
            type: "Block",
            accept: "stringMagnet"
        });
        this.templates.push(this.getFieldCount());
        return this;
    };

    p.appendStatementInput = function(key) {
        var statement = {
            accept: "basic"
        };
        this.statements.push(statement);
    };

    p.setCheck = function(accept) {
        //add value
        var params = this.params;
        if (accept === "Boolean")
            params[params.length - 1].accept =
                "booleanMagnet";
    };

    p.appendField = function(field, opt) {
        if (!field) return this;
        if (typeof field === "string" && field.length > 0) {
            if (opt) {
                field = {
                    type: 'Text',
                    text: field,
                    color: opt
                };
                this.params.push(field);
                this.templates.push(this.getFieldCount());
            } else this.templates.push(field);
        } else {
            if (field.constructor == Blockly.FieldIcon) {
                if (field.type === "start")
                    this.params.push({
                        type: "Indicator",
                        img: field.src_,
                        size: 17,
                        position: {
                            x: 0, y: -2
                        }
                    });
                else
                    this.params.push({
                        type: "Indicator",
                        img: field.src_,
                        size: 12,
                    });
                this.templates.push(this.getFieldCount());
            } else if (field.constructor == Blockly.FieldDropdown) {
                this.params.push({
                    type: "Dropdown",
                    options: field.menuGenerator_,
                    value: field.menuGenerator_[0][1],
                    fontSize: 11
                });
                this.templates.push(this.getFieldCount());
            } else if (field.constructor == Blockly.FieldDropdownDynamic) {
                this.params.push({
                    type: "DropdownDynamic",
                    value: null,
                    menuName: field.menuName_,
                    fontSize: 11
                });
                this.templates.push(this.getFieldCount());
            } else if (field.constructor == Blockly.FieldTextInput) {
                this.params.push({
                    type: "TextInput",
                    value: 10
                });
                this.templates.push(this.getFieldCount());
            } else if (field.constructor == Blockly.FieldAngle) {
                this.params.push({
                    type: "Angle"
                });
                this.templates.push(this.getFieldCount());
            } else if (field.constructor == Blockly.FieldKeydownInput) {
                this.params.push({
                    type: "Keyboard",
                    value: 81
                });
                this.templates.push(this.getFieldCount());
            } else if (field.constructor == Blockly.FieldColour) {
                this.params.push({
                    type: "Color"
                });
                this.templates.push(this.getFieldCount());
            } else {
                console.log('else', field);
                //console.log('else', field);
            }
        }
        return this;
    };

    p.setColour = function(color) {
        this.color = color;
    };

    p.setInputsInline = function() {
    };

    p.setOutput = function(bool, type) {
        if (!bool)
            return;
        this.output = type;
    };

    p.setPreviousStatement = function(bool) {
        this.isPrev = bool;
    };

    p.setNextStatement = function(bool) {
        this.isNext = bool;
    };

    p.setEditable = function(bool) {
         // Not implemented
    };

    p.getFieldCount = function() {
        this.fieldCount++;
        return "%" + this.fieldCount;
    };

})(Entry.BlockMockup.prototype);
