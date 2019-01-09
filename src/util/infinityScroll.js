'use strict';

Entry.InfinityScroll = class InfinityScroll {
    constructor(dom = document.body, option = {}) {
        const { itemHeight, dataWrapper, data } = option;
        this.dom = dom;
        this._currGroup = -1;
        this.groupSize = 10;
        this.scrollTop = 0;
        this.data = data || [];
        this.eventData = [];
        this._itemHeight = itemHeight || 0;
        this.dataWrapper = dataWrapper;
        this.scroll = this.scroll.bind(this);
        dom.addEventListener('scroll', this.scroll);
    }

    get itemHeight() {
        if (!this._itemHeight && this.data.length) {
            this._itemHeight = this.convertElement(this.data[0]).offsetHeight;
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
        const shownDataCount = this.data.slice(0, (this.currGroup + 2) * this.groupSize).length;
        return (this.data.length - shownDataCount) * this.itemHeight;
    }

    get height() {
        return this.dom.offsetHeight || 1;
    }

    show() {
        const beforeSpace = /* html */ `<div style='height:${this.beforeHeight}px'></div>`;
        const afterSpace = /* html */ `<div style='height:${this.afterHeight}px'></div>`;
        const data = this.getData(this.currGroup);

        $(this.dom).empty();
        this.dom.innerHTML = this.convertDom(beforeSpace, this.wrap(data), afterSpace);
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
            return;
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

    convertDom(...items) {
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

    append(item, event) {
        this.data.push(item);
        this.eventData.push(event);
    }

    remove(index = this.data.length - 1) {
        this.data.splice(index, 1);
    }

    assignData(data) {
        delete this.data;
        this.data = data;
    }
};
