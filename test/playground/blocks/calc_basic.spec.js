/**
 * 회귀 테스트 — calc_basic(계산: ○ + ○) 의 지수 표기 처리
 *
 * VOC: 변수 값이 1e+21 형태가 된 뒤 더하기가 문자열 결합으로 처리됨.
 *      예) 1e+21 + 1e+21 → "1e+211e+21"
 *
 * PLUS 분기만 Entry.Utils.isNumber 로 피연산자를 재판정하고, 숫자가 아니라고
 * 판정되면 getNumberValue 가 parseFloat 로 이미 파싱한 값을 문자열로 되돌린다.
 * MINUS/MULTI/DIVIDE 는 getNumberValue 만 쓰므로 원래부터 영향이 없다.
 */

// 실제 실행 환경에서는 index.html 의 script 태그가 이 전역들을 채운다.
global.Entry = {};
global._ = require('lodash');
global.BigNumber = require('../../../extern/util/bignumber.min.js');

// EntryStatic 과 Lang 은 블록의 색상·표시 문구에만 쓰인다.
// 어떤 속성을 읽어도 자기 자신을 돌려주는 스텁으로 충분하다.
const anyValue = new Proxy(function stub() {}, {
    get: (target, key) => (key === Symbol.toPrimitive ? () => 'stub' : anyValue),
    apply: () => anyValue,
});
global.EntryStatic = anyValue;
global.Lang = anyValue;

jest.mock('../../../src/graphicEngine/GEHelper', () => ({ GEHelper: {} }));
jest.mock('../../../src/class/DataTable', () => ({}));
jest.mock('../../../src/class/entryModuleLoader', () => ({}));
jest.mock('fontfaceonload', () => () => {});

require('../../../src/util/utils');

// 블록 정의가 참조하는 파라미터 컨버터. 실제로는 block_entry.js 가 채운다.
Entry.block = { converters: anyValue };

const calcBasic = require('../../../src/playground/blocks/block_calc').getBlocks().calc_basic;

/**
 * Entry.Scope 를 대신하는 최소 스텁.
 * getNumberValue 의 계산식은 src/playground/scope.js:139 와 동일하게 맞춘다.
 */
function run(left, operator, right) {
    const params = { LEFTHAND: left, RIGHTHAND: right };
    const script = {
        getField: () => operator,
        getValue: (key) => params[key],
        getNumberValue: (key) => parseFloat(params[key]) || 0,
    };
    return calcBasic.func(null, script);
}

describe('calc_basic — 더하기(PLUS)', () => {
    test('지수 표기끼리 더하면 숫자 덧셈이 된다', () => {
        expect(run('1e+21', 'PLUS', '1e+21')).toBe(2e21);
    });

    test('결과가 문자열이 아니라 number 다', () => {
        expect(typeof run('1e+21', 'PLUS', '1e+21')).toBe('number');
    });

    test('한쪽만 지수 표기여도 더해진다', () => {
        expect(run('2e3', 'PLUS', '1')).toBe(2001);
    });

    test('변수에 저장된 지수 문자열을 그대로 다시 계산할 수 있다', () => {
        // `변수에 ○만큼 더하기`(block_variable.js:451)는 .toNumber().toFixed() 를 거치는데,
        // JS 는 |x| >= 1e21 에서 지수 표기를 반환한다. 그 값이 다음 연산의 입력이 된다.
        const stored = (1e21).toFixed(0);
        expect(stored).toBe('1e+21');
        expect(run(stored, 'PLUS', stored)).toBe(2e21);
    });

    test('글자끼리는 그대로 이어 붙인다', () => {
        expect(run('안녕', 'PLUS', '하세요')).toBe('안녕하세요');
    });

    test('숫자와 글자를 더하면 이어 붙인다', () => {
        expect(run('1', 'PLUS', '개')).toBe('1개');
    });

    test('소수점 오차가 생기지 않는다', () => {
        expect(run('0.1', 'PLUS', '0.2')).toBe(0.3);
    });
});

describe('calc_basic — 나머지 연산자는 원래부터 지수 표기를 처리한다', () => {
    test('빼기', () => {
        expect(run('2e+21', 'MINUS', '1e+21')).toBe(1e21);
    });

    test('곱하기', () => {
        expect(run('2e3', 'MULTI', '3')).toBe(6000);
    });

    test('나누기', () => {
        expect(run('2e3', 'DIVIDE', '4')).toBe(500);
    });
});
