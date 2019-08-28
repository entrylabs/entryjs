/**
 * @fileoverview This manage control state and control bar.
 */
'use strict';

import { GEHelper } from '../graphicEngine/GEHelper';
/**
 * doxdox 'src/class/engine.js' --layout markdown --output documentation/src/class/engine.md
 *
 * 엔진은 Canvas 를 컨트롤하는 클래스이며, 스마트폰의 경우 stageMouseMove/ stageMouseOut 이벤트 리스너가 없음.
 *
 * ### Basic Constructor variables
 *
 * ```javascript
 * this = {
 *     achieveEnabled
 *     addButton
 *     buttonWrapper
 *     coordinateButton
 *     isContinue
 *     isUpdating
 *     maximizeButton
 *     mouseView
 *     mouseViewInput
 *     option
 *     pauseButton
 *     pauseButtonFull
 *     popup
 *     projectTimer
 *     runButton
 *     runButton2
 *     selectedObject
 *     speedButton
 *     speeds
 *     state
 *     stopButton
 *     stopButton2
 *     ticker
 *     view_
 *     _keyboardEvent
 * }
 * ```
 * @constructor
 * @return {NULL}
 *
 */

Entry.Engine = class Engine {
    constructor() {
        this.state = 'stop';
        this.popup = null;
        this.isUpdating = true;
        this.speeds = [1, 15, 30, 45, 60];

        this.attachKeyboardCapture();

        const _addEventListener = Entry.addEventListener.bind(Entry);

        _addEventListener('canvasClick', () => this.fireEvent('mouse_clicked'));
        _addEventListener('canvasClickCanceled', () => this.fireEvent('mouse_click_cancled'));
        _addEventListener('entityClick', (entity) =>
            this.fireEventOnEntity('when_object_click', entity)
        );
        _addEventListener('entityClickCanceled', (entity) =>
            this.fireEventOnEntity('when_object_click_canceled', entity)
        );

        if (Entry.type !== 'phone') {
            _addEventListener(
                'stageMouseMove',
                _.throttle(this.updateMouseView.bind(this), 100, {
                    leading: false,
                })
            );
            _addEventListener('stageMouseOut', this.hideMouseView.bind(this));
        }

        const $win = $(window);
        _addEventListener('run', () => $win.bind('keydown', arrowHandler));
        _addEventListener('stop', () => $win.unbind('keydown', arrowHandler));

        function arrowHandler(e) {
            const code = e.keyCode || e.which;
            const input = Entry.stage.inputField;

            if (code === 32 && input && input.hasFocus()) {
                return;
            }

            if (_.includes([37, 38, 39, 40, 32], code)) {
                e.preventDefault();
            }
        }

        Entry.message = new Entry.Event(window);
    }

    /**
     * #### Params
     * |     Name      |        Def        |              Default               |
     * | :-----------: | :---------------: | :--------------------------------: |
     * | `controlView` | Entry.controlView |                ---                 |
     * |   `option`    |        ---        | "workspace" instance of **String** |
     * |               |                   |                ---                 |
     *   기본 뷰 initializing 을 담당  Control bar view generator.
     * @param {!Element} controlView controlView from Entry.
     * @param {?string} option for choose type of view.
     * @return {NULL}
     */
    generateView(controlView, option = 'workspace') {
        this.option = option;
        if (option == 'workspace') {
            this.view_ = controlView;
            this.view_.addClass('entryEngine_w').addClass('entryEngineWorkspace_w');

            this.speedButton = Entry.createElement('button')
                .addClass(
                    'entrySpeedButtonWorkspace',
                    'entryEngineTopWorkspace',
                    'entryEngineButtonWorkspace_w'
                )
                .appendTo(this.view_)
                .bindOnClick(function(e) {
                    Entry.engine.toggleSpeedPanel();
                    this.blur();
                });

            this.maximizeButton = Entry.createElement('button')
                .addClass(
                    'entryEngineButtonWorkspace_w',
                    'entryEngineTopWorkspace',
                    'entryMaximizeButtonWorkspace_w'
                )
                .appendTo(this.view_)
                .bindOnClick(function(e) {
                    Entry.engine.toggleFullScreen();
                    this.blur();
                });

            this.coordinateButton = Entry.createElement('button')
                .addClass(
                    'entryEngineButtonWorkspace_w',
                    'entryEngineTopWorkspace',
                    'entryCoordinateButtonWorkspace_w'
                )
                .appendTo(this.view_)
                .bindOnClick(function(e) {
                    if (this.hasClass('toggleOn')) {
                        this.removeClass('toggleOn');
                    } else {
                        this.addClass('toggleOn');
                    }

                    this.blur();
                    Entry.stage.toggleCoordinator();
                });

            this.mouseView = Entry.createElement('div')
                .addClass('entryMouseViewWorkspace_w')
                .addClass('entryHide')
                .appendTo(this.view_);

            this.mouseViewInput = Entry.createElement('input').appendTo(this.mouseView);
            $(this.mouseViewInput).attr('readonly', 'readonly');

            this.buttonWrapper = Entry.createElement('div')
                .addClass('entryEngineButtonWrapper')
                .appendTo(this.view_);
            this.addButton = Entry.createElement('button')
                .addClass('entryEngineButtonWorkspace_w')
                .addClass('entryAddButtonWorkspace_w')
                .bindOnClick(function() {
                    Entry.do('addObjectButtonClick');
                    this.blur();
                })
                .appendTo(this.buttonWrapper);
            this.addButton.innerHTML = Lang.Workspace.add_object;
            if (!Entry.objectAddable) {
                this.addButton.addClass('entryRemove');
            }

            this.runButton = Entry.createElement('button')
                .addClass('entryEngineButtonWorkspace_w')
                .addClass('entryRunButtonWorkspace_w')
                .bindOnClick(() => Entry.do('toggleRun', 'runButton'))
                .appendTo(this.buttonWrapper);
            this.runButton.innerHTML = Lang.Workspace.run;

            this.runButton2 = Entry.createElement('button')
                .addClass('entryEngineButtonWorkspace_w')
                .addClass('entryRunButtonWorkspace_w2')
                .appendTo(this.buttonWrapper)
                .bindOnClick(() => Entry.engine.toggleRun());

            this.pauseButton = Entry.createElement('button')
                .addClass('entryEngineButtonWorkspace_w')
                .addClass('entryPauseButtonWorkspace_w')
                .addClass('entryRemove')
                .appendTo(this.buttonWrapper)
                .bindOnClick(function(e) {
                    this.blur();
                    Entry.engine.togglePause();
                });

            this.pauseButtonFull = Entry.createElement('button')
                .addClass('entryEngineButtonWorkspace_w')
                .addClass('entryPauseButtonWorkspace_full')
                .addClass('entryRemove')
                .appendTo(this.buttonWrapper)
                .bindOnClick(function() {
                    this.blur();
                    Entry.engine.togglePause();
                });

            this.stopButton = Entry.createElement('button')
                .addClass('entryEngineButtonWorkspace_w')
                .addClass('entryStopButtonWorkspace_w')
                .addClass('entryRemove')
                .bindOnClick(() => Entry.do('toggleStop', 'stopButton'))
                .appendTo(this.buttonWrapper);
            this.stopButton.innerHTML = Lang.Workspace.stop;

            this.stopButton2 = Entry.createElement('button')
                .addClass('entryEngineButtonWorkspace_w')
                .addClass('entryStopButtonWorkspace_w2')
                .addClass('entryRemove')
                .bindOnClick(function() {
                    this.blur();
                    Entry.engine.toggleStop();
                })
                .appendTo(this.buttonWrapper);
            this.stopButton2.innerHTML = Lang.Workspace.stop;
        } else if (option == 'minimize') {
            /** @type {!Element} */
            this.view_ = controlView;
            this.view_.addClass('entryEngine');
            this.view_.addClass('entryEngineMinimize');

            this.maximizeButton = Entry.createElement('button');
            this.maximizeButton.addClass('entryEngineButtonMinimize');
            this.maximizeButton.addClass('entryMaximizeButtonMinimize');
            this.view_.appendChild(this.maximizeButton);
            this.maximizeButton.bindOnClick((e) => {
                Entry.engine.toggleFullScreen();
            });

            this.coordinateButton = Entry.createElement('button');
            this.coordinateButton.addClass('entryEngineButtonMinimize');
            this.coordinateButton.addClass('entryCoordinateButtonMinimize');
            this.view_.appendChild(this.coordinateButton);
            this.coordinateButton.bindOnClick(function(e) {
                if (this.hasClass('toggleOn')) {
                    this.removeClass('toggleOn');
                } else {
                    this.addClass('toggleOn');
                }
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
            this.mouseView.addClass('entryHide');

            this.mouseViewInput = Entry.createElement('input').appendTo(this.mouseView);
            $(this.mouseViewInput).attr('readonly', 'readonly');
            $(this.mouseViewInput).attr(
                'style',
                'border: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;line-height: normal'
            );

            this.view_.appendChild(this.mouseView);

            Entry.addEventListener('loadComplete', () => {
                this.runButton = Entry.Dom('div', {
                    class: 'entryRunButtonBigMinimize',
                    parent: $('#entryCanvasWrapper'),
                });
                this.runButton.bindOnClick(() => Entry.engine.toggleRun());
            });
        } else if (option == 'phone') {
            this.view_ = controlView;
            this.view_.addClass('entryEngine', 'entryEnginePhone');

            this.headerView_ = Entry.createElement('div', 'entryEngineHeader');
            this.headerView_.addClass('entryEngineHeaderPhone');
            this.view_.appendChild(this.headerView_);

            this.maximizeButton = Entry.createElement('button');
            this.maximizeButton.addClass('entryEngineButtonPhone', 'entryMaximizeButtonPhone');
            this.headerView_.appendChild(this.maximizeButton);
            this.maximizeButton.bindOnClick((e) => {
                Entry.engine.footerView_.addClass('entryRemove');
                Entry.engine.headerView_.addClass('entryRemove');
                Entry.launchFullScreen(Entry.engine.view_);
            });
            document.addEventListener('fullscreenchange', (e) => {
                Entry.engine.exitFullScreen();
            });
            document.addEventListener('webkitfullscreenchange', (e) => {
                Entry.engine.exitFullScreen();
            });
            document.addEventListener('mozfullscreenchange', (e) => {
                Entry.engine.exitFullScreen();
            });

            this.footerView_ = Entry.createElement('div', 'entryEngineFooter');
            this.footerView_.addClass('entryEngineFooterPhone');
            this.view_.appendChild(this.footerView_);

            this.runButton = Entry.createElement('button');
            this.runButton.addClass('entryEngineButtonPhone', 'entryRunButtonPhone');
            if (Entry.objectAddable) {
                this.runButton.addClass('small');
            }
            this.runButton.innerHTML = Lang.Workspace.run;

            this.footerView_.appendChild(this.runButton);
            this.runButton.bindOnClick((e) => {
                Entry.engine.toggleRun();
            });

            this.stopButton = Entry.createElement('button');
            this.stopButton.addClass(
                'entryEngineButtonPhone',
                'entryStopButtonPhone',
                'entryRemove'
            );
            if (Entry.objectAddable) {
                this.stopButton.addClass('small');
            }
            this.stopButton.innerHTML = Lang.Workspace.stop;

            this.footerView_.appendChild(this.stopButton);
            this.stopButton.bindOnClick((e) => {
                Entry.engine.toggleStop();
            });
        }
    }

    /**
     *
     * 엔진 속도 패널 on/off , 속도 패널 엘레멘트 관리
     * @return {NULL}
     */
    toggleSpeedPanel() {
        if (this.speedPanelOn) {
            this.speedPanelOn = false;
            this.speedButton.removeClass('on');

            $(this.speedLabel_)
                .parent()
                .remove();
            delete this.speedLabel_;
            $(this.speedProgress_).fadeOut(null, function(e) {
                $(this).remove();
                delete this.speedProgress_;
            });
            $(this.speedHandle_).remove();
            delete this.speedHandle_;
        } else {
            this.speedPanelOn = true;
            this.speedButton.addClass('on');

            const speedBox = Entry.createElement('div', 'entrySpeedBox');
            speedBox.addClass('entrySpeedBox');
            this.view_.insertBefore(speedBox, Entry.stage.canvas.canvas);

            this.speedLabel_ = Entry.createElement('div', 'entrySpeedLabelWorkspace');
            this.speedLabel_.innerHTML = Lang.Workspace.speed;
            speedBox.appendChild(this.speedLabel_);

            this.speedProgress_ = Entry.createElement('table', 'entrySpeedProgressWorkspace');
            const tr = Entry.createElement('tr').appendTo(this.speedProgress_);

            this.speeds.forEach((speed, i) => {
                Entry.createElement('td', `progressCell${i}`)
                    .addClass('progressCell')
                    .bindOnClick(() => {
                        this.setSpeedMeter(speed);
                    })
                    .appendTo(tr);
            });

            speedBox.appendChild(this.speedProgress_);
            this.setSpeedMeter(Entry.FPS);
        }
    }

    /**
     *
     * 엔진 속도 세팅 (1~60)
     * @param {number} FPS 1~60의 프레임수를 넣을수 있음
     * @return {NULL}
     */

    setSpeedMeter(FPS) {
        let level = this.speeds.indexOf(FPS);
        if (level < 0) {
            return;
        }
        level = Math.min(4, level);
        level = Math.max(0, level);
        if (this.speedPanelOn) {
            const elements = document.querySelectorAll(`.progressCell`);
            Array.from(elements).forEach((element, i) => {
                if (level === i) {
                    element.className = 'progressCell on';
                } else if (element.className.indexOf('on') > -1) {
                    element.className = 'progressCell';
                }
            });
        }
        if (Entry.FPS == FPS) {
            return;
        }
        clearInterval(this.ticker);
        this.ticker = setInterval(this.update, Math.floor(1000 / FPS));
        Entry.FPS = FPS;
    }

    /**
     *
     * 엔진 렌더 시작<br/>
     * ORIGINAL: Start engine
     * @param {number} FPS 1~60의 시작 프레임수를 넣을수 있음
     * @return {NULL}
     */
    start(FPS) {
        /** @type {!number} */
        GEHelper.Ticker.setFPS(Entry.FPS);

        if (!this.ticker) {
            this.ticker = setInterval(this.update, Math.floor(1000 / Entry.FPS));
        }
    }

    /**
     *
     * 엔진 렌더 정지<br/>
     * ORIGINAL: stop engine
     * @return {NULL}
     */
    stop() {
        GEHelper.Ticker.reset();
        clearInterval(this.ticker);
        this.ticker = null;
    }

    /**
     *
     * 엔진 object연산 수행으로 업데이트, 하드웨어 연산시작<br/>
     * ORIGINAL: Update canvas and object.
     * @return {NULL}
     */
    update() {
        if (Entry.engine.isState('run')) {
            Entry.engine.computeObjects();
            Entry.hw.update();
        }
    }

    /**
     *
     * 현재 Scene에 올라와있는 오브젝트들에 대해서 mapping하는 클래스, 오브젝트의 함수도 매핑함<br/>
     * ORIGINAL: compute each object with runningScript on entity.
     * @return {NULL}
     */
    computeObjects() {
        Entry.container.mapObjectOnScene(this.computeFunction);
    }

    /**
     *
     * 인자로 받은 script의 이벤트 기동<br/>
     * ORIGINAL: Compute function for map.
     * @param {Entry.EntryObject} object
     * @return {NULL}
     */
    computeFunction({ script }) {
        script.tick();
    }

    /**
     *
     * engine.state === state 를 리턴<br/>
     * ORIGINAL: Check this state is same with argument
     * @param {string} state
     * @return {boolean}
     */
    isState(state) {
        return this.state.indexOf(state) > -1;
    }

    /**
     *
     * Engine 상태 토글 (isState === run ? isState = stop : isState = run)<br/>
     * ORIGINAL: Execute this function when click start button
     * @return {NULL}
     */
    run() {
        if (this.isState('run')) {
            this.toggleStop();
        } else if (this.isState('stop') || this.isState('pause')) {
            this.toggleRun();
        }
    }

    /**
     *
     * Engine 기동, achievement 에 대한 인식 변경포함<br/>
     * ORIGINAL: toggle this engine state run
     * @param {Boolean} disableAchieve
     * @return {NULL}
     */

    toggleRun(disableAchieve) {
        const variableContainer = Entry.variableContainer;
        const container = Entry.container;
        const WS = Entry.getMainWS();

        if (this.state === 'pause') {
            return this.togglePause();
        }

        Entry.Utils.blur();

        WS && WS.syncCode();

        Entry.addActivity('run');

        if (this.state == 'stop') {
            container.mapEntity((entity) => {
                entity.takeSnapshot();
            });
            variableContainer.mapVariable((variable) => {
                variable.takeSnapshot();
            });
            variableContainer.mapList((variable) => {
                variable.takeSnapshot();
            });
            this.projectTimer.takeSnapshot();
            container.inputValue.takeSnapshot();

            container.takeSequenceSnapshot();
            Entry.scene.takeStartSceneSnapshot();
            this.state = 'run';
            this.fireEvent('start');
            this.achieveEnabled = !(disableAchieve === false);
        }
        this.state = 'run';
        if (Entry.type == 'mobile') {
            this.view_.addClass('entryEngineBlueWorkspace');
        }

        if (this.runButton) {
            this.setPauseButton(this.option);
            this.runButton.addClass('run');
            this.runButton.addClass('entryRemove');
            this.stopButton.removeClass('entryRemove');
            if (this.addButton) {
                this.addButton.addClass('entryRemove');
                if (Entry.objectAddable) {
                    this.pauseButton.removeClass('entryRemove');
                }
            }
            if (this.pauseButton && (Entry.type === 'minimize' || Entry.objectAddable)) {
                this.pauseButton.removeClass('entryRemove');
            }

            if (this.runButton2) {
                this.runButton2.addClass('entryRemove');
            }
            if (this.stopButton2) {
                this.stopButton2.removeClass('entryRemove');
            }
            if (this.pauseButtonFull) {
                this.pauseButtonFull.removeClass('entryRemove');
            }
        }

        if (!this.isUpdating) {
            this.update();
            this.isUpdating = true;
        }

        this.setEnableInputField(true);

        this.selectedObject = Entry.stage.selectedObject;
        Entry.stage.selectObject();
        Entry.dispatchEvent('run');
    }

    /**
     *
     * Engine 정지<br/>
     * ORIGINAL: toggle this engine state stop
     * @return {NULL}
     */
    toggleStop() {
        const container = Entry.container;
        const variableContainer = Entry.variableContainer;

        Entry.Utils.blur();

        Entry.addActivity('stop');

        container.mapEntity((entity) => {
            entity.loadSnapshot();
            entity.object.filters = [];
            entity.resetFilter();
            if (entity.dialog) {
                entity.dialog.remove();
            }
            if (entity.brush) {
                entity.removeBrush();
            }
        });

        variableContainer.mapVariable((variable) => {
            variable.loadSnapshot();
        });
        variableContainer.mapList((variable) => {
            variable.loadSnapshot();
        });
        this.stopProjectTimer();
        if (Entry.timerInstances) {
            Entry.timerInstances.forEach((instance) => {
                instance.destroy();
            });
        }
        container.clearRunningState();
        container.loadSequenceSnapshot();
        this.projectTimer.loadSnapshot();
        container.inputValue.loadSnapshot();
        Entry.scene.loadStartSceneSnapshot();
        Entry.Func.clearThreads();
        Entry.Utils.setVolume(1);
        createjs.Sound.setVolume(1);
        createjs.Sound.stop();
        Entry.soundInstances = [];
        Entry.targetChecker && Entry.targetChecker.clearListener();

        this.view_.removeClass('entryEngineBlueWorkspace');
        if (this.runButton) {
            this.runButton.removeClass('entryRemove');
            this.stopButton.addClass('entryRemove');
            if (this.pauseButton) {
                this.pauseButton.addClass('entryRemove');
            }
            if (this.pauseButtonFull) {
                this.pauseButtonFull.addClass('entryRemove');
            }
            if (this.addButton && Entry.objectAddable) {
                this.addButton.removeClass('entryRemove');
            }

            if (this.runButton2) {
                this.runButton2.removeClass('entryRemove');
            }
            if (this.stopButton2) {
                this.stopButton2.addClass('entryRemove');
            }
        }

        this.state = 'stop';
        this.setEnableInputField(false);
        Entry.dispatchEvent('stop');
        Entry.stage.hideInputField();
        (function(w) {
            w && w.getMode() === Entry.Workspace.MODE_VIMBOARD && w.codeToText();
        })(Entry.getMainWS());
        Entry.dispatchEvent('dispatchEventDidToggleStop');
        Entry.stage.selectObject(this.selectedObject);
    }
    /**
     * Engine의 입력 Element 보이기
     * @param {Boolean} on inputField enabler
     * @return {NULL}
     */
    setEnableInputField(on) {
        const inputField = Entry.stage.inputField;
        if (inputField) {
            inputField._readonly = !on;
            if (!inputField._isHidden) {
                on ? inputField.focus() : inputField.blur();
            }
        }
    }

    /**
     *
     * Engine 일시정지
     * ORIGINAL:toggle this engine state pause
     * @return {NULL}
     */
    togglePause() {
        const timer = Entry.engine.projectTimer;
        if (this.state == 'pause') {
            this.setEnableInputField(true);
            timer.pausedTime += new Date().getTime() - timer.pauseStart;
            if (timer.isPaused) {
                timer.pauseStart = new Date().getTime();
            } else {
                delete timer.pauseStart;
            }
            this.state = 'run';
            Entry.Utils.recoverSoundInstances();
            if (this.runButton) {
                this.setPauseButton(this.option);
                if (this.runButton2) {
                    this.runButton2.addClass('entryRemove');
                } else {
                    this.runButton.addClass('entryRemove');
                }
            }

            if (Entry.timerInstances) {
                Entry.timerInstances.forEach((instance) => {
                    instance.resume();
                });
            }
        } else {
            this.state = 'pause';
            this.setEnableInputField(false);
            if (!timer.isPaused) {
                timer.pauseStart = new Date().getTime();
            } else {
                timer.pausedTime += new Date().getTime() - timer.pauseStart;
                timer.pauseStart = new Date().getTime();
            }
            Entry.Utils.pauseSoundInstances();
            if (this.runButton) {
                this.setPauseButton(this.option);
                this.stopButton.removeClass('entryRemove');
                if (this.runButton2) {
                    this.runButton2.removeClass('entryRemove');
                } else {
                    this.runButton.removeClass('entryRemove');
                }
            }

            if (Entry.timerInstances) {
                Entry.timerInstances.forEach((instance) => {
                    instance.pause();
                });
            }
        }
        Entry.dispatchEvent('dispatchEventDidTogglePause');
    }
    /**
     *
     * 일시정지 버튼 변경, 옵션은 minimize 이거나 아니거나, 버튼에 대한 옵션이 변경됨
     * @param {String} option
     * @return {NULL}
     */
    setPauseButton(option) {
        if (this.state == 'pause') {
            if (this.pauseButton) {
                this.pauseButton.innerHTML = Lang.Workspace.restart;
                if (this.option !== 'minimize') {
                    this.pauseButton.removeClass('entryPauseButtonWorkspace_w');
                    this.pauseButton.addClass('entryRestartButtonWorkspace_w');
                }
            }
            if (this.pauseButtonFull) {
                this.pauseButtonFull.innerHTML = Lang.Workspace.restart;
                if (this.option !== 'minimize') {
                    this.pauseButtonFull.removeClass('entryPauseButtonWorkspace_full');
                    this.pauseButtonFull.addClass('entryRestartButtonWorkspace_full');
                }
            }
        } else {
            if (this.pauseButton) {
                this.pauseButton.innerHTML = Lang.Workspace.pause;
                if (this.option !== 'minimize') {
                    this.pauseButton.addClass('entryPauseButtonWorkspace_w');
                    this.pauseButton.removeClass('entryRestartButtonWorkspace_w');
                }
            }
            if (this.pauseButtonFull) {
                this.pauseButtonFull.innerHTML = Lang.Workspace.pause;
                if (this.option !== 'minimize') {
                    this.pauseButtonFull.addClass('entryPauseButtonWorkspace_full');
                    this.pauseButtonFull.removeClass('entryRestartButtonWorkspace_full');
                }
            }
        }
    }

    /**
     *
     * 엔진이 기동중이면 모든 오브젝트에 eventName인 이벤트를 전달
     * @param {string} eventName
     * @return {NULL}
     */
    fireEvent(eventName) {
        if (this.state !== 'run') {
            return;
        }
        Entry.container.mapEntityIncludeCloneOnScene(this.raiseEvent, eventName);
    }

    /**
     *
     * entity의 parent에 이벤트 전달
     * ORIGINAL: this is callback function for map.
     * @param {Entry.EntryObject} object
     * @param {string} eventName
     * @return {NULL}
     */
    raiseEvent(entity, eventName) {
        entity.parent.script.raiseEvent(eventName, entity);
    }

    /**
     *
     *  entity 에 eventName인 이벤트를 전달
     * @param {string} eventName
     * @param {Entry.EntityObject} entity
     * @return {NULL}
     */
    fireEventOnEntity(eventName, entity) {
        if (this.state == 'run') {
            Entry.container.mapEntityIncludeCloneOnScene(this.raiseEventOnEntity, [
                entity,
                eventName,
            ]);
        }
    }

    /**
     *
     * 만약 param의 첫번째 인자가 entity라면, 해당 entity의 부모에 이벤트를 전달한다
     * ORIGINAL: this is callback function for map.
     * @param {Entry.EntryObject} object
     * @param {Array} param
     * @return {NULL}
     */
    raiseEventOnEntity(entity, param) {
        if (entity !== param[0]) {
            return;
        }
        const eventName = param[1];
        entity.parent.script.raiseEvent(eventName, entity);
    }

    /**
     *
     * 만약 isForce가 아니면 작동하지 않는 keyCapture, 엔진 정지상태일때 방향키는 sprite 이동 event로 인식
     * ORIGINAL: capture keyboard press input
     * @param {keyboardEvent} e
     * @return {NULL}
     */
    captureKeyEvent(e, isForce) {
        const keyCode = e.keyCode;
        const isWorkspace = Entry.type === 'workspace';

        if (Entry.Utils.isInInput(e) && !isForce) {
            return;
        }

        //mouse shortcuts
        if (keyCode !== 17 && e.ctrlKey && isWorkspace) {
            if (keyCode == 83) {
                e.preventDefault();
                Entry.dispatchEvent(e.shiftKey ? 'saveAsWorkspace' : 'saveWorkspace');
            } else if (keyCode == 82) {
                e.preventDefault();
                Entry.engine.run();
            } else if (keyCode == 90) {
                e.preventDefault();
                Entry.dispatchEvent(e.shiftKey ? 'redo' : 'undo');
            }
        } else if (Entry.engine.isState('run')) {
            e.preventDefault && e.preventDefault();
            Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent, [
                'keyPress',
                keyCode,
            ]);
        }

        if (Entry.engine.isState('stop')) {
            if (isWorkspace && (keyCode >= 37 && keyCode <= 40)) {
                Entry.stage.moveSprite(e);
            }
        }
    }

    /**
     *
     * entity의 Parent에 keyEvent 전달
     * ORIGINAL: this is callback function for map.
     * @param {Entry.EntryObject} object
     * @param {Array} param
     * @return {NULL}
     */
    raiseKeyEvent(entity, [eventName, keyCode]) {
        return entity.parent.script.raiseEvent(eventName, entity, String(keyCode));
    }

    /**
     *
     * 마우스 좌표값 업데이트
     * ORIGINAL: Update mouse coordinate
     * @return {NULL}
     */
    updateMouseView() {
        const { x, y } = Entry.stage.mouseCoordinate;
        this.mouseViewInput.value = `X : ${x}, Y : ${y}`;
        this.mouseView.removeClass('entryHide');
    }

    /**
     *
     * 마우스 좌표값 숨기기
     * ORIGINAL: hide mouse coordinate
     * @return {NULL}
     */
    hideMouseView() {
        this.mouseView.addClass('entryHide');
    }

    /**
     *
     * 팝업 전체화면 켜기
     * ORIGINAL: Toggle full screen of canvas
     * @return {NULL}
     */
    toggleFullScreen(popupClassName) {
        if (!this.popup) {
            this.popup = new Entry.Popup(popupClassName);
            if (Entry.engine.speedPanelOn) {
                Entry.engine.toggleSpeedPanel();
            }
            if (Entry.type != 'workspace') {
                const $doc = $(document);
                const body = $(this.popup.body_);
                body.css('top', $doc.scrollTop());
                $('body').css('overflow', 'hidden');

                popup.window_.appendChild(Entry.stage.canvas.canvas);
                popup.window_.appendChild(Entry.engine.runButton[0]);
            }
            popup.window_.appendChild(Entry.engine.view_);
            if (Entry.type === 'workspace' && Entry.targetChecker) {
                popup.window_.appendChild(Entry.targetChecker.getStatusView()[0]);
            }
        } else {
            this.popup.remove();
            this.popup = null;
        }

        Entry.windowResized.notify();
    }
    /**
     *
     *  팝업 전체화면 끄기
     * @return {NULL}
     */
    closeFullScreen() {
        if (this.popup) {
            this.popup.remove();
            this.popup = null;
        }

        Entry.windowResized.notify();
    }
    /**
     *
     * 전체화면 exit
     * @return {NULL}
     */
    exitFullScreen() {
        if (document.webkitIsFullScreen || document.mozIsFullScreen || document.isFullScreen) {
        } else {
            Entry.engine.footerView_.removeClass('entryRemove');
            Entry.engine.headerView_.removeClass('entryRemove');
        }
        Entry.windowResized.notify();
    }

    /**
     *
     * 엔트리 엔진에 있는 프로젝트 타이머 켜기
     * ORIGINAL: projectTimer to show
     * @return {NULL}
     */
    showProjectTimer() {
        const timer = Entry.engine.projectTimer;
        if (!timer) {
            return;
        }
        this.projectTimer.setVisible(true);
    }

    /**
     *
     * 엔트리 엔진에 있는 프로젝트 타이머 끄기
     * ORIGINAL: decide Entry.engine.projectTimer to show
     * @param {Entry.Block} removeBlock
     * @param {Boolean} notIncludeSelf
     * @return {NULL}
     */
    hideProjectTimer(removeBlock, notIncludeSelf) {
        const timer = this.projectTimer;
        if (!timer || !timer.isVisible() || this.isState('run')) {
            return;
        }
        const objects = Entry.container.getAllObjects();

        const timerTypes = [
            'get_project_timer_value',
            'reset_project_timer',
            'set_visible_project_timer',
            'choose_project_timer_action',
        ];

        for (let i = 0, len = objects.length; i < len; i++) {
            const code = objects[i].script;
            for (let j = 0; j < timerTypes.length; j++) {
                const blocks = code.getBlockList(false, timerTypes[j]);
                if (notIncludeSelf) {
                    const index = blocks.indexOf(removeBlock);
                    if (index > -1) {
                        blocks.splice(index, 1);
                    }
                }
                if (blocks.length > 0) {
                    return;
                }
            }
        }
        timer.setVisible(false);
    }
    /**
     *
     * 엔트리 엔진에 있는 프로젝트 타이머 관련 interval clear, tick.stop()
     * @return {NULL}
     */
    clearTimer() {
        clearInterval(this.ticker);
        clearInterval(this.projectTimer.tick);
    }

    /**
     *
     * 엔트리 엔진에 있는 프로젝트 타이머 시작
     * @return {NULL}
     */
    startProjectTimer() {
        const timer = this.projectTimer;

        if (!timer) {
            return;
        }

        timer.start = new Date().getTime();
        timer.isInit = true;
        timer.isPaused = false;
        timer.pausedTime = 0;
        timer.tick = setInterval((e) => {
            Entry.engine.updateProjectTimer();
        }, 1000 / 60);
    }

    /**
     *
     * 엔트리 엔진에 있는 프로젝트 타이머 정지
     * @return {NULL}
     */
    stopProjectTimer() {
        const timer = this.projectTimer;
        if (!timer) {
            return;
        }
        this.updateProjectTimer(0);
        timer.isPaused = false;
        timer.isInit = false;
        timer.pausedTime = 0;
        clearInterval(timer.tick);
    }

    /**
     *
     * 엔트리 엔진에 있는 프로젝트 타이머 리셋
     * @return {NULL}
     */
    resetTimer() {
        const timer = this.projectTimer;
        if (!timer.isInit) {
            return;
        }
        const isPaused = timer.isPaused;

        delete timer.pauseStart;

        this.updateProjectTimer(0);
        timer.pausedTime = 0;

        timer.isPaused = isPaused;

        if (!isPaused) {
            return;
        }

        clearInterval(timer.tick);
        timer.isInit = false;
        delete timer.start;
    }

    /**
     *
     * 엔트리 엔진에 있는 프로젝트 타이머 갱신(value값은 지정 가능, default empty)
     * @param {*} value
     * @return {NULL}
     */
    updateProjectTimer(value) {
        const engine = Entry.engine;
        const timer = engine.projectTimer;
        if (!timer) {
            return;
        }
        const current = new Date().getTime();
        if (typeof value == 'undefined') {
            if (!timer.isPaused && !engine.isState('pause')) {
                timer.setValue(
                    Math.max((current - (timer.start || current) - timer.pausedTime) / 1000, 0)
                );
            }
        } else {
            timer.setValue(value);
            timer.pausedTime = 0;
            timer.start = current;
        }
    }

    /**
     *
     * 엔트리에 신호(value) 전송
     * @return {NULL}
     */
    raiseMessage(value) {
        Entry.message.notify(Entry.variableContainer.getMessage(value));
        return Entry.container.mapEntityIncludeCloneOnScene(this.raiseKeyEvent, [
            'when_message_cast',
            value,
        ]);
    }

    /**
     *
     * querySelector Equivalent, 버튼을 가져오는 클래스(run/stop/objectAdd)
     * @param {Query[]} query
     * @return {NULL}
     */
    getDom(query) {
        if (query.length >= 1) {
            switch (query.shift()) {
                case 'runButton':
                    return this.runButton;
                case 'stopButton':
                    return this.stopButton;
                case 'objectAddButton':
                    return this.addButton;
            }
        } else {
        }
    }

    /**
     *
     * 키보드 입력 eventListener 추가
     * @return {NULL}
     */
    attachKeyboardCapture() {
        if (Entry.keyPressed) {
            this._keyboardEvent && this.detachKeyboardCapture();
            this._keyboardEvent = Entry.keyPressed.attach(this, this.captureKeyEvent);
        }
    }

    /**
     *
     * 키보드 입력 eventListener 제거
     * @return {NULL}
     */
    detachKeyboardCapture() {
        if (Entry.keyPressed && this._keyboardEvent) {
            this._keyboardEvent.destroy();
            delete this._keyboardEvent;
        }
    }

    /**
     *
     *  엔진 옵션 적용 Entry.objectAddable 인지에 따라 **버튼**에 옵션 부여
     * @return {NULL}
     */
    applyOption() {
        const SMALL = 'small';

        if (Entry.objectAddable) {
            this.runButton.addClass(SMALL);
            this.stopButton.addClass(SMALL);
            this.addButton.removeClass('entryRemove');
        } else {
            this.runButton.removeClass(SMALL);
            this.stopButton.removeClass(SMALL);
            this.addButton.addClass('entryRemove');
        }
    }

    /**
     *
     * destroy interface definition
     * @return {NULL}
     */
    destroy() {
        // 우선 interface 만 정의함.
    }
};

/**
 *
 * 엔진이 돌아가는동안 각 쓰레드별로 script 계산하여 리턴
 * @param {Entry.EntityObject} entity
 * @param {Script} object
 * @return {NULL}
 */
Entry.Engine.computeThread = function(entity, script) {
    Entry.engine.isContinue = true;
    let isSame = false;
    while (script && Entry.engine.isContinue && !isSame) {
        Entry.engine.isContinue = !script.isRepeat;
        const newScript = script.run();
        isSame = newScript && newScript === script;
        script = newScript;
    }
    return script;
};
