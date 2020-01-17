/**
 * @fileoverview Scene controller for entry.
 */
'use strict';

import { Sortable } from '@entrylabs/tool';

/**
 * Class for a scene controller.
 * This have view for scenes.
 * @constructor
 */
Entry.Scene = class {
    constructor() {
        this.scenes_ = [];
        this.selectedScene = null;
        this.maxCount = 20;
        $(window).on('resize', this.resize.bind(this));

        this.disposeEvent = Entry.disposeEvent.attach(this, (e) => {
            const elem = document.activeElement;
            if (e && elem && elem !== e.target && $(elem).hasClass('entrySceneFieldWorkspace')) {
                elem.blur();
            }
        });
    }

    /**
     * Control bar view generator.
     * @param {!Element} sceneView sceneView from Entry.
     * @param {?string} option for choose type of view.
     */
    generateView(sceneView, option) {
        this.view_ = sceneView;
        this.view_.addClass('entryScene');
        if (!option || option == 'workspace') {
            this.view_.addClass('entrySceneWorkspace');

            $(this.view_).on('mousedown touchstart', (e) => {
                const offset = $(this.view_).offset();
                const $window = $(window);

                const slope = -40 / 55;
                const selectedScene = this.selectedScene;
                const selectedLeft = $(selectedScene.view)
                    .find('.entrySceneRemoveButtonCoverWorkspace')
                    .offset().left;

                const x = e.pageX - offset.left + $window.scrollLeft() - selectedLeft;
                const y = 40 - (e.pageY - offset.top + $window.scrollTop());

                if (x < selectedLeft || x > selectedLeft + 55) {
                    return;
                }
            });

            const listView = this.createListView();
            this.view_.appendChild(listView);
            this.listView_ = listView;

            if (Entry.sceneEditable) {
                const addButton = this.createAddButton();
                this.view_.appendChild(addButton);
                this.addButton_ = addButton;
            }
        }
    }

    createAddButton() {
        const addButton = Entry.createElement('span').addClass(
            'entrySceneElementWorkspace entrySceneAddButtonWorkspace'
        );

        addButton.bindOnClick((e) => {
            if (Entry.engine.isState('run')) {
                return;
            }
            Entry.do('sceneAdd', Entry.generateHash());
        });

        return addButton;
    }

    createListView() {
        const listView = Entry.createElement('div');
        listView.addClass('entrySceneListWorkspace');

        this.sceneSortableListWidget = new Sortable({
            data: {
                height: '100%',
                sortableTarget: ['entrySceneRemoveButtonWorkspace', 'entrySceneInputCover'],
                lockAxis: 'x',
                axis: 'x',
                items: this._getSortableSceneList(),
            },
            container: listView,
        });
        if (Entry.sceneEditable) {
            this.sceneSortableListWidget.on('change', ([newIndex, oldIndex]) => {
                Entry.scene.moveScene(newIndex, oldIndex);
            });
        }
        return listView;
    }

    updateSceneView() {
        const items = this._getSortableSceneList();
        if (this.sceneSortableListWidget) {
            setTimeout(() => this.sceneSortableListWidget.setData({ items }), 0);
        }
    }

    _getSortableSceneList() {
        if (!this.scenes_ || this.scenes_.length === 0) {
            return [];
        }

        return this.scenes_.map((value) => ({
            key: value.id,
            item: value.view,
        }));
    }

    /**
     * generate li element for scene
     * @param {!scene model} scene
     */
    generateElement(scene) {
        const viewTemplate = this.createViewTemplate(scene);
        Entry.Utils.disableContextmenu(viewTemplate);

        const nameField = this.createNameField(scene);
        viewTemplate.nameField = nameField;

        const sceneLeft = this.createSceneLeft();
        viewTemplate.appendChild(sceneLeft);

        const divide = this.createSceneDivider();
        viewTemplate.appendChild(divide);
        scene.inputWrapper = divide;
        divide.appendChild(nameField);

        const removeButtonCover = this.createRemoveButtonCover();
        viewTemplate.appendChild(removeButtonCover);

        if (Entry.sceneEditable) {
            scene.removeButton = this.createRemoveButton(scene, removeButtonCover);

            Entry.ContextMenu.onContextmenu(viewTemplate, (coordinate) => {
                const options = [
                    {
                        text: Lang.Workspace.duplicate_scene,
                        enable: Entry.engine.isState('stop') && !this.isMax(),
                        callback() {
                            Entry.scene.cloneScene(scene);
                        },
                    },
                ];
                Entry.ContextMenu.show(options, 'workspace-contextmenu', coordinate);
            });
        }

        scene.view = viewTemplate;

        return viewTemplate;
    }

    createRemoveButton(scene, removeButtonCover) {
        return Entry.createElement('button')
            .addClass('entrySceneRemoveButtonWorkspace')
            .bindOnClick((e) => {
                if (Entry.engine.isState('run')) {
                    return;
                }
                const isDeletable = Entry.scene.getScenes().length > 1;
                if (!isDeletable) {
                    Entry.toast.alert(
                        Lang.Msgs.runtime_error,
                        Lang.Workspace.Scene_delete_error,
                        false
                    );
                    return;
                }
                Entry.do('sceneRemove', scene.id);
            })
            .appendTo(removeButtonCover);
    }

    createRemoveButtonCover() {
        const removeButtonCover = Entry.createElement('span');
        removeButtonCover.addClass('entrySceneRemoveButtonCoverWorkspace');
        return removeButtonCover;
    }

    createSceneDivider() {
        const divide = Entry.createElement('span');
        divide.addClass('entrySceneInputCover');
        return divide;
    }

    createSceneLeft() {
        const sceneLeft = Entry.createElement('span');
        sceneLeft.addClass('entrySceneLeftWorkspace');
        return sceneLeft;
    }

    createNameField(scene) {
        const nameField = Entry.createElement('input');
        nameField.addClass('entrySceneFieldWorkspace');
        nameField.value = scene.name;

        nameField.addEventListener('keyup', ({ keyCode: code }) => {
            if (Entry.isArrowOrBackspace(code)) {
                return;
            }

            const applyValue = (value) => {
                value !== scene.name && Entry.do('sceneRename', scene.id, value);
                nameField.blur();
            };

            let value = nameField.value;

            if (code === 13) {
                applyValue(value);
            } else if (value.length > 10) {
                value = value.substring(0, 10);
                applyValue(value);
            }
        });
        nameField.addEventListener('blur', (e) => {
            if (nameField.value !== scene.name) {
                Entry.do('sceneRename', scene.id, nameField.value);
            }

            const { playground = {} } = Entry;
            const { mainWorkspace } = playground;
            if (mainWorkspace) {
                mainWorkspace.reDraw();
            }
        });

        if (!Entry.sceneEditable) {
            nameField.disabled = 'disabled';
        }

        return nameField;
    }

    createViewTemplate(scene) {
        const viewTemplate = Entry.createElement('div', scene.id);
        viewTemplate.addClass('entrySceneElementWorkspace  entrySceneButtonWorkspace minValue');
        $(viewTemplate).on('mousedown touchstart', (e) => {
            if (Entry.engine.isState('run')) {
                return;
            }
            if (Entry.scene.selectedScene !== scene) {
                Entry.do('sceneSelect', scene.id);
                if (e.type === 'touchstart') {
                    e.preventDefault();
                }
            }
        });
        return viewTemplate;
    }

    updateView() {
        if (!Entry.type || Entry.type === 'workspace') {
            // var parent = this.listView_;
            // this.getScenes().forEach(({ view }) => parent.appendChild(view));

            if (this.addButton_) {
                if (!this.isMax()) {
                    this.addButton_.removeClass('entryRemove');
                } else {
                    this.addButton_.addClass('entryRemove');
                }
            }
        }
        this.updateSceneView();
        this.resize();
    }

    /**
     * add scenes
     * @param {Array<scene model>} scenes
     */
    addScenes(scenes) {
        this.scenes_ = scenes;
        if (!scenes || scenes.length === 0) {
            this.scenes_ = [];
            this.scenes_.push(this.createScene());
        } else {
            for (let i = 0, len = scenes.length; i < len; i++) {
                this.generateElement(scenes[i]);
            }
        }

        this.selectScene(this.getScenes()[0]);
    }
    /**
     * add scenes to this.scenes_
     * @param {scene model} scene
     */
    addScene(scene, index) {
        if (scene === undefined || typeof scene === 'string') {
            scene = this.createScene(scene);
        }

        if (!scene.view) {
            this.generateElement(scene);
        }

        if (!index && typeof index != 'number') {
            this.getScenes().push(scene);
        } else {
            this.getScenes().splice(index, 0, scene);
        }

        Entry.stage.objectContainers.push(Entry.stage.createObjectContainer(scene));
        this.selectScene(scene);

        if (Entry.creationChangedEvent) {
            Entry.creationChangedEvent.notify();
        }
        const { playground = {} } = Entry || {};
        const { mainWorkspace } = playground;
        if (mainWorkspace) {
            mainWorkspace.reDraw();
        }
        return scene;
    }

    /**
     * remove scene from this.scenes_
     * @param {!scene model} scene
     */
    removeScene(scene) {
        if (this.getScenes().length <= 1) {
            Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.Scene_delete_error, false);
            return;
        }
        Entry.Utils.forceStopSounds();
        scene = this.getSceneById(typeof scene === 'string' ? scene : scene.id);

        this.getScenes().splice(this.getScenes().indexOf(scene), 1);
        Entry.container
            .getSceneObjects(scene)
            .forEach((object) => Entry.container.removeObject(object, true));
        Entry.stage.removeObjectContainer(scene);
        $(scene.view).remove();
        this.selectScene();
        this.updateView();
    }

    /**
     * select scene
     * @param {scene model} scene
     */
    selectScene(scene) {
        scene = scene || this.getScenes()[0];
        const container = Entry.container;

        container.resetSceneDuringRun();

        if (this.selectedScene && this.selectedScene.id == scene.id) {
            return;
        }
        if (Entry.playground.nameViewFocus && Entry.playground.nameViewBlur()) {
            return;
        }

        const prevSelected = this.selectedScene;
        if (prevSelected) {
            const prevSelectedView = prevSelected.view;
            prevSelectedView.removeClass('selectedScene');
            const elem = document.activeElement;
            elem === prevSelectedView.nameField && elem.blur();
        }

        this.selectedScene = scene;
        scene.view.addClass('selectedScene');

        const stage = Entry.stage;
        const playground = Entry.playground;

        container.setCurrentObjects();

        stage.selectObjectContainer(scene);

        const targetObject = container.getCurrentObjects()[0];

        if (targetObject && Entry.type !== 'minimize') {
            container.selectObject(targetObject.id);
            playground.refreshPlayground();
        } else {
            if (Entry.isTextMode) {
                const workspace = Entry.getMainWS();
                const vimBoard = workspace && workspace.vimBoard;
                if (vimBoard) {
                    const sObject = vimBoard._currentObject;
                    const sScene = vimBoard._currentScene;
                    const parser = vimBoard._parser;
                    try {
                        if (scene.id != sScene.id) {
                            workspace._syncTextCode();
                        }
                    } catch (e) {}

                    if (parser._onError) {
                        container.selectObject(sObject.id, true);
                        return;
                    }
                }
                vimBoard && vimBoard.clearText();
            }

            stage.selectObject(null);
            playground.flushPlayground();
            Entry.variableContainer.selected = null;
            Entry.variableContainer.updateList();
        }
        !container.listView_ && stage.sortZorder();

        container.updateListView();
        this.updateView();
        Entry.requestUpdate = true;
    }

    /**
     * convert this scenes data to JSON.
     * @return {JSON}
     */
    toJSON() {
        return this.getScenes().map((scene) => _.pick(scene, ['id', 'name']));
    }

    /**
     * Move scene in this.scenes_
     * this method is for sortable
     * @param {!number} start
     * @param {!number} end
     */
    moveScene(start, end) {
        this.getScenes().splice(end, 0, this.getScenes().splice(start, 1)[0]);
        Entry.container.updateObjectsOrder();
        Entry.stage.sortZorder();
        this.updateSceneView();
        //style properties are not removed sometimes
        $('.entrySceneElementWorkspace').removeAttr('style');
    }

    /**
     * get scene by scene id
     * @param {!String} sceneId
     * @return {scene modal}
     */
    getSceneById(id) {
        return _.find(this.getScenes(), { id }) || false;
    }

    /**
     * @return {Array<Entry scene>}
     */
    getScenes() {
        return this.scenes_;
    }

    /**
     * remember selectedScene before start
     * in order to reset when stopped
     */
    takeStartSceneSnapshot() {
        this.sceneBeforeRun = this.selectedScene;
    }

    /**
     * select selectedScene before start
     * before run start
     */
    loadStartSceneSnapshot() {
        this.selectScene(this.sceneBeforeRun);
        this.sceneBeforeRun = null;
    }
    /**
     * create scene
     * @return {scene modal} scene
     */
    createScene(sceneId) {
        const regex = /[0-9]/;
        let name = Entry.getOrderedName(`${Lang.Blocks.SCENE} `, this.scenes_, 'name');
        if (!regex.test(name)) {
            name += '1';
        }
        const scene = {
            name,
            id: sceneId || Entry.generateHash(),
        };

        this.generateElement(scene);
        return scene;
    }

    /**
     * clone scene by context menu
     * @param {!scene model} scene
     */
    cloneScene(scene) {
        if (this.isMax()) {
            Entry.toast.alert(Lang.Msgs.runtime_error, Lang.Workspace.Scene_add_error, false);
            return;
        }

        const clonedScene = {
            name: (Lang.Workspace.cloned_scene + scene.name).substring(0, 10),
            id: Entry.generateHash(),
        };

        this.generateElement(clonedScene);
        this.addScene(clonedScene);

        const container = Entry.container;
        const objects = container.getSceneObjects(scene);

        try {
            const oldIds = [];
            const newIds = [];
            this.isSceneCloning = true;
            for (let i = objects.length - 1; i >= 0; i--) {
                const obj = objects[i];
                const ret = container.addCloneObject(obj, clonedScene.id, true);
                oldIds.push(obj.id);
                newIds.push(ret.id);
            }
            container.adjustClonedValues(oldIds, newIds);
            const WS = Entry.getMainWS();
            WS && WS.board && WS.board.reDraw();
            this.isSceneCloning = false;
            container.setCurrentObjects();
            container.updateObjectsOrder();
            container.updateListView();
            container.selectObject(newIds[newIds.length - 1]);
            Entry.variableContainer.updateViews();
        } catch (e) {
            console.log('error', e);
        }
    }

    /**
     * resize html element by window size
     * @param {!scene model} scene
     */
    resize() {
        const scenes = this.getScenes();
        const selectedScene = this.selectedScene;
        const addButton = this.addButton_;
        const firstScene = scenes[0];

        if (scenes.length === 0 || !firstScene) {
            return;
        }

        const startPos = $(firstScene.view).offset().left;
        const marginLeft = parseFloat($(selectedScene.view).css('margin-left'));
        let totalWidth = Math.floor($(this.view_).width() - startPos - 5);
        const LEFT_MARGIN = -40;

        let normWidth = startPos + 15;
        let diff = 0;
        let isSelectedView = false;
        let selectedViewWidth = 0;
        for (var i in scenes) {
            var scene = scenes[i];
            let view = scene.view;
            view.addClass('minValue');
            isSelectedView = view === this.selectedScene.view;
            view = $(view);

            const width = parseFloat(Entry.computeInputWidth(scene.name));
            const adjusted = (width * 10) / 9;
            if (scene === this.selectedScene) {
                diff = adjusted - width;
            }
            // $(scene.inputWrapper).width(adjusted + 'px');
            const viewWidth = view.width();
            if (isSelectedView) {
                selectedViewWidth = viewWidth;
            }
            normWidth += viewWidth + LEFT_MARGIN;
        }

        if (normWidth > totalWidth) {
            align();
        }

        function align() {
            const dummyWidth = 30.5;
            const len = scenes.length - 1;
            totalWidth =
                totalWidth -
                Math.round(selectedViewWidth || $(selectedScene.view).width()) -
                dummyWidth * len -
                diff;

            const fieldWidth = Math.floor(totalWidth / len);
            for (i in scenes) {
                scene = scenes[i];
                if (selectedScene.id != scene.id) {
                    scene.view.removeClass('minValue');
                    // $(scene.inputWrapper).width(fieldWidth);
                } else {
                    scene.view.addClass('minValue');
                }
            }
        }
    }

    getNextScene() {
        const scenes = this.getScenes();
        return scenes[scenes.indexOf(this.selectedScene) + 1];
    }

    isMax() {
        return this.scenes_.length >= this.maxCount;
    }

    clear() {
        this.scenes_.forEach((s) => Entry.stage.removeObjectContainer(s));
        this.scenes_ = [];
        this.selectedScene = null;
        this.updateView();
    }

    getDom(query) {
        let scene;
        if (query.length > 1) {
            scene = this.getSceneById(query[1]);
        }

        switch (query[0]) {
            case 'addButton':
                return this.addButton_;
            case 'removeButton':
                return scene.removeButton;
            case 'nameField':
                return scene.view.nameField;
            case 'view':
                return scene.view;
            default:
                return;
        }
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
};
