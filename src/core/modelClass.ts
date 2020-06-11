import intersection from 'lodash/intersection';

export default abstract class ModelClass<T extends {[key: string]: any}> {
    public data: Partial<T>;
    public observers: any[] = []; // new Entry.Observer
    protected schema: T;

    protected constructor(schema: T, isSeal?: boolean) {
        this.schema = schema;
        this.generateSchema();
        if (isSeal === undefined || isSeal) {
            Object.seal(this);
        }
    }

    private generateSchema() {
        let schema = this.schema;
        if (schema === undefined) {
            return;
        }
        try {
            schema = JSON.parse(JSON.stringify(schema));
        } catch (e) {
            console.log(schema);
            console.error(e);
        }
        this.data = {};
        Object.keys(schema).forEach((key) => {
            // @ts-ignore
            this.data[key] = schema[key];
            Object.defineProperty(this, key, {
                get() {
                    return this.data[key];
                },
            });
        });
    }

    public set(data: Partial<T>, isSilent?: boolean) {
        const oldValue: { [key: string]: any } = {};
        const keys = Object.keys(data);
        for (const key in this.data) {
            if (data[key] !== undefined) {
                if (data[key] === this.data[key]) {
                    keys.splice(keys.indexOf(key), 1);
                } else {
                    oldValue[key] = this.data[key];
                    // @ts-ignore
                    if (data[key] instanceof Array) {
                        this.data[key] = data[key].concat();
                    } else {
                        this.data[key] = data[key];
                    }
                }
            }
        }

        !isSilent && this.notify(keys, oldValue);
    }

    public observe(object: any, funcName: string, attrs: any, isNotify?: boolean) {
        // @ts-ignore
        const observer = new Entry.Observer(this.observers, object, funcName, attrs);
        if (isNotify !== false) {
            object[funcName]([]);
        }
        return observer;
    }

    public unobserve(observer: any) {
        observer.destroy();
    }

    public notify(key: string | string[], oldValue: any) {
        const keys = typeof key === 'string' ? [key] : key;
        const observers = this.observers;
        if (!observers.length) {
            return;
        }

        observers.forEach((observeData) => {
            let attrs = keys;
            if (observeData.attrs !== undefined) {
                attrs = intersection(observeData.attrs, keys);
            }

            if (!attrs.length) {
                return;
            }

            observeData.object[observeData.funcName](
                attrs.forEach((key) => {
                    return {
                        name: key,
                        object: this,
                        oldValue: oldValue[key],
                    };
                }),
            );
        });
    }

    protected _toJSON() {
        const json: { [key: string]: any } = {};
        for (const key in this.data) {
            json[key] = this.data[key];
        }
        return json;
    }
}
