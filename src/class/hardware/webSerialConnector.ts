import { EntryHWLiteBaseModule } from 'types';
import HardwareLite from '../hw_lite';
import WebApiConnector from './webApiConnector';
import throttle from 'lodash/throttle';

const Buffer = require('buffer/').Buffer;

class LineBreakTransformer {
    private container: string;
    constructor() {
        this.container = '';
    }

    transform(chunk: string, controller: any) {
        try {
            this.container += chunk;
            // @ts-ignore
            const lines = this.container.split(Entry.hwLite?.hwModule?.delimeter || '\r\n');
            this.container = lines.pop();
            lines.forEach((line) => controller.enqueue(line));
        } catch (e) {
            controller.enqueue(chunk);
        }
    }

    flush(controller: any) {
        controller.enqueue(this.container);
    }
}

export default class WebSerialConnector extends WebApiConnector {
    private writer: any; // SerialPort.writer;
    private reader: any; //SerialPort.reader;
    private hwModule: EntryHWLiteBaseModule; // > 추후 전용 타입으로 변경
    private port: any;
    private connectionType: 'ascii' | 'bytestream' | undefined;
    private writableStream: any;
    private isSendAsyncRun: boolean;
    private hwLite: HardwareLite;
    private sendAsyncWithThrottle: any;

    constructor(hwModule: EntryHWLiteBaseModule, hwLite: HardwareLite) {
        super();
        this.hwLite = hwLite;
        this.hwModule = hwModule;
        this.isSendAsyncRun = false;
        this.hwLite.setStatus('disconnected');
        Entry.addEventListener('beforeStop', this.checkConditionBeforeStop.bind(this));
        this.sendAsyncWithThrottle = throttle(this.sendAsync, this.hwModule.duration);
    }

    async connect() {
        // @ts-ignore
        const port = await navigator.serial.requestPort();
        const { portData } = this.hwModule || {};
        await port.open(
            portData || {
                baudRate: 9600,
                dataBits: 8,
                parity: 'none',
                bufferSize: 256,
                stopBits: 1,
            }
        );
        this.port = port;
        const encoder = new TextEncoderStream();
        const writable = port.writable;

        this.connectionType = portData?.connectionType;
        if (portData?.writeAscii || portData?.connectionType === 'ascii') {
            const writableStream = encoder.readable.pipeTo(writable);
            this.writableStream = writableStream;
            this.writer = encoder.writable.getWriter();
        } else {
            this.writer = port.writable.getWriter();
        }

        let readable = this.port.readable;
        if (portData?.readAscii || this.connectionType === 'ascii') {
            readable = readable.pipeThrough(new TextDecoderStream());
        }
        if (this.hwModule?.delimeter || this.connectionType === 'ascii') {
            readable = readable.pipeThrough(new TransformStream(new LineBreakTransformer()));
        }
        this.reader = readable.getReader();
    }

    async disconnect() {
        // INFO: 디바이스가 제거되었을 때, reader만 단독 예외처리
        try {
            await this.reader?.cancel().catch((error: any) => {
                console.error(error);
            });

            await this.writer?.close();
            if (this.connectionType === 'ascii' && this.writableStream) {
                await this.writableStream;
            }
        } catch (err) {
            console.error(err);
        } finally {
            await this.port?.close();
            this.port = null;
            this.reader = null;
            this.writer = null;
            this.writableStream = null;
            this.hwModule = null;
        }
    }

    async initialDevice() {
        if (this.hwModule.initialHandshake) {
            const result = await this.hwModule.initialHandshake();
            if (!result) {
                throw new Error('Handshake Error : 디바이스와 연결에 실패하였습니다.');
            }
        }
        if (this.hwModule.portData?.constantServing) {
            this.constantServing();
        }
    }

    /**
     * 디바이스와 1회성 통신
     * @param data
     * @returns Promise resolves to resulting message
     */
    async sendAsync(data?: Buffer | string, isResetReq?: boolean, callback?: Function) {
        if (this.isSendAsyncRun) {
            return;
        } else {
            this.isSendAsyncRun = true;
        }
        if (!data || this.hwLite.getStatus() !== 'connected') {
            return;
        }
        // @ts-ignore
        const encodedData = typeof data === 'string' ? data : Buffer.from(data, 'utf8');

        try {
            if (this.hwLite.getStatus() !== 'connected') {
                Entry.toast.alert(
                    Lang.Msgs.hw_connection_failed_title,
                    Lang.Msgs.hw_connection_failed_desc,
                    false
                );
                throw new Error('HARDWARE LITE NOT CONNECTED');
            }
            await this.writer.write(encodedData);
            if (isResetReq) {
                this.isSendAsyncRun = false;
                return;
            }
            const { value, done } = await this.reader.read();
            if (callback) {
                return callback(value);
            }
            this.hwLite._updatePortData();
            return value;
        } catch (err) {
            console.error(err);
            this.hwLite.getConnectFailedMenu();
        } finally {
            this.isSendAsyncRun = false;
        }
    }

    async constantServing() {
        try {
            if (this.hwLite.getStatus() === 'disconnected') {
                return;
            }
            if (this.hwModule?.portData?.constantServing !== 'ReadOnly') {
                const reqLocal = this.hwModule?.requestLocalData();
                if (reqLocal && this.hwLite.getStatus() === 'connected') {
                    if (Entry.engine.isState('run')) {
                        this.writer.write(Buffer.from(reqLocal));
                    }
                }
            }

            const { value, done } = await this.reader.read();
            if (done) {
                this.hwLite.getConnectFailedMenu();
                return;
            }
            this.hwModule?.handleLocalData(value);
            this.hwLite._updatePortData();

            setTimeout(() => {
                this.constantServing();
            }, this.hwModule.duration || 0);
        } catch (error) {
            console.error(error);
            this.hwLite.getConnectFailedMenu();
            return;
        }
    }

    async readPortData() {
        try {
            if (this.hwLite.getStatus() === 'connected' && Entry.engine.isState('run')) {
                const { value, done } = await this.reader.read();

                if (!value) {
                    this.reader.cancel();
                    throw new Error("reader's value is undefined. check device");
                }
                return value;
            }
        } catch (error) {
            console.error(error);
            this.hwLite.getConnectFailedMenu();
        }
    }

    async writePortData(data: string) {
        if (data && this.hwLite.getStatus() === 'connected') {
            const result = await this.writer.write(Buffer.from(data));
        }
    }

    async removeSerialPort() {
        try {
            // INFO: 디바이스가 제거되었을 때, reader만 단독 예외처리
            await this.reader?.cancel().catch((error: any) => {
                console.error(error);
            });

            await this.writer?.close();
            if (this.connectionType === 'ascii' && this.writableStream) {
                await this.writableStream;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await this.port?.close();
            this.port = null;
            this.reader = null;
            this.writer = null;
            this.writableStream = null;
        }
    }

    // engine 동작중 에러 발생시 호출, 디바이스에 read, write가 모두 안되는 것이 전제
    async handleConnectErrorInEngineRun() {
        // INFO: Engin.toggleStop에서 setZero가 실행되지 않도록 상태변경
        if (this.hwLite.getStatus() === 'willDisconnect') {
            return;
        }
        this.hwLite.setStatus('willDisconnect');
        if (Entry.engine.isState('run')) {
            await Entry.engine.toggleStop();
        }
        await this.removeSerialPort();
        this.hwLite.getConnectFailedMenu();
        Entry.toast.alert(
            Lang.Msgs.hw_connection_failed_title,
            Lang.Msgs.hw_connection_failed_desc,
            false
        );
    }

    update() {
        if (this.hwLite.getStatus() !== 'connected') {
            console.error('Cannot update hwLite queue. Check connection status.');
            return;
        }
        if (this.hwModule?.portData?.constantServing) {
            const reqLocal = this.hwModule?.requestLocalData();
            if (reqLocal) {
                this.writer.write(Buffer.from(reqLocal));
            }
        }
    }

    sendAsciiAsBuffer(asciiStr: string) {
        this.writer.write(Buffer.from(asciiStr, 'utf8'));
    }

    checkConditionBeforeStop() {
        this.isSendAsyncRun = false;
    }
}
