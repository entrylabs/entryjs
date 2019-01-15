declare class EntryContainer {
    getAllObjects():any[];
}

declare class Entry {
    static requestUpdate:boolean;
    static mediaFilePath:string;
    static addEventListener(type:string, handle:()=>void):void;
    static container:EntryContainer;
}