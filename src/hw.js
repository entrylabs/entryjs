/**
 * @fileoverview HW object class for connect arduino.
 */
'use strict';

goog.require("Entry.HWMontior");

Entry.HW = function() {
    this.connectTrial = 0;
    this.isFirstConnect = true;

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
        'B.1': Entry.Codestar
    };
};

Entry.HW.TRIAL_LIMIT = 1;

var p = Entry.HW.prototype;

p.initSocket = function() {
    try{
        if (this.connectTrial >= Entry.HW.TRIAL_LIMIT) {
            if (!this.isFirstConnect)
                Entry.toast.alert(Lang.Menus.connect_hw,
                                  Lang.Menus.connect_fail,
                                  false);
            this.isFirstConnect = false;
            return;
        }
        var hw = this;

        var socket, socketSecurity;
        var protocol = '';
        this.connected = false;
        this.connectTrial++;

        if(location.protocol.indexOf('https') > -1) {
            socketSecurity = io('https://hardware.play-entry.org:23518', {reconnectionAttempts: Entry.HW.TRIAL_LIMIT, query:{'client': true}});
        } else {
            try{
                socket = io('https://127.0.0.1:23518', {reconnectionAttempts: Entry.HW.TRIAL_LIMIT, query:{'client': true}});
                socket.on('connect', function() {
                    socketSecurity.close();
                    hw.socketType = 'WebSocket';
                    hw.initHardware(socket);
                });

                socket.on('mode', function (mode) {
                    socket.mode = mode;
                });

                socket.on('message', function(msg) {
                    if(msg.data && typeof msg.data === 'string') {
                        var data = JSON.parse(msg.data);
                        hw.checkDevice(data);
                        hw.updatePortData(data);
                    }
                });

                socket.on('disconnect reconnecting', function() {
                    if(hw.socketType === 'WebSocket') {
                        hw.socket = null;
                        hw.initSocket();
                    }
                });

                socket.on('reconnecting', function() {
                    if(hw.socketType === 'WebSocket') {
                        hw.socket = null;
                        hw.initSocket();
                    }
                });
            } catch(e) {}
            try{
                socketSecurity = io('https://hardware.play-entry.org:23518', {reconnectionAttempts: Entry.HW.TRIAL_LIMIT, query:{'client': true}});
            } catch(e) {
            }
        }

        socketSecurity.on('connect', function() {
            socket.close();
            hw.socketType = 'WebSocket';
            hw.initHardware(socketSecurity);
        });

        socketSecurity.on('mode', function (mode) {
            socketSecurity.mode = mode;
        });

        socketSecurity.on('message', function(msg) {
            if(msg.data && typeof msg.data === 'string') {
                var data = JSON.parse(msg.data);
                hw.checkDevice(data);
                hw.updatePortData(data);
            }
        });

        socketSecurity.on('disconnect', function() {
            if(hw.socketType === 'WebSocket') {
                hw.socket = null;
                hw.initSocket();
            }
        });
        socketSecurity.on('reconnecting', function() {
            if(hw.socketType === 'WebSocket') {
                hw.socket = null;
                hw.initSocket();
            }
        });

        Entry.dispatchEvent("hwChanged");
    } catch(e) {}
};

p.retryConnect = function() {
    if(this.socket) {
        this.executeHardware();
    } else {
        this.executeHardware();
        this.connectTrial = 0;
        this.initSocket();
    }
};

p.initHardware = function(socket) {
    this.socket = socket;
    this.connectTrial = 0;

    this.connected = true;
    Entry.dispatchEvent("hwChanged");
    if (Entry.playground && Entry.playground.object)
        Entry.playground.setMenu(Entry.playground.object.objectType);
};

p.setDigitalPortValue = function(port, value) {
    this.sendQueue[port] = value;
    this.removePortReadable(port);
};

p.getAnalogPortValue = function(port) {
    if (!this.connected)
        return 0;
    return this.portData['a'+port];
};

p.getDigitalPortValue = function(port) {
    if (!this.connected)
        return 0;
    this.setPortReadable(port);
    if (this.portData[port] !== undefined) {
        return this.portData[port];
    }
    else
        return 0;
};

p.setPortReadable = function(port) {
    if (!this.sendQueue.readablePorts)
        this.sendQueue.readablePorts = [];

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

    // if(this.socket.readyState != 1) {
    //     return;
    // }

    this.socket.emit('message', {data:JSON.stringify(this.sendQueue), mode: this.socket.mode, type:'utf8'});
};

p.updatePortData = function(data) {
    this.portData = data;
    if (this.hwMonitor
        && Entry.propertyPanel.selected == 'hw') {
        this.hwMonitor.update();
    }
};

p.closeConnection = function() {
    if (this.socket) {
        this.socket.close();
    }
};

p.downloadConnector = function() {
    var url = "http://download.play-entry.org/apps/Entry_HW_1.5.11_Setup.exe";
    var win = window.open(url, '_blank');
    win.focus();
};

p.downloadGuide = function() {
    var url = "http://download.play-entry.org/data/%EC%97%94%ED%8A%B8%EB%A6%AC-%ED%95%98%EB%93%9C%EC%9B%A8%EC%96%B4%EC%97%B0%EA%B2%B0%EB%A7%A4%EB%89%B4%EC%96%BC_16_08_17.hwp";
    var win = window.open(url, '_blank');
    win.focus();
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

p.checkDevice = function(data) {
    if (data.company === undefined)
        return;
    var key = [Entry.Utils.convertIntToHex(data.company), '.', Entry.Utils.convertIntToHex(data.model)].join('');
    if (key == this.selectedDevice)
        return;
    this.selectedDevice = key;
    this.hwModule = this.hwInfo[key];
    Entry.dispatchEvent("hwChanged");
    Entry.toast.success(
        "하드웨어 연결 성공",
        /* Lang.Menus.connect_message.replace(
            "%1",
            Lang.Device[Entry.hw.hwModule.name]
        ) +*/ "하드웨어 아이콘을 더블클릭하면, 센서값만 확인할 수 있습니다.",
        true
    );
    if (this.hwModule.monitorTemplate) {

        if(!this.hwMonitor) {
            this.hwMonitor =new Entry.HWMonitor(this.hwModule);
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
    for (var i in hwOptions)
        Entry.playground.mainWorkspace.blockMenu.banClass(hwOptions[i].name, true);

};

p.executeHardware = function() {

    var executeIeCustomLauncher = {
        _bNotInstalled : false,
        init : function(sUrl, fpCallback) {
            var width = 1;
            var height = 1;
            var left = window.screenLeft;
            var top = window.screenTop;
            var settings = 'width=' + width + ', height=' + height + ',  top=' + top + ', left=' + left;
            this._w = window.open('', "comic_viewer_launcher", settings);
            var fnInterval = null;
            fnInterval = setTimeout(function() {
                executeIeCustomLauncher.runViewer(sUrl, fpCallback);
                clearInterval(fnInterval);
            }, 1000);
        },
        runViewer : function(sUrl, fpCallback) {
            this._w.document.write("<iframe src='"+ sUrl +"' onload='opener.ieCustomLaunch.set()' style='display:none;width:0;height:0'></iframe>");
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
    var clientId = (this.socket) ? this.socket.id : '';
    var entryHardwareUrl = 'entryhw://-clientId:' + clientId;

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
                alert("지원하지 않는 브라우저입니다.");
            } else {
                executeIeCustomLauncher.init(entryHardwareUrl,
                    function(bInstalled) {
                        if (bInstalled == false) {
                            alert('설치안됬엉');
                             // window.open(VIWER_DOWNLOAD_URL, "comic_viewer_download", "width=530, height=400, resizable=yes");
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
        alert("지원하지 않는 브라우저입니다.");
    }

    function executeIe(customUrl) {
        navigator.msLaunchUri(customUrl,
            function() {
            },
            function() {
                alert('설치안됬엉');
                // var popup = window.open(VIWER_DOWNLOAD_URL, "comic_viewer_launcher", "width=510, height=360, resizable=yes");
                // if(window.focus){
                //     setTimeout(function(){
                //         popup.focus();
                //     }, 500);
                // }
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
                alert('설치안됬엉');
                // var popup = window.open(VIWER_DOWNLOAD_URL, "comic_viewer_launcher", "width=510, height=360, resizable=yes");
                // if(window.focus){
                //     setTimeout(function(){
                //         if (popup == null || typeof(popup)=='undefined') {
                //             alert("Firefox 설정에 팝업 창 차단을 해제해주세요.");
                //         } else {
                //             popup.focus();
                //         }
                //     }, 500);
                // }
            }

            document.getElementsByTagName("body")[0].removeChild(iFrame);
            clearTimeout(fnTimeout);
        }, 500);
    }

    function executeChrome(customUrl) {
        var isInstalled = false;
        window.focus();
        window.onblur = function() {
            isInstalled = true;
        };

        location.assign(encodeURI(customUrl));
        setTimeout(function() {
            if (isInstalled == false || navigator.userAgent.indexOf("Edge") > 0) {
                alert('설치 안됬엉');
                // var popup = window.open(VIWER_DOWNLOAD_URL, "comic_viewer_launcher", "width=530, height=400, resizable=yes");
                // if(window.focus){
                //     setTimeout(function(){
                //         popup.focus();
                //     }, 500);
                // }
            }
            window.onblur = null;
        }, 1500);
    }
}

