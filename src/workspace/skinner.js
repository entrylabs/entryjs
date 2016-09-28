/*
 *
 */
"use strict";

goog.provide("Entry.skinContainer");

Entry.skinContainer = {
    _skins: {}
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
            var candidates = this._skins[block.type];
            for (var i = 0; i < candidates.length; i++) {
                var candidate = candidates[0];
                if (!candidate.conditions || !candidate.conditions.length)
                    return candidate;
                for (var j = 0; j < candidate.conditions.length; j++) {
                    var condition = candidate.conditions[j];
                    if (block.params[condition.index] !== condition.value)
                        break;
                    if (j === candidate.conditions.length - 1)
                        return candidate;
                }
            }
        }

        return Entry.block[block.type];
    };

})(Entry.skinContainer)
