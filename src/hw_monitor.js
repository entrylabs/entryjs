'use strict';

goog.provide("Entry.HWMontior");

Entry.HWMonitor = function(hwModule) {
    this.svgDom = Entry.Dom(
        $('<svg id="hwMonitor" class="hwMonitor" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: this.view }
    );

    this._hwModule = hwModule;

    this._portViews = {};
};

(function(p) {
    /**
     * Generate View
     */
    p.generateView = function() {
        this.snap = Snap('#hwMonitor');
        var ports = this._hwModule.monitorTemplate.ports;
        var cursor = 0;
        for (var key in ports) {
            var port = ports[key];
            var portView = this.generatePortView(port);
            this._portViews[key] = portView;
            portView.group.attr({
                transform: "t0," + cursor
            });
            cursor += 50;
        }
    };

    p.generatePortView = function(port) {
        var svgGroup = this.snap.group();
        svgGroup.rect(0,0,150,30);
        this.snap.text(0, 0, port.name);
        var nameView = svgGroup.text(0, 15, port.name);
        nameView.attr({
            "fill": "#fff"
        });
        var valueView = svgGroup.text(100, 15, 0);
        valueView.attr({
            "fill": "#fff"
        });
        return {
            group: svgGroup,
            value: valueView,
            type: port.type
        };
    };

    p.getView = function() {
        return this.svgDom;
    };

    p.update = function() {
        var portData = Entry.hw.portData;
        var sendQueue = Entry.hw.sendQueue;
        for (var key in this._portViews) {
            var port = this._portViews[key];
            if (port.type == "input") {
                port.value.attr({text: portData[key]});
            } else {
                port.value.attr({text: sendQueue[key]});
            }
        }
    };

    p.resize = function(canvasSize) {
        var canvasHeight = canvasSize*9/16;
        this._view.css({
            width: canvasSize + 'px',
            top: (canvasHeight + 35 + 40 + 48 - 22) + 'px'
        });
        if (canvasSize >= 430)
            this._view.removeClass("collapsed");
        else
            this._view.addClass("collapsed");
    };
})(Entry.HWMonitor.prototype)
