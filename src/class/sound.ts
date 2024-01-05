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
import toWav from 'audiobuffer-to-wav';

interface ISound {
    duration: number;
    ext: string;
    id: string;
    filename: string;
    fileurl: string;
    name: string;
    path: string;
    objectId?: string;
}

interface IObject {
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

    saveSound(audioBuffer: AudioBuffer, isSelect: boolean = true) {
        if (!audioBuffer) {
            return;
        }
        clearHistory();
        Entry.dispatchEvent(
            'saveSoundBuffer',
            toWav(audioBuffer),
            {
                ...this.sound,
                objectId: this.object.id,
            },
            isSelect
        );
    }

    saveAfterEvent(soundInfo: ISound) {
        let sound: ISound;
        let object: IObject;

        if (soundInfo) {
            sound = soundInfo;
            object = {
                id: soundInfo.objectId,
            };
        } else if (this.lastChangeSoundInfo) {
            sound = this.lastChangeSoundInfo.sound;
            object = this.lastChangeSoundInfo.object;
        }

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
