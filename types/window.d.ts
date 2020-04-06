declare interface Window {
    entrylms: any;
    Lang: any;
    popupHelper?: any;
    EntryStatic: any;
    ImageCapture: any;
    webkitAudioContext: typeof AudioContext;
}

declare var Lang: any;
declare var entrylms: any;
declare var EntryStatic: any;
declare var ImageCapture: any;

declare module '*.worker.ts' {
    var value: new () => Worker;
    export = value;
}
