/**
 * @fileoverview Initialize code fore Entry
 */

'use strict';

import { Destroyer } from './destroyer/Destroyer';
import { GEHelper } from '../graphicEngine/GEHelper';
import Expansion from '../class/Expansion';
import Extension from '../extensions/extension';

require('./utils');

/**
 * Initialize method with options.
 * @param {!Element} container for entry workspace or others.
 * @param {!object} options for initialize.
 */
Entry.init = function(container, options) {
    Entry.assert(typeof options === 'object', 'Init option is not object');
    this.events_ = {};
    this.interfaceState = {
        menuWidth: 264,
    };

    Entry.Utils.bindGlobalEvent([
        'resize',
        'mousedown',
        'mousemove',
        'keydown',
        'keyup',
        'dispose',
    ]);

    /** @type {object} */
    this.options = options;
    this.parseOptions(options);
    this.mediaFilePath = `${options.libDir ? options.libDir : '/lib'}/entry-js/images/`;
    this.painterBaseUrl = `${
        options.libDir ? options.libDir : '/lib'
    }/literallycanvas-mobile/lib/img`;
    this.defaultPath = options.defaultDir || '';
    this.soundPath = options.soundDir || '';
    this.blockInjectPath = options.blockInjectDir || '';

    if (this.type === 'workspace' && this.isPhone()) {
        this.type = 'phone';
    }
    this.initialize_();
    /** @type {!Element} */
    this.view_ = container;
    $(this.view_).addClass('entry');
    if (this.type === 'minimize') {
        $(this.view_).addClass(this.type);
    }
    // if (this.device === 'tablet') $(this.view_).addClass('tablet');

    Entry.initFonts(options.fonts);
    const { theme = 'default' } = options;
    if (theme !== 'default') {
        try {
            EntryStatic.colorSet = require(`../theme/${theme}`);
            require('../playground/block_entry').assignBlocks();
        } catch (e) {
            console.log('not exist theme!', e);
        }
    }

    Entry.paintMode = options.paintMode || 'literallycanvas';
    this.createDom(container, this.type);
    this.loadInterfaceState();
    this.overridePrototype();
    this.maxCloneLimit = 360;
    this.cloudSavable = true;
    this.startTime = new Date().getTime();

    document.onkeydown = function(e) {
        Entry.dispatchEvent('keyPressed', e);
    };
    document.onkeyup = function(e) {
        Entry.dispatchEvent('keyUpped', e);
    };
    window.onresize = function(e) {
        Entry.dispatchEvent('windowResized', e);
    };
    window.onbeforeunload = this.beforeUnload;

    Entry.addEventListener('saveWorkspace', () => {
        Entry.addActivity('save');
    });

    Entry.addEventListener('showBlockHelper', () => {
        Entry.propertyPanel.select('helper');
    });

    if (Entry.getBrowserType().substr(0, 2) === 'IE' && !window.flashaudio) {
        createjs.FlashAudioPlugin.swfPath = `${this.mediaFilePath}media/`;
        createjs.Sound.registerPlugins([createjs.FlashAudioPlugin]);
        window.flashaudio = true;
    } else {
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
    }

    Entry.soundQueue = new createjs.LoadQueue();
    Entry.soundQueue.installPlugin(createjs.Sound);
    Entry.soundInstances = [];
    Entry.soundQueue.urls = new Set();
    Entry.soundQueue.total = 0;
    Entry.soundQueue.loadCallback = (src) => {
        // if (!Entry.soundQueue.urls.has(src)) {
        //     return;
        // }
        Entry.soundQueue.total = Math.max(Entry.soundQueue.total, Entry.soundQueue.urls.size);
        Entry.soundQueue.urls.delete(src);
        const now = Entry.soundQueue.urls.size;
        if (!Entry.soundQueue.loadComplete && now < 1) {
            Entry.soundQueue.loadComplete = true;
            Entry.dispatchEvent('soundLoaded');
        }
    };
    Entry.soundQueue.on('fileload', (event) => {
        Entry.soundQueue.loadCallback(event.item.src);
    });
    Entry.soundQueue.on('error', (event) => {
        console.error('load sound, error', event);
        Entry.soundQueue.loadCallback(event.data.src);
    });

    Entry.loadAudio_(
        [
            `${Entry.mediaFilePath}sounds/click.mp3`,
            `${Entry.mediaFilePath}sounds/click.wav`,
            `${Entry.mediaFilePath}sounds/click.ogg`,
        ],
        'entryMagneting'
    );
    Entry.loadAudio_(
        [
            `${Entry.mediaFilePath}sounds/delete.mp3`,
            `${Entry.mediaFilePath}sounds/delete.ogg`,
            `${Entry.mediaFilePath}sounds/delete.wav`,
        ],
        'entryDelete'
    );

    createjs.Sound.stop();
    BigNumber.config({ ERRORS: false });
};

Entry.changeContainer = function(container) {
    container.appendChild(this.view_);
};

Entry.loadAudio_ = function(filenames, name) {
    if (!window.Audio || !filenames.length) {
        // No browser support for Audio.
        return;
    }

    for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        //var path = Blockly.pathToBlockly + filename;
        //createjs.Sound.registerSound(path, id, 4);
        Entry.soundQueue.loadFile({
            id: name,
            src: filename,
            type: createjs.LoadQueue.SOUND,
        });
        break;
    }
};

/**
 * Initialize function for Entry.
 * @private
 */
Entry.initialize_ = function() {
    /** @type {Destroyer} */
    this._destroyer = this._destroyer || new Destroyer();
    this._destroyer.destroy();

    /**
     * Initialize stage
     * @type {!Entry.Stage}
     * @type {!object}
     */
    this.stage = new Entry.Stage();
    this._destroyer.add(this.stage);

    if (Entry.engine && Entry.engine.projectTimer) {
        Entry.engine.clearTimer();
    }
    /**
     * Initialize engine for run.
     * @type {!Entry.Engine}
     * @type {!object}
     */
    this.engine = new Entry.Engine();
    this._destroyer.add(this.engine);

    /**
     * Initialize PropertyPanel.
     * @type {!object}
     */

    if (this.type !== 'minimize') {
        this.propertyPanel = new Entry.PropertyPanel();
    }

    /**
     * Initialize container for objects.
     * @type {!Entry.Container}π
     * @type {!object}
     */
    this.container = new Entry.Container();
    this._destroyer.add(this.container);

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

    this.commander = new Entry.Commander(this.type, this.doNotSkipAny);

    /**
     * Initialize scenes.
     * @type {!Entry.Scene}
     * @type {!object}
     */
    this.scene = new Entry.Scene();
    this._destroyer.add(this.scene);

    /**
     * Initialize playground.
     * @type {!Entry.Playground}
     */
    this.playground = new Entry.Playground();
    this._destroyer.add(this.playground);

    this.expansion = new Expansion(this.playground);
    this._destroyer.add(this.expansion);
    this.intro = new Entry.Intro();
    /**
     * Initialize toast. Toast don't need generate view.
     * @type {!Entry.Toast}
     */
    this.toast = new Entry.Toast();

    if (this.hw) {
        this.hw.closeConnection();
    }
    /**
     * Initialize hardware manager.
     * @type {!Entry.Toast}
     */
    this.hw = new Entry.HW();

    if (Entry.enableActivityLogging) {
        this.reporter = new Entry.Reporter(false);
    } else if (this.type === 'workspace' || this.type === 'phone') {
        this.reporter = new Entry.Reporter(true);
    }

    GEHelper.INIT(this.options.useWebGL);
    // GEHelper.INIT(0);
};

Entry.disposeContainer = function() {
    while (this.view_.firstChild) {
        this.view_.removeChild(this.view_.firstChild);
    }
};

/**
 * Initialize html DOM view for entry.
 * This work differently with initialize option.
 * @param {!Element} container for entry workspace or others.
 * @param {!string} option for create dom by type.
 */
Entry.createDom = function(container, option) {
    const that = this;

    const textCanvasContainer = Entry.createElement('div', 'textCanvasContainer');
    textCanvasContainer.style.display = 'none';
    container.appendChild(textCanvasContainer);

    if (!option || option === 'workspace') {
        Entry.documentMousedown.attach(that, that.cancelObjectEdit);

        const sceneView = Entry.createElement('div');
        container.appendChild(sceneView);
        /** @type {!Element} */
        this.sceneView = sceneView;
        this.scene.generateView(this.sceneView, option);

        const stateManagerView = Entry.createElement('div');
        this.sceneView.appendChild(stateManagerView);
        /** @type {!Element} */
        this.stateManagerView = stateManagerView;
        this.stateManager.generateView(this.stateManagerView, option);

        const engineContainer = Entry.createElement('div');
        engineContainer.classList.add('engineContainer');
        container.appendChild(engineContainer);
        const engineView = Entry.createElement('div');
        engineContainer.appendChild(engineView);
        this.engineContainer = engineContainer;
        /** @type {!Element} */
        this.engineView = engineView;
        this.engine.generateView(this.engineView, option);

        const canvas = Entry.createElement('canvas');
        canvas.addClass('entryCanvasWorkspace');
        canvas.id = 'entryCanvas';
        canvas.width = 640;
        canvas.height = 360;
        engineView.insertBefore(canvas, this.engine.buttonWrapper);

        canvas.addEventListener('mousewheel', (evt) => {
            const mousePosition = Entry.stage.mouseCoordinate;
            const tempList = Entry.variableContainer.getListById(mousePosition);
            const wheelDirection = evt.wheelDelta > 0;

            for (let i = 0; i < tempList.length; i++) {
                const list = tempList[i];
                if (wheelDirection) {
                    if (list.scrollButton_.y >= 46) {
                        list.scrollButton_.y -= 23;
                    } else {
                        list.scrollButton_.y = 23;
                    }
                } else {
                    list.scrollButton_.y += 23;
                }
                list.updateView();
            }
        });

        /** @type {!Element} */
        this.canvas_ = canvas;
        this.extension = new Extension();
        this.stage.initStage(this.canvas_);

        const containerView = Entry.createElement('div');
        //container.appendChild(containerView);
        this.propertyPanel.generateView(engineContainer, option);
        /** @type {!Element} */
        this.containerView = containerView;
        this.container.generateView(this.containerView, option);
        this.propertyPanel.addMode('object', this.container);

        this.helper.generateView(this.containerView, option);
        this.propertyPanel.addMode('helper', this.helper);

        const introView = Entry.createElement('div');
        container.appendChild(introView);
        this.introView = introView;
        this.intro.generateView(this.introView, option);

        const playgroundView = Entry.createElement('div');
        container.appendChild(playgroundView);
        /** @type {!Element} */
        this.playgroundView = playgroundView;
        this.playground.generateView(this.playgroundView, option);

        this.propertyPanel.select('object');
        this.helper.bindWorkspace(this.playground.mainWorkspace);
    } else if (option === 'minimize') {
        const canvas = Entry.createElement('canvas');
        canvas.className = 'entryCanvasWorkspace minimize';
        canvas.id = 'entryCanvas';
        canvas.width = 640;
        canvas.height = 360;
        const canvasWrapper = Entry.createElement('div', 'entryCanvasWrapper');
        canvasWrapper.appendChild(canvas);
        container.appendChild(canvasWrapper);

        /** @type {!Element} */
        this.canvas_ = canvas;
        this.stage.initStage(this.canvas_);

        const engineView = Entry.createElement('div');
        container.appendChild(engineView);
        /** @type {!Element} */
        this.engineView = engineView;
        this.engine.generateView(this.engineView, option);
    } else if (option === 'phone') {
        const stateManagerView = Entry.createElement('div');
        /** @type {!Element} */
        this.stateManagerView = stateManagerView;
        this.stateManager.generateView(this.stateManagerView, option);

        const engineView = Entry.createElement('div');
        container.appendChild(engineView);
        /** @type {!Element} */
        this.engineView = engineView;
        this.engine.generateView(this.engineView, option);

        const canvas = Entry.createElement('canvas');
        canvas.addClass('entryCanvasPhone');
        canvas.id = 'entryCanvas';
        canvas.width = 640;
        canvas.height = 360;

        engineView.insertBefore(canvas, this.engine.footerView_);
        /** @type {!Element} */
        this.canvas_ = canvas;
        this.stage.initStage(this.canvas_);

        const containerView = Entry.createElement('div');
        container.appendChild(containerView);
        /** @type {!Element} */
        this.containerView = containerView;
        this.container.generateView(this.containerView, option);

        const playgroundView = Entry.createElement('div');
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
Entry.start = function() {
    if (Entry.type === 'invisible') {
        return;
    }
    /** @type {number} */
    if (!this.FPS) {
        this.FPS = 60;
    }
    Entry.assert(typeof this.FPS === 'number', 'FPS must be number');
    Entry.engine.start(this.FPS);
};

Entry.stop = function() {
    if (Entry.type === 'invisible') {
        return;
    }
    this.FPS = null;
    Entry.engine.stop();
};

/**
 * Parse init options
 * @param {!object} options for parse
 */
Entry.parseOptions = function(options) {
    /** @type {string} */
    this.type = options.type || this.type;

    this.hashId = options.hashId || this.hasId;

    if (options.device) {
        this.device = options.device;
    }

    this.projectSaveable = options.projectsaveable;
    if (this.projectSaveable === undefined) {
        this.projectSaveable = true;
    }

    this.objectAddable = options.objectaddable;
    if (this.objectAddable === undefined) {
        this.objectAddable = true;
    }

    this.objectEditable = options.objectEditable;
    if (this.objectEditable === undefined) {
        this.objectEditable = true;
    }
    if (!this.objectEditable) {
        this.objectAddable = false;
    }

    this.objectDeletable = options.objectdeletable;
    if (this.objectDeletable === undefined) {
        this.objectDeletable = true;
    }

    this.soundEditable = options.soundeditable;
    if (this.soundEditable === undefined) {
        this.soundEditable = true;
    }

    this.pictureEditable = options.pictureeditable;
    if (this.pictureEditable === undefined) {
        this.pictureEditable = true;
    }

    this.sceneEditable = options.sceneEditable;
    if (this.sceneEditable === undefined) {
        this.sceneEditable = true;
    }

    this.functionEnable = options.functionEnable;
    if (this.functionEnable === undefined) {
        this.functionEnable = true;
    }

    this.messageEnable = options.messageEnable;
    if (this.messageEnable === undefined) {
        this.messageEnable = true;
    }

    this.variableEnable = options.variableEnable;
    if (this.variableEnable === undefined) {
        this.variableEnable = true;
    }

    this.listEnable = options.listEnable;
    if (this.listEnable === undefined) {
        this.listEnable = true;
    }

    this.doCommandAll = options.doCommandAll;
    if (this.doCommandAll === undefined) {
        this.doCommandAll = false;
    }

    this.hasVariableManager = options.hasvariablemanager;
    if (!(this.variableEnable || this.messageEnable || this.listEnable || this.functionEnable)) {
        this.hasVariableManager = false;
    } else if (this.hasVariableManager === undefined) {
        this.hasVariableManager = true;
    }

    this.readOnly = options.readOnly || false;
    if (this.readOnly) {
        this.soundEditable = false;
        this.sceneEditable = false;
        this.objectAddable = false;
    }

    if (options.isForLecture) {
        this.isForLecture = options.isForLecture;
    }
    if (options.textCodingEnable) {
        this.textCodingEnable = options.textCodingEnable;
    }
};

Entry.initFonts = function(fonts) {
    this.fonts = fonts;
    if (!fonts) {
        this.fonts = [];
    }
};

Entry.reloadOption = function(options) {
    this.options = options;
    this.parseOptions(options);
    this.playground.applyTabOption();
    this.variableContainer.applyOption();
    this.engine.applyOption();
    this.commander.applyOption();
};

Entry.Utils.initEntryEvent_ = function() {
    if (!Entry.events_) {
        Entry.events_ = [];
    }
};

/**
 * initialize sound
 * @param {sound object} sound
 */
Entry.initSound = function(sound) {
    if (!sound || !sound.duration || sound.duration == 0) {
        return;
    }
    sound.path =
        sound.fileurl ||
        `${Entry.defaultPath}/uploads/${sound.filename.substring(0, 2)}/${sound.filename.substring(
            2,
            4
        )}/${Entry.soundPath}${sound.filename}${sound.ext || '.mp3'}`;
    Entry.soundQueue.urls.add(sound.path);
    Entry.soundQueue.loadFile({
        id: sound.id,
        src: sound.path,
        type: createjs.LoadQueue.SOUND,
    });
    setTimeout(() => {
        Entry.soundQueue.loadCallback(sound.path);
    }, 3000);
};
