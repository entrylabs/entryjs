/**
 * @fileoverview Container handle all object in entry.
 */
'use strict';

/**
 * Class for a container.
 * This have view for objects.
 * @constructor
 */
Entry.Container = function() {
    /**
     * Array for entry objects
     * @type {Array.<Entry.EntryObject>}
     */
    this.objects_ = [];

    /**
     * Dictionary for caching images
     * @type {Dictionary.<createjs.Image}
     */
    this.cachedPicture = {};

    /**
     * variable for canvas input
     * @type {String}
     */
    this.inputValue = {};

    /**
     * object model store copied object by context menu
     * @type {object model}
     */
    this.copiedObject = null;

    /**
     * Array for storing current scene objects
     * @type {Array.<object model>}
     */
    this.currentObjects_ = null;
    this._extensionObjects = [];
    Entry.addEventListener(
        'workspaceChangeMode',
        function() {
            var ws = Entry.getMainWS();
            if (ws && ws.getMode() === Entry.Workspace.MODE_VIMBOARD) {
                this.objects_.forEach(function(o) {
                    o.script && o.script.destroyView();
                });
            }
        }.bind(this)
    );

    Entry.addEventListener('run', this.disableSort.bind(this));
    Entry.addEventListener('stop', this.enableSort.bind(this));
};

/**
 * Control bar view generator.
 * @param {!Element} containerView containerView from Entry.
 * @param {?string} option for choose type of view.
 */
Entry.Container.prototype.generateView = function(containerView, option) {
    /** @type {!Element} */
    var that = this;
    this._view = containerView;
    this._view.addClass('entryContainer');
    this._view.addClass('entryContainerWorkspace');
    this._view.setAttribute('id', 'entryContainerWorkspaceId');

    var addButton = Entry.createElement('div');
    addButton.addClass('entryAddObjectWorkspace');
    addButton.innerHTML = Lang.Workspace.add_object;
    addButton.bindOnClick(function(e) {
        Entry.dispatchEvent('openSpriteManager');
    });
    //this._view.appendChild(addButton);

    var ulWrapper = Entry.createElement('div');
    var baseClass = 'entryContainerListWorkspaceWrapper';
    if (Entry.isForLecture) baseClass += ' lecture';
    ulWrapper.addClass(baseClass);

    Entry.Utils.disableContextmenu(ulWrapper);

    $(ulWrapper).bind('mousedown touchstart', function(e) {
        var longPressTimer = null;
        var doc = $(document);
        var eventType = e.type;
        var handled = false;

        if (Entry.Utils.isRightButton(e)) {
            that._rightClick(e);
            handled = true;
            return;
        }

        var mouseDownCoordinate = { x: e.clientX, y: e.clientY };

        if (eventType === 'touchstart' && !handled) {
            e.stopPropagation();
            e = Entry.Utils.convertMouseEvent(e);
            longPressTimer = setTimeout(function() {
                if (longPressTimer) {
                    longPressTimer = null;
                    that._rightClick(e);
                }
            }, 1000);
            doc.bind('mousemove.container touchmove.container', onMouseMove);
            doc.bind('mouseup.container touchend.container', onMouseUp);
        }

        function onMouseMove(e) {
            if (!mouseDownCoordinate) return;
            var diff = Math.sqrt(
                Math.pow(e.pageX - mouseDownCoordinate.x, 2) +
                    Math.pow(e.pageY - mouseDownCoordinate.y, 2)
            );
            if (diff > 5 && longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }

        function onMouseUp(e) {
            e.stopPropagation();
            doc.unbind('.container');
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }
    });

    this._view.appendChild(ulWrapper);

    var extensionListView = Entry.createElement('ul');
    ulWrapper.appendChild(extensionListView);
    this._extensionListView = Entry.Dom(extensionListView, {
        class: 'entryContainerExtensions',
    });

    var listView = Entry.createElement('ul');
    listView.addClass('entryContainerListWorkspace');
    ulWrapper.appendChild(listView);
    this.listView_ = listView;

    this.enableSort();
};
/**
 * enable sort.
 */
Entry.Container.prototype.enableSort = function() {
    var view = this.listView_;
    $(view).sortable({
        start: function(event, ui) {
            ui.item.data('start_pos', ui.item.index());
        },
        stop: function(event, ui) {
            Entry.container.moveElement(
                ui.item.data('start_pos'),
                ui.item.index()
            );
        },
        axis: 'y',
        cancel: 'input.selectedEditingObject',
    });
};

/**
 * disable sort.
 */
Entry.Container.prototype.disableSort = function() {
    var view = this.listView_;
    $(view).sortable('destroy');
};

/**
 * update list view to sort item.
 */
Entry.Container.prototype.updateListView = function() {
    if (!this.listView_) {
        return;
    }

    var view = this.listView_;

    while (view.hasChildNodes()) {
        view.removeChild(view.lastChild);
    }

    var fragment = document.createDocumentFragment();

    var objs = this.getCurrentObjects().slice();

    var ret = objs.filter(function(o) {
        return o.index !== undefined;
    });

    if (ret.length === objs.length) {
        objs = objs.sort(function(a, b) {
            return a.index - b.index;
        });
    }

    objs.forEach(function(obj) {
        !obj.view_ && obj.generateView();
        fragment.appendChild(obj.view_);
    });

    view.appendChild(fragment);
    Entry.stage.sortZorder();
    return true;
};

/**
 * Set objects
 * @param {!Array.<object model>} objectModels
 */
Entry.Container.prototype.setObjects = function(objectModels) {
    for (var i in objectModels) {
        var object = new Entry.EntryObject(objectModels[i]);
        this.objects_.push(object);
    }
    this.updateObjectsOrder();
    this.updateListView();
    Entry.variableContainer.updateViews();
    var type = Entry.type;
    if (type == 'workspace' || type == 'phone') {
        var target = this.getCurrentObjects()[0];
        target && this.selectObject(target.id);
    }
};

/**
 * get Pictures element
 * @param {!String} pictureId
 */
Entry.Container.prototype.getPictureElement = function(pictureId, objectId) {
    var object = this.getObject(objectId);
    var picture = object.getPicture(pictureId);
    if (picture) return picture.view;
    else throw new Error('No picture found');
};
/**
 * Set Pictures
 * @param {!Object picture} picture
 */
Entry.Container.prototype.setPicture = function(picture) {
    var object = this.getObject(picture.objectId);
    for (var j in object.pictures) {
        if (picture.id === object.pictures[j].id) {
            var picture_ = {};
            picture_.dimension = picture.dimension;
            picture_.id = picture.id;
            picture_.filename = picture.filename;
            picture_.fileurl = picture.fileurl;
            picture_.name = picture.name;
            picture_.view = object.pictures[j].view;
            object.pictures[j] = picture_;
            return;
        }
    }
    throw new Error('No picture found');
};

/**
 * Set Pictures
 * @param {!String} pictureId
 */
Entry.Container.prototype.selectPicture = function(pictureId, objectId) {
    var object = this.getObject(objectId);
    var picture_ = object.getPicture(pictureId);
    if (picture_) {
        object.selectedPicture = picture_;
        object.entity.setImage(picture_);
        object.updateThumbnailView();
        return object.id;
    }
    throw new Error('No picture found');
};

/**
 * Add object
 * @param {!object model} objectModel
 * @param {?number} index exist when user add object
 * @return {Entry.EntryObject}
 */
Entry.Container.prototype.addObject = function(objectModel, index, isNotRender) {
    var object = new Entry.EntryObject(objectModel);
    object.name = Entry.getOrderedName(object.name, this.objects_);

    if (Entry.stateManager) {
        Entry.stateManager.addCommand(
            'add object',
            this,
            this.removeObject,
            object
        );
    }

    object.scene = object.scene || Entry.scene.selectedScene;

    var isBackground = objectModel.sprite.category;
    isBackground = isBackground && isBackground.main == 'background';

    if (typeof index == 'number') {
        if (isBackground) {
            object.setLock(true);
            this.objects_.push(object);
        } else this.objects_.splice(index, 0, object);
    } else if (isBackground) this.objects_.push(object);
    else this.objects_.unshift(object);

    if(!isNotRender) {
        object.generateView();
        this.setCurrentObjects();
        this.selectObject(object.id);
        this.updateObjectsOrder();
        this.updateListView();
        Entry.variableContainer.updateViews();
    }
    
    return new Entry.State(this, this.removeObject, object);
};

Entry.Container.prototype.renderObject = function (object) {
    object.generateView();
    this.setCurrentObjects();
    this.selectObject(object.id);
}

Entry.Container.prototype.addExtension = function(obj) {
    this._extensionObjects.push(obj);
    if (this._extensionListView)
        this._extensionListView.append(obj.renderView());
    return obj;
};

Entry.Container.prototype.removeExtension = function(obj) {
    if (!obj) return;

    var extensions = this._extensionObjects;
    var index = extensions.indexOf(obj);
    if (index > -1) extensions.splice(index, 1);

    obj.destroy && obj.destroy();
};

/**
 * Add Clone object
 * @param {!Entry.EntryObject} object
 */
Entry.Container.prototype.addCloneObject = function(object, scene, isNotRender) {
    var json = object.toJSON(true);

    json.script = change('sounds', object, json);
    json.script = change('pictures', object, json);

    Entry.variableContainer.addCloneLocalVariables({
        objectId: object.id,
        newObjectId: json.id,
        json: json,
    });
    json.scene = scene || Entry.scene.selectedScene;
    this.addObject(json, null, isNotRender);

    return this.getObject(json.id);

    function change(keyName, object, jsonData) {
        var target = jsonData.sprite[keyName];
        var script = jsonData.script;
        (object[keyName] || []).forEach(function(value, index) {
            script = script.replace(
                new RegExp(value.id, 'g'),
                target[index].id
            );
        });
        return script;
    }
};

/**
 * Delete object
 * @param {!Entry.EntryObject} object
 * @return {Entry.State}
 */
Entry.Container.prototype.removeObject = function(object, isPass) {
    var objects = this.objects_;

    var index = objects.indexOf(object);
    var objectJSON = object.toJSON();
    if (Entry.stateManager) {
        Entry.stateManager.addCommand(
            'remove object',
            this,
            this.addObject,
            objectJSON,
            index
        );
    }
    var state = new Entry.State(this.addObject, objectJSON, index);

    object.destroy();
    objects.splice(index, 1);    
    Entry.variableContainer.removeLocalVariables(object.id);

    if(isPass) {
        return state;
    }

    this.setCurrentObjects();
    Entry.stage.sortZorder();
    var currentObjects = this.getCurrentObjects();
    if (currentObjects.length) this.selectObject(currentObjects[0].id);
    else {
        this.selectObject();
        Entry.playground.flushPlayground();
    }
    
    Entry.toast.success(
        Lang.Workspace.remove_object,
        object.name + ' ' + Lang.Workspace.remove_object_msg
    );
        
    Entry.playground.reloadPlayground();
    return state;
};

/**
 * Select object
 * @param {string} objectId
 */
Entry.Container.prototype.selectObject = function(objectId, changeScene) {
    var object = this.getObject(objectId);
    var workspace = Entry.getMainWS();

    if (changeScene && object) Entry.scene.selectScene(object.scene);

    var className = 'selectedObject';
    this.mapObjectOnScene(function(o) {
        !o.view_ && o.generateView && o.generateView();
        var selected = o === object;
        var view = o.view_;
        if (selected) view && view.addClass(className);
        else view && view.removeClass(className);

        o.isSelected_ = selected;
    });

    if (object) {
        if (workspace && workspace.vimBoard && Entry.isTextMode) {
            var sObject = workspace.vimBoard._currentObject;
            var parser = workspace.vimBoard._parser;
            if (sObject && !this.getObject(sObject.id)) {
            } else if (parser && parser._onError) {
                if (sObject && object.id != sObject.id) {
                    if (!Entry.scene.isSceneCloning) {
                        try {
                            workspace._syncTextCode();
                        } catch (e) {}
                        if (parser && !parser._onError) {
                            Entry.container.selectObject(object.id, true);
                            return;
                        } else {
                            Entry.container.selectObject(sObject.id, true);
                            return;
                        }
                    } else {
                        Entry.container.selectObject(sObject.id);
                        return;
                    }
                }
            } else {
                if (sObject && object.id != sObject.id) {
                    if (!Entry.scene.isSceneCloning) {
                        try {
                            workspace._syncTextCode();
                        } catch (e) {}
                        if (parser && parser._onError) {
                            Entry.container.selectObject(sObject.id, true);
                            return;
                        }
                    } else {
                        Entry.container.selectObject(sObject.id);
                        return;
                    }
                }
            }
        }
    } else {
        workspace && workspace.vimBoard && workspace.vimBoard.clearText();
    }

    if (Entry.playground) Entry.playground.injectObject(object);
    if (Entry.type != 'minimize' && Entry.engine.isState('stop'))
        Entry.stage.selectObject(object);
};

/**
 * Get all objects
 */
Entry.Container.prototype.getAllObjects = function() {
    return this.objects_;
};

/**
 * Object Getter
 * @param {string} objectId
 * @return {Entry.EntryObject}
 */
Entry.Container.prototype.getObject = function(objectId) {
    if (!objectId && Entry.playground && Entry.playground.object)
        objectId = Entry.playground.object.id;
    var length = this.objects_.length;
    for (var i = 0; i < length; i++) {
        var object = this.objects_[i];
        if (object.id == objectId) return object;
    }
};

/**
 * Entity Getter
 * @param {string} objectId
 * @return {Entry.EntityObject}
 */
Entry.Container.prototype.getEntity = function(objectId) {
    var object = this.getObject(objectId);
    if (!object) {
        Entry.toast.alert(
            Lang.Msgs.runtime_error,
            Lang.Workspace.object_not_found,
            true
        );
        return;
    }
    return object.entity;
};

/**
 * get variable on canvas
 * @return {Entry.Variable}
 */
Entry.Container.prototype.getVariable = function(variableId) {
    for (var i = 0; i < this.variables_.length; i++) {
        var variable = this.variables_[i];
        if (variable.getId() == variableId) return variable;
        if (variable.getName() == variableId) return variable;
    }
};

/**
 * Move object in objects_
 * this method is for sortable
 * @param {!number} start
 * @param {!number} end
 * @param {?boolean} isCallFromState
 * @return {Entry.State}
 */
Entry.Container.prototype.moveElement = function(start, end, isCallFromState) {
    var startIndex, endIndex, objs;
    objs = this.getCurrentObjects();
    startIndex = this.getAllObjects().indexOf(objs[start]);
    endIndex = this.getAllObjects().indexOf(objs[end]);
    if (!isCallFromState && Entry.stateManager)
        Entry.stateManager.addCommand(
            'reorder object',
            Entry.container,
            Entry.container.moveElement,
            endIndex,
            startIndex,
            true
        );

    this.objects_.splice(endIndex, 0, this.objects_.splice(startIndex, 1)[0]);
    this.setCurrentObjects();
    Entry.container.updateListView();
    Entry.requestUpdate = true;
    return new Entry.State(
        Entry.container,
        Entry.container.moveElement,
        endIndex,
        startIndex,
        true
    );
};

/**
 * generate list for blockly dropdown dynamic
 * @param {string} menuName
 */
Entry.Container.prototype.getDropdownList = function(menuName, object) {
    var result = [];
    switch (menuName) {
        case 'sprites':
            var objs = this.getCurrentObjects();
            var length = objs.length;
            for (var i = 0; i < length; i++) {
                var object = objs[i];
                result.push([object.name, object.id]);
            }
            break;
        case 'spritesWithMouse':
            var objs = this.getCurrentObjects();
            var length = objs.length;
            for (var i = 0; i < length; i++) {
                var object = objs[i];
                result.push([object.name, object.id]);
            }
            result.push([Lang.Blocks.mouse_pointer, 'mouse']);
            break;
        case 'spritesWithSelf':
            var objs = this.getCurrentObjects();
            var length = objs.length;
            for (var i = 0; i < length; i++) {
                var object = objs[i];
                result.push([object.name, object.id]);
            }
            result.push([Lang.Blocks.self, 'self']);
            break;
        case 'textBoxWithSelf': {
            const objs = this.getCurrentObjects();
            objs.forEach((obj) => {
                if(obj.objectType === 'textBox') {
                    result.push([obj.name, obj.id]);
                };
            });
            result.push([Lang.Blocks.self, 'self']);
            break;
        }
        case 'collision':
            result.push([Lang.Blocks.mouse_pointer, 'mouse']);
            var objs = this.getCurrentObjects();
            var length = objs.length;
            for (var i = 0; i < length; i++) {
                var object = objs[i];
                result.push([object.name, object.id]);
            }
            result.push([Lang.Blocks.wall, 'wall']);
            result.push([Lang.Blocks.wall_up, 'wall_up']);
            result.push([Lang.Blocks.wall_down, 'wall_down']);
            result.push([Lang.Blocks.wall_right, 'wall_right']);
            result.push([Lang.Blocks.wall_left, 'wall_left']);
            break;
        case 'pictures':
            var object = Entry.playground.object || object;
            if (!object) break;
            var pictures = object.pictures || [];
            for (var i = 0; i < pictures.length; i++) {
                var picture = pictures[i];
                result.push([picture.name, picture.id]);
            }
            break;
        case 'messages':
            var messages = Entry.variableContainer.messages_;
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                result.push([message.name, message.id]);
            }
            break;
        case 'variables':
            var variables = Entry.variableContainer.variables_;
            for (var i = 0; i < variables.length; i++) {
                var variable = variables[i];

                if (
                    variable.object_ &&
                    Entry.playground.object &&
                    variable.object_ != Entry.playground.object.id
                )
                    continue;
                result.push([variable.getName(), variable.getId()]);
            }
            if (!result || result.length === 0)
                result.push([Lang.Blocks.VARIABLE_variable, 'null']);
            break;
        case 'lists':
            var object = Entry.playground.object || object;
            var lists = Entry.variableContainer.lists_;
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i];
                if (list.object_ && object && list.object_ != object.id)
                    continue;
                result.push([list.getName(), list.getId()]);
            }
            if (!result || result.length === 0)
                result.push([Lang.Blocks.VARIABLE_list, 'null']);
            break;
        case 'scenes':
            var scenes = Entry.scene.scenes_;
            for (var i = 0; i < scenes.length; i++) {
                var scene = scenes[i];
                result.push([scene.name, scene.id]);
            }
            break;
        case 'sounds':
            var object = Entry.playground.object || object;
            if (!object) break;
            var sounds = object.sounds || [];
            for (var i = 0; i < sounds.length; i++) {
                var sound = sounds[i];
                result.push([sound.name, sound.id]);
            }
            break;
        case 'clone':
            result.push([Lang.Blocks.oneself, 'self']);
            this.getCurrentObjects().forEach(function(o) {
                result.push([o.name, o.id]);
            });
            break;
        case 'objectSequence':
            var length = this.getCurrentObjects().length;
            for (var i = 0; i < length; i++) {
                result.push([(i + 1).toString(), i.toString()]);
            }
            break;
    }
    if (!result.length) {
        result = [[Lang.Blocks.no_target, 'null']];
    }
    return result;
};

/**
 * Initialize entities to state before run
 */
Entry.Container.prototype.clearRunningState = function() {
    this.mapObject(function(object) {
        object.clearExecutor();
    });
};

Entry.Container.prototype.clearRunningStateOnScene = function() {
    this.mapObjectOnScene(function(object) {
        object.clearExecutor();
    });
};

/**
 * Apply map function to objects. But this not replace object with returned one.
 * So giving map function don't have to return object.
 * And this support another arguments.
 * @param {!function} mapFunction
 * @param {} param
 */
Entry.Container.prototype.mapObject = function(mapFunction, param) {
    var length = this.objects_.length;
    var output = [];
    for (var i = 0; i < this._extensionObjects.length; i++) {
        var object = this._extensionObjects[i];
        output.push(mapFunction(object, param));
    }
    for (var i = 0; i < length; i++) {
        var object = this.objects_[i];
        output.push(mapFunction(object, param));
    }
    return output;
};

Entry.Container.prototype.mapObjectOnScene = function(mapFunction, param) {
    var objects = this.getCurrentObjects();
    var length = objects.length;
    var output = [];

    for (var i = 0; i < this._extensionObjects.length; i++) {
        var object = this._extensionObjects[i];
        output.push(mapFunction(object, param));
    }
    for (var i = 0; i < length; i++) {
        var object = objects[i];
        output.push(mapFunction(object, param));
    }
    return output;
};

/**
 * Apply map function to objects. But this not replace object with returned one.
 * So giving map function don't have to return object.
 * And this support another arguments.
 * @param {!function} mapFunction
 * @param {} param
 */
Entry.Container.prototype.mapEntity = function(mapFunction, param) {
    var length = this.objects_.length;
    var output = [];
    for (var i = 0; i < length; i++) {
        var entity = this.objects_[i].entity;
        output.push(mapFunction(entity, param));
    }
    return output;
};

Entry.Container.prototype.mapEntityOnScene = function(mapFunction, param) {
    var objects = this.getCurrentObjects();
    var length = objects.length;
    var output = [];
    for (var i = 0; i < length; i++) {
        var entity = objects[i].entity;
        output.push(mapFunction(entity, param));
    }
    return output;
};

/**
 * Apply map function to objects. But this not replace object with returned one.
 * So giving map function don't have to return object.
 * And this support another arguments.
 * This also apply to cloned entities.
 * @param {!function} mapFunction
 * @param {} param
 */
Entry.Container.prototype.mapEntityIncludeClone = function(mapFunction, param) {
    var objects = this.objects_;
    var length = objects.length;
    var output = [];
    for (var i = 0; i < length; i++) {
        var object = objects[i];
        var lenx = object.clonedEntities.length;
        output.push(mapFunction(object.entity, param));
        for (var j = 0; j < lenx; j++) {
            var entity = object.clonedEntities[j];
            if (entity && !entity.isStamp)
                output.push(mapFunction(entity, param));
        }
    }
    return output;
};

Entry.Container.prototype.mapEntityIncludeCloneOnScene = function(
    mapFunction,
    param
) {
    var objects = this.getCurrentObjects();
    var length = objects.length;
    var output = [];
    for (var i = 0; i < this._extensionObjects.length; i++) {
        var object = this._extensionObjects[i];
        output.push(mapFunction(object.entity, param));
    }
    for (var i = 0; i < length; i++) {
        var object = objects[i];
        output.push(mapFunction(object.entity, param));

        object.getClonedEntities().forEach(function(entity) {
            output.push(mapFunction(entity, param));
        });
    }
    return output;
};

/**
 * Get cached picture
 * @param {!string} pictureId
 * @return {?createjs.Image}
 */
Entry.Container.prototype.getCachedPicture = function(pictureId) {
    Entry.assert(typeof pictureId == 'string', 'pictureId must be string');
    return this.cachedPicture[pictureId];
};

/**
 * cache picture
 * @param {!picture object} pictureModel
 */
Entry.Container.prototype.cachePicture = function(pictureId, image) {
    this.cachedPicture[pictureId] = image;
};

Entry.Container.prototype.unCachePictures = function(
    entity,
    pictures,
    isClone
) {
    if (!entity || !pictures) return;
    var entityId;

    if (pictures.constructor !== Array) pictures = [pictures];

    if (entity.constructor === Entry.EntityObject) entityId = entity.id;
    else entityId = entity;

    pictures.forEach(
        function(p) {
            var id = p.id + (isClone ? '' : entityId);
            delete this.cachedPicture[id];
        }.bind(this)
    );
};

/**
 * convert this object's data to JSON.
 * @return {JSON}
 */
Entry.Container.prototype.toJSON = function() {
    var json = [];
    var length = this.objects_.length;
    for (var i = 0; i < length; i++) {
        var object = this.objects_[i];
        json.push(object.toJSON());
    }
    return json;
};

/**
 * take snapshot of current objects sequence
 */
Entry.Container.prototype.takeSequenceSnapshot = function() {
    var length = this.objects_.length;
    var objects = this.objects_;
    for (var i = 0; i < length; i++) objects[i].index = i;
};

/**
 * load snapshot of original objects sequence
 */
Entry.Container.prototype.loadSequenceSnapshot = function() {
    var length = this.objects_.length;
    var arr = new Array(length);
    for (var i = 0; i < length; i++) {
        var object = this.objects_[i];
        var _index = object.index !== undefined ? object.index : i;
        arr[_index] = object;
        delete object.index;
    }
    this.objects_ = arr;
    this.setCurrentObjects();
    Entry.stage.sortZorder();
    this.updateListView();
};

/**
 * return canvas inputValue
 * @return {String}
 */
Entry.Container.prototype.getInputValue = function() {
    return this.inputValue.getValue();
};

/**
 * set canvas inputValue
 * @param {String} inputValue from canvas
 */
Entry.Container.prototype.setInputValue = function(inputValue) {
    if (this.inputValue.complete) return;
    if (!inputValue) this.inputValue.setValue(0);
    else this.inputValue.setValue(inputValue);
    Entry.stage.hideInputField();
    Entry.dispatchEvent('answerSubmitted');
    if (Entry.console) Entry.console.stopInput(inputValue);
    this.inputValue.complete = true;
};

Entry.Container.prototype.resetSceneDuringRun = function() {
    if (!Entry.engine.isState('run')) return;

    this.mapEntityOnScene(function(entity) {
        entity.reset();
    });
    this.clearRunningStateOnScene();
    Entry.stage.hideInputField();
};

Entry.Container.prototype.setCopiedObject = function(object) {
    this.copiedObject = object;
};

Entry.Container.prototype.updateObjectsOrder = function() {
    var scenes = Entry.scene.getScenes();

    var objs = [];

    for (var i = 0; i < scenes.length; i++) {
        var tempObjs = this.getSceneObjects(scenes[i]);
        for (var j = 0; j < tempObjs.length; j++) objs.push(tempObjs[j]);
    }
    this.objects_ = objs;
};

/**
 *  get objects list belonged to specific scene
 *  @param {scene model} scene
 *  @return {Array<object model>}
 */
Entry.Container.prototype.getSceneObjects = function(scene) {
    scene = scene || Entry.scene.selectedScene;
    var objects = [],
        containerObjects = this.getAllObjects();
    for (var i = 0; i < containerObjects.length; i++) {
        if (scene.id == containerObjects[i].scene.id)
            objects.push(containerObjects[i]);
    }
    return objects;
};

/**
 *  set objects list belonged to specific scene
 */
Entry.Container.prototype.setCurrentObjects = function() {
    this.currentObjects_ = this.getSceneObjects();
};

/**
 *  get objects list belonged to current scene
 */
Entry.Container.prototype.getCurrentObjects = function() {
    var objs = this.currentObjects_;
    if (!objs || objs.length === 0) this.setCurrentObjects();
    return this.currentObjects_ || [];
};

/**
 *  get project jsons in art_view for saving especially for art_viewcontroller
 *  @param {!resource project} project
 *  @return {entry project} project
 */
Entry.Container.prototype.getProjectWithJSON = function(project) {
    project.objects = Entry.container.toJSON();
    project.variables = Entry.variableContainer.getVariableJSON();
    project.messages = Entry.variableContainer.getMessageJSON();
    project.scenes = Entry.scene.toJSON();
    return project;
};

Entry.Container.prototype.blurAllInputs = function() {
    var objects = this.getSceneObjects();
    objects.map(function(obj) {
        var inputs = obj.view_.getElementsByTagName('input');
        for (var i = 0, len = inputs.length; i < len; i++) inputs[i].blur();
    });
};

Entry.Container.prototype.showProjectAnswer = function() {
    var answer = this.inputValue;
    if (!answer) return;
    answer.setVisible(true);
};

Entry.Container.prototype.hideProjectAnswer = function(
    removeBlock,
    notIncludeSelf
) {
    var answer = this.inputValue;
    if (!answer || !answer.isVisible() || Entry.engine.isState('run')) return;

    var objects = Entry.container.getAllObjects();
    var answerTypes = [
        'ask_and_wait',
        'get_canvas_input_value',
        'set_visible_answer',
    ];

    for (var i = 0, len = objects.length; i < len; i++) {
        var code = objects[i].script;
        for (var j = 0; j < answerTypes.length; j++) {
            var blocks = code.getBlockList(false, answerTypes[j]);
            if (notIncludeSelf) {
                var index = blocks.indexOf(removeBlock);
                if (index > -1) blocks.splice(index, 1);
            }
            if (blocks.length > 0) return;
        }
    }

    //answer related blocks not found
    //hide canvas answer view
    answer.setVisible(false);
};

Entry.Container.prototype.getView = function() {
    return this._view;
};

// dummy
Entry.Container.prototype.resize = function() {
    return;
};

Entry.Container.prototype._rightClick = function(e) {
    if (e.stopPropagation) e.stopPropagation();
    var options = [
        {
            text: Lang.Blocks.Paste_blocks,
            enable:
                !Entry.engine.isState('run') && !!Entry.container.copiedObject,
            callback: function() {
                if (Entry.container.copiedObject)
                    Entry.container.addCloneObject(
                        Entry.container.copiedObject
                    );
                else
                    Entry.toast.alert(
                        Lang.Workspace.add_object_alert,
                        Lang.Workspace.object_not_found_for_paste
                    );
            },
        },
    ];

    Entry.ContextMenu.show(options, 'workspace-contextmenu', {
        x: e.clientX,
        y: e.clientY,
    });
};

Entry.Container.prototype.removeFuncBlocks = function(functionType) {
    this.objects_.forEach(function(object) {
        object.script.removeBlocksByType(functionType);
    });
};

Entry.Container.prototype.clear = function() {
    this.objects_.map(function(o) {
        o.destroy();
    });
    this.objects_ = [];
    // INFO : clear 시도할때 _extensionObjects 초기화
    this._extensionObjects.map(function(o) {
        o.destroy();
    });
    this._extensionObjects = [];
    // TODO: clear 때 this._extensionListView 도 비워 줘야 하는지 확인 필요.
    Entry.playground.flushPlayground();
};

Entry.Container.prototype.selectNeighborObject = function(option) {
    var objects = this.getCurrentObjects();
    if (!objects || objects.length === 0) return;

    var currentIndex = objects.indexOf(Entry.playground.object);
    var maxLen = objects.length;
    switch (option) {
        case 'prev':
            if (--currentIndex < 0) currentIndex = objects.length - 1;
            break;
        case 'next':
            currentIndex = ++currentIndex % maxLen;
            break;
    }

    var object = objects[currentIndex];
    if (!object) return;

    Entry.container.selectObject(object.id);
};

Entry.Container.prototype.getObjectIndex = function(objectId) {
    return this.objects_.indexOf(this.getObject(objectId));
};

Entry.Container.prototype.getDom = function(query) {
    if (query.length >= 1) {
        switch (query.shift()) {
            case 'objectIndex':
                return this.objects_[query.shift()].getDom(query);
        }
    } else {
    }
};

Entry.Container.prototype.isSceneObjectsExist = function() {
    var objects = this.getSceneObjects();
    return !!(objects && objects.length);
};

Entry.Container.prototype.adjustClonedValues = function(oldIds, newIds) {
    if (!(oldIds && newIds)) return;
    var that = this;
    newIds.forEach(function(newId) {
        that
            .getObject(newId)
            .script.getBlockList()
            .forEach(function(b) {
                if (!b || !b.params) return;
                var changed = false;
                var ret = b.params.map(function(p) {
                    if (typeof p !== 'string') return p;
                    var index = oldIds.indexOf(p);
                    if (index < 0) return p;
                    changed = true;
                    return newIds[index];
                });
                changed && b.set({ params: ret });
            });
    });
};

Entry.Container.prototype.getBlockList = function() {
    var blocks = [];

    this.objects_.forEach(function(o) {
        blocks = blocks.concat(o.script.getBlockList());
    });

    return blocks;
};

Entry.Container.prototype.scrollToObject = function(ObjectId) {
    var object = this.getObject(ObjectId);

    object.view_ && object.view_.scrollIntoView();
    document.body.scrollIntoView();
};
