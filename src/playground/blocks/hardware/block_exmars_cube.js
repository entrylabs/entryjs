'use strict';

Entry.exMars_Cube = {
    id: '43.1',
    name: 'exMars_Cube',
    url: 'http://www.exmarscube.com',
    imageName: 'exmars_cube.png',
    title: {
        ko: 'eX-Mars Cube',
        en: 'eX-Mars Cube',
    },
    setZero: function() {
        // 엔트리 정지시 하드웨어 초기화 로직
    },
    delayTime: 20,
    timeouts: [],
    index: 0,
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    getIndex: function() {
        Entry.exMars_Cube.index = Entry.exMars_Cube.index + 1;
        if (Entry.exMars_Cube.index > 2000) {
            Entry.exMars_Cube.index = 1;
        }
    }
};

Entry.exMars_Cube.setLanguage = function() {
    return {
        ko: {
            template: {
                ColorRed: '빨강',
                ColorGreen: '초록',
                ColorBlue: '파랑',
                ColorYellow: '노랑',
                ColorPurple: '보라',
                ColorWhite: '하양',
                ColorSkip: '무시하기',
                ColorOff: '끄기',
                BrakeOff: '끄기',
                BrakeOn: '켜기',
                NoteC: '도',
                NoteCS: '도#',
                NoteD: '레',
                NoteDS: '레#',
                NoteE: '미',
                NoteF: '파',
                NoteFS: '파#',
                NoteG: '솔',
                NoteGS: '솔#',
                NoteA: '라',
                NoteAS: '라#',
                NoteB: '시',
                NoteRest: '쉼표',
                Scale6: '6 음계',
                Scale12: '12 음계',
                User2: '유저 2',
                User3: '유저 3',
                DirectionBrake: '멈춤',
                DirectionCW: '정방향',
                DirectionCCW: '역방향',
                DirectionPassive: '풀림',
                RecordIndex0: '노멀',
                RecordIndex1: '5 릴레이',
                RecordIndex2: '하프 블라인드',
                RecordIndex3: '풀 불라인드',
                RecordIndex4: '시간 패널티',
                RecordIndex5: '20~28 모드',
                RecordIndex6: '최소회전',
                RecordIndex7: '02 모드',
                RecordTime1: '최신',
                RecordTime2: '최신-1',
                RecordTime3: '최신-2',
                RecordTime4: '최신-3',
                RecordTime5: '최신-4',
                RecordTimeBest: '최고',
                RecordDiceNumber: '주사위 숫자',
                ModeMain: '메인',
                ModeSub: '서브',
                CellLedColor: '%1 면 %2 번 셀의 색상값',
                FaceLedColor: '%1 면의 셀 색상값',
                FaceDir: '%1 면의 회전값',
                Record: '%1 의 %2 기록',
                RecodeDice: '%1 기록',
                ModeState: '모드 상태',
                MenuInit: '모드 빠져나오기  %1',
                NonBrake: '브레이크 기능을 %1 %2',
                ResetAllFace: '모든 색상을 초기화하기 %1',
                ModeSetting: '모드를 %1 %2 로 설정하기 %3',
                CenterColorChange: '%1 면의 가운데 셀 LED 색상을 %2 으로 바꾸기 %3',
                CellColorChange: ' %1 면의 셀 색상을 %2 %3 %4 %5 %6 %7 %8 %9 으로 바꾸기 %10',
                PosDirTorChange: '%1 면을 %2 포지션, %3 방향, %4 토크로 바꾸기 %5',
                FaceRotationOnlyColor: '%1 면의 LED 색상을 %2 방향으로 %3º 만큼 회전하기 %4',
                FaceRotation: '%1 면을 %2 방향으로 %3º 만큼 회전하기 %4',
                FacesRotation: '%1 면을 %2 방향으로 %3º 만큼,  %4 면을 %5 방향으로 %6º 만큼 회전하기 %7',
                SolveCube: '%1 을 앞면으로 %2 를 %3 초 동안 풀기 %4',
                PlayMode: '%1 연주 모드로 바꾸기 %2',
                UserMode: '%1 펌웨어로 바꾸기 %2',
                PlayNote: '%1 를 %2 초 연주하기 %3',
                GetRecord: '%1 기록 가져오기 %2',
                GetRecordDice: '주사위 숫자 기록 가져오기 %1',
                AutoSolve: '자동솔빙 시작 %1',
            },
        },
        en: {
            template: {
                ColorRed: 'Red',
                ColorGreen: 'Green',
                ColorBlue: 'Blue',
                ColorYellow: 'Yellow',
                ColorPurple: 'Purple',
                ColorWhite: 'White',
                ColorSkip: 'Skip',
                ColorOff: 'Off',
                BrakeOff: 'Turn off',
                BrakeOn: 'Turn on',
                NoteC: 'C',
                NoteCS: 'C#',
                NoteD: 'D',
                NoteDS: 'D#',
                NoteE: 'E',
                NoteF: 'F',
                NoteFS: 'F#',
                NoteG: 'G',
                NoteGS: 'G#',
                NoteA: 'A',
                NoteAS: 'A#',
                NoteB: 'B',
                NoteRest: 'Rest',
                Scale6: '6 Scale',
                Scale12: '12 Scale',
                User2: 'User 2',
                User3: 'USer 3',
                DirectionBrake: 'Brake',
                DirectionCW: 'CW',
                DirectionCCW: 'CCW',
                DirectionPassive: 'Passive',
                RecordIndex0: 'Normal',
                RecordIndex1: '5 relay',
                RecordIndex2: 'Half blind',
                RecordIndex3: 'Full blind',
                RecordIndex4: 'Time penalty',
                RecordIndex5: '20~28 mode',
                RecordIndex6: 'Fewest move',
                RecordIndex7: '02 mode',
                RecordTime1: 'Latest',
                RecordTime2: 'Latest-1',
                RecordTime3: 'Latest-2',
                RecordTime4: 'Latest-3',
                RecordTime5: 'Latest-4',
                RecordTimeBest: 'Best',
                RecordDiceNumber: 'Dice number',
                ModeMain: 'Main',
                ModeSub: 'Sub',
                CellLedColor: 'LED color of %1 face %2 cell',
                FaceLedColor: 'LED color of %1 face',
                FaceDir: 'rotation value of %1 face',
                Record: '%2 record of %1',
                RecodeDice: '%1 record',                
                ModeState: 'mode state',
                MenuInit: 'Exit mode %1',
                NonBrake: '%1 the brake function %2',
                ResetAllFace: 'Initialize all colors %1',
                ModeSetting: 'Set mode to %1 %2 %3',
                CenterColorChange: 'Change the center cell LED color of %1 face to %2 %3',
                CellColorChange: 'Change the cell color of %1 face to %2  %3 %4 %5 %6 %7 %8 %9 %10',
                PosDirTorChange: 'Change %1 face to %2 position, %3 direction %4 torque %5',
                FaceRotationOnlyColor: 'Rotate the LED color of %1 face to %3º in %2 direction %4',
                FaceRotation: 'Rotate %1 face to %3º in %2 direction %4',
                FacesRotation: 'Rotate %1 face to %3º in %2 direction, %4 face to %6º in %5 direction %7',
                SolveCube: 'Solve %1 for %3 seconds with %2 as front face %4',
                PlayMode: 'Change to %1 play mode %2',
                UserMode: 'Change to %1 firmware %2',
                PlayNote: 'Play %1 for %2 seconds %3',
                GetRecord: 'Get %1 record %2',
                GetRecordDice: 'Get dice number record %1',
                AutoSolve: 'Auto solving start %1'
            },
        },
    };
};

Entry.exMars_Cube.blockMenuBlocks = [
    'GetBlock_CellLedColor',
    'GetBlock_FaceLedColor',
    'GetBlock_FaceDir',
    'GetBlock_Record',
    'GetBlock_RecordDice',
    'GetBlock_ModeState',
    'SetBlock_MenuInit',
    'SetBlock_ModeSetting',
    'SetBlock_PlayMode',
    'SetBlock_UserMode',
    'SetBlock_NonBrake',
    'SetBlock_ResetAllFace',    
    'SetBlock_CenterColorChange',
    'SetBlock_CellColorChange',
    'SetBlock_PosDirTorChange',
    'SetBlock_FaceRotationOnlyColor',
    'SetBlock_FaceRotation',
    'SetBlock_FacesRotation',
    'SetBlock_SolveCube',
    'SetBlock_PlayNote',
    'SetBlock_GetRecord',
    'SetBlock_GetRecordDice',
    'SetBlock_AutoSolve'
];

Entry.exMars_Cube.getBlocks = function() {
    return {
        //region exMars cube
        // ===================================================================================== //
        // DropDown Blocks
        // ===================================================================================== //
        DropDownBlock_FaceName_W: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.ColorWhite, '0'],
                        [Lang.template.ColorYellow, '1'],
                        [Lang.template.ColorGreen, '2'],
                        [Lang.template.ColorBlue, '3'],
                        [Lang.template.ColorRed, '4'],
                        [Lang.template.ColorPurple, '5']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                FACE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('FACE');
            }
        },
        DropDownBlock_FaceName_Y: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.ColorWhite, '0'],
                        [Lang.template.ColorYellow, '1'],
                        [Lang.template.ColorGreen, '2'],
                        [Lang.template.ColorBlue, '3'],
                        [Lang.template.ColorRed, '4'],
                        [Lang.template.ColorPurple, '5']
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                FACE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('FACE');
            }
        },
        DropDownBlock_FaceName_G: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.ColorWhite, '0'],
                        [Lang.template.ColorYellow, '1'],
                        [Lang.template.ColorGreen, '2'],
                        [Lang.template.ColorBlue, '3'],
                        [Lang.template.ColorRed, '4'],
                        [Lang.template.ColorPurple, '5']
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                FACE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('FACE');
            }
        },        
        DropDownBlock_FaceName_B: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.ColorWhite, '0'],
                        [Lang.template.ColorYellow, '1'],
                        [Lang.template.ColorGreen, '2'],
                        [Lang.template.ColorBlue, '3'],
                        [Lang.template.ColorRed, '4'],
                        [Lang.template.ColorPurple, '5']
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                FACE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('FACE');
            }
        },        
        DropDownBlock_CellName: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                CELL: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('CELL');
            }
        },
        DropDownBlock_Brake: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.BrakeOff, '0'],
                        [Lang.template.BrakeOn, '1']
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                BRAKE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('BRAKE');
            }
        },
        DropDownBlock_ModeMainNumber: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                MAIN: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('MAIN');
            }
        },
        DropDownBlock_ModeSubNumber: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                SUB: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('SUB');
            }
        },
        DropDownBlock_ColorName: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.ColorRed, '1'],
                        [Lang.template.ColorGreen, '2'],
                        [Lang.template.ColorBlue, '3'],
                        [Lang.template.ColorYellow, '4'],
                        [Lang.template.ColorPurple, '6'],
                        [Lang.template.ColorWhite, '7'],
                        [Lang.template.ColorSkip, '8'],
                        [Lang.template.ColorOff, '0']
                    ],
                    value: '7',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                COLOR: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('COLOR');
            }
        },
        DropDownBlock_ColorNameMini: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.ColorGreen, '2'],
                        [Lang.template.ColorPurple, '5'],
                        [Lang.template.ColorBlue, '3'],
                        [Lang.template.ColorRed, '4'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                ANGLE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('ANGLE');
            }
        },
        DropDownBlock_Direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.DirectionBrake, '0'],
                        [Lang.template.DirectionCW, '1'],
                        [Lang.template.DirectionCCW, '2'],
                        [Lang.template.DirectionPassive, '3']
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                DIRECTION: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('DIRECTION');
            }
        },        
        DropDownBlock_DirectionMini: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.DirectionCW, '1'],
                        [Lang.template.DirectionCCW, '2']
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                DIRECTION: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('DIRECTION');
            }
        },
        DropDownBlock_Torque: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8']
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                TORQUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('TORQUE');
            }
        },
        DropDownBlock_Angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['30', '1'],
                        ['60', '2'],
                        ['90', '3'],
                        ['120', '4'],
                        ['150', '5'],
                        ['180', '6']
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                ANGLE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('ANGLE');
            }
        },
        DropDownBlock_MovingFace: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['F', '0'],
                        ['F\'', '1'],
                        ['R', '2'],
                        ['R\'', '3'],
                        ['L', '4'],
                        ['L\'', '5'],
                        ['U', '6'],
                        ['U\'', '7'],
                        ['D', '8'],
                        ['D\'', '9'],
                        ['B', '10'],
                        ['B\'', '11']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                ANGLE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('ANGLE');
            }
        },
        DropDownBlock_PlayMode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        [Lang.template.Scale6, '0'],
                        [Lang.template.Scale12, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                ANGLE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('ANGLE');
            }
        },
        DropDownBlock_UserMode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        [Lang.template.User2, '2'],
                        [Lang.template.User3, '3'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                ANGLE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('ANGLE');
            }
        },
        DropDownBlock_Note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        [Lang.template.NoteC, '0'],
                        [Lang.template.NoteCS, '1'],
                        [Lang.template.NoteD, '2'],
                        [Lang.template.NoteDS, '3'],
                        [Lang.template.NoteE, '4'],
                        [Lang.template.NoteF, '5'],
                        [Lang.template.NoteFS, '6'],
                        [Lang.template.NoteG, '7'],
                        [Lang.template.NoteGS, '8'],
                        [Lang.template.NoteA, '9'],
                        [Lang.template.NoteAS, '10'],
                        [Lang.template.NoteB, '11'],
                        [Lang.template.NoteRest, '12']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                NOTE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('NOTE');
            }
        },
        DropDownBlock_RecordIndex: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.RecordIndex0, '0'],
                        [Lang.template.RecordIndex1, '1'],
                        [Lang.template.RecordIndex2, '2'],
                        [Lang.template.RecordIndex3, '3'],
                        [Lang.template.RecordIndex4, '4'],
                        [Lang.template.RecordIndex5, '5'],
                        [Lang.template.RecordIndex6, '6'],
                        [Lang.template.RecordIndex7, '7']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        DropDownBlock_RecordTime: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        [Lang.template.RecordTime1, '0'],
                        [Lang.template.RecordTime2, '1'],
                        [Lang.template.RecordTime3, '2'],
                        [Lang.template.RecordTime4, '3'],
                        [Lang.template.RecordTime5, '4'],
                        [Lang.template.RecordTimeBest, '5'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                TIME: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('TIME');
            }
        },
        DropDownBlock_RecordDice: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.RecordDiceNumber, '5']
                    ],
                    value: '5',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                TIME: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('TIME');
            }
        },
        DropDownBlock_Mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.ModeMain, '0'],
                        [Lang.template.ModeSub, '1']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                TIME: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('TIME');
            }
        },
        // ===================================================================================== //
        // Get Value Blocks
        // ===================================================================================== //
        GetBlock_CellLedColor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            template: Lang.template.CellLedColor,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                }
            ],
            def: {
                params: [ 
                    {
                        type: 'DropDownBlock_FaceName_W'
                    },
                    {
                        type: 'DropDownBlock_CellName'
                    }
                ],
                type: 'GetBlock_CellLedColor'
            },
            paramsKeyMap: {
                FACE: 0,
                CELL: 1
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var cell = script.getNumberValue('CELL');
                var hwData = Entry.hw.portData;

                return hwData[face][cell];
            }
        },
        GetBlock_FaceLedColor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            template: Lang.template.FaceLedColor,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                }
            ],
            def: {
                params: [ 
                    {
                        type: 'DropDownBlock_FaceName_W'
                    }
                ],
                type: 'GetBlock_FaceLedColor'
            },
            paramsKeyMap: {
                FACE: 0
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var hwData = Entry.hw.portData;

                return hwData[face];
            }
        },        
        GetBlock_FaceDir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            template: Lang.template.FaceDir,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                }
            ],
            def: {
                params: [ 
                    {
                        type: 'DropDownBlock_FaceName_W'
                    }
                ],
                type: 'GetBlock_FaceDir'
            },
            paramsKeyMap: {
                FACE: 0
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var dir = '';
                var hwData = Entry.hw.portData;

                if (hwData[6][face] == 3) {
                    dir = 'CW';
                }
                else if (hwData[6][face] == 11) {
                    dir = 'CCW'
                }
                else {
                    dir = '0'
                }
                return dir;
            }
        },
        GetBlock_Record: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            template: Lang.template.Record,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                }
            ],
            def: {
                params: [ 
                    {
                        type: 'DropDownBlock_RecordIndex'
                    },
                    {
                        type: 'DropDownBlock_RecordTime'
                    }
                ],
                type: 'GetBlock_Record'
            },
            paramsKeyMap: {
                INDEX: 0,
                TIME: 1
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var time = script.getNumberValue('TIME');
                var hwData = Entry.hw.portData;
                var s = Math.floor(hwData[index + 7][time] / 10) / 100;

                return s;
            }
        },
        GetBlock_RecordDice: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            template: Lang.template.RecodeDice,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_RecordDice'
                    }
                ],
                type: 'GetBlock_RecordDice'
            },
            paramsKeyMap: {
                TIME: 0
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var index = 7;
                var time = script.getNumberValue('TIME');
                var hwData = Entry.hw.portData;
                var s = Math.floor(hwData[index + 7][time] / 10) / 100;

                return s;
            }
        },
        
        GetBlock_ModeState: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            template: Lang.template.ModeState,
            params: [
                {
                    //type: 'Block',
                    //accept: 'string',
                    //defaultType: 'number'
                }
            ],
            def: {
                params: [
                    {
                        //type: 'DropDownBlock_Mode'
                    }
                ],
                type: 'GetBlock_ModeState'
            },
            paramsKeyMap: {
                MODE: 0
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var hwData = Entry.hw.portData;
                var s = String(hwData[16]) + String(hwData[17]);
                
                return s;
            }
        },
        // ===================================================================================== //
        // Set Value Blocks
        // ===================================================================================== //
        SetBlock_MenuInit: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.MenuInit,
             params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    null
                ],
                type: 'SetBlock_MenuInit'
            },
            paramsKeyMap:{},
            events: {},
            class: 'SetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'MenuInit',
                        index: Entry.exMars_Cube.index
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_NonBrake: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.NonBrake,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_Brake'
                    },
                    null
                ],
                type: 'SetBlock_NonBrake'
            },
            paramsKeyMap:{
                BRAKE: 0
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var brake = script.getNumberValue('BRAKE');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'NonBrake',
                        index: Entry.exMars_Cube.index,
                        data0: brake
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_ModeSetting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.ModeSetting,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_ModeMainNumber'
                    },
                    {
                        type: 'DropDownBlock_ModeSubNumber'
                    },
                    null
                ],
                type: 'SetBlock_ModeSetting'
            },
            paramsKeyMap: {
                MAIN: 0,
                SUB: 1
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var main = script.getNumberValue('MAIN');
                var sub = script.getNumberValue('SUB');

                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'ModeSetting',
                        index: Entry.exMars_Cube.index,
                        data0: main,
                        data1: sub
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_CenterColorChange: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.CenterColorChange,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_FaceName_W'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },                    
                    null
                ],
                type: 'SetBlock_CenterColorChange'
            },
            paramsKeyMap: {
                FACE: 0,
                CELL: 1
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var cell = script.getNumberValue('CELL');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'CenterColorChange',
                        index: Entry.exMars_Cube.index,
                        data0: face,
                        data1: cell
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_CellColorChange: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.CellColorChange,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_FaceName_W'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    {
                        type: 'DropDownBlock_ColorName'
                    },
                    null
                ],
                type: 'SetBlock_CellColorChange'
            },
            paramsKeyMap: {
                FACE: 0,
                CELL1: 1,
                CELL2: 2,
                CELL3: 3,
                CELL4: 4,
                CELL5: 5,
                CELL6: 6,
                CELL7: 7,
                CELL8: 8
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var cell1 = script.getNumberValue('CELL1');
                var cell2 = script.getNumberValue('CELL2');
                var cell3 = script.getNumberValue('CELL3');
                var cell4 = script.getNumberValue('CELL4');
                var cell5 = script.getNumberValue('CELL5');
                var cell6 = script.getNumberValue('CELL6');
                var cell7 = script.getNumberValue('CELL7');
                var cell8 = script.getNumberValue('CELL8');

                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'CellColorChange',
                        index: Entry.exMars_Cube.index,
                        data0: face,
                        data1: cell1,
                        data2: cell2,
                        data3: cell3,
                        data4: cell4,
                        data5: cell5,
                        data6: cell6,
                        data7: cell7,
                        data8: cell8
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_PosDirTorChange: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.PosDirTorChange,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_FaceName_W'
                    },
                    {
                        type: 'number',
                        params: ['12']
                    },
                    {
                        type: 'DropDownBlock_Direction'
                    },
                    {
                        type: 'DropDownBlock_Torque'
                    },
                    null
                ],
                type: 'SetBlock_PosDirTorChange'
            },
            paramsKeyMap: {
                FACE: 0,
                POSITION: 1,
                DIRECTION: 2,
                TORQUE: 3,
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var position = script.getNumberValue('POSITION');
                var direction = script.getNumberValue('DIRECTION');
                var torque = script.getNumberValue('TORQUE');

                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'PosDirTorChange',
                        index: Entry.exMars_Cube.index,
                        data0: face,
                        data1: position,
                        data2: direction,
                        data3: torque
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_FaceRotationOnlyColor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.FaceRotationOnlyColor,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_FaceName_Y'
                    },
                    {
                        type: 'DropDownBlock_DirectionMini'
                    },
                    {
                        type: 'DropDownBlock_Angle'
                    },
                    null
                ],
                type: 'SetBlock_FaceRotationOnlyColor'
            },
            paramsKeyMap: {
                FACE: 0,
                DIRECTION: 1,
                ANGLE: 2
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var direction = script.getNumberValue('DIRECTION');
                var angle = script.getNumberValue('ANGLE');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'FaceRotationOnlyColor',
                        index: Entry.exMars_Cube.index,
                        data0: face,
                        data1: direction,
                        data2: angle
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_FaceRotation: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.FaceRotation,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_FaceName_Y'
                    },
                    {
                        type: 'DropDownBlock_DirectionMini'
                    },
                    {
                        type: 'DropDownBlock_Angle'
                    },
                    null
                ],
                type: 'SetBlock_FaceRotation'
            },
            paramsKeyMap: {
                FACE: 0,
                DIRECTION: 1,
                ANGLE: 2
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face = script.getNumberValue('FACE');
                var direction = script.getNumberValue('DIRECTION');
                var angle = script.getNumberValue('ANGLE');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'FaceRotation',
                        index: Entry.exMars_Cube.index,
                        data0: face,
                        data1: direction,
                        data2: angle
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_FacesRotation: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.FacesRotation,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_FaceName_G'
                    },
                    {
                        type: 'DropDownBlock_DirectionMini'
                    },
                    {
                        type: 'DropDownBlock_Angle'
                    },
                    {
                        type: 'DropDownBlock_FaceName_B'
                    },
                    {
                        type: 'DropDownBlock_DirectionMini'
                    },
                    {
                        type: 'DropDownBlock_Angle'
                    },
                    null
                ],
                type: 'SetBlock_FacesRotation'
            },
            paramsKeyMap: {
                FACE1: 0,
                DIRECTION1: 1,
                ANGLE1: 2,
                FACE2: 3,
                DIRECTION2: 4,
                ANGLE2: 5
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var face1 = script.getNumberValue('FACE1');
                var direction1 = script.getNumberValue('DIRECTION1');
                var angle1 = script.getNumberValue('ANGLE1');
                var face2 = script.getNumberValue('FACE2');
                var direction2 = script.getNumberValue('DIRECTION2');
                var angle2 = script.getNumberValue('ANGLE2');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'FacesRotation',
                        index: Entry.exMars_Cube.index,
                        data0: face1,
                        data1: direction1,
                        data2: angle1,
                        data3: face2,
                        data4: direction2,
                        data5: angle2
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_SolveCube: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.SolveCube,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_ColorNameMini'
                    },
                    {
                        type: 'DropDownBlock_MovingFace'
                    },
                    {
                        type: 'number',
                        params: ['0.8']
                    },
                    null
                ],
                type: 'SetBlock_SolveCube'
            },
            paramsKeyMap: {
                COLOR: 0,
                MOVINGFACE: 1,
                TIME: 2,
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var color = script.getNumberValue('COLOR');
                var movingFace = script.getNumberValue('MOVINGFACE');
                var time = script.getNumberValue('TIME');
                if(!script.isStart) {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'SolveCube',
                        index: Entry.exMars_Cube.index,
                        data0: color,
                        data1: movingFace
                    };
                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    time = 60 / fps * time * 1000;

                    const blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        time
                    );
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            }
        },        
        SetBlock_ResetAllFace: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.ResetAllFace,
             params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    null
                ],
                type: 'SetBlock_ResetAllFace'
            },
            paramsKeyMap: {},
            events: {},
            class: 'SetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'ResetAllFace',
                        index: Entry.exMars_Cube.index
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_PlayMode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.PlayMode,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_PlayMode'
                    },
                    null
                ],
                type: 'SetBlock_PlayMode'
            },
            paramsKeyMap: {
                MODE: 0
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var mode = script.getNumberValue('MODE');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'PlayMode',
                        index: Entry.exMars_Cube.index,
                        data0: mode
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_UserMode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.UserMode,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_UserMode'
                    },
                    null
                ],
                type: 'SetBlock_UserMode'
            },
            paramsKeyMap: {
                MODE: 0
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var mode = script.getNumberValue('MODE');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'UserMode',
                        index: Entry.exMars_Cube.index,
                        data0: mode
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_PlayNote: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.PlayNote,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_Note'
                    },
                    {
                        type: 'number',
                        params: ['1']
                    },
                    null
                ],
                type: 'SetBlock_PlayNote'
            },
            paramsKeyMap: {
                NOTE: 0,
                TIME: 1
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var note = script.getNumberValue('NOTE');
                var time = script.getNumberValue('TIME');                
                
                if(!script.isStart) {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'PlayNote',
                        index: Entry.exMars_Cube.index,
                        data0: note
                    };
                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    time = 60 / fps * time * 1000;

                    const blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        time
                    );
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            }
        },
        SetBlock_GetRecord: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.GetRecord,
             params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    {
                        type: 'DropDownBlock_RecordIndex'
                    },
                    null
                ],
                type: 'SetBlock_GetRecord'
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'GetRecord',
                        index: Entry.exMars_Cube.index,
                        data0: index
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_GetRecordDice: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.GetRecordDice,
             params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    null
                ],
                type: 'SetBlock_GetRecordDice'
            },
            paramsKeyMap: {
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var index = 7;
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'GetRecord',
                        index: Entry.exMars_Cube.index,
                        data0: index
                    };
                    return script.callReturn();
                }
            }
        },
        SetBlock_AutoSolve: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.AutoSolve,
             params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            def: {
                params: [
                    null
                ],
                type: 'SetBlock_AutoSolve'
            },
            paramsKeyMap: {
            },
            events: {},
            class: 'WriteBlock',
            isNotFor: ['exMars_Cube'],
            func: function(sprite, script) {
                var index = 7;
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.exMars_Cube.removeTimeout(timer);
                    }, Entry.exMars_Cube.delayTime);
                    Entry.exMars_Cube.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1) {
                    return script;
                }
                else {
                    Entry.exMars_Cube.getIndex();
                    Entry.hw.sendQueue['SetBlock'] = {
                        name: 'GetRecord',
                        index: Entry.exMars_Cube.index,
                        data0: index
                    };
                    return script.callReturn();
                }
            }
        },
        //endregion exMars cube
    };
};

module.exports = Entry.exMars_Cube;