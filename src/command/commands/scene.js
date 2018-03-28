/*
 *
 */
'use strict';

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    
    c[COMMAND_TYPES.sceneAdd] = {
        do: function(sceneId) {
            Entry.scene.addScene();
        },
        state: function(sceneId) {
            var sceneId = sceneId; 
            return [sceneId];
        },
        log: function() {
            return [];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'sceneRemove',
    };

    c[COMMAND_TYPES.sceneRemove] = {
        do: function(text) {
        },
        state: function(text) {
        },
        log: function() {
            return [];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'sceneAdd',
    };
})(Entry.Command);