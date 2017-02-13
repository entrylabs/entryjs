/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.selectObject] = {
        do: function(objectId) {
            return Entry.container.selectObject(objectId);
        },
        state: function(objectId) {
            var playground = Entry.playground;
            if (playground && playground.object)
                return [playground.object.id];
        },
        log: function(objectId) {
            return [objectId];
        },
        undo: "selectObject"
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
        undo: "selectObject"
    };

    c[COMMAND_TYPES.objectAddPicture] = {
        do: function(objectId, picture) {
            Entry.container
                .getObject(objectId)
                .addPicture(picture);
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
            return [
                ['objectId', objectId],
                ['picture', o],
            ];
        },
        dom: ['.btn_confirm_modal'],
        restrict: function(data, domQuery, callback) {
            var tooltip = new Entry.Tooltip([{
                content: "여기 밑에 끼워넣으셈",
                target: '.btn_confirm_modal',
                direction: "right"
            }], {
                callBack: callback,
                dimmed: true,
                restrict: true
            });
            Entry.dispatchEvent(
                'openPictureManager',
                data.content[2][1]._id,
                tooltip.render.bind(tooltip)
            );
            return tooltip;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: "objectRemovePicture"
    };

    c[COMMAND_TYPES.objectRemovePicture] = {
        do: function(objectId, picture) {
            Entry.container
                .getObject(objectId)
                .removePicture(picture.id);
        },
        state: function(objectId, picture) {
            return [objectId, picture];
        },
        log: function(objectId, picture) {
            return [
                ['objectId', objectId],
                ['picture', picture._id],
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: "objectAddPicture"
    };
})(Entry.Command);
