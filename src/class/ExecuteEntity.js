function getCloneEntity(entity) {
    return Object.assign(Object.create(Object.getPrototypeOf(entity)), entity);
}

export default class ExecuteEntity {
    constructor() {
        this.entityMap = new WeakMap();
    }

    get(entity, isClone) {
        if (this.entityMap.has(entity)) {
            return this.entityMap.get(entity);
        } else if (isClone) {
            const cloneEntity = getCloneEntity(entity);
            this.entityMap.set(entity, cloneEntity);
            return cloneEntity;
        } else {
            return entity;
        }
    }

    stop(entity) {
        if (this.entityMap.has(entity)) {
            const cloneEntity = this.entityMap.get(entity);
            Object.getOwnPropertyNames(cloneEntity.__proto__).forEach((name) => {
                cloneEntity[name] = () => {};
            });
            // cloneEntity.isEngineStop = true;
            if (cloneEntity.dialog) {
                cloneEntity.dialog.remove();
            }
            if (cloneEntity.brush) {
                cloneEntity.removeBrush();
            }
            this.entityMap.delete(entity);
        } else {
            console.log('not found entity');
        }
    }
}
