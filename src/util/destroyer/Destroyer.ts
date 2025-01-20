export interface IDestroyer {
    destroy(): void;
}

export class Destroyer implements IDestroyer {
    private _items: IDestroyer[] = [];

    add(item: IDestroyer): void {
        if (item == this) {
            throw new Error("Can't add self.");
        }
        this._items.push(item);
    }

    remove(item: IDestroyer): void {
        const i = this._items.indexOf(item);
        if (i == -1) {
            return;
        }
        this._items.splice(i, 1);
    }

    destroy() {
        const LEN = this._items.length;
        for (let i = 0; i < LEN; i++) {
            this._items[i].destroy();
        }
        this._items = [];
    }
}
