/**
 * @fileoverview This manage control state and control bar.
 */
'use strict';

/**
 * Class for a engine.
 * This have view for control running state.
 * @constructor
 */
Entry.Engine = function() {
    this.state = 'stop';
    this.popup = null;
    this.isUpdating = true;
    this.speeds = [1, 15, 30, 45, 60];

    this._mouseMoved = false;;

    if (Entry.keyPressed)
        Entry.keyPressed.attach(this, this.captureKeyEvent);

    Entry.addEventListener('canvasClick', function(e) {
        Entry.engine.fireEvent('mouse_clicked');
    });
    Entry.addEventListener('canvasClickCanceled', function(e) {
        Entry.engine.fireEvent('mouse_click_cancled');
    });
    Entry.addEventListener('entityClick', function(entity) {
        Entry.engine.fireEventOnEntity('when_object_click', entity);
    });
    Entry.addEventListener('entityClickCanceled', function(entity) {
        Entry.engine.fireEventOnEntity('when_object_click_canceled', entity);
    });

    if (Entry.type != 'phone') {
        Entry.addEventListener('stageMouseMove', function(e){
            this._mouseMoved = true;
        }.bind(this));
        Entry.addEventListener('stageMouseOut', function(e){
            Entry.engine.hideMouseView();
        });
    }

    Entry.addEventListener('run', function() {
        $(window).bind('keydown', arrowHandler);
    });

    Entry.addEventListener('stop', function() {
        $(window).unbind('keydown', arrowHandler);
    });
    Entry.addEventListener('executeBlock', this.executeBlock.bind(this));

    function arrowHandler(e) {
        var arrows = [37,38,39,40,32];
        var code = (e.keyCode || e.which);
        var input = Entry.stage.inputField;
        if (code == 32 && input && input.hasFocus())
            return;
        if(arrows.indexOf(code) > -1)
            e.preventDefault();
    }

    setInterval(function() {
        if (this._mouseMoved) {
            this.updateMouseView();
            this._mouseMoved = false;
        }
    }.bind(this), 100)
};

/**
 * Control bar view generator.
 * @param {!Element} controlView controlView from Entry.
 * @param {?string} option for choose type of view.
 */
Entry.Engine.prototype.generateView = function(controlView, option) {
    if (!option || option == 'workspace') {
        /** @type {!Element} */
        this.view_ = controlView;
        this.view_.addClass('entryEngine_w');
        this.view_.addClass('entryEngineWorkspace_w');

        var speedButton = Entry.createElement('button');
        this.speedButton = speedButton;
        this.speedButton.addClass('entrySpeedButtonWorkspace',
                                  'entryEngineTopWorkspace',
                                  'entryEngineButtonWorkspace_w');
        this.view_.appendChild(this.speedButton);
        this.speedButton.bindOnClick(function(e) {
            Entry.engine.toggleSpeedPanel();
            speedButton.blur();
        });


        this.maximizeButton = Entry.createElement('button');
        this.maximizeButton.addClass('entryEngineButtonWorkspace_w',
                                     'entryEngineTopWorkspace',
                                     'entryMaximizeButtonWorkspace_w');
        this.view_.appendChild(this.maximizeButton);
        this.maximizeButton.bindOnClick(function(e) {
            Entry.engine.toggleFullscreen();
        });


        var coordinateButton = Entry.createElement('button');
        this.coordinateButton = coordinateButton;
        this.coordinateButton.addClass('entryEngineButtonWorkspace_w',
                                       'entryEngineTopWorkspace',
                                       'entryCoordinateButtonWorkspace_w');
        this.view_.appendChild(this.coordinateButton);
        this.coordinateButton.bindOnClick(function(e) {
            if (this.hasClass('toggleOn'))
                this.removeClass('toggleOn');
            else
                this.addClass('toggleOn');
            coordinateButton.blur();
            Entry.stage.toggleCoordinator();
        });

        this.addButton = Entry.createElement('button');
        this.addButton.addClass('entryEngineButtonWorkspace_w');
        this.addButton.addClass('entryAddButtonWorkspace_w');
        this.addButton.innerHTML = Lang.Workspace.add_object;
        this.addButton.bindOnClick(function(e) {
            Entry.dispatchEvent('openSpriteManager');
        });
        this.view_.appendChild(this.addButton);

        this.runButton = Entry.createElement('button');
        this.runButton.addClass('entryEngineButtonWorkspace_w');
        this.runButton.addClass('entryRunButtonWorkspace_w');
        this.runButton.innerHTML = Lang.Workspace.run;

        this.view_.appendChild(this.runButton);
        this.runButton.bindOnClick(function(e) {
            Entry.engine.toggleRun();
        });
        this.runButton2 = Entry.createElement('button');
        this.runButton2.addClass('entryEngineButtonWorkspace_w');
        this.runButton2.addClass('entryRunButtonWorkspace_w2');

        this.view_.appendChild(this.runButton2);
        this.runButton2.bindOnClick(function(e) {
            Entry.engine.toggleRun();
        });

        this.stopButton = Entry.createElement('button');
        this.stopButton.addClass('entryEngineButtonWorkspace_w');
        this.stopButton.addClass('entryStopButtonWorkspace_w');
        this.stopButton.addClass('entryRemove');
        this.stopButton.innerHTML = Lang.Workspace.stop;
        this.view_.appendChild(this.stopButton);
        this.stopButton.bindOnClick(function(e) {
            Entry.engine.toggleStop();
        });

        this.stopButton2 = Entry.createElement('button');
        this.stopButton2.addClass('entryEngineButtonWorkspace_w');
        this.stopButton2.addClass('entryStopButtonWorkspace_w2');
        this.stopButton2.addClass('entryRemove');
        this.stopButton2.innerHTML = Lang.Workspace.stop;
        this.view_.appendChild(this.stopButton2);
        this.stopButton2.bindOnClick(function(e) {
            Entry.engine.toggleStop();
        });

        this.pauseButton = Entry.createElement('button');
        this.pauseButton.addClass('entryEngineButtonWorkspace_w');
        this.pauseButton.addClass('entryPauseButtonWorkspace_w');
        this.pauseButton.addClass('entryRemove');
        this.view_.appendChild(this.pauseButton);
        this.pauseButton.bindOnClick(function(e) {
            Entry.engine.togglePause();
        });

        this.mouseView = Entry.createElement('div');
        this.mouseView.addClass('entryMouseViewWorkspace_w');
        this.mouseView.addClass('entryRemove');
        this.view_.appendChild(this.mouseView);
    } else if (option == 'minimize') {
        /** @type {!Element} */
        this.view_ = controlView;
        this.view_.addClass('entryEngine');
        this.view_.addClass('entryEngineMinimize');

        this.maximizeButton = Entry.createElement('button');
        this.maximizeButton.addClass('entryEngineButtonMinimize');
        this.maximizeButton.addClass('entryMaximizeButtonMinimize');
        this.view_.appendChild(this.maximizeButton);
        this.maximizeButton.bindOnClick(function(e) {
            Entry.engine.toggleFullscreen();
        });

        this.coordinateButton = Entry.createElement('button');
        this.coordinateButton.addClass('entryEngineButtonMinimize');
        this.coordinateButton.addClass('entryCoordinateButtonMinimize');
        this.view_.appendChild(this.coordinateButton);
        this.coordinateButton.bindOnClick(function(e) {
            if (this.hasClass('toggleOn'))
                this.removeClass('toggleOn');
            else
                this.addClass('toggleOn');
            Entry.stage.toggleCoordinator();
        });

        this.stopButton = Entry.createElement('button');
        this.stopButton.addClass('entryEngineButtonMinimize');
        this.stopButton.addClass('entryStopButtonMinimize');
        this.stopButton.addClass('entryRemove');
        this.stopButton.innerHTML = Lang.Workspace.stop;
        this.view_.appendChild(this.stopButton);
        this.stopButton.bindOnClick(function(e) {
            this.blur();
            Entry.engine.toggleStop();
        });

        this.pauseButton = Entry.createElement('button');
        this.pauseButton.innerHTML = Lang.Workspace.pause;
        this.pauseButton.addClass('entryEngineButtonMinimize');
        this.pauseButton.addClass('entryPauseButtonMinimize');
        this.pauseButton.addClass('entryRemove');
        this.view_.appendChild(this.pauseButton);
        this.pauseButton.bindOnClick(function(e) {
            this.blur();
            Entry.engine.togglePause();
        });

        this.mouseView = Entry.createElement('div');
        this.mouseView.addClass('entryMouseViewMinimize');
        this.mouseView.addClass('entryRemove');
        this.view_.appendChild(this.mouseView);

        Entry.addEventListener("loadComplete", function() {
            this.runButton = Entry.Dom("div", {
                class: "entryRunButtonBigMinimize",
                parent: $("#entryCanvasWrapper")
            });

            this.runButton.bindOnClick(function(e) {
                Entry.engine.toggleRun();
            });
        }.bind(this));
    } else if (option == 'phone') {
        this.view_ = controlView;
        this.view_.addClass('entryEngine', 'entryEnginePhone');

        this.headerView_ = Entry.createElement('div', 'entryEngineHeader');
        this.headerView_.addClass('entryEngineHeaderPhone');
        this.view_.appendChild(this.headerView_);

        this.maximizeButton = Entry.createElement('button');
        this.maximizeButton.addClass('entryEngineButtonPhone',
                                     'entryMaximizeButtonPhone');
        this.headerView_.appendChild(this.maximizeButton);
        this.maximizeButton.bindOnClick(function(e) {
            Entry.engine.footerView_.addClass('entryRemove');
            Entry.engine.headerView_.addClass('entryRemove');
            Entry.launchFullScreen(Entry.engine.view_);
        });
        document.addEventListener('fullscreenchange', function(e) {
            Entry.engine.exitFullScreen();
        });
        document.addEventListener('webkitfullscreenchange', function(e) {
            Entry.engine.exitFullScreen();
        });
        document.addEventListener('mozfullscreenchange', function(e) {
            Entry.engine.exitFullScreen();
        });

        this.footerView_ = Entry.createElement('div', 'entryEngineFooter');
        this.footerView_.addClass('entryEngineFooterPhone');
        this.view_.appendChild(this.footerView_);

        this.runButton = Entry.createElement('button');
        this.runButton.addClass('entryEngineButtonPhone',
                                'entryRunButtonPhone');
        if (Entry.objectAddable)
            this.runButton.addClass('small');
        this.runButton.innerHTML = Lang.Workspace.run;

        this.footerView_.appendChild(this.runButton);
        this.runButton.bindOnClick(function(e) {
            Entry.engine.toggleRun();
        });

        this.stopButton = Entry.createElement('button');
        this.stopButton.addClass('entryEngineButtonPhone',
                                'entryStopButtonPhone',
                                'entryRemove');
        if (Entry.objectAddable)
            this.stopButton.addClass('small');
        this.stopButton.innerHTML = Lang.Workspace.stop;

        this.footerView_.appendChild(this.stopButton);
        this.stopButton.bindOnClick(function(e) {
            Entry.engine.toggleStop();
        });
    }
};

Entry.Engine.prototype.toggleSpeedPanel = function() {
    if (this.speedPanelOn) {
        this.speedPanelOn = false;
        $(Entry.stage.canvas.canvas).animate({top: '24px'});
        this.coordinateButton.removeClass('entryRemove');
        this.maximizeButton.removeClass('entryRemove');
        this.mouseView.removeClass('entryRemoveElement');
         $(this.speedLabel_).remove();
        delete this.speedLabel_;
        $(this.speedProgress_).fadeOut(null, function(e) {
            $(this).remove();
            delete this.speedProgress_;
        });
        $(this.speedHandle_).remove();
        delete this.speedHandle_;
    } else {
        this.speedPanelOn = true;
        $(Entry.stage.canvas.canvas).animate({top: '41px'});
        this.coordinateButton.addClass('entryRemove');
        this.maximizeButton.addClass('entryRemove');
        this.mouseView.addClass('entryRemoveElement');
        this.speedLabel_ = Entry.createElement('div',
            'entrySpeedLabelWorkspace');
        this.speedLabel_.innerHTML = Lang.Workspace.speed;
        this.view_.insertBefore(this.speedLabel_, this.maximizeButton);
        this.speedProgress_ = Entry.createElement('table',
            'entrySpeedProgressWorkspace');
        var tr = Entry.createElement('tr');
        var speeds = this.speeds;
       for (var i = 0; i < 5; i++) (function (i) {
            var td = Entry.createElement('td', 'progressCell' + i);
            td.bindOnClick(function () {Entry.engine.setSpeedMeter(speeds[i]);});
            tr.appendChild(td);
        })(i);
       this.view_.insertBefore(this.speedProgress_, this.maximizeButton);
        this.speedProgress_.appendChild(tr);
        this.speedHandle_ = Entry.createElement('div',
            'entrySpeedHandleWorkspace');
        var canvasWidth = Entry.interfaceState.canvasWidth;
        var grid = (canvasWidth - 84) / 5;
        $(this.speedHandle_).draggable({
            axis: 'x',
            grid: [grid, grid],
            containment: [80, 0, grid * 4 + 80, 0],
            drag: function(e, ui) {
                var canvasWidth = Entry.interfaceState.canvasWidth;
                var level = (ui.position.left - 80) / (canvasWidth - 84) * 5;
                level = Math.floor(level);
                if (level < 0)
                    return;
                Entry.engine.setSpeedMeter(Entry.engine.speeds[level]);
            }
        });
        this.view_.insertBefore(this.speedHandle_, this.maximizeButton);
        this.setSpeedMeter(Entry.FPS);
    }
};

Entry.Engine.prototype.setSpeedMeter = function(FPS) {
    var level = this.speeds.indexOf(FPS);
    if (level < 0)
        return;
    level = Math.min(4, level);
    level = Math.max(0, level);
   if (this.speedPanelOn) {
        var canvasWidth = Entry.interfaceState.canvasWidth;
        this.speedHandle_.style.left =
            ((canvasWidth - 80) / 10 * (level * 2 + 1) + 80 - 9) + 'px';
    }
    if (Entry.FPS == FPS)
        return;
    clearInterval(this.ticker);
    this.ticker = setInterval(this.update, Math.floor(1000/FPS));
    Entry.FPS = FPS;
};

/**
 * Start engine
 * @param {number} FPS
 */
Entry.Engine.prototype.start = function(FPS) {
    /** @type {!number} */
    createjs.Ticker.setFPS(Entry.FPS);

    this.ticker = setInterval(this.update, Math.floor(1000/Entry.FPS));
};

/**
 * Stop engine
 */
Entry.Engine.prototype.stop = function() {
    clearInterval(this.ticker);
    this.ticker = null;
};

/**
 * Update canvas and object.
 */
Entry.Engine.prototype.update = function() {
    if (Entry.engine.isState('run')) {
        Entry.engine.computeObjects();
        Entry.hw.update();
    }
};

/**
 * compute each object with runningScript on entity.
 */
Entry.Engine.prototype.computeObjects = function() {
    Entry.container.mapObjectOnScene(this.computeFunction);
};

/**
 * Compute function for map.
 * @param {Entry.EntryObject} object
 */
Entry.Engine.prototype.computeFunction = function(object) {
    var code = object.script;
    code.tick();
};

Entry.Engine.computeThread = function(entity, script) {
    Entry.engine.isContinue = true;
    var isSame = false;
    while (script && Entry.engine.isContinue && !isSame) {
        Entry.engine.isContinue = !script.isRepeat;
        var newScript = script.run();
        isSame = (newScript && newScript === script);
        script = newScript;
    }
    return script;
};

/**
 * Check this state is same with argument
 * @param {string} state
 * @return {boolean}
 */
Entry.Engine.prototype.isState = function(state) {
    return this.state.indexOf(state) > -1;
};

/**
 * Execute this function when click start button
 */
Entry.Engine.prototype.run = function() {
    if (this.isState('run')) {
        this.toggleStop();
    } else if (this.isState('stop') || this.isState('pause')){
        this.toggleRun();
    }
};

/**
 * toggle this engine state run
 */
Entry.Engine.prototype.toggleRun = function(fireStart) {
    if (this.state === 'pause') {
        this.togglePause();
        return;
    }

    Entry.addActivity("run");
    if (this.state == 'stop') {
        Entry.container.mapEntity(function(entity){
            entity.takeSnapshot();
        });
        Entry.variableContainer.mapVariable(function(variable){
            variable.takeSnapshot();
        });
        Entry.variableContainer.mapList(function(variable){
            variable.takeSnapshot();
        });
        this.projectTimer.takeSnapshot();
        Entry.container.inputValue.takeSnapshot();

        Entry.container.takeSequenceSnapshot();
        Entry.scene.takeStartSceneSnapshot();
        this.state = 'run';
        if (fireStart !== false)
            this.fireEvent('start');
    }
    this.state = 'run';
    if (Entry.type == 'mobile')
        this.view_.addClass('entryEngineBlueWorkspace');

    this.pauseButton.innerHTML = Lang.Workspace.pause;
    this.runButton.addClass('run');
    this.runButton.addClass('entryRemove');
    this.stopButton.removeClass('entryRemove');
    if (this.pauseButton)
        this.pauseButton.removeClass('entryRemove');

    if (this.runButton2)
        this.runButton2.addClass('entryRemove');
    if (this.stopButton2)
        this.stopButton2.removeClass('entryRemove');

    if (!this.isUpdating) {
        Entry.engine.update();
        Entry.engine.isUpdating = true;
    }

    Entry.stage.selectObject();
    Entry.dispatchEvent('run');
};

/**
 * toggle this engine state stop
 */
Entry.Engine.prototype.toggleStop = function() {
    Entry.addActivity("stop");
    var container = Entry.container;
    var variableContainer = Entry.variableContainer;
    container.mapEntity(function(entity){
        entity.loadSnapshot();
        entity.object.filters = [];
        entity.resetFilter();
        if (entity.dialog)
            entity.dialog.remove();
        if (entity.brush)
            entity.removeBrush();

    });
    variableContainer.mapVariable(function(variable){
        variable.loadSnapshot();
    });
    variableContainer.mapList(function(variable){
        variable.loadSnapshot();
        variable.updateView();
    });
    this.stopProjectTimer();
    container.clearRunningState();
    container.loadSequenceSnapshot();
    this.projectTimer.loadSnapshot();
    Entry.container.inputValue.loadSnapshot();
    Entry.scene.loadStartSceneSnapshot();
    Entry.Func.clearThreads();
    createjs.Sound.setVolume(1);
    createjs.Sound.stop();
    this.view_.removeClass('entryEngineBlueWorkspace');
    this.runButton.removeClass('entryRemove');
    this.stopButton.addClass('entryRemove');
    if (this.pauseButton)
        this.pauseButton.addClass('entryRemove');

    if (this.runButton2)
        this.runButton2.removeClass('entryRemove');
    if (this.stopButton2)
        this.stopButton2.addClass('entryRemove');

    this.state = 'stop';
    Entry.dispatchEvent('stop');
    Entry.stage.hideInputField();
};

/**
 * toggle this engine state pause
 */
Entry.Engine.prototype.togglePause = function() {
    var timer = Entry.engine.projectTimer;
    if (this.state == 'pause') {
        timer.pausedTime += (new Date()).getTime() - timer.pauseStart;
        if (timer.isPaused)
            timer.pauseStart = (new Date()).getTime()
        else delete timer.pauseStart;
        this.state = 'run';
        this.pauseButton.innerHTML = Lang.Workspace.pause;
        this.runButton.addClass('entryRemove');
        if (this.runButton2)
            this.runButton2.addClass('entryRemove');
    } else {
        this.state = 'pause';
        if (!timer.isPaused)
            timer.pauseStart = (new Date()).getTime();
        else {
            timer.pausedTime += (new Date()).getTime() - timer.pauseStart;
            timer.pauseStart = (new Date()).getTime();
        }
        this.pauseButton.innerHTML = Lang.Workspace.restart;
        this.runButton.removeClass('entryRemove');
        this.stopButton.removeClass('entryRemove');
        if (this.runButton2)
            this.runButton2.removeClass('entryRemove');
    }
};

/**
 * @param {string} eventName
 */
Entry.Engine.prototype.fireEvent = function(eventName) {
    if (this.state == 'run')
        Entry.container.mapEntityIncludeCloneOnScene(this.raiseEvent, eventName);
};

/**
 * this is callback function for map.
 * @param {Entry.EntryObject} object
 * @param {string} eventName
 */
Entry.Engine.prototype.raiseEvent = function(entity, eventName) {
    var code = entity.parent.script;
    code.raiseEvent(eventName, entity);
};

/**
 * @param {string} eventName
 * @param {Entry.EntityObject} entity
 */
Entry.Engine.prototype.fireEventOnEntity = function(eventName, entity) {
    if (this.state == 'run')
        Entry.container.mapEntityIncludeCloneOnScene(this.raiseEventOnEntity,[entity, eventName]);
};

/**
 * this is callback function for map.
 * @param {Entry.EntryObject} object
 * @param {Array} param
 */
Entry.Engine.prototype.raiseEventOnEntity = function(entity, param) {
    if (entity !== param[0])
        return;
    var eventName = param[1];
    var code = entity.parent.script;
    code.raiseEvent(eventName, entity);
};

/**
 * capture keyboard press input
 * @param {keyboard event} e
 */
Entry.Engine.prototype.captureKeyEvent = function(e) {
    var keyCode = e.keyCode;
    var type = Entry.type;

    //mouse shortcuts
    if (e.ctrlKey && type == 'workspace') {
        if (keyCode == 83) {
            e.preventDefault();
            Entry.dispatchEvent('saveWorkspace');
        } else if (keyCode == 82) {
            e.preventDefault();
            Entry.engine.run();
        } else if (keyCode == 90) {
            e.preventDefault();
            console.log('engine');
            Entry.dispatchEvent(e.shiftKey ? 'redo' : 'undo');
        }
    } else if (Entry.engine.isState('run')) {
        Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent,
                                  ["keyPress", keyCode]);
    }

    if (Entry.engine.isState('stop')) {
        if (type === 'workspace' &&
            (keyCode >= 37 && keyCode <= 40)) {
            Entry.stage.moveSprite(e);
        }
    }
};

/**
 * this is callback function for map.
 * @param {Entry.EntryObject} object
 * @param {Array} param
 */
Entry.Engine.prototype.raiseKeyEvent = function(entity, param) {
    var eventName = param[0];
    var keyCode = String(param[1]);
    return entity.parent.script.raiseEvent(eventName, entity, keyCode);
};

/**
 * Update mouse coordinate
 */
Entry.Engine.prototype.updateMouseView = function() {
    var coordinate = Entry.stage.mouseCoordinate;
    this.mouseView.textContent = 'X : ' + coordinate.x + ', Y : ' + coordinate.y;
    this.mouseView.removeClass('entryRemove');
};

/**
 * hide mouse coordinate
 */
Entry.Engine.prototype.hideMouseView = function() {
    this.mouseView.addClass('entryRemove');
};

/**
 * Toggle full screen of canvas
 */
Entry.Engine.prototype.toggleFullscreen = function() {
    if (!this.popup) {
        this.popup = new Entry.Popup();
        if (Entry.type != 'workspace') {
            var $doc = $(document);
            var body = $(this.popup.body_);
            body.css('top', $doc.scrollTop());
            $('body').css('overflow', 'hidden');

            popup.window_.appendChild(Entry.stage.canvas.canvas);
            popup.window_.appendChild(Entry.engine.runButton[0]);
        }
        popup.window_.appendChild(Entry.engine.view_);
    } else {
        this.popup.remove();
        this.popup = null;
    }
    Entry.windowResized.notify();
};

Entry.Engine.prototype.exitFullScreen = function() {
    if (document.webkitIsFullScreen ||
       document.mozIsFullScreen ||
       document.isFullScreen) {
    } else {
        Entry.engine.footerView_.removeClass('entryRemove');
        Entry.engine.headerView_.removeClass('entryRemove');
    }
    Entry.windowResized.notify();
};


//projectTimer to show
Entry.Engine.prototype.showProjectTimer = function() {
    var timer = Entry.engine.projectTimer;
    if (!timer)
        return;
    this.projectTimer.setVisible(true);
};

//decide Entry.engine.projectTimer to show
Entry.Engine.prototype.hideProjectTimer = function() {
    var timer = this.projectTimer;
    if (!timer || !timer.isVisible() || this.isState('run')) return;
    var objects = Entry.container.getAllObjects();

    var timerTypes = [
            'get_project_timer_value',
            'reset_project_timer',
            'set_visible_project_timer',
            'choose_project_timer_action'
    ];

    for (var i = 0, len = objects.length; i < len; i++) {
        var code = objects[i].script;
        for (var j = 0; j < timerTypes.length; j++)
            if(code.hasBlockType(timerTypes[j])) return;
    }
    timer.setVisible(false);
};

Entry.Engine.prototype.clearTimer = function() {
    clearInterval(this.ticker);
    clearInterval(this.projectTimer.tick);
};

Entry.Engine.prototype.startProjectTimer = function() {
    var timer = this.projectTimer;
    if (!timer)
        return;
    timer.start = (new Date()).getTime();
    timer.isInit = true;
    timer.pausedTime = 0;
    timer.tick = setInterval(function (e) {
        Entry.engine.updateProjectTimer();
    }, 1000/60);
};

Entry.Engine.prototype.stopProjectTimer = function() {
    var timer = this.projectTimer;
    if (!timer)
        return;
    this.updateProjectTimer(0);
    timer.isPaused = false;
    timer.isInit = false;
    timer.pausedTime = 0;
    clearInterval(timer.tick);
};

Entry.Engine.prototype.updateProjectTimer = function(value) {
    var engine = Entry.engine;
    var timer = engine.projectTimer;
    if (!timer) return;
    var current = (new Date()).getTime();
    if (typeof value == 'undefined') {
        if (!timer.isPaused && !engine.isState('pause'))
            timer.setValue(((current - timer.start - timer.pausedTime)/1000));
    } else {
        timer.setValue(value);
        timer.pausedTime = 0;
        timer.start = current;
    }
};


Entry.Engine.prototype.executeBlock = function() {
    this.isState('stop') && this.toggleRun(false);
};
