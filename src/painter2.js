'use strict';

Entry.Painter2 = function() {

};

(function(proto) {

proto.initialize = function(painterView) {
    // this.generateView(painterView);

    // entryPlaygroundPainter에서 overflow: hidden으로 되어 있어 표시가 안되어서 강제로 visible로 세팅.
    painterView.style.overflow = 'visible';

    LC.init(painterView, {
            imageURLPrefix: '/lib/literallycanvas/img',
            backgroundColor: '#fff',
            toolbarPosition: 'bottom',
        }
    );

    // default로 init을 하면 canvas 사이즈가 0이 되어 버려서 강제로 세팅함.
    var size = {width: '960px', height: '540px'};
    $('.lc-drawing').css(size);
    $('.lc-drawing canvas').attr(size).css(size);
    // $('.lc-options.horz-toolbar').prepend($('.lc-color-pickers'));
};


}(Entry.Painter2.prototype));
