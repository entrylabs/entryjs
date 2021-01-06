class Testino {
    constructor() {
        this.id = 'FF.FF';
        this.url = 'http://www.my-company.org/';
        this.name = 'Testino';
        this.imageName = 'testino.png';
        this.title = {
            ko: '테스트이노',
            en: 'testino',
        };

        this.blockMenuBlocks = ['testino_on_digital_value', 'testino_off_digital_value'];
    }

    setZero() {
        for (let i = 2; i <= 13; i++) {
            Entry.hw.sendQueue.PORT[i] = 0;
        }
        Entry.hw.update();
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    testino_on_digital_value: '디지털 핀 %1 번을 켜기 %2',
                    testino_off_digital_value: '디지털 핀 %1 번을 끄기 %2',
                },
            },
            en: {
                template: {
                    testino_on_digital_value: 'turn on digital pin %1 %2',
                    testino_off_digital_value: 'turn off digital pin %1 %2',
                },
            },
        };
    }

    getBlocks() {
        return {
            testino_on_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
                statements: [],
                params: [
                    //입력될 파라미터들의 속성을 정의
                    {
                        type: 'Block',
                        accept: 'string', //숫자만 들어가도 string 입니다. 엔트리엔 이를 구분하지 않습니다.
                    },
                    // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [
                        //파라미터에 들어갈 기본 값.
                        {
                            type: 'number',
                            params: [2],
                        },
                    ],
                    type: 'testino_on_digital_value', // 블록 상속과 관련된 값입니다. 블록명과 동일하게 해주면 됩니다.
                },
                paramsKeyMap: {
                    // 실제 블록의 로직인 func 에서 해당 인덱스의 파라미터를 가져올때 쓸 key 값
                    PORT: 0,
                },
                events: {},
                class: 'TestinoBlock', // 블록을 묶어서 보여줄 단위값. 이 값이 바뀌면 사이에 가로줄이 생깁니다.
                //isNotFor: ['Testino'], // 하드웨어가 연결되었을 경우만 블록을 보여주겠다는 판단값입니다. name 과 동일해야 합니다.
                func: (sprite, script) => {
                    // paramsKeyMap 에서 PORT 는 파라미터의 0번 인덱스 값이었습니다.
                    const portNumber = script.getNumberValue('PORT');
                    Entry.hw.sendQueue[portNumber] = 1;
                    // 값을 반환해야하는 경우는 return 할 수 있습니다.
                },
                syntax: {
                    // 파이썬 문법 변환에 사용되고 있습니다.
                    js: [],
                    py: [
                        {
                            syntax: 'Testino.turnOnDigitalPort(%1)',
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
            },
            testino_off_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [
                        {
                            type: 'number',
                            params: [2],
                        },
                    ],
                    type: 'testino_off_digital_value',
                },
                paramsKeyMap: {
                    PORT: 0,
                },
                events: {},
                class: 'TestinoBlock',
                //NotFor: ['Testino'],
                func: (sprite, script) => {
                    const portNumber = script.getNumberValue('PORT');
                    Entry.hw.sendQueue[portNumber] = 0;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Testino.turnOffDigitalPort(%1)',
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
            },
        };
    }
}

Entry.Testino = new Testino();
module.exports = Entry.Testino;
