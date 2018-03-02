"use strict";

Entry.Cobl = {
    name: 'cobl',
    setZero: function() {
        for (var port = 0; port < 14; port++) {
          Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.update();
    }
};