import _toPairs from 'lodash/toPairs';

class Event {
    static instance;
    static elementMap = new Map();

    constructor() {
        if (Event.instance) {
            return Event.instance;
        }
    }

    on(dom, type, callback, option = false) {
        if (!dom) {
            throw new Error('dom is undefined');
        }
        const eventMap = Event.elementMap.get(dom) || {};
        if (eventMap[type]) {
            eventMap[type].push(callback);
        } else {
            eventMap[type] = [callback];
        }
        Event.elementMap.set(dom, eventMap);
        this.addEvent(dom, type, callback, option);
    }

    off(dom, type, callback, option = false) {
        if (!dom) {
            throw new Error('dom is undefined');
        }
        const eventMap = Event.elementMap.get(dom) || {};
        _toPairs(eventMap).forEach(([key, value = []]) => {
            const filtered = value.filter((func) => {
                if (!callback || callback === func) {
                    if (type === key) {
                        this.removeEvent(dom, type, func, option);
                        return false;
                    } else if (type === undefined) {
                        this.removeEvent(dom, key, func, option);
                        return false;
                    } else if (key.indexOf('.') > -1) {
                        const [event, namespace = ''] = key.split('.');
                        const [e, n] = this.getEventName(type);
                        if (e === event || n === namespace) {
                            this.removeEvent(dom, key, func, option);
                            return false;
                        }
                    }
                }
                return true;
            });
            if (filtered.length) {
                eventMap[key] = filtered;
            } else {
                delete eventMap[key];
            }
        });
        Event.elementMap.set(dom, eventMap);
    }

    getType(type) {
        return type.split('.')[0];
    }

    getEventName(type) {
        if (type.indexOf('.') > -1) {
            return type.split('.');
        } else {
            return [type, type];
        }
    }

    addEvent(dom, type, callback, option) {
        dom.addEventListener(this.getType(type), callback, option);
    }

    removeEvent(dom, type, callback, option) {
        dom.removeEventListener(this.getType(type), callback, option);
    }
}

export default Event;
