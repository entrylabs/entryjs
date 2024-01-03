import {
    renderSoundEditor,
    loadSoundByUrl,
    loadSound,
    clearSound,
    clearHistory,
    registExportFunction,
    unregistExportFunction,
    undo,
    redo,
    isModified,
    getAudioBuffer,
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

interface IObject {
    _id: string;
    id: string;
}

interface ILastSound {
    sound: ISound;
    object: IObject;
}

class SoundEditor {
    sound?: ISound;
    object?: IObject;
    lastChangeSoundInfo?: ILastSound;

    constructor(soundView: HTMLDivElement) {
        this.initialize(soundView);
    }

    initialize(soundView: HTMLDivElement) {
        renderSoundEditor(soundView);
        Entry.addEventListener('soundSelected', this.changeSound.bind(this));
        Entry.addEventListener('soundUnselected', this.clearSound.bind(this));
        Entry.addEventListener('saveCompleteSound', this.saveAfterEvent.bind(this));
        registExportFunction(this.saveSound.bind(this));
    }

    getEntryAudioBuffer(id: string) {
        if (!Entry.soundQueue) {
            return;
        }
        return Entry.soundQueue.getResult(id);
    }

    async updateSound(sound: ISound, object: IObject) {
        try {
            this.sound = sound;
            this.object = object;
            const audioBuffer = this.getEntryAudioBuffer(sound.id);
            if (!audioBuffer) {
                Entry.dispatchEvent('startLoading', 'loading');
                await loadSoundByUrl(sound.path);
            } else {
                loadSound(audioBuffer);
            }
        } catch (e) {
            console.error(e);
        } finally {
            Entry.dispatchEvent('endLoading');
        }
    }

    /**
     * 이 메서드는 소리와 오브젝트를 매개변수로 받아,
     * 소리가 없거나 소리의 경로가 없는 경우를 제외하고 현재 소리를 업데이트합니다.
     * 만약 변경 사항이 있다면, 사용자에게 저장할지 확인한 후,
     * 오디오 버퍼를 얻고 소리를 저장합니다.
     * 변경 사항이 없다면, 소리와 오브젝트를 업데이트합니다.
     * 메서드 실행 중에 오류가 발생하면, 오류를 콘솔에 기록합니다.
     *
     * @param {ISound} sound - 업데이트할 소리
     * @param {IObject} object - 오브젝트
     */
    changeSound(sound: ISound, object: IObject) {
        try {
            if (!sound || !sound.path || (this.sound && this.sound.id === sound.id)) {
                return;
            }
            if (isModified()) {
                Entry.modal
                    .confirm(Lang.Menus.save_modified_shape)
                    .then(async (result: boolean) => {
                        if (result) {
                            this.lastChangeSoundInfo = { sound, object };
                            this.saveSound(await getAudioBuffer(), false);
                        } else {
                            clearHistory();
                            this.updateSound(sound, object);
                        }
                    });
            } else {
                this.updateSound(sound, object);
            }
        } catch (e) {
            console.error(e);
        }
    }

    clearSound() {
        this.sound = null;
        this.object = null;
        clearSound();
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

    saveSound(audioBuffer: AudioBuffer, isSelect: boolean = true) {
        if (!audioBuffer) {
            return;
        }
        clearHistory();
        Entry.dispatchEvent(
            'saveSoundBuffer',
            this.audioBufferToWav(audioBuffer),
            {
                ...this.sound,
                objectId: this.object.id,
            },
            isSelect
        );
    }

    saveAfterEvent() {
        const { sound, object } = this.lastChangeSoundInfo;
        if (sound && object) {
            this.updateSound(sound, object);
        }
        this.lastChangeSoundInfo = null;
    }

    destory() {
        unregistExportFunction();
    }
}

export default SoundEditor;
