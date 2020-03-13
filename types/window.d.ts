declare interface Window {
    entrylms: any;
    Lang: any;
    popupHelper?: any;
    ImageCapture: any;
}

declare var Lang: any;
declare var entrylms: any;
declare var ImageCapture: any;

declare module '*.worker.ts' {
    var value: new () => Worker;
    export = value;
}
