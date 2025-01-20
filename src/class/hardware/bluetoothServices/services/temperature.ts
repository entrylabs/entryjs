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

import { TypedDispatcher, EventDispatcher } from '../event-dispatcher';
import { ServiceHelper } from '../service-helper';

/**
 * @hidden
 */
export enum TemperatureCharacteristic {
    temperature = 'e95d9250-251d-470a-a062-fa1922dfa9a8',
    temperaturePeriod = 'e95d1b25-251d-470a-a062-fa1922dfa9a8',
}

/**
 * Events raised by the temperature service
 */
export interface TemperatureEvents {
    /**
     * @hidden
     */
    newListener: keyof TemperatureEvents;
    /**
     * @hidden
     */
    removeListener: keyof TemperatureEvents;
    /**
     * Temperature changed event
     */
    temperaturechanged: number;
}

/**
 * Temperature Service
 */
export class TemperatureService extends (EventDispatcher as new () => TypedDispatcher<
    TemperatureEvents
>) {
    public static serviceName = 'TemperatureService';
    /**
     * @hidden
     */
    public static uuid = 'e95d6100-251d-470a-a062-fa1922dfa9a8';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<TemperatureService> {
        const bluetoothService = new TemperatureService(service);
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
            'temperaturechanged',
            TemperatureCharacteristic.temperature,
            this.temperatureChangedHandler.bind(this)
        );
    }

    /**
     * Read temperature
     */
    public async readTemperature(): Promise<number> {
        const view = await this.helper.getCharacteristicValue(
            TemperatureCharacteristic.temperature
        );
        return view.getInt8(0);
    }

    /**
     * Get temperature sample period
     */
    public async getTemperaturePeriod(): Promise<number> {
        const view = await this.helper.getCharacteristicValue(
            TemperatureCharacteristic.temperaturePeriod
        );
        return view.getUint16(0, true);
    }

    /**
     * Set temperature sample period
     * @param frequency The frequency to use (milliseconds)
     */
    public async setTemperaturePeriod(frequency: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, frequency, true);
        return await this.helper.setCharacteristicValue(
            TemperatureCharacteristic.temperaturePeriod,
            view
        );
    }

    private temperatureChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        this.dispatchEvent('temperaturechanged', view.getInt8(0));
    }
}
