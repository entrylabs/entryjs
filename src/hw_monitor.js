'use strict';

goog.provide("Entry.HWMontior");
goog.require("Entry.Utils");

Entry.HWMonitor = function(hwModule) {
    this.svgDom = Entry.Dom(
        $('<svg id="hwMonitor" class="hwMonitor" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>')    
    );

    var that = this;
    Entry.addEventListener('windowResized', function() { that.resize(); });

    this._hwModule = hwModule;

    this.scale = 0.5;
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
        this.snap = Entry.SVG('hwMonitor');
        this._svgGroup = this.snap.elem("g");

        var monitorTemplate = this._hwModule.monitorTemplate;
        
        var imgObj = {
            href : Entry.mediaFilePath + "hw/neobot.png",
            x : - monitorTemplate.width / 2,
            y : - monitorTemplate.height / 2,
            width : monitorTemplate.width,
            height : monitorTemplate.height
        };
        this.hwView = this._svgGroup.elem("image");
        this.hwView = this.hwView.attr(imgObj);

        // this.hwView.image(
        //     Entry.mediaFilePath + "hw/neobot.png",
        //     - monitorTemplate.width / 2,
        //      - monitorTemplate.height / 2,
        //     monitorTemplate.width,
        //     monitorTemplate.height
        // );
        this._template = monitorTemplate;
        var ports = monitorTemplate.ports;

        this.pathGroup = this._svgGroup.elem("g");

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

        this.resize();
    };

    p.generatePortView = function(port) {
        var svgGroup = this._svgGroup.elem("g");
        svgGroup.addClass("hwComponent");

        var path = this.pathGroup.elem("path").attr({
            "d" : "m0,0",
            "fill": "none",
            "stroke": port.type === "input" ? "#00979d" : "#A751E3",
            "stroke-width": 3
        });
        var wrapperRect = svgGroup.elem("rect").attr({
            "x" : 0,
            "y" : 0,
            "width" : 150,
            "height" : 22,
            "rx" : 4,
            "ry" : 4,
            "fill": "#fff",
            "stroke": "#a0a1a1"
        });
        var nameView = svgGroup.elem("text").attr({
            "x" : 4,
            "y" : 12,
            "fill": "#000",
            "class": "hwComponentName",
            "alignment-baseline": "central"
        });
        nameView.textContent = port.name;
        
        var width = nameView.getComputedTextLength();

        var valueRect = svgGroup.elem("rect").attr({
            "x" : width+8,
            "y" : 2,
            "width" : 30,
            "height" : 18,
            "rx" : 9,
            "ry" : 9,
            "fill": port.type === "input" ? "#00979d" : "#A751E3"
        });

        var valueView = svgGroup.elem("text").attr({
            "x" : width + 13,
            "y" : 12,
            "fill": "#fff",
            "class": "hwComponentValue",
            "alignment-baseline": "central"
        });
        valueView.textContent = 0;
        width += 40;

        wrapperRect.attr({
            "width": width
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

        this.hwView.attr({ "transform" : "scale(" + this.scale + ")" });
        var bRect = this.svgDom.get(0).getBoundingClientRect();
        this._svgGroup.attr({
            "transform"  : "translate(" + bRect.width / 2 + "," + bRect.height / 2 + ")"
        });

        this._rect = bRect;
        this.scale = bRect.height / this._template.height / 2;
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
                "transform"  : "translate(" + x + "," +
                    (- this._template.width/2 - 30) + ")"
            });
        }

        var ports = this._portMap.s.concat();
        this._alignNS(ports, this._template.width * this.scale / 2 + 5, 27)

        ports = this._portMap.n.concat();
        this._alignNS(ports, - this._template.width * this.scale / 2 - 32, - 27);
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
                "transform"  : "translate(" + (rP + lP - ports[0].width) / 2 + "," + yCursor
            + ")"});
        };
    };

    p._movePort = function(port, x, y, prevPointer) {
        var groupX = x;
        var path;
        var portX = port.box.x * this.scale,
            portY = port.box.y * this.scale;

        if (x > prevPointer) { // left side
            groupX = x - port.width;
            if (x > portX && portX > prevPointer)
                path = "M" + (portX) + "," + y +
                    "L" + (portX) + "," + (portY);
            else
                path = "M" + ((x + prevPointer) / 2) + "," + y +
                    "l0," + (portY > y ? 28 : -3) +
                    "H" + (portX) +
                    "L" + (portX) + "," + (portY)
        }
        else // right side
            if (x < portX && portX < prevPointer)
                path = "m" + (portX) + "," + y +
                    "L" + (portX) + "," + (portY);
            else
                path = "m" + ((prevPointer + x) / 2) + "," + y +
                    "l0," + (portY > y ? 28 : -3) +
                    "H" + (portX) +
                    "L" + (portX) + "," + (portY)

        port.group.attr({ "transform" : "translate(" + groupX + "," + y  + ")"});
        port.path.attr({ "d": path });
    };

})(Entry.HWMonitor.prototype)
