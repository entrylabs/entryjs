/**
 * 회귀 테스트 — 지수 표기(1e+21) 숫자 판정
 *
 * VOC: 변수 값이 1e+21 형태로 바뀐 뒤 더하기 연산이 문자열 결합으로 처리됨.
 *      예) 1e+21 + 1e+21 → "1e+211e+21"
 *
 * 원인: 자바스크립트는 |x| >= 1e21 부터 String(x) 와 Number.prototype.toFixed()
 *      가 지수 표기를 반환한다. 그렇게 만들어진 "1e+21" 을 Entry.Utils.isNumber
 *      의 정규식이 숫자로 인정하지 않아, parseFloat 로 이미 파싱된 값을
 *      block_calc.js 의 PLUS 분기가 다시 문자열로 되돌린다.
 */

// utils.js 는 모듈 로드 시점에 전역 Entry 와 lodash 전역 `_` 를 사용한다.
// 실제 실행 환경에서는 index.html 의 script 태그가 이 전역들을 채운다.
global.Entry = {};
global._ = require('lodash');

// isNumber / parseNumber 검증에 관여하지 않는 무거운 의존성은 대체한다.
jest.mock('../../src/graphicEngine/GEHelper', () => ({ GEHelper: {} }));
jest.mock('../../src/class/DataTable', () => ({}));
jest.mock('../../src/class/entryModuleLoader', () => ({}));
jest.mock('fontfaceonload', () => () => {});

require('../../src/util/utils');

describe('Entry.Utils.isNumber', () => {
    describe('지수 표기를 숫자로 인정한다', () => {
        test.each(['1e+21', '1e21', '-1e+21', '2E3', '-1.5E-7', '1.5e+21', '1e-7'])(
            '%s',
            (value) => {
                expect(Entry.Utils.isNumber(value)).toBe(true);
            }
        );
    });

    describe('숫자가 아닌 문자열은 계속 거부한다', () => {
        test.each([
            'e',
            'E',
            'e21',
            'E4',
            '1e',
            '1e+',
            '1e5.5',
            '0x10',
            ' 12',
            '12 ',
            'Infinity',
            'NaN',
            '.5',
            '.',
            '-',
            '',
            '1--2',
            '도',
        ])('%s', (value) => {
            expect(Entry.Utils.isNumber(value)).toBe(false);
        });
    });

    describe('기존에 통과하던 값은 그대로 통과한다 (단조 확장)', () => {
        test.each(['0', '1', '-1', '12.', '12.5', '000123', '-0.001'])('%s', (value) => {
            expect(Entry.Utils.isNumber(value)).toBe(true);
        });
    });

    describe('number 타입은 언제나 통과한다', () => {
        test.each([0, 1, -1.5, 1e21, Number.MAX_SAFE_INTEGER])('%p', (value) => {
            expect(Entry.Utils.isNumber(value)).toBe(true);
        });
    });

    describe('한 글자 입력 필터 동작이 바뀌지 않는다', () => {
        // FieldTextInput._isValidInputValue (src/playground/field/textInput.js:458) 과
        // FieldAngle._isValidInputValue (src/playground/field/angle.js:255) 는
        // 방금 입력된 키 "한 글자" 를 그대로 넘긴다. 여기서 'e' 가 통과되면
        // 숫자 입력칸에 e 를 타이핑할 수 있게 되어 기존 동작이 깨진다.
        test.each(['e', 'E', '+', 'x', 'a'])('%s 는 여전히 거부한다', (ch) => {
            expect(Entry.Utils.isNumber(ch)).toBe(false);
        });

        test.each(['0', '5', '9'])('%s 는 여전히 통과한다', (ch) => {
            expect(Entry.Utils.isNumber(ch)).toBe(true);
        });
    });
});

describe('Entry.parseNumber', () => {
    // Entry.Variable 생성자(src/class/variable/variable.js:63)가 저장된 프로젝트의
    // 값을 이 함수로 복원한다. false 를 반환하면 변수 값이 문자열로 고정되어
    // 이후 연산이 전부 문자열 결합이 된다.
    test('지수 표기 문자열을 숫자로 복원한다', () => {
        expect(Entry.parseNumber('1e+21')).toBe(1e21);
    });

    test('0 으로 시작하는 값은 기존대로 문자열을 유지한다', () => {
        expect(Entry.parseNumber('0123')).toBe('0123');
    });

    test('숫자가 아니면 false 를 반환한다', () => {
        expect(Entry.parseNumber('안녕')).toBe(false);
    });
});
