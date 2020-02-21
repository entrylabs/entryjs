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

Entry.byrobot_dronefighter_base =
{
    transferIrMessage(target, irmessage)
    {
        Entry.hw.sendQueue.target = target;
        Entry.hw.sendQueue.irmessage_data = irmessage;

        Entry.hw.update();

        delete Entry.hw.sendQueue.target;
        delete Entry.hw.sendQueue.irmessage_data;
    },

    transferUserInterface(target, uicommand, uifunction)
    {
        Entry.hw.sendQueue.target = target;
        Entry.hw.sendQueue.userinterface_command = uicommand;
        Entry.hw.sendQueue.userinterface_function = uifunction;

        Entry.hw.update();

        delete Entry.hw.sendQueue.target;
        delete Entry.hw.sendQueue.userinterface_command;
        delete Entry.hw.sendQueue.userinterface_function;
    },

    setUserInterface(script, target, uicommand, uifunction)
    {
        switch (this.checkFinish(script, 40))
        {
            case 'Start':
                {
                    this.transferUserInterface(target, uicommand, uifunction);
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
};

module.exports = Entry.byrobot_dronefighter_base;
