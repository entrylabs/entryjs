'use strict';

import _range from 'lodash/range';

(function () {
    Entry.wizwingcontrollerlite = new (class wizwingcontrollerlite {
        constructor() {
            this.id = '69.1';
            this.name = 'wizwingcontrollerlite';
            this.url = 'http://www.wizwing.co.kr/';
            this.imageName = 'wizwingcontrollerlite.png';
            this.title = {
                ko: '위즈윙 코딩드론 R4 조종기',
                en: 'wizwing coding drone R4 controller',
            };
            this.duration = 32;
            this.blockMenuBlocks = [
                'Wizwing_Drone_Controller_connect',
                'Wizwing_Drone_Controller_takeoff',
                'Wizwing_Drone_Controller_land',
                'Wizwing_Drone_Controller_throttle',
                'Wizwing_Drone_Controller_elevator',
                'Wizwing_Drone_Controller_aileron',
                'Wizwing_Drone_Controller_rudder',
                'Wizwing_Drone_Controller_funled',
                'Wizwing_Drone_Controller_flip',
                'Wizwing_Drone_Controller_speed',
                'Wizwing_Drone_Controller_emergency',
                'Wizwing_Drone_Controller_opt',
                'Wizwing_Drone_Controller_gyroreset',
                'Wizwing_Drone_Controller_headless',
                'Wizwing_Drone_Controller_diagonal',
                'Wizwing_Drone_Controller_circularflight',
                'Wizwing_Drone_Controller_photoflight',
            ];
            this.portData = {
                baudRate: 9600,
                duration: 32,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 512,
                constantServing: false,
            };
            this.readablePorts = [];
            this.remainValue = null;
            this.setZero();
        }

        setZero() {
            this.port = new Array(14).fill(0);
            this.digitalValue = new Array(14).fill(0);
            this.remoteDigitalValue = new Array(14).fill(0);
            this.analogValue = new Array(6).fill(0);
            this.readablePorts = _range(0, 19);

            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        handleLocalData(data) {
            for (let i = 0; i < 32; i++) {
                let chunk;
                if (!this.remainValue) {
                    chunk = data[i];
                } else {
                    chunk = this.remainValue;
                    i--;
                }

                if (chunk === SOME_EXPECTED_RESPONSE) {
                    console.log('Takeoff command acknowledged by drone.');
                } else {
                    console.log('Unexpected response from drone:', chunk);
                }

                if (chunk >> 7) {
                    if ((chunk >> 6) & 1) {
                        const nextChunk = data[i + 1];
                        if (!nextChunk && nextChunk !== 0) {
                            this.remainValue = chunk;
                        } else {
                            this.remainValue = null;

                            const port = (chunk >> 3) & 7;
                            this.analogValue[port] = ((chunk & 7) << 7) + (nextChunk & 127);
                        }
                        i++;
                    } else {
                        const port = (chunk >> 2) & 15;
                        this.digitalValue[port] = chunk & 1;
                    }
                }
            }
        }

        requestLocalData() {
            const queryString = [];
            const readablePorts = this.readablePorts;

            const commandStr = Entry.hw.sendQueue['COMMAND'];
            if (commandStr) {
                for (let i = 0; i < commandStr.length; i++) {
                    queryString.push(commandStr.charCodeAt(i));
                }
                delete Entry.hw.sendQueue['COMMAND'];
            }

            if (readablePorts) {
                for (const i in readablePorts) {
                    const query = (5 << 5) + (readablePorts[i] << 1);
                    queryString.push(query);
                }
            }
            const readablePortsValues = (readablePorts && Object.values(readablePorts)) || [];
            for (let port = 0; port < 14; port++) {
                if (readablePortsValues.indexOf(port) > -1) {
                    continue;
                }
                const value = this.remoteDigitalValue[port];
                if (value === 255 || value === 0) {
                    const query = (7 << 5) + (port << 1) + (value == 255 ? 1 : 0);
                    queryString.push(query);
                } else if (value > 0 && value < 255) {
                    let query = (6 << 5) + (port << 1) + (value >> 7);
                    queryString.push(query);
                    query = value & 127;
                    queryString.push(query);
                }
            }
            return queryString;
        }

        addReadablePort(port) {
            const idx = Entry.ArduinoLite.readablePorts.indexOf(port);
            if (idx === -1) {
                Entry.ArduinoLite.readablePorts.push(port);
            }
        }

        removeReadablePort(port) {
            const idx = Entry.ArduinoLite.readablePorts.indexOf(port);
            if (idx >= 0) {
                Entry.ArduinoLite.readablePorts.splice(idx, 1);
            }
        }

        setLanguage() {
            return {
                ko: {
                    Blocks: {
                        Wizwing_Drone_Controller_flip_f: '앞으로  ',
                        Wizwing_Drone_Controller_flip_b: '뒤로  ',
                        Wizwing_Drone_Controller_flip_l: '왼쪽으로  ',
                        Wizwing_Drone_Controller_flip_r: '오른쪽으로  ',
                    },
                    template: {
                        Wizwing_Drone_Controller_connect: '페어링(바인딩)  ',
                        Wizwing_Drone_Controller_takeoff: '자동이륙  ',
                        Wizwing_Drone_Controller_land: '자동착륙  ',
                        Wizwing_Drone_Controller_throttle: '스로틀 %1만큼 %2ms  ',
                        Wizwing_Drone_Controller_elevator: '엘리베이터 %1만큼 %2ms  ',
                        Wizwing_Drone_Controller_aileron: '에일러론 %1만큼 %2ms  ',
                        Wizwing_Drone_Controller_rudder: '러더 %1만큼 %2 ms  ',
                        Wizwing_Drone_Controller_funled: '7색 LED 색 변경  ',
                        Wizwing_Drone_Controller_flip: '360도회전 %1  ',
                        Wizwing_Drone_Controller_speed: '속도조절 %1 단 ',
                        Wizwing_Drone_Controller_emergency: '모터긴급정지  ',
                        Wizwing_Drone_Controller_opt: '비전센서 on/off  ',
                        Wizwing_Drone_Controller_gyroreset: '자이로 초기화  ',
                        Wizwing_Drone_Controller_headless: '헤드리스 모드 on/off  ',
                        Wizwing_Drone_Controller_diagonal: '엘리베이터%1 에일러론%2 %3ms   ',
                        Wizwing_Drone_Controller_circularflight: '엘리베이터%1 러더%2 %3ms   ',
                        Wizwing_Drone_Controller_photoflight: '에일러론%1 러더%2 %3ms   ',
                    },
                    Device: {
                        Wizwing_Drone_Controller: '위즈윙 코딩드론 R4 조종기',
                    },
                    Menus: {
                        Wizwing_Drone_Controller: '위즈윙 코딩드론 R4 조종기',
                    },
                    Helper: {
                        Wizwing_Drone_Controller_connect: '페어링(바인딩)  ',
                        Wizwing_Drone_Controller_takeoff: '자동 이륙  ',
                        Wizwing_Drone_Controller_land: '자동 착륙  ',
                        Wizwing_Drone_Controller_throttle: '드론이 상승/ 하강합니다  ',
                        Wizwing_Drone_Controller_elevator: '드론이 앞/뒤로 이동합니다  ',
                        Wizwing_Drone_Controller_aileron: '드론이 좌/우로 이동합니다  ',
                        Wizwing_Drone_Controller_rudder: '드론이 좌/우로 회전합니다.  ',
                        Wizwing_Drone_Controller_funled: '7색 LED 색 변경  ',
                        Wizwing_Drone_Controller_flip: '360도회전 %1   ',
                        Wizwing_Drone_Controller_speed: '속도 %1 단 ',
                        Wizwing_Drone_Controller_emergency: '모터긴급정지  ',
                        Wizwing_Drone_Controller_opt: '비전센서 on/off  ',
                        Wizwing_Drone_Controller_gyroreset: '자이로 초기화  ',
                        Wizwing_Drone_Controller_headless: '헤드리스 모드  ',
                        Wizwing_Drone_Controller_diagonal: '대각선으로 이동  ',
                        Wizwing_Drone_Controller_circularflight: '선회비행  ',
                        Wizwing_Drone_Controller_photoflight: '촬영비행  ',
                    },
                },
                en: {
                    template: {
                        Wizwing_Drone_Controller_connect: 'Fairing(Binding)',
                        Wizwing_Drone_Controller_takeoff: 'Auto Takeoff ',
                        Wizwing_Drone_Controller_land: 'Auto Landing ',
                        Wizwing_Drone_Controller_throttle: 'thottle %1 time %2ms  ',
                        Wizwing_Drone_Controller_elevator: 'elevator %1 time %2ms  ',
                        Wizwing_Drone_Controller_aileron: 'aileron %1 time %2ms  ',
                        Wizwing_Drone_Controller_rudder: 'rudder %1 time %2ms  ',
                        Wizwing_Drone_Controller_funled: '7-color LED color change  ',
                        Wizwing_Drone_Controller_flip: '%1  360 flip  ',
                        Wizwing_Drone_Controller_speed: 'Speed adjustment %1',
                        Wizwing_Drone_Controller_emergency: 'Emergency Stop ',
                        Wizwing_Drone_Controller_opt: 'vision sensor on/off  ',
                        Wizwing_Drone_Controller_gyroreset: 'Gyro Reset ',
                        Wizwing_Drone_Controller_headless: 'Headless Mode ',
                        Wizwing_Drone_Controller_diagonal: 'diagonal Mode ',
                        Wizwing_Drone_Controller_circularflight: 'circularflight Mode ',
                        Wizwing_Drone_Controller_photoflight: 'photoflight Mode ',
                    },
                    Device: {
                        Wizwing_Drone_Controller: 'wizwingdroncontroller',
                    },
                    Menus: {
                        Wizwing_Drone_Controller: 'WizwingDronController',
                    },
                },
            };
        }

        initializeBlocks() {
            Entry.hwLite
                .connect()
                .then(() => {
                    if (!Entry.hwLite.serial) {
                        console.error('Serial object is not defined. Please check the connection.');
                        return;
                    }

                    Entry.getMainGenerator().getBlocks = this.getBlocks.bind(this);

                    Entry.addEventListener('blockCompleted', () => {
                        Entry.getMainGenerator().nextBlock();
                    });
                })
                .catch((error) => {
                    console.error('Failed to connect to hardware:', error);
                });
        }

        getBlocks() {
            return {
                Wizwing_Drone_Controller_connect: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    params: [],
                    def: { params: [], type: 'Wizwing_Drone_Controller_connect' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'mapping_start';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 1100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },
                Wizwing_Drone_Controller_takeoff: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,

                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    params: [],
                    def: { params: [], type: 'Wizwing_Drone_Controller_takeoff' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'takeoff';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        console.log(`Sending command: ${command}`);

                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);

                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 4000);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },
                Wizwing_Drone_Controller_land: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    params: [],
                    def: { params: [], type: 'Wizwing_Drone_Controller_land' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'land';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        console.log(`Sending command: ${command}`);

                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 3000);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },
                Wizwing_Drone_Controller_throttle: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                    ],
                    def: {
                        params: [null, null],
                        type: 'Wizwing_Drone_Controller_throttle',
                    },
                    paramsKeyMap: {
                        STICK: 0,
                        TIME: 1,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        let stick = script.getNumberValue('STICK', script) * 5;
                        let time = script.getNumberValue('TIME', script);

                        if (stick > 500) {
                            stick = 500;
                        } else if (stick < -500) {
                            stick = -500;
                        }

                        if (stick >= 0) {
                            const command1 = `up ${stick} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer = Buffer.from(command1, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else {
                            stick = stick * -1;
                            const command2 = `down ${stick} ${time}\r`;
                            console.log('Constructed command:', command2);
                            const commandBuffer = Buffer.from(command2, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command2);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        }

                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_elevator: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                    ],
                    def: {
                        params: [null, null],
                        type: 'Wizwing_Drone_Controller_elevator',
                    },
                    paramsKeyMap: {
                        STICK: 0,
                        TIME: 1,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        let stick = script.getNumberValue('STICK', script) * 5;
                        let time = script.getNumberValue('TIME', script);

                        if (stick > 500) {
                            stick = 500;
                        } else if (stick < -500) {
                            stick = -500;
                        }

                        if (stick >= 0) {
                            const command1 = `forward ${stick} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer = Buffer.from(command1, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else {
                            stick = stick * -1;
                            const command2 = `back ${stick} ${time}\r`;
                            console.log('Constructed command:', command2);
                            const commandBuffer = Buffer.from(command2, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command2);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        }

                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_aileron: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                    ],
                    def: {
                        params: [null, null],
                        type: 'Wizwing_Drone_Controller_aileron',
                    },
                    paramsKeyMap: {
                        STICK: 0,
                        TIME: 1,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        let stick = script.getNumberValue('STICK', script) * 5;
                        let time = script.getNumberValue('TIME', script);

                        if (stick > 500) {
                            stick = 500;
                        } else if (stick < -500) {
                            stick = -500;
                        }

                        if (stick >= 0) {
                            const command1 = `right ${stick} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer = Buffer.from(command1, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else {
                            stick = stick * -1;
                            const command2 = `left ${stick} ${time}\r`;
                            console.log('Constructed command:', command2);
                            const commandBuffer = Buffer.from(command2, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command2);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        }

                        return script.callReturn();
                    },
                },
                Wizwing_Drone_Controller_rudder: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                    ],
                    def: {
                        params: [null, null],
                        type: 'Wizwing_Drone_Controller_rudder',
                    },
                    paramsKeyMap: {
                        STICK: 0,
                        TIME: 1,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        let stick = script.getNumberValue('STICK', script) * 5;
                        let time = script.getNumberValue('TIME', script);

                        if (stick > 500) {
                            stick = 500;
                        } else if (stick < -500) {
                            stick = -500;
                        }

                        if (stick >= 0) {
                            const command1 = `cw ${stick} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer = Buffer.from(command1, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else {
                            stick = stick * -1;
                            const command2 = `ccw ${stick} ${time}\r`;
                            console.log('Constructed command:', command2);
                            const commandBuffer = Buffer.from(command2, 'utf8');
                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command2);
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        }

                        return script.callReturn();
                    },
                },
                Wizwing_Drone_Controller_funled: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    params: [],
                    def: { params: [], type: 'Wizwing_Drone_Controller_funled' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'funled';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 1100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_flip: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.Wizwing_Drone_Controller_flip_f, 'f'],
                                [Lang.Blocks.Wizwing_Drone_Controller_flip_b, 'b'],
                                [Lang.Blocks.Wizwing_Drone_Controller_flip_l, 'l'],
                                [Lang.Blocks.Wizwing_Drone_Controller_flip_r, 'r'],
                            ],
                            value: 'f',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [null],
                        type: 'Wizwing_Drone_Controller_flip',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const direction = script.getField('DIRECTION');
                        const command = `flip ${direction}\r`;
                        const commandBuffer = Buffer.from(command, 'utf8');

                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 4100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_speed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    def: {
                        params: [null],
                        type: 'Wizwing_Drone_Controller_speed',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const direction = script.getField('DIRECTION');
                        const command = `speed ${direction}\r`;
                        const commandBuffer = Buffer.from(command, 'utf8');

                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 1100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },
                Wizwing_Drone_Controller_emergency: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    params: [],
                    def: { params: [], type: 'Wizwing_Drone_Controller_emergency' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'emergency';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 1100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },
                Wizwing_Drone_Controller_opt: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    params: [],
                    def: { params: [], type: 'Wizwing_Drone_Controller_opt' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'opt';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 1100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_gyroreset: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    params: [],
                    def: { params: [], type: 'Wizwing_Drone_Controller_gyroreset' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'gyroreset';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 1100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_headless: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    params: [],
                    def: { params: [null], type: 'Wizwing_Drone_Controller_headless' },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        const command = 'headless';
                        const commandBuffer = Buffer.from(
                            encodeURIComponent(command) + '\r',
                            'utf8'
                        );
                        if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                            Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer, false);
                            console.log('Command sent using sendAsyncWithThrottle:', command);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(script.callReturn());
                                }, 1100);
                            });
                        } else {
                            console.log('Serial writer not found.');
                        }
                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_diagonal: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                    ],
                    def: {
                        params: [null, null, null],
                        type: 'Wizwing_Drone_Controller_diagonal',
                    },
                    paramsKeyMap: {
                        STICK1: 0,
                        STICK2: 1,
                        TIME: 2,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        let stick1 = script.getNumberValue('STICK1', script) * 5;
                        let stick2 = script.getNumberValue('STICK2', script) * 5;
                        let time = script.getNumberValue('TIME', script);

                        if (stick1 > 500) {
                            stick1 = 500;
                        } else if (stick1 < -500) {
                            stick1 = -500;
                        }

                        if (stick2 > 500) {
                            stick2 = 500;
                        } else if (stick2 < -500) {
                            stick2 = -500;
                        }

                        if (stick1 >= 0 && stick2 >= 0) {
                            const command1 = `forward ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `right ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else if (stick1 >= 0 && stick2 < 0) {
                            stick2 = stick2 * -1;

                            const command1 = `forward ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `left ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else if (stick1 < 0 && stick2 >= 0) {
                            stick1 = stick1 * -1;
                            const command1 = `back ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `right ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else {
                            stick1 = stick1 * -1;
                            stick2 = stick2 * -1;
                            const command1 = `back ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `left ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        }

                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_circularflight: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                    ],
                    def: {
                        params: [null, null, null],
                        type: 'Wizwing_Drone_Controller_circularflight',
                    },
                    paramsKeyMap: {
                        STICK1: 0,
                        STICK2: 1,
                        TIME: 2,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        let stick1 = script.getNumberValue('STICK1', script) * 5;
                        let stick2 = script.getNumberValue('STICK2', script) * 5;
                        let time = script.getNumberValue('TIME', script);

                        if (stick1 > 500) {
                            stick1 = 500;
                        } else if (stick1 < -500) {
                            stick1 = -500;
                        }

                        if (stick2 > 500) {
                            stick2 = 500;
                        } else if (stick2 < -500) {
                            stick2 = -500;
                        }

                        if (stick1 >= 0 && stick2 >= 0) {
                            const command1 = `forward ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `cw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else if (stick1 >= 0 && stick2 < 0) {
                            stick2 = stick2 * -1;

                            const command1 = `forward ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `ccw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else if (stick1 < 0 && stick2 >= 0) {
                            stick1 = stick1 * -1;
                            const command1 = `back ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `cw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else {
                            stick1 = stick1 * -1;
                            stick2 = stick2 * -1;
                            const command1 = `back ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `ccw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        }

                        return script.callReturn();
                    },
                },

                Wizwing_Drone_Controller_photoflight: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                        { type: 'Block', accept: 'string' },
                    ],
                    def: {
                        params: [null, null, null],
                        type: 'Wizwing_Drone_Controller_photoflight',
                    },
                    paramsKeyMap: {
                        STICK1: 0,
                        STICK2: 1,
                        TIME: 2,
                    },
                    class: 'wizwing',
                    isNotFor: ['wizwingcontrollerlite'],
                    func(sprite, script) {
                        let stick1 = script.getNumberValue('STICK1', script) * 5;
                        let stick2 = script.getNumberValue('STICK2', script) * 5;
                        let time = script.getNumberValue('TIME', script);

                        if (stick1 > 500) {
                            stick1 = 500;
                        } else if (stick1 < -500) {
                            stick1 = -500;
                        }

                        if (stick2 > 500) {
                            stick2 = 500;
                        } else if (stick2 < -500) {
                            stick2 = -500;
                        }

                        if (stick1 >= 0 && stick2 >= 0) {
                            const command1 = `right ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `cw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else if (stick1 >= 0 && stick2 < 0) {
                            stick2 = stick2 * -1;

                            const command1 = `right ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `ccw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else if (stick1 < 0 && stick2 >= 0) {
                            stick1 = stick1 * -1;
                            const command1 = `left ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `cw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        } else {
                            stick1 = stick1 * -1;
                            stick2 = stick2 * -1;
                            const command1 = `left ${stick1} ${time}\r`;
                            console.log('Constructed command:', command1);
                            const commandBuffer1 = Buffer.from(command1, 'utf8');

                            const command11 = `ccw ${stick2} ${time}\r`;
                            console.log('Constructed command:', command11);
                            const commandBuffer11 = Buffer.from(command11, 'utf8');

                            if (Entry.hwLite && Entry.hwLite.serial && Entry.hwLite.serial.writer) {
                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer1, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command1);

                                Entry.hwLite.serial.sendAsyncWithThrottle(commandBuffer11, false);
                                console.log('Command sent using sendAsyncWithThrottle:', command11);

                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(script.callReturn());
                                    }, time + 1100);
                                });
                            } else {
                                console.log('Serial writer not found.');
                            }
                        }

                        return script.callReturn();
                    },
                },
            };
        }
    })();
})();

module.exports = Entry.wizwingcontrollerlite;
