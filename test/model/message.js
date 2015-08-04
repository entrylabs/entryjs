"use strict";

describe('Entry.Message', function() {
    it('exist', function(){
        assert.isFunction(Entry.Message);
    });

    var datum = new Entry.Message();

    it('instanceof', function(){
        assert.isTrue(datum instanceof Entry.Message);
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
        assert.throws(func, Error);
    });
});
