export const stringToUint8Array = (e: string): Uint8Array => {
    let t = e.length;
    let n = new Uint8Array(t);
    for (let i = 0; i < t; ++i) n[i] = 255 & e.charCodeAt(i);
    return n;
};
