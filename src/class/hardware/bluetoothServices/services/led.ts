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

import { ServiceHelper } from '../service-helper';

/**
 * @hidden
 */
export enum LedCharacteristic {
    ledMatrixState = 'e95d7b77-251d-470a-a062-fa1922dfa9a8',
    ledText = 'e95d93ee-251d-470a-a062-fa1922dfa9a8',
    scrollingDelay = 'e95d0d2d-251d-470a-a062-fa1922dfa9a8',
}

/**
 * LED matrix structure
 */
export type LedMatrix = [
    [boolean, boolean, boolean, boolean, boolean],
    [boolean, boolean, boolean, boolean, boolean],
    [boolean, boolean, boolean, boolean, boolean],
    [boolean, boolean, boolean, boolean, boolean],
    [boolean, boolean, boolean, boolean, boolean]
];

/**
 * LED Service
 */
export class LedService {
    /**
     * @hidden
     */
    public static uuid = 'e95dd91d-251d-470a-a062-fa1922dfa9a8';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<LedService> {
        return new LedService(service);
    }

    private helper: ServiceHelper;

    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService) {
        this.helper = new ServiceHelper(service);
    }

    /**
     * Write text to the LED matrix
     * @param text Te text to display
     */
    public async writeText(text: string): Promise<void> {
        const encoded = this.encodeString(text);
        return this.helper.setCharacteristicValue(LedCharacteristic.ledText, encoded);
    }

    /**
     * Read matrix state
     */
    public async readMatrixState(): Promise<LedMatrix> {
        const view = await this.helper.getCharacteristicValue(LedCharacteristic.ledMatrixState);
        return this.viewToLedMatrix(view);
    }

    /**
     * Write matrix state
     * @param state The matrix data to set
     */
    public async writeMatrixState(state: LedMatrix): Promise<void> {
        const view = this.ledMatrixToView(state);
        return this.helper.setCharacteristicValue(LedCharacteristic.ledMatrixState, view);
    }

    /**
     * Get scrolling delay
     */
    public async getScrollingDelay(): Promise<number> {
        const view = await this.helper.getCharacteristicValue(LedCharacteristic.scrollingDelay);
        return view.getUint16(0, true);
    }

    /**
     * Set scrolling delay
     * @param delay The delay to set (milliseconds)
     */
    public async setScrollingDelay(delay: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, delay, true);
        return this.helper.setCharacteristicValue(LedCharacteristic.scrollingDelay, view);
    }

    private encodeString(text: string): ArrayBuffer {
        const buffer = new ArrayBuffer(text.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < text.length; i++) {
            view[i] = text.charCodeAt(i);
        }
        return buffer;
    }

    private viewToLedMatrix(view: DataView): LedMatrix {
        const matrix: boolean[][] = [];
        for (let i = 0; i < 5; i++) {
            matrix[i] = this.byteToBoolArray(view.getUint8(i));
        }
        return matrix as LedMatrix;
    }

    private byteToBoolArray(byte: number): boolean[] {
        const bools = [false, false, false, false, false];
        for (let i = 0; i < bools.length; i++) {
            bools[i] = (byte & 1) === 1;
            byte >>= 1;
        }
        return bools.reverse();
    }

    private ledMatrixToView(matrix: LedMatrix): DataView {
        const view = new DataView(new ArrayBuffer(5));
        for (let i = 0; i < 5; i++) {
            view.setUint8(i, this.boolArrayToByte(matrix[i]));
        }
        return view;
    }

    private boolArrayToByte(bools: boolean[]): number {
        return bools.reduce((byte, bool) => (byte << 1) | (bool ? 1 : 0), 0);
    }
}
