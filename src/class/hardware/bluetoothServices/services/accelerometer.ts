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

import { EventDispatcher, TypedDispatcher } from '../event-dispatcher';
import { ServiceHelper } from '../service-helper';

/**
 * @hidden
 */
export enum AccelerometerCharacteristic {
    accelerometerData = 'e95dca4b-251d-470a-a062-fa1922dfa9a8',
    accelerometerPeriod = 'e95dfb24-251d-470a-a062-fa1922dfa9a8',
}

/**
 * Data received from the accelerometer
 */
export interface AccelerometerData {
    /**
     * Force in direction X
     */
    x: number;
    /**
     * Force in direction Y
     */
    y: number;
    /**
     * Force in direction Z
     */
    z: number;
}

/**
 * The sample period to read accelerometer data (milliseconds)
 */
export type AccelerometerPeriod = 1 | 2 | 5 | 10 | 20 | 80 | 160 | 640;

/**
 * Events raised by the accelerometer service
 */
export interface AccelerometerEvents {
    /**
     * @hidden
     */
    newListener: keyof AccelerometerEvents;
    /**
     * @hidden
     */
    removeListener: keyof AccelerometerEvents;
    /**
     * Accelerometer data changed event
     */
    accelerometerdatachanged: AccelerometerData;
}

/**
 * Accelerometer Service
 */
export class AccelerometerService extends (EventDispatcher as new () => TypedDispatcher<
    AccelerometerEvents
>) {
    public static serviceName = 'AccelerometerService';
    /**
     * @hidden
     */
    public static uuid = 'e95d0753-251d-470a-a062-fa1922dfa9a8';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<AccelerometerService> {
        const bluetoothService = new AccelerometerService(service);
        await bluetoothService.init();
        return bluetoothService;
    }

    private helper: ServiceHelper;

    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService) {
        super();
        //@ts-ignore
        this.helper = new ServiceHelper(service, this);
    }

    private async init() {
        await this.helper.handleListener(
            'accelerometerdatachanged',
            AccelerometerCharacteristic.accelerometerData,
            this.accelerometerDataChangedHandler.bind(this)
        );
    }

    /**
     * Read acceleromter data
     */
    public async readAccelerometerData(): Promise<AccelerometerData> {
        const view = await this.helper.getCharacteristicValue(
            AccelerometerCharacteristic.accelerometerData
        );
        return this.dataViewToAccelerometerData(view);
    }

    /**
     * Get accelerometer sample period
     */
    public async getAccelerometerPeriod(): Promise<AccelerometerPeriod> {
        const view = await this.helper.getCharacteristicValue(
            AccelerometerCharacteristic.accelerometerPeriod
        );
        return view.getUint16(0, true) as AccelerometerPeriod;
    }

    /**
     * Set accelerometer sample period
     * @param frequency The frequency interval to use
     */
    public async setAccelerometerPeriod(frequency: AccelerometerPeriod): Promise<void> {
        const view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, frequency, true);
        return this.helper.setCharacteristicValue(
            AccelerometerCharacteristic.accelerometerPeriod,
            view
        );
    }

    private accelerometerDataChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const value = this.dataViewToAccelerometerData(view);
        this.dispatchEvent('accelerometerdatachanged', value);
    }

    private dataViewToAccelerometerData(view: DataView): AccelerometerData {
        return {
            x: view.getInt16(0, true) / 1000.0,
            y: view.getInt16(2, true) / 1000.0,
            z: view.getInt16(4, true) / 1000.0,
        };
    }
}
