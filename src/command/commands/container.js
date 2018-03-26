/*
 *
 */
'use strict';

var { createTooltip, returnEmptyArr } = require('../command_util');

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.containerSelectObject] = {
        do: function(objectId) {
            Entry.container.selectObject(objectId);
        },
        state: function(objectId) {
            return [Entry.playground.object.id, objectId];
        },
        log: function(objectId) {
            return [
                ['objectId', objectId],
                ['objectIndex', Entry.container.getObjectIndex(objectId)],
            ];
        },
        restrict: function(data, domQuery, callback, restrictor) {
            Entry.container.scrollToObject(data.content[1][1]);

            return new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    dimmed: true,
                    restrict: true,
                    callBack: function() {
                        callback();
                    },
                }
            );
        },
        undo: 'containerSelectObject',
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['container', 'objectIndex', '&1'],
    };

    c[COMMAND_TYPES.removeObject] = {
        do: function(objectId) {
            var object = Entry.container.getObject(objectId);
            Entry.container.removeObject(objectId);

            Entry.toast.success(
                Lang.Workspace.remove_object,
                object.name + ' ' + Lang.Workspace.remove_object_msg
            );
        },
        state: function(objectId) {
            var objectModel = Entry.container.getObject(objectId);
            return [objectModel.toJSON(), Entry.container.getObjectIndex(objectId)];
        },
        log: function(objectId) {
            return [['objectId', objectId]];
        },
        undo: 'addObject',
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['container', 'removeButton', '&0', 'removeButton'],
    };

    c[COMMAND_TYPES.addObject] = {
        do: function(objectModel, index) {
            var that = c[COMMAND_TYPES.addObject];
            var { hashId } = that;
            if (hashId) {
                objectModel.id = hashId;
                delete that.hashId;
            }
            Entry.container.addObjectFunc(objectModel, index);
            Entry.dispatchEvent('dismissModal');
        },
        state: function(objectModel, index) {
            var { hashId } = c[COMMAND_TYPES.addObject];
            if (hashId) {
                objectModel.id = hashId;
            }
            return [objectModel.id, index];
        },
        log: function(objectModel, index) {
            var spriteId = objectModel.sprite._id;
            objectModel = new Entry.EntryObject(objectModel).toJSON();
            return [
                ['objectModel', objectModel],
                ['objectIndex', index],
                ['spriteId', spriteId],
            ];
        },
        dom: ['.btn_confirm_modal'],
        restrict: function(data, domQuery, callback) {
            Entry.dispatchEvent('dismissModal');

            this.hashId = data.content[1][1].id;
            var { tooltip: { title, content } } = data;

            var tooltip = createTooltip(
                title,
                content,
                '.btn_confirm_modal',
                callback,
                { render: false }
            );

            var event = Entry.getMainWS().widgetUpdateEvent;

            if (!data.skip) {
                Entry.dispatchEvent(
                    'openSpriteManager',
                    data.content[3][1],
                    event.notify.bind(event)
                );
            }
            return tooltip;
        },
        undo: 'removeObject',
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
    };

    c[COMMAND_TYPES.addObjectButtonClick] = {
        do: function() {
            Entry.dispatchEvent('dismissModal');
            Entry.dispatchEvent('openSpriteManager');
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        undo: 'dismissModal',
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        dom: ['engine', 'objectAddButton'],
    };
})(Entry.Command);
