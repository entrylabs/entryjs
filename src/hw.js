/**
 * @fileoverview HW object class for connect arduino.
 */
'use strict';

goog.require("Entry.HWMontior");

Entry.HW = function() {
    this.sessionRoomId = localStorage.getItem('entryhwRoomId');
    if(!this.sessionRoomId) {
        this.sessionRoomId = this.createRandomRoomId();
        localStorage.setItem('entryhwRoomId', this.sessionRoomId);
    }

    this.connectTrial = 0;
    this.isFirstConnect = true;
    this.requireVerion = 'v1.6.1';
    this.downloadPath = "http://download.play-entry.org/apps/Entry_HW_1.6.4_Setup.exe";
    this.hwPopupCreate();
    this.initSocket();
    this.connected = false;
    this.portData = {};
    this.sendQueue = {};
    this.outputQueue = {};
    this.settingQueue = {};
    this.selectedDevice = null;
    this.hwModule = null;
    this.socketType = null;

    Entry.addEventListener('stop', this.setZero);

    this.hwInfo = {
        '1.1': Entry.Arduino,
        '1.9': Entry.ArduinoExt,
        '1.2': Entry.SensorBoard,
        '1.3': Entry.CODEino,
        '1.4': Entry.joystick,
        '1.5': Entry.dplay,
        '1.6': Entry.nemoino,
        '1.7': Entry.Xbot,
        '1.8': Entry.ardublock,
        '1.A': Entry.Cobl,
        '2.4': Entry.Hamster,
        '2.5': Entry.Albert,
        '3.1': Entry.Bitbrick,
        '4.2': Entry.Arduino,
        '5.1': Entry.Neobot,
        '7.1': Entry.Robotis_carCont,
        '7.2': Entry.Robotis_openCM70,
        '8.1': Entry.Arduino,
        '10.1': Entry.Roborobo_Roduino,
        '10.2': Entry.Roborobo_SchoolKit,
        '12.1': Entry.EV3,
        'B.1': Entry.Codestar,
        'A.1': Entry.SmartBoard,
        'C.1': Entry.DaduBlock,
        'D.1': Entry.robotori,
        'F.1': Entry.byrobot_dronefighter_controller,
        'F.2': Entry.byrobot_dronefighter_drive,
        'F.3': Entry.byrobot_dronefighter_flight,
    };
};

Entry.HW.TRIAL_LIMIT = 2;

var p = Entry.HW.prototype;

p.createRandomRoomId = function() {
    return 'xxxxxxxxyx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

p.connectWebSocket = function(url, option) {
    var hw = this;
    var socket = io(url, option);
    socket.io.reconnectionAttempts(Entry.HW.TRIAL_LIMIT);
    socket.io.reconnectionDelayMax(1000);
    socket.io.timeout(1000);
    socket.on('connect', function() {
        hw.socketType = 'WebSocket';
        hw.initHardware(socket);
    });

    socket.on('mode', function (mode) {
        if(socket.mode === 0 && mode === 1) {
            hw.disconnectHardware();
        }
        hw.socketMode = mode;
        socket.mode = mode;
    });

    socket.on('message', function(msg) {
        if(msg.data && typeof msg.data === 'string') {
             switch(msg.data) {
                case 'disconnectHardware': {
                    hw.disconnectHardware();
                    break;
                }
                default: {
                    var data = JSON.parse(msg.data);
                    hw.checkDevice(data, msg.version);
                    hw.updatePortData(data);
                    break;
                }
            }
        }
    });

    socket.on('disconnect', function() {
        hw.initSocket();
    }); 

    return socket;
}

p.initSocket = function() {
    try{
        var hw = this;
        var protocol = '';
        this.connected = false;

        if(this.tlsSocketIo) {
            this.tlsSocketIo.removeAllListeners();
        }        
        if(this.socketIo) {
            this.socketIo.removeAllListeners();
        }
        
        if(!this.isOpenHardware) {
            this.checkOldClient();
        }
        if(location.protocol.indexOf('https') > -1) {
            this.tlsSocketIo = this.connectWebSocket('https://hardware.play-entry.org:23518', { query:{ 'client': true, 'roomId' : this.sessionRoomId } });
        } 
        // 일단 보류(?)
        /*else if(Entry.isOffline){
            this.tlsSocketIo = this.connectWebSocket('http://127.0.0.1:23518', { query:{'client': true, 'roomId' : this.sessionRoomId } });
        }*/ 
        else {
            try {
                this.socketIo = this.connectWebSocket('http://127.0.0.1:23518', { query:{'client': true, 'roomId' : this.sessionRoomId } });
            } catch(e) { }
            try {
                this.tlsSocketIo = this.connectWebSocket('https://hardware.play-entry.org:23518', { query:{'client': true, 'roomId' : this.sessionRoomId } });
            } catch(e) { }
        }

        Entry.dispatchEvent("hwChanged");
    } catch(e) {}
};

p.checkOldClient = function() {
    try {
        var hw = this;
        var websocket = new WebSocket('wss://hardware.play-entry.org:23518');
        websocket.onopen = function() {
            hw.popupHelper.show('newVersion', true);
            websocket.close();
        }
    } catch(e) {}
};

p.retryConnect = function() {
    this.isOpenHardware = false;
    Entry.HW.TRIAL_LIMIT = 5;
    this.initSocket();
};

p.openHardwareProgram = function() {
    var hw = this;
    this.isOpenHardware = true;
    Entry.HW.TRIAL_LIMIT = 5;
    this.executeHardware();
    
    if(!this.socket || !this.socket.connected) {
        setTimeout(function() {
            hw.initSocket();
        }, 1000);
    }
}

p.initHardware = function(socket) {
    this.socket = socket;
    this.connectTrial = 0;
    this.connected = true;
    Entry.dispatchEvent("hwChanged");
    if (Entry.playground && Entry.playground.object) {
        Entry.playground.setMenu(Entry.playground.object.objectType);
    }
}

p.disconnectHardware = function() {
    Entry.propertyPanel.removeMode("hw");
    this.selectedDevice = undefined;
    this.hwModule = undefined;
    Entry.dispatchEvent("hwChanged");
}

p.disconnectedSocket = function() {
    this.tlsSocketIo.close();
    if(this.socketIo) {
        this.socketIo.close();
    }

    Entry.propertyPanel.removeMode("hw");
    this.socket = undefined;
    this.connectTrial = 0;
    this.connected = false;
    this.selectedDevice = undefined;
    this.hwModule = undefined;
    Entry.dispatchEvent("hwChanged");
    Entry.toast.alert(
        "하드웨어 프로그램 연결 종료",
        "하드웨어 프로그램과의 연결이 종료되었습니다.",
        false
    );
}

p.setDigitalPortValue = function(port, value) {
    this.sendQueue[port] = value;
    this.removePortReadable(port);
};

p.getAnalogPortValue = function(port) {
    if (!this.connected) {
        return 0;
    }
    return this.portData['a'+port];
};

p.getDigitalPortValue = function(port) {
    if (!this.connected)
        return 0;
    this.setPortReadable(port);
    if (this.portData[port] !== undefined) {
        return this.portData[port];
    }
    else {
        return 0;
    }
};

p.setPortReadable = function(port) {
    if (!this.sendQueue.readablePorts) {
        this.sendQueue.readablePorts = [];
    }

    var isPass = false;
    for(var i in this.sendQueue.readablePorts) {
        if(this.sendQueue.readablePorts[i] == port) {
            isPass = true;
            break;
        }
    }

    if(!isPass) {
        this.sendQueue.readablePorts.push(port);
    }
};
p.removePortReadable = function(port) {
    if (!this.sendQueue.readablePorts && !Array.isArray(this.sendQueue.readablePorts))
        return;
    var target;
    for(var i in this.sendQueue.readablePorts) {
        if(this.sendQueue.readablePorts[i] == port) {
            target = Number(i);
            break;
        }
    }

    if(target != undefined) {
        this.sendQueue.readablePorts = this.sendQueue.readablePorts.slice(0, target).concat(this.sendQueue.readablePorts.slice(target + 1, this.sendQueue.readablePorts.length));
    } else {
        this.sendQueue.readablePorts = [];
    }
}

p.update = function() {
    if (!this.socket) {
        return;
    }
    if(this.socket.disconnected) {
        return;
    }
    this.socket.emit('message', { data:JSON.stringify(this.sendQueue), mode: this.socket.mode, type:'utf8' });
};

p.updatePortData = function(data) {
    this.portData = data;
    if (this.hwMonitor && Entry.propertyPanel.selected == 'hw') {
        this.hwMonitor.update();
    }
};

p.closeConnection = function() {
    if (this.socket) {
        this.socket.close();
    }
};

p.downloadConnector = function() {
    var win = window.open(this.downloadPath, '_blank');
    win.focus();
};

p.downloadGuide = function() {
    var url = "http://download.play-entry.org/data/%EC%97%94%ED%8A%B8%EB%A6%AC%20%ED%95%98%EB%93%9C%EC%9B%A8%EC%96%B4%20%EC%97%B0%EA%B2%B0%20%EB%A7%A4%EB%89%B4%EC%96%BC(%EC%98%A8%EB%9D%BC%EC%9D%B8%EC%9A%A9).pdf";
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'download';
    anchor.click();
    anchor = undefined;
};

p.downloadSource = function() {
    var url = "http://play-entry.com/down/board.ino";
    var win = window.open(url, '_blank');
    win.focus();
};

p.setZero = function() {
    if (!Entry.hw.hwModule)
        return;
    Entry.hw.hwModule.setZero();
};

p.checkDevice = function(data, version) {
    if (data.company === undefined)
        return;
    var key = [Entry.Utils.convertIntToHex(data.company), '.', Entry.Utils.convertIntToHex(data.model)].join('');
    if (key == this.selectedDevice)
        return;

    if(Entry.Utils.isNewVersion(version, this.requireVerion)) {
        this.popupHelper.show('newVersion', true);
    }

    this.selectedDevice = key;
    this.hwModule = this.hwInfo[key];
    Entry.dispatchEvent("hwChanged");
    Entry.toast.success(
        "하드웨어 연결 성공",
        "하드웨어 아이콘을 더블클릭하면, 센서값만 확인할 수 있습니다.",
        false
    );
    if (this.hwModule.monitorTemplate) {
        if(!this.hwMonitor) {
            this.hwMonitor = new Entry.HWMonitor(this.hwModule);
        } else {
            this.hwMonitor._hwModule = this.hwModule;
            this.hwMonitor.initView();
        }
        Entry.propertyPanel.addMode("hw", this.hwMonitor);
        var mt = this.hwModule.monitorTemplate;
        if(mt.mode == "both") {
            mt.mode = "list";
            this.hwMonitor.generateListView();
            mt.mode = "general";
            this.hwMonitor.generateView();
            mt.mode = "both";
        } else if(mt.mode == "list") {
            this.hwMonitor.generateListView();
        } else {
            this.hwMonitor.generateView();
        }
    }
};

p.banHW = function() {
    var hwOptions = this.hwInfo;
    for (var i in hwOptions) {
        Entry.playground.mainWorkspace.blockMenu.banClass(hwOptions[i].name, true);
    }
};

p.executeHardware = function() {
    var hw = this;
    var executeIeCustomLauncher = {
        _bNotInstalled : false,
        init : function(sUrl, fpCallback) {
            var width = 220;
            var height = 225;
            var left = window.screenLeft;
            var top = window.screenTop;
            var settings = 'width=' + width + ', height=' + height + ',  top=' + top + ', left=' + left;
            this._w = window.open('/views/hwLoading.html', "entry_hw_launcher", settings);
            var fnInterval = null;
            fnInterval = setTimeout(function() {
                executeIeCustomLauncher.runViewer(sUrl, fpCallback);
                clearInterval(fnInterval);
            }, 1000);
        },
        runViewer : function(sUrl, fpCallback) {
            this._w.document.write("<iframe src='"+ sUrl +"' onload='opener.Entry.hw.ieLauncher.set()' style='display:none;width:0;height:0'></iframe>");
            var nCounter = 0;
            var bNotInstalled = false;
            var nInterval = null;
            nInterval = setInterval((function() {
                try {
                    this._w.location.href;
                }
                catch(e) {
                    this._bNotInstalled = true;
                }

                if(bNotInstalled || nCounter > 10) {
                    clearInterval(nInterval);
                    var nCloseCounter = 0;
                    var nCloseInterval = null;
                    nCloseInterval = setInterval((function() {
                        nCloseCounter++;
                        if(this._w.closed || nCloseCounter > 2) {
                            clearInterval(nCloseInterval);
                        } else {
                            this._w.close();
                        }
                        this._bNotInstalled = false;
                        nCounter = 0;
                    }).bind(this), 5000);
                    fpCallback(!this._bNotInstalled);
                }
                nCounter++;
            }).bind(this), 100);
        },
        set : function() {
            this._bNotInstalled = true;
        }
    };

    hw.ieLauncher = executeIeCustomLauncher;

    var entryHardwareUrl = 'entryhw://-roomId:' + this.sessionRoomId;
    if(navigator.userAgent.indexOf("MSIE") > 0 || navigator.userAgent.indexOf("Trident") > 0){
        if (navigator.msLaunchUri != undefined) {
            executeIe(entryHardwareUrl);
        } else {
            var ieVersion;
            if(document.documentMode > 0) {
                ieVersion = document.documentMode;
            } else {
                ieVersion = navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1];
            }

            if (ieVersion < 9) {
                alert(Lang.msgs.not_support_browser);
            } else {
                executeIeCustomLauncher.init(entryHardwareUrl,
                    function(bInstalled) {
                        if (bInstalled == false) {
                            hw.popupHelper.show('hwDownload', true);
                        }
                    }
                );
            }
        }
    }
    else if(navigator.userAgent.indexOf("Firefox") > 0 ) {
        executeFirefox(entryHardwareUrl);
    }
    else if(navigator.userAgent.indexOf("Chrome") > 0 || navigator.userAgent.indexOf("Safari") > 0) {
        executeChrome(entryHardwareUrl);
    } else {
        alert(Lang.msgs.not_support_browser);
    }

    function executeIe(customUrl) {
        navigator.msLaunchUri(customUrl,
            function() {
            },
            function() {
                hw.popupHelper.show('hwDownload', true);
            }
        );
    }

    function executeFirefox(customUrl) {
        var iFrame = document.createElement('iframe');
        iFrame.src = "about:blank";
        iFrame.style = "display:none";
        document.getElementsByTagName("body")[0].appendChild(iFrame);
        var fnTimeout = null;
        fnTimeout = setTimeout(function() {
            var isInstalled = false;
            try{
                iFrame.contentWindow.location.href = customUrl;
                isInstalled = true;
            }catch(e){
                if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL"){
                    isInstalled = false;
                }
            }

            if(!isInstalled) {
                hw.popupHelper.show('hwDownload', true);
            }

            document.getElementsByTagName("body")[0].removeChild(iFrame);
            clearTimeout(fnTimeout);
        }, 500);
    }

    function executeChrome(customUrl) {
        var isInstalled = false;
        window.focus();
        $(window).one('blur', function() {
            isInstalled = true;
        });
        Entry.dispatchEvent('workspaceUnbindUnload', true);
        location.assign(encodeURI(customUrl));
        setTimeout(function() {
            Entry.dispatchEvent('workspaceBindUnload', true);
        }, 100);
        setTimeout(function() {
            if (isInstalled == false) {
                hw.popupHelper.show('hwDownload', true);
            }
            window.onblur = null;
        }, 3000);
    }
}

p.hwPopupCreate = function () {
    var hw = this;
    if(!this.popupHelper) {
        if(window.popupHelper) {
            this.popupHelper = window.popupHelper
        } else {
            this.popupHelper = new Entry.popupHelper(true);
        }
    }

    this.popupHelper.addPopup('newVersion', {
        type: 'confirm',
        title: Lang.Msgs.new_version_title,
        setPopupLayout : function (popup) {
            var content = Entry.Dom('div', {
                class: 'contentArea'
            });
            var text = Entry.Dom('div', {
                class : 'textArea',
                parent: content
            });
            var text1 = Entry.Dom('div', {
                class : 'text1',
                parent: text
            });
            var text2 = Entry.Dom('div', {
                class : 'text2',
                parent: text
            });
            var text3 = Entry.Dom('div', {
                class : 'text3',
                parent: text
            });
            var text4 = Entry.Dom('div', {
                class : 'text4',
                parent: text
            });
            var cancel = Entry.Dom('div', {
                classes : ['popupCancelBtn', 'popupDefaultBtn'],
                parent: content
            });
            var ok = Entry.Dom('div', {
                classes : ['popupOkBtn', 'popupDefaultBtn'],
                parent: content
            });
            text1.text(Lang.Msgs.new_version_text1);
            text2.html(Lang.Msgs.new_version_text2);
            text3.text(Lang.Msgs.new_version_text3);
            text4.text(Lang.Msgs.new_version_text4);
            cancel.text(Lang.Buttons.cancel);
            ok.html(Lang.Msgs.new_version_download);

            content.bindOnClick('.popupDefaultBtn', function (e) {
                var $this = $(this);
                if($this.hasClass('popupOkBtn')) {
                    hw.downloadConnector();
                }

                hw.popupHelper.hide('newVersion');
            });

            popup.append(content);
        }
    });

    this.popupHelper.addPopup('hwDownload', {
        type: 'confirm',
        title: Lang.Msgs.not_install_title,
        setPopupLayout : function (popup) {
            var content = Entry.Dom('div', {
                class: 'contentArea'
            });
            var text = Entry.Dom('div', {
                class : 'textArea',
                parent: content
            });
            var text1 = Entry.Dom('div', {
                class : 'text1',
                parent: text
            });
            var text2 = Entry.Dom('div', {
                class : 'text2',
                parent: text
            });
            var text3 = Entry.Dom('div', {
                class : 'text3',
                parent: text
            });
            var text4 = Entry.Dom('div', {
                class : 'text4',
                parent: text
            });
            var cancel = Entry.Dom('div', {
                classes : ['popupCancelBtn', 'popupDefaultBtn'],
                parent: content
            });
            var ok = Entry.Dom('div', {
                classes : ['popupOkBtn', 'popupDefaultBtn'],
                parent: content
            });
            text1.text(Lang.Msgs.hw_download_text1);
            text2.html(Lang.Msgs.hw_download_text2);
            text3.text(Lang.Msgs.hw_download_text3);
            text4.text(Lang.Msgs.hw_download_text4);
            cancel.text(Lang.Buttons.cancel);
            ok.html(Lang.Msgs.hw_download_btn);

            content.bindOnClick('.popupDefaultBtn', function (e) {
                var $this = $(this);
                if($this.hasClass('popupOkBtn')) {
                    hw.downloadConnector();
                }

                hw.popupHelper.hide('hwDownload');
            });

            popup.append(content);
        }
    });
}
