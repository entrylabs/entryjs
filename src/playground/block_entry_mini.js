const miniBlock = {
    practical_course_dummy: {
        color: '#7C7C7C',
        skeleton: 'basic',
        statements: [],
        isNotFor: ['arduinoDisconnected'],
        template: '%1',
        params: [
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'practical_course_dummy',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func(sprite, script) {},
    },
    // roborobo_mini
    /* Dream 블럭 추가*/
};

module.exports.practicalCourseBlock = miniBlock;
// module.exports.setLanguage = () => ({
//     ko: {
//         Helper: {
//             robotis_set_led: 'LED 모듈이 연결된 [포트]를 선택해 지정한 색의 LED를 켜거나 끕니다.',
//             robotis_touch_value: '접촉센서가 연결된 [포트]의 값입니다.',
//             robotis_touch_value_boolean:
//                 '접촉센서가 연결된 [포트]를 선택해 [접촉되면/접촉 안되면]을 지정합니다.',
//             robotis_irs_value: '적외선 센서가 연결된 [포트]의 값입니다.',
//             robotis_irs_value_boolean:
//                 '적외선 센서가 연결된 [포트]의 값을 [입력]한 숫자와 비교합니다.',
//             robotis_light_value: '빛감지 센서가 연결된 [포트]의 값입니다.',
//             robotis_light_value_boolean:
//                 '빛감지 센서가 연결된 [포트]의값을 [입력]한 숫자와 비교합니다.',
//             robotis_userbutton_value: '사용자 버튼의 값입니다.',
//             robotis_userbutton_value_boolean: '사용자 버튼이 [접촉되면/접촉 안되면]을 지정합니다.',
//             robotis_detectedsound_value: '소리 센서가 입력받은 실시간 소리 값입니다.',
//             robotis_detectedsound_value_boolean:
//                 '소리 센서의 실시간 소리 값과 [입력]한 숫자를 비교합니다.',
//             robotis_detectedsound_value_init: '소리 센서의 최종 소리 값을 초기화합니다.',
//             robotis_detectingsound_value: '소리 센서가 입력받은 최종 소리 값입니다.',
//             robotis_detectingsound_value_boolean:
//                 '소리 센서의 최종 소리 값과 [입력]한 숫자를 비교합니다.',
//             robotis_color_value: '컬러 센서가 연결된 [포트]의 값입니다.',
//             robotis_color_value_boolean:
//                 '컬러 센서가 연결된 [포트]의 값을 [선택]한 숫자와 비교합니다.',
//             robotis_humidity_value: '습도 센서가 연결된 [포트]의 값입니다.',
//             robotis_humidity_value_boolean:
//                 '습도 센서가 연결된 [포트]의 값을 [입력]한 숫자와 비교합니다.',
//             robotis_temperature_value: '온도 센서가 연결된 [포트]의 값입니다.',
//             robotis_temperature_value_boolean:
//                 '온도 센서가 연결된 [포트]의 값을 [입력]한 숫자와 비교합니다.',
//             robotis_move_for_secs:
//                 '연결된 모터의 [방향/속도]를 선택하고 [입력]한 시간만큼 회전시킵니다.\n입력한시간이 끝나면 모터는 정지합니다.',
//             robotis_aux_move_for: '연결된 모터의 [방향/속도]를 선택해 회전시킵니다.',
//             robotis_aux_stop_for: '모터를 선택해 정지시킵니다',
//             robotis_set_servo_wheel: '서보모터의 [포트/방향/속도]를 선택해 회전시킵니다',
//             robotis_set_servo_joint: '서보모터의 [포트/위치값/속도]를 입력해 동작시킵니다.',
//             robotis_melody_note_for: '멜로디의 [음계/옥타브/길이]를 선택해 연주합니다.',
//         },
//     },
//     en: {
//         Helper: {
//             robotis_aux_move_for: '',
//         },
//     },
//     jp: {
//         Helper: {
//             robotis_aux_move_for: '',
//         },
//     },
//     vn: {
//         Helper: {
//             robotis_aux_move_for: '',
//         },
//     },
// });
