goog.provide("Entry.BlockDriver");

Entry.BlockDriver = function() {
};

(function(p) {
    p.convert = function() {
        this._convertBlock("stop_repeat");
    };

    p._convertBlock = function(blockType) {
        var blocklyInfo = Blockly.Blocks[blockType];
        var mockup = new Entry.BlockMockup(blocklyInfo);

        var blockObject = mockup.toJSON();

        blockObject.func = Entry.block[blockType]
        console.log()

        Entry.block[blockType] = blockObject;
    };

})(Entry.BlockDriver.prototype);

Entry.BlockMockup = function(blocklyInfo) {
    this.params = [];
    this.color = "";
    this.isPrev = false;
    this.isNext = false;

    this.simulate(blocklyInfo);
};

(function(p) {
    p.simulate = function(blocklyInfo) {
        blocklyInfo.init.call(this);
    };

    p.toJSON = function() {
        var skeleton = "";
        if (this.isPrev)
            skeleton = "basic";
        return {
            color: this.color,
            skeleton: skeleton,
            template: this.params.filter(function(p) {return typeof p === "string"}).join(),
            params: []
        }
    };

    p.appendDummyInput = function() {
        return this;
    };

    p.appendField = function(param) {
        this.params.push(param);
        return this;
    };

    p.setColour = function(color) {
        this.color = color;
    };

    p.setInputsInline = function() {
    };

    p.setPreviousStatement = function(bool) {
        this.isPrev = bool;
    };

    p.setNextStatement = function(bool) {
        this.isNext = bool;
    };

})(Entry.BlockMockup.prototype);
