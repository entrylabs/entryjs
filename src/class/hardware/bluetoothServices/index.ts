// 사용하는 서비스 정리

import { AccelerometerService } from './services/accelerometer';
import { ButtonService } from './services/button';
import { DeviceInformationService } from './services/device-information';
import { DfuControlService } from './services/dfu-control';
import { EventService } from './services/event';
import { IoPinService } from './services/io-pin';
import { LedService } from './services/led';
import { MagnetometerService } from './services/magnetometer';
import { TemperatureService } from './services/temperature';
import { UartService } from './services/uart';

export const getServiceClassesByModuleId = (moduleId: string) => {
    switch (moduleId) {
        case '220302':
            {
                // INFO : entryjs minify 과정에서 function.name 값이 uglify되는 이슈 대응
                return [
                    { ...DeviceInformationService, name: 'DeviceInformationService' },
                    { ...ButtonService, name: 'ButtonService' },
                    { ...LedService, name: 'LedService' },
                    { ...TemperatureService, name: 'TemperatureService' },
                    { ...AccelerometerService, name: 'AccelerometerService' },
                    { ...MagnetometerService, name: 'MagnetometerService' },
                    { ...UartService, name: 'UartService' },
                    { ...EventService, name: 'EventService' },
                    { ...DfuControlService, name: 'DfuControlService' },
                    { ...IoPinService, name: 'IoPinService' },
                ];
            }
            break;
    }
};
