declare interface EntryDomOptions {
    id?: string;
    class?: string;
    classes?: string[];
    text?: string;
    src?: string;
    href?: string;
    parent?: EntryDom;
}

declare interface EntryDom extends JQuery {
    bindOnClick: (e: any) => this;
}

declare type EntryDomConstructor = (
    tag: string | HTMLElement | JQuery,
    options?: EntryDomOptions
) => EntryDom;

declare module Entry {
    export var Dom: EntryDomConstructor;
}
