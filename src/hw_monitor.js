'use strict';

goog.provide("Entry.HWMontior");
goog.require("Entry.Utils");

Entry.HWMonitor = function(hwModule) {
    this.svgDom = Entry.Dom(
        $('<svg id="hwMonitor" class="hwMonitor" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>')    
    );

    this._hwModule = hwModule;
    
    var that = this;
    Entry.addEventListener('windowResized', function() { 
        var mode = that._hwModule.monitorTemplate.mode;
        if(mode == 'both') {
            that.resizeList();
            that.resize();
        } else if(mode == 'list') {
            that.resizeList();
        } else {
            that.resize();
        }
            
    });

    this.scale = 0.5;
    this._portViews = {};
    this._listPortViews = {};
    this._portMap = {
        n: [],
        e: [],
        s: [],
        w: []
    };

    this._portMapList = {
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
            href : Entry.mediaFilePath + monitorTemplate.imgPath,
            x : - monitorTemplate.width / 2,
            y : - monitorTemplate.height / 2,
            width : monitorTemplate.width,
            height : monitorTemplate.height
        };


        this.hwView = this._svgGroup.elem("image");
        this.hwView = this.hwView.attr(imgObj);
        this._template = monitorTemplate;
        var ports = monitorTemplate.ports;
        this.pathGroup = this._svgGroup.elem("g");

        var portsTemp = [];
        for (var key in ports) {
            var port = ports[key];
            var portView = this.generatePortView(port , '_svgGroup');

            this._portViews[key] = portView;
            portsTemp.push(portView);
        }

        portsTemp.sort(function(a, b) {
            return a.box.x - b.box.x;
        });

        var portMap = this._portMap;

        portsTemp.map(function(v) {
            var degree = (Math.atan2(-v.box.y, v.box.x)/Math.PI + 2) % 2;
            var map;
            /*
            if (degree >= 0.25 && degree < 0.75) map = portMap.n;
            else if (degree >= 0.75 && degree < 1.25) map = portMap.w;
            else if (degree >= 1.25 && degree < 1.75) map = portMap.s;
            else map = portMap.e;
            */
            if (degree < 1)
                map = portMap.n;
            else
                map = portMap.s;
            map.push(v);
    
       });
       this.resize();
    };


    p.generateListView = function() {
        this.listsnap = Entry.SVG('hwMonitor');
        this._svglistGroup = this.listsnap.elem("g");

        var monitorTemplate = this._hwModule.monitorTemplate;
        
        this._template = monitorTemplate;

        var ports = monitorTemplate.listPorts;

        this.pathGroup = this._svglistGroup.elem("g");

        var portsTempList = [];
        for (var key in ports) {
            var port = ports[key];
            var portView = this.generatePortView(port , '_svglistGroup');

            this._listPortViews[key] = portView;
            portsTempList.push(portView);
        }

        var portMapList = this._portMapList;

        portsTempList.map(function(v) {
            var degree = Math.atan2(v.box.y, v.box.x);
            switch (Math.round(degree / Math.PI * 2)) {
                case -1:
                    portMapList.n.push(v);
                    break;
                case 0:
                    portMapList.e.push(v);
                    break;
                case 1:
                    portMapList.s.push(v); 
                    break;
                case 2:
                    portMapList.w.push(v);
                    break;
            }
        });

        this.resizeList();
    };

    p.generatePortView = function(port , target) {
        
        var svgGroup = this[target].elem("g");
        svgGroup.addClass("hwComponent");
        var path = null;

        path = this.pathGroup.elem("path").attr({
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
        var mode = this._hwModule.monitorTemplate.mode;
        var portView = [];

        if(mode == "list")
            portView = this._listPortViews;
        else 
            portView = this._portViews;
        
        for (var key in portView) {
            var port = portView[key];

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

    p.resizeList = function() {
        
        var bRect = this.svgDom.get(0).getBoundingClientRect();
        this._svglistGroup.attr({
            "transform"  : "translate(" + bRect.width / 2 + "," + bRect.height / 2 + ")"
        });
        this._rect = bRect;
        this.scale = bRect.height / this._template.height / 2;
        this.alignList();
    };


    p.align = function() {
        var ports = [];
      
        var ports = this._portMap.s.concat();
        this._alignNS(ports, this._template.height * (this.scale / 2) + 5, 27);

        ports = this._portMap.n.concat();
        this._alignNS(ports, - this._template.height * this.scale / 2 - 32, - 27); 

        ports = this._portMap.e.concat();   
        this._alignEW(ports, - this._template.width * this.scale / 2 - 5, - 27);       

        ports = this._portMap.w.concat();
        this._alignEW(ports,  this._template.width * this.scale / 3 - 32, - 27);    
    };

    p.alignList = function() {
        //for (var direction in this._portMap) {
            //var ports = this._portMap[direction];
        var mode = this._hwModule.monitorTemplate.mode;
        var ports = this._portMapList.n;

        var length = ports.length;

        for (var i = 0; i < ports.length; i++) {
            var port = ports[i];

            port.group.attr({
                "transform"  : "translate(" + this._template.width * (i / length - 0.5) + "," +
                    (- this._template.width/2 - 30) + ")"
            });
        }

        var ports = this._portMapList.s.concat();   
        this._alignNSList(ports, this._template.width * this.scale / 2 + 5, 27);

        ports = this._portMapList.n.concat();
        this._alignNSList(ports, - this._template.width * this.scale / 2 - 32, - 27);    

        
    };

    p._alignEW = function(ports, xCursor, gap) {
        var length = ports.length,
            mid = (length -1) / 2,
            standardsize = this._rect.height-50; 
            tP  = - standardsize/2,
            bP = standardsize/2,
            height = this._rect.height,
            wholeHeight = 0,
            listVLine = 0,
            mode = this._hwModule.monitorTemplate;
           
            for(var i=0; i < length; i++) {
                wholeHeight += ports[i].height + 5;
            }
            
            if (wholeHeight < bP - tP) {
                bP = wholeHeight / 2 + 3;
                tP = - wholeHeight / 2 - 3;
            }

            while (length > 1) {
                var tPort = ports.shift(),
                    bPort = ports.pop(),
                    prevTP = tP,
                    prevBP = bP,
                    gapTemp = gap;
                if (wholeWidth <= bP - tP) {
                    tP += tPort.width + 5;
                    bP -= bPort.width + 5;
                    gapTemp = 0;
                } else if (ports.length === 0) {
                    tP = (tP + bP) / 2 - 3;
                    bP = tP + 6;
                } else {
                    tP = Math.max(tP, - width / 2 + tPort.width) + 15;
                    bP = Math.min(bP, width / 2 - bPort.width) - 15;
                } 
                
                wholeWidth -= tPort.width + bPort.width + 10;
                xCursor += gapTemp;
            };


        //

        if (ports.length) {
            ports[0].group.attr({
                "transform"  : "translate(" + xCursor + "," + 60
            + ")" });
        }
        if(tPort && rPort) {
            this._movePort(tPort, xCursor, tP, prevTP);
            this._movePort(rPort, xCursor, bP, prevBP);
        }
        

    };

    p._alignNS = function(ports, yCursor, gap) {
        var length = ports.length,
            mid = (length -1) / 2,
            lP = - this._rect.width / 2,
            rP = this._rect.width / 2,
            width = this._rect.width,
            wholeWidth = 0,
            listLine = 0,
            mode = this._hwModule.monitorTemplate.mode;
        
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
            this._movePort(ports[0], (rP + lP - ports[0].width) / 2, yCursor, 100);
        };

       
       


    };

     p._alignNSList = function(ports, yCursor) {
        var length = ports.length,
            width = this._rect.width,
            height = this._rect.height;
            initX = - this._rect.width / 2 + 10;
            initY = - this._rect.height/ 2 + 10;
            wholeWidth = 0,
            listLine = 0;
            
        for (var i = 0; i < ports.length; i++)
            wholeWidth += ports[i].width;    // 전체 width

        var lineIndent = 0;
        var currentWidth = 0;
        var tempXpos = initX;
        var Yval = 0;
        var cPort = 0;
        var nPort = 0;
        for(var i = 0; i < ports.length; i++) {
            cPort = ports[i];
    
            if(i != (ports.length -1) )
                nPort = ports[i+1];

            currentWidth += (cPort.width);

            lP = initX;
            Yval = initY + (lineIndent * 30);
            cPort.group.attr({ "transform" : "translate(" + lP + "," + Yval  + ")"});   
            initX += (cPort.width + 10);


            if(currentWidth > (width - (cPort.width + ( nPort.width / 2.2)))) {
                lineIndent += 1;
                initX = tempXpos;
                currentWidth = 0;
            }

        }
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
        } else // right side
            if (x < portX && portX < prevPointer)
                path = "m" + (portX) + "," + y +
                    "L" + (portX) + "," + (portY);
            else
                path = "m" + ((prevPointer + x) / 2) + "," + y +
                    "l0," + (portY > y ? 28 : -3) +
                    "H" + (portX) +
                    "L" + (portX) + "," + (portY);

        port.group.attr({ "transform" : "translate(" + groupX + "," + y  + ")"});    
        port.path.attr({ "d": path });
    };


})(Entry.HWMonitor.prototype)
