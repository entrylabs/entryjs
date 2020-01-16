import audioUtils from '../../util/audioUtils';
import PromiseManager from '../../core/promiseManager';

Entry.AI_UTILIZE_BLOCK.audio = {
    name: 'audio',
    imageName: 'audio.svg',
    title: {
        ko: '오디오 감지',
        en: 'Audio Detection',
        jp: 'オーディオ検出',
    },
    titleKey: 'template.audio_title_text',
    description: Lang.Msgs.ai_utilize_audio_description,
    descriptionKey: 'Msgs.ai_utilize_audio_description',
    isInitialized: false,
    init() {
        if (this.isInitialized) {
            return;
        }
        Entry.AI_UTILIZE_BLOCK.audio.isInitialized = true;
    },
};

Entry.AI_UTILIZE_BLOCK.audio.getBlocks = function() {
    return {
        audio_title: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.audio_title_text,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: 'audio_title',
            },
            class: 'audio',
            isNotFor: ['audio'],
            events: {},
        },
        check_microphone: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'check_microphone',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'audio',
            isNotFor: ['audio'],
            async func(sprite, script) {
                return new PromiseManager().Promise(async (resolve) => {
                    const result = await audioUtils.checkUserMicAvailable();
                    resolve(result.toString());
                });
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        speech_to_text: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            events: {},
            def: {
                params: [3],
                type: 'speech_to_text',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'audio',
            isNotFor: ['audio'],
            func(sprite, script) {
                if (audioUtils.isRecording) {
                    throw new Entry.Utils.AsyncError();
                }
                audioUtils.isRecording = true;
                return new PromiseManager().Promise(async (resolve) => {
                    try {
                        if (!audioUtils.isAudioInitComplete) {
                            await audioUtils.initUserMedia();
                        }
                        const result = await audioUtils.startRecord(10 * 1000);
                        Entry.dispatchEvent('audioRecordingDone');
                        resolve(result);
                    } catch (e) {
                        console.log(e);
                        resolve('error');
                    }
                });
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        get_microphone_volume: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'get_microphone_volume',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'audio',
            isNotFor: ['audio'],
            func(sprite, script) {
                return new PromiseManager().Promise(async (resolve) => {
                    try {
                        if (!audioUtils.isAudioInitComplete) {
                            await audioUtils.initUserMedia();
                        }
                        resolve(audioUtils.currentVolume);
                    } catch (e) {
                        console.log(e);
                        resolve('error');
                    }
                });
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
