/**;
 * @fileoverview Object for Entry.
 */
'use strict';

import DomUtils from '../../src/util/domUtils';

/**
 * Class for entry object.
 * @param {?object model} model for object
 * @constructor
 */
Entry.EntryObject = class {
    constructor(model) {
        if (model) {
            this.id = model.id;
            this.name = model.name || model.sprite.name;
            this.text = model.text || this.name;
            this.objectType = model.objectType || 'sprite';
            this.script = new Entry.Code(model.script || [], this);
            this.pictures = Entry.Utils.copy(model.sprite.pictures || []);
            this.sounds = Entry.Utils.copy(model.sprite.sounds || []);

            this._setFocused = Entry.Utils.setFocused;
            this._setBlurredTimer = Entry.Utils.setBlurredTimer;
            this.editObjectValueWhenEnterPress = Entry.Utils.whenEnter(() => {
                this.editObjectValues(false);
            });

            this.sounds.forEach(function(s) {
                if (!s.id) {
                    s.id = Entry.generateHash();
                }
                Entry.initSound(s);
            });

            this.lock = model.lock ? model.lock : false;
            this.isEditing = false;

            if (this.objectType === 'sprite') {
                this.selectedPicture = !model.selectedPictureId ? this.pictures[0] : this.getPicture(model.selectedPictureId);
            }

            this.scene = Entry.scene.getSceneById(model.scene) || Entry.scene.selectedScene;

            this.setRotateMethod(model.rotateMethod);

            //entity
            this.entity = new Entry.EntityObject(this);
            this.entity.injectModel(
                this.selectedPicture ? this.selectedPicture : null,
                model.entity ? model.entity : this.initEntity(model)
            );

            this.clonedEntities = [];

            Entry.stage.loadObject(this);

            const entityId = this.entity.id;
            const cachePicture = Entry.container.cachePicture.bind(Entry.container);
            const pictures = this.pictures;

            for (let i in pictures) {
                ((picture) => {
                    picture.objectId = this.id;
                    if (!picture.id) picture.id = Entry.generateHash();

                    const image = new Image();
                    Entry.Loader.addQueue();

                    image.onload = function(e) {
                        delete this.triedCnt;
                        cachePicture(picture.id + entityId, this);
                        Entry.Loader.removeQueue();
                        this.onload = null;
                    };

                    image.onerror = function(err) {
                        if (!this.triedCnt) {
                            if (Entry.type !== 'invisible')
                                console.log('err=', picture.name, 'load failed');
                            this.triedCnt = 1;
                            this.src = getImageSrc(picture);
                        } else if (this.triedCnt < 3) {
                            this.triedCnt++;
                            this.src = Entry.mediaFilePath + '_1x1.png';
                        } else {
                            //prevent infinite call
                            delete this.triedCnt;
                            Entry.Loader.removeQueue();
                            this.onerror = null;
                        }
                    };

                    image.src = getImageSrc(picture);
                })(this.pictures[i]);
            }
            Entry.requestUpdate = true;
        }

        this._isContextMenuEnabled = true;

        function getImageSrc(picture) {
            if (picture.fileurl) return picture.fileurl;

            const fileName = picture.filename;
            return (
                Entry.defaultPath + '/uploads/' +
                fileName.substring(0, 2) + '/' +
                fileName.substring(2, 4) + '/image/' +
                fileName + '.png');
        }
    }

    /**
     * View generator for workspace or others.
     * @return {!Element}
     */
    generateView() {
        var type = Entry.type;

        if (type === 'workspace') return this.generateWorkspaceView();
        else if (type === 'phone') return this.generatePhoneView();
    }

    /**
     * Object name setter
     * @param {!string} name
     */
    setName(name) {
        Entry.assert(typeof name == 'string', 'object name must be string');

        this.name = name;
        if (this.nameView_) this.nameView_.value = name;
    }

    getName() {
        return this.name;
    }

    /**
     * Object text setter
     * @param {!string} name
     */
    setText(text) {
        Entry.assert(typeof text == 'string', 'object text must be string');
        this.text = text;
    }

    /**
     * Object script setter
     * @param {!xml script} script
     */
    setScript(script) {
        this.script = script;
    }

    /**
     * Object script getter
     * @return {!xml script} script
     */
    getScriptText() {
        return this.script.stringify();
    }

    /**
     * Initialize entity model if not exist
     * @param {!object model} model for object
     * @return {entity model}
     */
    initEntity(model) {
        const json = {};
        json.rotation = json.x = json.y = 0;
        json.direction = 90;

        if (this.objectType == 'sprite') {
            var dimension = model.sprite.pictures[0].dimension;
            json.regX = dimension.width / 2;
            json.regY = dimension.height / 2;
            var scale;
            var mainCategory = model.sprite.category.main;
            if (mainCategory == 'background' || mainCategory == 'new')
                scale = Math.max(270 / dimension.height, 480 / dimension.width);
            else if (mainCategory == 'new') scale = 1;
            else scale = 200 / (dimension.width + dimension.height);

            json.scaleX = json.scaleY = scale;
            json.width = dimension.width;
            json.height = dimension.height;
        } else if (this.objectType == 'textBox') {
            json.regX = 25;
            json.regY = 12;
            json.scaleX = json.scaleY = 1.5;
            json.width = 50;
            json.height = 24;
            json.text = model.text;
            if (model.options) {
                var options = model.options;
                var fontStyle = '';
                const {
                    fontSize = 20,
                    textAlign = 0,
                    scaleX = 1.5,
                    regX,
                    regY,
                    width,
                    height,
                } = options;
                if (options.bold) fontStyle += 'bold ';
                if (options.italic) fontStyle += 'italic ';

                json.underLine = options.underLine;
                json.strike = options.strike;
                if (typeof options.font === 'string') {
                    json.font = options.font;
                } else {
                    json.font = fontStyle + `${fontSize}px ` + options.font.family;
                }
                json.colour = options.colour;
                json.bgColor = options.bgColor || options.background;
                json.lineBreak = options.lineBreak;
                json.textAlign = textAlign;
                json.scaleX = json.scaleY = scaleX;
                if (options.lineBreak) {
                    json.width = width || 256;
                    json.height = height || json.width * 0.5625;
                    json.regX = regX || json.width / 2;
                    json.regY = regY || json.height / 2;
                }
            } else {
                json.underLine = false;
                json.strike = false;
                json.font = '20px Nanum Gothic';
                json.colour = '#000000';
                json.bgColor = '#ffffff';
            }
        }

        return json;
    }

    /**
     * Update thumbnail view;
     */
    updateThumbnailView() {
        const thumb = this.thumbnailView_;
        const picture = this.entity.picture;
        const objectType = this.objectType;

        if (objectType == 'sprite') {
            if (picture.fileurl) {
                thumb.style.backgroundImage = 'url("' + picture.fileurl + '")';
            } else {
                var fileName = picture.filename;
                thumb.style.backgroundImage =
                    'url("' +
                    Entry.defaultPath +
                    '/uploads/' +
                    fileName.substring(0, 2) +
                    '/' +
                    fileName.substring(2, 4) +
                    '/thumb/' +
                    fileName +
                    '.png")';
            }
        } else if (objectType == 'textBox') {
            const textIconPath = Entry.mediaFilePath + '/text_icon.png';
            thumb.style.backgroundImage = 'url(' + textIconPath + ')';
        }
    }

    /**
     * Update coordinate view;
     */
    updateCoordinateView(isForced) {
        if (!this.isSelected() && !isForced) return;

        const view = this.coordinateView_;
        if (view && view.xInput_ && view.yInput_) {
            const originX = view.xInput_.value,
                originY = view.yInput_.value,
                size = view.sizeInput_.value,
                entity = this.entity,
                newX = entity.getX(1),
                newY = entity.getY(1),
                newSize = entity.getSize(1);

            if (originX != newX) view.xInput_.value = newX;
            if (originY != newY) view.yInput_.value = newY;
            if (size != newSize) view.sizeInput_.value = newSize;
        }
    }

    /**
     * Update rotation view;
     */
    updateRotationView(isForced) {
        if ((!this.isSelected() || !this.view_) && !isForced) return;
        const rotateMethod = this.getRotateMethod();
        const entity = this.entity;
        const className = 'entryRemove';

        if (rotateMethod == 'free') {
            this.rotateSpan_.removeClass(className);
            this.rotateInput_.removeClass(className);

            this.rotateInput_.value = entity.getRotation(1) + '˚';
            this.directionInput_.value = entity.getDirection(1) + '˚';
        } else {
            this.rotateSpan_.addClass(className);
            this.rotateInput_.addClass(className);
            this.directionInput_.value = entity.getDirection(1) + '˚';
        }
    }

    /**
     * Add picture object by picture model.
     * @param {picture model} picture
     */
    addPicture(picture, index) {
        picture.objectId = this.id;

        if (typeof index === 'undefined') this.pictures.push(picture);
        else {
            this.pictures.splice(index, 0, picture);
        }

        Entry.playground.injectPicture(this);
    }

    /**
     * Remove picture object.
     * @param {string} pictureId
     * @return {boolean} return true if success
     */
    removePicture(pictureId) {
        const pictures = this.pictures;
        if (pictures.length < 2) return false;

        const playground = Entry.playground;
        const picture = this.getPicture(pictureId);

        pictures.splice(pictures.indexOf(picture), 1);
        if (picture === this.selectedPicture) playground.selectPicture(pictures[0]);

        Entry.container.unCachePictures(this.entity, picture);

        playground.injectPicture(this);
        playground.reloadPlayground();
        return true;
    }

    /**
     * Get picture object by Id.
     * @param {?string} pictureId
     * @return {picture object}
     */
    getPicture(value) {
        //priority
        //1. pictureId
        //2. pictureName
        //3. index
        if (!value) return this.selectedPicture;

        value = (value + '').trim();
        const pictures = this.pictures,
            len = pictures.length;

        for (let i = 0; i < len; i++) {
            if (pictures[i].id == value) return pictures[i];
        }

        for (let i = 0; i < len; i++) {
            if (pictures[i].name == value) return pictures[i];
        }

        var checker = Entry.parseNumber(value);
        if (!(checker === false && typeof checker == 'boolean') && len >= checker && checker > 0) {
            return pictures[checker - 1];
        }
        return null;
    }

    getPictureIndex(value) {
        return this.pictures.indexOf(this.getPicture(value));
    }

    /**
     * Get previous picture object by Id.
     * @param {?string} pictureId
     * @return {picture object}
     */
    getPrevPicture(pictureId) {
        const pictures = this.pictures;
        var idx = this.getPictureIndex(pictureId);
        return pictures[idx === 0 ? pictures.length - 1 : --idx];
    }

    /**
     * Get next picture object by Id.
     * @param {?string} pictureId
     * @return {picture object}
     */
    getNextPicture(pictureId) {
        const pictures = this.pictures;
        const len = pictures.length;
        var idx = this.getPictureIndex(pictureId);
        return pictures[idx == len - 1 ? 0 : ++idx];
    }

    /**
     * Select picture object by Id.
     * @param {!string} pictureId
     * @return {picture object}
     */
    selectPicture(pictureId) {
        const picture = this.getPicture(pictureId);
        if (!picture) throw new Error('No picture with pictureId : ' + pictureId);

        this.selectedPicture = picture;
        this.entity.setImage(picture);
        this.updateThumbnailView();
    }

    /**
     * Add sound to object
     * @param {sound model} sound
     */
    addSound(sound, index) {
        if (!sound.id) sound.id = Entry.generateHash();

        Entry.initSound(sound, index);

        if (typeof index === 'undefined') this.sounds.push(sound);
        else {
            this.sounds.splice(index, 0, sound);
        }
        Entry.playground.injectSound(this);
    }

    /**
     * Remove sound object.
     * @param {string} soundId
     * @return {boolean} return true if success
     */
    removeSound(soundId) {
        let index, sound;
        sound = this.getSound(soundId);
        index = this.sounds.indexOf(sound);
        this.sounds.splice(index, 1);
        Entry.playground.reloadPlayground();
        Entry.playground.injectSound(this);
    }

    /**
     * rotate method getter
     * @return {string}
     */
    getRotateMethod() {
        if (!this.rotateMethod) this.rotateMethod = 'free';

        return this.rotateMethod;
    }

    /**
     * rotate method setter
     * @param {string} rotateMethod
     */
    setRotateMethod(rotateMethod = 'free') {
        /** @type {string} */
        this.rotateMethod = rotateMethod;
        this.updateRotateMethodView();

        const stage = Entry.stage;
        const entity = stage.selectedObject && stage.selectedObject.entity;

        if (entity) {
            stage.updateObject();
            stage.updateHandle();
        }
    }

    initRotateValue(rotateMethod) {
        if (this.rotateMethod === rotateMethod) {
            return;
        }

        const entity = this.entity;
        const direction = entity.direction;
        entity.direction = direction !== undefined ? direction : 90.0;
        entity.rotation = 0.0;
        entity.flip = false;
    }

    updateRotateMethodView() {
        if (!this.rotateModeAView_) {
            return;
        }

        const SELECTED = 'selected';

        this.rotateModeAView_.removeClass(SELECTED);
        this.rotateModeBView_.removeClass(SELECTED);
        this.rotateModeCView_.removeClass(SELECTED);

        const rotateMethod = this.rotateMethod;
        if (rotateMethod == 'free') this.rotateModeAView_.addClass(SELECTED);
        else if (rotateMethod == 'vertical') this.rotateModeBView_.addClass(SELECTED);
        else this.rotateModeCView_.addClass(SELECTED);

        this.updateRotationView();
    }

    /**
     * Add clone entity for clone block
     * If parameter given, this clone the parameter entity itself.
     * Otherwise, this clone this object's entity.
     * @param {?Entry.EntryObject} object
     * @param {?Entry.EntityObject} entity
     * @param {?xml block} script
     */
    addCloneEntity(object, entity, script) {
        if (this.clonedEntities.length > Entry.maxCloneLimit) return;

        const clonedEntity = new Entry.EntityObject(this);
        clonedEntity.isClone = true;

        entity = entity || this.entity;

        clonedEntity.injectModel(entity.picture || null, entity.toJSON());
        clonedEntity.snapshot_ = entity.snapshot_;

        if (entity.effect) {
            clonedEntity.effect = _.clone(entity.effect);
            clonedEntity.applyFilter();
        }

        Entry.engine.raiseEventOnEntity(clonedEntity, [clonedEntity, 'when_clone_start']);

        clonedEntity.isStarted = true;
        this.addCloneVariables(
            this,
            clonedEntity,
            entity ? entity.variables : null,
            entity ? entity.lists : null
        );

        this.clonedEntities.push(clonedEntity);
        let targetIndex = Entry.stage.selectedObjectContainer.getChildIndex(entity.object);
        targetIndex -= (entity.shapes.length ? 1 : 0) + entity.stamps.length;
        Entry.stage.loadEntity(clonedEntity, targetIndex);

        if (entity.brush) Entry.setCloneBrush(clonedEntity, entity.brush);
    }

    /**
     * return true when object is selected
     * @return {Boolean}
     */
    isSelected() {
        return this.isSelected_;
    }

    /**
     * convert this object's data to JSON.
     * @return {JSON}
     */
    toJSON(isClone) {
        const json = {};
        json.id = isClone ? Entry.generateHash() : this.id;
        json.name = this.name;
        json.script = this.getScriptText();
        json.objectType = this.objectType;
        json.rotateMethod = this.getRotateMethod();
        json.scene = this.scene.id;
        json.sprite = {
            pictures: Entry.getPicturesJSON(this.pictures, isClone),
            sounds: Entry.getSoundsJSON(this.sounds, isClone),
        };
        if (this.objectType == 'textBox') {
            json.text = this.text;
        } else {
            json.selectedPictureId =
                json.sprite.pictures[this.pictures.indexOf(this.selectedPicture)].id;
        }
        json.lock = this.lock;
        json.entity = this.entity.toJSON();
        return json;
    }

    /**
     * destroy this object
     */
    destroy() {
        this.entity && this.entity.destroy();
        Entry.removeElement(this.view_);
    }

    /**
     * Get sound object by Id.
     * @param {?string} soundId
     * @return {sound object}
     */
    getSound(value) {
        //priority
        //1. soundId
        //2. soundName
        //3. index
        value = String(value).trim();
        const sounds = this.sounds,
            len = sounds.length;

        for (let i = 0; i < len; i++) if (sounds[i].id == value) return sounds[i];

        for (let i = 0; i < len; i++) if (sounds[i].name == value) return sounds[i];

        let checker = Entry.parseNumber(value);
        if (!(checker === false && typeof checker == 'boolean') && len >= checker && checker > 0) {
            return sounds[checker - 1];
        }

        return null;
    }

    addCloneVariables({ id }, entity, variables, lists) {
        const _whereFunc = _.partial(_.filter, _, { object_: id });
        const _cloneFunc = (v) => v.clone();
        const { variables_, lists_ } = Entry.variableContainer;

        entity.variables = (variables || _whereFunc(variables_)).map(_cloneFunc);
        entity.lists = (lists || _whereFunc(lists_)).map(_cloneFunc);
    }

    getLock() {
        return this.lock;
    }

    setLock(bool) {
        this.lock = bool;
        Entry.stage.updateObject();
        return bool;
    }

    updateInputViews(isLocked) {
        isLocked = isLocked || this.getLock();
        const inputs = [
            this.nameView_,
            this.coordinateView_.xInput_,
            this.coordinateView_.yInput_,
            this.rotateInput_,
            this.directionInput_,
            this.coordinateView_.sizeInput_,
        ];

        if (isLocked){
            inputs.forEach(function(input) {
                input.removeClass('selectedEditingObject');
                input.setAttribute('disabled', 'disabled');
            });
        } else {
            inputs.forEach(function(input) {
                input.addClass('selectedEditingObject');
                input.removeAttribute('disabled');
            });
        }

        this.isEditing = !isLocked;
    }

    editObjectValues(activate) {
        const inputs = [
            this.nameView_,
            this.coordinateView_.xInput_,
            this.coordinateView_.yInput_,
            this.rotateInput_,
            this.directionInput_,
            this.coordinateView_.sizeInput_,
        ];

        if (activate && !this.isEditing) {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].addClass('selectedEditingObject');
            }
            this.isEditing = true;
        } else {
            inputs.forEach(function(input) {
                input.blur(true);
            });

            this.blurAllInput();
            this.isEditing = false;
        }
    }

    blurAllInput() {
        $('.selectedEditingObject').removeClass('selectedEditingObject');

        const { xInput_, yInput_, sizeInput_ } = this.coordinateView_;
    }

    /**
     *  get only clonedEntities among clonedEntities except for stamp entity
     *  @return {Array<clone Entity> } entities
     */
    getClonedEntities() {
        return this.clonedEntities.concat();
    }

    clearExecutor() {
        this.script.clearExecutors();

        const clonedEntities = this.clonedEntities;
        for (let j = clonedEntities.length - 1; j >= 0; j--) {
            clonedEntities[j].removeClone(true);
        }
        this.entity.removeStamps();
    }

    _rightClick(e) {
        if (!this.isContextMenuEnabled()) return;
        e.stopPropagation();

        const object = this;
        const container = Entry.container;
        const options = [
            {
                text: Lang.Workspace.context_duplicate,
                enable: !Entry.engine.isState('run'),
                callback: function() {
                    container.addCloneObject(object);
                },
            },
            {
                text: Lang.Workspace.context_remove,
                callback: function() {
                    Entry.dispatchEvent('removeObject', object);
                    var { id } = object;
                    Entry.do('removeObject', id);
                },
            },
            {
                text: Lang.Workspace.copy_file,
                callback: function() {
                    container.setCopiedObject(object);
                },
            },
            {
                text: Lang.Blocks.Paste_blocks,
                enable: !Entry.engine.isState('run') && !!container.copiedObject,
                callback: function() {
                    var container = Entry.container;
                    if (container.copiedObject) {
                        container.addCloneObject(container.copiedObject);
                    } else {
                        Entry.toast.alert(
                            Lang.Workspace.add_object_alert,
                            Lang.Workspace.object_not_found_for_paste
                        );
                    }
                },
            },
            {
                divider: true,
            },
            {
                text: Lang.Blocks.export_object,
                callback: function() {
                    Entry.dispatchEvent('exportObject', object);
                },
            },
        ];

        const { clientX: x, clientY: y } = Entry.Utils.convertMouseEvent(e);
        Entry.ContextMenu.show(options, 'workspace-contextmenu', { x, y, });
    }

    enableContextMenu() {
        this._isContextMenuEnabled = true;
    }

    disableContextMenu() {
        this._isContextMenuEnabled = false;
    }

    isContextMenuEnabled() {
        return this._isContextMenuEnabled && Entry.objectEditable;
    }

    toggleEditObject() {
        if (this.isEditing || Entry.engine.isState('run')) return;

        this.editObjectValues(true);
        if (Entry.playground.object !== this) Entry.container.selectObject(this.id);
    }

    getDom(query) {
        if (_.isEmpty(query)) {
            return this.view_;
        }

        switch (query.shift()) {
            case 'editButton':
                return this.editView_;
            case 'nameInput':
                return this.nameView_;
            case 'removeButton':
                return this.deleteView_;
            case 'xInput':
                return this.coordinateView_.xInput_;
            case 'yInput':
                return this.coordinateView_.yInput_;
            case 'sizeInput':
                return this.coordinateView_.sizeInput_;
            case 'directionInput':
                return this.directionInput_;
            case 'rotationInput':
                return this.rotateInput_;
            case 'rotationMethod':
                return this._getRotateView(query.shift());
        }
    }

    setInputBlurred(...target) {
        target = this.getDom(target);
        if (!target) {
            return;
        }
        target._focused = false;
    };

    generateWorkspaceView() {
        const exceptionsForMouseDown = [];

        const that = this;
        const objectId = this.id;

        this.view_ = this.createObjectView(objectId, exceptionsForMouseDown); // container
        this.view_.appendChild(this.createObjectInfoView()); // visible, lock

        const thumbnailView = this.createThumbnailView(); // thumbnail
        this.thumbnailView_ = thumbnailView;
        this.view_.appendChild(thumbnailView);

        this.view_.appendChild(this.createWrapperView()); // name space

        if (Entry.objectEditable && Entry.objectDeletable) {
            const deleteView = this.createDeleteView(exceptionsForMouseDown, that); // delete
            this.deleteView_ = deleteView;
            this.view_.appendChild(deleteView);
        }

        const rotationWrapperView = this.createRotationWrapperView();
        this.view_.appendChild(rotationWrapperView);

        this.updateThumbnailView();
        this.updateRotateMethodView();
        this.updateInputViews();

        this.updateCoordinateView(true);
        this.updateRotationView(true);

        return this.view_;
    }

    createRotationMethodWrapperView() {
        const rotationMethodWrapper = Entry.createElement('div').addClass('rotationMethodWrapper');

        const rotateMethodLabelView = Entry.createElement('span').addClass('entryObjectRotateMethodLabelWorkspace');
        rotationMethodWrapper.appendChild(rotateMethodLabelView);
        rotateMethodLabelView.innerHTML = Lang.Workspace.rotate_method + '';

        const rotateModeAView = Entry.createElement('div').addClass('entryObjectRotateModeWorkspace entryObjectRotateModeAWorkspace');
        this.rotateModeAView_ = rotateModeAView;
        rotationMethodWrapper.appendChild(rotateModeAView);
        rotationMethodWrapper.appendChild(rotateModeAView);
        rotateModeAView.bindOnClick(
            this._whenRotateEditable(() => {
                Entry.do('objectUpdateRotateMethod', this.id, 'free');
            }, this)
        );

        const rotateModeBView = Entry.createElement('div').addClass('entryObjectRotateModeWorkspace entryObjectRotateModeBWorkspace');
        this.rotateModeBView_ = rotateModeBView;
        rotationMethodWrapper.appendChild(rotateModeBView);
        rotateModeBView.bindOnClick(
            this._whenRotateEditable(() => {
                Entry.do('objectUpdateRotateMethod', this.id, 'vertical');
            }, this)
        );

        const rotateModeCView = Entry.createElement('div').addClass('entryObjectRotateModeWorkspace entryObjectRotateModeCWorkspace');
        this.rotateModeCView_ = rotateModeCView;
        rotationMethodWrapper.appendChild(rotateModeCView);
        rotateModeCView.bindOnClick(
            this._whenRotateEditable(() => {
                Entry.do('objectUpdateRotateMethod', this.id, 'none');
            }, this)
        );

        return rotationMethodWrapper;
    }

    createRotateLabelWrapperView() {
        const rotateLabelWrapperView = Entry.createElement('div').addClass('entryObjectRotateLabelWrapperWorkspace');

        const rotateSpan = Entry.createElement('span').addClass('entryObjectRotateSpanWorkspace');
        rotateSpan.innerHTML = Lang.Workspace.rotation + '';
        const rotateInput = Entry.createElement('input').addClass('entryObjectRotateInputWorkspace');
        rotateInput.bindOnClick(function(e) {
            e.stopPropagation();
            this.select();
        });

        rotateInput.onkeypress = this.editObjectValueWhenEnterPress;
        rotateInput.onfocus = this._setFocused;
        rotateInput.onblur = this._setBlurredTimer(() => {
            const object = Entry.container.getObject(this.id);
            if (!object) {
                return;
            }
            let value = rotateInput.value;
            const idx = value.indexOf('˚');
            if (~idx) {
                value = value.substring(0, idx);
            }

            Entry.do('objectUpdateRotationValue', this.id, Entry.Utils.isNumber(value) ? value : this.entity.getRotation());
        });

        this.rotateSpan_ = rotateSpan;
        this.rotateInput_ = rotateInput;

        const directionSpan = Entry.createElement('span').addClass('entryObjectDirectionSpanWorkspace');
        directionSpan.innerHTML = Lang.Workspace.direction + '';
        const directionInput = Entry.createElement('input').addClass('entryObjectDirectionInputWorkspace');
        directionInput.bindOnClick(function(e) {
            e.stopPropagation();
            this.select();
        });

        directionInput.onkeypress = this.editObjectValueWhenEnterPress;
        directionInput.onfocus = this._setFocused;
        directionInput.onblur = this._setBlurredTimer(() => {
            const object = Entry.container.getObject(this.id);
            if (!object) {
                return;
            }
            let value = directionInput.value;
            const idx = value.indexOf('˚');
            if (~idx) {
                value = value.substring(0, idx);
            }

            Entry.do('objectUpdateDirectionValue', this.id, Entry.Utils.isNumber(value) ? value : this.entity.getDirection());
        });

        this.directionInput_ = directionInput;

        rotateLabelWrapperView.appendChild(rotateSpan);
        rotateLabelWrapperView.appendChild(rotateInput);
        rotateLabelWrapperView.appendChild(directionSpan);
        rotateLabelWrapperView.appendChild(directionInput);
        rotateLabelWrapperView.rotateInput_ = rotateInput;
        rotateLabelWrapperView.directionInput_ = directionInput;

        return rotateLabelWrapperView;
    }

    createCoordinationView() {
        const coordinationView = Entry.createElement('span').addClass('entryObjectCoordinateWorkspace');

        const xCoordi = Entry.createElement('span').addClass('entryObjectCoordinateSpanWorkspace');
        xCoordi.innerHTML = 'X';
        const xInput = Entry.createElement('input').addClass('entryObjectCoordinateInputWorkspace');
        xInput.bindOnClick((e) => {
            e.stopPropagation();
            xInput.select();
        });

        xInput.onkeypress = this.editObjectValueWhenEnterPress;
        xInput.onfocus = this._setFocused;
        xInput.onblur = this._setBlurredTimer(() => {
            const object = Entry.container.getObject(this.id);
            if (!object) {
                return;
            }

            const value = xInput.value;
            Entry.do('objectUpdatePosX', this.id, Entry.Utils.isNumber(value) ? value : this.entity.getX());
        });

        const yCoordi = Entry.createElement('span').addClass('entryObjectCoordinateSpanWorkspace');
        yCoordi.innerHTML = 'Y';
        const yInput = Entry.createElement('input').addClass('entryObjectCoordinateInputWorkspace entryObjectCoordinateInputWorkspace_right');
        yInput.bindOnClick((e) => {
            e.stopPropagation();
            yInput.select();
        });

        yInput.onkeypress = this.editObjectValueWhenEnterPress;
        yInput.onfocus = this._setFocused;
        yInput.onblur = this._setBlurredTimer(() => {
            const object = Entry.container.getObject(this.id);
            if (!object) {
                return;
            }
            const value = yInput.value;
            Entry.do('objectUpdatePosY', this.id, Entry.Utils.isNumber(value) ? value : this.entity.getY());
        });

        const sizeSpan = Entry.createElement('span').addClass('entryObjectCoordinateSizeWorkspace');
        sizeSpan.innerHTML = Lang.Workspace.Size + '';
        const sizeInput = Entry.createElement('input').addClass(
            'entryObjectCoordinateInputWorkspace',
            'entryObjectCoordinateInputWorkspace_size');
        sizeInput.bindOnClick((e) => {
            e.stopPropagation();
            sizeInput.select();
        });

        sizeInput.onkeypress = this.editObjectValueWhenEnterPress;
        sizeInput.onfocus = this._setFocused;
        sizeInput.onblur = this._setBlurredTimer(() => {
            const object = Entry.container.getObject(this.id);
            if (!object) {
                return;
            }
            const value = sizeInput.value;
            Entry.do('objectUpdateSize', this.id, Entry.Utils.isNumber(value) ? value : this.entity.getSize());
        });


        coordinationView.appendChild(xCoordi);
        coordinationView.appendChild(xInput);
        coordinationView.appendChild(yCoordi);
        coordinationView.appendChild(yInput);
        coordinationView.appendChild(sizeSpan);
        coordinationView.appendChild(sizeInput);
        coordinationView.xInput_ = xInput;
        coordinationView.yInput_ = yInput;
        coordinationView.sizeInput_ = sizeInput;

        return coordinationView;
    }

    createRotationWrapperView() {
        const rotationWrapperView = Entry.createElement('div').addClass('entryObjectRotationWrapperWorkspace');

        const coordinationView = this.createCoordinationView();
        this.coordinateView_ = coordinationView;
        rotationWrapperView.appendChild(coordinationView);

        const rotateLabelWrapperView = this.createRotateLabelWrapperView();
        rotationWrapperView.appendChild(rotateLabelWrapperView);

        const rotationMethodWrapperView = this.createRotationMethodWrapperView();
        rotationWrapperView.appendChild(rotationMethodWrapperView);
        this.rotationMethodWrapper_ = rotationMethodWrapperView;

        return rotationWrapperView;
    }

    createInformationView() {
        const informationView = Entry.createElement('div').addClass('entryObjectInformationWorkspace');
        return informationView;
    }

    createDeleteView(exceptionsForMouseDown) {
        const deleteView = Entry.createElement('div').addClass('entryObjectDeleteWorkspace');
        exceptionsForMouseDown.push(deleteView);
        deleteView.bindOnClick((e) => {
            e.stopPropagation();
            if (Entry.engine.isState('run')) return;
            Entry.do('removeObject', this.id);
        });
        return deleteView;
    }

    createNameView() {
        const nameView = Entry.createElement('input').addClass('entryObjectNameWorkspace');
        nameView.bindOnClick((e) => {
            e.preventDefault();
            if(!this.focusable) {
                nameView.focus();
                nameView.select();
            }
        });

        nameView.onkeypress = Entry.Utils.whenEnter(() => {
            this.editObjectValues(false);
        });

        nameView.onfocus = Entry.Utils.setFocused;
        nameView.onblur = Entry.Utils.setBlurredTimer(() => {
            const object = Entry.container.getObject(this.id);
            if (!object) {
                return;
            }

            Entry.do('objectNameEdit', this.id, nameView.value);
        });

        nameView.value = this.name;
        return nameView;
    }

    createWrapperView() {
        const wrapperView = Entry.createElement('div').addClass('entryObjectWrapperWorkspace');

        const nameView = this.createNameView();
        wrapperView.appendChild(nameView);
        this.nameView_ = nameView;

        const informationView = this.createInformationView();
        wrapperView.appendChild(informationView);
        this.informationView_ = informationView;

        return wrapperView;
    }

    createThumbnailView() {
        return Entry.createElement('div').addClass('entryObjectThumbnailWorkspace');
    }

    createObjectInfoView() {
        const objectInfoView = Entry.createElement('ul').addClass('objectInfoView');
        if (!Entry.objectEditable) {
            objectInfoView.addClass('entryHide');
        }

        const objectInfo_visible = Entry.createElement('li').addClass('objectInfo_visible');
        if (!this.entity.getVisible()) objectInfo_visible.addClass('objectInfo_unvisible');

        objectInfo_visible.bindOnClick((e) => {
            if (Entry.engine.isState('run')) return;

            const entity = this.entity;
            const visible = entity.setVisible(!entity.getVisible());
            if (visible) objectInfo_visible.removeClass('objectInfo_unvisible');
            else objectInfo_visible.addClass('objectInfo_unvisible');
        });

        const objectInfo_lock = Entry.createElement('li').addClass('objectInfo_unlock');
        if (this.getLock()) {
            objectInfo_lock.addClass('objectInfo_lock');
        }

        objectInfo_lock.bindOnClick((e) => {
            if (Entry.engine.isState('run')) return;

            if (this.setLock(!this.getLock())) {
                objectInfo_lock.addClass('objectInfo_lock');
            } else objectInfo_lock.removeClass('objectInfo_lock');

            this.updateInputViews(this.getLock());
        });
        objectInfoView.appendChild(objectInfo_visible);
        objectInfoView.appendChild(objectInfo_lock);
        return objectInfoView;
    }

    createObjectView(objectId, exceptionsForMouseDown) {
        const objectView = Entry.createElement('li', objectId).addClass('entryContainerListElementWorkspace');
        const fragment = document.createDocumentFragment();
        fragment.appendChild(objectView);
        // generate context menu
        Entry.Utils.disableContextmenu(objectView);

        DomUtils.addEventListenerMultiple(objectView, 'mousedown touchstart', (e) => {
            const isFirstClick = !_.includes(this.view_.classList, 'selectedObject');

            if (Entry.container.getObject(objectId) && !_.includes(exceptionsForMouseDown, e.target)) {
                Entry.do('containerSelectObject', objectId);
                this.editObjectValues(false);
            }

            if (e.type === 'touchstart') {
                this.focusable = isFirstClick;
                e.preventDefault();
                e.eventFromEntryObject = true;
                Entry.documentMousedown.notify(e);

                const doc = $(document);
                const touchEvent = Entry.Utils.convertMouseEvent(e);
                let mouseDownCoordinate = { x: touchEvent.clientX, y: touchEvent.clientY };
                let longPressTimer = null;

                longPressTimer = setTimeout(() => {
                    if (longPressTimer) {
                        longPressTimer = null;
                        this._rightClick(e);
                    }
                }, 1000);

                doc.bind('mousemove.object touchmove.object', (e) => {
                    const touchEvent = Entry.Utils.convertMouseEvent(e);

                    const diff = Math.sqrt(
                        Math.pow(touchEvent.pageX - mouseDownCoordinate.x, 2) +
                        Math.pow(touchEvent.pageY - mouseDownCoordinate.y, 2));

                    if (diff > 5 && longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                });
                doc.bind('mouseup.object touchend.object', (e) => {
                    e.stopPropagation();
                    doc.unbind('.object');
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                });
            } else {
                if (isFirstClick) {
                    this.nameView_.focus();
                    this.nameView_.select();
                }

                if (Entry.Utils.isRightButton(e)) {
                    e.stopPropagation();
                    Entry.documentMousedown.notify(e);
                    this._rightClick(e);
                }
            }
        });

        return objectView;
    }

    generatePhoneView() {
        let thisPointer;
        const objectView = Entry.createElement('li', this.id);
        objectView.addClass('entryContainerListElementWorkspace');
        objectView.object = this;
        objectView.bindOnClick(function(e) {
            if (Entry.container.getObject(this.id)) Entry.container.selectObject(this.id);
        });

        // generate context menu
        if ($) {
            const object = this;
            context.attach('#' + this.id, [
                {
                    text: Lang.Workspace.context_rename,
                    href: '/',
                    action: function(e) {
                        e.preventDefault();
                    },
                },
                {
                    text: Lang.Workspace.context_duplicate,
                    href: '/',
                    action: function(e) {
                        e.preventDefault();
                        Entry.container.addCloneObject(object);
                    },
                },
                {
                    text: Lang.Workspace.context_remove,
                    href: '/',
                    action: function(e) {
                        e.preventDefault();
                        Entry.container.removeObject(object);
                    },
                },
            ]);
        }
        /** @type {!Element} */
        this.view_ = objectView;

        const objectInfoView = Entry.createElement('ul');
        objectInfoView.addClass('objectInfoView');
        const objectInfo_visible = Entry.createElement('li');
        objectInfo_visible.addClass('objectInfo_visible');
        const objectInfo_lock = Entry.createElement('li');
        objectInfo_lock.addClass('objectInfo_lock');
        objectInfoView.appendChild(objectInfo_visible);
        objectInfoView.appendChild(objectInfo_lock);
        this.view_.appendChild(objectInfoView);

        const thumbnailView = Entry.createElement('div');
        thumbnailView.addClass('entryObjectThumbnailWorkspace');
        this.view_.appendChild(thumbnailView);
        this.thumbnailView_ = thumbnailView;

        const wrapperView = Entry.createElement('div');
        wrapperView.addClass('entryObjectWrapperWorkspace');
        this.view_.appendChild(wrapperView);

        const nameView = Entry.createElement('input');
        nameView.addClass('entryObjectNameWorkspace');
        wrapperView.appendChild(nameView);
        this.nameView_ = nameView;
        this.nameView_.entryObject = this;
        this.nameView_.onblur = function() {
            this.entryObject.name = this.value;
            Entry.playground.reloadPlayground();
        };
        this.nameView_.onkeypress = function(e) {
            if (e.keyCode == 13) thisPointer.editObjectValues(false);
        };
        this.nameView_.value = this.name;

        if (Entry.objectEditable && Entry.objectDeletable) {
            const deleteView = Entry.createElement('div');
            deleteView.addClass('entryObjectDeletePhone');
            deleteView.object = this;
            this.deleteView_ = deleteView;
            this.view_.appendChild(deleteView);
            deleteView.bindOnClick(function(e) {
                if (Entry.engine.isState('run')) {
                    return;
                }

                Entry.container.removeObject(this.object);
            });
        }

        const editBtn = Entry.createElement('button');
        editBtn.addClass('entryObjectEditPhone');
        editBtn.object = this;
        editBtn.bindOnClick(function(e) {
            const object = Entry.container.getObject(this.id);
            if (object) {
                Entry.container.selectObject(object.id);
                Entry.playground.injectObject(object);
            }
        });
        this.view_.appendChild(editBtn);

        const informationView = Entry.createElement('div');
        informationView.addClass('entryObjectInformationWorkspace');
        informationView.object = this;
        wrapperView.appendChild(informationView);
        this.informationView_ = informationView;

        const rotateLabelWrapperView = Entry.createElement('div');
        rotateLabelWrapperView.addClass('entryObjectRotateLabelWrapperWorkspace');
        this.view_.appendChild(rotateLabelWrapperView);
        this.rotateLabelWrapperView_ = rotateLabelWrapperView;

        const rotateSpan = Entry.createElement('span');
        rotateSpan.addClass('entryObjectRotateSpanWorkspace');
        rotateSpan.innerHTML = Lang.Workspace.rotation + '';
        const rotateInput = Entry.createElement('input');
        rotateInput.addClass('entryObjectRotateInputWorkspace');
        this.rotateSpan_ = rotateSpan;
        this.rotateInput_ = rotateInput;

        const directionSpan = Entry.createElement('span');
        directionSpan.addClass('entryObjectDirectionSpanWorkspace');
        directionSpan.innerHTML = Lang.Workspace.direction + '';
        const directionInput = Entry.createElement('input');
        directionInput.addClass('entryObjectDirectionInputWorkspace');
        this.directionInput_ = directionInput;

        rotateLabelWrapperView.appendChild(rotateSpan);
        rotateLabelWrapperView.appendChild(rotateInput);
        rotateLabelWrapperView.appendChild(directionSpan);
        rotateLabelWrapperView.appendChild(directionInput);
        rotateLabelWrapperView.rotateInput_ = rotateInput;
        rotateLabelWrapperView.directionInput_ = directionInput;
        thisPointer = this;
        rotateInt.onkeypress = function(e) {
            if (e.keyCode == 13) {
                let value = rotateInput.value;
                if (value.indexOf('˚') != -1) value = value.substring(0, value.indexOf('˚'));
                if (Entry.Utils.isNumber(value)) {
                    thisPointer.entity.setRotation(Number(value));
                }
                thisPointer.updateRotationView();
                rotateInput.blur();
            }
        };
        rotateInt.onblur = function(e) {
            thisPointer.entity.setRotation(thisPointer.entity.getRotation());
            Entry.stage.updateObject();
        };
        directionInt.onkeypress = function(e) {
            if (e.keyCode == 13) {
                let value = directionInput.value;
                if (value.indexOf('˚') != -1) value = value.substring(0, value.indexOf('˚'));
                if (Entry.Utils.isNumber(value)) {
                    thisPointer.entity.setDirection(Number(value));
                }
                thisPointer.updateRotationView();
                directionInput.blur();
            }
        };
        directionInt.onblur = function(e) {
            thisPointer.entity.setDirection(thisPointer.entity.getDirection());
            Entry.stage.updateObject();
        };

        const rotationWrapperView = Entry.createElement('div');
        rotationWrapperView.addClass('entryObjectRotationWrapperWorkspace');
        rotationWrapperView.object = this;
        this.view_.appendChild(rotationWrapperView);

        const coordinateView = Entry.createElement('span');
        coordinateView.addClass('entryObjectCoordinateWorkspace');
        rotationWrapperView.appendChild(coordinateView);
        const xCoordi = Entry.createElement('span');
        xCoordi.addClass('entryObjectCoordinateSpanWorkspace');
        xCoordi.innerHTML = 'X';
        const xInput = Entry.createElement('input');
        xInput.addClass('entryObjectCoordinateInputWorkspace');
        const yCoordi = Entry.createElement('span');
        yCoordi.addClass('entryObjectCoordinateSpanWorkspace');
        yCoordi.innerHTML = 'Y';
        const yInput = Entry.createElement('input');
        yInput.addClass(
            'entryObjectCoordinateInputWorkspace entryObjectCoordinateInputWorkspace_right'
        );
        const sizeTitle = Entry.createElement('span');
        sizeTitle.addClass('entryObjectCoordinateSpanWorkspace');
        sizeTitle.innerHTML = Lang.Workspace.Size;
        const sizeInput = Entry.createElement('input');
        sizeInput.addClass(
            'entryObjectCoordinateInputWorkspace',
            'entryObjectCoordinateInputWorkspace_size'
        );
        coordinateView.appendChild(xCoordi);
        coordinateView.appendChild(xInput);
        coordinateView.appendChild(yCoordi);
        coordinateView.appendChild(yInput);
        coordinateView.appendChild(sizeTitle);
        coordinateView.appendChild(sizeInput);
        coordinateView.xInput_ = xInput;
        coordinateView.yInput_ = yInput;
        coordinateView.sizeInput_ = sizeInput;
        this.coordinateView_ = coordinateView;
        thisPointer = this;
        xInt.onkeypress = function(e) {
            if (e.keyCode == 13) {
                if (Entry.Utils.isNumber(xInput.value)) {
                    thisPointer.entity.setX(Number(xInput.value));
                }
                thisPointer.updateCoordinateView();
                thisPointer.blur();
            }
        };
        xInt.onblur = function(e) {
            thisPointer.entity.setX(thisPointer.entity.getX());
            Entry.stage.updateObject();
        };

        yInt.onkeypress = function(e) {
            if (e.keyCode == 13) {
                if (Entry.Utils.isNumber(yInput.value)) {
                    thisPointer.entity.setY(Number(yInput.value));
                }
                thisPointer.updateCoordinateView();
                thisPointer.blur();
            }
        };
        yInt.onblur = function(e) {
            thisPointer.entity.setY(thisPointer.entity.getY());
            Entry.stage.updateObject();
        };

        const rotationMethodWrapper = Entry.createElement('div');
        rotationMethodWrapper.addClass('rotationMethodWrapper');
        rotationWrapperView.appendChild(rotationMethodWrapper);
        this.rotationMethodWrapper_ = rotationMethodWrapper;

        const rotateMethodLabelView = Entry.createElement('span');
        rotateMethodLabelView.addClass('entryObjectRotateMethodLabelWorkspace');
        rotationMethodWrapper.appendChild(rotateMethodLabelView);
        rotateMethodLabelView.innerHTML = Lang.Workspace.rotate_method + ' : ';

        const rotateModeAView = Entry.createElement('div');
        rotateModeAView.addClass('entryObjectRotateModeWorkspace');
        rotateModeAView.addClass('entryObjectRotateModeAWorkspace');
        rotateModeAView.object = this;
        this.rotateModeAView_ = rotateModeAView;
        rotationMethodWrapper.appendChild(rotateModeAView);
        rotateModeAView.bindOnClick(function(e) {
            if (Entry.engine.isState('run')) {
                return;
            }
            this.object.setRotateMethod('free');
        });

        const rotateModeBView = Entry.createElement('div');
        rotateModeBView.addClass('entryObjectRotateModeWorkspace');
        rotateModeBView.addClass('entryObjectRotateModeBWorkspace');
        rotateModeBView.object = this;
        this.rotateModeBView_ = rotateModeBView;
        rotationMethodWrapper.appendChild(rotateModeBView);
        rotateModeBView.bindOnClick(function(e) {
            if (Entry.engine.isState('run')) {
                return;
            }
            this.object.setRotateMethod('vertical');
        });

        const rotateModeCView = Entry.createElement('div');
        rotateModeCView.addClass('entryObjectRotateModeWorkspace');
        rotateModeCView.addClass('entryObjectRotateModeCWorkspace');
        rotateModeCView.object = this;
        this.rotateModeCView_ = rotateModeCView;
        rotationMethodWrapper.appendChild(rotateModeCView);
        rotateModeCView.bindOnClick(function(e) {
            if (Entry.engine.isState('run')) return;
            this.object.setRotateMethod('none');
        });

        this.updateThumbnailView();
        this.updateCoordinateView();
        this.updateRotateMethodView();

        this.updateInputViews();
        return this.view_;
    }

    _getRotateView(type = 'free') {
        if (type === 'free') {
            return this.rotateModeAView_;
        } else if (type === 'none') {
            return this.rotateModeCView_;
        } else {
            return this.rotateModeBView_;
        }
    }

    getIndex() {
        return Entry.container.getObjectIndex(this.id);
    }

    _whenRotateEditable(func, obj) {
        return Entry.Utils.when(function() {
            return !(Entry.engine.isState('run') || obj.getLock());

        }, func);
    }
};
