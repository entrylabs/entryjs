class CloneEntity {
    constructor(entity) {
        this.entity = entity;
    }
    get collision() {
        return this.entity.collision;
    }
    get direction() {
        return this.entity.direction;
    }
    get effect() {
        return this.entity.effect;
    }
    get flip() {
        return this.entity.flip;
    }
    get height() {
        return this.entity.height;
    }
    get id() {
        return this.entity.id;
    }
    get object() {
        return this.entity.object;
    }
    get parent() {
        return this.entity.parent;
    }
    get picture() {
        return this.entity.picture;
    }
    get regX() {
        return this.entity.regX;
    }
    get regY() {
        return this.entity.regY;
    }
    get removed() {
        return this.entity.removed;
    }
    get rotation() {
        return this.entity.rotation;
    }
    get scaleX() {
        return this.entity.scaleX;
    }
    get scaleY() {
        return this.entity.scaleY;
    }
    get shapes() {
        return this.entity.shapes;
    }
    get snapshot_() {
        return this.entity.snapshot_;
    }
    get stamps() {
        return this.entity.stamps;
    }
    get type() {
        return this.entity.type;
    }
    get visible() {
        return this.entity.visible;
    }
    get voice() {
        return this.entity.voice;
    }
    get width() {
        return this.entity.width;
    }
    get x() {
        return this.entity.x;
    }
    get y() {
        return this.entity.y;
    }
    get _rndPosX() {
        return this.entity._rndPosX;
    }
    get _rndPosY() {
        return this.entity._rndPosY;
    }
    get _scaleAdaptor() {
        return this.entity._scaleAdaptor;
    }
    injectModel(pictureModel, entityModel) {
        this.entity.injectModel(pictureModel, entityModel);
    }
    initCommand() {
        this.entity.initCommand();
    }
    checkCommand() {
        this.entity.checkCommand();
    }
    syncModel_(...args) {
        this.entity.syncModel_(...args);
    }
    setModel(entityModel) {
        this.entity.setModel(entityModel);
    }
    syncFont() {
        this.entity.syncFont();
    }
    addStamp() {
        this.entity.addStamp();
    }
    removeStamps() {
        this.entity.removeStamps();
    }
    destroy(isClone) {
        this.entity.destroy(isClone);
    }
    cache() {
        this.entity.cache();
    }
    reset() {
        this.entity.reset();
    }
    _syncFontStyle() {
        this.entity._syncFontStyle();
    }
    // ========== SET ============ //
    setX(x) {
        this.isEngineStop || this.entity.setX(x);
    }
    setY(y) {
        this.isEngineStop || this.entity.setY(y);
    }
    setDirection(direction, flippable) {
        this.isEngineStop || this.entity.setDirection(direction, flippable);
    }
    setRotation(rotation) {
        this.isEngineStop || this.entity.setRotation(rotation);
    }
    setRegX(regX) {
        this.isEngineStop || this.entity.setRegX(regX);
    }
    setRegY(regY) {
        this.isEngineStop || this.entity.setRegY(regY);
    }
    setScaleX(scaleX) {
        this.isEngineStop || this.entity.setScaleX(scaleX);
    }
    setScaleY(scaleY) {
        this.isEngineStop || this.entity.setScaleY(scaleY);
    }
    setSize(size) {
        this.isEngineStop || this.entity.setSize(size);
    }
    setWidth(width) {
        this.isEngineStop || this.entity.setWidth(width);
    }
    setHeight(height) {
        this.isEngineStop || this.entity.setHeight(height);
    }
    setColour(colour) {
        this.isEngineStop || this.entity.setColour(colour);
    }
    setBGColour(colour) {
        this.isEngineStop || this.entity.setBGColour(colour);
    }
    setUnderLine(underLine) {
        this.isEngineStop || this.entity.setUnderLine(underLine);
    }
    setStrike(strike) {
        this.isEngineStop || this.entity.setStrike(strike);
    }
    setFont(font) {
        this.isEngineStop || this.entity.setFont(font);
    }
    setLineHeight() {
        this.isEngineStop || this.entity.setLineHeight();
    }
    setFontType(fontType) {
        this.isEngineStop || this.entity.setFontType(fontType);
    }
    setFontSize(fontSize) {
        this.isEngineStop || this.entity.setFontSize(fontSize);
    }
    setFontBold(isFontBold) {
        this.isEngineStop || this.entity.setFontBold(isFontBold);
    }
    setFontItalic(isFontItalic) {
        this.isEngineStop || this.entity.setFontItalic(isFontItalic);
    }
    setText(text) {
        this.isEngineStop || this.entity.setText(text);
    }
    setTextAlign(textAlign) {
        this.isEngineStop || this.entity.setTextAlign(textAlign);
    }
    setVisible(visible) {
        if (!this.isEngineStop) {
            return this.entity.setVisible(visible);
        }
    }
    setImage(pictureModel) {
        this.isEngineStop || this.entity.setImage(pictureModel);
    }
    applyFilter(isForce, forceEffects) {
        this.isEngineStop || this.entity.applyFilter(isForce, forceEffects);
    }
    resetFilter() {
        this.isEngineStop || this.entity.resetFilter();
    }
    updateDialog() {
        this.isEngineStop || this.entity.updateDialog();
    }
    takeSnapshot() {
        this.isEngineStop || this.entity.takeSnapshot();
    }
    loadSnapshot() {
        this.isEngineStop || this.entity.loadSnapshot();
    }
    removeClone(isLast) {
        this.isEngineStop || this.entity.removeClone(isLast);
    }
    clearExecutor() {
        this.isEngineStop || this.entity.clearExecutor();
    }
    setLineBreak(lineBreak) {
        this.isEngineStop || this.entity.setLineBreak(lineBreak);
    }
    setInitialEffectValue() {
        this.isEngineStop || this.entity.setInitialEffectValue();
    }
    setVoiceProp(prop) {
        this.isEngineStop || this.entity.setVoiceProp(prop);
    }
    removeBrush() {
        this.isEngineStop || this.entity.removeBrush();
    }
    eraseBrush() {
        this.isEngineStop || this.entity.eraseBrush();
    }
    _removeShapes() {
        this.isEngineStop || this.entity._removeShapes();
    }
    updateBG() {
        this.isEngineStop || this.entity.updateBG();
    }
    alignTextBox() {
        this.isEngineStop || this.entity.alignTextBox();
    }
    syncDialogVisible() {
        this.isEngineStop || this.entity.syncDialogVisible();
    }
    // ========== GET ============ //
    getX(toFixedValue) {
        return this.entity.getX(toFixedValue);
    }
    getY(toFixedValue) {
        return this.entity.getY(toFixedValue);
    }
    getDirection(toFixedValue) {
        return this.entity.getDirection(toFixedValue);
    }
    getRotation(toFixedValue) {
        return this.entity.getRotation(toFixedValue);
    }
    getRegX() {
        return this.entity.getRegX();
    }
    getRegY() {
        return this.entity.getRegY();
    }
    getScaleX() {
        return this.entity.getScaleX();
    }
    getScaleY() {
        return this.entity.getScaleY();
    }
    getSize(toFixedValue) {
        return this.entity.getSize(toFixedValue);
    }
    getWidth() {
        return this.entity.getWidth();
    }
    getHeight() {
        return this.entity.getHeight();
    }
    getColour() {
        return this.entity.getColour();
    }
    getBGColour() {
        return this.entity.getBGColour();
    }
    getUnderLine() {
        return this.entity.getUnderLine();
    }
    getStrike() {
        return this.entity.getStrike();
    }
    getFont() {
        return this.entity.getFont();
    }
    getFontType() {
        return this.entity.getFontType();
    }
    getFontSize() {
        return this.entity.getFontSize();
    }
    toggleFontBold() {
        return this.entity.toggleFontBold();
    }
    toggleFontItalic() {
        return this.entity.toggleFontItalic();
    }
    getFontName() {
        return this.entity.getFontName();
    }
    getText() {
        return this.entity.getText();
    }
    getTextAlign() {
        return this.entity.getTextAlign();
    }
    getLineBreak() {
        return this.entity.getLineBreak();
    }
    getVisible() {
        return this.entity.getLineBreak();
    }
    toJSON() {
        return this.entity.toJSON();
    }
    getInitialEffectValue() {
        return this.entity.getInitialEffectValue();
    }
    getVoiceProp() {
        return this.entity.getVoiceProp();
    }
}

export default class ExecuteEntity {
    constructor() {
        this.entityMap = new WeakMap();
    }

    get(entity) {
        if (this.entityMap.has(entity)) {
            return this.entityMap.get(entity);
        } else {
            const cloneEntity = new CloneEntity(entity);
            this.entityMap.set(entity, cloneEntity);
            return cloneEntity;
        }
    }

    stop(entity) {
        if (this.entityMap.has(entity)) {
            const cloneEntity = this.entityMap.get(entity);
            cloneEntity.isEngineStop = true;
            if (cloneEntity.dialog) {
                cloneEntity.dialog.remove();
            }
            if (cloneEntity.brush) {
                cloneEntity.removeBrush();
            }
            this.entityMap.delete(entity);
        } else {
            console.log('not found entity');
        }
    }
}
