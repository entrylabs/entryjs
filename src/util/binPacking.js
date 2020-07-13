import _cloneDeep from 'lodash/cloneDeep';

class BinPacking {
    constructor(width, height) {
        this.MAX_WIDTH = width;
        this.MAX_HEIGHT = height;
        this.itemList = new Map();
        this.spaceList = new Set();
        this.spaceList.add({ x: 0, y: 0, w: width, h: height });
    }

    reset() {
        this.spaceList = new Set();
        this.spaceList.add({ x: 0, y: 0, w: this.MAX_WIDTH, h: this.MAX_HEIGHT });
    }

    isIntersect(r1, r2) {
        if (r1.x >= r2.x + r2.w) {
            return false;
        }
        if (r1.x + r1.w <= r2.x) {
            return false;
        }
        if (r1.y >= r2.y + r2.h) {
            return false;
        }
        if (r1.y + r1.h <= r2.y) {
            return false;
        }
        return true;
    }

    isInclude(r1, r2) {
        if (
            r2.x >= r1.x &&
            r2.x + r2.w <= r1.x + r1.w &&
            r2.y >= r1.y &&
            r2.y + r2.h <= r1.y + r1.h
        ) {
            return true;
        }
        return false;
    }

    getIntersection(r1, r2) {
        const rect = {};
        rect.x = Math.max(r1.x, r2.x);
        rect.y = Math.max(r1.y, r2.y);
        rect.w = Math.min(r1.x + r1.w, r2.x + r2.w) - rect.x;
        rect.h = Math.min(r1.y + r1.h, r2.y + r2.h) - rect.y;
        return rect;
    }

    check(item) {
        let isFound = false;

        let findSpace;
        for (const space of this.spaceList) {
            findSpace = space;
            if (item.x || item.y) {
                const { x = 0, y = 0, w, h } = item;
                if (x >= space.x && y >= space.y && w <= space.w && h <= space.h) {
                    isFound = true;
                    break;
                }
            } else if (item.w <= space.w && item.h <= space.h) {
                isFound = true;
                break;
            }
        }

        if (!item.x && !item.y) {
            item.x = findSpace.x;
            item.y = findSpace.y;
        }
        if (isFound) {
            const newList = new Set();
            for (const sp of this.spaceList) {
                if (this.isInclude(item, sp)) {
                    this.spaceList.delete(sp);
                    continue;
                }
                if (this.isIntersect(item, sp)) {
                    const rt = {
                        x: sp.x,
                        y: sp.y,
                        w: sp.w,
                        h: item.y - sp.y,
                    };
                    const rb = {
                        x: sp.x,
                        y: item.y + item.h,
                        w: sp.w,
                        h: sp.y + sp.h - (item.y + item.h),
                    };
                    const rl = {
                        x: sp.x,
                        y: sp.y,
                        w: item.x - sp.x,
                        h: sp.h,
                    };
                    const rr = {
                        x: item.x + item.w,
                        y: sp.y,
                        w: sp.x + sp.w - (item.x + item.w),
                        h: sp.h,
                    };

                    if (rt.w > 0 && rt.h > 0) {
                        newList.add(rt);
                    }
                    if (rl.w > 0 && rl.h > 0) {
                        newList.add(rl);
                    }
                    if (rb.w > 0 && rb.h > 0) {
                        newList.add(rb);
                    }
                    if (rr.w > 0 && rr.h > 0) {
                        newList.add(rr);
                    }

                    this.spaceList.delete(sp);
                    continue;
                }
            }

            //remove invalidate spaces
            for (const s1 of this.spaceList) {
                for (const s2 of newList) {
                    if (s1 != s2 && this.isInclude(s1, s2)) {
                        newList.delete(s2);
                        continue;
                    }
                }
            }

            for (const s1 of newList) {
                for (const s2 of newList) {
                    if (s1 != s2 && this.isInclude(s1, s2)) {
                        newList.delete(s2);
                        continue;
                    }
                }
            }

            if (newList.size) {
                for (const list of newList) {
                    this.spaceList.add(list);
                }
            }
            this.spaceList = new Set(
                [...this.spaceList].sort((a, b) => {
                    if (a.x < b.x) {
                        return -1;
                    } else if (a.x == b.x && a.y < b.y) {
                        return -1;
                    } else {
                        return 1;
                    }
                })
            );
        } else {
            item.x = Math.floor(Math.random() * (this.MAX_WIDTH - 30));
            item.y = Math.floor(Math.random() * (this.MAX_HEIGHT - 30));
        }

        return item;
    }

    add(id, x = 0, y = 0, w = 100, h = 100) {
        this.reset();
        for (const [id, item] of this.itemList) {
            this.check(_cloneDeep(item));
        }
        const item = this.check({ x, y, w, h });
        this.itemList.set(id, item);
        return item;
    }

    replace(id, x = 0, y = 0, width, height) {
        const item = this.itemList.get(id);
        item.x = x + 230;
        item.y = y + 105;
        item.w = width;
        item.h = height;
    }

    remove(id) {
        this.itemList.delete(id);
    }
}

export default BinPacking;
