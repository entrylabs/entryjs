/*
 * micro:bit Web Bluetooth
 * Copyright (c) 2019 Rob Moran
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @hidden
 */
interface QueuedPromise {
    fn: () => Promise<any>;
    resolve: (value?: any | PromiseLike<any> | undefined) => void;
    reject: (reason?: any) => void;
}

/**
 * @hidden
 */
export class PromiseQueue {
    private queue: QueuedPromise[] = [];
    private running = 0;

    constructor(private concurrent = 1) {}

    private async pump(): Promise<void> {
        if (this.running >= this.concurrent) {
            return;
        }

        const promise = this.queue.shift();

        if (!promise) {
            return;
        }

        this.running++;

        try {
            const result = await promise.fn();
            promise.resolve(result);
        } catch (error) {
            promise.reject(error);
        }

        this.running--;
        return this.pump();
    }

    public add<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({
                fn,
                resolve,
                reject,
            });

            return this.pump();
        });
    }
}
