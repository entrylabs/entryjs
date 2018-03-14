'use strict';

module.exports = {
    createTooltip(title, content, target, callback, option = {}) {
        return new Entry.Tooltip(
            [
                {
                    title,
                    content,
                    target,
                },
            ],
            Object.assign(
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                },
                option
            )
        );
    },
    returnEmptyArr() {
        return [];
    },
};
