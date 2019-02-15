type Ilog = (...arg:any[])=>void;

let emptyLog:Ilog = (...arg:any[])=>{};

const USE_NATIVE_LOG:boolean = false;

let nlog:Ilog = console.log.bind(console);
export let clog:Ilog = USE_NATIVE_LOG ? nlog : emptyLog;

let nwarn:Ilog = console.warn.bind(console);
export let cwarn:Ilog = USE_NATIVE_LOG ? nwarn : emptyLog;