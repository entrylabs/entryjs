'use strict';

const PromiseManager = require('../../core/promiseManager');
const { callApi } = require('../../util/common');

Entry.EXPANSION_BLOCK.emergencyMessage = {
    name: 'emergencyMessage',
    imageName: 'emergencyMessage.png',
    title: {
        ko: '재난문자',
        en: 'Disaster alert',
    },
    titleKey: 'template.emergency_message_title_text',
    description: Lang.Msgs.expansion_emergencyMessage_description,
    descriptionKey: 'Msgs.expansion_emergencyMessage_description',
    isInitialized: false,
    init() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.emergencyMessage.isInitialized = true;
    },
    api: '/api/expansionBlock/emergencyMessage',
    apiType: '01',
};

const EMERGENCY_CATEGORY_MAP = {
    info: Lang.Blocks.emergencyMessageTypeInfo,
    exigency: Lang.Blocks.emergencyMessageTypeExigency,
    urgency: Lang.Blocks.emergencyMessageTypeUrgency,
}

const getEmergencyMessage = (params, defaultValue) => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const key = `emergencyMessage-${day}-${hour}`;
    const promiseManager = new PromiseManager();
    const job = promiseManager
        // eslint-disable-next-line new-cap
        .Promise((resolve) => {
            callApi(key, {
                url: `${Entry.EXPANSION_BLOCK.emergencyMessage.api}`,
            })
                .then((result) => {
                    if (result) {
                        let items = result?.data?.body || [];
                        const category = EMERGENCY_CATEGORY_MAP?.[params?.category];
                        if (category) {
                            items = items.filter((item) => item.EMRG_STEP_NM === category);
                        }
                        console.log('items', items, params, result?.data);
                        switch (params.command) {
                            case 'count':
                                return resolve(items?.length || 0);
                            case 'get':
                                const result = items[params.index]?.[params.option];
                                if (params.option === 'REG_YMD') {
                                    return resolve(new Date(result).toLocaleString());
                                }
                                return resolve(result);
                            case 'exist':
                                return resolve(items?.length > 0);
                            default:
                                return resolve(defaultValue);
                                break;
                        }
                    }
                    return resolve(defaultValue);
                })
                .catch(() => resolve(defaultValue));
        })
        .catch(() => defaultValue);

    return job;
};

Entry.EXPANSION_BLOCK.emergencyActionGuidelines.getBlocks = function () {
    // 전체, 안전안내, 긴급재난, 위급재난
    const EmergencyMessageCategory = {
        type: 'Dropdown',
        options: [
            [Lang.Blocks.emergencyMessageTypeAll, 'all'],
            [Lang.Blocks.emergencyMessageTypeInfo, 'info'],
            [Lang.Blocks.emergencyMessageTypeExigency, 'exigency'],
            [Lang.Blocks.emergencyMessageTypeUrgency, 'urgency'],
        ],
        value: 'all',
        fontSize: 11,
        bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
        arrowColor: EntryStatic.colorSet.common.WHITE,
    };
    // 내용, 수신지역, 긴급단계, 재해구분, 생성일시
    const EmergencyMessageOptions = {
        type: 'Dropdown',
        options: [
            [Lang.Blocks.emergencyMessageContents, 'MSG_CN'],
            [Lang.Blocks.emergencyMessageRegeion, 'RCPTN_RGN_NM'],
            [Lang.Blocks.emergencyMessageStep, 'EMRG_STEP_NM'],
            [Lang.Blocks.emergencyMessageDisaster, 'DST_SE_NM'],
            [Lang.Blocks.emergencyMessageRegisterDate, 'REG_YMD'],
        ],
        value: 'MSG_CN',
        fontSize: 11,
        bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
        arrowColor: EntryStatic.colorSet.common.WHITE,
    };

    return {
        emergency_message_title: {
            template: '%1',
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.emergency_message_title_text,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: 'emergency_message_title',
            },
            class: 'emergencyMessage',
            isNotFor: ['emergencyMessage'],
            events: {},
        },
        count_emergency_message: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [EmergencyMessageCategory],
            events: {},
            def: {
                params: [EmergencyMessageCategory.value],
                type: 'count_emergency_message',
            },
            pyHelpDef: {
                params: ['A&value'],
                type: 'count_emergency_message',
            },
            paramsKeyMap: {
                CATEGORY: 0,
            },
            class: 'emergencyMessage',
            isNotFor: ['emergencyMessage'],
            func(sprite, script) {
                const category = script.getField('CATEGORY', script);
                return getEmergencyMessage({
                    command: 'count',
                    category,
                }, 0);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        get_emergency_message: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                EmergencyMessageCategory,
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                EmergencyMessageOptions,
            ],
            events: {},
            def: {
                params: [EmergencyMessageCategory.value, null, EmergencyMessageOptions.value],
                type: 'get_emergency_message',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value'],
                type: 'get_emergency_message',
            },
            paramsKeyMap: {
                CATEGORY: 0,
                NUMBER: 1,
                OPTION: 2,
            },
            class: 'emergencyMessage',
            isNotFor: ['emergencyMessage'],
            func(sprite, script) {
                const number = script.getStringValue('NUMBER', script);
                const category = script.getField('CATEGORY', script);
                const option = script.getField('OPTION', script);
                return getEmergencyMessage({
                    command: 'get',
                    category,
                    index: number,
                    option,
                });
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        check_emergency_message: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [EmergencyMessageCategory],
            events: {},
            def: {
                params: [EmergencyMessageCategory.value],
                type: 'check_emergency_message',
            },
            pyHelpDef: {
                params: ['B&value', null],
                type: 'check_emergency_message',
            },
            paramsKeyMap: {
                CATEGORY: 0,
            },
            class: 'emergencyMessage',
            isNotFor: ['emergencyMessage'],
            async func(sprite, script) {
                const category = script.getField('CATEGORY', script);
                return getEmergencyMessage({
                    command: 'exist',
                    category,
                });
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
