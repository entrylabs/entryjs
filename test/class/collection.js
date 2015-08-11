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

    describe('#set()', function(){
        context('when set data', function() {
            it('data should be equal to supplied data', function() {
                var data = [a,b,d];
                col.set(data);
                for (var i=0,len=data.length; i<len; i++)
                    col.at(i).should.be.deep.equal(data[i]);
            });

            it('data length should be equal to supplied data length', function() {
                var data = [a,b];
                col.set(data);
                col.length.should.be.equal(data.length);
            });

            it('should return input datum by get method', function() {
                var data = [a,b,d];
                col.set(data);
                for (var i=0,len=data.length; i<len; i++)
                    col.get(data[i].id).should.be.deep.equal(data[i]);
            });
        });

    });

    describe('type check', function(){
    });


    describe('#unshift()', function(){
        it('supplied data should be inserted at front according to the sequence', function() {
            col.set([a,b]);
            col.unshift(c,d);
            col.at(0).should.equal(c);
            col.at(1).should.equal(d);
        });

        it('length should be increase with arguments length', function() {
            col.set([a]);
            col.unshift(b);
            col.length.should.be.equal(2);
            col.set([a]);
            col.unshift(b,c);
            col.length.should.be.equal(3);
        });

        it('should return input datum by get method', function() {
            col.set([a]);
            col.unshift(b);
            col.get(b.id).should.be.deep.equal(b);
            var args = [b,c];
            col.set([a]);
            col.unshift(b,c);
            for (var i=0,len=args.length; i<len; i++)
                col.get(args[i].id).should.be.deep.equal(args[i]);
        });
    });

    describe('#insert()', function(){
        it('length should be increase with after insertion', function() {
            col.insert(d, 1);
            col.length.should.be.equal(4);
        });

        it('should return input datum by get method', function() {
            col.insert(d, 1);
            col.get(d.id).should.be.deep.equal(d);
        });

        it('should be inserted at proper position', function() {
            col.insert(d, 1);
            col.at(1).should.be.deep.equal(d);
        });
    });

    describe('#has()', function(){
        it('should return true when there is matching datum', function() {
            col.has(b.id).should.be.equal(true);
        });

        it('should return false when there is not matching datum', function() {
            col.has(d.id).should.be.equal(false);
        });
    });

    describe('#get()', function(){
        it('should return proper datum when there is matching datum', function() {
            col.get(b.id).should.be.deep.equal(b);
        });

        it('should return undefined when there is not matching datum', function() {
            expect(col.get(d.id)).to.be.an('undefined');
        });
    });

    describe('#at()', function(){
        it('should return proper datum according to index', function() {
            col.at(0).should.be.deep.equal(a);
        });

        it('should return undefined when out of index', function() {
            expect(col.at(21)).to.be.an('undefined');
        });
    });

    describe('#pop()', function(){
        it('should return proper datum at last index', function() {
            col.pop().should.be.deep.equal(c);
        });

        it('should return undefined when empty', function() {
            col.set([]);
            expect(col.pop()).to.be.an('undefined');
        });

        it('should return undefined by get method after pop', function() {
            var datum = col.pop();
            expect(col.get(datum.id)).to.be.an('undefined');
        });

        it('length should be decrease', function() {
            col.pop();
            col.length.should.be.equal(2);
        });

    });
});
