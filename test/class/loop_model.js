"use strict";

describe('Entry.LoopModel', function(){
    it('exist', function(){
        assert.equal(typeof Entry.LoopModel, "function");
    })

    describe('getter & setter', function(){
        it('exist', function(){
            var model = new Entry.LoopModel();

            assert.equal(typeof model.get, "function");
            assert.equal(typeof model.set, "function");
        });

        it('test', function(){
            var model = new Entry.LoopModel();

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

    describe('bind', function() {
        it('exist', function(){
            var model = new Entry.LoopModel();

            assert.equal(typeof model.bind, "function");
            assert.equal(typeof model.unbind, "function");
        });

        it('register', function() {
            var testObject = {};
            var model = new Entry.LoopModel();

            assert.isFalse(model.unbind(testObject));
            model.bind(testObject);
            assert.isTrue(model.unbind(testObject));
            assert.isFalse(model.unbind(testObject));
        });
    });

    describe('observer fire', function() {
        it('test', function(done) {
            var testObject = {
                update: function() {
                    done();
                }
            };
            var model = new Entry.LoopModel();

            model.bind(testObject);
            model.notify();
        });

    });
});

