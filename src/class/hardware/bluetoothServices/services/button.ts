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
export enum ButtonCharacteristic {
    buttonAState = 'e95dda90-251d-470a-a062-fa1922dfa9a8',
    buttonBState = 'e95dda91-251d-470a-a062-fa1922dfa9a8',
}

/**
 * Button state enum
 */
export enum ButtonState {
    /**
     * Button released
     */
    Release = 0,
    /**
     * Button pressed - short
     */
    ShortPress = 1,
    /**
     * Button pressed - long
     */
    LongPress = 2,
}

/**
 * Events raised by the button service
 */
export interface ButtonEvents {
    /**
     * @hidden
     */
    newListener: keyof ButtonEvents;
    /**
     * @hidden
     */
    removeListener: keyof ButtonEvents;
    /**
     * Button A state changed event
     */
    buttonastatechanged: ButtonState;
    /**
     * Button B state changed event
     */
    buttonbstatechanged: ButtonState;
}

/**
 * Button Service
 */
export class ButtonService extends (EventDispatcher as new () => TypedDispatcher<ButtonEvents>) {
    /**
     * @hidden
     */
    public static uuid = 'e95d9882-251d-470a-a062-fa1922dfa9a8';

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<ButtonService> {
        const bluetoothService = new ButtonService(service);
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
            'buttonastatechanged',
            ButtonCharacteristic.buttonAState,
            this.buttonAStateChangedHandler.bind(this)
        );
        await this.helper.handleListener(
            'buttonbstatechanged',
            ButtonCharacteristic.buttonBState,
            this.buttonBStateChangedHandler.bind(this)
        );
    }

    /**
     * Read state of button A
     */
    public async readButtonAState(): Promise<ButtonState> {
        const view = await this.helper.getCharacteristicValue(ButtonCharacteristic.buttonAState);
        return view.getUint8(0);
    }

    /**
     * Read state of button B
     */
    public async readButtonBState(): Promise<ButtonState> {
        const view = await this.helper.getCharacteristicValue(ButtonCharacteristic.buttonBState);
        return view.getUint8(0);
    }

    private buttonAStateChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        this.dispatchEvent('buttonastatechanged', view.getUint8(0));
    }

    private buttonBStateChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        this.dispatchEvent('buttonbstatechanged', view.getUint8(0));
    }
}
