import ExtraBlockUtils from '../util/extrablockUtils';
import '../playground/blocks/block_ai_utilize_audio';
import '../playground/blocks/block_ai_utilize_tts';
import '../playground/blocks/block_ai_utilize_translate';
import '../playground/blocks/block_ai_utilize_video';
import '../playground/blocks/block_ai_utilize_gesture_recognition';
import '../playground/blocks/block_ai_utilize_pose_landmarker';
import '../playground/blocks/block_ai_utilize_face_landmarker';
import '../playground/blocks/block_ai_utilize_object_detector';

export default class AIUtilize {
    constructor(playground) {
        this.playground = playground;
    }

    init() {
        const blockObject = {};
        Object.entries(Entry.AI_UTILIZE_BLOCK).forEach(([key, value]) => {
            if (key === 'video') {
                Entry.AI_UTILIZE_BLOCK_LIST_DEPRECATED.video = value;
            } else {
                Entry.AI_UTILIZE_BLOCK_LIST[key] = value;
            }
            Entry.ALL_AI_UTILIZE_BLOCK_LIST[key] = value;
            if ('getBlocks' in value) {
                Object.assign(blockObject, value.getBlocks());
            }
        });
        Entry.block = Object.assign(Entry.block, blockObject);
    }

    banAllAIUtilizeBlock() {
        ExtraBlockUtils.banAllBlocks(this.playground, Entry.ALL_AI_UTILIZE_BLOCK_LIST);
    }

    banAIUtilizeBlocks(aiUtilizeNames = []) {
        ExtraBlockUtils.banBlocks(
            aiUtilizeNames,
            Entry.ALL_AI_UTILIZE_BLOCK_LIST,
            (aiUtilizeTypes) => Entry.do('objectRemoveAIUtilizeBlocks', aiUtilizeTypes).isPass(true)
        );
    }

    isActive(aiUtilizeName) {
        return ExtraBlockUtils.isActive(aiUtilizeName, Entry.ALL_AI_UTILIZE_BLOCK_LIST);
    }

    addAIUtilizeBlocks(blockNames) {
        Entry.do('objectAddAIUtilizeBlocks', blockNames);
    }

    getAIUtilizes(blockList) {
        return ExtraBlockUtils.getExtras(blockList, 'category_ai_utilize');
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
