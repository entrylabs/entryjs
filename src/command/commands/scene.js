/*
 *
 */
'use strict';

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    
    c[COMMAND_TYPES.sceneAdd] = {
        do: function(sceneId) {
            console.log(sceneId);
            Entry.scene.addScene();
        },
        state: function(sceneId) {
            var sceneId = sceneId; 
            console.log(sceneId);
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
            console.log(text)
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