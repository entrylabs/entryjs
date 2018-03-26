/*
 *
 */
'use strict';

var { createTooltip } = require('../command_util');

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    
    c[COMMAND_TYPES.funcEditStart] = {
        do: function(funcId) {
            if (!funcId) {
                Entry.playground.changeViewMode('code');
                var blockMenu = Entry.variableContainer._getBlockMenu();
                if (blockMenu.lastSelector != 'func') {
                    blockMenu.selectMenu('func');
                }
                Entry.variableContainer.createFunction();
            }
        },
        state: function(funcId) {
            return [funcId];
        },
        log: function(funcId) {
            return [['funcId', funcId]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcEditCancel',
    };
    
    c[COMMAND_TYPES.funcEditCancel] = {
        do: function() {
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'cancelEdit');
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ["playground", "overlayBoard", "cancelEditButton"],
        undo: 'funcEditStart',
    };
})(Entry.Command);