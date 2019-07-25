export default class SingleInstance {
    constructor(...props) {
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.constructor.instance = this;
        this.initialize(...props);
    }

    initialize() {}
}
