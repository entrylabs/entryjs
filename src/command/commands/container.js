'use strict';

const { createTooltip, returnEmptyArr, getExpectedData } = require('../command_util');

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.containerSelectObject] = {
        do(objectId) {
            Entry.container.selectObject(objectId);
        },
        state(objectId) {
            return [Entry.playground.object.id, objectId];
        },
        log(objectId) {
            return [
                ['objectId', objectId],
                ['objectIndex', Entry.container.getObjectIndex(objectId)],
            ];
        },
        restrict(data, domQuery, callback) {
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
                    callBack() {
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
        do(objectId) {
            Entry.Utils.forceStopSounds();
            const { name } = Entry.container.getObject(objectId);
            Entry.container.removeObject(objectId);
            Entry.Utils.doCodeChange();

            Entry.toast.success(
                Lang.Workspace.remove_object,
                `${name} ${Lang.Workspace.remove_object_msg}`
            );
        },
        state(objectId) {
            const object = Entry.container.getObject(objectId);
            return [object.toJSON(), object.getIndex()];
        },
        log(objectId) {
            return [['objectId', objectId]];
        },
        undo: 'addObject',
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['container', 'objectId', '&0', 'removeButton'],
    };

    c[COMMAND_TYPES.addObject] = {
        do(objectModel, index) {
            objectModel.id = getExpectedData('objectModel', {}).id || objectModel.id;
            Entry.container.addObjectFunc(objectModel, index);
            Entry.dispatchEvent('dismissModal');
            Entry.Utils.doCodeChange();
        },
        state(objectModel, index) {
            objectModel.id = getExpectedData('objectModel', {}).id || objectModel.id;
            return [objectModel.id, index];
        },
        log(objectModel, index) {
            const { sprite, options = {} } = objectModel;
            const { font } = options;

            //$$hashKey can't saved for db
            const _omitFunc = _.partial(_.omit, _, '$$hashKey');

            objectModel.sprite = _omitFunc(sprite);
            if (_.isObject(font)) {
                objectModel.options.font = _omitFunc(font);
            }
            return [
                ['objectModel', objectModel],
                ['objectIndex', index],
                ['spriteId', sprite._id],
            ];
        },
        dom: ['.btn_confirm_modal'],
        restrict(data, domQuery, callback) {
            Entry.dispatchEvent('dismissModal');
            const {
                tooltip: { title, content },
            } = data;

            const tooltip = createTooltip(title, content, '.btn_confirm_modal', callback, {
                render: false,
            });

            const event = Entry.getMainWS().widgetUpdateEvent;

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
        do() {
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
