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
        '11': Entry.Arduino,
        '12': Entry.SensorBoard,
        '13': Entry.CODEino,
        '15': Entry.dplay,
        '17': Entry.Xbot,        
        '24': Entry.Hamster,
        '25': Entry.Albert,
        '31': Entry.Bitbrick,
        '42': Entry.Arduino,
        '51': Entry.Neobot,
        '71': Entry.Robotis_carCont,
        '72': Entry.Robotis_openCM70
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
        if(location.protocol.indexOf('https') > -1) {
            socketSecurity = new WebSocket("wss://localhost:23518");
        } else {
            try{
                socket = new WebSocket("ws://localhost:23518");
            } catch(e) {}
            try{
                socketSecurity = new WebSocket("wss://localhost:23518");
            } catch(e) {
            }
        }

        this.connected = false;
        socket.binaryType = "arraybuffer";
        socketSecurity.binaryType = "arraybuffer";
        this.connectTrial++;

        socket.onopen = function()
        {
            hw.socketType = 'WebSocket';
            hw.initHardware(socket);
        };

        socket.onmessage = function (evt)
        {
            var data = JSON.parse(evt.data);
            hw.checkDevice(data);
            hw.updatePortData(data);
        };

        socket.onclose = function()
        {
            if(hw.socketType === 'WebSocket') {
                this.socket = null;
                hw.initSocket();
            }
        };

        socketSecurity.onopen = function()
        {
            hw.socketType = 'WebSocketSecurity';
            hw.initHardware(socketSecurity);
        };

        socketSecurity.onmessage = function (evt)
        {
            var data = JSON.parse(evt.data);
            hw.checkDevice(data);
            hw.updatePortData(data);
        };

        socketSecurity.onclose = function()
        {
            if(hw.socketType === 'WebSocketSecurity') {
                this.socket = null;
                hw.initSocket();
            }
        };

        Entry.dispatchEvent("hwChanged");
    } catch(e) {}
};

p.retryConnect = function() {
    this.connectTrial = 0;
    this.initSocket();
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
        this.sendQueue = [];
        this.sendQueue.readablePorts = [];
    }
}

p.update = function() {
    if (!this.socket) {
        return;
    }

    if(this.socket.readyState != 1) {
        return;
    }

    this.socket.send(JSON.stringify(this.sendQueue));
    // this.sendQueue.readablePorts = [];
};

p.updatePortData = function(data) {
    this.portData = data;
    if (this.hwMonitor)
        this.hwMonitor.update();
};

p.closeConnection = function() {
    if (this.socket) {
        this.socket.close();
    }
};

p.downloadConnector = function() {
    var url = "http://github.com/entrylabs/entry-hw/releases/download/1.5.0/Entry_HW_1.5.0_Setup.exe";
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
    var key = ''+data.company + data.model;
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
        Entry.playground.blockMenu.banClass(hwOptions[i].name);

};
