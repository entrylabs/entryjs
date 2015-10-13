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
