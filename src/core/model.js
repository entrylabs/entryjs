'use strict';

/*
 * Entry Model object generator.
 * @param {object} obj
 */
Entry.Model = function(obj, isSeal) {
    const model = Entry.Model;
    model.generateSchema(obj);
    model.generateSetter(obj);
    model.generateObserve(obj);
    if (isSeal === undefined || isSeal) {
        Object.seal(obj);
    }

    return obj;
};

(function(m) {
    m.generateSchema = function(obj) {
        let schema = obj.schema;
        if (schema === undefined) {
            return;
        }
        try {
            schema = JSON.parse(JSON.stringify(schema));
        } catch (e) {
            console.log(schema);
            console.error(e);
        }
        obj.data = {};
        for (const key in schema) {
            (function(localKey) {
                obj.data[localKey] = schema[localKey];
                Object.defineProperty(obj, localKey, {
                    get() {
                        return obj.data[localKey];
                    },
                });
            })(key);
        }
        obj._toJSON = this._toJSON;
    };

    m.generateSetter = function(obj) {
        obj.set = this.set;
    };

    m.set = function(data, isSilent) {
        const oldValue = {};
        const keys = Object.keys(data);
        for (const key in this.data) {
            if (data[key] !== undefined) {
                if (data[key] === this.data[key]) {
                    keys.splice(keys.indexOf(key), 1);
                } else {
                    oldValue[key] = this.data[key];
                    if (data[key] instanceof Array) {
                        this.data[key] = data[key].concat();
                    } else {
                        this.data[key] = data[key];
                    }
                }
            }
        }
        if (!isSilent) {
            this.notify(keys, oldValue);
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
     * @param {boolean} isNotify
     */
    m.observe = function(object, funcName, attrs, isNotify) {
        const observer = new Entry.Observer(this.observers, object, funcName, attrs);
        if (isNotify !== false) {
            object[funcName]([]);
        }
        return observer;
    };

    m.unobserve = function(observer) {
        observer.destroy();
    };

    /*
     * @param {object|string} key
     * @param {} oldValue
     */
    m.notify = function(keys, oldValue) {
        if (typeof keys === 'string') {
            keys = [keys];
        }

        const that = this;
        const observers = that.observers;

        if (!observers.length) {
            return;
        }

        observers.forEach((observeData) => {
            let attrs = keys;
            if (observeData.attrs !== undefined) {
                attrs = _.intersection(observeData.attrs, keys);
            }

            if (!attrs.length) {
                return;
            }

            observeData.object[observeData.funcName](
                attrs.forEach((key) => {
                    return {
                        name: key,
                        object: that,
                        oldValue: oldValue[key],
                    };
                })
            );
        });
    };

    m._toJSON = function() {
        const json = {};
        for (const key in this.data) {
            json[key] = this.data[key];
        }
        return json;
    };
})(Entry.Model);
