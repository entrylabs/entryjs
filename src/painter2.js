'use strict';

Entry.Painter2 = function() {

};

(function(proto) {

proto.initialize = function(painterView) {

    // entryPlaygroundPainter에서 overflow: hidden으로 되어 있어 표시가 안되어서 강제로 visible로 세팅.
    painterView.style.overflow = 'visible';

    LC.init(painterView, {
            imageURLPrefix: '/lib/literallycanvas/img',
            backgroundColor: '#fff',
            toolbarPosition: 'bottom',
        }
    );

    this.setupEvent(painterView);

    // default로 init을 하면 canvas 사이즈가 0이 되어 버려서 강제로 세팅함.
    var size = {width: '960px', height: '540px'};
    // $('.lc-drawing').css({width: '560px', height: '240px'});
    $('.lc-drawing canvas').attr(size).css(size);
};

proto.setupEvent = function(painterView) {
    // 윈도우 리사이즈시 캔버스의 컨테이너 크기 조절.
    Entry.addEventListener('windowResized', function(e) {
        var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var ecw = parseInt(document.getElementById('entryCanvas').style.width);

        var w = iw - (ecw+240);
        var h = ih - (45+40+44+28+192);
        painterView.style.width = w + 'px';

        // lc-drawing 은 canvas를 품고 있는 literallycanvas 의 div임.
        var painterContainer = $('.lc-drawing')[0];
        painterContainer.style.width = (w - 62) + 'px';
        painterContainer.style.height = (h) + 'px';
        // painterAttr.style.top = (h+30) + 'px';
        // painterAttr.style.height = (ih-h) + 'px';

    });
};


}(Entry.Painter2.prototype));
