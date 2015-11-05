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
                    }
                });
            })(key);
        }
        obj._toJSON = this._toJSON;
    };

    m.generateSetter = function(obj) {
        obj.set = this.set;
    };

    m.set = function(data, isSilent) {
        var oldValue = {};
        for (var key in this.data) {
            if (data[key] !== undefined) {
                oldValue[key] = this.data[key];
                this.data[key] = data[key];
            }
        }
        if (!isSilent)
            this.notify(Object.keys(data), oldValue);
    };

    m.generateObserve = function(obj) {
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
        return new Entry.Observer(
            this.observers,
            object,
            funcName,
            attrs
        );
    };

    m.unobserve = function(observer) {
        observer.destroy();
    };

    /*
     * @param {object|string} key
     * @param {} oldValue
     */
    m.notify = function(keys, oldValue) {
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
                        oldValue: oldValue[key]
                    };
                })
            );
        });
    };

    m._toJSON = function() {
        var json = {};
        for (var key in this.data) json[key] = this.data[key];
        return json;
    };

})(Entry.Model);

