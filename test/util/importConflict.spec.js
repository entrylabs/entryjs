/**
 * 회귀 테스트 — 보관함에서 꺼낸 함수·변수·신호가 작품에 있던 같은 id 로 연결되는 문제 (ENTRY-252)
 *
 * VOC: 다른 작품에서 고친 함수를 보관함에 넣었다가 원래 작품에 꺼내면, 고친 함수가 들어오지 않고
 *      작품에 있던 수정 전 함수로 연결된다.
 *
 * 원인: 꺼낼 때 appendFunctions 가 함수 id 만 보고, 작품에 같은 id 가 있으면 항목의 함수 정의를
 *      추가하지 않았다. 함수를 고쳐도 id 는 그대로라서 고친 함수와 원래 함수가 같은 id 를 가진다.
 */

import {
    isSameFunction,
    isSameVariable,
    normalizeCode,
    replaceReferences,
    resolveImportConflicts,
} from '../../src/util/importConflict';

const VARIABLE_BLOCKS = ['get_variable', 'set_variable', 'add_value_to_list'];
const MESSAGE_BLOCKS = ['message_cast', 'when_message_cast'];

const createIdGenerator = () => {
    let seq = 0;
    return () => `n${(seq++).toString().padStart(3, '0')}`;
};

const block = (type, params = [], statements = [], extra = {}) => ({
    id: Math.random().toString(36).substr(2, 4),
    x: 0,
    y: 0,
    type,
    params,
    statements,
    movable: null,
    deletable: 1,
    emphasized: false,
    readOnly: null,
    copyable: true,
    assemble: true,
    extensions: [],
    ...extra,
});

const funcDefinition = (name, body = [], defType = 'function_create') => [
    [block(defType, [block('function_field_label', [name, null]), null], [body])],
];

const func = (id, name, body, type = 'normal') => ({
    id,
    type,
    content: JSON.stringify(
        funcDefinition(name, body, type === 'value' ? 'function_create_value' : 'function_create')
    ),
    localVariables: [],
    useLocalVariables: false,
});

const existingFunc = (id, name, body, type = 'normal') => {
    const { content, ...rest } = func(id, name, body, type);
    return { ...rest, content: JSON.parse(content) };
};

const context = (overrides = {}) => ({
    functions: {},
    variables: {},
    messages: {},
    reservedFunctionIds: [],
    variableBlocks: VARIABLE_BLOCKS,
    messageBlocks: MESSAGE_BLOCKS,
    generateId: createIdGenerator(),
    ...overrides,
});

const typesIn = (json) => {
    const types = [];
    const walk = (node) => {
        if (Array.isArray(node)) {
            node.forEach(walk);
        } else if (node && typeof node === 'object') {
            if (typeof node.type === 'string') {
                types.push(node.type);
            }
            Object.values(node).forEach(walk);
        }
    };
    walk(typeof json === 'string' ? JSON.parse(json) : json);
    return types;
};

describe('normalizeCode', () => {
    test('블록 id·좌표·화면 상태는 비교에서 뺀다', () => {
        const a = [block('repeat_basic', [block('number', [10])], [[]], { x: 10, y: 20 })];
        const b = [block('repeat_basic', [block('number', ['10'])], [[]], { x: 99, y: 1 })];
        b[0].emphasized = true;
        expect(normalizeCode(a)).toEqual(normalizeCode(b));
    });

    test('파라미터 값이 다르면 다르다', () => {
        const a = [block('repeat_basic', [block('number', [10])])];
        const b = [block('repeat_basic', [block('number', [20])])];
        expect(normalizeCode(a)).not.toEqual(normalizeCode(b));
    });
});

describe('isSameFunction', () => {
    test('정의 안의 블록이 같으면 같은 함수다', () => {
        const body = [block('repeat_basic', [block('number', [10])], [[]])];
        expect(isSameFunction(func('f1', '함수', body), existingFunc('f1', '함수', body))).toBe(
            true
        );
    });

    test('정의 안에 블록이 추가되면 다른 함수다', () => {
        const body = [block('repeat_basic', [block('number', [10])], [[]])];
        expect(isSameFunction(func('f1', '함수', body), existingFunc('f1', '함수', []))).toBe(
            false
        );
    });

    test('결괏값 유무가 다르면 다른 함수다', () => {
        expect(
            isSameFunction(func('f1', '함수A', [], 'value'), existingFunc('f1', '함수A', []))
        ).toBe(false);
    });

    test('이름이 다르면 다른 함수다', () => {
        expect(isSameFunction(func('f1', '함수B', []), existingFunc('f1', '함수A', []))).toBe(
            false
        );
    });

    test('지역변수 설정이 다르면 다른 함수다', () => {
        const incoming = { ...func('f1', '함수', []), useLocalVariables: true };
        incoming.localVariables = [{ name: '지역변수', value: 0 }];
        expect(isSameFunction(incoming, existingFunc('f1', '함수', []))).toBe(false);
    });
});

describe('isSameVariable', () => {
    const base = {
        id: 'v1',
        name: '점수',
        variableType: 'variable',
        object: null,
        isCloud: false,
        isRealTime: false,
        value: 0,
        visible: true,
        x: 0,
        y: 0,
    };

    test('현재 값·위치·보이기만 다르면 같은 변수다', () => {
        expect(isSameVariable({ ...base, value: 37, x: 100, visible: false }, base)).toBe(true);
    });

    test('이름이 다르면 다른 변수다', () => {
        expect(isSameVariable({ ...base, name: '점수2' }, base)).toBe(false);
    });

    test('지역 변수의 오브젝트가 다르면 다른 변수다', () => {
        expect(isSameVariable({ ...base, object: 'o2' }, { ...base, object: 'o1' })).toBe(false);
    });

    test('슬라이드 범위가 다르면 다른 변수다', () => {
        const slide = { ...base, variableType: 'slide', minValue: 0, maxValue: 10 };
        expect(isSameVariable({ ...slide, maxValue: 100 }, slide)).toBe(false);
    });
});

describe('replaceReferences', () => {
    test('함수 블록 type, 변수·신호 블록 파라미터만 바꾼다', () => {
        const code = [
            [
                block('func_a1', []),
                block('set_variable', ['v1', block('text', ['v1'])]),
                block('message_cast', ['m1', null]),
                block('text', ['m1']),
            ],
        ];
        replaceReferences(
            code,
            { functions: { a1: 'b2' }, variables: { v1: 'v9' }, messages: { m1: 'm9' } },
            { variableBlocks: VARIABLE_BLOCKS, messageBlocks: MESSAGE_BLOCKS }
        );
        const [thread] = code;
        expect(thread[0].type).toBe('func_b2');
        expect(thread[1].params[0]).toBe('v9');
        // 글상자 블록에 우연히 같은 글자가 들어 있어도 바꾸지 않는다.
        expect(thread[1].params[1].params[0]).toBe('v1');
        expect(thread[2].params[0]).toBe('m9');
        expect(thread[3].params[0]).toBe('m1');
    });
});

describe('resolveImportConflicts', () => {
    test('사용자 재현: 빈 함수가 있는 작품에 반복이 든 같은 id 함수를 꺼내면 새 id 로 들여온다', () => {
        const repeat = [block('repeat_basic', [block('number', [10])], [[]])];
        const item = {
            script: JSON.stringify([block('func_2ba8')]),
            functions: [func('2ba8', '함수', repeat)],
            variables: [],
            messages: [],
        };
        const maps = resolveImportConflicts(
            item,
            context({ functions: { '2ba8': existingFunc('2ba8', '함수', []) } })
        );

        expect(maps.functions).toEqual({ '2ba8': 'n000' });
        expect(item.functions[0].id).toBe('n000');
        expect(typesIn(item.script)).toEqual(['func_n000']);
        expect(typesIn(item.functions[0].content)).toContain('repeat_basic');
    });

    test('같은 함수를 다시 꺼내면 id 를 그대로 둔다(작품에 있던 함수를 함께 쓴다)', () => {
        const repeat = [block('repeat_basic', [block('number', [10])], [[]])];
        const script = JSON.stringify([block('func_2ba8')]);
        const item = {
            script,
            functions: [func('2ba8', '함수', repeat)],
            variables: [],
            messages: [],
        };
        const maps = resolveImportConflicts(
            item,
            context({ functions: { '2ba8': existingFunc('2ba8', '함수', repeat) } })
        );

        expect(maps.functions).toEqual({});
        expect(item.functions[0].id).toBe('2ba8');
        expect(item.script).toBe(script);
    });

    test('이슈 재현: 함수C 가 쓰는 함수A 가 바뀌었으면 A 와 C 모두 새 id 를 받는다', () => {
        const callA = block('func_30zz');
        const cBody = [block('set_variable', ['v1', callA])];
        const item = {
            script: JSON.stringify([block('func_hkmi')]),
            functions: [func('hkmi', '함수C', cBody), func('30zz', '함수A', [], 'value')],
            variables: [],
            messages: [],
        };
        const existing = {
            // 작품1: 결괏값 없는 함수A 와, 같은 모양의 함수C 가 이미 있는 경우
            '30zz': existingFunc('30zz', '함수A', []),
            hkmi: existingFunc('hkmi', '함수C', [
                block('set_variable', ['v1', block('func_30zz')]),
            ]),
        };
        const maps = resolveImportConflicts(item, context({ functions: existing }));

        const newA = maps.functions['30zz'];
        const newC = maps.functions.hkmi;
        expect(newA).toBeTruthy();
        expect(newC).toBeTruthy();
        expect(typesIn(item.script)).toEqual([`func_${newC}`]);
        const cContent = item.functions.find(({ id }) => id === newC).content;
        expect(typesIn(cContent)).toContain(`func_${newA}`);
        expect(typesIn(cContent)).not.toContain('func_30zz');
    });

    test('작품에 없는 함수는 그대로 들여온다', () => {
        const item = {
            script: JSON.stringify([block('func_30zz')]),
            functions: [func('30zz', '함수A', [], 'value')],
            variables: [],
            messages: [],
        };
        const maps = resolveImportConflicts(item, context());
        expect(maps.functions).toEqual({});
        expect(item.functions[0].id).toBe('30zz');
    });

    test('지운 함수의 블록 모양 정보가 남은 id 는 새 id 로 들여온다', () => {
        const item = {
            script: JSON.stringify([block('func_30zz')]),
            functions: [func('30zz', '함수A', [], 'value')],
            variables: [],
            messages: [],
        };
        const maps = resolveImportConflicts(item, context({ reservedFunctionIds: ['30zz'] }));
        expect(maps.functions['30zz']).toBeTruthy();
        expect(typesIn(item.script)).toEqual([`func_${maps.functions['30zz']}`]);
    });

    test('바뀐 변수는 새 id 를 받고, 그 변수를 쓰는 함수도 새 id 를 받는다', () => {
        const body = [block('set_variable', ['v1', block('number', [0])])];
        const item = {
            script: JSON.stringify([block('func_f1'), block('get_variable', ['v1'])]),
            functions: [func('f1', '함수', body)],
            variables: [{ id: 'v1', name: '점수2', variableType: 'variable', object: null }],
            messages: [],
        };
        const maps = resolveImportConflicts(
            item,
            context({
                functions: { f1: existingFunc('f1', '함수', body) },
                variables: { v1: { id: 'v1', name: '점수', variableType: 'variable' } },
            })
        );

        const newV = maps.variables.v1;
        const newF = maps.functions.f1;
        expect(newV).toBeTruthy();
        expect(newF).toBeTruthy();
        expect(item.variables[0].id).toBe(newV);
        const script = JSON.parse(item.script);
        expect(script[0].type).toBe(`func_${newF}`);
        expect(script[1].params[0]).toBe(newV);
        expect(JSON.parse(item.functions[0].content)[0][0].statements[0][0].params[0]).toBe(newV);
    });

    test('값만 다른 변수는 작품의 변수를 그대로 쓴다', () => {
        const item = {
            script: JSON.stringify([block('get_variable', ['v1'])]),
            functions: [],
            variables: [{ id: 'v1', name: '점수', variableType: 'variable', value: 37 }],
            messages: [],
        };
        const maps = resolveImportConflicts(
            item,
            context({
                variables: { v1: { id: 'v1', name: '점수', variableType: 'variable', value: 0 } },
            })
        );
        expect(maps.variables).toEqual({});
        expect(item.variables[0].id).toBe('v1');
    });

    test('이름이 바뀐 신호는 새 id 를 받는다', () => {
        const item = {
            script: JSON.stringify([block('message_cast', ['m1', null])]),
            objects: [
                { id: 'o1', script: JSON.stringify([[block('when_message_cast', [null, 'm1'])]]) },
            ],
            functions: [],
            variables: [],
            messages: [{ id: 'm1', name: '시작2' }],
        };
        const maps = resolveImportConflicts(
            item,
            context({ messages: { m1: { id: 'm1', name: '시작' } } })
        );
        const newM = maps.messages.m1;
        expect(newM).toBeTruthy();
        expect(JSON.parse(item.script)[0].params[0]).toBe(newM);
        expect(JSON.parse(item.objects[0].script)[0][0].params[1]).toBe(newM);
    });

    test('새 id 는 작품·항목·남은 모양 정보의 id 와 겹치지 않는다', () => {
        const ids = ['n000', 'n001', 'n002', 'n003'];
        let i = 0;
        const item = {
            script: JSON.stringify([block('func_f1')]),
            functions: [func('f1', '함수', [block('move_direction')]), func('n001', '함수2', [])],
            variables: [],
            messages: [],
        };
        const maps = resolveImportConflicts(
            item,
            context({
                functions: { f1: existingFunc('f1', '함수', []) },
                reservedFunctionIds: ['n000'],
                generateId: () => ids[i++],
            })
        );
        expect(maps.functions.f1).toBe('n002');
    });
});
