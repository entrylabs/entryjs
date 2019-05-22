/*
 *
 */
'use strict';

const { createTooltip } = require('../command_util');

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.sceneAdd] = {
        /**
         * @param {!object|string} sceneId can be sceneId or scene object
         * @param {?number} sceneIndex
         * @param {?Array} objects will be add to new scene, for undo function
         */
        do(sceneId, sceneIndex, objects) {
            if (Entry.expectedAction) {
                sceneId = Entry.expectedAction[1][1];
            }
            Entry.scene.addScene(sceneId, sceneIndex);
            if (objects) {
                Entry.container.setObjects(objects);
            }
        },
        state(sceneId, sceneIndex) {
            if (!sceneIndex) {
                sceneIndex = Entry.scene.getScenes().length;
            }
            if (Entry.expectedAction) {
                sceneId = Entry.expectedAction[1][1];
            }
            if (typeof sceneId !== 'string') {
                sceneId = sceneId.id;
            }
            return [sceneId];
        },
        log(sceneId) {
            if (Entry.expectedAction) {
                sceneId = Entry.expectedAction[1][1];
            }
            return [['sceneId', sceneId]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['scene', 'addButton'],
        undo: 'sceneRemove',
    };

    c[COMMAND_TYPES.sceneRemove] = {
        do(sceneId) {
            Entry.scene.removeScene(sceneId);
        },
        state(sceneId) {
            const scene = Entry.scene.getSceneById(sceneId);
            const sceneJSON = {
                id: scene.id,
                name: scene.name,
            };
            const sceneIndex = Entry.scene.getScenes().indexOf(scene);
            const objects = Entry.container.getSceneObjects(scene).map((o) => o.toJSON());
            return [sceneJSON, sceneIndex, objects];
        },
        log(sceneId) {
            return [['sceneId', sceneId]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['scene', 'removeButton', '&0'],
        undo: 'sceneAdd',
    };

    c[COMMAND_TYPES.sceneRename] = {
        do(sceneId, newName) {
            const scene = Entry.scene.getSceneById(sceneId);
            scene.name = newName;
            scene.view.nameField.value = newName;
            setTimeout(() => {
                Entry.scene.resize();
            }, 0);
        },
        state(sceneId) {
            const scene = Entry.scene.getSceneById(sceneId);
            return [sceneId, scene.name];
        },
        log(sceneId, newName) {
            return [['sceneId', sceneId], ['newName', newName]];
        },
        restrict(data, domQuery, callback) {
            const {
                content: contentData,
                tooltip: { title, content },
            } = data;

            callback();
            const scene = Entry.scene.getSceneById(contentData[1][1]);
            scene.view.nameField.focus();
            return createTooltip(title, content, domQuery, callback);
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['scene', 'nameField', '&0'],
        undo: 'sceneRename',
    };

    c[COMMAND_TYPES.sceneSelect] = {
        do(sceneId) {
            const scene = Entry.scene.getSceneById(sceneId);
            Entry.scene.selectScene(scene);
        },
        state(sceneId) {
            return [Entry.scene.selectedScene.id];
        },
        log(sceneId) {
            return [['sceneId', sceneId]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['scene', 'view', '&0'],
        undo: 'sceneSelect',
    };
})(Entry.Command);
