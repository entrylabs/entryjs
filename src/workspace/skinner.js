/*
 *
 */
"use strict";

goog.provide("Entry.SkinContainer");

Entry.SkinContainer = function() {
    this._skins = {};

};

(function(p) {
    p.skinSchema = {
        type: "",
        condition: []
    };

    p.loadSkins = function(skins) {
        skins.map(this.addSkin.bind(this));
    };

    p.addSkin = function(skin) {
        var blockSkin = function () {};
        var blockPrototype = Entry.block[skin.type]
        blockSkin.prototype = blockPrototype;
        blockSkin = new blockSkin();

        for (var key in skin)
            blockSkin[key] = skin[key]

        if (!this._skins[skin.type])
            this._skins[skin.type] = [];

        this._skins[skin.type].push(blockSkin);
    };

    p.getSkin = function(block) {
        if (this._skins[block.type]) {
            return this._skins[block.type][0];
        } else {
            return Entry.block[block.type];
        }
    };

})(Entry.SkinContainer.prototype)
