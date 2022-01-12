import audioUtils from './audioUtils';
import io from 'socket.io-client';

const GATEWAY_CONNECT_TIMEOUT = 5000;

const DEFAULT_ADDR = {
    hostname: window.origin,
    path: '/vc',
};

export function voiceApiConnect(addr = DEFAULT_ADDR, language = 'Kor', cb) {
    return new Promise((resolve, reject) => {
        const client = io(addr.hostname, {
            path: addr.path,
            query: `language=${language}`,
            secure: true,
            reconnect: true,
            rejectUnauthorized: false,
            timeout: GATEWAY_CONNECT_TIMEOUT,
            transports: ['websocket', 'polling'],
        });

        client.on('open', () => {
            console.log('NSASR Voice Server Connected');
            resolve(client);
        });

        client.on('connect', () => {
            console.log('socket connected');
        });

        client.on('disconnect', () => {
            console.log('closed');
            Entry.engine.hideAllAudioPanel();
            audioUtils.isRecording = false;
        });

        let isFirst = true;
        client.on('connect_error', (error) => {
            if (isFirst) {
                isFirst = false;
                client.io.opts.transports = ['polling', 'websocket'];
            } else {
                console.error('connect_error', error);
                Entry.engine.hideAllAudioPanel();
                audioUtils.isRecording = false;
                reject(error);
            }
        });
        client.on('connect_timeout', (timeout) => {
            console.error('connect_timeout', timeout);
            Entry.engine.hideAllAudioPanel();
            audioUtils.isRecording = false;
            reject(timeout);
        });
        client.on('error', (error) => {
            console.error('error', error);
            Entry.engine.hideAllAudioPanel();
            audioUtils.isRecording = false;
            reject(error);
        });
    });
}
