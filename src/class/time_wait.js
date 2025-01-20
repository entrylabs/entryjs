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

Entry.TimeWait = class TimeWait {
    constructor(id, cb, ms) {
        this.id = id;
        this.cb = cb;
        this.ms = ms;
        this.startTime = performance.now();
        this.timer = setTimeout(this.callback.bind(this), ms);
    }

    callback() {
        if (this.cb) {
            this.cb();
            this.destroy();
        }
    }

    pause() {
        if (this.timer) {
            this.ms = this.ms - (performance.now() - this.startTime);
            clearTimeout(this.timer);
        }
    }

    resume() {
        this.timer = setTimeout(this.callback.bind(this), this.ms);
        this.startTime = performance.now();
    }

    destroy() {
        delete this.timer;
        delete this.cb;
        delete this.ms;
        delete this.startTime;
        Entry.TimeWaitManager.remove(this.id);
    }
};
