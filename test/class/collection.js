"use strict";

describe('Entry.Collection', function(){
    var a, b, c, d, e, col;
    beforeEach(function() {
        a = Entry.Model({id: 3, type: 1}),
        b = Entry.Model({id: 2, type: 2}),
        c = Entry.Model({id: 1, type: 3}),
        d = Entry.Model({id: 0, type: 4}),
        e = null,
        col = new Entry.Collection([a, b, c]);
    });

    it('should make Collection instance', function(){
        (new Entry.Collection()).should.be.instanceof(Entry.Collection);
    });

    describe('#push()', function(){
        context('when add datum', function() {
            it('length should be increase', function() {
                col.push(d);
                col.length.should.be.equal(4);
            });

            it('last one should be input datum', function() {
                col.push(d);
                col.at(3).should.be.deep.equal(d);
            });

            it('should return input datum by get method', function() {
                col.push(d);
                col.get(d.id).should.be.deep.equal(d);
            });
        });
    });

    describe('set', function(){
    });

    describe('type check', function(){
    });

    describe('add method', function(){


        describe('unshift', function(){
        });

        describe('insert', function(){
        });
    });

    describe('get method', function(){
        describe('get', function(){
        });

        describe('at', function(){
        });

        describe('find', function(){
        });
    });

    describe('remove method', function(){
        describe('pop', function(){
        });

        describe('shift', function(){
        });

        describe('slice', function(){
        });

        describe('clear', function(){
        });
    });

    describe('method', function(){
        describe('map', function(){
        });

        describe('moveTo', function(){
        });

        describe('sort', function(){
        });
    });

    describe('observing method', function(){
        describe('notify', function(){
        });

        describe('give appropriate parameter', function(){
        });

        describe('unobserve', function(){
        });
    });

    describe('has property', function(){
        describe('length', function(){
        });
    });

    describe('json', function(){
        describe('import', function(){
        });

        describe('export', function(){
        });
    });
});
