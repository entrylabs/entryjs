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
};

/**
 * Control bar view generator.
 * @param {!Element} containerView containerView from Entry.
 * @param {?string} option for choose type of view.
 */
Entry.Container.prototype.generateView = function(containerView, option) {
    /** @type {!Element} */
    this._view = containerView;
    this._view.addClass('entryContainer');
    if (!option || option == 'workspace') {
        this._view.addClass('entryContainerWorkspace');

        var addButton = Entry.createElement('div');
        addButton.addClass('entryAddObjectWorkspace');
        addButton.innerHTML = Lang.Workspace.add_object;
        addButton.bindOnClick(function(e){
            Entry.dispatchEvent('openSpriteManager');
        });
        //this._view.appendChild(addButton);

        var ulWrapper = Entry.createElement('div');
        ulWrapper.addClass('entryContainerListWorkspaceWrapper');

        if (Entry.isForLecture) {
            this.generateTabView();
            ulWrapper.addClass('lecture');
        }

        Entry.Utils.disableContextmenu(ulWrapper);
        $(ulWrapper).on('contextmenu', function(e){
            var options = [
                {
                    text: Lang.Blocks.Paste_blocks,
                    callback: function(){
                        if (Entry.container.copiedObject)
                            Entry.container.addCloneObject(Entry.container.copiedObject);
                        else
                            Entry.toast.alert(Lang.Workspace.add_object_alert, Lang.Workspace.object_not_found_for_paste);
                    }
                 }
            ];
            Entry.ContextMenu.show(options, 'workspace-contextmenu');
        });

        this._view.appendChild(ulWrapper);

        var listView = Entry.createElement('ul');
        listView.addClass('entryContainerListWorkspace');

        ulWrapper.appendChild(listView);
        //this._view.appendChild(listView);
        /** @param {!Element} */
        this.listView_ = listView;
        this.enableSort();
    } else if (option == 'phone') {
        this._view.addClass('entryContainerPhone');

        var addButton = Entry.createElement('div');
        addButton.addClass('entryAddObjectWorkspace');
        addButton.innerHTML = Lang.Workspace.add_object;
        addButton.bindOnClick(function(e){
            Entry.dispatchEvent('openSpriteManager');
        });
        //this._view.appendChild(addButton);

        var ulWrapper = Entry.createElement('div');
        ulWrapper.addClass('entryContainerListPhoneWrapper');
        this._view.appendChild(ulWrapper);

        var listView = Entry.createElement('ul');
        listView.addClass('entryContainerListPhone');

        ulWrapper.appendChild(listView);
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
    this.updateObjectsOrder();
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
 * get Pictures element
 * @param {!String} pictureId
 */
Entry.Container.prototype.getPictureElement = function(pictureId) {
    for(var i in this.objects_) {
        var object = this.objects_[i];
        for (var j in object.pictures) {
            if (pictureId === object.pictures[j].id) {
                return object.pictures[j].view;
            }
        }
    }
    throw new Error('No picture found');
};
/**
 * Set Pictures
 * @param {!Object picture} picture
 */
Entry.Container.prototype.setPicture = function(picture) {
    for(var i in this.objects_) {
        var object = this.objects_[i];
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
    }
    throw new Error('No picture found');
};

/**
 * Set Pictures
 * @param {!String} pictureId
 */
Entry.Container.prototype.selectPicture = function(pictureId) {
    for(var i in this.objects_) {
        var object = this.objects_[i];
        for (var j in object.pictures) {
            var picture_ = object.pictures[j];
            if (pictureId === picture_.id) {
                object.selectedPicture = picture_;
                object.entity.setImage(picture_);
                object.updateThumbnailView();
                return object.id;
            }
        }
    }
    throw new Error('No picture found');
};

/**
 * Add object
 * @param {!object model} objectModel
 * @param {?number} index exist when user add object
 * @return {Entry.EntryObject}
 */
Entry.Container.prototype.addObject = function(objectModel, index) {
    var backgroundStr = 'background';
    var object = new Entry.EntryObject(objectModel);
    object.name = Entry.getOrderedName(object.name, this.objects_);


    if (Entry.stateManager) {
        Entry.stateManager.addCommand(
            "add object",
              this,
              this.removeObject,
              object
        );
    }
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
    if (Entry.stateManager) {
        Entry.stateManager.addCommand(
            "remove object",
            this,
            this.addObject,
            objectJSON,
            index
        );
    }
    var state = new Entry.State(
                                this.addObject,
                                objectJSON,
                                index
                               );
    object.destroy();
    this.objects_.splice(index, 1);
    this.setCurrentObjects();
    Entry.stage.sortZorder();

    if (this.objects_.length && index !== 0) {
        // Entry.container.selectObject(this.objects_[index -1].id);
        var currentObjects_ = this.getCurrentObjects();
        if(currentObjects_.length > 0) {
            Entry.container.selectObject(this.getCurrentObjects()[0].id);
        } else {
            Entry.container.selectObject();
        }
    }
    else if (this.objects_.length && index === 0)
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
    }
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
            "reorder object",
            Entry.container,
            Entry.container.moveElement,
            endIndex, startIndex, true
        );

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
 * generate list for blockly dropdown dynamic
 * @param {string} menuName
 */
Entry.Container.prototype.getDropdownList = function(menuName) {
    var result = [];
    switch (menuName) {
        case 'sprites':
            var objs = this.getCurrentObjects();
            var length = objs.length;
            for (var i = 0; i<length; i++) {
                var object = objs[i];
                result.push([object.name, object.id]);
            }
            break;
        case 'spritesWithMouse':
            var objs = this.getCurrentObjects();
            var length = objs.length;
            for (var i = 0; i<length; i++) {
                var object = objs[i];
                result.push([object.name, object.id]);
            }
            result.push([Lang.Blocks.mouse_pointer, 'mouse']);
            break;
        case 'spritesWithSelf':
            var objs = this.getCurrentObjects();
            var length = objs.length;
            for (var i = 0; i<length; i++) {
                var object = objs[i];
                result.push([object.name, object.id]);
            }
            result.push([Lang.Blocks.self, 'self']);
            break;
        case 'collision':
            result.push([Lang.Blocks.mouse_pointer, 'mouse']);
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
            break;
        case 'pictures':
            var pictures = Entry.playground.object.pictures;
            for (var i = 0; i<pictures.length; i++) {
                var picture = pictures[i];
                result.push([picture.name, picture.id]);
            }
            break;
        case 'messages':
            var messages = Entry.variableContainer.messages_;
            for (var i = 0; i<messages.length; i++) {
                var message = messages[i];
                result.push([message.name, message.id]);
            }
            break;
        case 'variables':
            var variables = Entry.variableContainer.variables_;
            for (var i = 0; i<variables.length; i++) {
                var variable = variables[i];
                if (variable.object_ && variable.object_ != Entry.playground.object.id)
                    continue;
                result.push([variable.getName(), variable.getId()]);
            }
            if (!result || result.length === 0)
                result.push([Lang.Blocks.VARIABLE_variable, 'null']);
            break;
        case 'lists':
            var lists = Entry.variableContainer.lists_;
            for (var i = 0; i<lists.length; i++) {
                var list = lists[i];
                result.push([list.getName(), list.getId()]);
            }
            if (!result || result.length === 0)
                result.push([Lang.Blocks.VARIABLE_list, 'null']);
            break;
        case 'scenes':
            var scenes = Entry.scene.scenes_;
            for (var i = 0; i<scenes.length; i++) {
                var scene = scenes[i];
                result.push([scene.name, scene.id]);
            }
            break;
        case 'sounds':
            var sounds = Entry.playground.object.sounds;
            for (var i = 0; i<sounds.length; i++) {
                var sound = sounds[i];
                result.push([sound.name, sound.id]);
            }
            break;
        case 'clone':
            result.push([Lang.Blocks.oneself, 'self']);
            var length = this.objects_.length;
            for (var i = 0; i<length; i++) {
                var object = this.objects_[i];
                result.push([object.name, object.id]);
            }
            break;
        case 'objectSequence':
            var length = this.getCurrentObjects().length;
            for (var i = 0; i<length; i++) {
                result.push([(i+1).toString(), (i).toString()]);
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
        object.entity.clearScript();
        for (var j = object.clonedEntities.length; j>0; j--) {
            var entity = object.clonedEntities[j-1];
            entity.removeClone();
        }
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
};


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
        }
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
        }
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
        }
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
    }
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
    if (!inputValue)
        this.inputValue.setValue(0);
    else
        this.inputValue.setValue(inputValue);
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
    if (!objs || objs.length === 0)
        this.setCurrentObjects();
    return this.currentObjects_;
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


Entry.Container.prototype.generateTabView = function() {
    var view = this._view;
    var that = this;
    this.tabViews = [];

    var container = Entry.createElement('div');
    container.addClass('entryContainerTabViewWorkspace');
    view.appendChild(container);

    var tab1 = Entry.createElement('span');
    tab1.addClass('entryContainerTabItemWorkspace');
    tab1.addClass('entryEllipsis');
    tab1.innerHTML = Lang.Menus.lecture_container_tab_object;
    tab1.bindOnClick(function () {
        that.changeTabView('object');
    });
    this.tabViews.push(tab1);
    container.appendChild(tab1);

    var tab2 = Entry.createElement('span');
    tab2.addClass('entryContainerTabItemWorkspace', 'entryRemove');
    tab2.addClass('entryEllipsis');
    tab2.innerHTML = Lang.Menus.lecture_container_tab_video;
    tab2.bindOnClick(function () {
        that.changeTabView('movie');
    });
    this.tabViews.push(tab2);
    container.appendChild(tab2);
    this.youtubeTab = tab2;


    var tab3 = Entry.createElement('span');
    tab3.addClass('entryContainerTabItemWorkspace', 'entryRemove');
    tab3.addClass('entryEllipsis');
    tab3.innerHTML = Lang.Menus.lecture_container_tab_project;
    tab3.bindOnClick(function () {
        that.changeTabView('done');
    });
    this.tabViews.push(tab3);
    container.appendChild(tab3);
    this.iframeTab = tab3;

    var tab4 = Entry.createElement('span');
    tab4.addClass('entryContainerTabItemWorkspace');
    tab4.addClass('entryEllipsis');
    tab4.innerHTML = Lang.Menus.lecture_container_tab_help;
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
        var view = this._view;
        var width = view.style.width.substring(0,
                                              view.style.width.length-2);
        this.movieFrame.setAttribute('width', width);
        this.movieFrame.setAttribute('height',width*9/16);

        this.movieContainer.removeClass('entryHide');
        tabViews[1].addClass('selected');
    } else if (tab == 'done') {
        var view = this._view;
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
    this.youtubeHash = youtubeHash;
    this.youtubeTab.removeClass('entryRemove');
    var view = this._view;
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

Entry.Container.prototype.initTvcast = function(tvcast) {
    this.tvcast = tvcast;
    this.youtubeTab.removeClass('entryRemove');
    var view = this._view;
    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
    var movieContainer = this.movieContainer;
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height',width*9/16);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', this.tvcast);
    this.movieFrame = iframe;
    movieContainer.appendChild(iframe);
};

Entry.Container.prototype.initDoneProject = function(projectId) {
    this.doneProject = projectId;
    this.iframeTab.removeClass('entryRemove');
    var view = this._view;
    var width = view.style.width.substring(0,
                                          view.style.width.length-2);
    var url = '/api/iframe/project/';
    var iframe = Entry.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height',width*9/16 + 35);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('src', url + this.doneProject);
    this.doneProjectFrame = iframe;
    this.doneContainer.appendChild(iframe);
};

Entry.Container.prototype.blurAllInputs = function() {
    var objects = this.getSceneObjects();
    objects.map(function (obj) {
        var inputs = obj.view_.getElementsByTagName('input');
        for (var i=0, len=inputs.length; i<len; i++)
            inputs[i].blur();
    });
};

Entry.Container.prototype.showProjectAnswer = function() {
    var answer = this.inputValue;
    if (!answer)
        return;
    answer.setVisible(true);
};


Entry.Container.prototype.hideProjectAnswer = function(removeBlock) {
    var answer = this.inputValue;
    if (!answer || !answer.isVisible() || Entry.engine.isState('run'))
        return;
    var objects = Entry.container.getAllObjects();
    var answerTypes = ['ask_and_wait', 'get_canvas_input_value',
    'set_visible_answer'];

    for (var i=0, len=objects.length; i<len; i++) {
        var blocks = objects[i].script.getElementsByTagName('block');
        for (var j = 0, bLen=blocks.length; j < bLen; j++) {
            if (answerTypes.indexOf(blocks[j].getAttribute('type')) > -1) {
                if (blocks[j].getAttribute('id') == removeBlock.getAttribute('id'))
                    continue;
                else
                    return;
            }
        }
    }
    answer.setVisible(false);
};

Entry.Container.prototype.getView = function() {
    return this._view;
};

// dummy
Entry.Container.prototype.resize = function() {
    return;
};
