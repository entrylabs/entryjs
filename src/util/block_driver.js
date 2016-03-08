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
        }

        Entry.block[blockType] = blockObject;
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

    this.simulate(blocklyInfo);
};

(function(p) {
    p.simulate = function(blocklyInfo) {
        blocklyInfo.init.call(this);
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
        else if (this.statements.length)
            skeleton = "basic_loop";
        else if (this.isPrev && this.isNext)
            skeleton = "basic";
        else if (this.isPrev && !this.isNext)
            skeleton = "basic_without_next";
        return {
            color: this.color,
            skeleton: skeleton,
            statements: this.statements,
            template: this.templates.filter(function(p) {return typeof p === "string"}).join(" "),
            params: this.params
        }
    };

    p.appendDummyInput = function() {
        return this;
    };

    p.appendValueInput = function(key) {
        // field block
        this.params.push({
            type: "Block",
            accept: "basic_string_field"
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
                "basic_boolean_field";
    };

    p.appendField = function(field) {
        if (typeof field === "string" && field.length > 0)
            this.templates.push(field);
        else {
            if (field instanceof Blockly.FieldIcon) {
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
            } else if (field instanceof Blockly.FieldDropdown) {
                this.params.push({
                    type: "Dropdown",
                    options: field.menuGenerator_,
                    value: field.menuGenerator_[0][1],
                    fontSize: 11
                });
                this.templates.push(this.getFieldCount());
            } else if (field instanceof Blockly.FieldDropdownDynamic) {
                this.params.push({
                    type: "Dropdown",
                    options: [["대상 없음", "null"]],
                    value: "null",
                    fontSize: 11
                });
                this.templates.push(this.getFieldCount());
            } else if (field instanceof Blockly.FieldTextInput) {
                this.params.push({
                    type: "TextInput",
                    value: 10
                });
                this.templates.push(this.getFieldCount());
            } else if (field instanceof Blockly.FieldAngle) {
                console.log(field);
            } else if (field instanceof Blockly.FieldKeydownInput) {
                this.params.push({
                    type: "Keyboard",
                    value: 81
                });
                this.templates.push(this.getFieldCount());
            } else if (field instanceof Blockly.FieldColour) {
                this.params.push({
                    type: "Color"
                });
                this.templates.push(this.getFieldCount());
            } else {
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
