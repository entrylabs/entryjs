'use strict';

Entry.Thread = class Thread {
    constructor(thread, code, parent) {
        this.id = Entry.generateHash();
        this._data = new Entry.Collection();
        this._code = code;
        this.changeEvent = new Entry.Event(this);
        this.changeEvent.attach(this, this.handleChange);
        this._event = null;
        this.parent = parent ? parent : code;

        this.load(thread);
    }

    getId() {
        return this.id;
    }

    load(thread = [], mode) {
        if (!(thread instanceof Array)) {
            return console.error('thread must be array');
        }

        for (let i = 0; i < thread.length; i++) {
            const block = thread[i];
            if (block instanceof Entry.Block || block instanceof Entry.Comment || block.isDummy) {
                block.setThread(this);
                this._data.push(block);
            } else if (block.type === 'comment') {
                const commment = new Entry.Comment(block);
                commment.setThread(this);
                this._data.push(commment);
            } else {
                this._data.push(new Entry.Block(block, this));
            }
        }

        const codeView = this._code.view;
        if (codeView) {
            this.createView(codeView.board, mode);
        }
        return this;
    }

    registerEvent(block, eventType) {
        this._event = eventType;
        this._code.registerEvent(block, eventType);
    }

    unregisterEvent(block, eventType) {
        this._code.unregisterEvent(block, eventType);
    }

    createView(board, mode) {
        if (!this.view) {
            this.view = new Entry.ThreadView(this, board);
        }
        this.getBlocks().forEach((b) => {
            let view;
            if (b.createView) {
                view = b.createView(board, mode);
            } else if (b.createComment) {
                view = b.createComment(board);
            }
            return view;
        });
    }

    destroyView() {
        this.view = null;
        this._data.map((b) => b.destroyView());
    }

    separate(block, count, index) {
        if (!this._data.has(block.id)) {
            return;
        }

        this._code.createThread(this._data.splice(this._data.indexOf(block), count), index);
        this.changeEvent.notify();
    }

    cut(block) {
        const splicedData = this._data.splice(this._data.indexOf(block));
        this.changeEvent.notify();
        return splicedData;
    }

    insertByBlock(block, newBlocks) {
        const index = block ? this._data.indexOf(block) : -1;
        for (let i = 0; i < newBlocks.length; i++) {
            newBlocks[i].setThread(this);
        }
        this._data.splice(...[index + 1, 0].concat(newBlocks));
        this.changeEvent.notify();
    }

    insertToTop(newBlock) {
        newBlock.setThread(this);
        this._data.unshift.apply(this._data, [newBlock]);
        this.changeEvent.notify();
    }

    clone(code, mode) {
        const newThread = new Entry.Thread([], code || this._code);
        return newThread.load(
            this.getBlocks().reduce((acc, block) => [...acc, block.clone(newThread)], []),
            mode
        );
    }

    toJSON(isNew, index = 0, excludeData, option) {
        if (index instanceof Entry.Block) {
            index = this.indexOf(index);
        }

        const array = [];
        const data = this._data;
        for (index; index < data.length; index++) {
            const block = data[index];
            if (block instanceof Entry.Block) {
                array.push(block.toJSON(isNew, excludeData, option));
            } else if (block instanceof Entry.Comment) {
                array.push(block.toJSON());
            }
        }
        return array;
    }

    destroy(animate, isNotForce) {
        if (this.view) {
            this.view.destroy(animate);
        }

        this.getBlocks()
            .reverse()
            .forEach((block) => block.destroy(animate, null, isNotForce));

        if (!this._data.length) {
            this._code.destroyThread(this, false);
        }
    }

    getBlock(index) {
        return this._data[index];
    }

    getBlocks() {
        return this._data.map(_.identity);
    }

    countBlock() {
        return this.getBlocks().reduce((count, block) => {
            if (!block.type) {
                return count;
            }

            count++;

            return (block.statements || []).reduce(
                (count, statement) => (count += statement.countBlock()),
                count
            );
        }, 0);
    }

    handleChange() {
        if (this._data.length === 0) {
            this.destroy();
        }
    }

    getCode() {
        return this._code;
    }

    setCode(code) {
        this._code = code;
    }

    spliceBlock(block) {
        this._data.remove(block);
        this.changeEvent.notify();
    }

    getFirstBlock() {
        return this._data[0];
    }

    getPrevBlock(block) {
        return this._data.at(this._data.indexOf(block) - 1);
    }

    getNextBlock(block) {
        return this._data.at(this._data.indexOf(block) + 1);
    }

    getLastBlock() {
        return this._data.at(this._data.length - 1);
    }

    getRootBlock() {
        return this._data.at(0);
    }

    hasBlockType(type) {
        for (let i = 0; i < this._data.length; i++) {
            if (inspectBlock(this._data[i])) {
                return true;
            }
        }
        return false;

        function inspectBlock(block) {
            if (Array.isArray(type) && type.includes(block.type)) {
                return true;
            } else if (type === block.type) {
                return true;
            }

            const params = block.params;
            for (let k = 0; k < params.length; k++) {
                const param = params[k];
                if (param && param.constructor == Entry.Block) {
                    if (inspectBlock(param)) {
                        return true;
                    }
                }
            }
            const statements = block.statements;
            if (statements) {
                for (let j = 0; j < statements.length; j++) {
                    if (statements[j].hasBlockType(type)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    getCount(startBlock) {
        let result = this._data.length;
        if (startBlock) {
            result -= this._data.indexOf(startBlock);
        }
        return result;
    }

    indexOf(block) {
        return this._data.indexOf(block);
    }

    pointer(pointer = [], block) {
        if (block) {
            pointer.unshift(this.indexOf(block));
        }

        const parent = this.parent;

        if (parent instanceof Entry.Block) {
            pointer.unshift(parent.indexOfStatements(this));
        }

        if (this._code === parent) {
            const { x, y } = this._data[0];
            return [x, y, this._code.indexOf(this), ...pointer];
        }

        return parent.pointer(pointer);
    }

    getBlockIndex(block) {
        return this.getBlocks().indexOf(block);
    }

    getBlockList(excludePrimitive, type, index) {
        return _.chain(this._data)
            .map((block) => {
                if (block.constructor !== Entry.Block) {
                    return;
                }
                if (Array.isArray(type)) {
                    return type.reduce(
                        (acc, type) => acc.concat(block.getBlockList(excludePrimitive, type)),
                        []
                    );
                } else {
                    return block.getBlockList(excludePrimitive, type);
                }
            })
            .flatten()
            .compact()
            .value();
    }

    stringify(excludeData, isNew, index) {
        return JSON.stringify(this.toJSON(isNew, index, excludeData));
    }

    isInOrigin() {
        const block = this.getFirstBlock();
        return block && block.isInOrigin();
    }

    getDom(query) {
        const view = this.view;

        if (_.isEmpty(query)) {
            return view.svgGroup;
        }

        query = [...query];

        const key = query.shift();
        if (key === 'magnet') {
            return view.getMagnet('next');
        }
    }

    isParamBlockType() {
        return false;
    }

    isGlobal() {
        return this._code === this.parent;
    }

    hasData() {
        return Boolean(this._data.length);
    }
};
