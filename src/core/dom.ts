type HandleableClickEvent = JQuery.ClickEvent & { handled: boolean };

const createEntryDom: EntryDomConstructor = function(tag, options) {
    const tagRegex = /<(\w+)>/;
    let dom: EntryDom;

    if (tag instanceof HTMLElement) {
        dom = $(tag);
    } else if (tag instanceof jQuery) {
        dom = tag as JQuery;
    } else if (typeof tag === 'string' && tagRegex.test(tag)) {
        dom = $(tag);
    } else {
        dom = $(`<${tag}></${tag}>`);
    }

    //NOTE options 가 없으면 bindOnClick 이라는 함수가 없다. 의도한건지 모르겠음.
    if (options === undefined) {
        return dom;
    }

    options.id && dom.attr('id', options.id);
    options.class && dom.addClass(options.class);
    options.classes && options.classes.forEach(dom.addClass.bind(dom));
    options.text && dom.text(options.text);
    options.src && dom.attr('src', options.src);
    options.href && dom.attr('href', options.href);
    options.parent && options.parent.append(dom);

    dom.bindOnClick = function() {
        let child: any;
        let func: Function;

        const handler = function(e: HandleableClickEvent) {
            e.stopImmediatePropagation();
            if (e.handled) {
                return;
            }
            e.handled = true;
            func.call(this, e);
        };

        if (arguments.length > 1) {
            func = arguments[1] instanceof Function ? arguments[1] : function() {};
            child = typeof arguments[0] === 'string' ? arguments[0] : '';
        } else {
            func = arguments[0] instanceof Function ? arguments[0] : function() {};
        }

        if (child) {
            $(this).on('click tab', child, handler);
        } else {
            $(this).on('click tab', handler);
        }
        return this;
    };

    return dom;
};

Entry.Dom = createEntryDom;
