import {
    renderSoundEditor,
    loadSoundByUrl,
    loadSound,
    clearAudio,
    registExportFunction,
    unregistExportFunction,
    undo,
    redo,
} from '@entrylabs/sound-editor';

interface ISound {
    _id: string;
    duration: number;
    ext: string;
    id: string;
    filename: string;
    fileurl: string;
    name: string;
    path: string;
}

class SoundEditor {
    constructor(soundView: HTMLDivElement) {
        this.initialize(soundView);
    }

    initialize(soundView: HTMLDivElement) {
        renderSoundEditor(soundView);
        Entry.addEventListener('soundSelected', this.changeSound.bind(this));
        Entry.addEventListener('soundUnselected', this.clearSound.bind(this));
        registExportFunction(this.saveSound.bind(this));
    }

    getEntryAudioBuffer(id: string) {
        if (!Entry.soundQueue) {
            return;
        }
        return Entry.soundQueue.getResult(id);
    }

    async changeSound(sound: ISound) {
        try {
            if (!sound || !sound.path) {
                return;
            }
            const audioBuffer = this.getEntryAudioBuffer(sound.id);
            if (!audioBuffer) {
                Entry.dispatchEvent('startLoading', 'loading');
                await loadSoundByUrl(sound.path);
            } else {
                loadSound(audioBuffer);
            }
        } catch (e) {
        } finally {
            Entry.dispatchEvent('endLoading');
        }
    }

    clearSound() {
        clearAudio();
    }

    audioBufferToArrayBuffer(audioBuffer: AudioBuffer) {
        const numberOfChannels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * numberOfChannels * 2; // 16-bit PCM
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);

        for (let channel = 0; channel < numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            let offset = channel * 2;

            for (let i = 0; i < channelData.length; i++) {
                const sample = Math.max(-1, Math.min(1, channelData[i])); // Clamp to -1 to 1
                // eslint-disable-next-line max-len
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true); // 16-bit PCM
                offset += numberOfChannels * 2;
            }
        }

        return buffer;
    }

    writeUTFBytes(view: DataView, offset: number, string: string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    audioBufferToWav(audioBuffer: AudioBuffer) {
        const numOfChan = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * numOfChan * 2 + 44; // 16-bit PCM
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);

        // RIFF 헤더
        this.writeUTFBytes(view, 0, 'RIFF');
        view.setUint32(4, 44 + audioBuffer.length * numOfChan * 2, true);
        this.writeUTFBytes(view, 8, 'WAVE');
        // FMT 서브청크
        this.writeUTFBytes(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // FMT 청크의 크기
        view.setUint16(20, 1, true); // 오디오 포맷 (1은 PCM)
        view.setUint16(22, numOfChan, true);
        view.setUint32(24, audioBuffer.sampleRate, true);
        view.setUint32(28, audioBuffer.sampleRate * 2 * numOfChan, true); // 바이트 레이트
        view.setUint16(32, numOfChan * 2, true);
        view.setUint16(34, 16, true); // 샘플 비트 깊이
        // 데이터 서브청크
        this.writeUTFBytes(view, 36, 'data');
        view.setUint32(40, audioBuffer.length * numOfChan * 2, true);

        // 오디오 데이터 작성
        let offset = 44;
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let channel = 0; channel < numOfChan; channel++) {
                const sample = audioBuffer.getChannelData(channel)[i];
                const x = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
                view.setInt16(offset, x, true);
                offset += 2;
            }
        }

        return buffer;
    }

    saveSound(audioBuffer: AudioBuffer) {
        Entry.dispatchEvent('saveSoundBuffer', this.audioBufferToWav(audioBuffer));
    }

    destory() {
        console.log('sound destory');
        unregistExportFunction();
    }
}

export default SoundEditor;
