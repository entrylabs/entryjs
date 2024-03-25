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
export enum MagnetometerCharacteristic {
    magnetometerData = 'e95dfb11-251d-470a-a062-fa1922dfa9a8',
    magnetometerPeriod = 'e95d386c-251d-470a-a062-fa1922dfa9a8',
    magnetometerBearing = 'e95d9715-251d-470a-a062-fa1922dfa9a8',
    magnetometerCalibration = 'e95db358-251d-470a-a062-fa1922dfa9a8',
}

/**
 * Data received from the magnetometer
 */
export interface MagnetometerData {
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
 * Magnetometer calibation state
 */
export enum MagnetometerCalibration {
    /**
     * Unknown state
     */
    unknown = 0,
    /**
     * Calibration has been requestes
     */
    requested = 1,
    /**
     * Calibration completed
     */
    completed = 2,
    /**
     * Calibration had an error
     */
    errored = 3,
}

/**
 * The sample period to read magnetometer data (milliseconds)
 */
export type MagnetometerPeriod = 1 | 2 | 5 | 10 | 20 | 80 | 160 | 640;

/**
 * Events raised by the magnetometer service
 */
export interface MagnetometerEvents {
    /**
     * @hidden
     */
    newListener: keyof MagnetometerEvents;
    /**
     * @hidden
     */
    removeListener: keyof MagnetometerEvents;
    /**
     * Magnetometer data changed event
     */
    magnetometerdatachanged: MagnetometerData;
    /**
     * Magnetometer bearing changed event
     */
    magnetometerbearingchanged: number;
    /**
     * Magnetometer calibration changed event
     */
    magnetometercalibrationchanged: MagnetometerCalibration;
}

/**
 * Magnetometer Service
 */
export class MagnetometerService extends (EventDispatcher as new () => TypedDispatcher<
    MagnetometerEvents
>) {
    public static serviceName = 'MagnetometerService';
    /**
     * @hidden
     */
    public static uuid = 'e95df2d8-251d-470a-a062-fa1922dfa9a8';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<MagnetometerService> {
        const bluetoothService = new MagnetometerService(service);
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
            'magnetometerdatachanged',
            MagnetometerCharacteristic.magnetometerData,
            this.magnetometerDataChangedHandler.bind(this)
        );
        await this.helper.handleListener(
            'magnetometerbearingchanged',
            MagnetometerCharacteristic.magnetometerBearing,
            this.magnetometerBearingChangedHandler.bind(this)
        );
        await this.helper.handleListener(
            'magnetometercalibrationchanged',
            MagnetometerCharacteristic.magnetometerCalibration,
            this.magnetometerCalibrationChangedHandler.bind(this)
        );
    }

    /**
     * Request magnetometer calibration
     */
    public async calibrate() {
        return this.helper.setCharacteristicValue(
            MagnetometerCharacteristic.magnetometerCalibration,
            new Uint8Array([1])
        );
    }

    /**
     * Read magnetometer data
     */
    public async readMagnetometerData(): Promise<MagnetometerData> {
        const view = await this.helper.getCharacteristicValue(
            MagnetometerCharacteristic.magnetometerData
        );
        return this.dataViewToMagnetometerData(view);
    }

    /**
     * Read magnetometer bearing
     */
    public async readMagnetometerBearing(): Promise<number | undefined> {
        const view = await this.helper.getCharacteristicValue(
            MagnetometerCharacteristic.magnetometerBearing
        );
        if (view.byteLength === 2) {
            return view.getUint16(0, true);
        }
        return undefined;
    }

    /**
     * Get magnetometer sample period
     */
    public async getMagnetometerPeriod(): Promise<MagnetometerPeriod> {
        const view = await this.helper.getCharacteristicValue(
            MagnetometerCharacteristic.magnetometerPeriod
        );
        return view.getUint16(0, true) as MagnetometerPeriod;
    }

    /**
     * Set magnetometer sample period
     * @param frequency The frequency interval to use
     */
    public async setMagnetometerPeriod(frequency: MagnetometerPeriod): Promise<void> {
        const view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, frequency, true);
        return this.helper.setCharacteristicValue(
            MagnetometerCharacteristic.magnetometerPeriod,
            view
        );
    }

    private magnetometerDataChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const value = this.dataViewToMagnetometerData(view);
        this.dispatchEvent('magnetometerdatachanged', value);
    }

    private magnetometerBearingChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        if (view.byteLength === 2) {
            this.dispatchEvent('magnetometerbearingchanged', view.getUint16(0, true));
        }
    }

    private magnetometerCalibrationChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        if (view.byteLength === 1) {
            this.dispatchEvent('magnetometercalibrationchanged', view.getUint8(
                0
            ) as MagnetometerCalibration);
        }
    }

    private dataViewToMagnetometerData(view: DataView): MagnetometerData {
        return {
            x: view.getInt16(0, true),
            y: view.getInt16(1, true),
            z: view.getInt16(2, true),
        };
    }
}
