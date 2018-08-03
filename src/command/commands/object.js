/*
 *
 */
'use strict';

const { returnEmptyArr, createTooltip } = require('../command_util');

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.selectObject] = {
        do: function(objectId) {
            return Entry.container.selectObject(objectId);
        },
        state: function(objectId) {
            var playground = Entry.playground;
            if (playground && playground.object) return [playground.object.id];
        },
        log: function(objectId) {
            return [objectId];
        },
        undo: 'selectObject',
    };

    c[COMMAND_TYPES.objectEditButtonClick] = {
        do: function(objectId) {
            Entry.container.getObject(objectId).toggleEditObject();
        },
        state: function(objectId) {
            return [];
        },
        log: function(objectId) {
            return [
                ['objectId', objectId],
                ['objectIndex', Entry.container.getObjectIndex(objectId)],
            ];
        },
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['container', 'objectIndex', '&1', 'editButton'],
        undo: 'selectObject',
    };

    c[COMMAND_TYPES.objectAddPicture] = {
        do: function(objectId, picture) {
            var hashId = c[COMMAND_TYPES.objectAddPicture].hashId;
            if (hashId) {
                picture.id = hashId;
                delete c[COMMAND_TYPES.objectAddPicture].hashId;
            }
            Entry.container.getObject(objectId).addPicture(picture);
            Entry.playground.injectPicture();
            Entry.playground.selectPicture(picture);
            Entry.dispatchEvent('dismissModal');
        },
        state: function(objectId, picture) {
            return [objectId, picture];
        },
        log: function(objectId, picture) {
            var o = {};
            o._id = picture._id;
            o.id = picture.id;
            o.dimension = picture.dimension;
            o.filename = picture.filename;
            o.fileurl = picture.fileurl;
            o.name = picture.name;
            o.scale = picture.scale;
            return [['objectId', objectId], ['picture', o]];
        },
        dom: ['.btn_confirm_modal'],
        restrict: function(data, domQuery, callback) {
            this.hashId = data.content[2][1].id;

            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: '.btn_confirm_modal',
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    render: false,
                    callBack: callback,
                }
            );

            var event = Entry.getMainWS().widgetUpdateEvent;

            if (!data.skip) {
                Entry.dispatchEvent(
                    'openPictureManager',
                    data.content[2][1]._id,
                    event.notify.bind(event)
                );
            }

            return tooltip;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: 'objectRemovePicture',
    };

    c[COMMAND_TYPES.objectRemovePicture] = {
        do: function(objectId, picture) {
            Entry.container.getObject(objectId).removePicture(picture.id);
        },
        state: function(objectId, picture) {
            return [objectId, picture];
        },
        log: function(objectId, picture) {
            return [['objectId', objectId], ['pictureId', picture._id]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: 'objectAddPicture',
    };

    c[COMMAND_TYPES.objectAddSound] = {
        do: function(objectId, sound) {
            var hashId = c[COMMAND_TYPES.objectAddSound].hashId;
            if (hashId) {
                sound.id = hashId;
                delete c[COMMAND_TYPES.objectAddSound].hashId;
            }
            Entry.container.getObject(objectId).addSound(sound);
            Entry.dispatchEvent('dismissModal');
        },
        state: function(objectId, sound) {
            return [objectId, sound];
        },
        log: function(objectId, sound) {
            var o = {};
            o._id = sound._id;
            o.duration = sound.duration;
            o.ext = sound.ext;
            o.id = sound.id;
            o.filename = sound.filename;
            o.fileurl = sound.fileurl;
            o.name = sound.name;
            return [['objectId', objectId], ['sound', o]];
        },
        dom: ['.btn_confirm_modal'],
        restrict: function(data, domQuery, callback) {
            this.hashId = data.content[2][1].id;

            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: '.btn_confirm_modal',
                    },
                ],
                {
                    callBack: callback,
                    dimmed: true,
                    restrict: true,
                    render: false,
                }
            );

            var event = Entry.getMainWS().widgetUpdateEvent;

            if (!data.skip) {
                Entry.dispatchEvent(
                    'openSoundManager',
                    data.content[2][1]._id,
                    event.notify.bind(event)
                );
            }
            return tooltip;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: 'objectRemoveSound',
    };

    c[COMMAND_TYPES.objectRemoveSound] = {
        do: function(objectId, sound) {
            return Entry.container.getObject(objectId).removeSound(sound.id);
        },
        state: function(objectId, sound) {
            return [objectId, sound];
        },
        log: function(objectId, sound) {
            return [['objectId', objectId], ['soundId', sound._id]];
        },
        dom: ['.btn_confirm_modal'],
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: 'objectAddSound',
    };

    c[COMMAND_TYPES.objectAddExpansionBlock] = {
        do: function(block) {
            var hashId = c[COMMAND_TYPES.objectAddExpansionBlock].hashId;
            if (hashId) {
                block.id = hashId;
                delete c[COMMAND_TYPES.objectAddExpansionBlock].hashId;
            }

            if( typeof Entry.EXPANSION_BLOCK !== "undefined" && typeof Entry.EXPANSION_BLOCK[block.name] !== "undefined") {
                Entry.EXPANSION_BLOCK[block.name].init();
                if(typeof Entry.expansionBlocks == "undefined") {
                    Entry.expansionBlocks = [];
                }
                Entry.expansionBlocks.push(block.name);
            }

            Entry.playground.blockMenu.unbanClass(block.name);
            Entry.dispatchEvent('dismissModal');
        },
        state: function(block) {
            return [block];
        },
        log: function(block) {
            var o = {};
            o._id = block._id;
            o.id = block.id;
            o.filename = block.filename;
            o.fileurl = block.fileurl;
            o.name = block.name;
            return [['block', o]];
        },
        dom: ['.btn_confirm_modal'],
        restrict: function(data, domQuery, callback) {
            this.hashId = data.content[2][1].id;

            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: '.btn_confirm_modal',
                    },
                ],
                {
                    callBack: callback,
                    dimmed: true,
                    restrict: true,
                    render: false,
                }
            );

            var event = Entry.getMainWS().widgetUpdateEvent;

            if (!data.skip) {
                Entry.dispatchEvent(
                    'openSoundManager',
                    data.content[2][1]._id,
                    event.notify.bind(event)
                );
            }
            return tooltip;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: 'objectRemoveExpansionBlock',
    };

    c[COMMAND_TYPES.objectRemoveExpansionBlock] = {
        do: function(block) {
            Entry.playground.blockMenu.banClass(block.name);
        },
        state: function(block) {
            return [block];
        },
        log: function(block) {
            return [['blockId', block._id]];
        },
        dom: ['.btn_confirm_modal'],
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: 'objectAddExpansionBlock',
    };

    c[COMMAND_TYPES.objectNameEdit] = {
        do: function(objectId, newName) {
            var object = Entry.container.getObject(objectId);
            object.setName(newName);
            object.setInputBlurred('nameInput');
            Entry.playground.reloadPlayground();
        },
        state: function(objectId, newName) {
            var object = Entry.container.getObject(objectId);
            return [objectId, object.getName()];
        },
        log: function(objectId, newName) {
            var object = Entry.container.getObject(objectId);
            return [['objectId', objectId], ['newName', newName]];
        },
        dom: ['container', 'objectId', '&0', 'nameInput'],
        restrict: _inputRestrictor,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'objectNameEdit',
    };

    c[COMMAND_TYPES.objectUpdatePosX] = {
        do: function(objectId, newX = 0) {
            var object = Entry.container.getObject(objectId);
            object.entity.setX(Number(newX));
            object.updateCoordinateView();
            object.setInputBlurred('xInput');
            Entry.stage.updateObject();
        },
        state: function(objectId, newX) {
            var { entity } = Entry.container.getObject(objectId);
            return [objectId, entity.getX()];
        },
        log: function(objectId, newX) {
            var { entity } = Entry.container.getObject(objectId);
            return [['objectId', objectId], ['newX', newX]];
        },
        dom: ['container', 'objectId', '&0', 'xInput'],
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict: _inputRestrictor,
        undo: 'objectUpdatePosX',
    };

    c[COMMAND_TYPES.objectUpdatePosY] = {
        do: function(objectId, newY = 0) {
            var object = Entry.container.getObject(objectId);
            object.entity.setY(Number(newY));
            object.updateCoordinateView();
            object.setInputBlurred('yInput');
            Entry.stage.updateObject();
        },
        state: function(objectId, newY) {
            var { entity } = Entry.container.getObject(objectId);
            return [objectId, entity.getY()];
        },
        log: function(objectId, newY) {
            var { entity } = Entry.container.getObject(objectId);
            return [['objectId', objectId], ['newY', newY]];
        },
        dom: ['container', 'objectId', '&0', 'yInput'],
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict: _inputRestrictor,
        undo: 'objectUpdatePosY',
    };

    c[COMMAND_TYPES.objectUpdateSize] = {
        do: function(objectId, newSize = 0) {
            var object = Entry.container.getObject(objectId);
            object.entity.setSize(Number(newSize));
            object.updateCoordinateView();
            object.setInputBlurred('sizeInput');
            Entry.stage.updateObject();
        },
        state: function(objectId, newSize) {
            var { entity } = Entry.container.getObject(objectId);
            return [objectId, entity.getSize()];
        },
        log: function(objectId, newSize) {
            var { entity } = Entry.container.getObject(objectId);
            return [['objectId', objectId], ['newSize', newSize]];
        },
        dom: ['container', 'objectId', '&0', 'sizeInput'],
        restrict: _inputRestrictor,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'objectUpdateSize',
    };

    c[COMMAND_TYPES.objectUpdateRotationValue] = {
        do: function(objectId, newValue = 0) {
            var object = Entry.container.getObject(objectId);
            object.entity.setRotation(Number(newValue));
            object.updateCoordinateView();
            object.setInputBlurred('rotationInput');
            Entry.stage.updateObject();
        },
        state: function(objectId, newValue) {
            var { entity } = Entry.container.getObject(objectId);
            return [objectId, entity.getRotation()];
        },
        log: function(objectId, newValue) {
            var { entity } = Entry.container.getObject(objectId);
            return [['objectId', objectId], ['newRotationValue', newValue]];
        },
        dom: ['container', 'objectId', '&0', 'rotationInput'],
        restrict: _inputRestrictor,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'objectUpdateRotationValue',
    };

    c[COMMAND_TYPES.objectUpdateDirectionValue] = {
        do: function(objectId, newValue = 0) {
            var object = Entry.container.getObject(objectId);
            object.entity.setDirection(Number(newValue));
            object.updateCoordinateView();
            object.setInputBlurred('directionInput');
            Entry.stage.updateObject();
        },
        state: function(objectId, newValue) {
            var { entity } = Entry.container.getObject(objectId);
            return [objectId, entity.getDirection()];
        },
        log: function(objectId, newValue) {
            var { entity } = Entry.container.getObject(objectId);
            return [['objectId', objectId], ['newDirectionValue', newValue]];
        },
        dom: ['container', 'objectId', '&0', 'directionInput'],
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict: _inputRestrictor,
        undo: 'objectUpdateDirectionValue',
    };

    c[COMMAND_TYPES.objectUpdateRotateMethod] = {
        do: function(objectId, newMethod, rotation) {
            var object = Entry.container.getObject(objectId);
            object.initRotateValue(newMethod);
            object.setRotateMethod(newMethod);
            if (rotation !== undefined) {
                object.entity.setRotation(rotation);
            }
            Entry.stage.updateObject();
        },
        state: function(objectId, newMethod) {
            var { entity, rotateMethod } = Entry.container.getObject(objectId);
            return [objectId, rotateMethod, entity.getRotation()];
        },
        log: function(objectId, newValue) {
            var { entity } = Entry.container.getObject(objectId);
            return [['objectId', objectId], ['newDirectionValue', newValue]];
        },
        dom: ['container', 'objectId', '&0', 'rotationMethod', '&1'],
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'objectUpdateRotateMethod',
    };

    c[COMMAND_TYPES.entitySetModel] = {
        do(objectId, newModel, oldModel) {
            var { entity } = Entry.container.getObject(objectId);
            entity.setModel(newModel);
        },
        state(objectId, newModel, oldModel) {
            return [objectId, oldModel, newModel];
        },
        log(objectId, newModel, oldModel) {
            return [['objectId', objectId], ['newModel', newModel], ['oldModel', oldModel]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'entitySetModel',
    };

    function _inputRestrictor({ tooltip, content }, domQuery, callback) {
        var { title: tooltipTitle, content: tooltipContent } = tooltip;
        _activateEdit(content[1][1], domQuery, callback);
        return createTooltip(tooltipTitle, tooltipContent, domQuery, callback);
    }

    function _activateEdit(objectId, domQuery, callback) {
        var object = Entry.container.getObject(objectId);

        if (!object.isEditing) {
            object.editObjectValues(true);
        }

        if (!_.isEmpty(domQuery)) {
            domQuery = Entry.getDom(domQuery);
            if (domQuery && !Entry.Utils.isDomActive(domQuery)) {
                domQuery.focus();
                callback();
            }
        }
    }
})(Entry.Command);
