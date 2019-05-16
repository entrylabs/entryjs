Entry.moduleManager = new class {
    /**
     * 해당 url 을 동적으로 로드한다.
     * 해당 함수는 굉장히 위험하므로 추가적인 방어로직이 필요하다.
     * @param url 로드할 주소
     */
    loadScript(url) {
        const scriptElementId = 'entryModuleScript';
        const prevElement = document.getElementById(scriptElementId);
        if (prevElement) {
            prevElement.remove();
        }

        if (!url) {
            return;
        }
        const scriptElement = document.createElement('script');
        scriptElement.id = scriptElementId;

        scriptElement.onload = function() {
            // nothing to do yet
        };
        scriptElement.src = url;

        // noinspection JSCheckFunctionSignatures
        document.body.appendChild(scriptElement);
    }

    /**
     * 각 블록정보가 존재해야할 위치에 모든 데이터를 뿌려준다. 위치는 아래와 같다
     * - Entry.HARDWARE_LIST
     * - EntryStatic.DynamicHardwareBlocks : 블록명을 담는다.
     *   블록목록은 keyName 으로 하드코딩되어있기 때문에, 동적추가는 이 변수에 담아야 한다.
     *   이 변수에 담는 이유는 WS 가 리로드 되는 경우에도 정보를 들고있기 위해서이다.
     * - Entry.block : 실제 블록 정보를 담는다.
     *
     * 이 후 블록메뉴에 블록들을 실시간으로 추가한 뒤 reDraw 한다.
     * TODO 아직 만드는중.. unbanClass 나 프로젝트 리로드 후 처리 등 그런쪽이 미흡합니다.
     * @param moduleObject 하드웨어 모듈. 여타 하드웨어 모듈 파일 참조
     */
    registerHardwareModule(moduleObject) {
        Entry.HARDWARE_LIST[moduleObject.id] = moduleObject;
        const blockObjects = this._getTemplateAddedBlocks(moduleObject);
        const blockMenu = Entry.getMainWS().blockMenu;

        Object.entries(blockObjects).forEach(([blockName, block]) => {
            Entry.block[blockName] = block;
            blockMenu.addCategoryData('arduino', blockName);
        });
        Entry.hw.hwModule = moduleObject;
        blockMenu.hwCodeOutdated = true;
        Entry.dispatchEvent('hwChanged');
    }

    /**
     * TODO 리로드 되는 경우 다시 불러오지 않기 때문에 템플릿정보 저장이 필요함
     */
    _getTemplateAddedBlocks(moduleObject) {
        if (!moduleObject.getBlocks) {
            return {};
        }
        const blockObjects = moduleObject.getBlocks();
        if (moduleObject.setLanguage) {
            const langTemplate = moduleObject.setLanguage();
            const data = langTemplate[Lang.type] || langTemplate[Lang.fallbackType];
            for (const key in data) {
                Object.assign(Lang[key], data[key]);
            }
        }

        return blockObjects;
    }
}();
