/*
 *
 */
'use strict';

var {
    createTooltip,
    returnEmptyArr,
    getExpectedData,
} = require('../command_util');

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
            var { name } = Entry.container.getObject(objectId);
            Entry.container.removeObject(objectId);

            Entry.toast.success(
                Lang.Workspace.remove_object,
                name + ' ' + Lang.Workspace.remove_object_msg
            );
        },
        state: function(objectId) {
            var object = Entry.container.getObject(objectId);
            return [object.toJSON(), object.getIndex()];
        },
        log: function(objectId) {
            return [['objectId', objectId]];
        },
        undo: 'addObject',
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['container', 'objectId', '&0', 'removeButton'],
    };

    c[COMMAND_TYPES.addObject] = {
        do: function(objectModel, index) {
            objectModel.id =
                getExpectedData('objectModel', {}).id || objectModel.id;
            Entry.container.addObjectFunc(objectModel, index);
            Entry.dispatchEvent('dismissModal');
        },
        state: function(objectModel, index) {
            objectModel.id =
                getExpectedData('objectModel', {}).id || objectModel.id;
            return [objectModel.id, index];
        },
        log: function(objectModel, index) {
            var { sprite, options } = objectModel;

            //$$hashKey can't saved for db
            var _omitFunc = _.partial(_.omit, _, '$$hashKey');

            objectModel.sprite = _omitFunc(sprite);
            if (options) {
                objectModel.options.font = _omitFunc(options.font);
            }
            return [
                ['objectModel', objectModel],
                ['objectIndex', index],
                ['spriteId', sprite._id],
            ];
        },
        dom: ['.btn_confirm_modal'],
        restrict: function(data, domQuery, callback) {
            Entry.dispatchEvent('dismissModal');
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
                    getExpectedData('spriteId'),
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
