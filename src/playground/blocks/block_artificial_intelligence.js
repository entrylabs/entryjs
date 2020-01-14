import audioUtils from '../../util/audioUtils';
import PromiseManager from '../../core/promiseManager';

module.exports = {
    getBlocks() {
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
                events: {},
            },
            check_microphone: {
                color: EntryStatic.colorSet.block.default.EXPANSION,
                outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
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
                color: EntryStatic.colorSet.block.default.EXPANSION,
                outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
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
    },
};
