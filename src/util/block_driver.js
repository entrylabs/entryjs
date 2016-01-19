goog.provide("Entry.BlockDriver");

Entry.BlockDriver = function() {
};

(function(p) {
    p.convert = function() {
        for (var blockType in Entry.block) {
            if (typeof Entry.block[blockType] === "function") {
                this._convertBlock(blockType);
            }
        }
    };

    p._convertBlock = function(blockType) {
        var blocklyInfo = Blockly.Blocks[blockType];
        var mockup = new Entry.BlockMockup(blocklyInfo);

        var blockObject = mockup.toJSON();

        blockObject.func = Entry.block[blockType];

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
        else
            skeleton = "basic";
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
            accept: "basic_string_field",
            value: [
                {
                    type: "text",
                    params: [10]
                }
            ]
        });
        this.templates.push(this.getFieldCount());
        return this;
    };

    p.appendStatementInput = function(key) {
        var statement = {
            accept: "basic",
            position: {
                x: 2,
                y: 15
            }
        };
        this.statements.push(statement);
    };

    p.setCheck = function(accept) {
        //add value
    };

    p.appendField = function(field) {
        if (typeof field === "string" && field.length > 0)
            this.templates.push(field);
        else {
            if (field instanceof Blockly.FieldIcon) {
                this.params.push({
                    type: "Image",
                    img: field.src_,
                    size: 24
                });
                this.templates.push(this.getFieldCount());
            } else if (field instanceof Blockly.FieldDropdown) {
            } else if (field instanceof Blockly.FieldDropdownDynamic) {
            } else if (field instanceof Blockly.FieldTextInput) {
                this.params.push({
                    type: "TextInput",
                    value: 10
                });
                this.templates.push(this.getFieldCount());
            } else if (field instanceof Blockly.FieldAngle) {
            } else {
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
