/**
 * @fileoverview entity object is class for entry object canvas view.
 */
'use strict';

/**
 * Construct entity class
 * @param {!Entry.EntryObject} object
 * @constructor
 */
Entry.EntityObject = class EntityObject {
    constructor(object) {
        /** @type {!string} */
        this.parent = object;
        this.type = object.objectType;
        /** @type {Array<xml script>} */
        this.flip = false;
        this.collision = Entry.Utils.COLLISION.NONE;
        this.id = Entry.generateHash();
        this.removed = false;
        this.stamps = [];
        this.shapes = [];

        if (this.type === 'sprite') {
            this.object = new createjs.Bitmap();
            this.setInitialEffectValue();
        } else if (this.type === 'textBox') {
            this.object = new createjs.Container();
            this.textObject = new createjs.Text();
            this.textObject.font = '20px Nanum Gothic';
            this.textObject.textBaseline = 'middle';
            this.textObject.textAlign = 'center';
            this.bgObject = new createjs.Shape();
            this.bgObject.graphics
                .setStrokeStyle(1)
                .beginStroke('#f00')
                .drawRect(0, 0, 100, 100);
            this.object.addChild(this.bgObject);
            this.object.addChild(this.textObject);

            this.fontType = 'NanumGothic';
            this.fontSize = 20;
            this.fontBold = false;
            this.fontItalic = false;
            this.underLine = false;
            this.strike = false;
        }

        this.object.entity = this;
        this.object.cursor = 'pointer';

        this.object.on('mousedown', function({ stageX, stageY }) {
            const id = this.entity.parent.id;
            Entry.dispatchEvent('entityClick', this.entity);
            Entry.stage.isObjectClick = true;

            if (Entry.type != 'minimize' && Entry.stage.isEntitySelectable()) {
                this.offset = {
                    x: -this.parent.x + this.entity.getX() - (stageX * 0.75 - 240),
                    y: -this.parent.y - this.entity.getY() - (stageY * 0.75 - 135),
                };
                this.cursor = 'move';
                this.entity.initCommand();
                Entry.container.selectObject(id);
            }
        });

        this.object.on('pressup', function() {
            Entry.dispatchEvent('entityClickCanceled', this.entity);
            this.cursor = 'pointer';
            this.entity.checkCommand();
        });

        if (Entry.type !== 'minimize') {
            this.object.on('pressmove', function({ stageX, stageY }) {
                if (Entry.stage.isEntitySelectable()) {
                    const entity = this.entity;
                    if (entity.parent.getLock()) {
                        return;
                    }
                    entity.setX(stageX * 0.75 - 240 + this.offset.x);
                    entity.setY(-(stageY * 0.75 - 135) - this.offset.y);
                    Entry.stage.updateObject();
                }
            });
        }
    }

    /**
     * Construct entity class
     * @param {?picture model} pictureModel
     * @param {?entity model} entityModel
     * @constructor
     */
    injectModel(pictureModel, entityModel) {
        const type = this.type;
        if (type === 'sprite') {
            this.setImage(pictureModel);
        } else if (type === 'textBox') {
            const parent = this.parent;
            entityModel.text = entityModel.text || parent.text || parent.name;
            this.setFont(entityModel.font);
            this.setBGColour(entityModel.bgColor);
            this.setColour(entityModel.colour);
            this.setUnderLine(entityModel.underLine);
            this.setStrike(entityModel.strike);
            this.setText(entityModel.text);
        }

        //entity
        if (entityModel) {
            this.syncModel_(entityModel);
        }
    }

    /**
     * sync this model with parameter
     * @param {!entity model} entityModel
     * @private
     */
    syncModel_({
        x,
        y,
        regX,
        regY,
        scaleX,
        scaleY,
        rotation,
        direction,
        lineBreak,
        width,
        height,
        text,
        textAlign,
        fontSize,
        visible,
    }) {
        this.setX(x);
        this.setY(y);
        this.setRegX(regX);
        this.setRegY(regY);
        this.setScaleX(scaleX);
        this.setScaleY(scaleY);
        this.setRotation(rotation);
        this.setDirection(direction, true);
        this.setLineBreak(lineBreak);
        this.setWidth(width);
        this.setHeight(height);
        this.setText(text);
        this.setTextAlign(textAlign);
        this.setFontSize(fontSize || this.getFontSize());
        this.setVisible(visible);
    }

    initCommand() {
        if (!Entry.engine.isState('stop')) {
            return;
        }

        this._entityModelBefore = this.toJSON();
    }

    checkCommand() {
        if (!Entry.engine.isState('stop')) {
            return;
        }

        const oldModel = this._entityModelBefore;
        delete this._entityModelBefore;
        const json = this.toJSON();

        if (_.isEqual(json, oldModel)) {
            return;
        }

        Entry.do('entitySetModel', this.parent.id, json, oldModel);
    }

    /**
     * for redo and undo
     * @param {!entity model} entityModel
     * @return {Entry.State} capture current state
     */
    setModel(entityModel) {
        this.syncModel_(entityModel);
        Entry.dispatchEvent('updateObject');
        Entry.stage.updateObject();
    }

    /**
     * X coordinate setter
     * @param {number} x
     */
    setX(x) {
        if (typeof x !== 'number') {
            return;
        }

        /** @type {number} */
        this.x = x;
        this.object.x = this.x;
        !this.isClone && this.parent.updateCoordinateView();
        this.updateDialog();
        Entry.requestUpdate = true;
    }

    /**
     * X coordinate getter
     * @return {number}
     */
    getX(toFixedValue) {
        if (toFixedValue) {
            return Entry.Utils.toFixed(this.x, toFixedValue);
        } else {
            return this.x;
        }
    }

    /**
     * Y coordinate setter
     * @param {number} y
     */
    setY(y) {
        if (typeof y !== 'number') {
            return;
        }

        /** @type {number} */
        this.y = y;
        this.object.y = -this.y;
        !this.isClone && this.parent.updateCoordinateView();
        this.updateDialog();
        Entry.requestUpdate = true;
    }

    /**
     * Y coordinate getter
     * @return {number}
     */
    getY(toFixedValue) {
        if (toFixedValue) {
            return Entry.Utils.toFixed(this.y, toFixedValue);
        } else {
            return this.y;
        }
    }

    /**
     * direction getter
     * @return {number}
     */
    getDirection(toFixedValue) {
        if (toFixedValue) {
            return Entry.Utils.toFixed(this.direction, toFixedValue);
        } else {
            return this.direction;
        }
    }

    /**
     * direction setter
     * @param {number} direction
     * @param {boolean} flippable
     */
    setDirection(direction = 0, flippable) {
        direction = direction % 360;
        const parent = this.parent;

        if (parent.getRotateMethod() === 'vertical' && !flippable) {
            const previousIsRight = this.direction >= 0 && this.direction < 180;
            const afterIsRight = direction >= 0 && direction < 180;
            if (previousIsRight != afterIsRight) {
                this.setScaleX(-this.getScaleX());
                Entry.stage.updateObject();
                this.flip = !this.flip;
            }
        }
        /** @type {number} */
        this.direction = direction.mod(360);
        this.object.direction = this.direction;
        !this.isClone && parent.updateRotationView();
        Entry.dispatchEvent('updateObject');
        Entry.requestUpdate = true;
    }

    /**
     * rotation setter
     * @param {number} rotation
     * */
    setRotation(rotation) {
        /** @type {number} */
        if (this.parent.getRotateMethod() !== 'free') {
            rotation = 0;
        }

        this.rotation = rotation.mod(360);
        this.object.rotation = this.rotation;
        this.updateDialog();
        !this.isClone && this.parent.updateRotationView();
        Entry.dispatchEvent('updateObject');
        Entry.requestUpdate = true;
    }

    /**
     * rotation getter
     * @return {number}
     */
    getRotation(toFixedValue) {
        if (toFixedValue) {
            return Entry.Utils.toFixed(this.rotation, toFixedValue);
        } else {
            return this.rotation;
        }
    }

    /**
     * regX coordinate setter
     * @param {number} regX
     */
    setRegX(regX) {
        if (this.type === 'textBox') {
            regX = 0;
        }
        /** @type {number} */
        this.regX = regX;
        this.object.regX = this.regX;
        Entry.requestUpdate = true;
    }

    /**
     * regX coordinate getter
     * @return {number}
     */
    getRegX() {
        return this.regX;
    }

    /**
     * regY coordinate setter
     * @param {number} regY
     */
    setRegY(regY) {
        if (this.type === 'textBox') {
            regY = 0;
        }
        /** @type {number} */
        this.regY = regY;
        this.object.regY = this.regY;
        Entry.requestUpdate = true;
    }

    /**
     * regY coordinate getter
     * @return {number}
     */
    getRegY() {
        return this.regY;
    }

    /**
     * scaleX coordinate setter
     * @param {number} scaleX
     */
    setScaleX(scaleX) {
        /** @type {number} */
        this.scaleX = scaleX;
        this.object.scaleX = this.scaleX;
        this.parent.updateCoordinateView();
        this.updateDialog();
        Entry.requestUpdate = true;
    }

    /**
     * scaleX coordinate getter
     * @return {number}
     */
    getScaleX() {
        return this.scaleX;
    }

    /**
     * scaleY coordinate setter
     * @param {number} scaleY
     */
    setScaleY(scaleY) {
        /** @type {number} */
        this.scaleY = scaleY;
        this.object.scaleY = this.scaleY;
        this.parent.updateCoordinateView();
        this.updateDialog();
        Entry.requestUpdate = true;
    }

    /**
     * scaleY coordinate getter
     * @return {number}
     */
    getScaleY() {
        return this.scaleY;
    }

    /**
     * object size setter
     * @param {number} size
     */
    setSize(size) {
        const scale = Math.max(1, size) / this.getSize();
        this.setScaleX(this.getScaleX() * scale);
        this.setScaleY(this.getScaleY() * scale);
        !this.isClone && this.parent.updateCoordinateView();
        Entry.requestUpdate = true;
    }

    /**
     * get object size
     * @return {number}
     */
    getSize(toFixedValue) {
        const value =
            (this.getWidth() * Math.abs(this.getScaleX()) +
                this.getHeight() * Math.abs(this.getScaleY())) /
            2;
        if (toFixedValue) {
            return Entry.Utils.toFixed(value, toFixedValue);
        }
        return value;
    }

    /**
     * width coordinate setter
     * @param {number} width
     */
    setWidth(width) {
        /** @type {number} */
        this.width = width;
        this.object.width = this.width;
        if (this.textObject && this.getLineBreak()) {
            this.textObject.lineWidth = this.width;
        }
        this.updateDialog();
        this.updateBG();
        Entry.requestUpdate = true;
    }

    /**
     * width coordinate getter
     * @return {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * height coordinate setter
     * @param {number} height
     */
    setHeight(height) {
        /** @type {number} */
        this.height = height;
        if (this.textObject) {
            this.object.height = this.height;
            this.alignTextBox();
        }
        this.updateDialog();
        this.updateBG();
        Entry.requestUpdate = true;
    }

    /**
     * height coordinate getter
     * @return {number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * colour setter
     * @param {?string} colour
     */
    setColour(colour = '#000000') {
        /** @type {string} */
        this.colour = colour;
        if (this.textObject) {
            this.textObject.color = this.colour;
        }
        Entry.requestUpdate = true;
    }

    /**
     * colour getter
     * @return {colour}
     */
    getColour() {
        return this.colour;
    }

    /**
     * BG colour setter, for textBox object
     * @param {?string} colour
     */
    setBGColour(colour = 'transparent') {
        /** @type {string} */
        this.bgColor = colour;
        this.updateBG();
        //this.object.color = this.colour;
        Entry.requestUpdate = true;
    }

    /**
     * BG colour getter, for textBox object
     * @return {colour}
     */
    getBGColour() {
        return this.bgColor;
    }

    setUnderLine(underLine = false) {
        this.underLine = underLine;
        this.textObject.underLine = underLine;
        Entry.requestUpdate = true;
    }

    getUnderLine() {
        return this.underLine;
    }

    setStrike(strike = false) {
        this.strike = strike;
        this.textObject.strike = strike;
        Entry.requestUpdate = true;
    }

    getStrike() {
        return this.strike;
    }

    /**
     * font getter
     */
    getFont() {
        const fontArray = [];
        if (this.fontBold) {
            fontArray.push('bold');
        }
        if (this.fontItalic) {
            fontArray.push('italic');
        }
        fontArray.push(`${this.getFontSize()}px`);
        fontArray.push(this.fontType);
        return fontArray.join(' ');
    }

    /**
     * font setter
     */
    setFont(font = '20px Nanum Gothic') {
        if (this.parent.objectType !== 'textBox') {
            return;
        }
        if (this.textObject.font === font) {
            return;
        }

        const fontArray = font.split(' ');
        let i = 0;

        if ((i = fontArray.indexOf('bold') > -1)) {
            fontArray.splice(i - 1, 1);
            this.setFontBold(true);
        }
        if ((i = fontArray.indexOf('italic') > -1)) {
            fontArray.splice(i - 1, 1);
            this.setFontItalic(true);
        }
        this.setFontSize(parseInt(fontArray.shift()));
        this.setFontType(fontArray.join(' '));

        this.textObject.font = this.getFont();
        Entry.stage.update();
        this.setWidth(this.textObject.getMeasuredWidth());
        this.updateBG();
        Entry.stage.updateObject();
    }

    setLineHeight() {
        switch (this.getFontType()) {
            case 'Nanum Gothic Coding': {
                this.textObject.lineHeight = this.fontSize;
                break;
            }
            default: {
                this.textObject.lineHeight = 0;
                break;
            }
        }
    }

    syncFont() {
        const textObject = this.textObject;
        textObject.font = this.getFont();
        this.setLineHeight();
        Entry.stage.update();
        if (this.getLineBreak()) {
            if (this.fontType === 'Nanum Gothic Coding') {
                textObject.y = textObject.getMeasuredLineHeight() / 2 - this.getHeight() / 2 + 10;
            }
        } else {
            this.setWidth(textObject.getMeasuredWidth());
            this.setHeight(textObject.getMeasuredHeight());
        }
        Entry.stage.updateObject();
        Entry.requestUpdate = true;
    }

    /**
     * font type getter
     */
    getFontType() {
        return this.fontType;
    }

    /**
     * font type setter
     */
    setFontType(fontType = 'Nanum Gothic') {
        if (this.parent.objectType !== 'textBox') {
            return;
        }
        this.fontType = fontType;
        this.syncFont();
    }

    /**
     * font size getter
     */
    getFontSize() {
        return this.fontSize;
    }

    /**
     * font size setter
     */
    setFontSize(fontSize = 20) {
        if (this.parent.objectType !== 'textBox') {
            return;
        }
        if (this.fontSize === fontSize) {
            return;
        }
        this.fontSize = fontSize;
        this.syncFont();
        this.alignTextBox();
    }

    /**
     * set font bold state
     */
    setFontBold(isFontBold) {
        this.fontBold = isFontBold;
        Entry.requestUpdate = true;
    }

    /**
     * toggle bold on,off and return current
     */
    toggleFontBold() {
        this.fontBold = !this.fontBold;
        this.syncFont();
        return this.fontBold;
    }

    /**
     * set font italic state
     */
    setFontItalic(isFontItalic) {
        this.fontItalic = isFontItalic;
        Entry.requestUpdate = true;
    }

    /**
     * toggle italic on,off and return current
     */
    toggleFontItalic() {
        this.fontItalic = !this.fontItalic;
        this.syncFont();
        return this.fontItalic;
    }

    getFontName() {
        if (this.type !== 'textBox') {
            return;
        }
        const font = this.textObject.font;
        if (!font) {
            return '';
        }

        return font
            .split(' ')
            .filter((font) => {
                return !/^(bold|italic)$/.test(font) && !~font.indexOf('px');
            })
            .join(' ')
            .trim();
    }

    /**
     * text setter
     * @param {string} text
     */
    setText(text = '') {
        if (this.parent.objectType !== 'textBox') {
            return;
        }
        /** @type {string} */
        this.text = text;
        this.textObject.text = this.text;
        if (!this.lineBreak) {
            this.setWidth(this.textObject.getMeasuredWidth());
            this.parent.updateCoordinateView();
        }
        this.updateBG();
        Entry.stage.updateObject();
    }

    /**
     * text getter
     * @return {string}
     */
    getText() {
        return this.text;
    }

    /**
     * textAlign setter
     * @param {number} textAlign
     */
    setTextAlign(textAlign = Entry.TEXT_ALIGN_CENTER) {
        if (this.parent.objectType !== 'textBox') {
            return;
        }
        this.textAlign = textAlign;

        this.textObject.textAlign = Entry.TEXT_ALIGNS[this.textAlign];
        this.alignTextBox();
        this.updateBG();
        Entry.stage.updateObject();
        /*
        this.setWidth(this.textObject.getMeasuredWidth());
        this.updateBG();
        */
    }

    /**
     * textAlign getter
     * @return {number}
     */
    getTextAlign() {
        return this.textAlign;
    }

    /**
     * lineBreak setter
     * @param {boolean} lineBreak
     */
    setLineBreak(lineBreak = false) {
        if (this.parent.objectType !== 'textBox') {
            return;
        }

        const previousState = this.lineBreak;
        this.lineBreak = lineBreak;

        if (previousState && !this.lineBreak) {
            this.textObject.lineWidth = null;
            this.setHeight(this.textObject.getMeasuredLineHeight());
            this.setText(this.getText().replace(/\n/g, ''));
        } else if (!previousState && this.lineBreak) {
            this.setFontSize(this.getFontSize() * this.getScaleX());
            this.setHeight(this.textObject.getMeasuredLineHeight() * 3);
            this.setWidth(this.getWidth() * this.getScaleX());
            this.setScaleX(1);
            this.setScaleY(1);
            this.textObject.lineWidth = this.getWidth();
            this.alignTextBox();
            if (this.fontType === 'Nanum Gothic Coding') {
                const textObjectHeight = this.textObject.getMeasuredLineHeight();
                this.textObject.y = textObjectHeight / 2 - this.getHeight() / 2 + 10;
            }
        }

        Entry.stage.updateObject();
    }

    /**
     * lineBreak getter
     * @return {number}
     */
    getLineBreak() {
        return this.lineBreak;
    }

    /**
     * visible setter
     * @param {boolean} visible
     */
    setVisible(visible = true) {
        /** @type {string} */
        this.visible = visible;
        this.object.visible = this.visible;
        if (this.dialog) {
            this.syncDialogVisible();
        }
        Entry.requestUpdate = true;
        return this.visible;
    }

    /**
     * visible getter
     * @return {boolean}
     */
    getVisible() {
        return this.visible;
    }

    /**
     * Change picture
     * @param {?picture model} pictureModel
     */
    setImage(pictureModel) {
        const that = this;
        delete pictureModel._id;

        Entry.assert(this.type === 'sprite', 'Set image is only for sprite object');
        if (!pictureModel.id) {
            pictureModel.id = Entry.generateHash();
        }

        this.picture = pictureModel;
        const dimension = this.picture.dimension;
        const entityWidth = this.getWidth();
        const entityHeight = this.getHeight();

        const absoluteRegX = this.getRegX() - entityWidth / 2;
        const absoluteRegY = this.getRegY() - entityHeight / 2;
        this.setWidth(dimension.width);
        this.setHeight(dimension.height);
        if (!dimension.scaleX) {
            dimension.scaleX = this.getScaleX();
            dimension.scaleY = this.getScaleY();
        }

        this.setScaleX(this.scaleX);
        this.setScaleY(this.scaleY);
        this.setRegX(this.width / 2 + absoluteRegX);
        this.setRegY(this.height / 2 + absoluteRegY);

        //pictureId can be duplicated by copy/paste
        //add entityId in order to differentiate copied pictures
        const cacheId = !this.isClone ? pictureModel.id + this.id : pictureModel.id;

        let image = Entry.container.getCachedPicture(cacheId);

        if (!image) {
            image = new Image();

            image.onload = function() {
                if (!that.removed) {
                    Entry.container.cachePicture(cacheId, this);
                }

                this.onload = null;
                setImage(this);
            };

            const fileUrl = pictureModel.fileurl;
            if (fileUrl) {
                image.src = fileUrl;
            } else {
                const fileName = pictureModel.filename;
                image.src = `${Entry.defaultPath}/uploads/${fileName.substring(
                    0,
                    2
                )}/${fileName.substring(2, 4)}/image/${fileName}.png`;
            }

            that.object.image = image;
            if (!_.isEmpty(that.object.filters)) {
                that.cache();
            } else {
                that.object.uncache();
            }
        } else {
            setImage(image);
        }

        function setImage(datum) {
            that.object.image = datum;
            if (!_.isEmpty(that.object.filters)) {
                that.cache();
            } else {
                that.object.uncache();
            }
            Entry.requestUpdate = true;
        }

        Entry.dispatchEvent('updateObject');
    }

    /**
     * Apply easel filter
     */
    applyFilter(isForce, forceEffects) {
        const effects = this.effect;
        const object = this.object;

        let diffEffects = isEqualEffects(effects, this.getInitialEffectValue());
        if (!isForce && diffEffects.length === 0) {
            return;
        }

        if (Array.isArray(forceEffects)) {
            diffEffects = diffEffects.concat(forceEffects);
        }

        (function(e, obj) {
            const f = [];
            const adjust = Entry.adjustValueWithMaxMin;

            if (~diffEffects.indexOf('brightness')) {
                e.brightness = e.brightness;
                const cmBrightness = new createjs.ColorMatrix();
                cmBrightness.adjustColor(adjust(e.brightness, -100, 100), 0, 0, 0);
                const brightnessFilter = new createjs.ColorMatrixFilter(cmBrightness);
                f.push(brightnessFilter);
            }

            if (~diffEffects.indexOf('hue')) {
                e.hue = e.hue.mod(360);
                const cmHue = new createjs.ColorMatrix();
                cmHue.adjustColor(0, 0, 0, e.hue);
                const hueFilter = new createjs.ColorMatrixFilter(cmHue);
                f.push(hueFilter);
            }

            if (~diffEffects.indexOf('hsv')) {
                let matrixValue = [
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                ];

                const degrees = e.hsv * 3.6;
                const r = degrees * 3 * Math.PI / 180;
                const cosVal = Math.cos(r);
                const sinVal = Math.sin(r);

                let v = Math.abs(e.hsv / 100);
                if (v > 1) {
                    v = v - Math.floor(v);
                }

                let matrixValue;
                if (v > 0 && v <= 0.33) {
                    matrixValue = [
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        cosVal,
                        sinVal,
                        0,
                        0,
                        0,
                        -1 * sinVal,
                        cosVal,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                    ];
                } else if (v <= 0.66) {
                    matrixValue = [
                        cosVal,
                        0,
                        sinVal,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        sinVal,
                        0,
                        cosVal,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                    ];
                } else if (v <= 0.99) {
                    matrixValue = [
                        cosVal,
                        sinVal,
                        0,
                        0,
                        0,
                        -1 * sinVal,
                        cosVal,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                    ];
                }

                const calcMatrix = new createjs.ColorMatrix().concat(matrixValue);
                const colorFilter = new createjs.ColorMatrixFilter(calcMatrix);
                f.push(colorFilter);
            }

            if (~diffEffects.indexOf('alpha')) {
                e.alpha = adjust(e.alpha, 0, 1);
                obj.alpha = e.alpha;
            }

            obj.filters = f;
        })(effects, object);

        this.cache();

        function isEqualEffects(effectsA, effectsB) {
            const diffEffects = [];
            for (const key in effectsA) {
                if (effectsA[key] !== effectsB[key]) {
                    diffEffects.push(key);
                }
            }
            return diffEffects;
        }
    }

    /**
     * Remove all filter
     */
    resetFilter() {
        if (this.parent.objectType !== 'sprite') {
            return;
        }

        const object = this.object;
        object.filters = [];
        this.setInitialEffectValue();
        object.alpha = this.effect.alpha;

        object.uncache();
    }

    /**
     * update dialog position if exist
     */
    updateDialog() {
        if (this.dialog) {
            this.dialog.update();
        }
        Entry.requestUpdate = true;
    }

    /**
     * save current state data to 'snapshot_'
     */
    takeSnapshot() {
        this.snapshot_ = this.toJSON();
        this.collision = Entry.Utils.COLLISION.NONE;
    }

    /**
     * load snapshot to current entity
     */
    loadSnapshot() {
        if (this.snapshot_) {
            this.syncModel_(this.snapshot_);
        }
        if (this.parent.objectType === 'sprite') {
            this.setImage(this.parent.getPicture());
        }

        Entry.requestUpdate = true;
    }

    /**
     * Remove itself when this is clone
     */
    removeClone(isLast) {
        if (!this.isClone) {
            return;
        }

        const clonedEntities = this.parent.clonedEntities;

        if (isLast !== true) {
            const index = clonedEntities.indexOf(this);
            if (index > -1) {
                clonedEntities.splice(index, 1);
            }
        } else {
            clonedEntities.pop();
        }

        _.result(this, 'clearExecutor');
        this.destroy(true);
    }

    clearExecutor() {
        this.parent.script.clearExecutorsByEntity(this);
    }

    /**
     * convert this entity's data to JSON.
     * @return {JSON}
     */
    toJSON() {
        const _cut = Entry.cutDecimal;

        const json = {};
        json.x = _cut(this.getX());
        json.y = _cut(this.getY());
        json.regX = _cut(this.getRegX());
        json.regY = _cut(this.getRegY());
        json.scaleX = this.getScaleX();
        json.scaleY = this.getScaleY();
        json.rotation = _cut(this.getRotation());
        json.direction = _cut(this.getDirection());
        json.width = _cut(this.getWidth());
        json.height = _cut(this.getHeight());
        json.font = this.getFont();
        json.visible = this.getVisible();

        if (this.parent.objectType === 'textBox') {
            json.colour = this.getColour();
            json.text = this.getText();
            json.textAlign = this.getTextAlign();
            json.lineBreak = this.getLineBreak();
            json.bgColor = this.getBGColour();
            json.underLine = this.getUnderLine();
            json.strike = this.getStrike();
            json.fontSize = this.getFontSize();
        }
        return json;
    }

    /*
    * Return initial effect value
    * @return {effect}
    */
    setInitialEffectValue() {
        this.effect = this.getInitialEffectValue();
        Entry.requestUpdate = true;
    }

    /*
    * Return initial effect value
    * @return {effect}
    */
    getInitialEffectValue() {
        return {
            blur: 0,
            hue: 0,
            hsv: 0,
            brightness: 0,
            contrast: 0,
            saturation: 0,
            alpha: 1,
        };
    }

    /*
    * remove brush
    */
    removeBrush() {
        this._removeShapes();
        this.brush = null;
    }

    /*
    * erase brush
    */
    eraseBrush() {
        this._removeShapes();
        Entry.requestUpdate = true;
    }

    _removeShapes() {
        const container = Entry.stage.selectedObjectContainer;
        this.shapes.map(container.removeChild, container);
        this.shapes = [];
    }

    updateBG() {
        if (!this.bgObject) {
            return;
        }
        this.bgObject.graphics.clear();
        const width = this.getWidth();
        const height = this.getHeight();
        this.bgObject.graphics
            .setStrokeStyle(1)
            .beginStroke()
            .beginFill(this.getBGColour())
            .drawRect(-width / 2, -height / 2, width, height);
        if (this.getLineBreak()) {
            this.bgObject.x = 0;
        } else {
            const fontAlign = this.getTextAlign();
            switch (fontAlign) {
                case Entry.TEXT_ALIGN_LEFT:
                    this.bgObject.x = width / 2;
                    break;
                case Entry.TEXT_ALIGN_CENTER:
                    this.bgObject.x = 0;
                    break;
                case Entry.TEXT_ALIGN_RIGHT:
                    this.bgObject.x = -width / 2;
                    break;
            }
        }
    }

    alignTextBox() {
        if (this.type !== 'textBox') {
            return;
        }
        const textObject = this.textObject;

        if (this.lineBreak) {
            textObject.y = textObject.getMeasuredLineHeight() / 2 - this.getHeight() / 2;

            if (this.fontType === 'Nanum Gothic Coding') {
                textObject.y += 10;
            }

            switch (this.textAlign) {
                case Entry.TEXT_ALIGN_CENTER:
                    textObject.x = 0;
                    break;
                case Entry.TEXT_ALIGN_LEFT:
                    textObject.x = -this.getWidth() / 2;
                    break;
                case Entry.TEXT_ALIGN_RIGHT:
                    textObject.x = this.getWidth() / 2;
                    break;
            }
            textObject.maxHeight = this.getHeight();
        } else {
            textObject.x = 0;
            textObject.y = 0;
        }
    }

    syncDialogVisible() {
        if (this.dialog) {
            this.dialog.object.visible = this.visible;
        }
    }

    addStamp() {
        const stampEntity = new Entry.StampEntity(this.parent, this);
        const stage = Entry.stage;
        stage.loadEntity(stampEntity, stage.selectedObjectContainer.getChildIndex(this.object));
        this.stamps.push(stampEntity);

        Entry.requestUpdate = true;
    }

    removeStamps() {
        this.stamps.forEach((s) => {
            return s.destroy();
        });
        this.stamps = [];
        Entry.requestUpdate = true;
    }

    destroy(isClone) {
        if (this.removed) {
            return;
        }

        this.removed = true;

        const object = this.object;
        if (object) {
            object.uncache();
            object.removeAllEventListeners();
            delete object.image;
            delete object.entity;
        }

        if (this.stamps) {
            this.removeStamps();
        }

        _.result(this.dialog, 'remove');
        this.brush && this.removeBrush();
        Entry.stage.unloadEntity(this);

        const container = Entry.container;
        if (container) {
            container.unCachePictures(this, this.parent.pictures, isClone);
        }
    }

    cache() {
        const { object } = this;
        if (object) {
            object.cache(0, 0, this.getWidth(), this.getHeight());
            Entry.requestUpdate = true;
        }
    }

    reset() {
        this.loadSnapshot();
        this.resetFilter();
        _.result(this.dialog, 'remove');
        this.shapes.length && this.removeBrush();
    }
};
