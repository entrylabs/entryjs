import audioUtils from '../../util/audioUtils';
import PromiseManager from '../../core/promiseManager';

Entry.EXPANSION_BLOCK.audio = {
    name: 'audio',
    imageName: 'audio.svg',
    title: {
        ko: '오디오 감지',
        en: 'Audio Detection',
        jp: 'オーディオ検出',
    },
    titleKey: 'template.audio_title_text',
    description: Lang.Msgs.expansion_audio_description,
    descriptionKey: 'Msgs.expansion_audio_description',
    isInitialized: false,
    init() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.audio.isInitialized = true;
    },
};

Entry.EXPANSION_BLOCK.audio.getBlocks = function() {
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
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            template: '마이크가 연결되었는가?',
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
                const result = await audioUtils.checkUserMicAvailable();
                return result.toString();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        speech_to_text: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            template: '음성을 문자로 바꾼 값',
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
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            template: '마이크 소릿값',
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
            async func(sprite, script) {
                if (!audioUtils.isAudioInitComplete) {
                    await audioUtils.initUserMedia();
                }
                return audioUtils.currentVolume;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
