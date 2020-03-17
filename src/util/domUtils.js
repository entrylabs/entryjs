export default class {
    /**
     * 여러개의 이벤트를 바인딩한다.
     * @param {HTMLElement} target
     * @param {Array<string> | string} eventTypes string 인 경우 space split
     * @param {function} eventHandler
     * @param {AddEventListenerOptions?} option
     */
    static addEventListenerMultiple(target, eventTypes, eventHandler, option) {
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (typeof eventTypes === 'string') {
            eventTypes.split(' ').forEach((eventType) => target.addEventListener(eventType, eventHandler, option));
        } else if (eventTypes instanceof Array) {
            eventTypes.forEach((eventType) => target.addEventListener(eventType, eventHandler, option));
        }
    }
}
