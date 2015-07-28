"use strict";

describe('Entry.db', function(){
    it('exist', function(){
        assert.equal(typeof Entry.db, "object");
    })

    describe('data', function(){
        it('add & has', function(){
            var obj = {id: Test.randomString()};
            assert.isFalse(Entry.db.has(obj.id));
            Entry.db.add(obj);
            assert.isTrue(Entry.db.has(obj.id));
        });

        it('remove', function(){
            var obj = {id: Test.randomString()};
            Entry.db.add(obj);
            assert.isTrue(Entry.db.has(obj.id));
            Entry.db.remove(obj.id);
            assert.isFalse(Entry.db.has(obj.id));
        });

        it('clear', function(){
            var obj = {id: Test.randomString()};
            Entry.db.add(obj);
            assert.isTrue(Entry.db.has(obj.id));
            Entry.db.clear();
            assert.isFalse(Entry.db.has(obj.id));
        });

    });

    describe('find with', function(){
    });
});
