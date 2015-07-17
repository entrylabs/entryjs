'use strict';

goog.provide('Blockly.ConnectionAnimation');

goog.require('Blockly.Connection');
goog.require('goog.Timer');

/**
 * Class for a connection animation between blocks.
 * @param {!Blockly.Block} source The block establishing this connection.
 * @param {number} type The type of the connection.
 * @constructor
 */
Blockly.ConnectionAnimation = function() {
};

/**
 * URL of the connection image
 * @type {string}
 * @private
 */
Blockly.ConnectionAnimation.prototype.IMG_URL_ = 'media/ani.png';

/**
 * Width connection image
 * @type {number}
 * @private
 */
Blockly.ConnectionAnimation.prototype.IMG_WIDTH_ = 23;

/**
 * Height of the connection image
 * @type {number}
 * @private
 */
Blockly.ConnectionAnimation.prototype.IMG_HEIGHT_ = 23;

/**
 * The SVG group containing the connection animation
 * @type {Element}
 * @private
 */
Blockly.ConnectionAnimation.prototype.svgGroup_ = null;

/**
 * The SVG group containing the connection animation
 * @type {Element}
 * @private
 */
Blockly.ConnectionAnimation.prototype.svgBody_ = null;


/**
 * Current scale of the img.
 * @type {number}
 * @private
 */
Blockly.ConnectionAnimation.prototype.scale_ = 0;

/**
 * Current scale of the img.
 * @type {number}
 * @private
 */
Blockly.ConnectionAnimation.prototype.current_x_ = 0;

/**
 * Current scale of the img.
 * @type {number}
 * @private
 */
Blockly.ConnectionAnimation.prototype.current_y_ = 0;
/**
 * Target scale of the img.
 * @type {number}
 * @private
 */
Blockly.ConnectionAnimation.prototype.target_scale_ = 0.95;

/**
 * Create the animation img elements.
 * @return {!Element} The anmimation SVG group
 */
Blockly.ConnectionAnimation.prototype.createDom = function() {
  this.svgGroup_ = Blockly.createSvgElement('g',
      {}, null);
  this.svgBody_ = Blockly.createSvgElement('image',
      {'width': this.IMG_WIDTH_, 'height': this.IMG_HEIGHT_},
      this.svgGroup_);
  this.svgBody_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      Blockly.pathToBlockly + this.IMG_URL_);
  this.svgBody_.setAttribute('transform', 'scale(' +
    this.scale_
  + ')');

  return this.svgGroup_;
};


/**
 * Initialize the animation image.
 */
Blockly.ConnectionAnimation.prototype.init = function() {
    this.hide_();
};


/**
 * Initialize the animation image.
 */
Blockly.ConnectionAnimation.prototype.hide_ = function () {
    if (this.scale_ <= 0)
        return;

    this.scale_ -= 0.1;
    this.svgBody_.setAttribute('transform', 'scale(' +
        this.scale_
    + ')');
    goog.Timer.callOnce(this.hide_, 5, this);
};

/**
 * Initialize the animation image.
 */
Blockly.ConnectionAnimation.prototype.show_ = function (sourceBlock, connection) {
    if ( sourceBlock ) {
        var svg = sourceBlock.svg_.getRootElement();
        this.bbox = svg.getBBox();
        var xy = Blockly.getSvgXY_(svg);
        this.blockHeight = sourceBlock.svg_.height + 15;
        this.current_x_ = xy.x;
        this.current_y_ = xy.y;
    }
    if (connection)
        this.connection_ = connection;
    if (this.connection_ != this.connection_.sourceBlock_.outputConnection &&
        this.connection_ != this.connection_.sourceBlock_.previousConnection &&
        this.connection_ != this.connection_.sourceBlock_.nextConnection)
        this.svgGroup_.setAttribute('transform', 'translate(' + (this.current_x_ + Blockly.BlockSvg.NOTCH_WIDTH) + ',' + (this.current_y_ + this.blockHeight) + ')');
    else
        this.svgGroup_.setAttribute('transform', 'translate(' + (this.current_x_) + ',' + (this.current_y_ + this.bbox.height) + ')');

    if (this.scale_ >= 1) {
        this.svgBody_.setAttribute('transform',
            //'translate(' + (1 - this.target_scale_) * this.current_x_+12 + ','+ (1 - this.target_scale_) + this.current_y_+12 + ') ' +
            'scale(' + this.target_scale_ + ')'
        );
        return;
    }

    this.scale_ += 0.02;
    this.svgBody_.setAttribute('transform',
        //'translate(' + (1 - this.scale_) * this.current_x_ + 12 + ','+ (1 - this.scale_) + this.current_y_ + 12 + ') ' +
        'scale(' + this.scale_ + ')'
    );
    goog.Timer.callOnce(this.show_, 5, this);

};

