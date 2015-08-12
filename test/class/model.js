"use strict";

describe('Entry.Model', function(){
    var schema, datum, never;

    before(function() {
        never = function(){ assert(false, "this function should not be called") };
    });

    beforeEach(function() {
        schema = {
            id: 0,
            type: 1,
            value: 2
        };

        var constructor = function() {
            Entry.Model(this);
        };
        constructor.prototype.schema = schema;

        datum = new constructor();

    });

    it('should be a function', function(){
        Entry.Model.should.be.a("function");
    })

    describe('schema feature', function(){
        it('should not throw error with null schema', function(){
            var constructor = function() {
                Entry.Model(this);
            };

            var func = function(){ new constructor() };
            func.should.not.throw(Error);
        });

        it('should generate accessor for registered key', function(){
            datum.value.should.be.not.undefined;
        });

        it('should throw error for accessing not registered key', function(){
            var func = function() {
                datum.notExistKey = 0;
            };
            func.should.be.throw(Error);
        });

        it('should make default value', function(){
            datum.type.should.be.equal(1);
            datum.value.should.be.equal(2);
        });
    });

    describe('direct getter & setter', function(){
        it('should change data properly', function(){
            datum.type = 3;

            datum.type.should.be.equal(3);
        });

        it('should not be delete and throw error', function(){
            var func = function() {
                delete datum.id;
            };
            func.should.be.throw(Error);
        });
    });

    describe('observe', function() {
        describe('all', function() {
            context('when model change', function() {
                it('should notify', function(done) {
                    var obj = {done: function() {
                        done();
                    }};
                    datum.observe(obj, 'done');

                    datum.value = 3;
                });

                it('should provide change information properly', function() {
                    var obj = {update: function(data) {
                        expect(data).to.deep.equal([
                            {
                                name: 'value',
                                object: datum,
                                oldValue: 2
                            }
                        ])
                    }};
                    datum.observe(obj, 'update');

                    datum.value = 3;
                });
            });

            context('when model not change', function() {
                it('should not notify', function() {
                    var obj = {done: never};
                    datum.observe(obj, 'done');
                });
            });
        });

        describe('specific property', function() {
            context('when model change', function() {
                it('should notify', function(done) {
                    var obj = {done: function() {
                        done();
                    }};
                    datum.observe(obj, 'done', ['value']);

                    datum.value = 3;
                });

                it('should provide change information properly ', function() {
                    var obj = {update: function(data) {
                        expect(data).to.deep.equal([
                            {
                                name: 'value',
                                object: datum,
                                oldValue: 2
                            }
                        ])
                    }};
                    datum.observe(obj, 'update', ['value']);

                    datum.value = 3;
                });
            });

            context('when model not change', function() {
                it('should not notify', function() {
                    var obj = {done: never};
                    datum.observe(obj, 'done', ['id']);
                });

                it('should not notify', function() {
                    var obj = {done: never};
                    datum.observe(obj, 'done', ['id']);

                    datum.value = 3;
                });
            });
        });

        it('should not notify once when edit data at once', function() {
        });

    });
});
