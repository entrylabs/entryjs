/*
 *
 */
'use strict';

Entry.KeyboardCode = {};

(function(kc) {
    kc.map = {
        backspace: 8,
        'back-space': 8,
        tab: 9,
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pausebreak: 19,
        capslock: 20,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        delete: 46,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
        windows: 91,
        rightclick: 93,
        numpad0: 96,
        numpad1: 97,
        numpad2: 98,
        numpad3: 99,
        numpad4: 100,
        numpad5: 101,
        numpad6: 102,
        numpad7: 103,
        numpad8: 104,
        numpad9: 105,
        'numpad*': 106,
        'numpad+': 107,
        'numpad-': 109,
        'numpad.': 110,
        'numpad/': 111,
        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123,
        numlock: 144,
        scrolllock: 145,
        mycomputer: 182,
        mycalculator: 183,
        ';': 186,
        '=': 187,
        ',': 188,
        '-': 189,
        '.': 190,
        '/': 191,
        '~': 192,
        '[': 219,
        '\\': 220,
        ']': 221,
        "'": 222,
        backslash: 220,

        // legacy keyinput support
        '13': 13,
        '16': 16,
        '17': 17,
        '18': 18,
        '19': 19,
        '20': 20,
        '27': 27,
        '32': 32,
        '33': 33,
        '34': 34,
        '35': 35,
        '36': 36,
        '37': 37,
        '38': 38,
        '39': 39,
        '40': 40,
        '45': 45,
        '46': 46,
        '48': 48,
        '49': 49,
        '50': 50,
        '51': 51,
        '52': 52,
        '53': 53,
        '54': 54,
        '55': 55,
        '56': 56,
        '57': 57,
        '65': 65,
        '66': 66,
        '67': 67,
        '68': 68,
        '69': 69,
        '70': 70,
        '71': 71,
        '72': 72,
        '73': 73,
        '74': 74,
        '75': 75,
        '76': 76,
        '77': 77,
        '78': 78,
        '79': 79,
        '80': 80,
        '81': 81,
        '82': 82,
        '83': 83,
        '84': 84,
        '85': 85,
        '86': 86,
        '87': 87,
        '88': 88,
        '89': 89,
        '90': 90,
        '96': 96,
        '97': 97,
        '98': 98,
        '99': 99,
        '100': 100,
        '101': 101,
        '102': 102,
        '103': 103,
        '104': 104,
        '105': 105,
        '186': 186,
        '187': 187,
        '188': 188,
        '189': 189,
        '190': 190,
        '191': 191,
        '192': 192,
        '219': 219,
        '220': 220,
        '221': 221,
        '222': 222,
    };

    kc.codeToKeyCode = {
        ArrowLeft: 37,
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        Space: 32,
        Control: 17,
        ControlLeft: 17,
        ControlRight: 17,
        Shift: 16,
        ShiftLeft: 16,
        ShiftRight: 16,
        Alt: 18,
        AltLeft: 18,
        AltRight: 18,
        Tab: 9,
        Escape: 27,
        Backspace: 8,
        Enter: 13,
        KeyA: 65,
        KeyB: 66,
        KeyC: 67,
        KeyD: 68,
        KeyE: 69,
        KeyF: 70,
        KeyG: 71,
        KeyH: 72,
        KeyI: 73,
        KeyJ: 74,
        KeyK: 75,
        KeyL: 76,
        KeyM: 77,
        KeyN: 78,
        KeyO: 79,
        KeyP: 80,
        KeyQ: 81,
        KeyR: 82,
        KeyS: 83,
        KeyT: 84,
        KeyU: 85,
        KeyV: 86,
        KeyW: 87,
        KeyX: 88,
        KeyY: 89,
        KeyZ: 90,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        // for ie
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        Spacebar: 32,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
        // SpecialChar
        ';': 186,
        Semicolon: 186,
        '=': 187,
        Equal: 187,
        ',': 188,
        Comma: 188,
        '-': 189,
        Minus: 189,
        '.': 190,
        Period: 190,
        '/': 191,
        Slash: 191,
        '`': 192,
        Backquote: 192,
        '[': 219,
        BracketLeft: 219,
        '\\': 220,
        Backslash: 220,
        ']': 221,
        BracketRight: 221,
        "'": 222,
        Quote: 222,
        Help: 45,
        Insert: 45,
        Delete: 46,
        Home: 36,
        End: 35,
        PageUp: 33,
        PageDown: 34,
    };
    /*kc.keyCodeToChar = {
        8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",
        19:"pausebreak",20:"capslock",27:"esc",32:"space",33:"pageup",
        34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",
        40:"down",45:"insert",46:"delete",48:"0",49:"1",50:"2",51:"3",
        52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"a",66:"b",67:"c",
        68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",
        77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",
        86:"v",87:"w",88:"x",89:"y",90:"z",91:"windows",93:"right",
        96:"numpad0",97:"numpad1",98:"numpad2",99:"numpad3",
        100:"numpad4",101:"numpad5",102:"numpad6",103:"numpad7",
        104:"numpad8",105:"numpad9",106:"numpad*",107:"numpad+",
        109:"numpad-",110:"numpad.",111:"numpad/",112:"f1",113:"f2",
        114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",
        121:"f10",122:"f11",123:"f12",144:"numlock",145:"scrolllock",
        182:"mycomputer",183:"mycalculator",186:";",187:"=",188:",",
        189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"
    };
    kc.keyCharToCode = {
        "backspace":8,"tab":9,"enter":13,"shift":16,"ctrl":17,"alt":18,
        "pausebreak":19,"capslock":20,"esc":27,"space":32,"pageup":33,
        "pagedown":34,"end":35,"home":36,"left":37,"up":38,"right":39,
        "down":40,"insert":45,"delete":46,"0":48,"1":49,"2":50,"3":51,
        "4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"a":65,"b":66,"c":67,"d":68,
        "e":69,"f":70,"g":71,"h":72,"i":73,"j":74,"k":75,"l":76,"m":77,"n":78,
        "o":79,"p":80,"q":81,"r":82,"s":83,"t":84,"u":85,"v":86,"w":87,"x":88,
        "y":89,"z":90,"windows":91,"rightclick":93,"numpad0":96,"numpad1":97,
        "numpad2":98,"numpad3":99,"numpad4":100,"numpad5":101,"numpad6":102,
        "numpad7":103,"numpad8":104,"numpad9":105,"numpad*":106,"numpad+":107,
        "numpad-":109,"numpad.":110,"numpad/":111,"f1":112,"f2":113,"f3":114,
        "f4":115,"f5":116,"f6":117,"f7":118,"f8":119,"f9":120,"f10":121,"f11":122,
        "f12":123,"numlock":144,"scrolllock":145,"mycomputer":182,"mycalculator":183,
        ";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,
        "'":222
    };*/
})(Entry.KeyboardCode);
