"use strict";

goog.provide("Entry.Model");

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
        obj.data = {};
        for (var key in schema) {
            (function(localKey) {
                if (typeof schema[localKey] == 'object')
                    obj.data[localKey] = $.extend(true, {}, schema[localKey]);
                else
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
        obj.observe = observe;
        obj.unobserve = unobserve;
        obj.notify = notify;
    };

    function observe(view) {
        this.observers.push(view);
    };

    function unobserve(view) {
        var index = this.observers.indexOf(view);
        if (index > -1)
            this.observers.splice(index, 1);
    };

    function notify(key, oldValue) {
        var that = this;
        that.observers.map(function (observer) {
            observer.update([{
                name: key,
                object: that,
                oldValue: oldValue
            }]);
        });
    };
})(Entry.Model);

