'use strict';

Entry.VirtualScroll = class VirtualScroll {
    constructor(dom = document.body, option = {}) {
        const { itemHeight, dataWrapper, data, groupSize } = option;
        this.dom = dom;
        this._currGroup = -1;
        this.scrollTop = 0;
        this.data = data || [];
        this.eventData = [];
        this._groupSize = groupSize;
        this._itemHeight = itemHeight || 0;
        this.dataWrapper = dataWrapper;
        this.scroll = this.scroll.bind(this);
        dom.addEventListener('scroll', _.throttle(this.scroll, 16));
    }

    get groupSize() {
        if (this._groupSize) {
            return this._groupSize;
        }
        if (this._itemHeight) {
            this._groupSize = parseInt((this.height / this._itemHeight) * 1.5, 10);
            return this._groupSize;
        }
        const itemMinHeight = 15;
        return Math.max(this.height / itemMinHeight, 1);
    }

    get itemHeight() {
        if (!this._itemHeight && this.data.length) {
            const dom = this.convertElement(this.wrap([this.data[0]]));
            this.dom.appendChild(dom);
            this._itemHeight = dom.offsetHeight;
            $(dom).remove();
        }
        return this._itemHeight || this.height;
    }

    get currGroup() {
        return parseInt(this.dom.scrollTop / this.groupHeight, 10);
    }

    get groupHeight() {
        return this.itemHeight * this.groupSize;
    }

    get beforeHeight() {
        return Math.max((this.currGroup - 1) * this.groupHeight, 0);
    }

    get afterHeight() {
        const dataLength = this.data.length;
        const shownDataCount = Math.min((this.currGroup + 2) * this.groupSize, dataLength);
        return (dataLength - shownDataCount) * this.itemHeight;
    }

    get height() {
        return this.dom.offsetHeight || 1;
    }

    show() {
        const beforeSpace = /* html */ `<div style='height:${this.beforeHeight}px'></div>`;
        const afterSpace = /* html */ `<div style='height:${this.afterHeight}px'></div>`;
        const data = this.getData(this.currGroup);

        $(this.dom).empty();
        this.dom.innerHTML = this.combineItems(beforeSpace, this.wrap(data), afterSpace);
    }

    scroll() {
        if (this.currGroup === this._currGroup) {
            return;
        }
        this._currGroup = this.currGroup;
        this.show();
    }

    wrap(data) {
        if (!this.dataWrapper) {
            return data;
        }
        return this.dataWrapper.replace(/\{(\d+)\}/g, this.arrayToString(data));
    }

    arrayToString(arr) {
        let st = '';
        arr.forEach((item) => {
            st += item;
        });
        return st;
    }

    getData(currGroup = -1) {
        if (currGroup === -1) {
            return this.data;
        }
        const startIndex = Math.max((currGroup - 1) * this.groupSize, 0);
        const endIndex = (currGroup + 2) * this.groupSize;
        return this.data.slice(startIndex, endIndex);
    }

    combineItems(...items) {
        let htmlText = '';
        items.forEach((item) => {
            if (item instanceof Array) {
                item.forEach((html) => {
                    htmlText += html;
                });
            } else if (typeof item === 'string') {
                htmlText += item;
            }
        });
        return htmlText;
    }

    convertElement(html) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        return wrapper.children[0];
    }

    append(item) {
        this.data.push(item);
    }

    remove(index = this.data.length - 1) {
        this.data.splice(index, 1);
    }

    assignData(data) {
        delete this.data;
        this.data = data;
    }
};
