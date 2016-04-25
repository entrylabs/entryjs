/*
 */
"use strict";

goog.provide("Entry.FieldColor");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldColor = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;
    this._index = index;
    this._position = content.position;
    this.key = content.key;
    this.setValue(this.getValue() || '#FF0000');

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldColor);

(function(p) {
    var WIDTH = 14.5,
        HEIGHT = 16;

    p.renderStart = function() {
        var blockView = this._blockView;
        var that = this;
        var contents = this._contents;


        this.svgGroup = blockView.contentSvgGroup.elem('g', {
            class: 'entry-field-color'
        });

        var position = this._position;
        var x,y;
        if (position) {
            x = position.x || 0;
            y = position.y || 0;
        } else {
            x = 0;
            y = -HEIGHT/2;
        }

        this._header = this.svgGroup.elem('rect', {
            x:x, y:y, width: WIDTH, height: HEIGHT,
            fill: this.getValue()
            });

        this._bindRenderOptions();

        this.box.set({
            x: x,
            y: y,
            width: WIDTH,
            height: HEIGHT
        });
    };

    p.renderOptions = function() {
        var that = this;
        this.destroyOption();

        var blockView = this._block.view;

        this.documentDownEvent = Entry.documentMousedown.attach(
            this, function(){
                Entry.documentMousedown.detach(this.documentDownEvent);
                that.optionGroup.remove();
            }
        );

        var colors = Entry.FieldColor.getWidgetColorList();
        this.optionGroup = Entry.Dom('table', {
            class:'entry-widget-color-table',
            parent: $('body')
        });
        for (var i=0; i<colors.length; i++) {
            var tr = Entry.Dom('tr', {
                class : 'entry-widget-color-row',
                parent : this.optionGroup
            });

            for (var j=0; j<colors[i].length; j++) {
                var td = Entry.Dom('td', {
                    class : 'entry-widget-color-cell',
                    parent : tr
                });
                var color = colors[i][j];
                td.css({'background-color': color});
                td.attr({'data-color-value': color});

                (function(elem, value) {
                    elem.mousedown(function(e){e.stopPropagation();});
                    elem.mouseup(function(e){
                        that.applyValue(value);
                        that.destroyOption();
                        that._selectBlockView();
                    });
                })(td, color);
            }
        }
        var pos = this.getAbsolutePosFromDocument();
        pos.y += this.box.height/2 + 1;

        this.optionGroup.css({
            left:pos.x,
            top:pos.y
        });

    };

    p.applyValue = function(value) {
        if (this.value == value) return;
        this.setValue(value);
        this._header.attr({fill: value});
    };

})(Entry.FieldColor.prototype);

Entry.FieldColor.getWidgetColorList = function() {
    return [
         ['#FFFFFF', '#CCCCCC', '#C0C0C0', '#999999', '#666666', '#333333', '#000000'],
         ['#FFCCCC', '#FF6666', '#FF0000', '#CC0000', '#990000', '#660000', '#330000'],
         ['#FFCC99', '#FF9966', '#FF9900', '#FF6600', '#CC6600', '#993300', '#663300'],
         ['#FFFF99', '#FFFF66', '#FFCC66', '#FFCC33', '#CC9933', '#996633', '#663333'],
         ['#FFFFCC', '#FFFF33', '#FFFF00', '#FFCC00', '#999900', '#666600', '#333300'],
         ['#99FF99', '#66FF99', '#33FF33', '#33CC00', '#009900', '#006600', '#003300'],
         ['#99FFFF', '#33FFFF', '#66CCCC', '#00CCCC', '#339999', '#336666', '#003333'],
         ['#CCFFFF', '#66FFFF', '#33CCFF', '#3366FF', '#3333FF', '#000099', '#000066'],
         ['#CCCCFF', '#9999FF', '#6666CC', '#6633FF', '#6609CC', '#333399', '#330099'],
         ['#FFCCFF', '#FF99FF', '#CC66CC', '#CC33CC', '#993399', '#663366', '#330033']
    ];
};
