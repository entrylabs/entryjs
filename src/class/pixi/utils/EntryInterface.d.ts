declare class EntryContainer {
    getAllObjects():any[];
}

declare class EntryStage {
    canvas:PIXI.Container|any;
    _app:PIXI.Application|any;
}

declare class Entry {
    static requestUpdate:boolean;
    static mediaFilePath:string;
    static addEventListener(type:string, handle:()=>void):void;
    static container:EntryContainer;
    static stage:EntryStage;

    static TEXT_ALIGNS:string[];
    static TEXT_ALIGN_LEFT:number;
    static TEXT_ALIGN_CENTER:number;
    static TEXT_ALIGN_RIGHT:number;
}