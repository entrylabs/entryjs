/**
 * @fileoverview Initialize code fore Entry
 */
'use strict';

goog.require("Entry.PropertyPanel");
goog.require("Entry.Commander");

/**
 * Initialize method with options.
 * @param {!Element} container for entry workspace or others.
 * @param {!object} options for initialize.
 */
Entry.init = function(container, options) {
    Entry.assert(typeof options === "object", 'Init option is not object');
    this.events_ = {};
    this.interfaceState = {
        menuWidth: 264
    };

    Entry.Utils.bindGlobalEvent([
        'resize', 'mousedown',
        'mousemove', 'keydown',
        'keyup', 'dispose'
    ]);

    /** @type {object} */
    this.options = options;
    this.parseOptions(options);
    this.mediaFilePath = (options.libDir ? options.libDir : '/lib') + '/entryjs/images/';
    this.defaultPath = options.defaultDir || '';
    this.blockInjectPath = options.blockInjectDir || '';

    if (this.type == 'workspace' && this.isPhone())
        this.type = 'phone';
    this.initialize_();
    /** @type {!Element} */
    this.view_ = container;
    $(this.view_).addClass("entry");
    if (this.type === "minimize")
        $(this.view_).addClass(this.type);
    if (this.device === 'tablet')
        $(this.view_).addClass("tablet");

    Entry.initFonts(options.fonts);
    this.createDom(container, this.type);
    this.loadInterfaceState();
    this.overridePrototype();
    this.maxCloneLimit = 302;
    this.cloudSavable = true;
    this.startTime = new Date().getTime();

    document.onkeydown=function(e){
        Entry.dispatchEvent('keyPressed', e);
    };
    document.onkeyup=function(e){
        Entry.dispatchEvent('keyUpped', e);
    };
    window.onresize = function(e) {
        Entry.dispatchEvent('windowResized', e);
    };
    window.onbeforeunload = this.beforeUnload;

    Entry.addEventListener("saveWorkspace", function(e) {
        Entry.addActivity("save");
    });

    Entry.addEventListener("showBlockHelper", function(e) {
        Entry.propertyPanel.select("helper");
    });

    if (Entry.getBrowserType().substr(0,2) == 'IE' && !window.flashaudio) {
        createjs.FlashAudioPlugin.swfPath = this.mediaFilePath + "media/";
        createjs.Sound.registerPlugins([createjs.FlashAudioPlugin]);
        //createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
        //createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
        window.flashaudio = true;
    } else {
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    }

    Entry.soundQueue = new createjs.LoadQueue();
    Entry.soundQueue.installPlugin(createjs.Sound);

    Entry.loadAudio_(
        [Entry.mediaFilePath + 'sounds/click.mp3',
        Entry.mediaFilePath + 'sounds/click.wav',
        Entry.mediaFilePath + 'sounds/click.ogg'], 'entryMagneting');
    Entry.loadAudio_(
        [Entry.mediaFilePath + 'sounds/delete.mp3',
        Entry.mediaFilePath + 'sounds/delete.ogg',
        Entry.mediaFilePath + 'sounds/delete.wav'], 'entryDelete');

    createjs.Sound.stop();
};

Entry.changeContainer = function(container) {
    container.appendChild(this.view_);
};

Entry.loadAudio_ = function(filenames, name) {
  if (!window.Audio || !filenames.length) {
    // No browser support for Audio.
    return;
  }

  for (var i = 0; i < filenames.length; i++) {
    var filename = filenames[i];
    //var path = Blockly.pathToBlockly + filename;
    var id = filename.match(/\/([^.]+)./)[1];
    //createjs.Sound.registerSound(path, id, 4);
    Entry.soundQueue.loadFile({
        id: name,
        src: filename,
        type: createjs.LoadQueue.SOUND
    });
    break;
  }
};

/**
 * Initialize function for Entry.
 * @private
 */
Entry.initialize_ = function() {
    /**
     * Initialize stage
     * @type {!Entry.Stage}
     * @type {!object}
     */
    this.stage = new Entry.Stage();

    if (Entry.engine && Entry.engine.projectTimer)
        Entry.engine.clearTimer();
    /**
     * Initialize engine for run.
     * @type {!Entry.Engine}
     * @type {!object}
     */
    this.engine = new Entry.Engine();

    /**
     * Initialize PropertyPanel.
     * @type {!object}
     */
    this.propertyPanel = new Entry.PropertyPanel();

    /**
     * Initialize container for objects.
     * @type {!Entry.Container}π
     * @type {!object}
     */
    this.container = new Entry.Container();

    /**
     * Initialize helper.
     * @type {!Entry.Helper}
     * @type {!object}
     */
    this.helper = new Entry.Helper();
    this.youtube = new Entry.Youtube();
    // this.tvCast = new Entry.TvCast();
    // this.doneProject = new Entry.DoneProject();
    /**
     * Initialize container for objects.
     * @type {!Entry.VariableContainer}
     * @type {!object}
     */
    this.variableContainer = new Entry.VariableContainer();

    this.commander = new Entry.Commander(this.type);

    /**
     * Initialize scenes.
     * @type {!Entry.Scene}
     * @type {!object}
     */
    this.scene = new Entry.Scene();

    /**
     * Initialize playground.
     * @type {!Entry.Playground}
     */
    this.playground = new Entry.Playground();

    /**
     * Initialize toast. Toast don't need generate view.
     * @type {!Entry.Toast}
     */
    this.toast = new Entry.Toast();

    if (this.hw)
        this.hw.closeConnection();
    /**
     * Initialize hardware manager.
     * @type {!Entry.Toast}
     */
    this.hw = new Entry.HW();

    if (Entry.enableActivityLogging)
        this.reporter = new Entry.Reporter(false);
    else if (this.type == 'workspace' || this.type == 'phone')
        this.reporter = new Entry.Reporter(true);

};

/**
 * Initialize html DOM view for entry.
 * This work differently with initialize option.
 * @param {!Element} container for entry workspace or others.
 * @param {!string} option for create dom by type.
 */
Entry.createDom = function(container, option) {
    var that = this;
    if (!option || option == 'workspace') {
        Entry.documentMousedown.attach(
            that, that.cancelObjectEdit
        );

        var sceneView = Entry.createElement('div');
        container.appendChild(sceneView);
        /** @type {!Element} */
        this.sceneView = sceneView;
        this.scene.generateView(this.sceneView, option);

        var stateManagerView = Entry.createElement('div');
        this.sceneView.appendChild(stateManagerView);
        /** @type {!Element} */
        this.stateManagerView = stateManagerView;
        this.stateManager.generateView(this.stateManagerView, option);

        var engineView = Entry.createElement('div');
        container.appendChild(engineView);
        /** @type {!Element} */
        this.engineView = engineView;
        this.engine.generateView(this.engineView, option);

        var canvas = Entry.createElement('canvas');
        canvas.addClass('entryCanvasWorkspace');
        canvas.id = 'entryCanvas';
        canvas.width = 640;
        canvas.height = 360;
        engineView.insertBefore(canvas, this.engine.addButton);

        canvas.addEventListener("mousewheel" , function(evt) {
            var lists = [];
            var mousePosition = Entry.stage.mouseCoordinate;
            var tempList = Entry.variableContainer.getListById(mousePosition);
            var wheelDirection = evt.wheelDelta > 0 ? true : false;

            for(var i=0; i<tempList.length; i++) {
                var list = tempList[i];
                if(wheelDirection){
                    if(list.scrollButton_.y >= 46 )
                        list.scrollButton_.y -= 23;
                    else
                        list.scrollButton_.y = 23;
                } else {
                    list.scrollButton_.y += 23;
                }
                list.updateView();
            }
        });

        /** @type {!Element} */
        this.canvas_ = canvas;
        this.stage.initStage(this.canvas_);

        var containerView = Entry.createElement('div');
        //container.appendChild(containerView);
        this.propertyPanel.generateView(container, option);
        /** @type {!Element} */
        this.containerView = containerView;
        this.container.generateView(this.containerView, option);
        this.propertyPanel.addMode("object", this.container);

        this.helper.generateView(this.containerView, option);
        this.propertyPanel.addMode("helper" , this.helper);

        var playgroundView = Entry.createElement('div');
        container.appendChild(playgroundView);
        /** @type {!Element} */
        this.playgroundView = playgroundView;
        this.playground.generateView(this.playgroundView, option);


        this.propertyPanel.select("object");
        this.helper.bindWorkspace(this.playground.mainWorkspace);
    } else if (option == 'minimize') {
        var canvas = Entry.createElement('canvas');
        canvas.className = 'entryCanvasWorkspace minimize';
        canvas.id = 'entryCanvas';
        canvas.width = 640;
        canvas.height = 360;
        var canvasWrapper = Entry.createElement('div', 'entryCanvasWrapper');
        canvasWrapper.appendChild(canvas);
        container.appendChild(canvasWrapper);

        /** @type {!Element} */
        this.canvas_ = canvas;
        this.stage.initStage(this.canvas_);

        var engineView = Entry.createElement('div');
        container.appendChild(engineView);
        /** @type {!Element} */
        this.engineView = engineView;
        this.engine.generateView(this.engineView, option);
    } else if (option == 'phone') {
        var stateManagerView = Entry.createElement('div');
        /** @type {!Element} */
        this.stateManagerView = stateManagerView;
        this.stateManager.generateView(this.stateManagerView, option);

        var engineView = Entry.createElement('div');
        container.appendChild(engineView);
        /** @type {!Element} */
        this.engineView = engineView;
        this.engine.generateView(this.engineView, option);

        var canvas = Entry.createElement('canvas');
        canvas.addClass('entryCanvasPhone');
        canvas.id = 'entryCanvas';
        canvas.width = 640;
        canvas.height = 360;

        engineView.insertBefore(canvas, this.engine.footerView_);
        /** @type {!Element} */
        this.canvas_ = canvas;
        this.stage.initStage(this.canvas_);

        var containerView = Entry.createElement('div');
        container.appendChild(containerView);
        /** @type {!Element} */
        this.containerView = containerView;
        this.container.generateView(this.containerView, option);

        var playgroundView = Entry.createElement('div');
        container.appendChild(playgroundView);
        /** @type {!Element} */
        this.playgroundView = playgroundView;
        this.playground.generateView(this.playgroundView, option);
    }
};

/**
 * start running
 * @param {?number} FPS
 */
Entry.start = function(FPS) {
    if (Entry.type === "invisible")
        return;
    /** @type {number} */
    if (!this.FPS)
        this.FPS = 60;
    Entry.assert(typeof(this.FPS) == 'number', 'FPS must be number');
    Entry.engine.start(this.FPS);
};

Entry.stop = function() {
    if (Entry.type === "invisible")
        return;
    this.FPS = null;
    Entry.engine.stop();
}

/**
 * Parse init options
 * @param {!object} options for parse
 */
Entry.parseOptions = function(options) {
    /** @type {string} */
    this.type = options.type;

    this.hashId = options.hashId;

    if (options.device)
        this.device = options.device;

    this.projectSaveable = options.projectsaveable;
    if (this.projectSaveable === undefined)
        this.projectSaveable = true;

    this.objectAddable = options.objectaddable;
    if (this.objectAddable === undefined)
        this.objectAddable = true;

    this.objectEditable = options.objectEditable;
    if (this.objectEditable === undefined)
        this.objectEditable = true;
    if (!this.objectEditable)
        this.objectAddable = false;

    this.objectDeletable = options.objectdeletable;
    if (this.objectDeletable === undefined)
        this.objectDeletable = true;

    this.soundEditable = options.soundeditable;
    if (this.soundEditable === undefined)
        this.soundEditable = true;

    this.pictureEditable = options.pictureeditable;
    if (this.pictureEditable === undefined)
        this.pictureEditable = true;

    this.sceneEditable = options.sceneEditable;
    if (this.sceneEditable === undefined)
        this.sceneEditable = true;

    this.functionEnable = options.functionEnable;
    if (this.functionEnable === undefined)
        this.functionEnable = true;

    this.messageEnable = options.messageEnable;
    if (this.messageEnable === undefined)
        this.messageEnable = true;

    this.variableEnable = options.variableEnable;
    if (this.variableEnable === undefined)
        this.variableEnable = true;

    this.listEnable = options.listEnable;
    if (this.listEnable === undefined)
        this.listEnable = true;

    this.hasVariableManager = options.hasvariablemanager;
    if (!(this.variableEnable || this.messageEnable ||
          this.listEnable || this.functionEnable))
        this.hasVariableManager = false;
    else if (this.hasVariableManager === undefined)
        this.hasVariableManager = true;

    this.isForLecture = options.isForLecture;

    this.textCodingEnable = options.textCodingEnable;
};


Entry.initFonts = function(fonts) {
    this.fonts = fonts;
    if (!fonts) this.fonts = [];

};
