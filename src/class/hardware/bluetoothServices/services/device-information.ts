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
export enum DeviceInformationCharacteristic {
    modelNumber = '00002a24-0000-1000-8000-00805f9b34fb',
    serialNumber = '00002a25-0000-1000-8000-00805f9b34fb',
    firmwareRevision = '00002a26-0000-1000-8000-00805f9b34fb',
    hardwareRevision = '00002a27-0000-1000-8000-00805f9b34fb',
    manufacturer = '00002a29-0000-1000-8000-00805f9b34fb',
}

/**
 * Device information structure
 */
export interface DeviceInformation {
    /**
     * Model Number
     */
    modelNumber?: string;
    /**
     * Serial Number
     */
    serialNumber?: string;
    /**
     * Firmware Revision
     */
    firmwareRevision?: string;
    /**
     * Hardware Revision
     */
    hardwareRevision?: string;
    /**
     * Manufacturer Name
     */
    manufacturer?: string;
}

/**
 * Device Information Service
 */
export class DeviceInformationService {
    public static serviceName = 'DeviceInformationService';
    /**
     * @hidden
     */
    public static uuid = '0000180a-0000-1000-8000-00805f9b34fb';

    /**
     * @hidden
     */
    public static async create(
        service: BluetoothRemoteGATTService
    ): Promise<DeviceInformationService> {
        return new DeviceInformationService(service);
    }

    private helper: ServiceHelper;

    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService) {
        this.helper = new ServiceHelper(service);
    }

    /**
     * Read device information
     */
    public async readDeviceInformation(): Promise<DeviceInformation> {
        const info: DeviceInformation = {};

        const modelNumber = await this.readStringCharacteristic(
            DeviceInformationCharacteristic.modelNumber
        );
        if (modelNumber) info.modelNumber = modelNumber;

        const serialNumber = await this.readStringCharacteristic(
            DeviceInformationCharacteristic.serialNumber
        );
        if (serialNumber) info.serialNumber = serialNumber;

        const firmwareRevision = await this.readStringCharacteristic(
            DeviceInformationCharacteristic.firmwareRevision
        );
        if (firmwareRevision) info.firmwareRevision = firmwareRevision;

        const hardwareRevision = await this.readStringCharacteristic(
            DeviceInformationCharacteristic.hardwareRevision
        );
        if (hardwareRevision) info.hardwareRevision = hardwareRevision;

        const manufacturer = await this.readStringCharacteristic(
            DeviceInformationCharacteristic.manufacturer
        );
        if (manufacturer) info.manufacturer = manufacturer;

        return info;
    }

    private async readStringCharacteristic(
        uuid: BluetoothCharacteristicUUID
    ): Promise<string | undefined> {
        try {
            const view = await this.helper.getCharacteristicValue(uuid);
            const buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
            return String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)));
        } catch (_e) {
            return undefined;
        }
    }
}
