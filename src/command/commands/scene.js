/*
 *
 */
'use strict';

var { createTooltip } = require('../command_util');

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    
    c[COMMAND_TYPES.sceneAdd] = {
        /**
         * @param {!object|string} sceneId can be sceneId or scene object
         * @param {?number} sceneIndex 
         * @param {?Array} objects will be add to new scene, for undo function
         */
        do: function(sceneId, sceneIndex, objects) {
            if (Entry.expectedAction)
                sceneId = Entry.expectedAction[1][1];
            Entry.scene.addScene(sceneId, sceneIndex);
            if (objects)
                Entry.container.setObjects(objects);
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
            var scene = Entry.scene.getSceneById(sceneId);
            var sceneJSON = {
                id: scene.id,
                name: scene.name
            }
            var sceneIndex = Entry.scene.getScenes().indexOf(scene);
            var objects = Entry.container.getSceneObjects(scene).map(function(o) {
                return o.toJSON();
            });
            return [sceneJSON, sceneIndex, objects]
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