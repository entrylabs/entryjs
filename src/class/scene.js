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
    var that = this;
    this.scenes_ = [];
    this.selectedScene = null;
    this.maxCount = 20;
    $(window).on('resize', (function(e) {
        that.resize();
    }));

    that.disposeEvent =
        Entry.disposeEvent.attach(this, function(e) {
            var elem = document.activeElement;
            if (e && elem && elem !== e.target &&
                $(elem).hasClass('entrySceneFieldWorkspace')) {
                elem.blur();
            }
        });
};

/**
 * Control bar view generator.
 * @param {!Element} sceneView sceneView from Entry.
 * @param {?string} option for choose type of view.
 */
Entry.Scene.prototype.generateView = function(sceneView, option) {
    /** @type {!Element} */
    var that = this;
    this.view_ = sceneView;
    this.view_.addClass('entryScene');
    if (!option || option == 'workspace') {
        this.view_.addClass('entrySceneWorkspace');

        $(this.view_).on('mousedown', function (e) {
            var offset = $(this).offset();
            var $window = $(window);
            var x = e.pageX - offset.left + $window.scrollLeft();
            var y = e.pageY - offset.top + $window.scrollTop();
            y = 40 - y;
            var slope = -40/55;
            var selectedScene = that.selectedScene;
            var selectedLeft = $(selectedScene.view).find('.entrySceneRemoveButtonCoverWorkspace').offset().left;
            if (x < selectedLeft || x > selectedLeft + 55) return;

            x -= selectedLeft;
            var ret = 40 + slope*x;

            if (y > ret) {
                var nextScene = that.getNextScene();
                if (nextScene) {
                   var $sceneView = $(nextScene.view);
                   $(document).trigger('mouseup');
                   $sceneView.trigger('mousedown');
                }
            }
        });

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
                    axis: 'x',
                    tolerance: "pointer"
                });
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
                Entry.do('sceneAdd', Entry.generateHash());
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
    var that = this;
    var viewTemplate = Entry.createElement('li', scene.id);
    var fragment = document.createDocumentFragment('div');
    fragment.appendChild(viewTemplate);
    var className = 'entrySceneElementWorkspace  entrySceneButtonWorkspace minValue';
    viewTemplate.addClass(className);
    $(viewTemplate).on('mousedown', function(e){
        if (Entry.engine.isState('run')) {
            e.preventDefault();
            return;
        }
        Entry.scene.selectScene(scene);
    });
    var nameField = Entry.createElement('input');
    nameField.addClass('entrySceneFieldWorkspace');
    nameField.value = scene.name;

    if (!Entry.sceneEditable)
        nameField.disabled = 'disabled';

    var sceneLeft = Entry.createElement('span');
    sceneLeft.addClass('entrySceneLeftWorkspace');
    viewTemplate.appendChild(sceneLeft);

    var divide = Entry.createElement('span');
    divide.addClass('entrySceneInputCover');
    viewTemplate.appendChild(divide);
    scene.inputWrapper = divide;

    nameField.onkeyup = function (e) {
        var code = e.keyCode;
        if (Entry.isArrowOrBackspace(code))
            return;
            
        if (code == 13) {
            Entry.do("sceneRename", scene.id, this.value);
            this.blur();
        } else if (this.value.length > 10) {
            this.value = this.value.substring(0,10);
            Entry.do("sceneRename", scene.id, this.value);
            this.blur();
        }
        setTimeout(function() {
            that.resize();
        }, 0);
    };
    nameField.onblur = function (e) {
        Entry.do("sceneRename", scene.id, this.value);
    };
    divide.appendChild(nameField);
    viewTemplate.nameField = nameField;
    var removeButtonCover = Entry.createElement('span');
    removeButtonCover.addClass('entrySceneRemoveButtonCoverWorkspace');
    viewTemplate.appendChild(removeButtonCover);
    if (Entry.sceneEditable) {
        var removeButton = Entry.createElement('button');
        removeButton.addClass('entrySceneRemoveButtonWorkspace');
        removeButton.scene = scene;
        removeButton.bindOnClick(function (e) {
            e.stopPropagation();
            if (Entry.engine.isState('run'))
                return;
                
            Entry.do("sceneRemove", this.scene.id)
        });
        removeButtonCover.appendChild(removeButton);
        scene.removeButton = removeButton;
    }

    Entry.Utils.disableContextmenu(viewTemplate);
    if (Entry.sceneEditable) {
        Entry.ContextMenu.onContextmenu($(viewTemplate), function (coordinate) {
            var options = [
                {
                    text: Lang.Workspace.duplicate_scene,
                    enable: Entry.engine.isState('stop') && !this.isMax(),
                    callback: function(){
                        Entry.scene.cloneScene(scene);
                    }
                }
            ];
            Entry.ContextMenu.show(options, 'workspace-contextmenu', coordinate);
        }.bind(this));
    }

    scene.view = viewTemplate;

    return viewTemplate;
};

Entry.Scene.prototype.updateView = function() {
    if (!Entry.type || Entry.type == 'workspace') {
        var view = this.listView_;
        for (var i = 0; i < this.getScenes().length; i++)
            view.appendChild(this.getScenes()[i].view);

        if (this.addButton_) {
            var length = this.getScenes().length;
            if (!this.isMax())
                this.addButton_.removeClass('entryRemove');
            else
                this.addButton_.addClass('entryRemove');
        }
    }
    this.resize();
};

/**
 * add scenes
 * @param {Array<scene model>} scenes
 */
Entry.Scene.prototype.addScenes = function(scenes) {
    this.scenes_ = scenes;
    if (!scenes || scenes.length === 0) {
        this.scenes_ = [];
        this.scenes_.push(this.createScene());
    } else {
        for (var i=0,len=scenes.length; i<len; i++)
            this.generateElement(scenes[i]);
    }

    this.selectScene(this.getScenes()[0]);
};
/**
 * add scenes to this.scenes_
 * @param {scene model} scene
 */
Entry.Scene.prototype.addScene = function(scene, index) {
    if (scene === undefined || typeof scene === "string")
        scene = this.createScene(scene);

    if (!scene.view)
        this.generateElement(scene);

    if (!index && typeof index != 'number')
        this.getScenes().push(scene);
    else
        this.getScenes().splice(index, 0, scene);

    Entry.stage.objectContainers.push(Entry.stage.createObjectContainer(scene));
    this.selectScene(scene);

    if (Entry.creationChangedEvent)
        Entry.creationChangedEvent.notify();
    return scene;
};

/**
 * remove scene from this.scenes_
 * @param {!scene model} scene
 */
Entry.Scene.prototype.removeScene = function(scene) {
    if (this.getScenes().length <=1) {
        Entry.toast.alert(
            Lang.Msgs.runtime_error,
            Lang.Workspace.Scene_delete_error,
            false
        );
        return;
    }
    
    scene = this.getSceneById(
        typeof scene === "string" ? scene : scene.id
    );

    var index = this.getScenes().indexOf(scene);

    this.getScenes().splice(index, 1);
    var objects = Entry.container.getSceneObjects(scene);

    for (var i=0; i<objects.length; i++)
        Entry.container.removeObject(objects[i]);
    Entry.stage.removeObjectContainer(scene);
    $(scene.view).remove();
    this.selectScene();
};

/**
 * select scene
 * @param {scene model} scene
 */
Entry.Scene.prototype.selectScene = function(scene) {
    scene = scene || this.getScenes()[0];
    var container = Entry.container;

    container.resetSceneDuringRun();

    if (this.selectedScene && (this.selectedScene.id == scene.id))
        return;

    var prevSelected = this.selectedScene;
    if (prevSelected) {
        var prevSelectedView = prevSelected.view;
        prevSelectedView.removeClass('selectedScene');
        var elem = document.activeElement;
        elem === prevSelectedView.nameField  && elem.blur();
    }

    this.selectedScene = scene;
    scene.view.addClass('selectedScene');

    var stage = Entry.stage;
    var playground = Entry.playground;

    container.setCurrentObjects();

    stage.selectObjectContainer(scene);

    var targetObject = container.getCurrentObjects()[0];

    if (targetObject && Entry.type !== 'minimize') {
        container.selectObject(targetObject.id);
        playground.refreshPlayground();
    } else {
        if (Entry.isTextMode) {
            var workspace = Entry.getMainWS();
            var vimBoard = workspace && workspace.vimBoard;
            if (vimBoard) {
                var sObject = vimBoard._currentObject;
                var sScene = vimBoard._currentScene;
                var parser = vimBoard._parser;
                try {
                    if (scene.id != sScene.id)
                        workspace._syncTextCode();
                } catch(e) {}

                if (parser._onError) {
                    container.selectObject(sObject.id, true);
                    return;
                }
            }
            vimBoard && vimBoard.clearText();
        }

        stage.selectObject(null);
        playground.flushPlayground();
        Entry.variableContainer.updateList();
    }
    !container.listView_ && stage.sortZorder();

    container.updateListView();
    this.updateView();
    Entry.requestUpdate = true;
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
        json.push({
            id: scene.id,
            name: scene.name
        });
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
    //style properties are not removed sometimes
    $('.entrySceneElementWorkspace').removeAttr('style');
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
Entry.Scene.prototype.createScene = function(sceneId) {
    var regex = /[0-9]/;
    var name = Entry.getOrderedName(Lang.Blocks.SCENE + ' ', this.scenes_, "name");
    if (!regex.test(name)) {
        name += '1';
    }
    var scene = {
        name: name,
        id: sceneId || Entry.generateHash()
    };

    this.generateElement(scene);
    return scene;
};


/**
 * clone scene by context menu
 * @param {!scene model} scene
 */
Entry.Scene.prototype.cloneScene = function(scene) {
    if (this.isMax()) {
        Entry.toast.alert(
            Lang.Msgs.runtime_error,
            Lang.Workspace.Scene_add_error,
            false
        );
        return;
    }

    var clonedScene = {
        name: (Lang.Workspace.cloned_scene + scene.name).substring(0, 10),
        id: Entry.generateHash()
    };

    this.generateElement(clonedScene);
    this.addScene(clonedScene);

    var container = Entry.container;
    var objects = container.getSceneObjects(scene);

    try {
        var oldIds = [];
        var newIds = [];
        this.isSceneCloning = true;
        for (var i=objects.length-1; i>=0; i--) {
            var obj = objects[i];
            var ret = container.addCloneObject(obj, clonedScene.id);
            oldIds.push(obj.id);
            newIds.push(ret.id);
        }
        container.adjustClonedValues(oldIds, newIds);
        var WS = Entry.getMainWS();
        WS && WS.board && WS.board.reDraw();
        this._focusSceneNameField(clonedScene);
        this.isSceneCloning = false;
    } catch (e) { console.log('error', e); }
};

/**
 * resize html element by window size
 * @param {!scene model} scene
 */
Entry.Scene.prototype.resize = function() {
    var scenes = this.getScenes();
    var selectedScene = this.selectedScene;
    var addButton = this.addButton_;
    var firstScene = scenes[0];

    if (scenes.length === 0 || !firstScene) return;

    var startPos = $(firstScene.view).offset().left;
    var marginLeft = parseFloat($(selectedScene.view).css('margin-left'));
    var totalWidth = Math.floor($(this.view_).width() - startPos - 5);
    var LEFT_MARGIN = -40;

    var normWidth = startPos + 15;
    var diff = 0;
    var isSelectedView = false;
    var selectedViewWidth = 0;
    for (var i in scenes) {
        var scene = scenes[i];
        var view = scene.view;
        view.addClass('minValue');
        isSelectedView = view === this.selectedScene.view;
        view = $(view);

        var width = parseFloat(Entry.computeInputWidth(scene.name));
        var adjusted =  width*10/9;
        if (scene === this.selectedScene)
            diff = adjusted - width;
        $(scene.inputWrapper).width(adjusted + 'px');
        var viewWidth = view.width();
        if (isSelectedView) selectedViewWidth = viewWidth;
        normWidth += viewWidth + LEFT_MARGIN;
    }

    if (normWidth > totalWidth) align();

    function align() {
        var dummyWidth = 30.5;
        var len = scenes.length - 1;
        totalWidth = totalWidth -
            Math.round(selectedViewWidth || $(selectedScene.view).width()) -
            dummyWidth*len - diff;

        var fieldWidth = Math.floor(totalWidth/len);
        for (i in scenes) {
            scene = scenes[i];
            if (selectedScene.id != scene.id) {
                scene.view.removeClass('minValue');
                $(scene.inputWrapper).width(fieldWidth);
            } else scene.view.addClass('minValue');
        }
    }
};

Entry.Scene.prototype.getNextScene = function() {
    var scenes = this.getScenes();
    return scenes[scenes.indexOf(this.selectedScene) + 1];
};

Entry.Scene.prototype.isMax = function() {
    return this.scenes_.length >= this.maxCount;
};

Entry.Scene.prototype.clear = function() {
    this.scenes_.forEach(function(s) {
        Entry.stage.removeObjectContainer(s);
    });
    $(this.listView_).html("");
    this.scenes_ = [];
    this.selectedScene = null;
};


Entry.Scene.prototype._focusSceneNameField = function(scene) {
    var input = scene.view && scene.view.nameField;
    input && input.focus && input.focus();
};

Entry.Scene.prototype.getDom = function(query) {
    var scene;
    if (query.length > 1)
        scene = this.getSceneById(query[1]);

    switch(query[0]) {
        case "addButton":
            return this.addButton_;
        case "removeButton":
            return scene.removeButton;
        default: 
            return;
    }
};