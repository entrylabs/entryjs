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
        })

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
        })
    });
});
