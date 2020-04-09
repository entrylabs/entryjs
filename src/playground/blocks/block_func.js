module.exports = {
    getBlocks() {
        return {
            functionAddButton: {
                skeleton: 'basic_button',
                color: EntryStatic.colorSet.common.BUTTON_BACKGROUND,
                isNotFor: ['functionInit'],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Workspace.function_create,
                        color: EntryStatic.colorSet.common.BUTTON,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'functionAddButton',
                },
                events: {
                    mousedown: [
                        function() {
                            Entry.do('funcEditStart', Entry.generateHash());
                        },
                    ],
                },
            },
        };
    },
};
