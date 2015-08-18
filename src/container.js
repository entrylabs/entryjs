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
     * Array for entry variables
     * @type {Array.<entry variable>}
     */
    this.variables_ = [];

    /**
     * Array for entry block event
     * @type {Array.<block event>}
     */
    this.messages_ = [];

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
};

/**
 * Control bar view generator.
 * @param {!Element} containerView containerView from Entry.
 * @param {?string} option for choose type of view.
 */
Entry.Container.prototype.generateView = function(containerView, option) {
    /** @type {!Element} */
    this.view_ = containerView;
    this.view_.addClass('entryContainer');
    if (!option || option == 'workspace') {
        this.view_.addClass('entryContainerWorkspace');

        var addButton = Entry.createElement('div');
        addButton.addClass('entryAddObjectWorkspace');
        addButton.innerHTML = Lang.Workspace.add_object;
        addButton.bindOnClick(function(e){
            Entry.dispatchEvent('openSpriteManager');
        })
        //this.view_.appendChild(addButton);

        var ulWrapper = Entry.createElement('div');
        ulWrapper.addClass('entryContainerListWorkspaceWrapper');

        if (Entry.isForLecture) {
            this.generateTabView();
            ulWrapper.addClass('lecture');
        }

        if ($) {
            var container = this;
            context.attach('.entryContainerListWorkspaceWrapper', [
               {
                    text: '붙여넣기',
                    href: '/',
                    action: function(e){
                        e.preventDefault();
                        if (container.copiedObject)
                            container.addCloneObject(container.copiedObject);
                        else
                            Entry.toast.alert('경고', '붙여넣기 할 오브젝트가 없습니다.');
                    }
                }
            ]);
        }


        this.view_.appendChild(ulWrapper);

        var listView = Entry.createElement('ul');
        listView.addClass('entryContainerListWorkspace');

        ulWrapper.appendChild(listView);
        //this.view_.appendChild(listView);
        /** @param {!Element} */
        this.listView_ = listView;
        this.enableSort();
    } else if (option == 'phone') {
        this.view_.addClass('entryContainerPhone');

        var addButton = Entry.createElement('div');
        addButton.addClass('entryAddObjectWorkspace');
        addButton.innerHTML = Lang.Workspace.add_object;
        addButton.bindOnClick(function(e){
            Entry.dispatchEvent('openSpriteManager');
        })
        //this.view_.appendChild(addButton);

        var ulWrapper = Entry.createElement('div');
        ulWrapper.addClass('entryContainerListPhoneWrapper');
        this.view_.appendChild(ulWrapper);

        var listView = Entry.createElement('ul');
        listView.addClass('entryContainerListPhone');

        ulWrapper.appendChild(listView);
        //this.view_.appendChild(listView);
        /** @param {!Element} */
        this.listView_ = listView;
        //this.enableSort();
    }
};
/**
 * enable sort.
 */
Entry.Container.prototype.enableSort = function() {
    if ($)
        $(this.listView_).sortable({
            start: function(event, ui) {
                ui.item.data('start_pos', ui.item.index());
            },
            stop: function(event, ui){
                var start = ui.item.data('start_pos');
                var end = ui.item.index();
                Entry.container.moveElement(start, end);
            },
            axis: 'y'
        });
};

/**
 * disable sort.
 */
Entry.Container.prototype.disableSort = function() {
    if ($) {
        $(this.listView_).sortable('destroy');
    }
};

/**
 * update list view to sort item.
 */
Entry.Container.prototype.updateListView = function() {
    if (!this.listView_)
        return;

    var view = this.listView_;

    while (view.hasChildNodes())
        view.removeChild(view.lastChild);

    var objs = this.getCurrentObjects();
    for (var i in objs)
        view.appendChild(objs[i].view_);

    Entry.stage.sortZorder();
};

/**
 * Set objects
 * @param {!Array.<object model>} objectModels
 */
Entry.Container.prototype.setObjects = function(objectModels) {
    for (var i in objectModels) {
        var object = new Entry.EntryObject(objectModels[i]);
        this.objects_.push(object);
        object.generateView();
        var pictures = object.pictures;
        pictures.map(function (p) {
            Entry.playground.generatePictureElement(p);
        });
        var sounds = object.sounds;
        sounds.map(function (s) {
            Entry.playground.generateSoundElement(s);
        });
    }
    this.updateObjectsOrder()
    this.updateListView();
    Entry.stage.sortZorder();
    Entry.variableContainer.updateViews();
    var type = Entry.type;
    if (type == 'workspace' || type == 'phone') {
        var target = this.getCurrentObjects()[0];
        if (target)
            this.selectObject(target.id);
    }
};

/**
 * Add object
 * @param {!object model} objectModel
 * @param {?number} index exist when user add object
 * @return {Entry.EntryObject}
 */
Entry.Container.prototype.addObject = function(objectModel, index) {
    var backgroundStr = '배경';
    var object = new Entry.EntryObject(objectModel);
    object.name = Entry.getOrderedName(object.name, this.objects_);

    Entry.stateManager.addCommand("add object",
                                  this,
                                  this.removeObject,
                                  object);
    if (!object.scene)
        object.scene = Entry.scene.selectedScene;
    if (typeof index == 'number') {
        if (objectModel.sprite.category && objectModel.sprite.category.main == backgroundStr) {
            object.setLock(true);
            this.objects_.push(object);
        }
        else
            this.objects_.splice(index, 0, object);
    } else if (objectModel.sprite.category && objectModel.sprite.category.main == backgroundStr) {
        this.objects_.push(object);
    }
    else
        this.objects_.unshift(object);

    object.generateView();
    var pictures = object.pictures;
    pictures.map(function (p) {
        p.id = Entry.generateHash();
        Entry.playground.generatePictureElement(p);
    });

    var sounds = object.sounds;
    sounds.map(function (s) {
        Entry.playground.generateSoundElement(s);
    });
    this.setCurrentObjects();
    this.updateObjectsOrder();
    this.updateListView();

    this.selectObject(object.id);
    Entry.variableContainer.updateViews();
    return new Entry.State(this,
                           this.removeObject,
                           object);
};

/**
 * Add Clone object
 * @param {!Entry.EntryObject} object
 */
Entry.Container.prototype.addCloneObject = function(object, scene) {
    var json = object.toJSON();
    var newObjectId = Entry.generateHash();
    Entry.variableContainer.addCloneLocalVariables({objectId: json.id,
                                                    newObjectId: newObjectId,
                                                    json: json});
    json.id = newObjectId;
    json.scene = scene || Entry.scene.selectedScene;
    this.addObject(json);
};

/**
 * Delete object
 * @param {!Entry.EntryObject} object
 * @return {Entry.State}
 */
Entry.Container.prototype.removeObject = function(object) {
    var index = this.objects_.indexOf(object);
    var objectJSON = object.toJSON();
    Entry.stateManager.addCommand("remove object",
                                  this,
                                  this.addObject,
                                  objectJSON,
                                 index);
    var state = new Entry.State(
                                this.addObject,
                                objectJSON,
                                index
                               );
    object.destroy();
    this.objects_.splice(index, 1);
    this.setCurrentObjects();
    Entry.stage.sortZorder();

    if (this.objects_.length && index != 0)
        Entry.container.selectObject(this.objects_[index -1].id);
    else if (this.objects_.length && index == 0)
        Entry.container.selectObject(this.getCurrentObjects()[0].id);
    else {
        Entry.container.selectObject();
        Entry.playground.flushPlayground();
    }

    Entry.toast.success(Lang.Workspace.remove_object,
                       object.name + ' ' + Lang.Workspace.remove_object_msg);

    Entry.variableContainer.removeLocalVariables(object.id);
    Entry.playground.reloadPlayground();
    return state;
};

/**
 * Select object
 * @param {string} objectId
 */
Entry.Container.prototype.selectObject = function(objectId, changeScene) {
    var object = this.getObject(objectId);
    if (changeScene && object) {
        Entry.scene.selectScene(object.scene);
    }

    this.mapObjectOnScene(function(object) {
        if (object.view_)
            object.view_.removeClass('selectedObject');
        object.isSelected_ = false;
    });
    if (object) {
        if (object.view_)
            object.view_.addClass('selectedObject');
        object.isSelected_ = true;
    };
    if (Entry.playground)
        Entry.playground.injectObject(object);
    if (Entry.type != "minimize" && Entry.engine.isState('stop'))
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
    var length = this.objects_.length;
    for (var i = 0; i<length; i++) {
        var object = this.objects_[i];
        if (object.id == objectId)
            return object;
    };
};

/**
 * Entity Getter
 * @param {string} objectId
 * @return {Entry.EntityObject}
 */
Entry.Container.prototype.getEntity = function(objectId) {
    var object = this.getObject(objectId);
    if (!object) {
        Entry.toast.alert(Lang.Msgs.runtime_error,
                          Lang.Workspace.object_not_found,
                          true);
        return;
    }
    return object.entity;
};

/**
 * get variable on canvas
 * @return {Entry.Variable}
 */
Entry.Container.prototype.getVariable = function(variableId) {
    for (var i = 0; i<this.variables_.length; i++) {
        var variable = this.variables_[i];
        if (variable.getId() == variableId)
            return variable;
        if (variable.getName() == variableId)
            return variable;
    };
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
    if (!isCallFromState)
        Entry.stateManager.addCommand("reorder object",
                                      Entry.container,
                                      Entry.container.moveElement,
                                      endIndex, startIndex, true);

    this.objects_.splice(endIndex, 0, this.objects_.splice(startIndex, 1)[0]);
    this.setCurrentObjects();
    Entry.container.updateListView();
    return new Entry.State(Entry.container,
                           Entry.container.moveElement,
                           endIndex, startIndex, true);
};

/**
 * Move object in objects_
 * this method is for movement by block
 * @param {!number} currentindex
 * @param {!number} targetindex
 */
Entry.Container.prototype.moveElementByBlock = function(currentIndex, targetIndex) {
    var object = this.getCurrentObjects().splice(currentIndex, 1)[0];
    this.getCurrentObjects().splice(targetIndex, 0, object);
    Entry.stage.sortZorder();
    this.updateListView();
};

/**
 * Create event for block. This include user's input to define message.
 * Real adding message action is do in 'this.addMessage'
 */
Entry.Container.prototype.createMessage = function() {
    var messageName = prompt(Lang.Workspace.enter_new_message);
    if (messageName) {
        var exist = Entry.isExist(messageName, 'name',
                                  Entry.variableContainer.messages_);
        if (!exist) {
            if (Entry.variableContainer.addMessage({name:messageName}))
                Entry.toast.success(Lang.Workspace.message_add_ok,
                                   messageName + ' ' + Lang.Workspace.message_add_ok_msg);
        } else {
                Entry.toast.alert(Lang.Workspace.message_add_fail,
                                   Lang.Workspace.message_add_fail_msg);
        }
    } else {
        Entry.toast.alert(Lang.Workspace.message_add_cancel,
                           Lang.Workspace.message_add_cancel_msg);
    }
};

/**
 * Add event for block
 * @param {message model} message
 * @return {boolean} return true when success
 */
Entry.Container.prototype.addMessage = function(message) {
    if (!message.id)
        message.id = Entry.generateHash();
    this.messages_.push(message);
    Entry.playground.reloadPlayground();
    return true;
};

/**
 * Delete event for block. This just dispatch an event for workspace.
 * Real deleting message action is do in 'this.removeMessage'
 */
Entry.Container.prototype.deleteMessage = function() {
    if ( this.messages_.length == 0 ){
        Entry.toast.alert(Lang.Msgs.warn, Lang.Workspace.no_message_to_remove, 'true');
        return;
    }

    Entry.dispatchEvent('deleteMessage');
};

/**
 * Remove message from container.
 * @param {message model} message
 */
Entry.Container.prototype.removeMessage = function(message) {
    var messages = this.messages_;

    for ( var i = 0; i < messages.length; i++ ) {
        if ( messages[i].id == message.id ){
            messages.splice(i, 1);

            Entry.playground.reloadPlayground();

            break;
        }
    }
};

/**
 * Create variable for block. This include user's input to define variable.
 * Real adding variable action is do in 'this.addVariable'
 */
Entry.Container.prototype.createVariable = function() {
    var variableName = prompt(Lang.Workspace.enter_variable_name);
    if (variableName && variableName.length <= 10) {
        var exist = Entry.isExist(variableName, 'name_',
                                  Entry.variableContainer.variables_);
        if (!exist) {
            if (Entry.variableContainer.addVariable({name:variableName}))
                Entry.toast.success(Lang.Workspace.variable_add_ok,
                                   variableName + ' ' + Lang.Workspace.variable_add_ok_msg);
        } else {
                Entry.toast.alert(Lang.Workspace.variable_add_fail,
                                   Lang.Workspace.variable_add_fail_msg1);
        }
    } else {
        if (variableName && variableName.length >= 10)
            Entry.toast.alert(Lang.Workspace.variable_add_fail,Lang.Workspace.variable_add_fail_msg2, true);
        else
            Entry.toast.alert(Lang.Workspace.variable_add_calcel,Lang.Workspace.variable_add_calcel_msg);

    }
};

/**
 * Remove variable for block. This include variable.id_ from workspace.
 */
Entry.Container.prototype.removeVariable = function() {
    Entry.dispatchEvent('removeVariable');
};

/**
 * Change variable name for block. This include variable.id_ from workspace.
 */
Entry.Container.prototype.changeVariableName = function() {
    Entry.dispatchEvent('changeVariableName');
};

/**
 * Change variable name from container.variables_ list
 * @param {Object} {varId, newName}
 */
Entry.Container.prototype.changeEntryVariableName = function(object) {
    var varList = this.variables_;
    var exist = Entry.isExist(object.newName, 'name_', varList);

    if (exist) {
        Entry.toast.alert(Lang.Workspace.variable_rename_failed,
                           Lang.Workspace.variable_dup);
        return;
    }
    for(var i=0; i<varList.length; i++){
        if(varList[i].getId() == object.varId){
            this.variables_[i].setName(object.newName);
            break;
        }
    }
    Entry.toast.success(Lang.Workspace.variable_rename, Lang.Workspace.variable_rename_ok);
    Entry.playground.reloadPlayground();
};

/**
 * Rmove variable from container.variables_ list
 * Call stage.removeVariable for remove from stage.
 * @param {Variable.id_} varId
 */
Entry.Container.prototype.removeEntryVariable = function(varId) {
    var varList = this.variables_;
    for(var i=0; i<varList.length; i++){
        if(varList[i].getId() == varId){
            varList[i].remove();
            this.variables_.splice(i,1);

            Entry.playground.reloadPlayground();

            return;
        }
    }
};


/**
 * generate list for blockly dropdown dynamic
 * @param {string} menuName
 */
Entry.Container.prototype.getDropdownList = function(menuName) {
    var result = [];
    if (menuName == 'sprites') {
        var objs = this.getCurrentObjects();
        var length = objs.length;
        for (var i = 0; i<length; i++) {
            var object = objs[i];
            result.push([object.name, object.id]);
        }
    } else if (menuName == 'spritesWithMouse') {
        var objs = this.getCurrentObjects();
        var length = objs.length;
        result.push([Lang.Blocks.mouse_pointer, 'mouse']);
        for (var i = 0; i<length; i++) {
            var object = objs[i];
            result.push([object.name, object.id]);
        }
    } else if (menuName == 'collision') {
        var objs = this.getCurrentObjects();
        var length = objs.length;
        for (var i = 0; i<length; i++) {
            var object = objs[i];
            result.push([object.name, object.id]);
        }
        result.push([Lang.Blocks.wall, 'wall']);
        result.push([Lang.Blocks.wall_up, 'wall_up']);
        result.push([Lang.Blocks.wall_down, 'wall_down']);
        result.push([Lang.Blocks.wall_right, 'wall_right']);
        result.push([Lang.Blocks.wall_left, 'wall_left']);
    } else if (menuName == 'pictures') {
        var pictures = Entry.playground.object.pictures;
        for (var i = 0; i<pictures.length; i++) {
            var picture = pictures[i];
            result.push([picture.name, picture.id]);
        }
    } else if (menuName == 'messages') {
        var messages = Entry.variableContainer.messages_;
        for (var i = 0; i<messages.length; i++) {
            var message = messages[i];
            result.push([message.name, message.id]);
        }
    } else if (menuName == 'variables') {
        var variables = Entry.variableContainer.variables_;
        for (var i = 0; i<variables.length; i++) {
            var variable = variables[i];
            if (variable.object_ && variable.object_ != Entry.playground.object.id)
                continue;
            result.push([variable.getName(), variable.getId()]);
        };
        if (!result || result.length == 0)
            result.push([Lang.Blocks.VARIABLE_variable, 'null']);
    } else if (menuName == 'lists') {
        var lists = Entry.variableContainer.lists_;
        for (var i = 0; i<lists.length; i++) {
            var list = lists[i];
            result.push([list.getName(), list.getId()]);
        };
        if (!result || result.length == 0)
            result.push([Lang.Blocks.VARIABLE_list, 'null']);
    } else if (menuName == 'scenes') {
        var scenes = Entry.scene.scenes_;
        for (var i = 0; i<scenes.length; i++) {
            var scene = scenes[i];
            result.push([scene.name, scene.id]);
        };
    } else if (menuName == 'sounds') {
        var sounds = Entry.playground.object.sounds;
        for (var i = 0; i<sounds.length; i++) {
            var sound = sounds[i];
            result.push([sound.name, sound.id]);
        };
    } else if (menuName == 'clone') {
        result.push([Lang.Blocks.oneself, 'self']);
        var length = this.objects_.length;
        for (var i = 0; i<length; i++) {
            var object = this.objects_[i];
            result.push([object.name, object.id]);
        }
    } else if (menuName == 'objectSequence') {
        var length = this.getCurrentObjects().length;
        for (var i = 0; i<length; i++) {
            result.push([(i+1).toString(), (i).toString()]);
        }
    }
    if (!result.length) {
        result = [[Lang.Blocks.no_target, 'null']]
    }
    return result;
};

/**
 * Initialize entities to state before run
 */
Entry.Container.prototype.clearRunningState = function() {
    this.mapObject(function(object) {
        object.entity.clearScript();
        for (var j = object.clonedEntities.length; j>0; j--) {
            var entity = object.clonedEntities[j-1];
            entity.removeClone();
        };
        object.clonedEntities = [];
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
    for (var i = 0; i<length; i++) {
        var object = this.objects_[i];
        mapFunction(object, param);
    }
}


Entry.Container.prototype.mapObjectOnScene = function(mapFunction, param) {
    var objects = this.getCurrentObjects();
    var length = objects.length;
    for (var i = 0; i<length; i++) {
        var object = objects[i];
        mapFunction(object, param);
    }
};

Entry.Container.prototype.clearRunningStateOnScene = function() {
    this.mapObjectOnScene(function(object) {
        object.entity.clearScript();
        for (var j = object.clonedEntities.length; j>0; j--) {
            var entity = object.clonedEntities[j-1];
            entity.removeClone();
        };
        object.clonedEntities = [];
    });
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
    for (var i = 0; i<length; i++) {
        var entity = this.objects_[i].entity;
        mapFunction(entity, param);
    }
};

Entry.Container.prototype.mapEntityOnScene = function(mapFunction, param) {
    var objects = this.getCurrentObjects();
    var length = objects.length;
    for (var i = 0; i<length; i++) {
        var entity = objects[i].entity;
        mapFunction(entity, param);
    }
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
    for (var i = 0; i<length; i++) {
        var object = objects[i];
        var lenx = object.clonedEntities.length;
        mapFunction(object.entity, param);
        for (var j = 0; j<lenx; j++) {
            var entity = object.clonedEntities[j];
            if (entity && !entity.isStamp)
                mapFunction(entity, param);
        };
    }
};

Entry.Container.prototype.mapEntityIncludeCloneOnScene = function(mapFunction, param) {
    var objects = this.getCurrentObjects();
    var length = objects.length;
    for (var i = 0; i<length; i++) {
        var object = objects[i];
        var lenx = object.clonedEntities.length;
        mapFunction(object.entity, param);
        for (var j = 0; j<lenx; j++) {
            var entity = object.clonedEntities[j];
            if (entity && !entity.isStamp)
                mapFunction(entity, param);
        };
    }
};

/**
 * Get cached picture
 * @param {!string} pictureId
 * @return {?createjs.Image}
 */
Entry.Container.prototype.getCachedPicture = function(pictureId) {
    Entry.assert(typeof(pictureId) == 'string', 'pictureId must be string');
    return this.cachedPicture[pictureId];
};

/**
 * cache picture
 * @param {!picture object} pictureModel
 */
Entry.Container.prototype.cachePicture = function(pictureId, image) {
    //if (!this.cachedPicture[pictureId])
        this.cachedPicture[pictureId] = image;
};

/**
 * convert this object's data to JSON.
 * @return {JSON}
 */
Entry.Container.prototype.toJSON = function() {
    var json = [];
    var length = this.objects_.length;
    for (var i = 0; i<length; i++) {
        var object = this.objects_[i];
        json.push(object.toJSON());
    };
    return json;
};

/**
 * take snapshot of current objects sequence
 */
Entry.Container.prototype.takeSequenceSnapshot = function() {
    var length = this.objects_.length;
    var objects = this.objects_;
    for (var i = 0; i<length; i++)
        objects[i].index = i;
};

/**
 * load snapshot of original objects sequence
 */
Entry.Container.prototype.loadSequenceSnapshot = function() {
    var length = this.objects_.length;
    var arr = new Array(length);
    for (var i = 0; i<length; i++) {
        var object = this.objects_[i];
        arr[object.index] = object;
        delete object.index;
    }
    this.objects_ = arr;
    this.setCurrentObjects();
    Entry.stage.sortZorder();
    this.updateListView();
};

/**
 * convert this message's data to JSON.
 * @return {JSON}
 */
Entry.Container.prototype.getMessageJSON = function() {
    return this.messages_;
};

/**
 * convert this variable's data to JSON.
 * @return {JSON}
 */
Entry.Container.prototype.getVariableJSON = function() {
    var json = [];
    for (var i = 0; i<this.variables_.length; i++) {
        var variable = this.variables_[i];
        json.push(variable.toJSON());
    };
    return json;
};

/**
 * return canvas inputValue
 * @return {String}
 */
Entry.Container.prototype.getInputValue = function() {
    return this.inputValue.value;
};

/**
 * set canvas inputValue
 * @param {String} inputValue from canvas
 */
Entry.Container.prototype.setInputValue = function(inputValue) {
    if (!inputValue)
        this.inputValue.value = '';
    else
        this.inputValue.value = inputValue;
};

Entry.Container.prototype.resetSceneDuringRun = function() {
    this.mapEntityOnScene(function(entity){
        entity.loadSnapshot();
        entity.object.filters = [];
        entity.resetFilter();
        if (entity.dialog)
            entity.dialog.remove();
        if (entity.shape)
            entity.removeBrush();
    });
    this.clearRunningStateOnScene();
};

Entry.Container.prototype.setCopiedObject = function(object) {
    this.copiedObject = object;
};

Entry.Container.prototype.updateObjectsOrder = function() {
    var scenes = Entry.scene.getScenes();

    var objs = [];

    for (var i=0; i<scenes.length; i++) {
        var tempObjs = this.getSceneObjects(scenes[i]);
        for (var j=0; j<tempObjs.length; j++)
            objs.push(tempObjs[j]);
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
    for (var i=0; i<containerObjects.length; i++) {
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
    if (!objs || objs.length == 0)
        this.setCurrentObjects();
    return this.currentObjects_;
};

/**
 *  get project jsons in art_view for saving especially for art_view_controller
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


Entry.Container.prototype.generateTabView = function() {
    var view = this.view_;
    var that = this;
    this.tabViews = [];

    var container = Entry.createElement('div');
    container.addClass('entryContainerTabViewWorkspace');
    view.appendChild(container);

    var tab1 = Entry.createElement('span');
    tab1.addClass('entryContainerTabItemWorkspace');
    tab1.addClass('entryEllipsis');
    tab1.innerHTML = '오브젝트';
    tab1.bindOnClick(function () {
        that.changeTabView('object');
    });
    this.tabViews.push(tab1);
    container.appendChild(tab1);

    var tab2 = Entry.createElement('span');
    tab2.addClass('entryContainerTabItemWorkspace', 'entryRemove');
    tab2.addClass('entryEllipsis');
    tab2.innerHTML = '강의 동영상';
    tab2.bindOnClick(function () {
        that.changeTabView('movie');
    });
    this.tabViews.push(tab2);
    container.appendChild(tab2);
    this.youtubeTab = tab2;


    var tab3 = Entry.createElement('span');
    tab3.addClass('entryContainerTabItemWorkspace', 'entryRemove');
    tab3.addClass('entryEllipsis');
    tab3.innerHTML = '완성된 프로젝트';
    tab3.bindOnClick(function () {
        that.changeTabView('done');
    });
    this.tabViews.push(tab3);
    container.appendChild(tab3);
    this.iframeTab = tab3;

    var tab4 = Entry.createElement('span');
    tab4.addClass('entryContainerTabItemWorkspace');
    tab4.addClass('entryEllipsis');
    tab4.innerHTML = '블록 도움말';
    tab4.bindOnClick(function () {
        that.changeTabView('helper');
    });
    this.tabViews.push(tab4);
    container.appendChild(tab4);

    var movieContainer = Entry.createElement('div');
    movieContainer.addClass('entryContainerMovieWorkspace');
    movieContainer.addClass('entryHide');
    view.appendChild(movieContainer);
    this.movieContainer = movieContainer;

    var doneContainer = Entry.createElement('div');
    doneContainer.addClass('entryContainerDoneWorkspace');
    doneContainer.addClass('entryHide');
    view.appendChild(doneContainer);
    this.doneContainer = doneContainer;

    var helperContainer = Entry.createElement('div');
    helperContainer.addClass('entryContainerHelperWorkspace');
    helperContainer.addClass('entryHide');
    view.appendChild(helperContainer);
    this.helperContainer = helperContainer;
    Entry.helper.initBlockHelper(helperContainer);

    tab1.addClass('selected');
};


Entry.Container.prototype.changeTabView = function(tab) {
    var tabViews = this.tabViews;
    for (var i=0, len=tabViews.length; i<len; i++)
        tabViews[i].removeClass('selected');

    this.movieContainer.addClass('entryHide');
    this.doneContainer.addClass('entryHide');
    this.helperContainer.addClass('entryHide');



    if (tab == 'object') {
        tabViews[0].addClass('selected');
    } else if (tab == 'movie') {
        var view = this.view_;
        var width = view.style.width.substring(0,
                                              view.style.width.length-2);
        this.movieFrame.setAttribute('width', width);
        this.movieFrame.setAttribute('height',width*9/16);

        this.movieContainer.removeClass('entryHide');
        tabViews[1].addClass('selected');
    } else if (tab == 'done') {
        var view = this.view_;
        var height = $(this.doneContainer).height();
        var width = $(this.doneContainer).width();
        if (width*9/16 + 35 < height)
            height = width*9/16 + 35;
        else
            width = (height - 35)/9*16;
        this.doneProjectFrame.setAttribute('width', width);
        this.doneProjectFrame.setAttribute('height', height);
        this.doneContainer.removeClass('entryHide');
        tabViews[2].addClass('selected');
    } else if (tab == 'helper') {
        Entry.helper.blockHelperOn();
        this.helperContainer.removeClass('entryHide');
        tabViews[3].addClass('selected');
    }
};

Entry.Container.prototype.initYoutube = function(youtubeHash) {
    this.youtubeHash = youtubeHash
    this.youtubeTab.removeClass('entryRemove');
    var view = this.view_;
    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
    var movieContainer = this.movieContainer;
    var url = 'https://www.youtube.com/embed/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height',width*9/16);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + this.youtubeHash);
    this.movieFrame = iframe;
    movieContainer.appendChild(iframe);
};

Entry.Container.prototype.initDoneProject = function(projectId) {
    this.doneProject = projectId;
    this.iframeTab.removeClass('entryRemove');
    var view = this.view_;
    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
    var url = '/api/project/iframe/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height',width*9/16 + 35);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + this.doneProject);
    this.doneProjectFrame = iframe;
    this.doneContainer.appendChild(iframe);
}

Entry.Container.prototype.blurAllInputs = function() {
    var objects = this.getSceneObjects();
    objects.map(function (obj) {
        var inputs = obj.view_.getElementsByTagName('input');
        for (var i=0, len=inputs.length; i<len; i++)
            inputs[i].blur();
    });
}
