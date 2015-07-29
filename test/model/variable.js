"use strict";

describe('Entry.Variable', function() {
    it('exist', function(){
        assert.isFunction(Entry.Variable);
    });

    var datum = new Entry.Variable();

    var schema = {
        id: 0,
        type: Entry.STATIC.VARIABLE,
        variableType: 0,
        name: 0,
        value: 0,
        minValue: 0,
        maxValue: 0,
        visible: true,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isCloud: false,
        object: null,
        array: 0
    };

    it('instanceof', function(){
        assert.isTrue(datum instanceof Entry.Variable);
    });

    it('schema key length compare', function(){
        assert.equal(Object.keys(schema).length, Object.keys(datum.data).length);
    });

    it('schema datum have same key', function(){
        var schemaKeys = Object.keys(schema).sort();
        var dataKeys = Object.keys(datum.data).sort();

        var flag = true;
        for (var i=0, len=schemaKeys.length; i<len; i++) {
            if (schemaKeys[i] != dataKeys[i]) {
                flag = false;
                break;
            }
        }
        assert.isTrue(flag, 'schema and datum.data should have same keys');
    });

    it('schema datum have same value', function(){
        var flag = true;
        for (var i in schema) {
            if (schema[i] != datum[i]) {
                flag = false;
                break;
            }
        }
        assert.isTrue(flag, 'schema and datum.data should have same value');
    });
});
