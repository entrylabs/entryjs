Entry.moduleManager = new (class {
    /**
     * 해당 url 을 동적으로 로드한다.
     * 해당 함수는 굉장히 위험하므로 추가적인 방어로직이 필요하다.
     * @param moduleName {string} 로드할 모듈명
     */
    loadExternalModule(moduleName) {
        return new Promise((resolve, reject) => {
            const scriptElementId = `entryModuleScript${Date.now()}`;

            if (!moduleName) {
                return;
            }
            const scriptElement = document.createElement('script');
            scriptElement.id = scriptElementId;

            scriptElement.onload = function() {
                if (!Entry.EXTERNAL_MODULE_LIST) {
                    Entry.EXTERNAL_MODULE_LIST = [];
                }
                Entry.EXTERNAL_MODULE_LIST.push(moduleName);
                scriptElement.remove();
                resolve();
            };
            scriptElement.onerror = function(e) {
                scriptElement.remove();
                reject(e);
            };

            // TODO baseUrl 관련해서 정리가 필요함
            // scriptElement.src = `/rest/hardware/${moduleName}/block`;
            scriptElement.src = `https://hw.playentry.org:23518/modules/${moduleName}`;

            // noinspection JSCheckFunctionSignatures
            document.body.appendChild(scriptElement);
        });
    }

    /**
     * 각 블록정보가 존재해야할 위치에 모든 데이터를 뿌려준다. 위치는 아래와 같다
     * - Entry.HARDWARE_LIST
     * - Entry.block : 실제 블록 정보를 담는다.
     *
     * 워크스페이스 리로드시 정보가 저장되지 않는다.
     * 이 후 블록메뉴에 블록들을 실시간으로 추가한 뒤 reDraw 한다.
     * @param moduleObject 하드웨어 모듈. 여타 하드웨어 모듈 파일 참조
     */
    registerHardwareModule(moduleObject) {
        if (!moduleObject.getBlocks || !moduleObject.blockMenuBlocks) {
            return;
        }

        if (typeof moduleObject.id === 'string') {
            Entry.HARDWARE_LIST[moduleObject.id] = moduleObject;
        } else if (moduleObject.id instanceof Array) {
            moduleObject.id.forEach((id) => {
                Entry.HARDWARE_LIST[id] = moduleObject;
            });
        }

        this._setLanguageTemplates(moduleObject);
        const blockObjects = moduleObject.getBlocks();
        const blockMenuBlocks = moduleObject.blockMenuBlocks;
        const blockMenu = Entry.getMainWS().blockMenu;

        Object.entries(blockObjects).forEach(([blockName, block]) => {
            Entry.block[blockName] = block;

            if (blockMenuBlocks.indexOf(blockName) > -1) {
                blockMenu.addCategoryData('arduino', blockName);
            }
        });
        Entry.hw.setExternalModule(moduleObject);
        Entry.dispatchEvent('hwChanged');
    }

    /**
     * TODO 리로드 되는 경우 다시 불러오지 않기 때문에 템플릿정보 저장이 필요함
     */
    _setLanguageTemplates(moduleObject) {
        if (moduleObject.setLanguage) {
            const langTemplate = moduleObject.setLanguage();
            const data = langTemplate[Lang.type] || langTemplate[Lang.fallbackType];
            for (const key in data) {
                Object.assign(Lang[key], data[key]);
            }
        }
    }
})();
