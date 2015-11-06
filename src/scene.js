/**
 * @fileoverview Scene controller for entry.
 */
'use strict';

/**
 * Class for a scene controller.
 * This have view for scenes.
 * @constructor
 */
Entry.Scene = function() {
    this.scenes_ = [];
    this.selectedScene = null;
    this.maxCount = 10;
};

/**
 * Control bar view generator.
 * @param {!Element} sceneView sceneView from Entry.
 * @param {?string} option for choose type of view.
 */
Entry.Scene.prototype.generateView = function(sceneView, option) {
    /** @type {!Element} */
    this.view_ = sceneView;
    this.view_.addClass('entryScene');
    if (!option || option == 'workspace') {
        this.view_.addClass('entrySceneWorkspace');

        var listView = Entry.createElement('ul');
        listView.addClass('entrySceneListWorkspace');

        if (Entry.sceneEditable) {
            if ($) {
                $(listView).sortable({
                    start: function(event, ui) {
                        ui.item.data('start_pos', ui.item.index());
                        var clone = $(ui.item[0]).clone(true);
                    },
                    stop: function(event, ui){
                        var start = ui.item.data('start_pos');
                        var end = ui.item.index();
                        Entry.scene.moveScene(start, end);
                    },
                    axis: 'x'
                });

                // $(listView).draggable({
                //     connectToSortable: listView,
                //     revert: "invalid"
                // });
                // $(listView).disableSelection();
            }
        }

        this.view_.appendChild(listView);
        this.listView_ = listView;
        if (Entry.sceneEditable) {
            var addButton = Entry.createElement('span');
            addButton.addClass('entrySceneElementWorkspace');
            addButton.addClass('entrySceneAddButtonWorkspace');
            addButton.bindOnClick(function (e) {
                if (Entry.engine.isState('run'))
                    return;
                Entry.scene.addScene();
            });
            this.view_.appendChild(addButton);
            this.addButton_ = addButton;
        }

    }
};

/**
 * generate li element for scene
 * @param {!scene model} scene
 */
Entry.Scene.prototype.generateElement = function(scene) {
    var viewTemplate = Entry.createElement('li', scene.id);
    viewTemplate.addClass('entrySceneElementWorkspace');
    viewTemplate.addClass('entrySceneButtonWorkspace');
    viewTemplate.bindOnClick(function (e) {
        if (Entry.engine.isState('run')) {
            e.preventDefault();
            return;
        }
        Entry.scene.selectScene(scene);
    });
    var nameField = Entry.createElement('input');
    nameField.addClass('entrySceneFieldWorkspace');
    nameField.value = scene.name;
    nameField.style['width'] = Entry.computeInputWidth(nameField);

    if (!Entry.sceneEditable)
        nameField.disabled = 'disabled';

    var sceneLeft = Entry.createElement('span');
    sceneLeft.addClass('entrySceneLeftWorkspace');
    viewTemplate.appendChild(sceneLeft);

    var divide = Entry.createElement('span');
    divide.addClass('entrySceneInputCover');
    viewTemplate.appendChild(divide);

    nameField.onkeyup = function (e) {
        var code = e.keyCode;
        if (Entry.isArrowOrBackspace(code))
            return;
        scene.name = this.value;
        nameField.style['width'] = Entry.computeInputWidth(this);
        if (code == 13)
            this.blur();
        if (this.value.length > 9) {
            this.value = this.value.substring(0,10);
            this.blur();
        }
    };
    nameField.onblur = function (e) {
        nameField.value = this.value;
        scene.name = this.value;
        nameField.style['width'] = Entry.computeInputWidth(this);
    };
    divide.appendChild(nameField);
    divide.nameField = nameField;
    var removeButtonCover = Entry.createElement('span');
    removeButtonCover.addClass('entrySceneRemoveButtonCoverWorkspace');
    viewTemplate.appendChild(removeButtonCover);
    if (Entry.sceneEditable) {
        var removeButton = Entry.createElement('button');
        removeButton.addClass('entrySceneRemoveButtonWorkspace');
        removeButton.innerHTML = 'x';
        removeButton.scene = scene;
        removeButton.bindOnClick(function (e) {
            e.stopPropagation();
            if (Entry.engine.isState('run'))
                return;
            var a = confirm(Lang.Workspace.will_you_delete_scene);
            if (a)
                Entry.scene.removeScene(this.scene);
            return;
        });
        removeButtonCover.appendChild(removeButton);
    }

    if ($) {
        context.attach('#' + scene.id, [
            {
                text: '복제하기',
                href: '/',
                action: function(e){
                    e.preventDefault();
                    Entry.scene.cloneScene(scene);
                }
            }
        ]);
    }
    return scene.view = viewTemplate;
};

Entry.Scene.prototype.updateView = function() {
    if (!Entry.type || Entry.type == 'workspace') {
        var view = this.listView_;

        while (view.hasChildNodes()) {
            view.lastChild.removeClass('selectedScene');
            view.removeChild(view.lastChild);
        }

        for (var i in this.getScenes()) {
            var scene = this.scenes_[i];
            view.appendChild(scene.view);
            if (this.selectedScene.id == scene.id)
                scene.view.addClass('selectedScene');
        }

        if (this.addButton_) {
            var length = this.getScenes().length;
            if (length < this.maxCount)
                this.addButton_.removeClass('entryRemove');
            else
                this.addButton_.addClass('entryRemove');
        }
    }
};

/**
 * add scenes
 * @param {Array<scene model>} scenes
 */
Entry.Scene.prototype.addScenes = function(scenes) {
    this.scenes_ = scenes;
    if (!scenes || scenes.length == 0) {
        this.scenes_ = [];
        this.scenes_.push(this.createScene());
    } else {
        for (var i=0,len=scenes.length; i<len; i++)
            this.generateElement(scenes[i]);
    }
    this.selectScene(this.getScenes()[0]);
    this.updateView();
};
/**
 * add scenes to this.scenes_
 * @param {scene model} scene
 */
Entry.Scene.prototype.addScene = function(scene, index) {
    if (scene == null)
        scene = this.createScene();

    if (!scene.view)
        this.generateElement(scene);

    if (!index && typeof index != 'number')
        this.getScenes().push(scene);
    else
        this.getScenes().splice(index, 0, scene);

    Entry.stage.objectContainers.push(Entry.stage.createObjectContainer(scene));
    Entry.playground.flushPlayground();
    this.selectScene(scene);
    this.updateView();
    return scene;
};

/**
 * remove scene from this.scenes_
 * @param {!scene model} scene
 */
Entry.Scene.prototype.removeScene = function(scene) {
    if (this.getScenes().length <=1) {
        Entry.toast.alert(Lang.Msgs.runtime_error,
                          Lang.Workspace.Scene_delete_error,
                          false);
         return;
    }

    var index = this.getScenes().indexOf(this.getSceneById(scene.id));

    this.getScenes().splice(index, 1);
    this.selectScene();
    var objects = Entry.container.getSceneObjects(scene);

    for (var i=0; i<objects.length; i++)
        Entry.container.removeObject(objects[i]);
    Entry.stage.removeObjectContainer(scene);
    this.updateView();
};

/**
 * select scene
 * @param {scene model} scene
 */
Entry.Scene.prototype.selectScene = function(scene) {
    scene = scene || this.getScenes()[0];
    if (this.selectedScene && (this.selectedScene.id == scene.id))
        return;

    if (Entry.engine.isState('run'))
        Entry.container.resetSceneDuringRun();

    this.selectedScene = scene;
    Entry.container.setCurrentObjects();
    if (Entry.stage.objectContainers &&
        Entry.stage.objectContainers.length != 0)
        Entry.stage.selectObjectContainer(scene);

    var targetObject = Entry.container.getCurrentObjects()[0];
    if (targetObject && Entry.type != 'minimize')
        Entry.container.selectObject(targetObject.id);
    else {
        Entry.stage.selectObject(null);
        Entry.playground.flushPlayground();
        Entry.variableContainer.updateList();
    }
    if (!Entry.container.listView_)
        Entry.stage.sortZorder();
    Entry.container.updateListView();
    this.updateView();
};

/**
 * convert this scenes data to JSON.
 * @return {JSON}
 */
Entry.Scene.prototype.toJSON = function() {
    var json = [];
    var length = this.getScenes().length;
    for (var i = 0; i<length; i++) {
        var scene = this.getScenes()[i];
        var view = scene.view;
        delete scene.view;
        json.push(JSON.parse(JSON.stringify(scene)));
        scene.view = view;
    }
    return json;
};


/**
 * Move scene in this.scenes_
 * this method is for sortable
 * @param {!number} start
 * @param {!number} end
 */
Entry.Scene.prototype.moveScene = function(start, end) {
    this.getScenes().splice(
        end, 0, this.getScenes().splice(start, 1)[0]);

    Entry.container.updateObjectsOrder();
    Entry.stage.sortZorder();
};

/**
 * get scene by scene id
 * @param {!String} sceneId
 * @return {scene modal}
 */
Entry.Scene.prototype.getSceneById = function(sceneId) {
    var scenes = this.getScenes();
    for (var i=0; i<scenes.length; i++) {
        if (scenes[i].id == sceneId)
            return scenes[i];
    }
    return false;
};

/**
 * @return {Array<Entry scene>}
 */
Entry.Scene.prototype.getScenes = function() {
    return this.scenes_;
};


/**
 * remember selectedScene before start
 * in order to reset when stopped
 */
Entry.Scene.prototype.takeStartSceneSnapshot = function() {
    this.sceneBeforeRun = this.selectedScene;
};

/**
 * select selectedScene before start
 * before run start
 */
Entry.Scene.prototype.loadStartSceneSnapshot = function() {
    this.selectScene(this.sceneBeforeRun);
    this.sceneBeforeRun = null;
};
/**
 * create scene
 * @return {scene modal} scene
 */
Entry.Scene.prototype.createScene = function() {
    var scene = {
        name: Lang.Blocks.SCENE + ' ' + (this.getScenes().length + 1),
        id: Entry.generateHash()
    };

    this.generateElement(scene);
    return scene;
};


/**
 * clone scene by context menu
 * @param {!scene model} scene
 */
Entry.Scene.prototype.cloneScene = function(scene) {
    if (this.scenes_.length >= this.maxCount) {
        Entry.toast.alert(Lang.Msgs.runtime_error,
                          Lang.Workspace.Scene_add_error,
                          false);
         return;
    }

    var clonedScene = {
        name: scene.name + Lang.Workspace.replica_of_object,
        id: Entry.generateHash()
    };
    this.generateElement(clonedScene);
    this.addScene(clonedScene);

    var objects = Entry.container.getSceneObjects(scene);
    for (var i=objects.length-1; i>=0; i--)
        Entry.container.addCloneObject(objects[i], clonedScene.id);
};
