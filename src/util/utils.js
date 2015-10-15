"use strict";

goog.provide("Entry.Utils");

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
    return (matrix.x - offset <= point.x) &&
        (matrix.x + matrix.width + offset >= point.x) &&
        (matrix.y - offset <= point.y) &&
        (matrix.y + matrix.height + offset >= point.y);
};

Entry.Utils.colorDarken = function(color, factor) {
    var r, g, b;
    if (color.length === 7) {
        r = parseInt(color.substr(1, 2), 16),
        g = parseInt(color.substr(3, 2), 16),
        b = parseInt(color.substr(5, 2), 16);
    } else {
        r = parseInt(color.substr(1, 2), 16),
        g = parseInt(color.substr(2, 2), 16),
        b = parseInt(color.substr(3, 2), 16);
    }

    factor = factor === undefined ? 0.7 : factor;
    r = Math.floor(r * factor).toString(16);
    g = Math.floor(g * factor).toString(16);
    b = Math.floor(b * factor).toString(16);

    return '#' + r + g + b;
};
