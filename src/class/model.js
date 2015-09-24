"use strict";

goog.provide("Entry.Model");

goog.require("Entry.Utils");

/*
 * Entry Model object generator.
 * @param {object} obj
 */
Entry.Model = function(obj, isSeal) {
    var model = Entry.Model;
    model.generateSchema(obj);
    model.generateSetter(obj);
    model.generateObserve(obj);
    if (isSeal === undefined || isSeal)
        Object.seal(obj);

    return obj;
};

(function (m) {
    m.generateSchema = function(obj) {
        var schema = obj.schema;
        if (schema === undefined)
            return;
        schema = JSON.parse(JSON.stringify(schema));
        obj.data = {};
        for (var key in schema) {
            (function(localKey) {
                obj.data[localKey] = schema[localKey];
                Object.defineProperty(obj, localKey, {
                    get: function() {
                        return obj.data[localKey];
                    },
                    set: function(val) {
                        var oldValue = obj.data[localKey];
                        obj.data[localKey] = val;
                        obj.notify(localKey, oldValue);
                    }
                });
            })(key);
        }
    };

    m.generateSetter = function(obj) {
        obj.set = this.set;
    };

    m.set = function(data) {
        this.notify(Object.keys(data));
        this._isSilent = true;
        for (var key in data) {
            // call setter
            this[key] = data[key];
        }
        this._isSilent = false;
    };

    m.generateObserve = function(obj) {
        obj._isSilent = false;
        obj.observers = [];
        obj.observe = this.observe;
        obj.unobserve = this.unobserve;
        obj.notify = this.notify;
    };

    /*
     * @param {object} object that observe this model
     * @param {string} eventFunc will be call when notify
     * @param {?object} attrs includes which property to watch. Should be array or null.
     */
    m.observe = function(object, funcName, attrs) {
        var observeObj = {
            object: object,
            funcName: funcName,
            attrs: attrs
        };
        this.observers.push(observeObj);
        return observeObj;
    };

    m.unobserve = function(observeObj) {
        var index = this.observers.indexOf(observeObj);
        if (index > -1)
            this.observers.splice(index, 1);
    };

    /*
     * @param {object|string} key
     * @param {} oldValue
     */
    m.notify = function(keys, oldValue) {
        if (this._isSilent) return;

        if (typeof keys === 'string') keys = [keys];

        var that = this;
        that.observers.map(function (observeData) {
            var attrs = keys;
            if (observeData.attrs !== undefined)
                attrs = Entry.Utils.intersectArray(observeData.attrs, keys);

            if (!attrs.length) return;

            observeData.object[observeData.funcName](
                attrs.map(function(key){
                    return {
                        name: key,
                        object: that,
                        oldValue: oldValue
                    };
                })
            );
        });
    };

})(Entry.Model);

