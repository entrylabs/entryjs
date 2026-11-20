'use strict';

/**
 * 보관함·오브젝트 파일에서 블록이나 오브젝트를 꺼내 올 때,
 * 가져오는 함수·변수·신호의 id 가 지금 작품에 이미 있으면 내용을 비교한다.
 * - 같으면 그대로 둔다. append* 가 작품에 있던 것을 그대로 쓴다.
 * - 다르면 겹치지 않는 새 id 로 바꾸고, 가져오는 블록·함수·오브젝트 안의 참조도 함께 바꾼다.
 *
 * Entry 전역에 의존하지 않도록 작품 쪽 정보는 context 로 받는다.
 */

const FUNC_PREFIX = 'func_';

const parseJSON = (value) => {
    if (typeof value !== 'string') {
        return value;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        return undefined;
    }
};

const normalizePrimitive = (value) => {
    if (value === undefined || value === null) {
        return null;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    return value;
};

/**
 * 블록 id, 좌표, 화면 상태처럼 복사·이동만으로 바뀌는 값은 빼고
 * 블록 종류, 파라미터, 안쪽 블록만 남긴다.
 */
export const normalizeCode = (node) => {
    if (Array.isArray(node)) {
        return node.map(normalizeCode);
    }
    if (node && typeof node === 'object') {
        if (typeof node.type === 'string') {
            return {
                type: node.type,
                params: normalizeCode(node.params || []),
                statements: normalizeCode(node.statements || []),
            };
        }
        return Object.keys(node)
            .sort()
            .reduce((acc, key) => {
                acc[key] = normalizeCode(node[key]);
                return acc;
            }, {});
    }
    return normalizePrimitive(node);
};

const normalizeLocalVariables = (localVariables = []) =>
    (localVariables || []).map((variable = {}) => ({
        id: normalizePrimitive(variable.id),
        name: normalizePrimitive(variable.name),
        value: normalizePrimitive(variable.value),
    }));

const normalizeFunction = (func = {}) =>
    JSON.stringify({
        type: func.type || 'normal',
        useLocalVariables: !!func.useLocalVariables,
        localVariables: normalizeLocalVariables(func.localVariables),
        content: normalizeCode(parseJSON(func.content) || []),
    });

/**
 * 변수·리스트는 이름, 종류, 지역 변수 여부(object), 공유·실시간 여부, 슬라이드 범위를 비교한다.
 * 현재 값·리스트 항목·위치·크기·보이기는 작품을 실행하거나 화면을 옮기기만 해도 바뀌므로 비교하지 않는다.
 */
const normalizeVariable = (variable = {}) =>
    JSON.stringify({
        name: normalizePrimitive(variable.name),
        variableType: variable.variableType || 'variable',
        object: normalizePrimitive(variable.object),
        isCloud: !!variable.isCloud,
        isRealTime: !!variable.isRealTime,
        minValue: normalizePrimitive(variable.minValue),
        maxValue: normalizePrimitive(variable.maxValue),
    });

const normalizeMessage = (message = {}) =>
    JSON.stringify({ name: normalizePrimitive(message.name) });

export const isSameFunction = (a, b) => normalizeFunction(a) === normalizeFunction(b);
export const isSameVariable = (a, b) => normalizeVariable(a) === normalizeVariable(b);
export const isSameMessage = (a, b) => normalizeMessage(a) === normalizeMessage(b);

/**
 * 코드(블록 JSON) 안의 함수·변수·신호 참조를 id 표에 따라 바꾼다. node 를 직접 고친다.
 */
export const replaceReferences = (node, maps, blockTypes) => {
    const { functions = {}, variables = {}, messages = {} } = maps;
    const { variableBlocks = [], messageBlocks = [] } = blockTypes;
    const walk = (target) => {
        if (Array.isArray(target)) {
            target.forEach(walk);
            return;
        }
        if (!target || typeof target !== 'object') {
            return;
        }
        const { type } = target;
        if (typeof type === 'string') {
            if (type.indexOf(FUNC_PREFIX) === 0) {
                const newId = functions[type.substr(FUNC_PREFIX.length)];
                if (newId) {
                    target.type = `${FUNC_PREFIX}${newId}`;
                }
            }
            let idMap;
            if (variableBlocks.includes(type)) {
                idMap = variables;
            } else if (messageBlocks.includes(type)) {
                idMap = messages;
            }
            if (idMap && Array.isArray(target.params)) {
                target.params = target.params.map((param) =>
                    typeof param === 'string' && idMap[param] ? idMap[param] : param
                );
            }
        }
        Object.keys(target).forEach((key) => walk(target[key]));
    };
    walk(node);
    return node;
};

const hasEntries = (map) => Object.keys(map).length > 0;

/**
 * @param {object} item 꺼내 오는 데이터. { script, objects, functions, variables, messages }
 *                      script·objects[].script·functions[].content 는 JSON 문자열이다. item 을 직접 고친다.
 * @param {object} context 작품 쪽 정보
 * @param {object} context.functions  { [id]: { type, content, localVariables, useLocalVariables } }
 * @param {object} context.variables  { [id]: variable JSON } (변수·리스트)
 * @param {object} context.messages   { [id]: { id, name } }
 * @param {string[]} context.reservedFunctionIds 작품에는 없지만 쓰면 안 되는 함수 id (지운 함수의 블록 모양 정보가 남은 경우)
 * @param {string[]} context.reservedIds 새 id 를 만들 때 피할 id
 * @param {string[]} context.variableBlocks 변수 id 를 파라미터로 쓰는 블록 종류
 * @param {string[]} context.messageBlocks 신호 id 를 파라미터로 쓰는 블록 종류
 * @param {function} context.generateId 새 id 생성기
 * @return {{ functions: object, variables: object, messages: object }} 바꾼 id 표 (옛 id → 새 id)
 */
export const resolveImportConflicts = (item, context) => {
    const maps = { functions: {}, variables: {}, messages: {} };
    if (!item || typeof item !== 'object') {
        return maps;
    }
    const {
        functions: existingFunctions = {},
        variables: existingVariables = {},
        messages: existingMessages = {},
        reservedFunctionIds = [],
        reservedIds = [],
        variableBlocks = [],
        messageBlocks = [],
        generateId,
    } = context;
    const blockTypes = { variableBlocks, messageBlocks };
    const incomingFunctions = Array.isArray(item.functions) ? item.functions : [];
    const incomingVariables = Array.isArray(item.variables) ? item.variables : [];
    const incomingMessages = Array.isArray(item.messages) ? item.messages : [];

    const usedIds = new Set([
        ...Object.keys(existingFunctions),
        ...Object.keys(existingVariables),
        ...Object.keys(existingMessages),
        ...reservedFunctionIds,
        ...reservedIds,
        ...incomingFunctions.map(({ id }) => id),
        ...incomingVariables.map(({ id }) => id),
        ...incomingMessages.map(({ id }) => id),
    ]);
    const createId = () => {
        let id = generateId();
        while (!id || usedIds.has(id)) {
            id = generateId();
        }
        usedIds.add(id);
        return id;
    };

    incomingMessages.forEach((message) => {
        const existing = message.id && existingMessages[message.id];
        if (existing && !isSameMessage(message, existing)) {
            const newId = createId();
            maps.messages[message.id] = newId;
            message.id = newId;
        }
    });

    incomingVariables.forEach((variable) => {
        const existing = variable.id && existingVariables[variable.id];
        if (existing && !isSameVariable(variable, existing)) {
            const newId = createId();
            maps.variables[variable.id] = newId;
            variable.id = newId;
        }
    });

    // 코드를 한 번만 파싱해 두고 바꾼 뒤 마지막에 문자열로 되돌린다.
    const codes = [];
    const addCode = (owner, key) => {
        const parsed = parseJSON(owner[key]);
        if (parsed && typeof parsed === 'object') {
            codes.push({ owner, key, parsed, wasString: typeof owner[key] === 'string' });
        }
    };
    addCode(item, 'script');
    (Array.isArray(item.objects) ? item.objects : []).forEach((object) => {
        object && addCode(object, 'script');
    });
    const functionCodes = new Map();
    incomingFunctions.forEach((func) => {
        const before = codes.length;
        addCode(func, 'content');
        if (codes.length > before) {
            functionCodes.set(func, codes[codes.length - 1]);
        }
    });

    const replaceAll = (partialMaps) => {
        codes.forEach(({ parsed }) => replaceReferences(parsed, partialMaps, blockTypes));
    };
    if (hasEntries(maps.variables) || hasEntries(maps.messages)) {
        replaceAll({ variables: maps.variables, messages: maps.messages });
    }

    // 함수A 가 새 id 를 받으면 A 를 쓰는 함수C 의 내용도 달라지므로, 더 바뀌는 것이 없을 때까지 반복한다.
    const remapped = new Set();
    const remapChangedFunctions = () => {
        let remappedAny = false;
        incomingFunctions.forEach((func) => {
            if (!func.id || remapped.has(func)) {
                return;
            }
            const existing = existingFunctions[func.id];
            let needsNewId = false;
            if (existing) {
                const code = functionCodes.get(func);
                const current = code ? { ...func, content: code.parsed } : func;
                needsNewId = !isSameFunction(current, existing);
            } else if (reservedFunctionIds.includes(func.id)) {
                needsNewId = true;
            }
            if (needsNewId) {
                const oldId = func.id;
                const newId = createId();
                maps.functions[oldId] = newId;
                func.id = newId;
                remapped.add(func);
                replaceAll({ functions: { [oldId]: newId } });
                remappedAny = true;
            }
        });
        return remappedAny;
    };
    let changed = remapChangedFunctions();
    while (changed) {
        changed = remapChangedFunctions();
    }

    if (hasEntries(maps.functions) || hasEntries(maps.variables) || hasEntries(maps.messages)) {
        codes.forEach(({ owner, key, parsed, wasString }) => {
            owner[key] = wasString ? JSON.stringify(parsed) : parsed;
        });
    }

    return maps;
};
