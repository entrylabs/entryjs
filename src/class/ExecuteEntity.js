function none() {}

function pauseCall(f) {
    return new Proxy(f, {
        apply: (target, that, args) => {
            console.log('??? apply', target, that, args);
            return Reflect.apply(target, that, args);
            // target.call(that, ...args);
        },
    });
}

function getCloneEntity(entity) {
    return new Proxy(entity, {
        get: (target, name) => {
            const result = target[name];
            if (result instanceof Function) {
                if (Entry.engine.isState('run')) {
                    return result;
                    // }
                    // else if (Entry.engine.isState('pause')) {
                    //     return pauseCall(result);
                } else {
                    return none;
                }
            } else {
                return result;
            }
        },
    });
}
// -----> 비동기 실행
// -----> 일시정지
// -----> 비동기 결과물 처리
// -----> 실행

// 1안 ) 비동기 실행이 동작 안한다.
// 2안 ) 비동기 이므로 일시정지에도 비동기 결과물은 보여준다.
// 3안 ) 비동기 결과물을 어딘가에 저장해놨다가 실행히 되면 그때 몽땅적용.

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
            this.entityMap.delete(entity);
        } else {
            console.log('not found entity');
        }
    }
}
