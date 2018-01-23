/**
 * Stage is object to handle canvas
 * @fileoverview This manage canvas
 *
*/
'use strict';

goog.require('Entry.Utils');

/**
 * class for a canvas
 * @constructor
 */
Entry.Stage = function() {
    /** @type {Dictionary} */
    this.variables = {};
    this.background = new createjs.Shape();
    this.background.graphics.beginFill("#ffffff").drawRect(-480, -240, 960, 480);
    this.objectContainers = [];
    this.selectedObjectContainer = null;
    this.variableContainer = new createjs.Container();
    this.dialogContainer = new createjs.Container();
    /** @type {null|Entry.EntryObject} */
    this.selectedObject = null;
    this.isObjectClick = false;
    this._entitySelectable = true;
};

/**
 * initialize stage with canvas
 * @param {!Element} canvas for stage
 */
Entry.Stage.prototype.initStage = function(canvas) {
    this.canvas = new createjs.Stage(canvas.id);
    this.canvas.x = 960/1.5/2;
    this.canvas.y = 540/1.5/2;
    this.canvas.scaleX = this.canvas.scaleY = 2 / 1.5;
    createjs.Touch.enable(this.canvas);
    this.canvas.enableMouseOver(10);
    this.canvas.mouseMoveOutside = true;
    this.canvas.addChild(this.background);
    this.canvas.addChild(this.variableContainer);
    this.canvas.addChild(this.dialogContainer);
    this.inputField = null;
    this.initCoordinator();
    this.initHandle();
    this.mouseCoordinate = {x: 0, y: 0};

    if (Entry.isPhone()) {
        canvas.ontouchstart =  function(e){
            Entry.dispatchEvent('canvasClick',e);
            Entry.stage.isClick = true;
        };
        canvas.ontouchend = function(e){
            Entry.stage.isClick = false;
            Entry.dispatchEvent('canvasClickCanceled', e);
        };
    } else {
        var downFunc = function(e){
            Entry.dispatchEvent('canvasClick',e);
            Entry.stage.isClick = true;
        };

        canvas.onmousedown = downFunc;
        canvas.ontouchstart = downFunc;

        var upFunc = function(e){
            Entry.stage.isClick = false;
            Entry.dispatchEvent('canvasClickCanceled', e);
        };

        canvas.onmouseup = upFunc;
        canvas.ontouchend = upFunc;


        $(document).click(function(event) {
            if (event.target.id === 'entryCanvas')
                Entry.stage.focused = true;
            else
                Entry.stage.focused = false;
        });
    }
    //this.canvas.on('pressup', function(e){
        //Entry.dispatchEvent('canvasClickCanceled', e);
    //});
    Entry.addEventListener('canvasClick', function(e){
//      if (!Entry.stage.isObjectClick && Entry.type == 'workspace')
//          Entry.container.selectObject();
        Entry.stage.isObjectClick = false;
    });
    
    Entry.addEventListener("loadComplete", function() {
        this.sortZorder();
    }.bind(this));

    Entry.windowResized.attach(this, function() {
        Entry.stage.updateBoundRect();
    });

    var razyScroll = _.debounce(function () {
        Entry.windowResized.notify();
    }, 200);

    $(window).scroll(function() {
        window.requestAnimationFrame(function () {
            razyScroll();
        });
    });

    var moveFunc = function(e){
        e.preventDefault();
        e = Entry.Utils.convertMouseEvent(e);
        var roundRect = Entry.stage.getBoundRect();
        var scrollPos = Entry.Utils.getScrollPos();
        var x = ((e.pageX - roundRect.left - scrollPos.left) / roundRect.width - 0.5) * 480;
        var y = ((e.pageY - roundRect.top - scrollPos.top) / roundRect.height - 0.5) * -270;

        this.mouseCoordinate = {
            x: Entry.Utils.toFixed(x),
            y: Entry.Utils.toFixed(y)
        };
        Entry.dispatchEvent('stageMouseMove');
    }.bind(this);

    canvas.onmousemove = moveFunc;
    canvas.ontouchmove = moveFunc;

    canvas.onmouseout = function(e) {
        Entry.dispatchEvent('stageMouseOut');
    };

    Entry.addEventListener('updateObject', updateObjectFunc);

    Entry.addEventListener('run', function(e){
        Entry.removeEventListener('updateObject', updateObjectFunc);
    });

    Entry.addEventListener('stop', function(e){
        Entry.addEventListener('updateObject', updateObjectFunc);
    });


    var updateObjectFunc = function(e) {
        if (Entry.engine.isState('stop'))
            Entry.stage.updateObject();
    };

    Entry.addEventListener('canvasInputComplete', function (e){
        try {
            var inputValue = Entry.stage.inputField.value();
            Entry.stage.hideInputField();
            if (inputValue) {
                (function (c){
                    c.setInputValue(inputValue);
                    c.inputValue.complete = true;
                })(Entry.container);
            }
        } catch (exception) {}
    });


    this.initWall();

    this.render();
};

Entry.Stage.prototype.render = function() {
    if (Entry.stage.timer)
        clearTimeout(Entry.stage.timer);
    var time = new Date().getTime();
    Entry.stage.update();
    time = new Date().getTime() - time;
    Entry.stage.timer = setTimeout(
        Entry.stage.render, 16 - time % 16 + 16 * Math.floor(time / 16));
};

/**
 * redraw canvas
 */
Entry.Stage.prototype.update = function() {
    if (Entry.type === "invisible")
        return;
    if (!Entry.requestUpdate) {
        Entry.requestUpdate = false;
        return;
    }
    if (Entry.engine.isState('stop') && this.objectUpdated) {
        this.canvas.update();
        this.objectUpdated = false;
    } else {
        this.canvas.update();
    }
    var inputField = this.inputField;
    if (inputField && !inputField._isHidden)
        inputField.render();
    if (Entry.requestUpdateTwice)
        Entry.requestUpdateTwice = false;
    else Entry.requestUpdate = false;
};

/**
 * add object entity on canvas
 * @param {Entry.EntryObject} object
 */
Entry.Stage.prototype.loadObject = function(object) {
    var entity = object.entity.object;
    var scenes = Entry.scene.scenes_;
    var objContainer = this.getObjectContainerByScene(object.scene);
    objContainer.addChild(entity);
    Entry.requestUpdate = true;
};

/**
 * add entity directly on canvas
 * This is use for cloned entity
 * @param {Entry.EntityObject} entity
 */
Entry.Stage.prototype.loadEntity = function(entity, index) {
    var scene = entity.parent.scene;
    var objContainer = Entry.stage.getObjectContainerByScene(scene);
    if (index > -1)
        objContainer.addChildAt(entity.object, index);
    else
        objContainer.addChild(entity.object);
    Entry.requestUpdate = true;
};

/**
 * Remove entity directly on canvas
 * @param {Entry.EntityObject} entity
 */
Entry.Stage.prototype.unloadEntity = function(entity) {
    var scene = entity.parent.scene;
    Entry.stage.getObjectContainerByScene(scene).removeChild(entity.object);
    Entry.requestUpdate = true;
};

/**
 * add variable view on canvas
 * @param {Entry.Variable} object
 */
Entry.Stage.prototype.loadVariable = function(variable) {
    var variableView = variable.view_;
    this.variables[variable.id] = variableView;
    this.variableContainer.addChild(variableView);
    Entry.requestUpdate = true;
};

/**
 * remove variable view on canvas
 * @param {Entry.Variable} object
 */
Entry.Stage.prototype.removeVariable = function(variable) {
    var variableView = variable.view_;
    this.variableContainer.removeChild(variableView);
    Entry.requestUpdate = true;
};

/**
 * add dialog on canvas
 * @param {Entry.Dialog} dialog
 */
Entry.Stage.prototype.loadDialog = function(dialog) {
    this.dialogContainer.addChild(dialog.object);
};

/**
 * Remove entity directly on canvas
 * @param {Entry.Dialog} dialog
 */
Entry.Stage.prototype.unloadDialog = function(dialog) {
    this.dialogContainer.removeChild(dialog.object);
};

Entry.Stage.prototype.setEntityIndex = function(entity, index) {
    var selectedObjectContainer = Entry.stage.selectedObjectContainer;
    var currentIndex = selectedObjectContainer.getChildIndex(entity.object);
    
    if (currentIndex === index) {
        return;
    } else if (currentIndex > index) {
        selectedObjectContainer.setChildIndex(entity.object, index);
    } else {
        selectedObjectContainer.setChildIndex(entity.object, index);
    }
    Entry.requestUpdate = true;
};

/**
 * sort Z index of objects
 */
Entry.Stage.prototype.sortZorder = function() {
    var objects = Entry.container.getCurrentObjects().slice(),
        length = objects.length,
        container = this.selectedObjectContainer,
        index = 0;

    for (var i=length-1; i>=0; i--) {
        var object = objects[i];

        object.clonedEntities.forEach(function(ce) {
            if (ce._index === undefined) {
                ce.shape && container.setChildIndex(ce.shape, index++);

                ce._index = index;
                container.setChildIndex(ce.object, index++);
            } else {
                index++;
                ce.shape && index++;
            }
        });

        var entity = object.entity;
        entity.shape && container.setChildIndex(entity.shape, index++);
        container.setChildIndex(entity.object, index++);
    }

    Entry.requestUpdate = true;
};

/**
 * sort Z index of objects while running
 */
Entry.Stage.prototype.sortZorderRun = function() {
    Entry.requestUpdate = true;
};

/**
 * Initialize coordinate on canvas. It is toggle by Engine.
 */
Entry.Stage.prototype.initCoordinator = function() {
    var coordinator = new createjs.Container();
    var img = new createjs.Bitmap(Entry.mediaFilePath + "workspace_coordinate.png");
    img.scaleX = 0.5;
    img.scaleY = 0.5;
    img.x = -240;
    img.y = -135;
    coordinator.mouseEnabled = false;
    coordinator.tickEnabled = false;
    coordinator.tickChildren = false;
    coordinator.visible = false;
    coordinator.addChild(img);

    this.canvas.addChild(coordinator);

    /** @type {createjs.Container} */
    this.coordinator = coordinator;
};

/**
 * Toggle coordinator
 */
Entry.Stage.prototype.toggleCoordinator = function() {
    this.coordinator.visible = !this.coordinator.visible;
    Entry.requestUpdate = true;
};

/**
 * Select handle object
 * @param {?Entry.EntryObject} object
 */
Entry.Stage.prototype.selectObject = function(object) {
    //todo
    if (!object)
        this.selectedObject = null;
    else
        this.selectedObject = object;
    this.updateObject();
};

/**
 * Initialize handle. Handle is use for transform object on canvas.
 */
Entry.Stage.prototype.initHandle = function() {
    this.handle = new EaselHandle(this.canvas);
    this.handle.setChangeListener(this, this.updateHandle);
    this.handle.setEditStartListener(this, this.startEdit);
    this.handle.setEditEndListener(this, this.endEdit);
};

/**
 * Update handle object to modified object
 * object -> handle
 */
Entry.Stage.prototype.updateObject = function() {
    if (Entry.type === "invisible")
        return;
    Entry.requestUpdate = true;
    this.handle.setDraggable(true);
    if (this.editEntity)
        return;
    var object = this.selectedObject;
    if (object) {
        if (object.objectType == "textBox"){
            this.handle.toggleCenter(false);
        } else {
            this.handle.toggleCenter(true);
        }
        var rotateMethod = object.getRotateMethod();
        if (rotateMethod == "free") {
            this.handle.toggleRotation(true);
            this.handle.toggleDirection(true);
        } else if (rotateMethod == "vertical") {
            this.handle.toggleRotation(false);
            this.handle.toggleDirection(true);
        } else {
            this.handle.toggleRotation(false);
            this.handle.toggleDirection(true);
        }
        if (object.getLock()) {
            this.handle.toggleRotation(false);
            this.handle.toggleDirection(false);
            this.handle.toggleResize(false);
            this.handle.toggleCenter(false);
            this.handle.setDraggable(false);
        } else {
            this.handle.toggleResize(true);
        }
        this.handle.setVisible(true);
        var entity = object.entity;
        this.handle.setWidth(entity.getScaleX() * entity.getWidth());
        this.handle.setHeight(entity.getScaleY() * entity.getHeight());
        var regX, regY;
        if (entity.type == "textBox") {
            // maybe 0.
            if (entity.getLineBreak()) {
                regX = (entity.regX) * entity.scaleX;
                regY = (- entity.regY) * entity.scaleY;
            } else {
                var fontAlign = entity.getTextAlign();
                regY = (- entity.regY) * entity.scaleY;
                switch (fontAlign) {
                    case Entry.TEXT_ALIGN_LEFT:
                        regX = - entity.getWidth() / 2 * entity.scaleX;
                        break;
                    case Entry.TEXT_ALIGN_CENTER:
                        regX = (entity.regX) * entity.scaleX;
                        break;
                    case Entry.TEXT_ALIGN_RIGHT:
                        regX = entity.getWidth() / 2 * entity.scaleX;
                        break;
                }
            }
        } else {
            regX = (entity.regX - entity.width / 2) * entity.scaleX;
            regY = (entity.height / 2 - entity.regY) * entity.scaleY;
        }

        var rotation = entity.getRotation() / 180 * Math.PI;

        this.handle.setX(entity.getX() -
                        regX * Math.cos(rotation) -
                        regY * Math.sin(rotation));
        this.handle.setY(-entity.getY() -
                        regX * Math.sin(rotation) +
                        regY * Math.cos(rotation));
        this.handle.setRegX((entity.regX - entity.width / 2) * entity.scaleX);
        this.handle.setRegY((entity.regY - entity.height / 2) * entity.scaleY);
        this.handle.setRotation(entity.getRotation());
        this.handle.setDirection(entity.getDirection());
        this.objectUpdated = true;


        this.handle.setVisible(object.entity.getVisible());
        if(object.entity.getVisible()) {
            this.handle.render();
        }
    } else {
        this.handle.setVisible(false);
    }
    //this.toggleHandleEditable(!object.getLock());
};

// handle -> object
Entry.Stage.prototype.updateHandle = function() {
    this.editEntity = true;
    var handle = this.handle;
    var entity = this.selectedObject.entity;
    if (entity.lineBreak) {
        entity.setHeight(handle.height / entity.getScaleY());
        entity.setWidth(handle.width / entity.getScaleX());
    } else {
        if (entity.width !== 0) {
            var scaleX = Math.abs(handle.width/entity.width);
            if (entity.flip) scaleX *= -1;

            entity.setScaleX(scaleX);
        }

        if (entity.height !== 0)
            entity.setScaleY(handle.height/entity.height);
    }
    var direction = handle.rotation / 180 * Math.PI;
    if (entity.type == "textBox") {
        entity.syncFont();
        var newRegX = handle.regX / entity.scaleX;
        var newRegY = handle.regY / entity.scaleY;

        if (entity.getLineBreak()) {
            entity.setX(handle.x);
            entity.setY(-handle.y);
        } else {
            switch (entity.getTextAlign()) {
                case Entry.TEXT_ALIGN_LEFT:
                    entity.setX(handle.x -
                                handle.width / 2 * Math.cos(direction));
                    entity.setY(-handle.y +
                                handle.width / 2 * Math.sin(direction));
                    break;
                case Entry.TEXT_ALIGN_CENTER:
                    entity.setX(handle.x);
                    entity.setY(-handle.y);
                    break;
                case Entry.TEXT_ALIGN_RIGHT:
                    entity.setX(handle.x +
                                handle.width / 2 * Math.cos(direction));
                    entity.setY(-handle.y -
                                handle.width / 2 * Math.sin(direction));
                    break;
            }
        }
    } else {
        var newRegX = entity.width/2 + handle.regX / entity.scaleX;
        entity.setX(handle.x +
                    handle.regX * Math.cos(direction) -
                    handle.regY * Math.sin(direction));
        entity.setRegX(newRegX);
        var newRegY = entity.height/2 + handle.regY / entity.scaleY;
        entity.setY(-handle.y -
                    handle.regX * Math.sin(direction) -
                    handle.regY * Math.cos(direction));
        entity.setRegY(newRegY);
    }
    entity.setDirection(handle.direction);
    entity.setRotation(handle.rotation);
    this.selectedObject.entity.doCommand();
    this.editEntity = false;
};

Entry.Stage.prototype.startEdit = function () {
    var obj = this.selectedObject;
    obj && obj.entity.initCommand();
};

Entry.Stage.prototype.endEdit = function () {
    this.selectedObject.entity.checkCommand();
};

Entry.Stage.prototype.initWall = function () {
    var wall = new createjs.Container();
    wall.mouseEnabled = false;
    var bound = new Image();
    bound.src = Entry.mediaFilePath + "media/bound.png";
    wall.up = new createjs.Bitmap();
    wall.up.scaleX = 480/30;
    wall.up.y = - 135 - 30;
    wall.up.x = - 240;
    wall.up.image = bound;
    wall.addChild(wall.up);
    wall.down = new createjs.Bitmap();
    wall.down.scaleX = 480/30;
    wall.down.y = 135;
    wall.down.x = - 240;
    wall.down.image = bound;
    wall.addChild(wall.down);
    wall.right = new createjs.Bitmap();
    wall.right.scaleY = 270/30;
    wall.right.y = -135;
    wall.right.x = 240;
    wall.right.image = bound;
    wall.addChild(wall.right);
    wall.left = new createjs.Bitmap();
    wall.left.scaleY = 270/30;
    wall.left.y = -135;
    wall.left.x = - 240 - 30;
    wall.left.image = bound;
    wall.addChild(wall.left);
    this.canvas.addChild(wall);
    this.wall = wall;
};

/**
 * show inputfield from the canvas
 */
Entry.Stage.prototype.showInputField = function () {
    if (!this.inputField) {
        var scale = 1/1.5;
        this.inputField = new CanvasInput({
            canvas: document.getElementById('entryCanvas'),
            fontSize: 30 * scale,
            fontFamily: 'NanumGothic',
            fontColor: '#212121',
            width: Math.round(556 * scale),
            height: 26 * scale,
            padding: 8 * scale,
            borderWidth: 1 * scale,
            borderColor: '#000',
            borderRadius: 3,
            boxShadow: 'none',
            innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
            x: 202 * scale,
            y: 450 * scale,
            topPosition: true,
            onsubmit: function() {
                Entry.dispatchEvent('canvasInputComplete');
            }
        });
    }

    var inputSubmitButton = new createjs.Container();
    var buttonImg = new Image();
    var button = new createjs.Bitmap();
    buttonImg.onload = function() {
        button.image = this;
        Entry.requestUpdate = true;
    };
    buttonImg.src = Entry.mediaFilePath + "confirm_button.png";
    button.scaleX = 0.23;
    button.scaleY = 0.23;
    button.x = 160;
    button.y = 89;
    button.cursor = 'pointer';
    button.image = buttonImg;
    inputSubmitButton.addChild(button);

    inputSubmitButton.on("mousedown", function(evt) {
        Entry.dispatchEvent('canvasInputComplete');
    });

    if (!this.inputSubmitButton) {
        this.inputField.value('');
        this.canvas.addChild(inputSubmitButton);
        this.inputSubmitButton = inputSubmitButton;
    }

    this.inputField.show();
    Entry.requestUpdateTwice = true;
};


/**
 * remove inputfield from the canvas
 */
Entry.Stage.prototype.hideInputField = function () {
    if (this.inputField && this.inputField.value())
        this.inputField.value('');

    if (this.inputSubmitButton) {
        this.canvas.removeChild(this.inputSubmitButton);
        this.inputSubmitButton = null;
    }

    if (this.inputField)
        this.inputField.hide();
    Entry.requestUpdate = true;
};


/**
 * init object containers
 */
Entry.Stage.prototype.initObjectContainers = function() {
    var scenes = Entry.scene.scenes_;
    if (scenes && scenes.length !== 0) {
        for (var i = 0; i < scenes.length; i++) {
            this.objectContainers[i] = this.createObjectContainer(scenes[i]);
        }
        this.selectedObjectContainer = this.objectContainers[0];
    } else {
        var obj = this.createObjectContainer(Entry.scene.selectedScene);
        this.objectContainers.push(obj);
        this.selectedObjectContainer = obj;
    }
    if (Entry.type !== "invisible")
        this.canvas.addChild(this.selectedObjectContainer);
    this.selectObjectContainer(Entry.scene.selectedScene);
};

/**
 * select object container by scene
 * @param {Entry.Scene} scene
 */
Entry.Stage.prototype.selectObjectContainer = function(scene) {
    var containers = this.objectContainers;
    var canvas = this.canvas;
    if (!canvas || !containers || !containers.length)
        return;

    containers.forEach(function(c) { canvas.removeChild(c); });

    this.selectedObjectContainer =
        this.getObjectContainerByScene(scene);

    canvas.addChildAt(this.selectedObjectContainer, 2);
};

/**
 * init object containers
 */
Entry.Stage.prototype.createObjectContainer = function(scene) {
    var obj = new createjs.Container();
    obj.scene = scene;
    return obj;
};

/**
 * remove object container
 * @param {scene model} scene
 */
Entry.Stage.prototype.removeObjectContainer = function(scene) {
    var containers = this.objectContainers;
    var objContainer = this.getObjectContainerByScene(scene);
    this.canvas && this.canvas.removeChild(objContainer);
    containers.splice(this.objectContainers.indexOf(objContainer),1);
};

/**
 * get object container
 * @param {scene model} scene
 */
Entry.Stage.prototype.getObjectContainerByScene = function(scene) {
    var containers = this.objectContainers;

    for (var i = 0; i < containers.length; i++) {
        if (containers[i].scene.id == scene.id)
            return containers[i];
    }
};

Entry.Stage.prototype.moveSprite = function (e) {
    if (!this.selectedObject || !Entry.stage.focused || this.selectedObject.getLock())
        return;

    var distance = 5;
    if (e.shiftKey)
        distance = 1;

    var entity = this.selectedObject.entity;
    switch (e.keyCode) {
        case 38: //up
            entity.setY(entity.getY() + distance);
            break;
        case 40: //down
            entity.setY(entity.getY() - distance);
            break;
        case 37: //left
            entity.setX(entity.getX() - distance);
            break;
        case 39: //right
            entity.setX(entity.getX() + distance);
            break;
    }
    this.updateObject();
};

Entry.Stage.prototype.getBoundRect = function (e) {
    if (!this._boundRect)
        return this.updateBoundRect();
    return this._boundRect;
};

Entry.Stage.prototype.updateBoundRect = function (e) {
    return this._boundRect = this.canvas.canvas.getBoundingClientRect();
};

Entry.Stage.prototype.getDom = function(query) {
    var key = query.shift();
    if (key === "canvas")
        return this.canvas.canvas;
};

Entry.Stage.prototype.setEntitySelectable = function(value) {
    this._entitySelectable = value;
};

Entry.Stage.prototype.isEntitySelectable = function() {
    return Entry.engine.isState('stop') && this._entitySelectable;
};
