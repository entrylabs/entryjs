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
export enum UartCharacteristic {
    tx = '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    rx = '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
}

/**
 * Events raised by the UART service
 */
export interface UartEvents {
    /**
     * @hidden
     */
    newListener: keyof UartEvents;
    /**
     * @hidden
     */
    removeListener: keyof UartEvents;
    /**
     * Serial data received event
     */
    receive: Uint8Array;
    /**
     * Serial received text event
     */
    receiveText: string;
}

/**
 * UART Service
 */
export class UartService extends (EventDispatcher as new () => TypedDispatcher<UartEvents>) {
    public static serviceName = 'UartService';
    /**
     * @hidden
     */
    public static uuid = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<UartService> {
        const bluetoothService = new UartService(service);
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
            'receive',
            UartCharacteristic.tx,
            this.receiveHandler.bind(this)
        );
        await this.helper.handleListener(
            'receiveText',
            UartCharacteristic.tx,
            this.receiveTextHandler.bind(this)
        );
    }

    /**
     * Send serial data
     * @param value The buffer to send
     */
    public async send(value: BufferSource): Promise<void> {
        return this.helper.setCharacteristicValue(UartCharacteristic.rx, value);
    }

    /**
     * Send serial text
     * @param value The text to send
     */
    public async sendText(value: string): Promise<void> {
        const arrayData = value.split('').map((e: string) => e.charCodeAt(0));
        return this.helper.setCharacteristicValue(
            UartCharacteristic.rx,
            new Uint8Array(arrayData).buffer
        );
    }

    private receiveHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const value = new Uint8Array(view.buffer);
        this.dispatchEvent('receive', value);
    }

    private receiveTextHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const numberArray = Array.prototype.slice.call(new Uint8Array(view.buffer));
        const value = String.fromCharCode.apply(null, numberArray);
        this.dispatchEvent('receiveText', value);
    }
}
