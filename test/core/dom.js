"use strict";

describe('Entry.Dom', function(){
    it('exist', function(){
        assert.equal(typeof Entry.Dom, "function");
    })

    describe('return jQuery object', function(){
        it('by tag name', function(){
            var dom = Entry.Dom('div');
            assert.isTrue(dom instanceof jQuery);
        });

        it('by jQuery object', function(){
            var dom = Entry.Dom($('<div></div>'));
            assert.isTrue(dom instanceof jQuery);
        });

        it('by html', function(){
            var dom = Entry.Dom('<div></div>');
            assert.isTrue(dom instanceof jQuery);
        });

        it('by html element', function(){
            var dom = Entry.Dom(document.createElement('div'));
            assert.isTrue(dom instanceof jQuery);
        });
    });

});

