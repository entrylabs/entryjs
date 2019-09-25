function none() {}

function getCloneEntity(entity) {
    return new Proxy(entity, {
        set(trapTarget, key, value, receiver) {
            if (key === '__isStop') {
                this.__isStop = value;
            }
            return Reflect.set(trapTarget, key, value, receiver);
        },
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver);
            if (result instanceof Function) {
                if (this.__isStop) {
                    return none;
                } else {
                    return result;
                }
            } else {
                return result;
            }
        },
    });
}

export default class ExecuteEntity {
    constructor() {
        this.entityMap = new WeakMap();
    }

    get(entity) {
        if (this.entityMap.has(entity)) {
            return this.entityMap.get(entity);
        } else {
            const cloneEntity = getCloneEntity(entity);
            this.entityMap.set(entity, cloneEntity);
            return cloneEntity;
        }
    }

    stop(entity) {
        if (this.entityMap.has(entity)) {
            const cloneEntity = this.entityMap.get(entity);
            cloneEntity.__isStop = true;
            this.entityMap.delete(entity);
        } else {
            console.log('not found entity');
        }
    }
}
