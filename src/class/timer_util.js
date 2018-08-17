'use strict';

Entry.TimerUtil = function(cb, ms) {
    this.cb = cb;
    this.ms = ms;
    this.startTime = performance.now();
    this.timer = setTimeout(this.callback.bind(this), ms);
};

(function(p) {
    p.callback = function() {
        // destroy 된 instance를 다시 호출시 this.cb 가 undefined가 됨.
        // 별도의 time slot manager 가 필요할듯.
        this.cb();
        this.destroy();
    }

    p.pause = function() {
        if (this.timer) {
            this.ms = this.ms - (performance.now() - this.startTime);
            console.log('pause ms=', this.ms);
            clearTimeout(this.timer);
        }
    }

    p.resume = function() {
        console.log('resume ms=', this.ms);
        this.timer = setTimeout(this.callback.bind(this), this.ms);
        this.startTime = performance.now();
    }

    p.destroy = function() {
        delete this.timer;
        delete this.cb;
        delete this.ms;
        delete this.startTime;
    }
})(Entry.TimerUtil.prototype);