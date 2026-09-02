/**
 * ENTRY-199 회귀 테스트
 *
 * 블록 슬롯의 값이 새로고침 후 10으로 바뀌는 버그.
 *
 * _startContentRender 는 리렌더 때마다 필드를 전부 새로 만들면서 _contents 를
 * 빈 배열로 갈아치운다. 이때 버려지는 필드가 슬롯 안 블록의 뷰에 걸어둔
 * 옵저버는 끊기지 않고 남는다. 슬롯 안 블록은 params 에 살아있으므로 그
 * 옵저버도 함께 살아남아, 나중에 블록이 움직일 때 이미 버려진 필드가 깨어나
 * params 를 빈 슬롯 기본값(10)으로 덮어쓴다.
 *
 * FieldBlock 생성자는 board/svg 에 의존해 jsdom 에서 인스턴스화할 수 없으므로
 * 프로토타입만 가져와 옵저버 등록 상태를 재현한다. 검증은 목 호출 여부가 아니라
 * 실제 옵저버 배열 상태와 실제 notify 결과로 한다.
 */

global.Entry = {};
global._ = require('lodash');
// util/static 은 .ts 파일을 import 하고 babel 에 TypeScript preset 이 없어 로드할 수 없다.
// BlockView 는 인스턴스 생성 시에만 STATIC 을 참조하므로 값만 채워준다.
Entry.STATIC = { BLOCK_RENDER_MODEL: 1 };

require('../../src/core/model');
require('../../src/core/observer');
require('../../src/core/event');
require('../../src/playground/field/field');
require('../../src/playground/field/block');
require('../../src/playground/field/output');
require('../../src/playground/block_view');

const RENDER_MODE_BLOCK = 1;

/** 슬롯 안 블록의 뷰 역할. 실제 Entry.Model 이므로 observe/notify 가 진짜로 동작한다. */
function createSlotBlockView() {
    const view = { schema: { x: 0, y: 0, width: 0, height: 0 } };
    Entry.Model(view, false);
    return view;
}

/** 리렌더로 버려질 필드. 실제 FieldBlock 프로토타입을 쓴다. */
function createFieldBlock(slotBlockView) {
    const field = Object.create(Entry.FieldBlock.prototype);
    field._posObserver = slotBlockView.observe(field, 'updateValueBlock', ['x', 'y'], false);
    field._sizeObserver = slotBlockView.observe(field, 'calcWH', ['width', 'height'], false);
    return field;
}

/** _startContentRender 실행에 필요한 최소 BlockView 컨텍스트. 템플릿이 비어 새 필드는 만들지 않는다. */
function createBlockViewContext(contents) {
    return {
        renderMode: RENDER_MODE_BLOCK,
        svgGroup: { elem: () => ({}) },
        contentSvgGroup: { remove: () => {} },
        statementSvgGroup: null,
        statementCommentGroup: null,
        svgCommentGroup: null,
        _schema: { statements: [], fontColor: '#000' },
        _getTemplate: () => '',
        _getSchemaParams: () => [],
        _contents: contents,
        _statements: [],
        _paramMap: {},
        alignContent: () => {},
    };
}

function reRender(blockView) {
    Entry.BlockView.prototype._startContentRender.call(blockView, RENDER_MODE_BLOCK);
}

test('리렌더로 버려지는 필드의 옵저버는 슬롯 블록뷰에서 제거된다', () => {
    const slotBlockView = createSlotBlockView();
    const field = createFieldBlock(slotBlockView);
    expect(slotBlockView.observers).toHaveLength(2);

    reRender(createBlockViewContext([field]));

    expect(slotBlockView.observers).toHaveLength(0);
});

test('리렌더를 반복해도 슬롯 블록뷰에 옵저버가 누적되지 않는다', () => {
    const slotBlockView = createSlotBlockView();

    for (let i = 0; i < 3; i++) {
        const field = createFieldBlock(slotBlockView);
        reRender(createBlockViewContext([field]));
    }

    expect(slotBlockView.observers).toHaveLength(0);
});

test('리렌더로 버려지는 출력 필드의 옵저버도 슬롯 블록뷰에서 제거된다', () => {
    const slotBlockView = createSlotBlockView();
    const field = Object.create(Entry.FieldOutput.prototype);
    field._posObserver = slotBlockView.observe(field, '_updateValueBlock', ['x', 'y'], false);
    field._sizeObserver = slotBlockView.observe(field, 'calcWH', ['width', 'height'], false);
    expect(slotBlockView.observers).toHaveLength(2);

    reRender(createBlockViewContext([field]));

    expect(slotBlockView.observers).toHaveLength(0);
});

test('버려진 필드는 슬롯 블록이 움직여도 깨어나지 않는다', () => {
    const slotBlockView = createSlotBlockView();
    const field = createFieldBlock(slotBlockView);

    const wokenWith = [];
    field.updateValueBlock = (block) => wokenWith.push(block);
    field.calcWH = () => {};

    reRender(createBlockViewContext([field]));

    // bumpAway 가 0.15초 뒤에 하는 일: moveBy -> moveTo -> set({x, y}) -> notify
    slotBlockView.set({ x: 30, y: 30 });

    expect(wokenWith).toEqual([]);
});
