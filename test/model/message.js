"use strict";

describe('Entry.Message', function() {
    it('exist', function(){
        assert.isFunction(Entry.Message);
    });

    var datum = new Entry.Message();

    var schema = {
        id: 0,
        type: Entry.STATIC.MESSAGE,
        name: 0
    };

    it('instanceof', function(){
        assert.isTrue(datum instanceof Entry.Message);
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
