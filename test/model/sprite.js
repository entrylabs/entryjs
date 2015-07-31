"use strict";

describe('Entry.Sprite', function() {
    it('exist', function(){
        assert.isFunction(Entry.Sprite);
    });

    var datum = new Entry.Sprite();

    it('instanceof', function(){
        assert.isTrue(datum instanceof Entry.Sprite);
    });

    it('schema data change', function(){
        var schema = datum.schema;
        var flag = true;
        for (var key in schema) {
            var randomString = Test.randomString();
            datum[key] = randomString;
            if (datum[key] != randomString) {
                flag = false;
                break;
            }
        }
        assert.isTrue(flag, 'data should be changed by schema keys');
    });

    it('non-schema data change', function(){
        var key = Test.randomString();
        var value = Test.randomString();
        var func = function() {
            datum[key] = value;
        };
        assert.throws(func, Error, 'Attempted to assign to readonly property.');
    });
});
