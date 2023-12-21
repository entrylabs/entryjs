import {
    renderSoundEditor,
    loadSoundByUrl,
    loadSound,
    clearAudio,
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
}

export default SoundEditor;
