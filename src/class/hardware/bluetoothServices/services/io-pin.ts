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
import { EventDispatcher, TypedDispatcher } from '../event-dispatcher';

/**
 * @hidden
 */
export enum IoPinCharacteristic {
    pinData = 'e95d8d00-251d-470a-a062-fa1922dfa9a8',
    pinAdConfiguration = 'e95d5899-251d-470a-a062-fa1922dfa9a8',
    pinIoConfiguration = 'e95db9fe-251d-470a-a062-fa1922dfa9a8',
    pwmControl = 'e95dd822-251d-470a-a062-fa1922dfa9a8',
}

const littleEndian = true;

/**
 * Pin data
 */
export interface PinData {
    /**
     * Pin number
     */
    pin: number;
    /**
     * Pin value
     */
    value: number;
}

/**
 * PWM control data
 */
export interface PwmControlData {
    /**
     * Pin number
     */
    pin: number;
    /**
     * Pin value
     */
    value: number;
    /**
     * Period (in microseconds)
     */
    period: number;
}

/**
 * Analogue/Digital Enum
 */
export enum AD {
    Digital = 0,
    Analogue = 1,
}

/**
 * Input/Output Enum
 */
export enum IO {
    Output = 0,
    Input = 1,
}

/**
 * Events raised by the magnetometer service
 */
export interface IoPinEvents {
    /**
     * @hidden
     */
    newListener: keyof IoPinEvents;
    /**
     * @hidden
     */
    removeListener: keyof IoPinEvents;
    /**
     * Pin data changed event
     */
    pindatachanged: PinData[];
}

/**
 * @hidden
 */
export class IoPinService extends (EventDispatcher as new () => TypedDispatcher<IoPinEvents>) {
    /**
     * @hidden
     */
    public static uuid = 'e95d127b-251d-470a-a062-fa1922dfa9a8';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<IoPinService> {
        const bluetoothService = new IoPinService(service);
        await bluetoothService.init();
        return bluetoothService;
    }

    /**
     * @hidden
     */
    public helper: ServiceHelper;

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
            'pindatachanged',
            IoPinCharacteristic.pinData,
            this.pinDataChangedHandler.bind(this)
        );
    }

    /**
     * Read pin data
     */
    public async readPinData(): Promise<PinData[]> {
        const view = await this.helper.getCharacteristicValue(IoPinCharacteristic.pinData);
        return this.dataViewToPinData(view);
    }

    /**
     * Write pin data
     * @param data The pin data to write
     */
    public async writePinData(data: PinData[]): Promise<void> {
        const view = this.pinDataToDataView(data);
        return this.helper.setCharacteristicValue(IoPinCharacteristic.pinData, view);
    }

    /**
     * Get pin analogue/digital configuration
     */
    public async getAdConfiguration(): Promise<AD[]> {
        const view = await this.helper.getCharacteristicValue(
            IoPinCharacteristic.pinAdConfiguration
        );
        return this.dataViewToConfig(view);
    }

    /**
     * Set pin analogue/digital configuration
     * @param config The analogue/digital configuration to set
     */
    public async setAdConfiguration(config: AD[]): Promise<void> {
        const view = this.configToDataView(config);
        return this.helper.setCharacteristicValue(IoPinCharacteristic.pinAdConfiguration, view);
    }

    /**
     * Get pin input/output configuration
     */
    public async getIoConfiguration(): Promise<IO[]> {
        const view = await this.helper.getCharacteristicValue(
            IoPinCharacteristic.pinIoConfiguration
        );
        return this.dataViewToConfig(view);
    }

    /**
     * Set pin input/output configuration
     * @param config The input/output configuration to set
     */
    public async setIoConfiguration(config: IO[]): Promise<void> {
        const view = this.configToDataView(config);
        return this.helper.setCharacteristicValue(IoPinCharacteristic.pinIoConfiguration, view);
    }

    /**
     * Set pin PWM control
     * @param data The PWM control data to set
     */
    public async setPwmControl(data: PwmControlData): Promise<void> {
        const view = this.pwmControlDataToDataView(data);
        return this.helper.setCharacteristicValue(IoPinCharacteristic.pwmControl, view);
    }

    private pinDataChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const value = this.dataViewToPinData(view);
        this.dispatchEvent('pindatachanged', value);
    }

    private dataViewToPinData(view: DataView): PinData[] {
        const data = [];
        for (let i = 0; i < view.byteLength; i += 2) {
            data.push({
                pin: view.getUint8(i),
                value: view.getUint8(i + 1),
            });
        }
        return data;
    }

    private pinDataToDataView(data: PinData[]): DataView {
        const view = new DataView(new ArrayBuffer(data.length * 2));
        data.forEach((pinData, index) => {
            view.setUint8(index * 2, pinData.pin);
            view.setUint8(index * 2 + 1, pinData.value);
        });
        return view;
    }

    private dataViewToConfig(view: DataView): number[] {
        const result: number[] = [];
        const value = (view.getUint16(0) << 8) + view.getUint8(2);

        for (let i = 0; i < 24; i++) {
            result.push(value >> i);
        }

        return result;
    }

    private configToDataView(config: number[]): DataView {
        const view = new DataView(new ArrayBuffer(3));
        let value = 0;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < config.length; i++) {
            value &= 1 << config[i];
        }

        view.setUint16(0, value >> 8, littleEndian);
        view.setUint8(2, value & 0xff);
        return view;
    }

    private pwmControlDataToDataView(data: PwmControlData): DataView {
        const view = new DataView(new ArrayBuffer(7));
        view.setUint8(0, data.pin);
        view.setUint16(1, data.value, littleEndian);
        view.setUint32(3, data.period, littleEndian);
        return view;
    }
}
