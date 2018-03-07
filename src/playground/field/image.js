/*
 */
'use strict';
/*
 *
 */
Entry.FieldImage = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;
    this._content = content;

    var box = new Entry.BoxModel();
    this.box = box;

    if (Entry.Utils.isNumber(content.size)) {
        this._width = content.size;
        this._height = content.size;
    } else {
        var sizeSet = content.size || {};
        this._width = sizeSet.width || 0;
        this._height = sizeSet.height || 0;
    }

    this._highlightColor = content.highlightColor || '#F59900';
    this._position = content.position;

    this.svgGroup = null;
    this._path = null;
    this._imgElement = null;
    this._index = index;

    this.setValue(null);
    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldImage);

(function(p) {
    p.renderStart = function() {
        var block = this._block;
        var img = this._content.img;

        this._imgUrl =
            this._block.deletable === Entry.Block.DELETABLE_FALSE_LIGHTEN
                ? img.replace('.png', '_un.png')
                : img;

        var options = {
            href: this._imgUrl,
            x: 0,
            y: this._height * -0.5,
            width: this._width,
            height: this._height,
        };

        if (!this._imgElement) {
            this.svgGroup = this._imgElement = this._blockView.contentSvgGroup.elem(
                'image',
                options
            );
        } else {
            this._imgElement.attr(options);
        }

        this.box.set({
            x: this._width,
            y: 0,
            width: this._width,
            height: this._height,
        });
    };
})(Entry.FieldImage.prototype);
