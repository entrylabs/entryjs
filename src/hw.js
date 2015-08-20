/**
 * @fileoverview HW object class for connect arduino.
 */
'use strict';

Entry.HW = function() {
    this.connectTrial = 0;
    this.isFirstConnect = true;

    if ("WebSocket" in window)
    {
        try {
            this.initSocket();
        } catch (err) {
            console.log('socket error:',err);
        }
    }
    else
    {
        console.log('socket not exist');
    }

    this.connected = false;
    this.portData = {};
    this.sendQueue = {};
    this.settingQueue = {};
    this.selectedDevice = null;
    this.hwModule = Entry.Hamster;

    Entry.addEventListener('stop', this.setZero);
}

Entry.HW.TRIAL_LIMIT = 1;

var p = Entry.HW.prototype;

p.initSocket = function() {
    if (this.connectTrial >= Entry.HW.TRIAL_LIMIT) {
        if (!this.isFirstConnect)
            Entry.toast.alert('아두이노 연결',
                              '아두이노 연결에 실패했습니다. 연결프로그램이 켜져 있는지, 엔트리 사이트가 여러개 열려있지는 않은지 확인해 주세요.',
                              false);
        this.isFirstConnect = false;
        return;
    }
    var hw = this;
    var socket = new WebSocket("ws://localhost:23518");
    this.socket = socket;
    this.connected = false;
    Entry.dispatchEvent("hwChanged");
    socket.binaryType = "arraybuffer";
    this.connectTrial++;

    socket.onopen = function()
    {
        hw.initHardware();
    };
    socket.onmessage = function (evt)
    {
        hw.checkDevice(evt.data);
        hw.updatePortData(evt.data);
    };
    socket.onclose = function()
    {
        hw.initSocket();
    };
}

p.retryConnect = function() {
    this.connectTrial = 0;
    this.initSocket();
}

p.initHardware = function() {
    this.connectTrial = 0;

    this.connected = true;
    Entry.dispatchEvent("hwChanged");
    if (Entry.playground && Entry.playground.object)
        Entry.playground.setMenu(Entry.playground.object.objectType);
    Entry.toast.success('아두이노 연결', '아두이노 연결에 성공하였습니다.', false);
}

p.setDigitalPortValue = function(port, value) {
    this.sendQueue[port] = value;
}

p.getAnalogPortValue = function(port) {
    if (!this.connected)
        return 0;
    return this.portData['a'+port];
}

p.getDigitalPortValue = function(port) {
    if (!this.connected)
        return 0;
    this.setPortReadable(port);
    if (this.portData.d) {
        return Number(this.portData.d[port]);
    }
    else
        return 0;
}

p.setPortReadable = function(port) {
    this.settingQueue[port] = true;
}

p.update = function() {
    if (!this.socket)
        return;
    if (this.socket.readyState != 1)
        return;
    this.socket.send(JSON.stringify(this.sendQueue));
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
        this.settingQueue = {};
        for (var port in this.sendQueue) {
            var value = this.sendQueue[port];
            var query;
            if (value == 255 || value == 0) {
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
        this.socket.send(buf);
    }
}

p.updatePortData = function(data) {
    this.portData = JSON.parse(data);
}

p.closeConnection = function() {
    if (this.socket)
        this.socket.close();
}

p.downloadConnector = function() {
    var url = "/lib/EntryArduino/EntryArduino.zip";
    var win = window.open(url, '_blank');
    win.focus();
}

p.downloadSource = function() {
    var url = "/lib/EntryArduino/arduino/entry.ino";
    var win = window.open(url, '_blank');
    win.focus();
}

p.setZero = function() {
    Entry.hw.hwModule.setZero();
    Entry.Bitbrick.setZero();
};

p.checkDevice = function(data) {
};
