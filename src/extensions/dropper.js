import SingleInstance from '../core/singleInstance';

export default class Dropper extends SingleInstance {
    initialize(parent, b, c) {
        this.parent = parent;
    }
}
