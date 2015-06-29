"use strict";

describe('Entry.ObserverModel', function(){
    it('exist', function(){
        assert.equal(typeof Entry.ObserverModel, "function");
    })

    describe('getter & setter', function(){
        it('exist', function(){
            var model = new Entry.ObserverModel();

            assert.equal(typeof model.get, "function");
            assert.equal(typeof model.set, "function");
        });

        it('test', function(){
            var model = new Entry.ObserverModel();

            var value = Math.random();

            model.set({
                key: value
            });
            assert.equal(
                value,
                model.get('key')
            );
        });
    });

    describe('observe & unobserve', function() {
        it('exist', function(){
            var model = new Entry.ObserverModel();

            assert.equal(typeof model.observe, "function");
            assert.equal(typeof model.unobserve, "function");
        });

        it('register', function() {
            var testObject = {};
            var model = new Entry.ObserverModel();

            assert.isFalse(model.unobserve(testObject));
            model.observe(testObject);
            assert.isTrue(model.unobserve(testObject));
            assert.isFalse(model.unobserve(testObject));
        });
    });

    describe('observer fire', function() {
        it('test', function() {
            var testFlag = false;
            var testObject = {
                update: function() {
                    testFlag = true;
                }
            };
            var model = new Entry.ObserverModel();

            model.observe(testObject);
            model.notify();
            assert.isTrue(testFlag);
        });

        it('setter test', function() {
            var testFlag = false;
            var testObject = {
                update: function() {
                    testFlag = true;
                }
            };
            var model = new Entry.ObserverModel();

            model.observe(testObject);
            model.set();
            assert.isTrue(testFlag);
        });
    });
});
