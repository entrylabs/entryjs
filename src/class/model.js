"use strict";

goog.provide("Entry.Model");

goog.require("Entry.Utils");

/*
 * Entry Model object generator.
 * @param {object} obj
 * @param {object} schema
 */
Entry.Model = function(obj) {
    var model = Entry.Model;
    model.generateSchema(obj);
    model.generateObserve(obj);
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
                        obj.notify(localKey, obj.data[localKey]);
                        obj.data[localKey] = val;
                    }
                });
            })(key);
        }
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
        this.observers.push({
            object: object,
            funcName: funcName,
            attrs: attrs
        });
    };

    m.unobserve = function(view) {
        var index = this.observers.indexOf(view);
        if (index > -1)
            this.observers.splice(index, 1);
    };

    /*
     * @param {object|string} key
     */
    m.notify = function(keys) {
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
                        oldValue: that.data[key]
                    };
                })
            );
        });
    };

})(Entry.Model);

