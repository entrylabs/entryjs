/**
 * ENTRY-251 회귀 테스트
 *
 * 오브젝트가 없는 장면에서 글상자 탭이 보이고 블록 꾸러미가 비는 버그.
 *
 * 선택할 오브젝트가 없으면 scene.selectScene / container.removeObject 가
 * injectObject 대신 flushPlayground 를 부른다. flushPlayground 는 오브젝트만
 * 비우고 탭·뷰·블록 메뉴를 그대로 두었기 때문에
 *  - 처음부터 빈 장면이면 viewMode 가 'default' 에 머물러 블록 영역이 숨겨진 채 남고
 *  - 블록 메뉴 카테고리가 한 번도 펼쳐지지 않으며
 *  - 글상자 탭을 연 채 빈 장면으로 가면 이전 글상자 내용이 그대로 보였다.
 *
 * 모양·소리·속성 탭은 오브젝트가 없을 때의 화면이 따로 있으므로 보던 탭을 유지한다.
 *
 * Playground 생성자는 워크스페이스 전체에 의존해 jsdom 에서 만들 수 없으므로
 * 프로토타입에 실제 DOM 요소를 붙여 검증한다. changeViewMode 는 목이 아니라
 * 실제 구현을 타게 해서 클래스 상태로 결과를 확인한다.
 */

jest.mock('@entrylabs/tool', () => ({}), { virtual: true });
jest.mock('@entrylabs/event', () => function EntryEvent() {}, { virtual: true });
jest.mock('../../src/playground/toast', () => ({}));
jest.mock('../../src/util/destroyer/Destroyer', () => ({
    Destroyer: function Destroyer() {
        this.destroy = () => {};
    },
}));
jest.mock('../../src/class/DataTable', () => ({}));
jest.mock('../../src/class/sound', () => function SoundEditor() {});
jest.mock('../../src/entry', () => ({}));

const Entry = require('../../src/entry');
global.Entry = Entry;
global._ = require('lodash');

require('../../src/class/playground');

const REMOVE = 'entryRemove';
const SELECTED = 'entryTabSelected';

/** Entry.createElement 가 붙여주는 클래스 헬퍼를 가진 실제 DOM 요소 */
function createElement(id, ...classes) {
    const element = document.createElement('div');
    if (id) {
        element.id = id;
    }
    element.addClass = (...names) => {
        names.forEach((name) => element.classList.add(...name.split(' ')));
        return element;
    };
    element.removeClass = (...names) => {
        names.forEach((name) => element.classList.remove(...name.split(' ')));
        return element;
    };
    element.hasClass = (name) => element.classList.contains(name);
    classes.forEach((name) => element.classList.add(name));
    return element;
}

/**
 * 워크스페이스가 뜬 직후의 playground 상태를 만든다.
 * applyTabOption 이 모양·글상자 탭을 모두 켜 둔 상태에서 시작한다.
 */
function createPlayground() {
    const playground = Object.create(Entry.Playground.prototype);

    const view = createElement('entryPlayground');
    ['entryPicture', 'entryText', 'entrySound'].forEach((id) =>
        view.appendChild(createElement(id, REMOVE))
    );
    view.appendChild(createElement('entryDefault'));
    view.appendChild(createElement('entryCode', REMOVE));

    const blockMenu = { reDraw: jest.fn(), setMenu: jest.fn(), show: jest.fn(), hide: jest.fn() };
    const board = { clear: jest.fn(), changeCode: jest.fn() };

    Object.assign(playground, {
        view_: view,
        viewMode_: 'default',
        object: null,
        tabViewElements: {
            code: createElement('entryCodeTab', SELECTED),
            picture: createElement('entryPictureTab'),
            text: createElement('entryTextboxTab'),
            sound: createElement('entrySoundTab'),
            variable: createElement('entryVariableTab'),
        },
        resizeHandle_: createElement(),
        boardView_: createElement(),
        tabButtonView_: createElement(),
        variableView_: createElement(),
        textView_: createElement('entryTextView'),
        pictureView_: createElement(),
        soundView_: createElement(),
        painter: { show: jest.fn(), hide: jest.fn() },
        soundEditor: { hide: jest.fn() },
        blockMenu,
        mainWorkspace: { getBlockMenu: () => blockMenu },
        injectPicture: jest.fn(),
        initSortablePictureWidget: jest.fn(),
        injectSound: jest.fn(),
    });

    Object.assign(Entry, {
        playground,
        pictureEditable: true,
        soundEditable: true,
        engine: { isState: () => false },
        windowResized: { notify: jest.fn() },
        getMainWS: () => ({ getBoard: () => board }),
    });

    return { playground, blockMenu, view };
}

const isHidden = (element) => element.classList.contains(REMOVE);
const findView = (view, id) => Array.from(view.children).find((child) => child.id === id);

describe('ENTRY-251: 오브젝트가 없는 장면의 탭·블록 꾸러미', () => {
    test('처음부터 빈 장면이면 블록 영역을 보여주고 블록 메뉴를 펼친다', () => {
        const { playground, blockMenu, view } = createPlayground();

        playground.flushPlayground();

        expect(playground.viewMode_).toBe('code');
        expect(isHidden(findView(view, 'entryCode'))).toBe(false);
        expect(isHidden(findView(view, 'entryDefault'))).toBe(true);
        expect(blockMenu.setMenu).toHaveBeenCalledTimes(1);
    });

    test('빈 장면에서는 글상자 탭을 숨기고 모양 탭을 남긴다', () => {
        const { playground } = createPlayground();
        const { text, picture, code } = playground.tabViewElements;

        playground.flushPlayground();

        expect(isHidden(text)).toBe(true);
        expect(isHidden(picture)).toBe(false);
        expect(code.classList.contains(SELECTED)).toBe(true);
    });

    test('글상자 탭을 연 채 빈 장면으로 가면 모양 탭으로 넘어간다', () => {
        const { playground, view } = createPlayground();
        const { text, picture } = playground.tabViewElements;
        // 글상자 오브젝트의 글상자 탭을 보고 있던 상태
        playground.currentObjectType = 'textBox';
        playground.viewMode_ = 'text';
        picture.addClass(REMOVE);
        playground.tabViewElements.code.removeClass(SELECTED);
        text.addClass(SELECTED);
        findView(view, 'entryText').removeClass(REMOVE);

        playground.flushPlayground();

        expect(playground.viewMode_).toBe('picture');
        expect(isHidden(findView(view, 'entryText'))).toBe(true);
        expect(isHidden(findView(view, 'entryPicture'))).toBe(false);
        expect(text.classList.contains(SELECTED)).toBe(false);
        expect(picture.classList.contains(SELECTED)).toBe(true);
        expect(isHidden(text)).toBe(true);
        expect(isHidden(picture)).toBe(false);
    });

    test.each(['code', 'picture', 'sound', 'variable'])(
        '%s 탭을 보다가 빈 장면으로 가면 보던 탭을 유지한다',
        (viewMode) => {
            const { playground } = createPlayground();
            playground.currentObjectType = 'sprite';
            playground.viewMode_ = viewMode;
            playground.changeViewMode = jest.fn();

            playground.flushPlayground();

            expect(playground.changeViewMode).not.toHaveBeenCalled();
            expect(playground.viewMode_).toBe(viewMode);
        }
    );

    test('이미 오브젝트 유형으로 블록 메뉴가 설정돼 있으면 다시 펼치지 않는다', () => {
        const { playground, blockMenu } = createPlayground();
        playground.currentObjectType = 'sprite';
        playground.viewMode_ = 'code';

        playground.flushPlayground();

        expect(blockMenu.setMenu).not.toHaveBeenCalled();
    });

    test('모양 편집을 끈 환경에서는 모양·글상자 탭 표시를 건드리지 않는다', () => {
        const { playground } = createPlayground();
        const { text, picture } = playground.tabViewElements;
        Entry.pictureEditable = false;
        text.addClass(REMOVE);
        picture.addClass(REMOVE);

        playground.flushPlayground();

        expect(isHidden(text)).toBe(true);
        expect(isHidden(picture)).toBe(true);
    });

    test('뷰가 없는 환경(minimize 등)에서는 오브젝트만 비운다', () => {
        const { playground, blockMenu } = createPlayground();
        playground.view_ = null;
        playground.object = {};

        playground.flushPlayground();

        expect(playground.object).toBeNull();
        expect(playground.viewMode_).toBe('default');
        expect(blockMenu.setMenu).not.toHaveBeenCalled();
    });
});
