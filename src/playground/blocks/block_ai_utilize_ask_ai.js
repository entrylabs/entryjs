'use strict';

Entry.AI_UTILIZE_BLOCK.askAI = {
    name: 'askAI',
    category: 'general',

    title: {
        ko: 'AI에게 물어보기',
        en: 'Ask AI',
        jp: 'AIに聞く',
    },

    description: '질문을 AI에게 보내고 답변을 받습니다.',

    isInitialized: false,

    init() {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;
    },
};

Entry.AI_UTILIZE_BLOCK.askAI.getBlocks = function () {
    return {
        ask_ai: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,

            skeleton: 'basic_string_field',

            template: '%1 AI에게 물어보기',

            statements: [],

            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],

            events: {},

            def: {
                params: [
                    {
                        type: 'text',
                        params: ['AI에게 말할 질문'],
                    },
                ],
                type: 'ask_ai',
            },

            pyHelpDef: {
                params: ['A&value'],
                type: 'ask_ai',
            },

            paramsKeyMap: {
                TEXT: 0,
            },

            class: 'askAI',

            isNotFor: ['askAI'],

            async func(sprite, script) {
                const text = script.getStringValue('TEXT', script);

                try {
                    const response = await fetch(
                        'https://makeaiforentry.williamsk140930.workers.dev/chat',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                message: text,
                            }),
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        return (
                            data?.error?.message ||
                            data?.error ||
                            `API 오류: ${response.status}`
                        );
                    }

                    return data.answer || '응답 없음';
                } catch (error) {
                    return `연결 오류: ${error.message}`;
                }
            },

            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'AskAI.ask(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },

            wikiClass: 'ai_utilize_ask_ai',
        },
    };
};