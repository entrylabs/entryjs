exports.memoizeClearByTime = function(func, time) {
    if(!func.time || performance.now() - func.time > time) {
        func.cache.clear();
        func.time = performance.now();
    }
}