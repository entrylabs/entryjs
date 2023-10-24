class DataStore<K, V> {
    private dataMap: Map<K, V[]>;

    constructor() {
        this.dataMap = new Map<K, V[]>();
    }

    // 데이터 추가 메서드
    add(key: K, value: V): void {
        if (!this.dataMap.has(key)) {
            this.dataMap.set(key, []);
        }
        this.dataMap.get(key)!.push(value); // "!"는 값이 null 또는 undefined가 아님을 나타냅니다.
    }

    // 특정 키에 대한 모든 데이터 가져오기
    getAll(key: K): V[] {
        return this.dataMap.get(key) || [];
    }

    // 특정 키를 제외한 모든 데이터 가져오기
    getAllExcept(excludedKey: K): V[] {
        let allData: V[] = [];
        for (const [key, values] of this.dataMap.entries()) {
            if (key !== excludedKey) {
                allData = allData.concat(values);
            }
        }
        return allData;
    }

    // 모든 키와 데이터 가져오기
    getAllData(): [K, V[]][] {
        return Array.from(this.dataMap.entries());
    }

    getAllValues(): V[] {
        let allValues: V[] = [];
        for (const values of this.dataMap.values()) {
            allValues = allValues.concat(values);
        }
        return allValues;
    }

    // 특정 키의 데이터 삭제하기
    delete(key: K): void {
        this.dataMap.delete(key);
    }

    deleteItemByKeyAndValue(key: K, value: V): boolean {
        const valuesForKey = this.dataMap.get(key);
        if (!valuesForKey) {
            return false;
        }

        const index = valuesForKey.indexOf(value);
        if (index === -1) {
            return false;
        }

        valuesForKey.splice(index, 1);

        if (valuesForKey.length === 0) {
            this.dataMap.delete(key);
        }

        return true;
    }

    // 모든 데이터 삭제하기
    clear(): void {
        this.dataMap.clear();
    }
}

export default DataStore;
