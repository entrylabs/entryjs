/* eslint-disable prettier/prettier */
/* eslint-disable brace-style */
/* eslint-disable max-len */
'use strict';

/***************************************************************************************
 *
 *  이름 붙이기 규칙(2017.1.16)
 *
 *  1. 변수에 해당하는 이름들은 모두 소문자
 *  2. 이어지는 추가 이름은 '_'를 붙여서 연결
 *
 ***************************************************************************************/

/***************************************************************************************
 *  장치 기본 정의
 ***************************************************************************************/

Entry.byrobot_petrone_v2_base =
{

    transferIrMessage(target, irdirection, irmessage)
    {
        Entry.hw.sendQueue.target = target;
        Entry.hw.sendQueue.irmessage_direction = irdirection;
        Entry.hw.sendQueue.irmessage_irdata = irmessage;

        Entry.hw.update();

        delete Entry.hw.sendQueue.target;
        delete Entry.hw.sendQueue.irmessage_direction;
        delete Entry.hw.sendQueue.irmessage_irdata;
    },


    transferControlDouble(target, wheel, accel)
    {
        Entry.hw.sendQueue.target = target;
        Entry.hw.sendQueue.control_double8_wheel = wheel;
        Entry.hw.sendQueue.control_double8_accel = accel;

        Entry.hw.update();

        delete Entry.hw.sendQueue.target;
        delete Entry.hw.sendQueue.control_double8_wheel;
        delete Entry.hw.sendQueue.control_double8_accel;
    },


    /*
        None = 0,           // 없음

        Flight = 0x10,      // 비행(가드 포함)
        FlightNoGuard,      // 비행(가드 없음)
        FlightFPV,          // 비행(FPV)

        Drive = 0x20,       // 주행
        DriveFPV,           // 주행(FPV)

        Test = 0x30,        // 테스트
     */
    setModeVehicle(script, target, modeVehicle)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    Entry.byrobot_drone_base.transferCommand(target, 0x10, modeVehicle);

                    Entry.byrobot_drone_base.transferControlQuad(target, 0, 0, 0, 0);
                    this.transferControlDouble(target, 0, 0);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },


    setEventFlight(script, target, eventFlight, time)
    {
        switch (this.checkFinish(script, time))
        {
            case 'Start':
                {
                    Entry.byrobot_drone_base.transferControlQuad(target, 0, 0, 0, 0); // 기존 입력되었던 조종기 방향 초기화 (수직으로 이륙, 착륙 하도록)
                    Entry.byrobot_drone_base.transferCommand(target, 0x22, eventFlight); // 0x22 : CommandType::FlightEvent
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },



    sendStop(script, target)
    {
        return Entry.byrobot_drone_base.sendCommand(script, target, 0x24, 0);
    },


    sendControlDoubleSingle(script, target, controlTarget, value, time, flagDelay)
    {
        let timeDelay = 40;
        if (flagDelay)
        {
            timeDelay = Math.max(timeDelay, time);
        }

        switch (this.checkFinish(script, timeDelay))
        {
            case 'Start':
                {
                    Entry.hw.sendQueue.target = target;
                    Entry.hw.sendQueue[controlTarget] = value;

                    Entry.hw.update();

                    delete Entry.hw.sendQueue.target;
                    delete Entry.hw.sendQueue[controlTarget];
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                if (flagDelay)
                {
                    // 블럭을 빠져나갈 때 변경했던 값을 초기화

                    // 전송
                    Entry.hw.sendQueue.target = target;
                    Entry.hw.sendQueue[controlTarget] = 0;

                    Entry.hw.update();

                    delete Entry.hw.sendQueue.target;
                    delete Entry.hw.sendQueue[controlTarget];
                }
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },


    sendControlDouble(script, target, wheel, accel, time, flagDelay)
    {
        let timeDelay = 40;
        if (flagDelay)
        {
            timeDelay = Math.max(timeDelay, time);
        }

        switch (this.checkFinish(script, timeDelay))
        {
            case 'Start':
                {
                    this.transferControlDouble(target, wheel, accel);
                }
                return script;

            case 'Running':
                return script;

            case 'Finish':
                if (flagDelay)
                {
                    this.transferControlDouble(target, 0, 0);
                }
                return script.callReturn();

            default:
                return script.callReturn();
        }
    },
};



module.exports = Entry.byrobot_petrone_v2_base;

