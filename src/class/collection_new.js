'use strict';

goog.provide("Entry.Collection");

/*
 * Entry Collection object constructor.
 */

Entry.Collection = function(data) {
    this.length = 0;

    /*
     * object for hashing data with id
     * @private
     */
    this._hashMap = {};

    /*
     * observers
     */
    this._observers = [];
    this.set(data);
};

(function(p, ap) {
    /* setters */
    p.set = function(data) {
        while(this.length) ap.pop.call(this);

        var hashMap = this._hashMap;
        for (var key in hashMap)
            delete hashMap[key];

        if (data !== undefined) {
            for (var i = 0, len = data.length; i<len; i++) {
                var datum = data[i];
                hashMap[datum.id] = datum;
                ap.push.call(this, datum);
            }
        }
    };

    p.push = function(elem){ap.push.call(this, elem);};

    p.unshift = function() {
        var args = Array.prototype.slice.call(arguments,0);
        for (var i=args.length-1; i>=0; i--) {
            var datum = args[i];
            ap.unshift.call(this, datum);
            this._hashMap[datum.id] = datum;
        }
    };
    p.insert = function(datum, index) {
        ap.splice.call(this, index, 0, datum);
        this._hashMap[datum.id] = datum;
    };

    p.has = function(id) {return !!this._hashMap[id];};

    p.get = function(id) {return this._hashMap[id];};

    p.getAll = function() {
        var len = this.length;
        var ret = [];
        for (var i=0; i<len; i++)
            ret.push(this[i]);
        return ret;
    };

    p.indexOf = function(obj) {return ap.indexOf.call(this, obj);};

    p.find = function(cond) {
        var ret = [];
        var flag;

        for (var i=0,len=this.length; i<len; i++) {
            flag = true;
            var datum = this[i];
            for(var key in cond) {
                if (cond[key] != datum[key]) {
                    flag = false;
                    break;
                }
            }
            if (flag)
                ret.push(datum);
        }
        return ret;
    };

    p.pop = function(){ap.pop.call(this);};

    p.shift = function() {
        return ap.shift.call(this);
    };

    p.slice = function(index, amount) {
        return ap.slice.call(this,index, amount);
    };

    p.remove = function(datum) {
        var index = this.indexOf(datum);
        if (index > -1) {
            delete this._hashMap[datum.id];
            this.splice(index, 1);
        }
    };

    p.splice = function(index, amount) {
        var args = ap.slice.call(arguments,2);
        var hashMap = this._hashMap;
        amount = amount === undefined ?
            this.length - index: amount;

        var splicedData = ap.splice.call(this, index, amount);

        for (var i=0,len=splicedData.length; i<len; i++)
            delete hashMap[splicedData[i].id];


        for (i=0,len=args.length; i<len; i++) {
            var datum = args[i];
            ap.splice.call(this, index++, 0, datum);
            this._hashMap[datum.id] = datum;
        }

        return splicedData;
    };

    p.clear = function() {
        while(this.length) ap.pop.call(this);
        var hashMap = this._hashMap;
        for (var key in hashMap) delete hashMap[key];
    };

    p.map = function(fn, param) {
        for (var i=0, len=this.length; i<len; i++) fn(this[i], param);
    };

    p.moveFromTo = function(from, to) {
        var max = this.length-1;
        if (from< 0 || to<0 || from>max || to>max)
            return;
        ap.splice.call(
            this, to, 0,
            ap.splice.call(this, from, 1)[0]
        );
    };

    p.sort = function() {
    };

    /* import & export */
    p.fromJSON = function() {
    };

    p.toJSON = function() {
        var json = [];
        for (var i=0, len=this.length; i<len; i++)
            json.push(this[i].toJSON());
        return json;
    };

    /* observe methods */
    p.observe = function() {
    };

    p.unobserve = function() {
    };

    p.notify = function() {
    };

    /* end function */
    p.destroy = function() {
    };
})(Entry.Collection.prototype, Array.prototype);
