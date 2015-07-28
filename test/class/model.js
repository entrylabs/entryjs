"use strict";

describe('Entry.Model', function(){
    it('exist', function(){
        assert.equal(typeof Entry.Model, "function");
    })

    describe('schema', function(){
        it('generate accessor', function(){
            var key = Test.randomString();
            var value = Test.randomString();
            var schema = {};
            schema[key] = value;

            var constructor = function() {
                Entry.Model(this, schema);
            };
            var datum = new constructor();

            assert.equal(datum[key], value);
        });
    });

    describe('get & set', function(){
        it('test', function(){
            var key = Test.randomString();
            var value = 0;
            var schema = {};
            schema[key] = value;

            var constructor = function() {
                Entry.Model(this, schema);
            };
            var datum = new constructor();

            value = Test.randomString();
            datum[key] = value;

            assert.equal(datum[key], value);
        });
    });

    describe('seal', function(){
        it('test', function(){
            var datum = {};
            Entry.Model(datum);

            var key = Test.randomString();
            var value = Test.randomString();
            var func = function() {
                datum[key] = value;
            };
            assert.throws(func, Error);
        });
    });

    describe('observe', function() {
        it('exist', function(){
            var datum = Entry.Model({});
            assert.equal(typeof datum.observe, 'function');
        });

        it('notify', function(){
            var key = Test.randomString();
            var schema = {};
            schema[key] = 0;

            var constructor = function() {
                Entry.Model(this, schema);
            };
            var datum = new constructor();

            var flag = false;
            var view = {update: function() {
                flag = true;
            }};
            datum.observe(view);
            datum.data.a = 2;

            datum[key] = 1;
            assert.isTrue(flag);
        });

        describe('give appropriate parameter', function(){
            var key = Test.randomString();
            var oldValue = Test.randomString();
            var schema = {};
            schema[key] = oldValue;

            var constructor = function() {
                Entry.Model(this, schema);
            };
            var datum = new constructor();

            var change;
            var view = {update: function(c) {
                change = c[0];
            }};
            datum.observe(view);

            // change value to notify
            datum[key] = 'new';

            it('name', function(){
                assert.equal(change.name, key);
            });

            it('object', function(){
                assert.strictEqual(change.object, datum);
            });

            it('type', function(){
                // In model, change type is always 'update', so not implemented.
            });

            it('oldValue', function(){
                assert.equal(change.oldValue, oldValue);
            });
        });

        it('unobserve test', function(){
            var key = Test.randomString();
            var oldValue = Test.randomString();
            var schema = {};
            schema[key] = oldValue;

            var constructor = function() {
                Entry.Model(this, schema);
            };
            var datum = new constructor();

            var flag = false;
            var view = {update: function(c) {
                flag = true;
            }};
            datum.observe(view);
            datum.unobserve(view);
            datum[key] = 'new';

            assert.isFalse(flag);
        });
    });
});
