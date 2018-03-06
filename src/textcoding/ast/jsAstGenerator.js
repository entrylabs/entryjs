/*
 *
 */
'use strict';

Entry.JsAstGenerator = function() {};

(function(p) {
    p.generate = function(code) {
        return arcon.parse(code);
    };
})(Entry.JsAstGenerator.prototype);
