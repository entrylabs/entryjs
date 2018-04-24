'use strict';

Entry.Utils = {};

Entry.TEXT_ALIGN_CENTER = 0;

Entry.TEXT_ALIGN_LEFT = 1;

Entry.TEXT_ALIGN_RIGHT = 2;

Entry.TEXT_ALIGNS = ['center', 'left', 'right'];

Entry.clipboard = null;

/**
 * Load project
 * @param {?Project} project
 */
Entry.loadProject = function(project) {
    if (!project) {
        project = Entry.getStartProject(Entry.mediaFilePath);
    }

    if (this.type == 'workspace') Entry.stateManager.startIgnore();
    Entry.projectId = project._id;
    Entry.variableContainer.setVariables(project.variables);
    Entry.variableContainer.setMessages(project.messages);
    Entry.scene.addScenes(project.scenes);
    Entry.stage.initObjectContainers();
    Entry.variableContainer.setFunctions(project.functions);
    Entry.container.setObjects(project.objects);
    Entry.FPS = project.speed ? project.speed : 60;
    createjs.Ticker.setFPS(Entry.FPS);

    if (!Entry.engine.projectTimer) Entry.variableContainer.generateTimer();

    if (Object.keys(Entry.container.inputValue).length === 0)
        Entry.variableContainer.generateAnswer();
    Entry.start();
    if (this.options.programmingMode) {
        var mode = this.options.programmingMode;
        if (Entry.Utils.isNumber(mode)) {
            var pMode = mode;
            mode = {};

            this.mode = mode;
            if (pMode == 0) {
                mode.boardType = Entry.Workspace.MODE_BOARD;
                mode.textType = -1;
            } else if (pMode == 1) {
                // Python in Text Coding
                mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                mode.textType = Entry.Vim.TEXT_TYPE_PY;
                mode.runType = Entry.Vim.WORKSPACE_MODE;
            } else if (pMode == 2) {
                // Javascript in Text Coding
                mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                mode.textType = Entry.Vim.TEXT_TYPE_JS;
                mode.runType = Entry.Vim.MAZE_MODE;
            }
            Entry.getMainWS().setMode(mode);
        }
    }

    Entry.Loader.isLoaded() && Entry.Loader.handleLoad();

    if (this.type == 'workspace') Entry.stateManager.endIgnore();

    if (project.interface && Entry.options.loadInterface)
        Entry.loadInterfaceState(project.interface);

    if (window.parent && window.parent.childIframeLoaded)
        window.parent.childIframeLoaded();
    return project;
};

Entry.clearProject = function() {
    Entry.stop();
    Entry.projectId = null;
    Entry.type !== 'invisible' &&
        Entry.playground &&
        Entry.playground.changeViewMode('code');
    Entry.variableContainer.clear();
    Entry.container.clear();
    Entry.scene.clear();
};

/**
 * Export project
 * @param {?Project} project
 */
Entry.exportProject = function(project) {
    if (!project) project = {};

    if (!Entry.engine.isState('stop')) Entry.engine.toggleStop();

    var objects = (project.objects = Entry.container.toJSON());
    project.scenes = Entry.scene.toJSON();
    project.variables = Entry.variableContainer.getVariableJSON();
    project.messages = Entry.variableContainer.getMessageJSON();
    project.functions = Entry.variableContainer.getFunctionJSON();
    project.scenes = Entry.scene.toJSON();
    project.speed = Entry.FPS;
    project.interface = Entry.captureInterfaceState();

    if (!objects || !objects.length) return false;

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
        var json = { category: category.getAttribute('id'), blocks: [] };
        var blocks = category.childNodes;
        for (var j = 0; j < blocks.length; j++) {
            var b = blocks[j];
            if (
                b.tagName &&
                (b.tagName.toUpperCase() == 'BLOCK' ||
                    b.tagName.toUpperCase() == 'BTN')
            ) {
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
            localStorage.setItem(
                'workspace-interface',
                JSON.stringify(Entry.captureInterfaceState())
            );
        }
        if (!Entry.stateManager.isSaved())
            return Lang.Workspace.project_changed;
    }
};

Entry.captureInterfaceState = function() {
    var interfaceState = JSON.parse(JSON.stringify(Entry.interfaceState));
    var playground = Entry.playground;
    if (Entry.type == 'workspace' && playground && playground.object) {
        interfaceState.object = playground.object.id;
    }

    return interfaceState;
};

/**
 * load interface state by localstorage
 */
Entry.loadInterfaceState = function(interfaceState) {
    if (Entry.type == 'workspace') {
        if (interfaceState) {
            Entry.container.selectObject(interfaceState.object, true);
        } else if (
            localStorage &&
            localStorage.getItem('workspace-interface')
        ) {
            var interfaceModel = localStorage.getItem('workspace-interface');
            interfaceState = JSON.parse(interfaceModel);
        } else {
            interfaceState = {
                menuWidth: 280,
                canvasWidth: 480,
            };
        }
        this.resizeElement(interfaceState);
    }
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
    if (Entry.stateManager) Entry.stateManager.addActivity(activityType);
};

Entry.startActivityLogging = function() {
    if (Entry.reporter)
        Entry.reporter.start(
            Entry.projectId,
            window.user ? window.user._id : null,
            Entry.startTime
        );
};

/**
 * return activity log
 * @return {object}
 */
Entry.getActivityLog = function() {
    var log = {};
    if (Entry.stateManager) log.activityLog = Entry.stateManager.activityLog_;
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
    var type = e.type;
    if (
        !object.isEditing ||
        ((tagName === 'INPUT' && isCurrent) || type === 'touchstart')
    )
        return;
    object.editObjectValues(false);
};

Entry.generateFunctionSchema = function(functionId) {
    functionId = 'func_' + functionId;
    if (Entry.block[functionId]) return;
    var blockSchema = function() {};
    var blockPrototype = Entry.block.function_general;
    blockSchema.prototype = blockPrototype;
    blockSchema = new blockSchema();
    blockSchema.changeEvent = new Entry.Event();
    blockSchema.template = Lang.template.function_general;

    Entry.block[functionId] = blockSchema;
};

Entry.getMainWS = function() {
    var ret;
    if (Entry.mainWorkspace) ret = Entry.mainWorkspace;
    else if (Entry.playground && Entry.playground.mainWorkspace)
        ret = Entry.playground.mainWorkspace;
    return ret;
};

Entry.getDom = function(query) {
    if (!query) return this.view_;

    query = JSON.parse(JSON.stringify(query));
    if (query.length > 1) {
        var key = query.shift();
        return this[key].getDom(query);
    } else {
    }
};

/**
 * Resize element's size.
 * @param {!json} interfaceModel
 */
Entry.resizeElement = function(interfaceModel) {
    var mainWorkspace = Entry.getMainWS();
    if (!mainWorkspace) return;

    if (!interfaceModel) interfaceModel = this.interfaceState;

    if (Entry.type == 'workspace') {
        var interfaceState = this.interfaceState;
        if (!interfaceModel.canvasWidth && interfaceState.canvasWidth)
            interfaceModel.canvasWidth = interfaceState.canvasWidth;
        if (!interfaceModel.menuWidth && this.interfaceState.menuWidth)
            interfaceModel.menuWidth = interfaceState.menuWidth;

        if (Entry.engine.speedPanelOn) Entry.engine.toggleSpeedPanel();

        var canvasSize = interfaceModel.canvasWidth;
        if (!canvasSize) canvasSize = 400;
        else if (canvasSize < 325) canvasSize = 325;
        else if (canvasSize > 720) canvasSize = 720;
        interfaceModel.canvasWidth = canvasSize;

        var canvasHeight = canvasSize * 9 / 16;

        Entry.engine.view_.style.width = canvasSize + 'px';
        Entry.engine.view_.style.height = canvasHeight + 'px';
        Entry.engine.view_.style.top = '40px';
        Entry.stage.canvas.canvas.style.width = canvasSize + 'px';
        if (canvasSize >= 400) {
            Entry.engine.view_.removeClass('collapsed');
        } else {
            Entry.engine.view_.addClass('collapsed');
        }
        Entry.playground.view_.style.left = canvasSize + 0.5 + 'px';

        Entry.propertyPanel.resize(canvasSize);

        var addButton = Entry.engine.view_.getElementsByClassName(
            'entryAddButtonWorkspace_w'
        )[0];
        if (addButton) {
            var addButtonStyle = addButton.style;
            if (Entry.objectAddable) {
                addButtonStyle.top = canvasHeight + 25 + 'px';
                addButtonStyle.width = canvasSize * 0.7 + 'px';
            }
        }
        var pauseButton = Entry.engine.view_.getElementsByClassName(
            'entryPauseButtonWorkspace_w'
        )[0];
        if (pauseButton) {
            var pauseButtonStyle = pauseButton.style;
            if (Entry.objectAddable) {
                pauseButtonStyle.top = canvasHeight + 25 + 'px';
                pauseButtonStyle.width = canvasSize * 0.7 + 'px';
            }
        }

        var runButton = Entry.engine.view_.getElementsByClassName(
            'entryRunButtonWorkspace_w'
        )[0];
        if (runButton) {
            var runButtonStyle = runButton.style;
            if (Entry.objectAddable) {
                runButtonStyle.top = canvasHeight + 25 + 'px';
                runButtonStyle.left = canvasSize * 0.7 + 'px';
                runButtonStyle.width = canvasSize * 0.3 + 'px';
            } else {
                runButtonStyle.left = '2px';
                runButtonStyle.top = canvasHeight + 25 + 'px';
                runButtonStyle.width = canvasSize - 4 + 'px';
            }
        }

        var stopButton = Entry.engine.view_.getElementsByClassName(
            'entryStopButtonWorkspace_w'
        )[0];
        if (stopButton) {
            var stopButtonStyle = stopButton.style;
            if (Entry.objectAddable) {
                stopButtonStyle.top = canvasHeight + 25 + 'px';
                stopButtonStyle.left = canvasSize * 0.7 + 'px';
                stopButtonStyle.width = canvasSize * 0.3 + 'px';
            } else {
                stopButtonStyle.left = '2px';
                stopButtonStyle.top = canvasHeight + 25 + 'px';
                stopButtonStyle.width = canvasSize + 'px';
            }
        }

        var menuWidth = interfaceModel.menuWidth;
        if (!menuWidth) menuWidth = 264;
        else if (menuWidth < 244) menuWidth = 244;
        else if (menuWidth > 400) menuWidth = 400;
        interfaceModel.menuWidth = menuWidth;

        var blockMenu = mainWorkspace.blockMenu;
        var adjust = blockMenu.hasCategory() ? -64 : 0;

        $('.blockMenuContainer').css({ width: menuWidth + adjust + 'px' });
        $('.blockMenuContainer>svg').css({ width: menuWidth + adjust + 'px' });
        blockMenu.setWidth();
        $('.entryWorkspaceBoard').css({ left: menuWidth + 'px' });
        Entry.playground.resizeHandle_.style.left = menuWidth + 'px';
        Entry.playground.variableViewWrapper_.style.width = menuWidth + 'px';

        this.interfaceState = interfaceModel;
    }

    Entry.windowResized.notify();
};

/**
 * override native prototype to add useful method.
 */
Entry.overridePrototype = function() {
    /** modulo include negative number */
    Number.prototype.mod = function(n) {
        return (this % n + n) % n;
    };

    //polyfill
    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
            'use strict';
            if (this == null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var str = '' + this;
            count = +count;
            if (count != count) {
                count = 0;
            }
            if (count < 0) {
                throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
                throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
                return '';
            }
            // Ensuring count is a 31-bit integer allows us to heavily optimize the
            // main part. But anyway, most current (August 2014) browsers can't handle
            // strings 1 << 28 chars or longer, so:
            if (str.length * count >= 1 << 28) {
                throw new RangeError(
                    'repeat count must not overflow maximum string size'
                );
            }
            var rpt = '';
            for (;;) {
                if ((count & 1) == 1) {
                    rpt += str;
                }
                count >>>= 1;
                if (count == 0) {
                    break;
                }
                str += str;
            }
            // Could we try:
            // return Array(count + 1).join(this);
            return rpt;
        };
    }
};

// INFO: 기존에 사용하던 isNaN에는 숫자 체크의 문자가 있을수 있기때문에 regex로 체크하는 로직으로 변경
// isNaN 문제는 https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/isNaN
// 에서 확인.
Entry.Utils.isNumber = function(num) {
    if (typeof num === 'number') {
        return true;
    }
    var reg = /^-?\d+\.?\d*$/;
    if (typeof num === 'string' && reg.test(num)) {
        return true;
    } else {
        return false;
    }
};

Entry.Utils.generateId = function() {
    return (
        '0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
    ).substr(-4);
};

Entry.Utils.intersectArray = function(x, y) {
    var ret = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                ret.push(x[i]);
                break;
            }
        }
    }
    return ret;
};

Entry.Utils.isPointInMatrix = function(matrix, point, offset) {
    offset = offset === undefined ? 0 : offset;
    var x = matrix.offsetX ? matrix.x + matrix.offsetX : matrix.x;
    var y = matrix.offsetY ? matrix.y + matrix.offsety : matrix.y;
    return (
        x - offset <= point.x &&
        x + matrix.width + offset >= point.x &&
        y - offset <= point.y &&
        y + matrix.height + offset >= point.y
    );
};

Entry.Utils.colorDarken = function(color, factor) {
    var r, g, b;
    if (color.length === 7) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
    } else {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(2, 2), 16);
        b = parseInt(color.substr(3, 2), 16);
    }

    factor = factor === undefined ? 0.7 : factor;
    r = inspect(Math.floor(r * factor).toString(16));
    g = inspect(Math.floor(g * factor).toString(16));
    b = inspect(Math.floor(b * factor).toString(16));

    function inspect(val) {
        if (val.length != 2) val = '0' + val;
        return val;
    }

    return '#' + r + g + b;
};

Entry.Utils.colorLighten = function(color, amount) {
    function clamp01(val) {
        return Math.min(1, Math.max(0, val));
    }

    amount = amount === 0 ? 0 : amount || 20;
    var hsl = Entry.Utils.hexToHsl(color);
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return Entry.Utils.hslToHex(hsl);
};

Entry.Utils._EmphasizeColorMap = {
    '#3BBD70': '#5BC982',
    '#498DEB': '#62A5F4',
    '#A751E3': '#C08FF7',
    '#EC4466': '#F46487',
    '#FF9E20': '#FFB05A',
    '#A4D01D': '#C4DD31',
    '#00979D': '#09BAB5',
    '#FFD974': '#FCDA90',
    '#E457DC': '#F279F2',
    '#CC7337': '#DD884E',
    '#AEB8FF': '#C0CBFF',
    '#FFCA36': '#F2C670',
};

Entry.Utils.getEmphasizeColor = function(color) {
    var colorKey = color.toUpperCase();
    return Entry.Utils._EmphasizeColorMap[colorKey] || color;
};

// Take input from [0, n] and return it as [0, 1]
Entry.Utils.bound01 = function(n, max) {
    function isOnePointZero(n) {
        return (
            typeof n == 'string' && n.indexOf('.') != -1 && parseFloat(n) === 1
        );
    }

    function isPercentage(n) {
        return typeof n === 'string' && n.indexOf('%') != -1;
    }

    if (isOnePointZero(n)) {
        n = '100%';
    }

    var processPercent = isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
};

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
Entry.Utils.hexToHsl = function(color) {
    var r, g, b;
    if (color.length === 7) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
    } else {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(2, 2), 16);
        b = parseInt(color.substr(3, 2), 16);
    }

    r = Entry.Utils.bound01(r, 255);
    g = Entry.Utils.bound01(g, 255);
    b = Entry.Utils.bound01(b, 255);

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    var hsl = { h: h, s: s, l: l };
    return { h: hsl.h * 360, s: hsl.s, l: hsl.l };
};

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
Entry.Utils.hslToHex = function(color) {
    var r, g, b;

    var h = Entry.Utils.bound01(color.h, 360);
    var s = Entry.Utils.bound01(color.s, 1);
    var l = Entry.Utils.bound01(color.l, 1);

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    var rgb = { r: r * 255, g: g * 255, b: b * 255 };

    var hex = [
        pad2(Math.round(rgb.r).toString(16)),
        pad2(Math.round(rgb.g).toString(16)),
        pad2(Math.round(rgb.b).toString(16)),
    ];

    return '#' + hex.join('');
};

Entry.Utils.setSVGDom = function(SVGDom) {
    Entry.Utils.SVGDom = SVGDom;
};

Entry.Utils.bindIOSDeviceWatch = function() {
    var Agent = Entry.Utils.mobileAgentParser();
    if (Agent.apple.device) {
        console.log('APPLE! MOBILE DEVICE');
        var lastHeight =
            window.innerHeight || document.documentElement.clientHeight;
        var lastSVGDomHeight = 0;
        if (Entry.Utils.SVGDom) {
            lastSVGDomHeight = Entry.Utils.SVGDom.height();
        }

        setInterval(function() {
            var nowHeight =
                window.innerHeight || document.documentElement.clientHeight;
            var SVGDomCheck = false;
            if (Entry.Utils.SVGDom) {
                var nowSVGDomHeight = Entry.Utils.SVGDom.height();
                SVGDomCheck = lastSVGDomHeight != nowSVGDomHeight;
                lastSVGDomHeight = nowSVGDomHeight;
            }
            if (lastHeight != nowHeight || SVGDomCheck) {
                Entry.windowResized.notify();
            }
            lastHeight = nowHeight;
        }, 1000);

        $(window).on('orientationchange', function(e) {
            Entry.windowResized.notify();
        });
    }
};

Entry.Utils.bindGlobalEvent = function(options) {
    var doc = $(document);
    if (options === undefined)
        options = [
            'resize',
            'mousedown',
            'mousemove',
            'keydown',
            'keyup',
            'dispose',
        ];

    if (options.indexOf('resize') > -1) {
        if (Entry.windowReszied) {
            $(window).off('resize');
            Entry.windowReszied.clear();
        }
        Entry.windowResized = new Entry.Event(window);
        $(window).on('resize', function(e) {
            Entry.windowResized.notify(e);
        });
        Entry.Utils.bindIOSDeviceWatch();
    }

    if (options.indexOf('mousedown') > -1) {
        if (Entry.documentMousedown) {
            doc.off('mousedown');
            Entry.documentMousedown.clear();
        }
        Entry.documentMousedown = new Entry.Event(window);
        doc.on('mousedown', function(e) {
            Entry.documentMousedown.notify(e);
        });
    }

    if (options.indexOf('mousemove') > -1) {
        if (Entry.documentMousemove) {
            doc.off('touchmove mousemove');
            Entry.documentMousemove.clear();
        }

        Entry.mouseCoordinate = {};
        Entry.documentMousemove = new Entry.Event(window);
        doc.on('touchmove mousemove', function(e) {
            if (e.originalEvent && e.originalEvent.touches)
                e = e.originalEvent.touches[0];
            Entry.documentMousemove.notify(e);
            Entry.mouseCoordinate.x = e.clientX;
            Entry.mouseCoordinate.y = e.clientY;
        });
    }

    if (options.indexOf('keydown') > -1) {
        if (Entry.keyPressed) {
            doc.off('keydown');
            Entry.keyPressed.clear();
        }
        Entry.pressedKeys = [];
        Entry.keyPressed = new Entry.Event(window);
        doc.on('keydown', function(e) {
            var keyCode = e.keyCode;

            if (Entry.pressedKeys.indexOf(keyCode) < 0)
                Entry.pressedKeys.push(keyCode);
            Entry.keyPressed.notify(e);
        });
    }

    if (options.indexOf('keyup') > -1) {
        if (Entry.keyUpped) {
            doc.off('keyup');
            Entry.keyUpped.clear();
        }
        Entry.keyUpped = new Entry.Event(window);
        doc.on('keyup', function(e) {
            var keyCode = e.keyCode;
            var index = Entry.pressedKeys.indexOf(keyCode);
            if (index > -1) Entry.pressedKeys.splice(index, 1);
            Entry.keyUpped.notify(e);
        });
    }

    if (options.indexOf('dispose') > -1) {
        if (Entry.disposeEvent) Entry.disposeEvent.clear();
        Entry.disposeEvent = new Entry.Event(window);
        if (Entry.documentMousedown)
            Entry.documentMousedown.attach(this, function(e) {
                Entry.disposeEvent.notify(e);
            });
    }
};

Entry.Utils.makeActivityReporter = function() {
    Entry.activityReporter = new Entry.ActivityReporter();
    if (Entry.commander) Entry.commander.addReporter(Entry.activityReporter);
    return Entry.activityReporter;
};

/**
 * Sample color code for user select
 * @type {!Array<string>}
 */
Entry.sampleColours = [];

/**
 * Raise error when assert condition fail.
 * @param {!boolean} condition assert condition.
 * @param {?string} message assert message will be shown when assert fail.
 */
Entry.assert = function(condition, message) {
    if (!condition) {
        throw Error(message || 'Assert failed');
    }
};

/**
 * Parse Text to Xml
 * @param {!string} xmlText
 * @param {xml} doc
 */
Entry.parseTexttoXML = function(xmlText) {
    var doc;
    if (window.ActiveXObject) {
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(xmlText);
    } else {
        var parser = new DOMParser();
        doc = parser.parseFromString(xmlText, 'text/xml');
    }
    return doc;
};

/**
 * Create html element with some method
 * @param {!string} type
 * @param {string} elementId
 * @return {!Element}
 */
Entry.createElement = function(type, elementId) {
    var element;
    if (type instanceof HTMLElement) element = type;
    else var element = document.createElement(type);
    if (elementId) element.id = elementId;

    element.hasClass = function(className) {
        return this.className.match(
            new RegExp('(\\s|^)' + className + '(\\s|$)')
        );
    };
    element.addClass = function(className) {
        var current = this.className;
        for (var i = 0; i < arguments.length; i++) {
            var className = arguments[i];
            if (!this.hasClass(className)) current += ' ' + className;
        }
        this.className = current;
    };
    element.removeClass = function(className) {
        var current = this.className;
        for (var i = 0; i < arguments.length; i++) {
            var className = arguments[i];
            if (this.hasClass(className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                current = current.replace(reg, ' ');
            }
        }
        this.className = current;
    };
    element.bindOnClick = function(func) {
        $(this).on('click tab', function(e) {
            if (element.disabled) return;
            e.stopImmediatePropagation();
            func.call(this, e);
        });
    };
    element.unBindOnClick = function(func) {
        $(this).off('click tab');
    };
    return element;
};

Entry.makeAutolink = function(html) {
    if (html) {
        var regURL = new RegExp(
            '(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()][^)\\]}]+)',
            'gi'
        );
        var regEmail = new RegExp(
            '([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+.[a-z0-9-]+)',
            'gi'
        );
        return html
            .replace(regURL, "<a href='$1://$2' target='_blank'>$1://$2</a>")
            .replace(regEmail, "<a href='mailto:$1'>$1</a>");
    } else {
        return '';
    }
};

/**
 * Generate random hash
 * @return {string}
 */
Entry.generateHash = function() {
    return (
        '0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
    ).substr(-4);
};

/**
 * Add event listener
 * @param {!string} eventName
 * @param {function} fn
 */
Entry.addEventListener = function(eventName, fn) {
    if (!this.events_) this.events_ = {};

    if (!this.events_[eventName]) {
        this.events_[eventName] = [];
    }
    if (fn instanceof Function) this.events_[eventName].push(fn);

    return true;
};

/**
 * Dispatch event
 * @param {!string} eventName
 * @param {?} params
 */
Entry.dispatchEvent = function(eventName, params) {
    if (!this.events_) {
        this.events_ = {};
        return;
    }

    var events = this.events_[eventName];
    if (!events || events.length === 0) return;

    var args = Array.prototype.slice.call(arguments);
    args.shift();

    events.forEach(function(func) {
        func.apply(window, args);
    });
};

/**
 * Remove event listener
 * @param {!string} eventName
 */
Entry.removeEventListener = function(eventName, fn) {
    if (this.events_[eventName]) {
        for (var i = 0, l = this.events_[eventName].length; i < l; i++) {
            if (this.events_[eventName][i] === fn) {
                this.events_[eventName].splice(i, 1);
                break;
            }
        }
    }
};

/**
 * Remove event listener
 * @param {!string} eventName
 */
Entry.removeAllEventListener = function(eventName) {
    if (!this.events_ || !this.events_[eventName]) return;
    delete this.events_[eventName];
};

/**
 * Add two number properly.
 *
 * @return {number}
 *
 * @param {!number} a
 * @param {!number} b
 */
Entry.addTwoNumber = function(a, b) {
    if (!Entry.Utils.isNumber(a) || !Entry.Utils.isNumber(b)) {
        return a + b;
    }
    a += '';
    b += '';

    var indexA = a.indexOf('.'),
        indexB = b.indexOf('.');
    var fixedA = 0,
        fixedB = 0;
    if (indexA > 0) var fixedA = a.length - indexA - 1;

    if (indexB > 0) var fixedB = b.length - indexB - 1;

    if (fixedA > 0 || fixedB > 0) {
        if (fixedA >= fixedB) {
            return (parseFloat(a) + parseFloat(b)).toFixed(fixedA);
        } else {
            return (parseFloat(a) + parseFloat(b)).toFixed(fixedB);
        }
    } else {
        return parseInt(a) + parseInt(b);
    }
};

/*
 * HTML hex colour code to RGB colour value
 */
Entry.hex2rgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
};

/*
 * RGB colour value to HTML hex colour code
 */
Entry.rgb2hex = function(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/*
 * Generate random rgb color object
 */
Entry.generateRgb = function() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
};

/*
 * Adjustment input value by max and min value
 * @param {!Number} value, min, max
 */
Entry.adjustValueWithMaxMin = function(input, min, max) {
    if (input > max) {
        return max;
    } else if (input < min) {
        return min;
    } else return input;
};

/*
 * Inspect input value exists already in an array
 * @param {String} targetValue
 * @param {String} identifier
 * @param {Array} arr
 * @return {boolean} return true when target value exists already
 */
Entry.isExist = function(targetValue, identifier, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][identifier] == targetValue) return arr[i];
    }

    return false;
};

Entry.getColourCodes = function() {
    return [
        'transparent',
        '#660000',
        '#663300',
        '#996633',
        '#003300',
        '#003333',
        '#003399',
        '#000066',
        '#330066',
        '#660066',
        '#FFFFFF',
        '#990000',
        '#993300',
        '#CC9900',
        '#006600',
        '#336666',
        '#0033FF',
        '#000099',
        '#660099',
        '#990066',
        '#000000',
        '#CC0000',
        '#CC3300',
        '#FFCC00',
        '#009900',
        '#006666',
        '#0066FF',
        '#0000CC',
        '#663399',
        '#CC0099',
        '#333333',
        '#FF0000',
        '#FF3300',
        '#FFFF00',
        '#00CC00',
        '#009999',
        '#0099FF',
        '#0000FF',
        '#9900CC',
        '#FF0099',
        '#666666',
        '#CC3333',
        '#FF6600',
        '#FFFF33',
        '#00FF00',
        '#00CCCC',
        '#00CCFF',
        '#3366FF',
        '#9933FF',
        '#FF00FF',
        '#999999',
        '#FF6666',
        '#FF6633',
        '#FFFF66',
        '#66FF66',
        '#66CCCC',
        '#00FFFF',
        '#3399FF',
        '#9966FF',
        '#FF66FF',
        '#BBBBBB',
        '#FF9999',
        '#FF9966',
        '#FFFF99',
        '#99FF99',
        '#66FFCC',
        '#99FFFF',
        '#66CCff',
        '#9999FF',
        '#FF99FF',
        '#CCCCCC',
        '#FFCCCC',
        '#FFCC99',
        '#FFFFCC',
        '#CCFFCC',
        '#99FFCC',
        '#CCFFFF',
        '#99CCFF',
        '#CCCCFF',
        '#FFCCFF',
    ];
};

/*
 * Replacement for element.remove() method
 * @param {Element} targetElement
 * @return {boolean} return true when target element remove or not
 */
Entry.removeElement = function(element) {
    if (element && element.parentNode) element.parentNode.removeChild(element);
};

/*
 * Replacement for elements.getElementsByClassName(className)
 * @param {String} class name
 * @return {Array} arr
 */
Entry.getElementsByClassName = function(cl) {
    var retnode = [];
    var elem = document.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
        if ((' ' + elem[i].className + ' ').indexOf(' ' + cl + ' ') > -1)
            retnode.push(elem[i]);
    }
    return retnode;
};

/*
 * parse string to number
 * @param {String||Number} value
 * @return {Boolean||Number} arr
 */
Entry.parseNumber = function(value) {
    if (typeof value == 'string') {
        if (
            (Entry.Utils.isNumber(value) && value[0] === '0') ||
            (value[0] === '0' && value[1].toLowerCase() === 'x')
        )
            return value;
        else if (Entry.Utils.isNumber(value)) return Number(value);
    } else if (typeof value == 'number' && Entry.Utils.isNumber(value)) {
        return value;
    }

    return false;
};

/**
 * count length of string.
 * Hanguel character is count to two.
 * @param {!String} dataString
 * @return {Number}
 */
Entry.countStringLength = function(dataString) {
    var p,
        len = 0;
    for (p = 0; p < dataString.length; p++) {
        if (dataString.charCodeAt(p) > 255) len += 2;
        else len++;
    }
    return len;
};

/**
 * count length of string.
 * Hanguel character is count to two.
 * @param {!String} dataString
 * @param {!Number} stringLength
 * @return {String}
 */
Entry.cutStringByLength = function(dataString, stringLength) {
    var p,
        len = 0;
    for (p = 0; len < stringLength && p < dataString.length; p++) {
        if (dataString.charCodeAt(p) > 255) len += 2;
        else len++;
    }
    return dataString.substr(0, p);
};

/**
 * check to element is are parent child.
 * @param {Element} parent
 * @param {Element} child
 * @return {Boolean}
 */
Entry.isChild = function(parent, child) {
    if (!child) {
        while (child.parentNode) {
            if ((child = child.parentNode) == parent) return true;
        }
    }
    return false;
};

/**
 * @param {Element} child
 */
Entry.launchFullScreen = function(element) {
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFulScreen) element.mozRequestFulScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullScreen) element.msRequestFullScreen();
};

Entry.exitFullScreen = function() {
    if (document.exitFullScreen) document.exitFullScreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
};

Entry.isPhone = function() {
    return false;
    //if (window.screen.availWidth > 480)
    //return false;
    //else
    //return true;
};

Entry.getKeyCodeMap = function() {
    return {
        '65': 'a',
        '66': 'b',
        '67': 'c',
        '68': 'd',
        '69': 'e',
        '70': 'f',
        '71': 'g',
        '72': 'h',
        '73': 'i',
        '74': 'j',
        '75': 'k',
        '76': 'l',
        '77': 'm',
        '78': 'n',
        '79': 'o',
        '80': 'p',
        '81': 'q',
        '82': 'r',
        '83': 's',
        '84': 't',
        '85': 'u',
        '86': 'v',
        '87': 'w',
        '88': 'x',
        '89': 'y',
        '90': 'z',
        '32': Lang.Blocks.START_press_some_key_space,
        '37': Lang.Blocks.START_press_some_key_left,
        '38': Lang.Blocks.START_press_some_key_up,
        '39': Lang.Blocks.START_press_some_key_right,
        '40': Lang.Blocks.START_press_some_key_down,
        '48': '0',
        '49': '1',
        '50': '2',
        '51': '3',
        '52': '4',
        '53': '5',
        '54': '6',
        '55': '7',
        '56': '8',
        '57': '9',
        '13': Lang.Blocks.START_press_some_key_enter,
        '27': 'esc',
        '17': 'ctrl',
        '18': 'alt',
        '9': 'tab',
        '16': 'shift',
        '8': 'backspace',
    };
};

Entry.checkCollisionRect = function(rectA, rectB) {
    return !(
        rectA.y + rectA.height < rectB.y ||
        rectA.y > rectB.y + rectB.height ||
        rectA.x + rectA.width < rectB.x ||
        rectA.x > rectB.x + rectB.width
    );
};

Entry.bindAnimationCallback = function(element, func) {
    element.addEventListener('webkitAnimationEnd', func, false);
    element.addEventListener('animationend', func, false);
    element.addEventListener('oanimationend', func, false);
};

Entry.cloneSimpleObject = function(object) {
    var clone = {};
    for (var i in object) clone[i] = object[i];
    return clone;
};

Entry.nodeListToArray = function(nl) {
    var arr = new Array(nl.length);
    for (var i = -1, l = nl.length; ++i !== l; arr[i] = nl[i]);
    return arr;
};

Entry.computeInputWidth = (function() {
    var elem;
    var _cache = {};
    return function(value) {
        value = value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        var cached = _cache[value];
        if (cached) return cached;
        else {
            elem = elem || document.getElementById('entryInputForComputeWidth');
            if (!elem) {
                elem = document.createElement('span');
                elem.setAttribute('id', 'entryInputForComputeWidth');
                elem.className = 'elem-element';
                document.body.appendChild(elem);
            }

            elem.innerHTML = value;
            var ret = Number(elem.offsetWidth + 10) + 'px';

            if (window.fontLoaded) _cache[value] = ret;
            return ret;
        }
    };
})();

Entry.isArrowOrBackspace = function(keyCode) {
    return !!~[37, 38, 39, 40, 8].indexOf(keyCode);
};

Entry.hexStringToBin = function(hexString) {
    var bytes = [],
        str;

    for (var i = 0; i < hexString.length - 1; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }

    str = String.fromCharCode.apply(String, bytes);
    return str;
};

Entry.findObjsByKey = function(arr, keyName, key) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][keyName] == key) result.push(arr[i]);
    }
    return result;
};

Entry.factorials = [];

Entry.factorial = function(n) {
    if (n === 0 || n == 1) return 1;
    if (Entry.factorials[n] > 0) return Entry.factorials[n];

    var ret = (Entry.factorials[n] = Entry.factorial(n - 1) * n);
    return ret;
};

Entry.getListRealIndex = function(index, list) {
    if (!Entry.Utils.isNumber(index)) {
        switch (index) {
            case 'FIRST':
                index = 1;
                break;
            case 'LAST':
                index = list.array_.length;
                break;
            case 'RANDOM':
                index = Math.floor(Math.random() * list.array_.length) + 1;
                break;
        }
    }
    return index;
};

Entry.toRadian = function(angle) {
    return angle * Math.PI / 180;
};

Entry.toDegrees = function(radians) {
    return radians * 180 / Math.PI;
};

Entry.getPicturesJSON = function(pictures, isClone) {
    var json = [];
    for (var i = 0, len = pictures.length; i < len; i++) {
        var p = pictures[i];
        var o = {};
        o._id = p._id;
        o.id = isClone ? Entry.generateHash() : p.id;
        o.dimension = p.dimension;
        o.filename = p.filename;
        o.fileurl = p.fileurl;
        o.name = p.name;
        o.scale = p.scale;
        json.push(o);
    }
    return json;
};

Entry.getSoundsJSON = function(sounds, isClone) {
    var json = [];
    for (var i = 0, len = sounds.length; i < len; i++) {
        var s = sounds[i];
        var o = {};
        o._id = s._id;
        o.duration = s.duration;
        o.ext = s.ext;
        o.id = isClone ? Entry.generateHash() : s.id;
        o.filename = s.filename;
        o.fileurl = s.fileurl;
        o.name = s.name;
        json.push(o);
    }
    return json;
};

Entry.cutDecimal = function(number) {
    return Math.round(number * 100) / 100;
};

Entry.getBrowserType = function() {
    if (Entry.userAgent) return Entry.userAgent;
    var ua = navigator.userAgent,
        tem,
        M =
            ua.match(
                /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
            ) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null)
            return tem
                .slice(1)
                .join(' ')
                .replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    var uaResult = M.join(' ');
    Entry.userAgent = uaResult;
    return uaResult;
};

Entry.setBasicBrush = function(sprite) {
    var brush = new createjs.Graphics();
    if (sprite.brush) {
        var parentBrush = sprite.brush;
        brush.thickness = parentBrush.thickness;
        brush.rgb = parentBrush.rgb;

        brush.opacity = parentBrush.opacity;
        brush.setStrokeStyle(brush.thickness);
        brush.beginStroke(
            'rgba(' +
                brush.rgb.r +
                ',' +
                brush.rgb.g +
                ',' +
                brush.rgb.b +
                ',' +
                brush.opacity / 100 +
                ')'
        );
    } else {
        brush.thickness = 1;
        brush.rgb = Entry.hex2rgb('#ff0000');
        brush.opacity = 100;
        brush.setStrokeStyle(1);
        brush.beginStroke('rgba(255,0,0,1)');
    }

    brush.entity = sprite;

    var shape = new createjs.Shape(brush);
    shape.entity = sprite;
    var selectedObjectContainer = Entry.stage.selectedObjectContainer;
    selectedObjectContainer.addChildAt(
        shape,
        selectedObjectContainer.getChildIndex(sprite.object)
    );

    if (sprite.brush) sprite.brush = null;
    sprite.brush = brush;

    sprite.shapes.push(shape);
};

Entry.setCloneBrush = function(sprite, parentBrush) {
    var brush = new createjs.Graphics();
    brush.thickness = parentBrush.thickness;
    brush.rgb = parentBrush.rgb;

    brush.opacity = parentBrush.opacity;
    brush.setStrokeStyle(brush.thickness);
    brush.beginStroke(
        'rgba(' +
            brush.rgb.r +
            ',' +
            brush.rgb.g +
            ',' +
            brush.rgb.b +
            ',' +
            brush.opacity / 100 +
            ')'
    );

    var shape = new createjs.Shape(brush);
    shape.entity = sprite;
    var selectedObjectContainer = Entry.stage.selectedObjectContainer;
    selectedObjectContainer.addChildAt(
        shape,
        selectedObjectContainer.getChildIndex(sprite.object)
    );

    brush.stop = parentBrush.stop;

    if (sprite.brush) sprite.brush = null;
    sprite.brush = brush;

    sprite.shapes.push(shape);
};

Entry.isFloat = function(num) {
    return /\d+\.{1}\d+$/.test(num);
};

Entry.isInteger = function(value) {
    return isFinite(value) && Math.floor(value) == value;
};

Entry.getStringIndex = function(str) {
    if (!str) return '';
    var result = {
        string: str,
        index: 1,
    };
    var idx = 0;
    var num = [];
    var len = str.length;
    for (var i = len - 1; i > 0; --i) {
        var ch = str.charAt(i);
        if (Entry.Utils.isNumber(ch)) {
            num.unshift(ch);
            idx = i;
        } else {
            break;
        }
    }

    if (idx > 0) {
        result.string = str.substring(0, idx);
        result.index = parseInt(num.join('')) + 1;
    }

    return result;
};

Entry.getOrderedName = function(str, objects, field) {
    if (!str) return 'untitled';
    if (!objects || objects.length === 0) return str;
    if (!field) field = 'name';

    const maxNumber = Entry.getOrderedNameNumber(str, objects, field);
    const source = Entry.getStringIndex(str);
    if (maxNumber > 0) return source.string + maxNumber;
    return str;
};

Entry.getOrderedNameNumber = function(str, objects, field) {
    const source = Entry.getStringIndex(str);
    let maxNumber = 0;
    for (var i = 0, len = objects.length; i < len; i++) {
        var target = Entry.getStringIndex(objects[i][field]);
        if (source.string === target.string && target.index > maxNumber) {
            maxNumber = target.index;
        }
    }
    return maxNumber;
};

Entry.changeXmlHashId = function(xmlBlock) {
    var reg = /function_field/;
    if (reg.test(xmlBlock.getAttribute('type'))) {
        var mutations = xmlBlock.getElementsByTagName('mutation');
        for (var i = 0, len = mutations.length; i < len; i++)
            mutations[i].setAttribute('hashid', Entry.generateHash());
    }
    return xmlBlock;
};

Entry.getMaxFloatPoint = function(numbers) {
    var max = 0;
    for (var i = 0, len = numbers.length; i < len; i++) {
        var n = String(numbers[i]);
        var idx = n.indexOf('.');
        if (idx !== -1) {
            var tmp = n.length - (idx + 1);
            if (tmp > max) max = tmp;
        }
    }
    return Math.min(max, 20);
};

Entry.convertToRoundedDecimals = function(value, decimals) {
    if (!Entry.Utils.isNumber(value) || !this.isFloat(value)) return value;
    else return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

Entry.attachEventListener = function(elem, eventType, func) {
    setTimeout(function() {
        elem.addEventListener(eventType, func);
    }, 0);
};

Entry.deAttachEventListener = function(elem, eventType, func) {
    elem.removeEventListener(eventType, func);
};

Entry.isEmpty = function(obj) {
    if (!obj) return true;

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
};

Entry.Utils.disableContextmenu = function(node) {
    if (!node) return;

    $(node).on('contextmenu', this.contextPreventFunction);
};

Entry.Utils.contextPreventFunction = function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
};

Entry.Utils.enableContextmenu = function(node) {
    if (!node) return;

    $(node).off('contextmenu', this.contextPreventFunction);
};

Entry.Utils.isRightButton = function(e) {
    return e.button == 2 || e.ctrlKey;
};

Entry.Utils.isTouchEvent = function(e) {
    return e.type.toLowerCase() !== 'mousedown';
};

Entry.Utils.inherit = function(parent, child) {
    function F() {}
    F.prototype = parent.prototype;
    child.prototype = new F();
    return child;
};

Entry.bindAnimationCallbackOnce = function($elem, func) {
    $elem.one('webkitAnimationEnd animationendo animationend', func);
};

Entry.Utils.isInInput = function(e) {
    return e.target.type == 'textarea' || e.target.type == 'text';
};

Entry.Utils.isFunction = function(fn) {
    return typeof fn === 'function';
};

Entry.Utils.addFilters = function(boardSvgDom, suffix) {
    var defs = boardSvgDom.elem('defs');

    //trashcan filter
    var trashCanFilter = defs.elem('filter', {
        id: 'entryTrashcanFilter_' + suffix,
    });
    trashCanFilter.elem('feGaussianBlur', {
        in: 'SourceAlpha',
        stdDeviation: 2,
        result: 'blur',
    });
    trashCanFilter.elem('feOffset', {
        in: 'blur',
        dx: 1,
        dy: 1,
        result: 'offsetBlur',
    });
    var feMerge = trashCanFilter.elem('feMerge');
    feMerge.elem('feMergeNode', {
        in: 'offsetBlur',
    });
    feMerge.elem(
        'feMergeNode',
        {
            in: 'SourceGraphic',
        },
        feMerge
    );

    var blockFilter = defs.elem('filter', {
        id: 'entryBlockShadowFilter_' + suffix,
    });
    blockFilter.elem('feOffset', {
        result: 'offOut',
        in: 'SourceGraphic',
        dx: 0,
        dy: 1,
    });
    blockFilter.elem('feColorMatrix', {
        result: 'matrixOut',
        in: 'offOut',
        type: 'matrix',
        values: '0.7 0 0 0 0 0 0.7 0 0 0 0 0 0.7 0 0 0 0 0 1 0',
    });
    blockFilter.elem('feBlend', {
        in: 'SourceGraphic',
        in1: 'offOut',
        mode: 'normal',
    });

    var blockHighlightFilter = defs.elem('filter', {
        id: 'entryBlockHighlightFilter_' + suffix,
    });
    blockHighlightFilter.elem('feOffset', {
        result: 'offOut',
        in: 'SourceGraphic',
        dx: 0,
        dy: 0,
    });
    blockHighlightFilter.elem('feColorMatrix', {
        result: 'matrixOut',
        in: 'offOut',
        type: 'matrix',
        values: '1.3 0 0 0 0 0 1.3 0 0 0 0 0 1.3 0 0 0 0 0 1 0',
    });

    defs
        .elem('filter', {
            id: 'entryBlockDarkenFilter_' + suffix,
        })
        .elem('feColorMatrix', {
            type: 'matrix',
            values: '.45 0 0 0 0 0 .45 0 0 0 0 0 .45 0 0 0 0 0 1 0',
        });
};

Entry.Utils.addBlockPattern = function(boardSvgDom, suffix) {
    var pattern = boardSvgDom.elem('pattern', {
        id: 'blockHoverPattern_' + suffix,
        class: 'blockHoverPattern',
        patternUnits: 'userSpaceOnUse',
        patternTransform: 'translate(12, 0)',
        x: 0,
        y: 0,
        width: 125,
        height: 33,
        style: 'display: none',
    });

    var imagePath = Entry.mediaFilePath + 'block_pattern_(order).png';
    var order = '(order)';
    for (var i = 1; i < 5; i++) {
        pattern.elem('image', {
            class: 'pattern' + i,
            href: imagePath.replace(order, i),
            x: 0,
            y: 0,
            width: 125,
            height: 33,
        });
    }

    return { pattern: pattern };
};

Entry.Utils.COLLISION = {
    NONE: 0,
    UP: 1,
    RIGHT: 2,
    LEFT: 3,
    DOWN: 4,
};

Entry.Utils.createMouseEvent = function(type, event) {
    var e = document.createEvent('MouseEvent');
    e.initMouseEvent(
        type,
        true,
        true,
        window,
        0,
        0,
        0,
        event.clientX,
        event.clientY,
        false,
        false,
        false,
        false,
        0,
        null
    );
    return e;
};

Entry.Utils.xmlToJsonData = function(xml) {
    xml = $.parseXML(xml);
    var result = [];
    var categories = xml.childNodes[0].childNodes;
    for (var i in categories) {
        var category = categories[i];
        if (!category.tagName) continue;
        var data = {
            category: category.getAttribute('id'),
            blocks: [],
        };
        var blocks = category.childNodes;
        for (var i in blocks) {
            var block = blocks[i];
            if (!block.tagName) continue;

            var type = block.getAttribute('type');
            if (!type) continue;
            data.blocks.push(type);
        }
        result.push(data);
    }
    return result;
};

Entry.Utils.stopProjectWithToast = function(scope, message, error) {
    var block = scope.block;
    message = message || '런타임 에러 발생';

    var engine = Entry.engine;

    engine && engine.toggleStop();

    if (Entry.type === 'workspace') {
        if (scope.block && 'funcBlock' in scope.block) {
            block = scope.block.funcBlock;
        } else if (scope.funcExecutor) {
            block = scope.funcExecutor.scope.block;
            Entry.Func.edit(scope.type);
        }

        if (block) {
            var id = block.getCode().object && block.getCode().object.id;
            if (id)
                Entry.container.selectObject(block.getCode().object.id, true);
            var view = block.view;
            view && view.getBoard().activateBlock(block);
        }
    }

    if (Entry.toast) {
        Entry.toast.alert(
            Lang.Msgs.warn,
            Lang.Workspace.check_runtime_error,
            true
        );
    }

    if (error) {
        error.message = message + ': ' + error.message;
        throw error;
    }

    throw new Error(message);
};

Entry.Utils.AsyncError = function(message) {
    this.name = 'AsyncError';
    this.message = message || '비동기 호출 대기';
};

Entry.Utils.AsyncError.prototype = new Error();
Entry.Utils.AsyncError.prototype.constructor = Entry.Utils.AsyncError;

Entry.Utils.isChrome = function() {
    return /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
};

Entry.Utils.waitForWebfonts = function(fonts, callback) {
    var loadedFonts = 0;
    if (fonts && fonts.length) {
        for (var i = 0, l = fonts.length; i < l; ++i) {
            (function(font) {
                var node = document.createElement('span');
                // Characters that vary significantly among different fonts
                node.innerHTML = 'giItT1WQy@!-/#';
                // Visible - so we can measure it - but not on the screen
                node.style.position = 'absolute';
                node.style.left = '-10000px';
                node.style.top = '-10000px';
                // Large font size makes even subtle changes obvious
                node.style.fontSize = '300px';
                // Reset any font properties
                node.style.fontFamily = 'sans-serif';
                node.style.fontVariant = 'normal';
                node.style.fontStyle = 'normal';
                node.style.fontWeight = 'normal';
                node.style.letterSpacing = '0';
                document.body.appendChild(node);

                // Remember width with no applied web font
                var width = node.offsetWidth;

                node.style.fontFamily = font;

                var interval;
                function checkFont() {
                    // Compare current width with original width
                    if (node && node.offsetWidth != width) {
                        ++loadedFonts;
                        node.parentNode.removeChild(node);
                        node = null;
                    }

                    // If all fonts have been loaded
                    if (loadedFonts >= fonts.length) {
                        if (interval) {
                            clearInterval(interval);
                        }
                        if (loadedFonts == fonts.length) {
                            callback();
                            return true;
                        }
                    }
                }

                if (!checkFont()) {
                    interval = setInterval(checkFont, 50);
                }
            })(fonts[i]);
        }
    } else {
        callback && callback();
        return true;
    }
};
window.requestAnimFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

Entry.isMobile = function() {
    if (Entry.device) return Entry.device === 'tablet';

    var platform = window.platform;
    var ret =
        platform &&
        platform.type &&
        (platform.type === 'tablet' || platform.type === 'mobile');

    if (ret) {
        Entry.device = 'tablet';
        return true;
    } else {
        Entry.device = 'desktop';
        return false;
    }
};

Entry.Utils.mobileAgentParser = function(userAgent) {
    var apple_phone = /iPhone/i,
        apple_ipod = /iPod/i,
        apple_tablet = /iPad/i,
        android_phone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
        android_tablet = /Android/i,
        amazon_phone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        amazon_tablet = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        windows_phone = /Windows Phone/i,
        windows_tablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
        other_blackberry = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera = /Opera Mini/i,
        other_chrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        other_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
        seven_inch = new RegExp(
            '(?:' + // Non-capturing group
            'Nexus 7' + // Nexus 7
            '|' + // OR
            'BNTV250' + // B&N Nook Tablet 7 inch
            '|' + // OR
            'Kindle Fire' + // Kindle Fire
            '|' + // OR
            'Silk' + // Kindle Fire, Silk Accelerated
            '|' + // OR
            'GT-P1000' + // Galaxy Tab 7 inch
                ')', // End non-capturing group

            'i'
        ); // Case-insensitive matching

    var match = function(regex, userAgent) {
        return regex.test(userAgent);
    };

    var ua = userAgent || navigator.userAgent;

    // Facebook mobile app's integrated browser adds a bunch of strings that
    // match everything. Strip it out if it exists.
    var tmp = ua.split('[FBAN');
    if (typeof tmp[1] !== 'undefined') {
        ua = tmp[0];
    }

    // Twitter mobile app's integrated browser on iPad adds a "Twitter for
    // iPhone" string. Same probable happens on other tablet platforms.
    // This will confuse detection so strip it out if it exists.
    tmp = ua.split('Twitter');
    if (typeof tmp[1] !== 'undefined') {
        ua = tmp[0];
    }

    this.apple = {
        phone: match(apple_phone, ua),
        ipod: match(apple_ipod, ua),
        tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
        device:
            match(apple_phone, ua) ||
            match(apple_ipod, ua) ||
            match(apple_tablet, ua),
    };
    this.amazon = {
        phone: match(amazon_phone, ua),
        tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
        device: match(amazon_phone, ua) || match(amazon_tablet, ua),
    };
    this.android = {
        phone: match(amazon_phone, ua) || match(android_phone, ua),
        tablet:
            !match(amazon_phone, ua) &&
            !match(android_phone, ua) &&
            (match(amazon_tablet, ua) || match(android_tablet, ua)),
        device:
            match(amazon_phone, ua) ||
            match(amazon_tablet, ua) ||
            match(android_phone, ua) ||
            match(android_tablet, ua),
    };
    this.windows = {
        phone: match(windows_phone, ua),
        tablet: match(windows_tablet, ua),
        device: match(windows_phone, ua) || match(windows_tablet, ua),
    };
    this.other = {
        blackberry: match(other_blackberry, ua),
        blackberry10: match(other_blackberry_10, ua),
        opera: match(other_opera, ua),
        firefox: match(other_firefox, ua),
        chrome: match(other_chrome, ua),
        device:
            match(other_blackberry, ua) ||
            match(other_blackberry_10, ua) ||
            match(other_opera, ua) ||
            match(other_firefox, ua) ||
            match(other_chrome, ua),
    };
    this.seven_inch = match(seven_inch, ua);
    this.any =
        this.apple.device ||
        this.android.device ||
        this.windows.device ||
        this.other.device ||
        this.seven_inch;

    // excludes 'other' devices and ipods, targeting touchscreen phones
    this.phone = this.apple.phone || this.android.phone || this.windows.phone;

    // excludes 7 inch devices, classifying as phone or tablet is left to the user
    this.tablet =
        this.apple.tablet || this.android.tablet || this.windows.tablet;

    return this;
};

Entry.Utils.convertMouseEvent = function(e) {
    if (e.originalEvent && e.originalEvent.touches)
        return e.originalEvent.touches[0];
    else if (e.changedTouches) return e.changedTouches[0];
    else return e;
};

Entry.Utils.convertIntToHex = function(num) {
    return num.toString(16).toUpperCase();
};

Entry.Utils.hasSpecialCharacter = function(str) {
    var reg = /!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|-|\[|\]|\\|\'|;|,|\.|\/|{|}|\||\"|:|<|>|\?/g;
    return reg.test(str);
};

Entry.Utils.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
        return timeout;
    };
};

Entry.Utils.isNewVersion = function(old_version = '', new_version = '') {
    try {
        if (old_version === '') {
            return false;
        }
        old_version = old_version.replace('v', '');
        new_version = new_version.replace('v', '');
        var arrOld = old_version.split('.');
        var arrNew = new_version.split('.');
        var count =
            arrOld.length < arrNew.length ? arrOld.length : arrNew.length;
        var isNew = false;
        var isSame = true;
        for (var i = 0; i < count; i++) {
            if (Number(arrOld[i]) < Number(arrNew[i])) {
                isNew = true;
                isSame = false;
            } else if (Number(arrOld[i]) > Number(arrNew[i])) {
                isSame = false;
            }
        }

        if (isSame && arrOld.length < arrNew.length) {
            isNew = true;
        }

        return isNew;
    } catch (e) {
        return false;
    }
};

Entry.Utils.getBlockCategory = (function() {
    var map = {};
    var allBlocks;
    return function(blockType) {
        if (!blockType) return;

        if (map[blockType]) return map[blockType];

        if (!allBlocks) allBlocks = EntryStatic.getAllBlocks();

        for (var i = 0; i < allBlocks.length; i++) {
            var data = allBlocks[i];
            var category = data.category;
            if (data.blocks.indexOf(blockType) > -1) {
                map[blockType] = category;
                return category;
            }
        }
    };
})();

Entry.Utils.getUniqObjectsBlocks = function(objects) {
    objects = objects || Entry.container.objects_;
    var ret = [];

    objects.forEach(function(o) {
        var script = o.script;
        if (!(script instanceof Entry.Code)) script = new Entry.Code(script);
        var blocks = script.getBlockList();
        blocks.forEach(function(b) {
            if (ret.indexOf(b.type) < 0) ret.push(b.type);
        });
    });

    return ret;
};

Entry.Utils.getObjectsBlocks = function(objects) {
    objects = objects || Entry.container.objects_;
    var ret = [];

    objects.forEach(function(o) {
        var script = o.script;
        if (!(script instanceof Entry.Code)) script = new Entry.Code(script);
        var blocks = script.getBlockList(true);
        blocks.forEach(function(b) {
            ret.push(b.type);
        });
    });

    return ret;
};

Entry.Utils.makeCategoryDataByBlocks = function(blockArr) {
    if (!blockArr) return;
    var that = this;

    var data = EntryStatic.getAllBlocks();
    var categoryIndexMap = {};
    for (var i = 0; i < data.length; i++) {
        var datum = data[i];
        datum.blocks = [];
        categoryIndexMap[datum.category] = i;
    }

    blockArr.forEach(function(b) {
        var category = that.getBlockCategory(b);
        var index = categoryIndexMap[category];
        if (index === undefined) return;
        data[index].blocks.push(b);
    });

    var allBlocksInfo = EntryStatic.getAllBlocks();
    for (var i = 0; i < allBlocksInfo.length; i++) {
        var info = allBlocksInfo[i];
        var category = info.category;
        var blocks = info.blocks;
        if (category === 'func') {
            allBlocksInfo.splice(i, 1);
            continue;
        }
        var selectedBlocks = data[i].blocks;
        var sorted = [];

        blocks.forEach(function(b) {
            if (selectedBlocks.indexOf(b) > -1) sorted.push(b);
        });

        data[i].blocks = sorted;
    }

    return data;
};

Entry.Utils.blur = function() {
    var elem = document.activeElement;
    elem && elem.blur && elem.blur();
};

Entry.Utils.getWindow = function(hashId) {
    if (!hashId) return;
    for (var i = 0; i < window.frames.length; i++) {
        var frame = window.frames[i];
        if (frame.Entry && frame.Entry.hashId === hashId) return frame;
    }
};

Entry.Utils.restrictAction = function(exceptions, callback, noDispose) {
    var that = this;
    exceptions = exceptions || [];
    exceptions = exceptions.map(function(e) {
        return e[0];
    });
    var handler = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (!that.isRightButton(e)) {
            for (var i = 0; i < exceptions.length; i++) {
                var exception = exceptions[i];
                if (exception === target || $.contains(exception, target)) {
                    if (!noDispose) {
                        callback(e);
                    } else target.focus && target.focus();
                    return;
                }
            }
        }

        if (!e.preventDefault) {
            //IE quirks
            e.returnValue = false;
            e.cancelBubble = true;
        }
        e.preventDefault();
        e.stopPropagation();
    };

    this._restrictHandler = handler;

    var entryDom = Entry.getDom();
    Entry.Utils.disableContextmenu(entryDom);
    if (entryDom.addEventListener) {
        entryDom.addEventListener('click', handler, true);
        entryDom.addEventListener('mousedown', handler, true);
        entryDom.addEventListener('mouseup', handler, true);
        entryDom.addEventListener('touchstart', handler, true);
    } else {
        entryDom.attachEvent('onclick', handler);
        entryDom.attachEvent('onmousedown', handler);
        entryDom.attachEvent('onmouseup', handler);
        entryDom.attachEvent('ontouchstart', handler);
    }
};

Entry.Utils.allowAction = function() {
    var entryDom = Entry.getDom();
    Entry.Utils.enableContextmenu(entryDom);
    if (this._restrictHandler) {
        if (entryDom.addEventListener) {
            entryDom.removeEventListener('click', this._restrictHandler, true);
            entryDom.removeEventListener(
                'mousedown',
                this._restrictHandler,
                true
            );
            entryDom.removeEventListener(
                'mouseup',
                this._restrictHandler,
                true
            );
            entryDom.removeEventListener(
                'touchstart',
                this._restrictHandler,
                true
            );
        } else {
            entryDom.detachEvent('onclick', this._restrictHandler);
            entryDom.detachEvent('onmousedown', this._restrictHandler);
            entryDom.detachEvent('onmouseup', this._restrictHandler);
            entryDom.detachEvent('ontouchstart', this._restrictHandler);
        }
        delete this._restrictHandler;
    }
};

Entry.Utils.glideBlock = function(svgGroup, x, y, callback) {
    var rect = svgGroup.getBoundingClientRect();
    var svgDom = Entry.Dom(
        $(
            '<svg id="globalSvg" width="10" height="10"' +
                'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'
        ),
        { parent: $(document.body) }
    );
    svgGroup = $(svgGroup.cloneNode(true));
    svgGroup.attr({ transform: 'translate(8,0)' });
    svgDom.append(svgGroup);
    svgDom.css({
        top: rect.top,
        left: rect.left,
    });
    svgDom.velocity(
        {
            top: y,
            left: x - 8,
        },
        {
            duration: 1200,
            complete: function() {
                setTimeout(function() {
                    svgDom.remove();
                    callback();
                }, 500);
            },
            easing: 'ease-in-out',
        }
    );
};

Entry.Utils.getScrollPos = function() {
    var elem =
        Entry.getBrowserType().indexOf('IE') > -1
            ? document.documentElement
            : document.body;
    return {
        left: elem.scrollLeft,
        top: elem.scrollTop,
    };
};

Entry.Utils.copy = function(target) {
    return JSON.parse(JSON.stringify(target));
};

//helper function for development and debug
Entry.Utils.getAllObjectsBlockList = function() {
    return Entry.container.objects_.reduce(function(prev, o) {
        return prev.concat(o.script.getBlockList());
    }, []);
};

Entry.Utils.toFixed = function(value, len) {
    len = len || 1;
    var powValue = Math.pow(10, len);

    value = Math.round(value * powValue) / powValue;

    if (Entry.isFloat(value)) return String(value);
    else {
        value += '.';
        for (var i = 0; i < len; i++) value += '0';
        return value;
    }
};

Entry.Utils.addSoundInstances = function(instance) {
    Entry.soundInstances.push(instance);
    instance.on('complete', function() {
        var index = Entry.soundInstances.indexOf(instance);
        if (index > -1) Entry.soundInstances.splice(index, 1);
    });
};

Entry.Utils.pauseSoundInstances = function() {
    Entry.soundInstances.map(function(instance) {
        instance.paused = true;
    });
};

Entry.Utils.recoverSoundInstances = function() {
    Entry.soundInstances.map(function(instance) {
        instance.paused = false;
    });
};

Entry.Utils.bindBlockViewHoverEvent = function(board, dom) {
    if (Entry.isMobile()) {
        return;
    }

    dom.on('mouseenter mouseleave', 'path', function(e) {
        if (this.getAttribute('class') !== 'blockPath') {
            return;
        }
        var block = board.code.findById(this.getAttribute('blockId'));
        if (!block) {
            return;
        }
        var blockView = block.view;

        if (!blockView._mouseEnable) {
            return;
        }

        blockView.setHoverBlockView({
            that: blockView,
            blockView: e.type === 'mouseenter' ? blockView : undefined,
        });
    });
};

Entry.Utils.bindBlockExecuteFocusEvents = function() {
    Entry.addEventListener('blockExecute', (view) => {
        if (!view) {
            return;
        }
        this.focusBlockView(view.getBoard(), view);
    });

    Entry.addEventListener('blockExecuteEnd', this.focusBlockView);
};

Entry.Utils.focusBlockView = (() => {
    var _last;

    function _getAllElem(elem) {
        return $(elem).find('*:not(g)');
    }

    return (board, blockView) => {
        var { svgGroup, suffix } = board || Entry.getMainWS().board || {};

        if (!svgGroup || !suffix || (_last && _last === blockView)) {
            return;
        }

        if (blockView) {
            //darken all
            _getAllElem(svgGroup).attr(
                'filter',
                `url(#entryBlockDarkenFilter_${suffix})`
            );

            //brighten only block
            var { _path, contentSvgGroup } = blockView;
            $(_path).removeAttr('filter');
            $(contentSvgGroup)
                .find('*:not(g)')
                .removeAttr('filter');
        } else {
            //brighten all
            _getAllElem(svgGroup).removeAttr('filter');
        }

        _last = blockView;
    };
})();
