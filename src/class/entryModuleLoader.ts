type EntryBlockRegisterSchema = {
    blockName: string;
    block: EntryBlock;
    isBlockShowBlockMenu?: boolean;
};

class EntryModuleLoader {
    private _moduleList: string[] = [];

    get moduleList() {
        return this._moduleList;
    }

    /**
     * 해당 url 을 동적으로 로드한다.
     * 해당 함수는 굉장히 위험하므로 추가적인 방어로직이 필요하다.
     */
    // bl.loadModule(moduleName: string) bl.loadBlock(blockName, block)...
    loadModule(moduleName: string): Promise<void> {
        // 이미 로드된 모듈은 다시 로드하지 않는다.
        if (this._moduleList.includes(moduleName)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const scriptElementId = `entryModuleScript${Date.now()}`;

            if (!moduleName) {
                return;
            }
            const scriptElement = document.createElement('script');
            scriptElement.id = scriptElementId;

            scriptElement.onload = () => {
                this._moduleList.push(moduleName);
                scriptElement.remove();
                resolve();
            };
            scriptElement.onerror = (e) => {
                scriptElement.remove();
                reject(e);
            };

            scriptElement.src = `${Entry.moduleBaseUrl}${moduleName}/files/block`;

            // noinspection JSCheckFunctionSignatures
            document.body.appendChild(scriptElement);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * [!] 외부에서 사용하는 함수입니다. 모듈화된 블록이 엔트리 등록을 위해 사용하는 함수임
     * 각 블록정보가 존재해야할 위치에 모든 데이터를 뿌려준다. 위치는 아래와 같다
     * - Entry.HARDWARE_LIST
     * - Entry.block : 실제 블록 정보를 담는다.
     *
     * 워크스페이스 리로드시 정보가 저장되지 않는다.
     * 이 후 블록메뉴에 블록들을 실시간으로 추가한 뒤 reDraw 한다.
     * @param moduleObject 하드웨어 모듈. 여타 하드웨어 모듈 파일 참조
     */
    registerHardwareModule(moduleObject: EntryHardwareBlockModule) {
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

        this.setLanguageTemplates(moduleObject);
        const blockObjects = moduleObject.getBlocks();
        const blockMenuBlocks = moduleObject.blockMenuBlocks;

        this.loadBlocks({
            categoryName: 'arduino',
            blockSchemas: Object.entries(blockObjects).map(([blockName, block]) => ({
                blockName,
                block,
                isBlockShowBlockMenu: blockMenuBlocks.indexOf(blockName) > -1,
            })),
        });

        Entry.hw.setExternalModule(moduleObject);
        Entry.dispatchEvent('hwChanged');
    }

    /**
     * 이 함수는 외부 블록 모듈 URL 의 코드가 호출한다.
     * 엔트리 내 '확장' 카테고리에 블록을 추가한다.
     * 블록은 moduleObject 의 정보에 따라 타이틀, 설명 TextBlock 이 같이 추가된다.
     * @param moduleObject
     */
    registerBlockModule(moduleObject: EntryBlockModule) {
        const { name, title, description, getBlocks } = moduleObject;
        const blockSchemas: EntryBlockRegisterSchema[] = [];

        title && blockSchemas.push(this.createTextBlock(name, title.ko));
        description && blockSchemas.push(this.createTextBlock(name, description));
        getBlocks &&
            blockSchemas.push(
                ...Object.entries(getBlocks()).map(([blockName, block]) => ({
                    blockName,
                    block,
                    isBlockShowBlockMenu: true,
                }))
            );

        this.loadBlocks({
            categoryName: 'expansion',
            blockSchemas,
        });
        // (5. 모듈리스트에 등록한다. 등록이 이루어지는 경우, 엔트리 verified 블록인지 외부 url 로드된 블록인지 판단해야 한다.)
    }

    loadBlocks({
        categoryName,
        blockSchemas,
    }: {
        categoryName: string;
        blockSchemas: EntryBlockRegisterSchema[];
    }) {
        const blockMenu = Entry.getMainWS().blockMenu;

        blockSchemas.forEach((blockSchema) => {
            this.applyDefaultProperties(blockSchema);
            const { blockName, block, isBlockShowBlockMenu } = blockSchema;

            // 블록의 카테고리를 정의할때 사용
            if (!block.category) {
                block.category = categoryName;
            }

            Entry.block[blockName] = block;

            if (isBlockShowBlockMenu) {
                blockMenu.addCategoryData(categoryName, blockName);
            }
        });

        blockMenu.reDraw();
    }

    private createTextBlock(moduleName: string, content: string): EntryBlockRegisterSchema {
        const blockName = `${moduleName}_${Math.random()}`;
        const block: EntryBlock = {
            color: EntryStatic.colorSet.common.TRANSPARENT,
            skeleton: 'basic_text',
            class: moduleName,
            template: '%1',
            params: [
                {
                    type: 'Text',
                    text: content,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: blockName,
            },
            isNotFor: [moduleName],
            events: {},
        };
        return { blockName, block };
    }

    /**
     * TODO 리로드 되는 경우 다시 불러오지 않기 때문에 템플릿정보 저장이 필요함
     */
    private setLanguageTemplates(moduleObject: EntryHardwareBlockModule) {
        if (moduleObject.setLanguage) {
            const langTemplate = moduleObject.setLanguage();
            const data = langTemplate[Lang.type] || langTemplate[Lang.fallbackType];
            for (const key in data) {
                Object.assign(Lang[key], data[key]);
            }
        }
    }

    /**
     * 블록 모델이 블록객체로서 구현되기 전에 불충분한 프로퍼티나 잘못된 값이 있는 경우 이쪽에서 수정한다.
     */
    private applyDefaultProperties({ blockName, block }: EntryBlockRegisterSchema) {
        if (!block.color) {
            block.color = EntryStatic.colorSet.block.default.EXPANSION;
            block.outerLine = EntryStatic.colorSet.block.darken.EXPANSION;
        }

        if (!block.type) {
            block.type = blockName;
        }
    }
}

const instance = new EntryModuleLoader();
export default instance;
Entry.moduleManager = instance;

/**
 * 프로젝트 가 외부 모듈이 사용되었는지 확인하고, 로드한다
 * @param {*} project 엔트리 프로젝트
 * @return Promise
 */
Entry.loadExternalModules = async (project = {}) => {
    const { externalModules = [] } = project;
    await Promise.all(externalModules.map(instance.loadModule));
};
