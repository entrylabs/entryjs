/*
 *
 */
"use strict";

goog.provide("Entry.Mutator");

/*
 *
 */
Entry.Mutator = function() {
};

(function(m) {
    m.mutate = function(blockType, schemaDiff) {
        var blockSchema = Entry.block[blockType];
        if (blockSchema.changeEvent === undefined)
            blockSchema.changeEvent = new Entry.Event();

        var reg = /(%\d)/gi;
        var oldTemplate = blockSchema.template.split(reg);
        reg.lastIndex = 0;
        var newTemplate = schemaDiff.template.split(reg);

        //statements params template
        blockSchema.template = schemaDiff.template;
        blockSchema.params = schemaDiff.params;

        blockSchema.changeEvent.notify(
            1, oldTemplate.length !== newTemplate.length
        );
    };
})(Entry.Mutator);

(function(p) {
})(Entry.Mutator.prototype);
