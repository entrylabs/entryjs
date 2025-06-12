'use strict';
const Buffer = require('buffer').Buffer;

(function () {
    Entry.PingpongG2Lite = new (class PingpongG2 {
        constructor() {
            this.id = '350201';
            this.name = 'PingpongG2Lite';
            this.url = 'https://www.roborisen.com';
            this.title = {
                ko: '핑퐁 G2',
                en: 'Pingpong G2',
            };
            this.duration = 50;
            this.blockMenuBlocks = ['pingpong_g2_playNoteForBeats_lite'];
            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 512,
                constantServing: true,
                connectionType: 'bytestream', // or ascii
            };
            this.imageName = 'pingpong_g2_lite.png';

            this.setZero();
        }

        setZero() {
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        // 디바이스에서 값을 읽어온다.
        handleLocalData(data) {}

        //디바이스에 값을 쓴다.
        requestLocalData() {
            return null;
        }

        async initialHandshake() {
            await Entry.hwLite.serial.sendAsync(cmdReady, false, (value) => {});
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        pingpong_g2_playNoteForBeats_lite:
                            '%1 큐브의 %2 음을 %3 박자로 연주하기 %4',
                    },
                    Blocks: {
                        pingpong_g2_cube_id: [
                            ['1번', 0],
                            ['2번', 1],
                        ],
                        pingpong_g2_cube_all: [
                            ['1번', 0],
                            ['2번', 1],
                            ['모든', -1],
                        ],
                    },
                },
                en: {
                    template: {
                        pingpong_g2_playNoteForBeats_lite: '%1 cube play note %2 for %3 beats %4',
                    },
                    Blocks: {
                        pingpong_g2_cube_id: [
                            ['1st', 0],
                            ['2nd', 1],
                        ],
                        pingpong_g2_cube_all: [
                            ['1st', 0],
                            ['2nd', 1],
                            ['All', -1],
                        ],
                    },
                },
            };
        }

        getBlocks() {
            return {
                pingpong_g2_playNoteForBeats_lite: {
                    //'%1 큐브의 %2 번 음을 %3 박자로 연주하기 %4',
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: Lang.Blocks.pingpong_g2_cube_id,
                            value: 0,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: Lang.Blocks.pingpong_opts_music_notes,
                            value: 48,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: { params: [], type: 'pingpong_g2_playNoteForBeats_lite' },
                    paramsKeyMap: { CUBEID: 0, NOTE: 1, BEATS: 2 },
                    class: 'PingpongG2_Music',
                    isNotFor: ['PingpongG2Lite'],
                    func(sprite, script) {
                        return Entry.PingpongG2.postCallReturn(script, () => {
                            const cubeId = script.getNumberField('CUBEID');
                            const NOTE = script.getNumberField('NOTE', script);
                            const BEATS = script.getNumberValue('BEATS', script);

                            const cBeats = Entry.PingpongG2._clampBeats(BEATS);
                            const durationSec = Entry.PingpongG2._beatsToDuration(cBeats);

                            const waitTime = durationSec * 10 + 30; //XXX
                            const arr = Entry.PingpongG2.makeMusicNotePacket(
                                cubeId,
                                NOTE,
                                durationSec
                            );
                            const packet = Buffer.from(arr);

                            return [packet, waitTime];
                        });
                    },
                },
            };
        }
    })();
})();

module.exports = Entry.PingpongG2Lite;
