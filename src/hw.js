/**
 * @fileoverview HW object class for connect arduino.
 */
'use strict';

Entry.HW = function() {
    this.connectTrial = 0;
    this.isFirstConnect = true;

    this.initSocket();
    this.connected = false;
    this.portData = {};
    this.sendQueue = {};
    this.settingQueue = {};
    this.selectedDevice = null;
    this.hwModule = null;

    Entry.addEventListener('stop', this.setZero);

    this.hwInfo = {
        '11': Entry.Arduino,
        '12': Entry.SensorBoard,
        '13': Entry.CODEino,
        '24': Entry.Hamster,
        '25': Entry.Albert,
        '31': Entry.Bitbrick
    };
};

Entry.HW.TRIAL_LIMIT = 1;

var p = Entry.HW.prototype;

p.initSocket = function() {
    if (this.connectTrial >= Entry.HW.TRIAL_LIMIT) {
        if (!this.isFirstConnect)
            Entry.toast.alert(Lang.Menus.connect_hw,
                              Lang.Menus.connect_fail,
                              false);
        this.isFirstConnect = false;
        return;
    }
    var hw = this;
    // var socket = new WebSocket("ws://localhost:23518");
    var socket = io.connect('ws://localhost:23518');
    this.socket = socket;
    this.connected = false;
    socket.binaryType = "arraybuffer";
    this.connectTrial++;

    socket.on('connect', function (data) {
        hw.initHardware();
    });
    socket.on('message', function (evt) {
        if(typeof evt === 'string') {
            var data = JSON.parse(evt);
            hw.checkDevice(data);
            hw.updatePortData(data);
        }
    });
    socket.on('disconnect', function (data) {
        hw.initHardware();
    });

    Entry.dispatchEvent("hwChanged");
};

p.retryConnect = function() {
    this.connectTrial = 0;
    this.initSocket();
};

p.initHardware = function() {
    this.connectTrial = 0;

    this.connected = true;
    Entry.dispatchEvent("hwChanged");
    if (Entry.playground && Entry.playground.object)
        Entry.playground.setMenu(Entry.playground.object.objectType);
};

p.setDigitalPortValue = function(port, value) {
    this.sendQueue[port] = value;
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
    this.sendQueue.readablePorts.push(port);
};

p.update = function() {
    if (!this.socket)
        return;
    if (this.socket.io.readyState != 'open')
        return;
    this.socket.emit('message', JSON.stringify(this.sendQueue));
    this.sendQueue.readablePorts = [];
    if (false) {
        var bytes = [], queryString;
        for (var port in this.settingQueue) {
            var value = this.settingQueue[port];
            if (value) {
                query = (5 << 5) + (port << 1);
                bytes.push(query);
            } else {
            }
        }
        for (var port in this.sendQueue) {
            var value = this.sendQueue[port];
            var query;
            if (value == 255 || value === 0) {
                query = (7 << 5) + (port << 1) + (value == 255 ? 1 : 0);
                bytes.push(query);
            } else {
                query = (6 << 5) + (port << 1) + (value > 127 ? 1 : 0);
                bytes.push(query);
                query = value & 127;
                bytes.push(query);
            }
        }
        this.sendQueue = {};
        var buf = new Uint8Array(bytes.length);
        for (var i = 0; i < bytes.length; i++) {
            buf[i] = bytes[i];
        }

        this.socket.emit('message', buf);
    }
};

p.updatePortData = function(data) {
    this.portData = data;
};

p.closeConnection = function() {
    if (this.socket) {
        this.socket.emit('close');
        this.socket.close();
    }
};

p.downloadConnector = function() {
    var url = "http://play-entry.org/down/Entry_HW_v1.1.2.exe";
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
        Lang.Menus.connect_hw,
        Lang.Menus.connect_message.replace(
            "%1",
            Lang.Device[Entry.hw.hwModule.name]
        ),
        false
    );
};

p.banHW = function() {
    var hwOptions = this.hwInfo;
    for (var i in hwOptions)
        Entry.playground.blockMenu.banClass(hwOptions[i].name);
};
