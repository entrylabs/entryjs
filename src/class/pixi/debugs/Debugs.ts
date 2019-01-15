abstract class _Base {
    constructor(protected store:any) {
        this.init();
    }
    protected abstract init():void;

    protected save() {
        PIXIDebug.internal_save();
    }
}


class _Console extends _Base {

    protected init() {
        var store = this.store;
        this._enabledAll = store._enabledAll || false;
        this._destroy = store._destroy || true;
    }

    private _enabledAll:boolean;
    get enabledAll():boolean { return this._enabledAll && this._enabledAll; }
    set enabledAll(value:boolean) {
        this._enabledAll = value;
        this.save();
    }

    private _destroy:boolean;
    get destroy():boolean { return this._enabledAll && this._destroy; }
    set destroy(value:boolean) {
        this._destroy = value;
        this.save();
    }
}

let ITEM_KEY:string = "entry.pixi.deubg";
class Debugs {

    public console:_Console;
    private _store:any;

    internal_init() {
        var jsonString:string = window.localStorage.getItem(ITEM_KEY);
        this._store = jsonString ? JSON.parse(jsonString) : {};
        let s = this._store;
        this.console = new _Console(s.console || (s.console = {}));
    }

    internal_save():void {
        window.localStorage.setItem(ITEM_KEY, JSON.stringify(this._store));
    }

    deleteSaved() {
        this._store = {};
        this.internal_save();
        console.log("must refresh browser");
    }
}

declare let Entry:any;
export let PIXIDebug = new Debugs();
Entry.PIXIDebug = PIXIDebug;