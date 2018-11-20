'use strict';

Entry.Thread = function(thread, code, parent) {
    this.id = Entry.generateHash();
    this._data = new Entry.Collection();
    this._code = code;
    this.changeEvent = new Entry.Event(this);
    this.changeEvent.attach(this, this.handleChange);
    this._event = null;
    this.parent = parent ? parent : code;

    this.load(thread);
};

(function(p) {
    p.getId = function() {
        return this.id;
    };

    p.load = function(thread, mode) {
        if (thread === undefined || thread === null) {
            thread = [];
        }
        if (!(thread instanceof Array)) {
            return console.error('thread must be array');
        }

        for (let i = 0; i < thread.length; i++) {
            const block = thread[i];
            if (block instanceof Entry.Block || block.isDummy) {
                block.setThread(this);
                this._data.push(block);
            } else if (block instanceof Entry.Comment) {
                block.setThread(this);
                this._data.push(block);
            } else {
                this._data.push(new Entry.Block(block, this));
            }
        }

        const codeView = this._code.view;
        if (codeView) {
            this.createView(codeView.board, mode);
        }
        return this;
    };

    p.registerEvent = function(block, eventType) {
        this._event = eventType;
        this._code.registerEvent(block, eventType);
    };

    p.unregisterEvent = function(block, eventType) {
        this._code.unregisterEvent(block, eventType);
    };

    p.createView = function(board, mode) {
        if (!this.view) {
            this.view = new Entry.ThreadView(this, board);
        }
        this.getBlocks().forEach((b) => {
            let view;
            if (b.createView) {
                view = b.createView(board, mode);
            }
            return view;
        });
    };

    p.destroyView = function() {
        this.view = null;
        this._data.map((b) => {
            return b.destroyView();
        });
    };

    p.separate = function(block, count, index) {
        if (!this._data.has(block.id)) {
            return;
        }

        this._code.createThread(this._data.splice(this._data.indexOf(block), count), index);
        this.changeEvent.notify();
    };

    p.cut = function(block) {
        const splicedData = this._data.splice(this._data.indexOf(block));
        this.changeEvent.notify();
        return splicedData;
    };

    p.insertByBlock = function(block, newBlocks) {
        const index = block ? this._data.indexOf(block) : -1;
        for (let i = 0; i < newBlocks.length; i++) {
            newBlocks[i].setThread(this);
        }
        this._data.splice(...[index + 1, 0].concat(newBlocks));
        this.changeEvent.notify();
    };

    p.insertToTop = function(newBlock) {
        newBlock.setThread(this);
        this._data.unshift.apply(this._data, [newBlock]);
        this.changeEvent.notify();
    };

    p.clone = function(code, mode) {
        const newThread = new Entry.Thread([], code || this._code);
        return newThread.load(
            this.getBlocks().reduce((acc, block) => {
                return [...acc, block.clone(newThread)];
            }, []),
            mode
        );
    };

    p.toJSON = function(isNew, index = 0, excludeData, option) {
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
    };

    p.destroy = function(animate, isNotForce) {
        if (this.view) {
            this.view.destroy(animate);
        }

        this.getBlocks()
            .reverse()
            .forEach((block) => {
                return block.destroy(animate, null, isNotForce);
            });

        if (!this._data.length) {
            this._code.destroyThread(this, false);
        }
    };

    p.getBlock = function(index) {
        return this._data[index];
    };

    p.getBlocks = function() {
        return this._data.map(_.identity);
    };

    p.countBlock = function() {
        return this.getBlocks().reduce((count, block) => {
            if (!block.type) {
                return count;
            }

            count++;

            return (block.statements || []).reduce((count, statement) => {
                return (count += statement.countBlock());
            }, count);
        }, 0);
    };

    p.handleChange = function() {
        if (this._data.length === 0) {
            this.destroy();
        }
    };

    p.getCode = function() {
        return this._code;
    };

    p.setCode = function(code) {
        this._code = code;
    };

    p.spliceBlock = function(block) {
        this._data.remove(block);
        this.changeEvent.notify();
    };

    p.getFirstBlock = function() {
        return this._data[0];
    };

    p.getPrevBlock = function(block) {
        return this._data.at(this._data.indexOf(block) - 1);
    };

    p.getNextBlock = function(block) {
        return this._data.at(this._data.indexOf(block) + 1);
    };

    p.getLastBlock = function() {
        return this._data.at(this._data.length - 1);
    };

    p.getRootBlock = function() {
        return this._data.at(0);
    };

    p.hasBlockType = function(type) {
        for (let i = 0; i < this._data.length; i++) {
            if (inspectBlock(this._data[i])) {
                return true;
            }
        }
        return false;

        function inspectBlock(block) {
            if (type == block.type) {
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
    };

    p.getCount = function(startBlock) {
        let result = this._data.length;
        if (startBlock) {
            result -= this._data.indexOf(startBlock);
        }
        return result;
    };

    p.indexOf = function(block) {
        return this._data.indexOf(block);
    };

    p.pointer = function(pointer = [], block) {
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
    };

    p.getBlockList = function(excludePrimitive, type) {
        return _.chain(this._data)
            .map((block) => {
                if (block.constructor !== Entry.Block) {
                    return;
                }
                return block.getBlockList(excludePrimitive, type);
            })
            .flatten()
            .compact()
            .value();
    };

    p.stringify = function(excludeData) {
        return JSON.stringify(this.toJSON(undefined, undefined, excludeData));
    };

    p.isInOrigin = function() {
        const block = this.getFirstBlock();
        return block && block.isInOrigin();
    };

    p.getDom = function(query) {
        const view = this.view;

        if (_.isEmpty(query)) {
            return view.svgGroup;
        }

        query = [...query];

        const key = query.shift();
        if (key === 'magnet') {
            return view.getMagnet('next');
        }
    };

    p.isParamBlockType = function() {
        return false;
    };

    p.isGlobal = function() {
        return this._code === this.parent;
    };
})(Entry.Thread.prototype);
