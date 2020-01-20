import audioUtils from './audioUtils';
import io from 'socket.io-client';

const GATEWAY_CONNECT_TIMEOUT = 5000;

const DEFAULT_ADDR = `${window.location.hostname}`;

export function voiceApiConnect(addr = DEFAULT_ADDR, language = 'Kor', cb) {
    return new Promise((resolve, reject) => {
        const client = io(`https://${addr}`, {
            query: `language=${language}`,
            secure: true,
            reconnect: true,
            rejectUnauthorized: false,
        });
        // client.onerror = function(error) {
        //     console.log('Connect Error: ' + JSON.stringify(error));
        // };
        // client.on('open', () => {
        //     console.log('NSASR Voice Server Connected');
        //     resolve(client);
        // });
        client.on('connect', () => {
            console.log('NSASR Voice Server Connected');
            resolve(client);
        });
        client.on('disconnect', () => {
            Entry.engine.hideAllAudioPanel();
            console.log('closed');
            audioUtils.isRecording = false;
        });

        socket.on('connect_error', (error) => {
            console.error('connect_error', error);
            reject(error);
        });
        socket.on('connect_timeout', (timeout) => {
            console.error('connect_timeout', timeout);
            reject(timeout);
        });
        socket.on('error', (error) => {
            console.error('error', error);
            reject(error);
        });
    });
}
