'use strict';

import _range from 'lodash/range';

(function() {
    const PingpongConnectLite = require('./block_pingpongConnect_lite');

    function createBlockMenuList(cubeCount) {
        return [
            `pingpong_lite_g${cubeCount}_when_button_pressed`,
            `pingpong_lite_g${cubeCount}_when_tilted`,
            `pingpong_lite_g${cubeCount}_is_button_pressed`,
            `pingpong_lite_g${cubeCount}_is_tilted`,
            `pingpong_lite_g${cubeCount}_get_tilt_value`,
            `pingpong_lite_g${cubeCount}_is_top_shape`,
            `pingpong_lite_g${cubeCount}_get_sensor_value`,
            `pingpong_lite_g${cubeCount}_motor_rotate`,
            `pingpong_lite_g${cubeCount}_start_motor_rotate`,
            `pingpong_lite_g${cubeCount}_stop_motor_rotate`,
            `pingpong_lite_g${cubeCount}_multi_motor_rotate`,
            `pingpong_lite_g${cubeCount}_multi_start_motor_rotate`,
            `pingpong_lite_g${cubeCount}_rotate_servo_mortor`,
            `pingpong_lite_g${cubeCount}_set_dot_pixel`,
            `pingpong_lite_g${cubeCount}_set_dot_string`,
            `pingpong_lite_g${cubeCount}_set_dot_clear`,
            `pingpong_lite_g${cubeCount}_playNoteForBeats`,
            `pingpong_lite_g${cubeCount}_multi_playChordForBeats`,
            `pingpong_lite_g${cubeCount}_restForBeats`,
            `pingpong_lite_g${cubeCount}_setTempo`,
            `pingpong_lite_g${cubeCount}_getTempo`,
        ];
    }

    function createPingpongLite(cubeCount, className, hardwareId, imageName) {
        return new (class extends PingpongConnectLite {
            constructor() {
                super(cubeCount, className);
                this.id = hardwareId;
                this.imageName = imageName;
                this.blockMenuBlocks = createBlockMenuList(this.cubeCount);
            }
        })();
    }

    Entry.PingpongG2Lite = createPingpongLite(2, 'PingpongG2Lite', '350201', 'PingpongG2Lite.png');
    Entry.PingpongG3Lite = createPingpongLite(3, 'PingpongG3Lite', '350301', 'PingpongG3Lite.png');
    Entry.PingpongG4Lite = createPingpongLite(4, 'PingpongG4Lite', '350401', 'PingpongG4Lite.png');
})();

module.exports = [Entry.PingpongG2Lite, Entry.PingpongG3Lite, Entry.PingpongG4Lite];