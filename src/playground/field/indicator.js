Entry.FieldIndicator = class FieldIndicator extends Entry.Field {
    constructor(content, blockView, index) {
        super(content, blockView, index);
        this._block = blockView.block;
        this._blockView = blockView;

        const box = new Entry.BoxModel();
        this.box = box;

        this._size = content.size;
        if (content.img) {
            if (this._block.deletable === Entry.Block.DELETABLE_FALSE_LIGHTEN) {
                this._imgUrl = content.img.replace('.png', '_un.png');
            } else {
                this._imgUrl = content.img;
            }
        } else if (content.color) {
            this._color = content.color;
        }

        this._boxMultiplier = content.boxMultiplier || 2;
        this._highlightColor = content.highlightColor || '#F59900';
        this._position = content.position;

        this._index = index;
        this.svgGroup = null;
        this._imgElement = null;
        this.setValue(null);

        this.renderStart();
    }

    renderStart() {
        let options;
        if (!this._imgElement) {
            this.svgGroup = this._imgElement = this._blockView.contentSvgGroup.elem('image');
        }

        if (this._imgUrl) {
            options = {
                href: Entry.mediaFilePath + this._imgUrl,
                x: this._position ? this._size * -1 : 0,
                y: this._size * -1,
                width: this._size * 2,
                height: this._size * 2,
            };
            this._imgElement.attr(options);

            if (this._block.emphasized && this._imgUrl.lastIndexOf('_un.png') === -1) {
                this._imgUrl = this._imgUrl.replace('.png', '_un.png');
            }
        }

        this.box.set({
            width: this._size * this._boxMultiplier + (this._position ? -this._size : 0),
            height: this._size * this._boxMultiplier,
        });
    }

    enableHighlight() {
        return;
        const pathLen = this._path.getTotalLength();
        const path = this._path;
        this._path.attr({
            stroke: this._highlightColor,
            strokeWidth: 2,
            'stroke-linecap': 'round',
            'stroke-dasharray': `${pathLen} ${pathLen}`,
            'stroke-dashoffset': pathLen,
        });
        setInterval(
            () => {
                path.attr({ 'stroke-dashoffset': pathLen }).animate(
                    { 'stroke-dashoffset': 0 },
                    300
                );
            },
            1400,
            mina.easeout
        );
        setTimeout(() => {
            setInterval(
                () => {
                    path.animate({ 'stroke-dashoffset': -pathLen }, 300);
                },
                1400,
                mina.easeout
            );
        }, 500);
    }
};
