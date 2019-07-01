/*
 *
 */
'use strict';

Entry.Map = function() {
    var map = {};
    map.repo = {};
    this._map = map;
};

(function(p) {
    p.getKey = function(id) {
        return id;
    };

    p.put = function(id, value) {
        var key = this.getKey(id);
        this._map.repo[key] = value;
    };

    p.contains = function(id) {
        var key = this.getKey(id);
        if (this._map.repo[key]) {
            return true;
        } else {
            return false;
        }
    };

    p.get = function(id) {
        var key = this.getKey(id);
        if (this._map.repo[key]) {
            return this._map.repo[key];
        }
        return null;
    };

    p.remove = function(id) {
        var key = this.getKey(id);
        if (this.contains(id)) {
            this._map.repo[key] = undefined;
        }
    };

    p.clear = function() {
        this._map.repo = {};
    };

    p.toString = function() {
        return this._map.repo;
    };
})(Entry.Map.prototype);
