import mediaPipeUtils from '../../util/mediaPipeUtils';

const MediaPipeUtils = mediaPipeUtils.getInstance();
Entry.MediaPipeUtils = MediaPipeUtils;

module.exports = {
    getBlocks() {
        const params = {
            getCommonIndicator() {
                return {
                    type: 'Indicator',
                    img: 'block_icon/ai_utilize_icon.svg',
                    size: 11,
                };
            },
            getOnOff() {
                return {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.video_show_video, 'on'],
                        [Lang.Blocks.video_hide_video, 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                };
            },
        };

        return {
            media_pipe_draw_webcam: {
                template: '비디오 화면 %1 %2',
                color: EntryStatic.colorSet.block.default.AI_UTILIZE,
                outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                skeleton: 'basic',
                statements: [],
                params: [params.getOnOff(), params.getCommonIndicator()],
                events: {},
                def: {
                    type: 'media_pipe_draw_webcam',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'media_pipe',
                isNotFor: ['gestureRecognition'],
                async func(sprite, script) {
                    const value = script.getField('VALUE');
                    if (!MediaPipeUtils.isInitialized) {
                        await MediaPipeUtils.initialize();
                    }
                    MediaPipeUtils.cameraSwitch(value);
                    return script.callReturn();
                },
            },
        };
    },
};
