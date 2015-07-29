/*
"use strict";

describe('Entry.Scene', function() {
    it('exist', function(){
        assert.isFunction(Entry.Scene);
    });

    var datum = new Entry.Scene();

    var schema = {
        id: 0,
        type: Entry.STATIC.SCENE,
        name: 0
    };

    it('instanceof', function(){
        assert.isTrue(datum instanceof Entry.Scene);
    });

    it('schema key length compare', function(){
        var schemaKeysLength = Object.keys(schema).length;
        var dataKeysLength = Object.keys(datum.data).length;
        assert.equal(schemaKeysLength, dataKeysLength);
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
*/
