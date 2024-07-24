'use strict';

const { name } = require("file-loader");

Entry.whalesbot_1s = {
    id: '61.1',   // 엔트리에서 발급받은 하드웨어 번호
    name: 'WhalesBot_1s',   // isNotFor 속성과 대소문자까지 정확하게 매치
    url: '',   // 엔트리 사이트에서 홍보시 사용
    imageName: 'WhalesBot-AI-Module-1S.png',
    title: {
        ko: '웨일스봇 1S',
        en: 'Whalesbot 1S',
    },
    setZero(){
        // 초기화
        Entry.hw.update();
    }
}

module.exports = Entry.whalesbot_1s;