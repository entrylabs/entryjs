
declare let _:any;

export class PrimitiveSet {

    private _map:any = {};

    hasValue(value:string|number):boolean {
        return this._map[value];
    }

    put(value:string|number) {
        this._map[value] = true;
    }

    remove(value:string|number) {
        delete this._map[value];
    }

    each(callback:(value:string|number)=>void) {
        _.each(this._map, (v:boolean, key:string)=>{
            callback(key);
        });
    }

}