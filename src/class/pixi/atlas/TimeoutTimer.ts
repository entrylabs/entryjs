export class TimeoutTimer {

    private _id:number;

    timeout(timeMS:number, handler:()=>void) {
        this.reset();
        this._id = window.setTimeout(handler, timeMS);
    }

    reset():void {
        if(!this._id) return;
        clearTimeout(this._id);
        this._id = 0;
    }
}