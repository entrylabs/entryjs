"use strict";

describe('Entry.Entity', function() {
    it('exist', function(){
        assert.isFunction(Entry.Entity);
    });

    var datum = new Entry.Entity();

    it('instanceof', function(){
        assert.isTrue(datum instanceof Entry.Entity);
    });

    it('schema key length compare', function(){
        assert.equal(Object.keys(Entry.Entity.prototype.schema).length,
                Object.keys(datum.data).length);
    });

    it('schema datum have same key', function(){
        var schemaKeys = Object.keys(Entry.Entity.prototype.schema).sort();
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
        var schema = Entry.Entity.prototype.schema;
        for (var i in schema) {
            if (schema[i] != datum[i]) {
                flag = false;
                break;
            }
        }
        assert.isTrue(flag, 'schema and datum.data should have same value');
    });
});
