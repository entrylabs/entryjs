class AA{
    get orgTexture() {
        return this.obj.texture;
    }
    get cacheTexture() {
        return this.cacheSprite.texture;
    }
    get cacheSprite() {
        return this.obj._cacheData.sprite;
    }
    get obj() {
        return Entry.stage.objectContainers[0].children[0];
    }

}
window.view = new AA();