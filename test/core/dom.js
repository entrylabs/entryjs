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

    describe('option', function(){
        it('add id', function(){
            var id = Test.randomString();
            var dom = Entry.Dom('div', {id: id});
            assert.equal(dom.attr('id'), id);
            assert.notEqual(dom.attr('id'), Test.randomString());
        });

        it('add class', function(){
            var className = Test.randomString();
            var dom = Entry.Dom('div', {class: className});
            assert.isTrue(dom.hasClass(className));
            assert.isFalse(dom.hasClass(Test.randomString()));
        });

        it('add class', function(){
            var rd = Test.randomString;
            var classNames = [rd(), rd(), rd()];
            var dom = Entry.Dom('div', {classes: classNames});
            assert.isTrue(dom.hasClass(classNames[0]));
            assert.isTrue(dom.hasClass(classNames[1]));
            assert.isTrue(dom.hasClass(classNames[2]));
            assert.isFalse(dom.hasClass(Test.randomString()));
        });

        it('get parent', function() {
            var parent = Entry.Dom('div');
            var child = Entry.Dom('div', {parent: parent});
            assert.isNotNull(child.parent()[0]);
            assert.strictEqual(parent[0], child.parent()[0]);
        });
    });

});

