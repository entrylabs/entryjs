import { IEntry } from './entry';

declare global {
    interface Window {
        entrylms: any;
        Lang: any;
        popupHelper?: import('../src/class/popup_helper').default;
        EntryStatic: any;
        ImageCapture: any;
        sendSync: any | undefined;
        Entry: IEntry;
    }
}

declare var Lang: any;
declare var entrylms: any;
declare var EntryStatic: any;
declare var ImageCapture: any;

declare module '*.worker.ts' {
    var value: new () => Worker;
    export = value;
}

declare module '@egjs/*' {
    const value: any;
    export default value;
}
