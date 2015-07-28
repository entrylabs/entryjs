"use strict";

goog.provide("Entry.Model");

/*
 * Entry Model object generator.
 * @param {object} obj
 * @param {object} schema
 */
Entry.Model = function(obj, schema) {
    var model = Entry.Model;
    model.generateSchema(obj, schema);
    model.generateObserve(obj);
    Object.seal(obj);

    return obj;
};

(function (m) {
    m.generateSchema = function(obj, schema) {
        obj.data = {};
        for (var key in schema) {
            obj.data[key] = schema[key];
            Object.defineProperty(obj, key, {
                get: function() {
                    return obj.data[key];
                },
                set: function(val) {
                    obj.notify(key, obj.data[key]);
                    obj.data[key] = val;
                }
            });
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
        var i = this.observers.indexOf(view);
        if (i > -1)
            this.observers.splice(i, 1);
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

    m.get = function(key) {
        return this.data[key];
    };

    m.set = function(data) {
        for (var key in data) {
            var value = data[key];
            this.data[key] = value;
        }
    };

})(Entry.Model);

