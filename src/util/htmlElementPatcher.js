//add methods to HTMLElement prototype
((p) => {
    p.hasClass = function(className) {
        return $(this).hasClass(className);
    };

    p.addClass = function(...classes) {
        return _.head($(this).addClass(classes.filter(_.identity).join(' ')));
    };

    p.removeClass = function(...classes) {
        return _.head($(this).removeClass(classes.join(' ')));
    };

    p.text = function(str) {
        if (str) {
            this.textContent = str;
        }
        return this;
    };

    p.bindOnClick = function(func) {
        $(this).on('click tab', function(e) {
            if (this.disabled) {
                return;
            }
            func.call(this, e);
        });
        return this;
    };

    p.unBindOnClick = function() {
        $(this).off('click tab');
        return this;
    };

    p.appendTo = function(parent) {
        if (parent) {
            parent.appendChild(this);
        }
        return this;
    };
})(HTMLElement.prototype);
