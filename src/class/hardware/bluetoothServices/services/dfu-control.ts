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
export enum DfuCharacteristic {
    dfuControl = 'e95d93b1-251d-470a-a062-fa1922dfa9a8',
}

/**
 * @hidden
 */
export class DfuControlService {
    public static serviceName = 'DfuControlService';
    /**
     * @hidden
     */
    public static uuid = 'e95d93b0-251d-470a-a062-fa1922dfa9a8';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<DfuControlService> {
        return new DfuControlService(service);
    }

    /**
     * @hidden
     */
    public helper: ServiceHelper;

    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService) {
        this.helper = new ServiceHelper(service);
    }

    /**
     * Request device switches to DFU mode
     */
    public requestDfu(): Promise<void> {
        return this.helper.setCharacteristicValue(
            DfuCharacteristic.dfuControl,
            new Uint8Array([1])
        );
    }

    /**
     * Request flash code
     */
    public requestFlashCode(): Promise<void> {
        return this.helper.setCharacteristicValue(
            DfuCharacteristic.dfuControl,
            new Uint8Array([2])
        );
    }
}
