"use strict";

describe('Entry.Entity', function() {
    it('exist', function(){
        assert.isFunction(Entry.Entity);
    });

    var datum = new Entry.Entity();

    var schema = {
        id: 0,
        type: Entry.STATIC.ENTITY,
        rotation: 0,
        direction: 0,
        x: 0,
        y: 0,
        regX: 0,
        regY: 0,
        scaleX: 0,
        scaleY: 0,
        width: 0,
        height: 0,
        imageIndex: 0,
        visible: 0,
        colour: 0,
        font: 0,
        bgColor: 0,
        textAlign: 0,
        lineBreak: false,
        underLine: false,
        strike: false
    };

    it('instanceof', function(){
        assert.isTrue(datum instanceof Entry.Entity);
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
