"use strict";

goog.provide("Entry");

Entry = {};

Entry.block = {};

Entry.TEXT_ALIGN_CENTER = 0;

Entry.TEXT_ALIGN_LEFT = 1;

Entry.TEXT_ALIGN_RIGHT = 2;

Entry.TEXT_ALIGNS = ["center", "left", "right"];

Entry.clipboard = null;

/**
 * Load project
 * @param {?Project} project
 */
Entry.loadProject = function(project) {
    if (!project) {
        project = Entry.getStartProject(Entry.mediaFilePath);
    }

    if (this.type == 'workspace')
        Entry.stateManager.startIgnore();
    Entry.projectId = project._id;
    Entry.variableContainer.setVariables(project.variables);
    Entry.variableContainer.setMessages(project.messages);
    Entry.scene.addScenes(project.scenes);
    Entry.stage.initObjectContainers();
    Entry.variableContainer.setFunctions(project.functions);
    Entry.container.setObjects(project.objects);
    Entry.FPS = project.speed ? project.speed : 60;
    createjs.Ticker.setFPS(Entry.FPS);
    if (this.type == 'workspace') {
        setTimeout(function() {
            Entry.stateManager.endIgnore();
        }, 300);

    }

    if (!Entry.engine.projectTimer)
        Entry.variableContainer.generateTimer();

    if (Object.keys(Entry.container.inputValue).length === 0)
        Entry.variableContainer.generateAnswer();
    Entry.start();
    return project;
};

/**
 * Export project
 * @param {?Project} project
 */
Entry.exportProject = function(project) {
    if (!project) project = {};

    if (!Entry.engine.isState('stop'))
        Entry.engine.toggleStop();

    if (Entry.Func &&
        Entry.Func.workspace &&
        Entry.Func.workspace.visible ) {
        Entry.Func.cancelEdit();
    }

    //Entry.stage.handle.setVisible(false);
    //Entry.stage.update();

    project.objects = Entry.container.toJSON();
    project.scenes = Entry.scene.toJSON();
    project.variables = Entry.variableContainer.getVariableJSON();
    project.messages = Entry.variableContainer.getMessageJSON();
    project.functions = Entry.variableContainer.getFunctionJSON();
    project.scenes = Entry.scene.toJSON();
    project.speed = Entry.FPS;
    return project;
};

/**
 * inject blocks to Entry menu.
 * Available block is different by object type.
 * @param {!string} objectType
 * @param {!string} blockText
 */
Entry.setBlockByText = function(objectType, blockText) {
    var blockJSON = [];
    var xml = jQuery.parseXML(blockText);
    var categories = xml.getElementsByTagName('category');
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        var json = {category: category.getAttribute("id"), blocks: []};
        var blocks = category.childNodes;
        for (var j = 0; j < blocks.length; j++) {
            var b = blocks[j];
            if (b.tagName &&
                (b.tagName.toUpperCase() == 'BLOCK' ||
                 b.tagName.toUpperCase() == 'BTN')) {
                json.blocks.push(b.getAttribute('type'));
            }
        }
        blockJSON.push(json);
    }
    Entry.playground.setBlockMenu(blockJSON);
};

/**
 * inject blocks to Entry menu.
 * Available block is different by object type.
 * @param {!string} objectType
 * @param {!xml} XML
 */
Entry.setBlock = function(objectType, XML) {
    Entry.playground.setMenuBlock(objectType, XML);
};

Entry.enableArduino = function() {
    return;
    //$.ajax('http://localhost:23518/arduino/')
        //.done(function(data){
            //var xmlHttp = new XMLHttpRequest();
            //xmlHttp.open( "GET", '/xml/arduino_blocks.xml', false );
            //xmlHttp.send('');
            //if (!Entry.playground.menuBlocks_.sprite.getElementById("arduino")) {
                //Entry.setBlockByText('arduino', xmlHttp.responseText);
                //Entry.playground.currentObjectType = '';
                //Entry.playground.setMenu(Entry.playground.object.objectType);
            //}
            //Entry.toast.success(Lang.Workspace.arduino_connect, Lang.Workspace.arduino_connect_success, false);
        //}).fail(function(){
    //});
};

/**
 * initialize sound
 * @param {sound object} sound
 */
Entry.initSound = function(sound) {
    if (sound.fileurl) {
        sound.path = sound.fileurl;
    } else {
        sound.path = Entry.defaultPath + '/uploads/' + sound.filename.substring(0,2)+'/'+
            sound.filename.substring(2,4)+'/'+sound.filename+sound.ext;
        //createjs.Sound.removeSound(path);
        //createjs.Sound.registerSound(path, sound.id, 4);
    }
    Entry.soundQueue.loadFile({
        id: sound.id,
        src: sound.path,
        type: createjs.LoadQueue.SOUND
    });
};

/**
 * This method is called when window closed;
 * @param {event} e
 */
Entry.beforeUnload = function(e) {
    Entry.hw.closeConnection();
    Entry.variableContainer.updateCloudVariables();
    if (Entry.type == 'workspace') {
        if (localStorage && Entry.interfaceState) {
            localStorage.setItem('workspace-interface',
                                 JSON.stringify(Entry.interfaceState));
        }
        if (!Entry.stateManager.isSaved())
            return Lang.Workspace.project_changed;
    }
};

/**
 * load interface state by localstorage
 */
Entry.loadInterfaceState = function() {
    if (Entry.type == 'workspace') {
        if (localStorage &&
            localStorage.getItem('workspace-interface')) {
            var interfaceModel = localStorage.getItem('workspace-interface');
            this.resizeElement(JSON.parse(interfaceModel));
        } else {
            this.resizeElement({
                menuWidth: 280,
                canvasWidth: 480
            });
        }
    }
};

/**
 * Resize element's size.
 * @param {!json} interfaceModel
 */
Entry.resizeElement = function(interfaceModel) {
    if (Entry.type == 'workspace') {
        var interfaceState = this.interfaceState;
        if (!interfaceModel.canvasWidth && interfaceState.canvasWidth)
            interfaceModel.canvasWidth = interfaceState.canvasWidth;
        if (!interfaceModel.menuWidth &&
            this.interfaceState.menuWidth)
            interfaceModel.menuWidth = interfaceState.menuWidth;

        if (Entry.engine.speedPanelOn)
            Entry.engine.toggleSpeedPanel();

        var canvasSize = interfaceModel.canvasWidth;
        if (!canvasSize)            canvasSize = 400;
        else if (canvasSize < 325)  canvasSize = 325;
        else if (canvasSize > 720)  canvasSize = 720;
        interfaceModel.canvasWidth = canvasSize;

        var canvasHeight = canvasSize*9/16;

        Entry.engine.view_.style.width = canvasSize + 'px';
        Entry.engine.view_.style.height = canvasHeight + 'px';
        Entry.engine.view_.style.top = '40px';
        Entry.stage.canvas.canvas.style.width = canvasSize + 'px';
        if (canvasSize >= 400) {
            Entry.engine.view_.removeClass("collapsed");
        } else {
            Entry.engine.view_.addClass("collapsed");
        }
        Entry.playground.view_.style.left = (canvasSize + 0.5) + 'px';

        var addButton = Entry.engine.view_.getElementsByClassName('entryAddButtonWorkspace_w')[0];
        if (addButton) {
            if (Entry.objectAddable) {
                /*addButton.style.top = (canvasHeight + 24 + 40 + 4) + 'px';*/
                addButton.style.top = (canvasHeight + 24) + 'px';
                addButton.style.width = (canvasSize * 0.7) + 'px';
            } else {
                addButton.style.display = 'none';
            }
        }

        var runButton = Entry.engine.view_.getElementsByClassName('entryRunButtonWorkspace_w')[0];
        if (runButton) {
            if (Entry.objectAddable) {
                /*runButton.style.top = (canvasHeight + 24 + 40 + 4) + 'px';*/
                runButton.style.top = (canvasHeight + 24) + 'px';
                runButton.style.left = (canvasSize * 0.7) + 'px';
                runButton.style.width = (canvasSize * 0.3) + 'px';
            } else {
                runButton.style.left = '2px';
                /*runButton.style.top = (canvasHeight + 24 + 40 + 4) + 'px';*/
                runButton.style.top = (canvasHeight + 24) + 'px';
                runButton.style.width = (canvasSize - 4) + 'px';
            }
        }

        var stopButton = Entry.engine.view_.getElementsByClassName('entryStopButtonWorkspace_w')[0];
        if (stopButton) {
            if (Entry.objectAddable) {
                /*stopButton.style.top = (canvasHeight + 24 + 40 + 4) + 'px';*/
                stopButton.style.top = (canvasHeight + 24) + 'px';
                stopButton.style.left = (canvasSize * 0.7) + 'px';
                stopButton.style.width = (canvasSize * 0.3) + 'px';
                //console.log('runButton top,left = ' + runButton.style.top + ',' + runButton.style.left);
            } else {
                stopButton.style.left = '2px';
                /*stopButton.style.top = (canvasHeight + 24 + 40 + 4) + 'px';*/
                stopButton.style.top = (canvasHeight + 24) + 'px';
                stopButton.style.width = (canvasSize) + 'px';
            }
        }

        var menuWidth = interfaceModel.menuWidth;
        if (!menuWidth) menuWidth = 264;
        else if (menuWidth < 244)
            menuWidth = 244;
        else if (menuWidth > 400)
            menuWidth = 400;
        interfaceModel.menuWidth = menuWidth;

        $('.blockMenuContainer').css({width: (menuWidth - 64) + 'px'});
        $('.blockMenuContainer>svg').css({width: (menuWidth - 64) + 'px'});
        Entry.playground.mainWorkspace.blockMenu.setWidth();
        $('.entryWorkspaceBoard').css({left: (menuWidth) + 'px'});
        Entry.playground.resizeHandle_.style.left = (menuWidth) + 'px';
        Entry.playground.variableViewWrapper_.style.width = menuWidth + 'px';

        this.interfaceState = interfaceModel;
    }
    Entry.windowResized.notify(canvasSize);
};

/**
 * @return {Number} return up time time stamp
 */
Entry.getUpTime = function() {
    return new Date().getTime() - this.startTime;
};

/**
 * @param {String} activityType
 */
Entry.addActivity = function(activityType) {
    if (Entry.stateManager)
        Entry.stateManager.addActivity(activityType);
};

Entry.startActivityLogging = function() {
    if (Entry.reporter)
        Entry.reporter.start(
            Entry.projectId,
            window.user ? window.user._id : null,
            Entry.startTime);
};

/**
 * return activity log
 * @return {object}
 */
Entry.getActivityLog = function() {
    var log = {};
    if (Entry.stateManager)
        log.activityLog = Entry.stateManager.activityLog_;
    return log;
};
//block drag mode for Entry.BlockView
Entry.DRAG_MODE_NONE = 0;
Entry.DRAG_MODE_MOUSEDOWN = 1;
Entry.DRAG_MODE_DRAG = 2;

Entry.cancelObjectEdit = function(e) {
    var object = Entry.playground.object;
    if (!object) return;
    var objectView = object.view_;
    var target = e.target;
    var isCurrent = $(objectView).find(target).length !== 0;
    var tagName = target.tagName.toUpperCase();
    if (!object.isEditing || (tagName === 'INPUT' && isCurrent))
        return;

    object.editObjectValues(false);
};


window.Entry = Entry;
