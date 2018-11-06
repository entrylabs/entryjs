module.exports = {
    getBlocks() {
        return {
            functionAddButton: {
                skeleton: 'basic_button',
                color: '#eee',
                isNotFor: ['functionInit'],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Workspace.function_create,
                        color: '#333',
                        align: 'center',
                    },
                ],
                def: {
                    type: 'functionAddButton',
                },
                events: {
                    mousedown: [
                        function() {
                            Entry.variableContainer.createFunction();
                        },
                    ],
                },
            },
        };
    },
};
