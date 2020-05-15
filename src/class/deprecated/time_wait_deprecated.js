'use strict';

Entry.TimeWaitManager = {
    add(id, cb, ms) {
        if (!Entry.timerInstances) {
            Entry.timerInstances = [];
        }

        const instance = new Entry.TimeWait(id, cb, ms);
        Entry.timerInstances.push(instance);
    },
    remove(id) {
        if (!Entry.timerInstances || Entry.timerInstances.length == 0) {
            return;
        }
        Entry.timerInstances = Entry.timerInstances.filter((instance) => {
            if (instance.id === id) {
                return false;
            } else {
                return true;
            }
        });
    },
};

Entry.TimeWait = function(id, cb, ms) {
    this.id = id;
    this.cb = cb;
    this.ms = ms;
    this.startTime = performance.now();
    this.timer = setTimeout(this.callback.bind(this), ms);
};

(function(p) {
    p.callback = function() {
        if (this.cb) {
            this.cb();
            this.destroy();
        }
    };

    p.pause = function() {
        if (this.timer) {
            this.ms = this.ms - (performance.now() - this.startTime);
            clearTimeout(this.timer);
        }
    };

    p.resume = function() {
        this.timer = setTimeout(this.callback.bind(this), this.ms);
        this.startTime = performance.now();
    };

    p.destroy = function() {
        delete this.timer;
        delete this.cb;
        delete this.ms;
        delete this.startTime;
        Entry.TimeWaitManager.remove(this.id);
    };
})(Entry.TimeWait.prototype);
