import fetch from 'isomorphic-fetch';
import cryptojs from 'crypto-js';
type EntryBlockRegisterSchema = {
    blockName: string;
    block: EntryBlock;
    isBlockShowBlockMenu?: boolean;
};

class EntryModuleLoader {
    public moduleList: string[] = [];
    public moduleListLite: string[] = [];

    /**
     * @deprecated
     * 해당 url 을 동적으로 로드한다.
     * 해당 함수는 굉장히 위험하므로 추가적인 방어로직이 필요하다.
     * key는 로컬에서 파일을 암호화 하여 entry-hw 에서 전달, 해당 파일을 로컬에 있는 키로 1차 검증, 서버로 2차 검증을 통한 무결성/보안 확보
     * 오프라인의 경우, 오픈소스임으로, 로컬상태에서의 비정상적인 사용에 대한 제약이 힘든 부분이 있음. 다만, 온라인이 되는 경우 서버 검증을 사용 할 수 있음
     */
    // bl.loadModule(moduleName: string) bl.loadBlock(blockName, block)...
    async loadModule(moduleInfo: { name: string; file: string }): Promise<void> {
        if (!moduleInfo.file || !moduleInfo.name) {
            return;
        }

        let blockFile = moduleInfo.file;
        if (Entry.offlineModulePath) {
            if (window.sendSync) {
                blockFile = window.sendSync('decryptBlock', blockFile);
            }
        }

        const key = cryptojs.SHA1(blockFile);
        // sha1 key를 이용한 블럭 파일 검증.
        if (window.navigator.onLine) {
            try {
                const sha1Result = await fetch(
                    `${Entry.moduleBaseUrl}key/${moduleInfo.name}/${key}`
                );
                if (sha1Result.status != 200) {
                    throw new Error('MODULE NOT VERIFIED');
                }
            } catch (e) {
                throw new Error('MODULE NOT VERIFIED');
            }
        }
        if (!moduleInfo) {
            return;
        }
        await this.loadScript(moduleInfo.name, blockFile);
    }

    async loadModuleFromLocalOrOnline(name: string, isLite?: boolean) {
        const lowerCaseName = isLite ? name : name.toLowerCase();
        const baseUrl = isLite ? Entry.moduleliteBaseUrl : Entry.moduleBaseUrl;
        let path = `${baseUrl}${name}/files/block`;
        if (Entry.offlineModulePath) {
            path = `file://${Entry.offlineModulePath}/${lowerCaseName}/block`;
        }
        const response = await fetch(path);
        if (response.status != 200) {
            throw new Error('MODULE NOT EXIST');
        }
        let result = await response.text();
        if (Entry.offlineModulePath) {
            if (window.sendSync) {
                result = window.sendSync('decryptBlock', result);
            }
        }
        await this.loadScript(name, result, isLite);
    }

    async loadScript(name: string, code: string, isLite?: boolean) {
        return await new Promise(async (resolve, reject) => {
            const scriptElementId = `entryModuleScript${Date.now()}`;
            const scriptElement = document.createElement('script');
            scriptElement.id = scriptElementId;

            scriptElement.onload = () => {
                this.moduleListLite = [name];
                scriptElement.remove();
                resolve();
            };
            scriptElement.onerror = (e) => {
                scriptElement.remove();
                reject(e);
            };

            const blobedBlock = new Blob([code], {
                type: 'text/javascript',
            });
            const blobUrl = URL.createObjectURL(blobedBlock);

            scriptElement.src = blobUrl;
            // noinspection JSCheckFunctionSignatures
            document.body.appendChild(scriptElement);
            URL.revokeObjectURL(blobUrl);
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
        const prevModuleBlocks =
            Entry.HARDWARE_LIST[`${moduleObject.id}`] &&
            Entry.HARDWARE_LIST[`${moduleObject.id}`].blockMenuBlocks;
        // clear prevModule if present
        if (prevModuleBlocks) {
            let removedCnt = 0;
            for (const key of Object.keys(Entry.block)) {
                if (prevModuleBlocks.indexOf(key) > -1) {
                    delete Entry.block[`${key}`];
                    removedCnt++;
                }
                if (removedCnt == prevModuleBlocks.length) {
                    break;
                }
            }
        }

        if (typeof moduleObject.id === 'string') {
            Entry.HARDWARE_LIST[`${moduleObject.id}`] = moduleObject;
        } else if (moduleObject.id instanceof Array) {
            moduleObject.id.forEach((id) => {
                Entry.HARDWARE_LIST[`${id}`] = moduleObject;
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

    async registerHardwareLiteModule(moduleName: string, isDeveloping: boolean) {
        if (!isDeveloping) {
            await this.loadModuleFromLocalOrOnline(moduleName, true);
        }
        Entry.hwLite.banClassAllHardwareLite();
        // @ts-ignore
        const moduleObject = Entry[moduleName] as EntryHardwareBlockModule;
        if (!moduleObject.getBlocks || !moduleObject.blockMenuBlocks) {
            return;
        }
        this.setLanguageTemplates(moduleObject);
        const blockObjects = moduleObject.getBlocks();
        const blockMenuBlocks = moduleObject.blockMenuBlocks;
        this.loadBlocks({
            categoryName: 'arduino_lite',
            blockSchemas: Object.entries(blockObjects).map(([blockName, block]) => ({
                blockName,
                block,
                isBlockShowBlockMenu: blockMenuBlocks.indexOf(blockName) > -1,
            })),
        });
        Entry.hwLite.setExternalModule(moduleObject);
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
    }

    loadBlocks({
        categoryName,
        blockSchemas,
    }: {
        categoryName: string;
        blockSchemas: EntryBlockRegisterSchema[];
    }) {
        const blockMenu = Entry.getMainWS()?.blockMenu;

        blockSchemas.forEach((blockSchema) => {
            this.applyDefaultProperties(blockSchema);
            const { blockName, block, isBlockShowBlockMenu } = blockSchema;

            // 블록의 카테고리를 정의할때 사용
            if (!block.category) {
                block.category = categoryName;
            }

            Entry.block[blockName] = block;
            if (isBlockShowBlockMenu && blockMenu) {
                blockMenu.addCategoryData(categoryName, blockName);
            }
        });
        if (!blockMenu) {
            return;
        }

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
    await Promise.all(externalModules.map(instance.loadModuleFromLocalOrOnline.bind(instance)));
};

Entry.loadLiteExternalModules = async (project = {}) => {
    const { externalModulesLite = [] } = project;
    Entry.externalModulesLite = externalModulesLite;
    await Promise.all(externalModulesLite.map(instance.registerHardwareLiteModule.bind(instance)));
};

/**
 * 개발용 코드, path를 통해서 블럭을 로딩할수 있음.
 * @param path
 */
Entry.loadLiteTestModule = async (file: File, name: string) => {
    const result = await file.text();
    await Entry.moduleManager.loadScript(name, result, true);
    Entry.moduleManager.registerHardwareLiteModule(name, true);
};

Entry.loadLiteTestModuleUploader = () => {
    const headerBtns = document.querySelector('section');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    const loadButton = document.createElement('button');
    loadButton.innerText = '적용';
    const handleUpdate = async () => {
        const file = fileInput.files[0];
        fileInput.value = null;
        await Entry.loadLiteTestModule(file, nameInput.value);
    };

    loadButton.onclick = handleUpdate;
    headerBtns.prepend(loadButton);
    headerBtns.prepend(fileInput);
    headerBtns.prepend(nameInput);
};
