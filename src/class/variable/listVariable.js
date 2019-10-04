import Variable from './variable';
import { GEHelper } from '../../graphicEngine/GEHelper';
import { GEDragHelper } from '../../graphicEngine/GEDragHelper';

class ListVariable extends Variable {
    constructor(variable) {
        Entry.assert(variable.variableType === 'list', 'Invalid variable type given');
        super(variable);
        this.array_ = variable.array ? variable.array : [];

        if (!variable.isClone) {
            this.width_ = variable.width ? variable.width : 100;
            this.height_ = variable.height ? variable.height : 120;
            this.scrollPosition = 0;
        }
    }

    generateView(variableIndex) {
        this.view_ = GEHelper.newContainer();
        this.rect_ = GEHelper.newGraphic();
        this.view_.addChild(this.rect_);
        this.view_.variable = this;
        this.view_.visible = this.visible_;
        this.view_.mouseEnabled = true;
        this.view_.mouseChildren = true;
        GEDragHelper.handleDrag(this.view_);

        this.titleView_ = GEHelper.textHelper.newText(
            '',
            this.FONT,
            '#000000',
            'alphabetic',
            'center'
        );

        //todo [박봉배] textview_.width 를 $width 로 변경.
        this.titleView_.$width = this.width_ - 2 * this.BORDER;
        if (GEHelper.isWebGL) {
            this.titleView_.x = (this.width_ - this.titleView_.width) / 2;
            this.titleView_.y = this.BORDER - 1;
        } else {
            this.titleView_.x = this.width_ / 2;
            this.titleView_.y = this.BORDER + 11;
        }
        this.view_.addChild(this.titleView_);
        const { stage_list_resize_handle } = EntryStatic.images || {};
        this.resizeHandle_ = GEHelper.newSpriteWithCallback(
            stage_list_resize_handle || `${Entry.mediaFilePath}stage_list_resize_handle.png`,
            () => {
                Entry.requestUpdate = true;
            }
        );
        this.resizeHandle_.mouseEnabled = true;
        this.resizeHandle_.scaleX = 0.7;
        this.resizeHandle_.scaleY = 0.7;
        this.view_.addChild(this.resizeHandle_);

        this.resizeHandle_.list = this;

        GEDragHelper.handleDrag(this.resizeHandle_);
        this.resizeHandle_.on(GEDragHelper.types.OVER, function() {
            this.cursor = 'nwse-resize';
        });

        this.resizeHandle_.on(GEDragHelper.types.DOWN, function(evt) {
            // if(Entry.type != 'workspace') return;
            this.list.isResizing = true;
            this.offset = {
                x: evt.stageX * 0.75 - this.list.getWidth(),
                y: evt.stageY * 0.75 - this.list.getHeight(),
            };
            this.parent.cursor = 'nwse-resize';
        });
        this.resizeHandle_.on(GEDragHelper.types.MOVE, function(evt) {
            // if(Entry.type != 'workspace') return;
            this.list.setWidth(evt.stageX * 0.75 - this.offset.x);
            this.list.setHeight(evt.stageY * 0.75 - this.offset.y);
            this.list.updateView();
        });

        this.view_.on(GEDragHelper.types.OVER, function() {
            this.cursor = 'move';
        });

        this.view_.on(GEDragHelper.types.DOWN, function(evt) {
            if (Entry.type !== 'workspace' || this.variable.isResizing) {
                return;
            }
            this.offset = {
                x: this.x - (evt.stageX * 0.75 - 240),
                y: this.y - (evt.stageY * 0.75 - 135),
            };
            this.cursor = 'move';
        });

        this.view_.on(GEDragHelper.types.UP, function() {
            this.cursor = 'initial';
            this.variable.isResizing = false;
        });

        this.view_.on(GEDragHelper.types.MOVE, function(evt) {
            if (Entry.type !== 'workspace' || this.variable.isResizing) {
                return;
            }
            this.variable.setX(evt.stageX * 0.75 - 240 + this.offset.x);
            this.variable.setY(evt.stageY * 0.75 - 135 + this.offset.y);
            this.variable.updateView();
        });

        //todo [박봉배] 아래줄 삭제 하는게 맞겠죠? 리스트 아이템인데, 생성을 아래쪽에서 함.
        //this.elementView = this._createListElementView();
        this.scrollButton_ = GEHelper.newGraphic();
        this.scrollButton_.mouseEnabled = true;
        this.scrollButton_.cursor = 'pointer';
        GEDragHelper.handleDrag(this.scrollButton_);
        this.scrollButton_.graphics.f('#aaaaaa').rr(0, 0, 7, 30, 3.5);
        this.view_.addChild(this.scrollButton_);
        this.scrollButton_.y = 25;

        this.scrollButton_.list = this;
        this.scrollButton_.on(GEDragHelper.types.DOWN, function(evt) {
            // if(Entry.type != 'workspace') return;
            this.list.isResizing = true;
            this.offsetY = evt.stageY - this.y / 0.75;
        });
        this.scrollButton_.on(GEDragHelper.types.MOVE, function(evt) {
            // if(Entry.type != 'workspace') return;

            const stageY = evt.stageY;
            let yPos = (stageY - this.offsetY) * 0.75;
            const min = 25;
            const max = this.list.getHeight() - 30;
            if (yPos < min) {
                yPos = min;
            }
            if (yPos > max) {
                yPos = max;
            }
            this.y = yPos;
            this.list.updateView();
        });

        if (this.getX() && this.getY()) {
            this.setX(this.getX());
            this.setY(this.getY());
        } else {
            const listLength = Entry.variableContainer.lists_.length;
            this.setX(-Math.floor((listLength % 24) / 6) * 110 + 120);
            this.setY(variableIndex * 24 + 20 - 135 - Math.floor(listLength / 6) * 145);
        }

        this.setVisible(this.isVisible());
        Entry.stage.loadVariable(this);
    }

    getArray() {
        if (!this.isCloud_) {
            return this.array_;
        } else {
            const { array } =
                this.cloudVariable.get({
                    variableType: this.type,
                    id: this.id_,
                }) || {};
            return array || this.array_;
        }
    }

    appendValue(value) {
        if (!this.isCloud_) {
            if (!this.array_) {
                this.array_ = [];
            }
            this.array_.push({
                data: value,
            });
            this.updateView();
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const target = {
                        variableType: this.type,
                        id: this.id_,
                    };
                    await this.cloudVariable.append(target, value);
                    const { array } = this.cloudVariable.get(target);
                    this.array_ = array;
                    this.updateView();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }

    deleteValue(index) {
        if (!this.isCloud_) {
            this.array_.splice(index - 1, 1);
            this.updateView();
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const target = {
                        variableType: this.type,
                        id: this.id_,
                    };
                    await this.cloudVariable.delete(target, index);
                    const { array } = this.cloudVariable.get(target);
                    this.array_ = array;
                    this.updateView();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }

    insertValue(index, data) {
        if (!this.isCloud_) {
            this.array.splice(index - 1, 0, { data });
            this.updateView();
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const target = {
                        variableType: this.type,
                        id: this.id_,
                    };
                    await this.cloudVariable.insert(target, index - 1, data);
                    const { array } = this.cloudVariable.get(target);
                    this.array_ = array;
                    this.updateView();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }

    replaceValue(index, data) {
        if (!this.isCloud_) {
            this.array_[index - 1].data = data;
            this.updateView();
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const target = {
                        variableType: this.type,
                        id: this.id_,
                    };
                    await this.cloudVariable.replace(target, index - 1, data);
                    const { array } = this.cloudVariable.get(target);
                    this.array_ = array;
                    this.updateView();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }

    updateView() {
        if (!this.view_) {
            return;
        }

        if (this.isVisible()) {
            this._adjustSingleViewPosition();
            this.resizeHandle_.x = this.width_ - 10;
            this.resizeHandle_.y = this.height_ + 16 - 10;
            const arr = this.getArray();

            let name = this.getName();
            if (this.object_) {
                const obj = Entry.container.getObject(this.object_);
                if (obj) {
                    name = `${obj.name}:${name}`;
                }
            }

            this.titleView_.text = name;
            if (this.titleView_.getMeasuredWidth() > this.width_) {
                name = `${name}..`;
                while (this.titleView_.getMeasuredWidth() > this.width_) {
                    name = `${name.substr(0, name.length - 3)}..`;
                    this.titleView_.text = name;
                }
            }
            if (GEHelper.isWebGL) {
                this.titleView_.x = (this.width_ - this.titleView_.width) / 2 + 3;
            } else {
                this.titleView_.x = this.width_ / 2 + 3;
            }
            const colorSet = EntryStatic.colorSet.canvas || {};
            this.rect_.graphics
                .clear()
                .f('#ffffff')
                .ss(1, 2, 0)
                .s(colorSet.border || '#aac5d5')
                .rr(0, 0, this.width_ + 7, this.height_ + 22, this.RECT_RADIUS);

            let listChild;
            while ((listChild = this.view_.children[4])) {
                this.view_.removeChild(listChild);
                listChild.destroy && listChild.destroy();
            }
            const maxView = Math.floor((this.getHeight() - 15) / 20);

            const isOverFlow = maxView < arr.length;
            const totalWidth = this.getWidth();
            let wrapperWidth = totalWidth - 2 * this.BORDER - (isOverFlow ? 30 : 20);

            if (isOverFlow) {
                if (this.scrollButton_.y > this.getHeight() - 30) {
                    this.scrollButton_.y = this.getHeight() - 30;
                }
                //todo [박봉배] _createListElementView 로 코드 이동
                // this.elementView.valueWrapper.graphics
                //     .clear()
                //     .f('#1bafea')
                //     .rr(20, -2, wrapperWidth, 17, 2);
                this.scrollButton_.x = totalWidth - 6;
                this.scrollPosition = Math.floor(
                    ((this.scrollButton_.y - 23) / (this.getHeight() - 23 - 30)) *
                        (arr.length - maxView)
                );
            } else {
                //todo [박봉배] _createListElementView 로 코드 이동
                // this.elementView.valueWrapper.graphics
                //     .clear()
                //     .f('#1bafea')
                //     .rr(20, -2, wrapperWidth, 17, 2);
                this.scrollPosition = 0;
            }
            this.scrollButton_.visible = isOverFlow;

            const _cache = {};
            //because of min Width of list
            //maxLen can not be under 3
            //so start from 3
            let maxLen = 3;
            wrapperWidth -= 6;

            for (
                let i = this.scrollPosition;
                i < this.scrollPosition + maxView && i < arr.length;
                i++
            ) {
                this.elementView = this._createListElementView(wrapperWidth + 14);
                if (
                    Entry.getMainWS() &&
                    Entry.getMainWS().getMode() === Entry.Workspace.MODE_VIMBOARD
                ) {
                    this.elementView.indexView.text = i;
                } else {
                    this.elementView.indexView.text = i + 1;
                }

                const text = String(arr[i].data);
                const valueView = this.elementView.valueView;
                const cachedText = _cache[text.substr(0, 150)];

                if (cachedText) {
                    valueView.text = cachedText;
                } else {
                    let execText = text.substr(0, maxLen);
                    let charIndex = maxLen;

                    valueView.text = text;

                    if (valueView.getMeasuredWidth() > wrapperWidth) {
                        valueView.text = execText;

                        while (
                            valueView.getMeasuredWidth() < wrapperWidth &&
                            text[charIndex] !== undefined
                        ) {
                            execText += text[charIndex++];
                            valueView.text = execText;
                        }

                        let subCnt = 1;
                        while (valueView.getMeasuredWidth() > wrapperWidth) {
                            execText = `${execText.substr(0, execText.length - subCnt)}..`;
                            valueView.text = execText;
                            subCnt = 3;
                        }
                    } else {
                        execText = text;
                    }

                    _cache[text.substr(0, 150)] = execText;
                    maxLen = Math.max(execText.length, maxLen);
                }

                this.elementView.y = (i - this.scrollPosition) * 20 + 23;
                this.view_.addChild(this.elementView);
            }
        }

        Entry.requestUpdate = true;
    }

    _createListElementView(wrapperWidth) {
        const elementView = GEHelper.newContainer();
        const indexView = GEHelper.textHelper.newText('', this.FONT, '#000000', 'middle');
        const colorSet = EntryStatic.colorSet.canvas || {};
        if (GEHelper.isWebGL) {
            indexView.y = this.GL_LIST_POS.INDEX_Y;
        } else {
            indexView.y = 12;
        }
        elementView.addChild(indexView);
        elementView.indexView = indexView;
        const valueWrapper = GEHelper.newGraphic();
        elementView.addChild(valueWrapper);
        elementView.valueWrapper = valueWrapper;
        elementView.valueWrapper.graphics
            .clear()
            .f(colorSet.list || '#4f80ff')
            .rr(18, 4, wrapperWidth, 17, 2);

        const valueView = GEHelper.textHelper.newText('', this.VALUE_FONT, '#ffffff', 'middle');
        valueView.x = 24;
        if (GEHelper.isWebGL) {
            valueView.y = this.GL_LIST_POS.VALUE_Y;
        } else {
            valueView.y = 12;
        }
        elementView.addChild(valueView);
        elementView.valueView = valueView;
        elementView.x = this.BORDER;

        return elementView;
    }

    syncModel_(variableModel) {
        if (!this.isCloud_) {
            this.array_ = variableModel.array;
        }
        this.setWidth(variableModel.width);
        this.setHeight(variableModel.height);
        super.syncModel_(variableModel);
    }

    toJSON() {
        const json = super.toJSON();
        json.width = this.getWidth();
        json.height = this.getHeight();
        json.array = JSON.parse(JSON.stringify(this.getArray()));

        return json;
    }
}

export default ListVariable;
