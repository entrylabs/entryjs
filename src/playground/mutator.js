'use strict';

/*
 *
 */
Entry.Mutator = new class {
    mutate(blockType, schemaDiff, changeData) {
        const blockSchema = Entry.block[blockType];
        if (blockSchema.changeEvent === undefined) {
            blockSchema.changeEvent = new Entry.Event();
        }
        // if (blockSchema.paramsBackupEvent === undefined) {
        //     blockSchema.paramsBackupEvent = new Entry.Event();
        // }
        // if (blockSchema.destroyParamsBackupEvent === undefined) {
        //     blockSchema.destroyParamsBackupEvent = new Entry.Event();
        // }

        //statements params template
        blockSchema.template = Object.assign(blockSchema.template, schemaDiff.template);
        blockSchema.params = Object.assign(blockSchema.params, schemaDiff.params);

        blockSchema.changeEvent.notify(1, { isRestore: false, type: 'noChange' });
    }
}();
