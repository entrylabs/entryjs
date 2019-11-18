'use strict';

import HardwareSocketMessageHandler from './hardware/hardwareSocketMessageHandler';

require('../playground/blocks');

const hardwareModuleType = {
    builtIn: 'builtin',
    module: 'module',
};

const hardwareStatement = {
    disconnected: 'disconnected',
    socketConnected: 'socketConnected',
    hardwareConnected: 'hardwareConnected',
};

Entry.HW = class {
    // 하드웨어 프로그램 접속용 주소 (https)
    get httpsServerAddress() {
        return 'https://hardware.playentry.org:23518';
    }

    // 하드웨어 프로그램 접속용 주소 (https)
    get httpsServerAddress2() {
        return 'https://hardware.play-entry.org:23518';
    }

    // 하드웨어 프로그램 접속용 주소 (http)
    get httpServerAddress() {
        return 'http://127.0.0.1:23518';
    }

    constructor() {
        this.sessionRoomId = localStorage.getItem('entryhwRoomId');
        if (!this.sessionRoomId) {
            this.sessionRoomId = this._createRandomRoomId();
            localStorage.setItem('entryhwRoomId', this.sessionRoomId);
        }

        this.TRIAL_LIMIT = 2;
        this.connected = false;
        this.portData = {};
        this.sendQueue = {};
        this.currentDeviceKey = null;
        this.hwModule = null;
        this.hwModuleType = hardwareModuleType.builtIn; // builtin, module
        this.socketType = null;
        this._externalSocketMessageListener = [];

        const { options = {} } = Entry;
        const { disableHardware = false } = options;

        this._hwPopupCreate();
        !disableHardware && this._initSocket();

        Entry.addEventListener('stop', this.setZero.bind(this));

        // hwChanged 에 걸려있는 다른 이벤트 함수와 동일선상에 두기위함
        Entry.addEventListener('hwChanged', this.refreshHardwareBlockMenu.bind(this));
    }

    _createRandomRoomId() {
        return 'xxxxxxxxyx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    async _loadExternalHardwareBlock(moduleName) {
        try {
            await Entry.moduleManager.loadExternalModule(moduleName);
        } catch (e) {
            Entry.toast.alert(
                Lang.Hw.hw_module_load_fail_title,
                `${moduleName} ${Lang.Hw.hw_module_load_fail_desc}`,
            );
        }
    }

    _initSocket() {
        this.connected = false;

        const connectHttpsWebSocket = (url) =>
            // TODO ajax 로 entry-hw 살아있는지 확인 후 연결시도 (TRIAL_LIMIT = ajax 로)
            this._trySocketConnect(url, {
                query: {
                    client: true,
                    roomId: this.sessionRoomId,
                },
            });

        if (this.socket) {
            this.socket.connect();
        } else {
            connectHttpsWebSocket(this.httpsServerAddress)
                .catch(() => connectHttpsWebSocket(this.httpsServerAddress2))
                .catch(() => {
                    if (['http:', 'file:'].indexOf(location.protocol) > -1) {
                        return connectHttpsWebSocket(this.httpServerAddress);
                    }
                })
                .catch(() => {
                    console.warn('All hardware socket connection failed');
                });
        }

        Entry.dispatchEvent('hwChanged');
    }

    _trySocketConnect(url, option) {
        return new Promise((resolve, reject) => {
            const socket = io(url, option);
            socket.io.reconnectionAttempts(this.TRIAL_LIMIT);
            socket.io.reconnectionDelayMax(1000);
            socket.io.timeout(1000);
            socket.on('connect', () => {
                this._initHardware(socket);
                socket.on('mode', (mode) => {
                    if (socket.mode === 0 && mode === 1) {
                        this._disconnectHardware();
                    }
                    this.socketMode = mode;
                    socket.mode = mode;
                });

                const messageHandler = new HardwareSocketMessageHandler(socket);
                messageHandler.addEventListener('init', this._loadExternalHardwareBlock.bind(this));
                messageHandler.addEventListener('state', async (statement, name) => {
                    /*
                    statement 로는 before_connect, connected 등 하드웨어 프로그램의 상태 전부가 오지만
                    WS 에서는 connected 외에 전부 socketConnected 상태로 머무르게 된다.
                     */
                    switch (statement) {
                        case 'disconnectHardware':
                            this._disconnectHardware();
                            break;
                        case 'connected':
                            // init action 과 동일동작
                            await this._loadExternalHardwareBlock(name);
                            break;
                        default:
                            break;
                    }
                });

                // 1.7.0 버전 이전 하드웨어 프로그램 종료로직 대응으로 남겨두어야 한다.
                messageHandler.addEventListener('disconnect', this._disconnectHardware.bind(this));
                messageHandler.addEventListener('data', (portData) => {
                    this.checkDevice(portData);
                    this._updatePortData(portData);
                    this.pending = false;
                    if (
                        this.communicationType === 'manual' &&
                        this.hwModule &&
                        this.hwModule.onReceiveData
                    ) {
                        this.hwModule.onReceiveData(portData);
                    }
                });

                socket.on('disconnect', () => {
                    // cloud PC 연결 클릭시 순간 disconnect 되고 재연결을 시도하기 위한 로직
                    this._initSocket();
                });
                resolve();
            });
            socket.on('reconnect_failed', () => {
                reject();
            });
        });
    }

    retryConnect() {
        this._initSocket();
    }

    openHardwareProgram() {
        this._executeHardware();

        if (!this.socket || !this.socket.connected) {
            setTimeout(() => {
                this._initSocket();
            }, 1000);
        }
    }

    /**
     * 하드웨어 프로그램과의 연결을 시도한다.
     * 만약 모듈이 로드되어있는 경우라면
     * 동일한 하드웨어 모듈을 로드하도록 하드웨어에 요청한다.
     * @param socket
     * @private
     */
    _initHardware(socket) {
        this.socket = socket;
        this.connected = true;
        console.log('Hardware Program connected'); // 하드웨어 프로그램 연결 성공, 스테이터스 변화 필요
        Entry.dispatchEvent('hwChanged');
        if (Entry.playground && Entry.playground.object) {
            Entry.playground.setMenu(Entry.playground.object.objectType);
        }
    }

    /**
     * 외부 하드웨어 모듈을 등록한다.
     * 이때 기존 외부 하드웨어 모듈이 추가되어있는 경우를 대비하여,
     * 현재 보여지고 있는 하드웨어 블록들을 전부 숨김처리한다.
     * @param moduleObject
     */
    setExternalModule(moduleObject) {
        this.hwModule = moduleObject;
        this.hwModuleType = hardwareModuleType.module;
        this._banClassAllHardware();
        Entry.dispatchEvent('hwChanged');
    }

    /**
     * 하드웨어 블록메뉴의 노출상태를 변경한다.
     * 최초 실행시 모든 하드웨어 블록 숨김 / 미연결 상태 버튼 출력
     * 현재 하드웨어 로드가 외부 모듈에 의한 것인 경우는 연결이 해제되어도 블록숨김을 실행하지 않는다.
     */
    refreshHardwareBlockMenu() {
        const blockMenu = Entry.getMainWS().blockMenu;

        if (!blockMenu) {
            return;
        }

        if (!this.hwModule) {
            // NOTE 이 코드는 하드웨어 블록 초기화 작업도 겸하므로 삭제금지
            this._banClassAllHardware();
        }

        const { disconnected, socketConnected, hardwareConnected } = hardwareStatement;
        if (this.connected) {
            if (this.hwModule) {
                blockMenu.unbanClass(this.hwModule.name);
                this._setHardwareDefaultMenu(hardwareConnected);
            } else {
                this._setHardwareDefaultMenu(socketConnected);
            }
        } else {
            this._setHardwareDefaultMenu(disconnected);
        }

        blockMenu.hwCodeOutdated = true;
        blockMenu._generateHwCode(true);
        blockMenu.reDraw();
    }

    /**
     * 하드웨어 버튼 노출상태를 변경한다.
     * @param statement {hardwareStatement}
     * @private
     */
    _setHardwareDefaultMenu(statement) {
        const blockMenu = Entry.getMainWS().blockMenu;

        if (!blockMenu) {
            return;
        }

        const { disconnected, socketConnected, hardwareConnected } = hardwareStatement;

        switch (statement) {
            case disconnected:
                blockMenu.unbanClass('arduinoDisconnected', true);
                blockMenu.banClass('arduinoConnected', true);
                blockMenu.banClass('arduinoConnect', true);
                break;
            case socketConnected:
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.banClass('arduinoConnected', true);
                blockMenu.unbanClass('arduinoConnect', true);
                break;
            case hardwareConnected:
                blockMenu.banClass('arduinoDisconnected', true);
                blockMenu.unbanClass('arduinoConnected', true);
                blockMenu.banClass('arduinoConnect', true);
                break;
        }
    }

    /**
     * 모든 하드웨어를 숨김처리한다. 현재 연결된 하드웨어도 예외는 없다.
     * @private
     */
    _banClassAllHardware() {
        const blockMenu = Entry.getMainWS().blockMenu;
        if (!blockMenu) {
            return;
        }

        Object.values(Entry.HARDWARE_LIST).forEach((hardware) => {
            blockMenu.banClass(hardware.name, true);
        });
    }

    _disconnectHardware() {
        Entry.propertyPanel && Entry.propertyPanel.removeMode('hw');
        this.currentDeviceKey = undefined;
        this.hwModule = undefined;
        this._externalSocketMessageListener = [];
        Entry.dispatchEvent('hwChanged');
    }

    disconnectSocket() {
        if (this.connected) {
            Entry.propertyPanel && Entry.propertyPanel.removeMode('hw');
            this.connected = false;
            this.currentDeviceKey = undefined;

            /*
            entryjs 내에 존재하던 기존 하드웨어의 경우 원래 프로세스에 따라 연결 종료시 보여주지 않는다.
            만약 외부모듈인 경우, 하드웨어가 연결종료 되더라도 블록은 남는다.
             */
            if (this.hwModuleType === hardwareModuleType.builtIn) {
                this.hwModule = undefined;
            }

            this.socket && this.socket.close();
            this.socket = undefined;

            Entry.dispatchEvent('hwChanged');
            Entry.toast.alert(
                Lang.Hw.hw_module_terminaltion_title,
                Lang.Hw.hw_module_terminaltion_desc,
                false,
            );
        }
    }

    /**
     * @deprecated
     */
    setDigitalPortValue(port, value) {
        console.warn('this function will be deprecated. please use Entry.hw.sendQueue directly.');
        this.sendQueue[port] = value;
        this.removePortReadable(port);
    }

    /**
     * @deprecated
     */
    getAnalogPortValue(port) {
        console.warn('this function will be deprecated. please use Entry.hw.portData directly.');
        if (!this.connected) {
            return 0;
        }
        return this.portData[`a${port}`];
    }

    /**
     * @deprecated
     */
    getDigitalPortValue(port) {
        console.warn('this function will be deprecated. please use Entry.hw.portData directly.');
        if (!this.connected) {
            return 0;
        }
        this.setPortReadable(port);
        if (this.portData[port] !== undefined) {
            return this.portData[port];
        } else {
            return 0;
        }
    }

    /**
     * @deprecated
     */
    setPortReadable(port) {
        console.warn('this function will be deprecated. please control port state directly.');
        if (!this.sendQueue.readablePorts) {
            this.sendQueue.readablePorts = [];
        }

        let isPass = false;
        for (const i in this.sendQueue.readablePorts) {
            if (this.sendQueue.readablePorts[i] == port) {
                isPass = true;
                break;
            }
        }

        if (!isPass) {
            this.sendQueue.readablePorts.push(port);
        }
    }

    /**
     * @deprecated
     */
    removePortReadable(port) {
        console.warn('this function will be deprecated. please use Entry.hw.sendQueue directly.');
        if (!this.sendQueue.readablePorts && !Array.isArray(this.sendQueue.readablePorts)) {
            return;
        }
        let target;
        for (const i in this.sendQueue.readablePorts) {
            if (this.sendQueue.readablePorts[i] == port) {
                target = Number(i);
                break;
            }
        }

        if (target != undefined) {
            this.sendQueue.readablePorts = this.sendQueue.readablePorts
                .slice(0, target)
                .concat(
                    this.sendQueue.readablePorts.slice(
                        target + 1,
                        this.sendQueue.readablePorts.length,
                    ),
                );
        }
    }

    update() {
        if (!this.socket || this.socket.disconnected) {
            return;
        }

        if (this.hwModule && this.hwModule.sendMessage) {
            this.hwModule.sendMessage(this);
        } else {
            this.pending = true;
            this._sendSocketMessage({
                data: JSON.stringify(this.sendQueue),
                mode: this.socket.mode,
                type: 'utf8',
            });
        }

        this.hwModule && this.hwModule.afterSend && this.hwModule.afterSend(this.sendQueue);
    }

    _sendSocketMessage(message) {
        if (this.connected && this.socket && !this.socket.disconnected) {
            this.socket.emit('message', message);
        }
    }

    _updatePortData(data) {
        this.portData = data;
        if (this.hwMonitor && Entry.propertyPanel && Entry.propertyPanel.selected === 'hw') {
            this.hwMonitor.update(this.portData, this.sendQueue);
        }
        if (this.hwModule && this.hwModule.afterReceive) {
            this.hwModule.afterReceive(this.portData);
        }
    }

    closeConnection() {
        if (this.socket) {
            this.socket.close();
        }
    }

    downloadConnector() {
        Entry.dispatchEvent('hwDownload', 'hardware');
    }

    downloadGuide() {
        Entry.dispatchEvent('hwDownload', 'manual');
    }

    downloadSource() {
        Entry.dispatchEvent('hwDownload', 'ino');
    }

    setZero() {
        this.pending = false;
        if (!this.hwModule) {
            return;
        }
        this.hwModule.setZero();
    }

    /**
     * 디바이스의 연결상태를 체크한다.
     * 만약 이미 바로 직전에 동일한 하드웨어와 연결된 경우는 dataHandler 로 데이터를 전송하기만 한다.
     * 새로운 하드웨어의 연결인 경우는 연결 하드웨어를 치환하고 엔트리에 상태변경을 요청한다.
     * @param data
     */
    checkDevice(data) {
        if (data.company === undefined) {
            return;
        }
        const key = [
            Entry.Utils.convertIntToHex(data.company),
            '.',
            Entry.Utils.convertIntToHex(data.model),
        ].join('');
        if (key === this.currentDeviceKey) {
            if (this.hwModule && this.hwModule.dataHandler) {
                this.hwModule.dataHandler(data);
            }
            return;
        }

        this.currentDeviceKey = key;
        this.hwModule = Entry.HARDWARE_LIST[key];
        if (!this.hwModule) {
            return;
        }
        this.communicationType = this.hwModule.communicationType || 'auto';
        this._banClassAllHardware();
        Entry.dispatchEvent('hwChanged');

        let descMsg = '';
        if (Entry.propertyPanel && this.hwModule.monitorTemplate) {
            descMsg = Lang.Msgs.hw_connection_success_desc;
            this._setHardwareMonitorTemplate();
        } else {
            descMsg = Lang.Msgs.hw_connection_success_desc2;
        }
        Entry.toast.success(Lang.Msgs.hw_connection_success, descMsg);
    }

    _setHardwareMonitorTemplate() {
        if (!this.hwMonitor) {
            this.hwMonitor = new Entry.HWMonitor(this.hwModule);
        } else {
            this.hwMonitor._hwModule = this.hwModule;
            this.hwMonitor.initView();
        }
        Entry.propertyPanel.addMode('hw', this.hwMonitor);
        const mt = this.hwModule.monitorTemplate;
        if (mt.mode === 'both') {
            mt.mode = 'list';
            this.hwMonitor.generateListView();
            mt.mode = 'general';
            this.hwMonitor.generateView();
            mt.mode = 'both';
        } else if (mt.mode === 'list') {
            this.hwMonitor.generateListView();
        } else {
            this.hwMonitor.generateView();
        }
    }

    _executeHardware() {
        const hw = this;
        const executeIeCustomLauncher = {
            _bNotInstalled: false,
            init(sUrl, fpCallback) {
                const width = 220;
                const height = 225;
                const left = window.screenLeft;
                const top = window.screenTop;
                const settings = `width=${width}, height=${height},  top=${top}, left=${left}`;
                this._w = window.open('/views/hwLoading.html', 'entry_hw_launcher', settings);
                let fnInterval = null;
                fnInterval = setTimeout(() => {
                    executeIeCustomLauncher.runViewer(sUrl, fpCallback);
                    clearInterval(fnInterval);
                }, 1000);
            },
            runViewer(sUrl, fpCallback) {
                this._w.document.write(
                    `<iframe src='${sUrl}' onload='opener.Entry.hw.ieLauncher.set()' style='display:none;width:0;height:0'></iframe>`,
                );
                let nCounter = 0;
                const bNotInstalled = false;
                let nInterval = null;
                nInterval = setInterval(() => {
                    try {
                        this._w.location.href;
                    } catch (e) {
                        this._bNotInstalled = true;
                    }

                    if (bNotInstalled || nCounter > 10) {
                        clearInterval(nInterval);
                        let nCloseCounter = 0;
                        let nCloseInterval = null;
                        nCloseInterval = setInterval(() => {
                            nCloseCounter++;
                            if (this._w.closed || nCloseCounter > 2) {
                                clearInterval(nCloseInterval);
                            } else {
                                this._w.close();
                            }
                            this._bNotInstalled = false;
                            nCounter = 0;
                        }, 5000);
                        fpCallback(!this._bNotInstalled);
                    }
                    nCounter++;
                }, 100);
            },
            set() {
                this._bNotInstalled = true;
            },
        };

        hw.ieLauncher = executeIeCustomLauncher;

        const entryHardwareUrl = `entryhw://-roomId:${this.sessionRoomId}`;
        if (navigator.userAgent.indexOf('MSIE') > 0 || navigator.userAgent.indexOf('Trident') > 0) {
            if (navigator.msLaunchUri !== undefined) {
                executeIe(entryHardwareUrl);
            } else {
                let ieVersion;
                if (document.documentMode > 0) {
                    ieVersion = document.documentMode;
                } else {
                    ieVersion = navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1];
                }

                if (ieVersion < 9) {
                    alert(Lang.msgs.not_support_browser);
                } else {
                    executeIeCustomLauncher.init(entryHardwareUrl, (bInstalled) => {
                        if (bInstalled === false) {
                            hw.openHardwareDownloadPopup();
                        }
                    });
                }
            }
        } else if (navigator.userAgent.indexOf('Firefox') > 0) {
            executeFirefox(entryHardwareUrl);
        } else if (
            navigator.userAgent.indexOf('Chrome') > 0 ||
            navigator.userAgent.indexOf('Safari') > 0
        ) {
            executeChrome(entryHardwareUrl);
        } else {
            alert(Lang.msgs.not_support_browser);
        }

        function executeIe(customUrl) {
            navigator.msLaunchUri(
                customUrl,
                () => {},
                () => {
                    hw.openHardwareDownloadPopup();
                },
            );
        }

        function executeFirefox(customUrl) {
            const iFrame = document.createElement('iframe');
            iFrame.src = 'about:blank';
            iFrame.style = 'display:none';
            document.getElementsByTagName('body')[0].appendChild(iFrame);
            let fnTimeout = null;
            fnTimeout = setTimeout(() => {
                let isInstalled = false;
                try {
                    iFrame.contentWindow.location.href = customUrl;
                    isInstalled = true;
                } catch (e) {
                    if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
                        isInstalled = false;
                    }
                }

                if (!isInstalled) {
                    hw.openHardwareDownloadPopup();
                }

                document.getElementsByTagName('body')[0].removeChild(iFrame);
                clearTimeout(fnTimeout);
            }, 500);
        }

        function executeChrome(customUrl) {
            let isInstalled = false;
            window.focus();
            $(window).one('blur', () => {
                isInstalled = true;
            });
            Entry.dispatchEvent('workspaceUnbindUnload', true);
            location.assign(encodeURI(customUrl));
            setTimeout(() => {
                Entry.dispatchEvent('workspaceBindUnload', true);
            }, 100);
            setTimeout(() => {
                if (isInstalled === false) {
                    hw.openHardwareDownloadPopup();
                }
                window.onblur = null;
            }, 3000);
        }
    }

    openHardwareDownloadPopup() {
        if (Entry.events_.openHardWareDownloadModal) {
            Entry.dispatchEvent('openHardWareDownloadModal');
        } else {
            Entry.hw.popupHelper.show('hwDownload', true);
        }
    }

    _hwPopupCreate() {
        const hw = this;
        if (!this.popupHelper) {
            if (window.popupHelper) {
                this.popupHelper = window.popupHelper;
            } else {
                this.popupHelper = new Entry.popupHelper(true);
            }
        }

        this.popupHelper.addPopup('hwDownload', {
            type: 'confirm',
            title: Lang.Msgs.not_install_title,
            setPopupLayout(popup) {
                const content = Entry.Dom('div', {
                    class: 'contentArea',
                });
                const text = Entry.Dom('div', {
                    class: 'textArea',
                    parent: content,
                });
                const text1 = Entry.Dom('div', {
                    class: 'text1',
                    parent: text,
                });
                const text2 = Entry.Dom('div', {
                    class: 'text2',
                    parent: text,
                });
                const text3 = Entry.Dom('div', {
                    class: 'text3',
                    parent: text,
                });
                const text4 = Entry.Dom('div', {
                    class: 'text4',
                    parent: text,
                });
                const cancel = Entry.Dom('div', {
                    classes: ['popupCancelBtn', 'popupDefaultBtn'],
                    parent: content,
                });
                const ok = Entry.Dom('div', {
                    classes: ['popupOkBtn', 'popupDefaultBtn'],
                    parent: content,
                });
                text1.text(Lang.Msgs.hw_download_text1);
                text2.html(Lang.Msgs.hw_download_text2);
                text3.text(Lang.Msgs.hw_download_text3);
                text4.text(Lang.Msgs.hw_download_text4);
                cancel.text(Lang.Buttons.cancel);
                ok.html(Lang.Msgs.hw_download_btn);

                content.bindOnClick('.popupDefaultBtn', function(e) {
                    const $this = $(this);
                    if ($this.hasClass('popupOkBtn')) {
                        hw.downloadConnector();
                    }

                    hw.popupHelper.hide('hwDownload');
                });

                popup.append(content);
            },
        });
    }
};
