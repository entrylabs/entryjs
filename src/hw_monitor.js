'use strict';

goog.provide("Entry.HWMontior");
goog.require("Entry.Utils");

Entry.HWMonitor = function(hwModule) {
    this.svgDom = Entry.Dom(
        $('<svg id="hwMonitor" class="hwMonitor" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: this.view }
    );

    var that = this;
    Entry.addEventListener('windowResized', function() { that.resize(); });

    this._hwModule = hwModule;

    this._portViews = {};
    this._portMap = {
        n: [],
        e: [],
        s: [],
        w: []
    };
};

(function(p) {
    /**
     * Generate View
     */
    p.generateView = function() {
        this.snap = Snap('#hwMonitor');
        this._svgGroup = this.snap.group();
        var monitorTemplate = this._hwModule.monitorTemplate;
        this.hwView = this._svgGroup.group();
        this.hwView.image(
            Entry.mediaFilePath + "hw/neobot.png",
            - monitorTemplate.width / 2,
            - monitorTemplate.height / 2,
            monitorTemplate.width,
            monitorTemplate.height
        );
        this._template = monitorTemplate;
        var ports = monitorTemplate.ports;

        var portsTemp = [];
        for (var key in ports) {
            var port = ports[key];
            var portView = this.generatePortView(port);
            this._portViews[key] = portView;
            portsTemp.push(portView);
        }
        portsTemp.sort(function(a, b) {
            return a.box.x - b.box.x;
        });
        var portMap = this._portMap;
        portsTemp.map(function(v) {
            var degree = Math.atan2(v.box.y, v.box.x);
            switch (Math.round(degree / Math.PI * 2)) {
                case -1:
                    portMap.n.push(v);
                    break;
                case 0:
                    portMap.e.push(v);
                    break;
                case 1:
                    portMap.s.push(v);
                    break;
                case 2:
                    portMap.w.push(v);
                    break;
            }
        });
        console.log(portsTemp);

        this.resize();
    };

    p.generatePortView = function(port) {
        var svgGroup = this._svgGroup.group();
        svgGroup.addClass("hwComponent");
        var path = svgGroup.path("m0,0").attr({
            "fill": "none",
            "stroke": port.type === "input" ? "#00979d" : "#A751E3",
            "stroke-width": 3
        });
        var wrapperRect = svgGroup.rect(0, 0, 150, 22, 4).attr({
            "fill": "#fff",
            "stroke": "#a0a1a1"
        });
        var nameView = svgGroup.text(4, 12, port.name).attr({
            "fill": "#000",
            "class": "hwComponentName",
            "alignment-baseline": "central"
        });
        var width = nameView.node.getComputedTextLength();
        var valueRect = svgGroup.rect(width + 8, 2, 30, 18, 9).attr({
            "fill": port.type === "input" ? "#00979d" : "#A751E3"
        });
        var valueView = svgGroup.text(width + 13, 12, '0').attr({
            "fill": "#fff",
            "class": "hwComponentValue",
            "alignment-baseline": "central"
        });
        width += 40;
        wrapperRect.attr({
            "width": width + "px"
        });
        return {
            group: svgGroup,
            value: valueView,
            type: port.type,
            path: path,
            box: {
                x: port.pos.x - this._template.width / 2,
                y: port.pos.y - this._template.height / 2,
                width: width
            },
            width: width
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
                var value = portData[key];
                port.value.attr({text: value ? value : 0});
            } else {
                var value = sendQueue[key];
                port.value.attr({text: value ? value : 0});
            }
        }
    };

    p.resize = function() {
        var bRect = this.svgDom.get(0).getBoundingClientRect();
        this._svgGroup.attr({
            transform: "t" + bRect.width / 2 + "," + bRect.height / 2
        });
        this._rect = bRect;
        this.align();
    };

    p.align = function() {
        //for (var direction in this._portMap) {
            //var ports = this._portMap[direction];
            var ports = this._portMap.n;
            var length = ports.length;
            for (var i = 0; i < ports.length; i++) {
                var port = ports[i];
                var x = this._template.width * (i / length - 0.5);
                port.group.attr({
                    transform: "t" + x + "," +
                        (- this._template.width/2 - 30)
                });
            }

        var ports = this._portMap.s.concat();
        this._alignNS(ports, this._template.width / 2 + 5, 27)

        ports = this._portMap.n.concat();
        this._alignNS(ports, - this._template.width / 2 - 32, - 27);
    };

    p._alignNS = function(ports, yCursor, gap) {
        var length = ports.length,
            mid = (length -1) / 2,
            lP = - this._rect.width / 2,
            rP = this._rect.width / 2,
            width = this._rect.width,
            wholeWidth = 0;
        for (var i = 0; i < ports.length; i++)
            wholeWidth += ports[i].width + 5;

        if (wholeWidth < rP - lP) {
            rP = wholeWidth / 2 + 3;
            lP = - wholeWidth / 2 - 3;
        }
        while (ports.length > 1) {
            var lPort = ports.shift(),
                rPort = ports.pop(),
                prevLP = lP,
                prevRP = rP,
                gapTemp = gap;
            if (wholeWidth <= rP - lP) {
                lP += lPort.width + 5;
                rP -= rPort.width + 5;
                gapTemp = 0;
            } else if (ports.length === 0) {
                lP = (lP + rP) / 2 - 3;
                rP = lP + 6;
            } else {
                lP = Math.max(lP, - width / 2 + lPort.width) + 15;
                rP = Math.min(rP, width / 2 - rPort.width) - 15;
            }

            this._movePort(lPort, lP, yCursor, prevLP);

            this._movePort(rPort, rP, yCursor, prevRP);

            wholeWidth -= lPort.width + rPort.width + 10;
            yCursor += gapTemp;
        };
        if (ports.length) {
            ports[0].group.attr({
                transform: "t" + (rP + lP - ports[0].width) / 2 + "," + yCursor
            });
        };
    };

    p._movePort = function(port, x, y, prevPointer) {
        var groupX = x;
        var path;

        if (x > prevPointer) { // left side
            groupX = x - port.width;
            if (x > port.box.x && port.box.x > prevPointer)
                path = "m" + (port.box.x - groupX) + ",11" +
                    "L" + (port.box.x - groupX) + "," + (port.box.y - y);
            else
                path = "M" + (port.width - ((groupX - prevPointer) / 2)) + ",0" +
                    "l0," + (port.box.y > y ? 28 : -22) +
                    "H" + (port.box.x - groupX) +
                    "L" + (port.box.x - groupX) + "," + (port.box.y - y)
        }
        else // right side
            if (x < port.box.x && port.box.x < prevPointer)
                path = "m" + (port.box.x - x) + ",11" +
                    "L" + (port.box.x- x) + "," + (port.box.y - y);
            else
                path = "m" + ((prevPointer - x) / 2) + ",0" +
                    "l0," + (port.box.y > y ? 28 : -22) +
                    "H" + (port.box.x - x) +
                    "L" + (port.box.x- x) + "," + (port.box.y - y)

        port.group.attr({ transform: "t" + groupX + "," + y });
        port.path.attr({ "d": path });
    };

})(Entry.HWMonitor.prototype)
