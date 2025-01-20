'use strict';

Entry.Restrictor = class Restrictor {
    constructor(controller) {
        this._controller = controller;
        this.startEvent = new Entry.Event(this);
        this.endEvent = new Entry.Event(this);

        Entry.Curtain.init(controller && controller.isRestrictorCloseable);

        this.currentTooltip = null;
    }
    restrict(data, toolTipRender) {
        this._data = data;
        Entry.expectedAction = data.content.concat();
        this.toolTipRender = toolTipRender;

        this.end();

        const log = data.content.concat();
        const commandType = log.shift();
        const command = Entry.Command[commandType];

        let domQuery = command.dom;
        this.startEvent.notify();
        if (domQuery instanceof Array) {
            domQuery = this.processDomQuery(domQuery);
        }

        if (!data.tooltip) {
            data.tooltip = {
                title: '액션',
                content: '지시 사항을 따르시오',
            };
        }

        if (command.restrict) {
            this.currentTooltip = command.restrict(
                data,
                domQuery,
                this.restrictEnd.bind(this),
                this
            );
            return;
        } else {
            this.currentTooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    callBack: this.restrictEnd.bind(this),
                }
            );
            window.setTimeout(this.align.bind(this));
        }

        if (data.skip) {
            return this.end();
        }
    }

    end() {
        if (this.currentTooltip) {
            this.currentTooltip.dispose();
            this.currentTooltip = null;
        }
    }

    restrictEnd() {
        this.endEvent.notify();
    }

    align() {
        if (this.currentTooltip) {
            this.currentTooltip.alignTooltips();
        }
    }

    processDomQuery(domQuery, log) {
        log = log || this._data.content;
        log = log.concat();
        log.shift();
        if (domQuery instanceof Array) {
            domQuery = domQuery.map((q) => {
                if (q[0] === '&') {
                    return log[Number(q.substr(1))][1];
                } else {
                    return q;
                }
            });
        }
        return domQuery;
    }

    renderTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.render();
        }
    }

    fadeOutTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.fadeOut();
        }
    }

    fadeInTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.fadeIn();
        }
    }

    isTooltipFaded() {
        if (this.currentTooltip) {
            return this.currentTooltip.isFaded();
        }
        return false;
    }

    requestNextData() {
        if (this._controller) {
            return this._controller.requestNextData();
        }
    }
};
