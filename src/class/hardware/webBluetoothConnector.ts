import { EntryHWLiteBaseModule } from 'types';
import HardwareLite from '../hw_lite';
import WebApiConnector from './webApiConnector';
import { getServiceClassesByModuleId } from './bluetoothServices';

export default class WebBluetoothConnector extends WebApiConnector {
    private hwModule: EntryHWLiteBaseModule;
    private hwLite: HardwareLite;
    private device: BluetoothDevice;
    private services: any; // TODO: 타입할당
    private serviceClasses: any[];

    constructor(hwModule: EntryHWLiteBaseModule, hwLite: HardwareLite) {
        super();
        this.hwModule = hwModule;
        this.setServiceClasses();
    }

    async connect() {
        await this.setDevice();
        await this.setServices();
    }

    async disconnect() {
        await this.device.gatt.disconnect();
        this.hwModule = undefined;
        this.device = undefined;
        this.services = undefined;
        this.serviceClasses = undefined;
    }

    async initialDevice() {
        if (this.hwModule?.initialHandshake) {
            this.hwModule?.initialHandshake();
        }
    }

    async setDevice() {
        const filters = this.hwModule.bluetoothInfo.filters;
        const optionalServices = this.serviceClasses.map((serviceClass) => serviceClass.uuid);
        this.device = await navigator.bluetooth.requestDevice({ filters, optionalServices });
    }

    setServiceClasses() {
        this.serviceClasses = getServiceClassesByModuleId(this.hwModule.id);
    }

    async setServices() {
        if (!this.device || !this.device.gatt) {
            this.hwLite.getConnectFailedMenu();
            return;
        }

        if (!this.device.gatt.connected) {
            await this.device.gatt.connect();
        }

        this.services = {};

        const primaryServices = await this.device.gatt.getPrimaryServices();

        for (const primaryService of primaryServices) {
            for (const serviceClass of this.serviceClasses) {
                if (primaryService.uuid === serviceClass.uuid) {
                    this.services[serviceClass.serviceName] = await serviceClass.create(primaryService);
                }
            }
        }
    }
}
