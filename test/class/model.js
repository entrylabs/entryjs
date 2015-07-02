"use strict";

describe('Entry.Model', function(){
    it('exist', function(){
        assert.equal(typeof Entry.Model, "function");
    })

    describe('getter & setter', function(){
        it('exist', function(){
            var model = new Entry.Model();

            assert.equal(typeof model.get, "function");
            assert.equal(typeof model.set, "function");
        })

        it('test', function(){
            var model = new Entry.Model();

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
            var model = new Entry.Model();

            assert.isTrue(
                model.data.hasOwnProperty('id')
            );

            assert.isFalse(
                model.data.hasOwnProperty('Id')
            );
        })
    });
});
