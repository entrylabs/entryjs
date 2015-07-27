"use strict";

describe('Entry.EntryObject', function(){
    it('exist', function(){
        assert.equal(typeof Entry.EntryObject, "function");
    })

    describe('getter & setter', function(){
        it('exist', function(){
            var model = new Entry.EntryObject();

            assert.equal(typeof model.get, "function");
            assert.equal(typeof model.set, "function");
        })

        it('test', function(){
            var model = new Entry.EntryObject();

            var value = Math.random();

            model.set({
                key: value
            });
            assert.equal(
                value,
                model.get('key')
            );
        })
    });

    describe('schema', function(){
        it('test', function(){
            var model = new Entry.EntryObject();

            var schema = {
                id: null,
                name: null,
                order: null,
                objectType: null,
                scene: null,
                lock: null,
                rotateMethod: null,
                entity: null,
                script: null,
                sprite: null
            };

            for (var key in schema)
                assert.isTrue(model.data.hasOwnProperty(key));

            assert.isFalse(
                model.data.hasOwnProperty('Id')
            );
        })
    });

    describe('bind', function() {
        it('exist', function(){
            var model = new Entry.EntryObject();

            assert.equal(typeof model.bind, "function");
            assert.equal(typeof model.unbind, "function");
        });

        it('register', function() {
            var testObject = {};
            var model = new Entry.EntryObject();

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
            var model = new Entry.EntryObject();

            model.bind(testObject);
            model.notify();
        });

    });
});
