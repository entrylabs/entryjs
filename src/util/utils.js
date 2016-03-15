"use strict";

goog.provide("Entry.Utils");

/**
 * override native prototype to add useful method.
 */
Entry.overridePrototype = function() {
    /** modulo include negative number */
    Number.prototype.mod = function(n) {
            return ((this%n)+n)%n;
    };
};


Entry.Utils.generateId = function() {
    return ("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).substr(-4);
};

Entry.Utils.intersectArray = function (x, y){
    var ret = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                ret.push(x[i]);
                break;
            }
        }
    }
    return ret;
};

Entry.Utils.isPointInMatrix = function(matrix, point, offset) {
    offset = offset === undefined ? 0 : offset;
    var x = matrix.offsetX ? matrix.x + matrix.offsetX : matrix.x;
    var y = matrix.offsetY ? matrix.y + matrix.offsety : matrix.y;
    return (x - offset <= point.x) &&
        (x + matrix.width + offset >= point.x) &&
        (y - offset <= point.y) &&
        (y + matrix.height + offset >= point.y);
};

Entry.Utils.colorDarken = function(color, factor) {
    var r, g, b;
    if (color.length === 7) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
    } else {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(2, 2), 16);
        b = parseInt(color.substr(3, 2), 16);
    }

    factor = factor === undefined ? 0.7 : factor;
    r = Math.floor(r * factor).toString(16);
    g = Math.floor(g * factor).toString(16);
    b = Math.floor(b * factor).toString(16);

    return '#' + r + g + b;
};

Entry.Utils.colorLighten = function(color, amount) {
    function clamp01(val) {
        return Math.min(1, Math.max(0, val));
    }

    amount = (amount === 0) ? 0 : (amount || 20);
    var hsl = Entry.Utils.hexToHsl(color);
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return Entry.Utils.hslToHex(hsl);
};

// Take input from [0, n] and return it as [0, 1]
Entry.Utils.bound01 = function(n, max) {
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
Entry.Utils.hexToHsl = function(color) {
    var r, g, b;
    if (color.length === 7) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
    } else {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(2, 2), 16);
        b = parseInt(color.substr(3, 2), 16);
    }

    r = Entry.Utils.bound01(r, 255);
    g = Entry.Utils.bound01(g, 255);
    b = Entry.Utils.bound01(b, 255);

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    var hsl = { h: h, s: s, l: l };
    return { h: hsl.h * 360, s: hsl.s, l: hsl.l};
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
Entry.Utils.hslToHex = function(color) {
    var r, g, b;

    var h = Entry.Utils.bound01(color.h, 360);
    var s = Entry.Utils.bound01(color.s, 1);
    var l = Entry.Utils.bound01(color.l, 1);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    var rgb = { r: r * 255, g: g * 255, b: b * 255 };

    var hex = [
        pad2(Math.round(rgb.r).toString(16)),
        pad2(Math.round(rgb.g).toString(16)),
        pad2(Math.round(rgb.b).toString(16))
    ];

    return '#' + hex.join('');
}


Entry.Utils.bindGlobalEvent = function(options) {
    if (options === undefined)
        options = ['resize', 'mousedown', 'mousemove', 'keydown', 'keyup'];

    if (!Entry.windowReszied && options.indexOf('resize') > -1) {
        Entry.windowResized = new Entry.Event(window);
        $(window).on('resize', (function(e) {
            Entry.windowResized.notify(e);
        }));
    }

    if (!Entry.documentMousedown && options.indexOf('mousedown') > -1) {
        Entry.documentMousedown = new Entry.Event(window);
        $(document).on('mousedown', (function(e) {
            Entry.documentMousedown.notify(e);
        }));
    }

    if (!Entry.documentMousemove && options.indexOf('mousemove') > -1) {
        Entry.mouseCoordinate = {};
        Entry.documentMousemove = new Entry.Event(window);
        $(document).on('touchmove mousemove', (function(e) {
            if (e.originalEvent && e.originalEvent.touches)
                e = e.originalEvent.touches[0];
            Entry.documentMousemove.notify(e);
            Entry.mouseCoordinate.x = e.clientX;
            Entry.mouseCoordinate.y = e.clientY;
        }));
    }

    if (!Entry.keyPressed && options.indexOf('keydown') > -1) {
        Entry.pressedKeys = [];
        Entry.keyPressed = new Entry.Event(window);
        $(document).on('keydown', (function(e) {
            var keyCode = e.keyCode;
            if (Entry.pressedKeys.indexOf(keyCode) < 0)
                Entry.pressedKeys.push(keyCode);
            Entry.keyPressed.notify(e);
        }));
    }

    if (!Entry.keyUpped && options.indexOf('keyup') > -1) {
        Entry.keyUpped = new Entry.Event(window);
        $(document).on('keyup', (function(e) {
            var keyCode = e.keyCode;
            var index = Entry.pressedKeys.indexOf(keyCode);
            if (index > -1) Entry.pressedKeys.splice(index,1);
            Entry.keyUpped.notify(e);
        }));
    }
};

Entry.Utils.makeActivityReporter = function() {
    Entry.activityReporter = new Entry.ActivityReporter();
    return Entry.activityReporter;
};

Entry.Utils.initEntryEvent_ = function() {
    if (!Entry.events_) {
        Entry.events_ = [];
    }
};

/**
 * Sample color code for user select
 * @type {!Array<string>}
 */
Entry.sampleColours = [
];

/**
 * Raise error when assert condition fail.
 * @param {!boolean} condition assert condition.
 * @param {?string} message assert message will be shown when assert fail.
 */
Entry.assert = function(condition, message) {
    if (!condition) {
        throw Error(message || "Assert failed");
    }
};

/**
 * Parse Text to Xml
 * @param {!string} xmlText
 * @param {xml} doc
 */
Entry.parseTexttoXML = function(xmlText) {
    var doc;
    if (window.ActiveXObject){
        doc=new ActiveXObject('Microsoft.XMLDOM');
        doc.async='false';
        doc.loadXML(xmlText);
    } else {
        var parser=new DOMParser();
        doc=parser.parseFromString(xmlText,'text/xml');
    }
    return doc;
};

/**
 * Create html element with some method
 * @param {!string} type
 * @param {string} elementId
 * @return {!Element}
 */
Entry.createElement = function(type, elementId) {
    var element = document.createElement(type);
    if (elementId)
        element.id = elementId;

    element.hasClass = function(className) {
        return this.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
    };
    element.addClass = function(className) {
        for (var i = 0; i < arguments.length; i++) {
            var className = arguments[i];
            if (!this.hasClass(className)) this.className += " " + className;
        }
    };
    element.removeClass = function(className) {
        for (var i = 0; i < arguments.length; i++) {
            var className = arguments[i];
            if (this.hasClass(className)) {
                var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
                this.className=this.className.replace(reg,' ');
            }
        }
    };
    element.bindOnClick = function(func) {
        $(this).on('click touchstart', function(e) {
            e.stopImmediatePropagation();
            if (e.handled) return;
            e.handled = true;
            func.call(this, e);
        });
    };
    return element;
};

/**
 * Generate random hash
 * @return {string}
 */
Entry.generateHash = function() {
    return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
};

/**
 * Add event listener
 * @param {!string} eventName
 * @param {function} fn
 */
Entry.addEventListener = function(eventName, fn) {
    if (!this.events_)
        this.events_ = {};
     if (!this.events_[eventName]) {
        this.events_[eventName] = [];
    }
    if (fn instanceof Function) {
        this.events_[eventName].push(fn);
    }
    return true;
};

/**
 * Dispatch event
 * @param {!string} eventName
 * @param {?} params
 */
Entry.dispatchEvent = function(eventName, params) {
    if (!this.events_)
        this.events_ = {};
    if (!this.events_[eventName])
        return;
    for (var index = 0, l = this.events_[eventName].length; index < l; index++) {
        this.events_[eventName][index].call(window, params);
    }
};

/**
 * Remove event listener
 * @param {!string} eventName
 */
Entry.removeEventListener = function(eventName, fn) {
    if (this.events_[eventName]) {
        for (var i = 0, l = this.events_[eventName].length; i < l; i++) {
            if (this.events_[eventName][i] === fn) {
                this.events_[eventName].splice(i, 1);
                break;
            }
        }
    }
};

/**
 * Remove event listener
 * @param {!string} eventName
 */
Entry.removeAllEventListener = function(eventName) {
    if (!this.events_ || !this.events_[eventName]) return;
    delete this.events_[eventName];
};

/**
 * Add two number properly.
 *
 * @return {number}
 *
 * @param {!number} a
 * @param {!number} b
 */
Entry.addTwoNumber = function(a, b) {
  if (isNaN(a) || isNaN(b)) {
    return a+b;
  }
  a += ''; b+= '';

  var indexA = a.indexOf('.'), indexB = b.indexOf('.');
  var fixedA = 0, fixedB = 0;
  if (indexA > 0)
    var fixedA = (a.length - indexA - 1);

  if (indexB > 0)
    var fixedB = (b.length - indexB - 1);

  if (fixedA > 0 || fixedB > 0) {
    if (fixedA >= fixedB) {
      return (parseFloat(a)+parseFloat(b)).toFixed(fixedA);
    } else {
      return (parseFloat(a)+parseFloat(b)).toFixed(fixedB);
    }
  } else {
    return parseInt(a)+parseInt(b);
  }
};

/*
 * HTML hex colour code to RGB colour value
 */
Entry.hex2rgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
};

/*
 * RGB colour value to HTML hex colour code
 */
Entry.rgb2hex = function (r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/*
 * Generate random rgb color object
 */
Entry.generateRgb = function () {
    return {
        r: Math.floor(Math.random()*256),
        g: Math.floor(Math.random()*256),
        b: Math.floor(Math.random()*256)
    };
};

/*
 * Adjustment input value by max and min value
 * @param {!Number} value, min, max
 */
Entry.adjustValueWithMaxMin = function (input, min, max) {
    if (input > max){
        return max;
    } else if (input < min){
        return min;
    } else
        return input;

};

/*
 * Inspect input value exists already in an array
 * @param {String} targetValue
 * @param {String} identifier
 * @param {Array} arr
 * @return {boolean} return true when target value exists already
 */
Entry.isExist = function (targetValue, identifier, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][identifier] == targetValue)
            return arr[i];
    }

    return false;
};


Entry.getColourCodes = function () {
    return [
        'transparent', '#660000', '#663300', '#996633', '#003300', '#003333', '#003399', '#000066', '#330066', '#660066',
        '#FFFFFF', '#990000', '#993300', '#CC9900', '#006600', '#336666', '#0033FF', '#000099', '#660099', '#990066',
        '#000000', '#CC0000', '#CC3300', '#FFCC00', '#009900', '#006666', '#0066FF', '#0000CC', '#663399', '#CC0099',
        '#333333', '#FF0000', '#FF3300', '#FFFF00', '#00CC00', '#009999', '#0099FF', '#0000FF', '#9900CC', '#FF0099',
        '#666666', '#CC3333', '#FF6600', '#FFFF33', '#00FF00', '#00CCCC', '#00CCFF', '#3366FF', '#9933FF', '#FF00FF',
        '#999999', '#FF6666', '#FF6633', '#FFFF66', '#66FF66', '#66CCCC', '#00FFFF', '#3399FF', '#9966FF', '#FF66FF',
        '#BBBBBB','#FF9999', '#FF9966', '#FFFF99', '#99FF99', '#66FFCC', '#99FFFF', '#66CCff', '#9999FF', '#FF99FF',
        '#CCCCCC','#FFCCCC', '#FFCC99', '#FFFFCC', '#CCFFCC', '#99FFCC', '#CCFFFF', '#99CCFF', '#CCCCFF', '#FFCCFF'
    ];
};

/*
 * Replacement for element.remove() method
 * @param {Element} targetElement
 * @return {boolean} return true when target element remove or not
 */
Entry.removeElement = function(element) {
   if (element && element.parentNode)
       element.parentNode.removeChild(element);
};

/*
 * Replacement for elements.getElementsByClassName(className)
 * @param {String} class name
 * @return {Array} arr
 */
Entry.getElementsByClassName = function(cl) {
    var retnode = [];
    var elem = document.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
        if((' ' + elem[i].className + ' ').indexOf(' ' + cl + ' ') > -1) retnode.push(elem[i]);
    }
    return retnode;
};

/*
 * parse string to number
 * @param {String||Number} value
 * @return {Boolean||Number} arr
 */
Entry.parseNumber = function(value) {
    if (typeof value == "string" && !isNaN(Number(value)))
        return Number(value);
    else if (typeof value == "number" && !isNaN(Number(value)))
        return value;
    return false;
};

/**
 * count length of string.
 * Hanguel character is count to two.
 * @param {!String} dataString
 * @return {Number}
 */
Entry.countStringLength = function(dataString) {
    var p, len = 0;
    for (p = 0; p < dataString.length; p++) {
        if (dataString.charCodeAt(p) > 255) len+=2;
        else len++;
    }
    return len;
};

/**
 * count length of string.
 * Hanguel character is count to two.
 * @param {!String} dataString
 * @param {!Number} stringLength
 * @return {String}
 */
Entry.cutStringByLength = function(dataString, stringLength) {
    var p, len = 0;
    for (p = 0; len < stringLength && p < dataString.length; p++) {
        if (dataString.charCodeAt(p) > 255) len+=2;
        else len++;
    }
    return dataString.substr(0,p);
};


/**
 * check to element is are parent child.
 * @param {Element} parent
 * @param {Element} child
 * @return {Boolean}
 */
Entry.isChild = function(parent, child) {
    if (!child) {
        while (child.parentNode) {
            if ((child = child.parentNode) == parent)
                return true;
        }
    }
    return false;
};

/**
 * @param {Element} child
 */
Entry.launchFullScreen = function(element) {
    if (element.requestFullscreen)
        element.requestFullscreen();
    else if (element.mozRequestFulScreen)
        element.mozRequestFulScreen();
    else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
    else if (element.msRequestFullScreen)
        element.msRequestFullScreen();
};

Entry.exitFullScreen = function() {
    if (document.exitFullScreen)
        document.exitFullScreen();
    else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
};

Entry.isPhone = function(){
    return false;
    //if (window.screen.availWidth > 480)
        //return false;
    //else
        //return true;
};

Entry.getKeyCodeMap = function () {
    return {
        '65':'a', '66':'b', '67':'c', '68':'d', '69':'e',
        '70':'f', '71':'g', '72':'h', '73':'i', '74':'j',
        '75':'k', '76':'l', '77':'m', '78':'n', '79':'o',
        '80':'p', '81':'q', '82':'r', '83':'s', '84':'t',
        '85':'u', '86':'v', '87':'w', '88':'x', '89':'y',
        '90':'z',
        '32':Lang.Blocks.START_press_some_key_space,
        '37':Lang.Blocks.START_press_some_key_left,
        '38':Lang.Blocks.START_press_some_key_up,
        '39':Lang.Blocks.START_press_some_key_right,
        '40':Lang.Blocks.START_press_some_key_down,
        '48':'0', '49':'1', '50':'2', '51':'3', '52':'4',
        '53':'5', '54':'6', '55':'7', '56':'8', '57':'9',
        '13':Lang.Blocks.START_press_some_key_enter
    };
};

Entry.checkCollisionRect = function(rectA, rectB) {
    return !(
        ((rectA.y + rectA.height) < (rectB.y)) ||
        (rectA.y > (rectB.y + rectB.height)) ||
        ((rectA.x + rectA.width) < rectB.x) ||
        (rectA.x > (rectB.x + rectB.width))
    );
};

Entry.bindAnimationCallback = function(element, func) {
    element.addEventListener("webkitAnimationEnd", func, false);
    element.addEventListener("animationend", func, false);
    element.addEventListener("oanimationend", func, false);
};

Entry.cloneSimpleObject = function(object) {
    var clone = {};
    for (var i in object)
        clone[i] = object[i];
    return clone;
};

Entry.nodeListToArray = function(nl) {
    var arr = new Array(nl.length);
    for(var i=-1,l=nl.length;++i!==l;arr[i]=nl[i]);
    return arr;
};

Entry.computeInputWidth = function(nameField){
    var tmp = document.createElement("span");
    tmp.className = "tmp-element";
    tmp.innerHTML = nameField.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    document.body.appendChild(tmp);
    var theWidth = tmp.offsetWidth;
    document.body.removeChild(tmp);
    return Number(theWidth + 10) + 'px';
};

Entry.isArrowOrBackspace = function(keyCode){
    var codes = [37,38,39,40, 8];
    return codes.indexOf(keyCode) > -1;
};

Entry.hexStringToBin = function(hexString) {
    var bytes = [], str;

    for(var i=0; i< hexString.length-1; i+=2){
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }

    str = String.fromCharCode.apply(String, bytes);
    return str;
};

Entry.findObjsByKey = function(arr, keyName, key) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][keyName] == key)
            result.push(arr[i]);
    }
    return result;
};

Entry.factorials = [];

Entry.factorial = function(n){
    if (n === 0 || n == 1) return 1;
    if (Entry.factorials[n] > 0) return Entry.factorials[n];

    var ret = Entry.factorials[n] = Entry.factorial(n-1) * n;
    return ret;
};

Entry.getListRealIndex = function(index, list){
    if (isNaN(index)) {
        switch(index) {
            case 'FIRST':
                index = 1;
                break;
            case 'LAST':
                index = list.array_.length;
                break;
            case 'RANDOM':
                index = Math.floor(Math.random() * (list.array_.length)) + 1;
                break;
        }
    }
    return index;
};

Entry.toRadian = function(angle){
    return angle * Math.PI / 180;
};

Entry.toDegrees = function(radians){
    return radians * 180 / Math.PI;
};

Entry.getPicturesJSON = function (pictures) {
    var json = [];
    for (var i=0, len=pictures.length; i<len; i++) {
        var p = pictures[i];
        var o = {};
        o._id = p._id;
        o.id = p.id;
        o.dimension = p.dimension;
        o.filename = p.filename;
        o.fileurl = p.fileurl;
        o.name = p.name;
        o.scale = p.scale;
        json.push(o);
    }
    return json;
};

Entry.getSoundsJSON = function (sounds) {
    var json = [];
    for (var i=0, len=sounds.length; i<len; i++) {
        var s = sounds[i];
        var o = {};
        o._id = s._id;
        o.duration = s.duration;
        o.ext = s.ext;
        o.id = s.id;
        o.filename = s.filename;
        o.fileurl = s.fileurl;
        o.name = s.name;
        json.push(o);
    }
    return json;
};

Entry.cutDecimal = function (number) {
    return Math.round(number * 100) / 100;
};

Entry.getBrowserType = function() {
    if (Entry.userAgent)
        return Entry.userAgent;
   var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    var uaResult = M.join(' ');
    Entry.userAgent = uaResult;
    return uaResult;
};

Entry.setBasicBrush = function (sprite) {
    var brush = new createjs.Graphics();
    brush.thickness = 1;
    brush.rgb = Entry.hex2rgb("#ff0000");
    brush.opacity = 100;
    brush.setStrokeStyle(1);
    brush.beginStroke("rgba(255,0,0,1)");

    var shape = new createjs.Shape(brush);
    Entry.stage.selectedObjectContainer.addChild(shape);

    if (sprite.brush)
        sprite.brush = null;
    sprite.brush = brush;

    if (sprite.shape)
        sprite.shape = null;
    sprite.shape = shape;
};

Entry.isFloat = function (num) {
    return /\d+\.{1}\d+/.test(num);
};

Entry.getStringIndex = function(str) {
    if (!str) return '';
    var result = {
        string: str,
        index: 1
    };
    var idx = 0;
    var num = [];
    var len = str.length;
    for (var i=len-1; i>0; --i) {
        var ch = str.charAt(i);
        if (!isNaN(ch)) {
            num.unshift(ch);
            idx = i;
        } else {
            break;
        }
    }

    if (idx > 0) {
        result.string = str.substring(0,idx);
        result.index = parseInt(num.join('')) + 1;
    }

    return result;
};

Entry.getOrderedName = function(str, objects, field) {
    if (!str) return 'untitled';
    if (!objects || objects.length === 0) return str;

    if (!field)
        field = 'name';

    var maxNumber = 0;
    var source = Entry.getStringIndex(str);
    for (var i=0, len=objects.length; i<len; i++) {
        var target = Entry.getStringIndex(objects[i][field]);
        if ( (source.string === target.string) && target.index > maxNumber) {
                maxNumber = target.index;
        }

    }

    if (maxNumber > 0)
        return source.string + maxNumber;

    return str;
};


Entry.changeXmlHashId = function(xmlBlock) {
    var reg = /function_field/;
    if (reg.test(xmlBlock.getAttribute('type'))) {
        var mutations = xmlBlock.getElementsByTagName('mutation');
        for (var i=0, len=mutations.length; i<len; i++)
            mutations[i].setAttribute('hashid', Entry.generateHash());
    }
    return xmlBlock;
};

Entry.getMaxFloatPoint = function(numbers) {
    var max = 0;
    for (var i=0,len=numbers.length; i<len; i++) {
        var n = String(numbers[i]);
        var idx = n.indexOf('.');
        if (idx !== -1) {
            var tmp = n.length - (idx+1);
            if (tmp > max)
                max = tmp;
        }
    }
    return Math.min(max, 20);
};

Entry.convertToRoundedDecimals = function (value, decimals) {
    if (isNaN(value) || !this.isFloat(value))
        return value;
    else
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};

Entry.attachEventListener = function(elem, eventType, func) {
    setTimeout(function() {
        elem.addEventListener(eventType, func);
    }, 0);
};

Entry.deAttachEventListener = function(elem, eventType, func) {
    elem.removeEventListener(eventType, func);
};

Entry.isEmpty = function(obj) {
    if (!obj)
        return true;

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
};

Entry.Utils.disableContextmenu = function(node) {
    if (!node) return;

    $(node).on('contextmenu', function(e){
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
};

Entry.Utils.isRightButton = function(e) {
    return e.button == 2 || e.ctrlKey;
};

Entry.Utils.inherit = function(parent, child) {
    function F() {}
    F.prototype = parent.prototype;
    child.prototype = new F();
    return child;
};

Entry.bindAnimationCallbackOnce = function($elem, func) {
    $elem.one("webkitAnimationEnd animationendo animationend", func);
};

Entry.Utils.isInInput = function(e) {
    return e.target.type == 'textarea' || e.target.type == 'text';
};

Entry.Utils.generateGlobalFilters = function generateGlobalFilters() {
    if (generateGlobalFilters.initiated) return;
    generateGlobalFilters.initiated = true;
    var svgId = 'entryWorkspaceFilters';
    var svgDom = Entry.Dom(
        $('<svg id="' + svgId + '" class="entryWorkspaceFilters" width="0" height="0"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: $('body') }
    );

    var svg = Entry.SVG(svgId);
    var defs = svg.elem('defs');

    //trashcan filter
    var trashCanFilter = defs.elem('filter', {'id': 'entryTrashcanFilter'});
    trashCanFilter.elem('feGaussianBlur', {'in': 'SourceAlpha', 'stdDeviation': 2, 'result': 'blur'});
    trashCanFilter.elem('feOffset', {'in': 'blur', 'dx': 1, 'dy': 1, 'result': 'offsetBlur'});
    var feMerge = trashCanFilter.elem('feMerge');
    feMerge.elem('feMergeNode', {'in': 'offsetBlur'});
    feMerge.elem('feMergeNode', {'in': 'SourceGraphic'}, feMerge);


    var blockFilter = defs.elem('filter', {'id': 'entryBlockShadowFilter', 'height': '200%'});
    blockFilter.innerHTML = '<feOffset result="offOut" in="SourceGraphic" dx="0" dy="1" />' +
                 '<feColorMatrix result="matrixOut" in="offOut" type="matrix"' +
                 'values="0.7 0 0 0 0 0 0.7 0 0 0 0 0 0.7 0 0 0 0 0 1 0" />' +
                 '<feBlend in="SourceGraphic" in1="offOut" mode="normal" />';

    var blockHighlightFilter = defs.elem('filter', {'id': 'entryBlockHighlightFilter'});
    blockHighlightFilter.innerHTML =
        '<feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />' +
         '<feColorMatrix result="matrixOut" in="offOut" type="matrix"' +
         'values="1.3 0 0 0 0 0 1.3 0 0 0 0 0 1.3 0 0 0 0 0 1 0" />';
};
