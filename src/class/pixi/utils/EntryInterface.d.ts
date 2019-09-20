declare class EntryStage {
    canvas: PIXI.Container | any;
    _app: PIXI.Application | any;
}

declare module Entry {
    export var stage: EntryStage;
}
