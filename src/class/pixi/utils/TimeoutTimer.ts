export class TimeoutTimer {

    private _id:number;

    timeout(timeMS:number, handler:()=>void) {
        this.reset();
        this._id = window.setTimeout(()=>{
            handler();
            this._id = 0;
        }, timeMS);
    }

    get isRunning():boolean {
        return Boolean(this._id);
    }

    reset():void {
        if(!this._id) return;
        clearTimeout(this._id);
        this._id = 0;
    }
}