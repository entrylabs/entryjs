/*
 *
 */
'use strict';

var { createTooltip } = require('../command_util');

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    
    c[COMMAND_TYPES.sceneAdd] = {
        do: function(sceneId, sceneIndex, objects) {
            if (Entry.expectedAction)
                sceneId = Entry.expectedAction[1][1];
            Entry.scene.addScene(sceneId, sceneIndex);
        },
        state: function(sceneId, sceneIndex) {
            if (!sceneIndex)
                sceneIndex = Entry.scene.getScenes().length;
            if (Entry.expectedAction)
                sceneId = Entry.expectedAction[1][1];
            if (typeof sceneId !== "string")
                sceneId = sceneId.id;
            return [sceneId];
        },
        log: function(sceneId) {
            if (Entry.expectedAction)
                sceneId = Entry.expectedAction[1][1];
            return [['sceneId', sceneId]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['scene', 'addButton'],
        undo: 'sceneRemove',
    };

    c[COMMAND_TYPES.sceneRemove] = {
        do: function(sceneId) {
            Entry.scene.removeScene(sceneId);
        },
        state: function(sceneId) {
            //return [sceneJSON, sceneIndex, objects]
        },
        log: function(sceneId) {
            return [['sceneId', sceneId]];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['scene', 'removeButton', '&0'],
        undo: 'sceneAdd',
    };
})(Entry.Command);