import { Rectangle } from './Rectangle';

export class InputRect extends Rectangle {
    constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) {
        super(...arguments);
    }

    binIndex:number = -1;
    oversized:boolean;
    data:any;
}