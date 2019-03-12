'use strict';

class TextCodingUtil {
    // Entry 에서 사용 중
    canUsePythonVariables(variables) {
        return variables.every((variable) => {
            const target = variable.variableType === 'variable' ? 'v' : 'l';
            return !Entry.TextCodingUtil.checkName(variable.name, target);
        });
    }

    // Entry 에서 사용 중
    canUsePythonFunctions(functions) {
        return functions.every(({ content }) => {
            const code = new Entry.Code(content);
            let paramBlock = code.getEventMap('funcDef')[0];
            paramBlock = paramBlock && paramBlock.params[0];

            if (!paramBlock) {
                return true;
            }

            if (paramBlock.type !== 'function_field_label') {
                return false;
            }

            const params = paramBlock.params;

            if (!params[1]) {
                if (test(params[0])) {
                    return false;
                }
            } else if (this.hasFunctionFieldLabel(params[1])) {
                return false;
            }

            return true;
        });

        function test(name) {
            return / /.test(name);
        }
    }

    initQueue() {
        this._funcParamQ = new Entry.Queue();
        this._funcNameQ = new Entry.Queue();
    }

    clearQueue() {
        this._funcParamQ.clear();
        this._funcNameQ.clear();
    }

    indent(textCode) {
        let result = '\t';
        const indentedCodeArr = textCode.split('\n');
        indentedCodeArr.pop();
        result += indentedCodeArr.join('\n\t');
        result = `\t${result.trim()}`; //.concat('\n');

        return result;
    }

    isNumeric(value) {
        const stringValue = String(Math.abs(value));
        return !!(stringValue.match(/^-?\d+$|^-\d+$/) || stringValue.match(/^-?\d+\.\d+$/));
    }

    isBinaryOperator(value) {
        return ['==', '>', '<', '>=', '>=', '<=', '+', '-', '*', '/'].indexOf(value) > -1;
    }

    logicalExpressionConvert(operator) {
        let result;
        switch (operator) {
            case '&&': {
                result = null;
                break;
            }
            case '||': {
                result = null;
                break;
            }
            default: {
                result = operator;
            }
        }
        return result;
    }

    dropdownDynamicIdToNameConvertor(id, menuName) {
        let result;

        switch (menuName) {
            case 'variables': {
                const entryVariables = Entry.variableContainer.variables_;
                for (const varKey in entryVariables) {
                    const entryVariable = entryVariables[varKey];
                    if (entryVariable.id_ === id) {
                        if (entryVariable.object_) {
                            result = `self.${entryVariable.name_}`;
                        } else {
                            result = entryVariable.name_;
                        }
                        break;
                    }
                }
                break;
            }
            case 'lists': {
                const entryLists = Entry.variableContainer.lists_;
                for (const listKey in entryLists) {
                    const entryList = entryLists[listKey];
                    if (entryList.id_ === id) {
                        if (entryList.object_) {
                            result = `self.${entryList.name_}`;
                        } else {
                            result = entryList.name_;
                        }
                        break;
                    }
                }
                break;
            }
            case 'messages': {
                const entryMessages = Entry.variableContainer.messages_;
                for (const messageKey in entryMessages) {
                    const entryList = entryMessages[messageKey];
                    if (entryList.id === id) {
                        result = entryList.name;
                        break;
                    }
                }
                break;
            }
            case 'pictures': {
                const objects = Entry.container.getAllObjects();
                for (const objKey in objects) {
                    const object = objects[objKey];
                    const pictures = object.pictures;
                    for (const picKey in pictures) {
                        const picture = pictures[picKey];
                        if (picture.id === id) {
                            result = picture.name;
                            return result;
                        }
                    }
                }
                break;
            }
            case 'sounds': {
                const objects = Entry.container.getAllObjects();
                for (const objKey in objects) {
                    const object = objects[objKey];
                    const sounds = object.sounds;
                    for (const soundKey in sounds) {
                        const sound = sounds[soundKey];
                        if (sound.id === id) {
                            result = sound.name;
                            return result;
                        }
                    }
                }
                break;
            }
            case 'scenes': {
                const scenes = Entry.scene.getScenes();
                for (const sceneKey in scenes) {
                    const scene = scenes[sceneKey];
                    if (scene.id === id) {
                        result = scene.name;
                        break;
                    }
                }
                break;
            }
            case 'clone':
            case 'textBoxWithSelf': {
                if (id === 'self') {
                    result = id;
                } else {
                    const objects = Entry.container.objects_.filter((obj) => obj.id === id);
                    result = objects[0] ? objects[0].name : null;
                }
                break;
            }
        }

        return result;
    }
    isEventBlock(block) {
        const blockType = block.data.type;
        return (
            blockType == 'when_run_button_click' ||
            blockType == 'when_some_key_pressed' ||
            blockType == 'mouse_clicked' ||
            blockType == 'mouse_click_cancled' ||
            blockType == 'when_object_click' ||
            blockType == 'when_object_click_canceled' ||
            blockType == 'when_message_cast' ||
            blockType == 'when_scene_start' ||
            blockType == 'when_clone_start'
        );
    }

    isEntryEventFuncByFullText(text) {
        const index = text.indexOf('(');
        const name = text.substring(0, index);

        return (
            name == 'def when_start' ||
            name == 'def when_press_key' ||
            name == 'def when_click_mouse_on' ||
            name == 'def when_click_mouse_off' ||
            name == 'def when_click_object_on' ||
            name == 'def when_click_object_off' ||
            name == 'def when_get_signal' ||
            name == 'def when_start_scene' ||
            name == 'def when_make_clone' ||
            name == 'def entry_event_start' ||
            name == 'def entry_event_key' ||
            name == 'def entry_event_mouse_down' ||
            name == 'def entry_event_mouse_up' ||
            name == 'def entry_event_object_down' ||
            name == 'def entry_event_object_up' ||
            name == 'def entry_event_signal' ||
            name == 'def entry_event_scene_start' ||
            name == 'def entry_event_clone_create'
        );
    }

    searchFuncDefParam(block) {
        if (block.data.type == 'function_field_label') {
            const name = block.data.params[0];
            this._funcNameQ.enqueue(name);
        }

        if (block && block.data && block.data.params && block.data.params[1]) {
            if (
                block.data.type == 'function_field_string' ||
                block.data.type == 'function_field_boolean'
            ) {
                const param = block.data.params[0].data.type;
                this._funcParamQ.enqueue(param);
            }

            return this.searchFuncDefParam(block.data.params[1]);
        } else {
            return block;
        }
    }

    gatherFuncDefParam(block) {
        let result;
        if (block && block.data) {
            if (block.data.params[0]) {
                if (block.data.params[0].data) {
                    const param = block.data.params[0].data.type;
                    if (
                        block.data.type == 'function_field_string' ||
                        block.data.type == 'function_field_boolean'
                    ) {
                        this._funcParamQ.enqueue(param);
                    }
                } else if (block.data.type == 'function_field_label') {
                    const name = block.data.params[0];
                    this._funcNameQ.enqueue(name);
                }
            }
            if (block.data.params[1]) {
                result = this.searchFuncDefParam(block.data.params[1]);

                if (result.data.params[0].data) {
                    const param = result.data.params[0].data.type;

                    if (
                        result.data.type == 'function_field_string' ||
                        result.data.type == 'function_field_boolean'
                    ) {
                        this._funcParamQ.enqueue(param);
                    }
                }

                if (result.data.params[1]) {
                    if (result.data.params[1].data.params[0].data) {
                        const param = result.data.params[1].data.params[0].data.type;

                        if (
                            result.data.params[1].data.type == 'function_field_string' ||
                            result.data.params[1].data.type == 'function_field_boolean'
                        ) {
                            this._funcParamQ.enqueue(param);
                        }
                    }
                }
            }
        }

        return result;
    }

    isParamBlock(block) {
        const type = block.type;
        return (
            type == 'ai_boolean_distance' ||
            type == 'ai_distance_value' ||
            type == 'ai_boolean_object' ||
            type == 'ai_boolean_and'
        );
    }

    hasBlockInfo(data, blockInfo) {
        let result = false;
        for (const key in blockInfo) {
            const info = blockInfo[key];
            if (key == data.type) {
                for (const j in info) {
                    const loc = info[j];
                    if (loc.start == data.start && loc.end == data.end) {
                        result = true;
                        break;
                    }
                }
            }
        }

        return result;
    }

    updateBlockInfo(data, blockInfo) {
        const infoArr = blockInfo[data.type];
        if (infoArr && Array.isArray(infoArr) && infoArr.legnth != 0) {
            for (const i in infoArr) {
                const info = infoArr[i];
                if (info.start == data.start && info.end == data.end) {
                    break;
                } else {
                    var loc = {};
                    loc.start = data.start;
                    loc.end = data.end;

                    infoArr.push(loc);
                }
            }
        } else {
            blockInfo[data.type] = [];

            var loc = {};
            loc.start = data.start;
            loc.end = data.end;

            blockInfo[data.type].push(loc);
        }
    }

    assembleRepeatWhileTrueBlock(block, syntax) {
        let result = '';
        if (block.data.type === 'repeat_while_true') {
            const blockToken = syntax.split(/(?=:)|[ ]/gi); // space 로 split 하되, : 도 자르지만 토큰에 포함
            let lastIndex = blockToken.length - 2;
            const option = blockToken[lastIndex];

            if (option == 'until') {
                const condition = 'not';
                blockToken.splice(1, 0, condition);
                lastIndex += 1;
                blockToken.splice(lastIndex, 1);
                result = blockToken.join(' ').replace(/[ ]+:/, ':');
            } else if (option == 'while') {
                blockToken.splice(lastIndex, 1);
                result = blockToken.join(' ').replace(/[ ]+:/, ':');
            } else {
                result = syntax;
            }
        } else {
            result = syntax;
        }

        return result;
    }

    jsAdjustSyntax(block, syntax) {
        let result = '';
        if (block.data.type == 'ai_boolean_distance') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length - 1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            secondParam = this.bTojBinaryOperatorConvertor(secondParam);
            var thirdParam = tokens[2];

            result = `${firstParam} ${secondParam} ${thirdParam}`;
        } else if (block.data.type == 'ai_boolean_object') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length - 1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            var thirdParam = tokens[2];

            result = `${firstParam} ${secondParam} ${thirdParam}`;
        } else if (block.data.type == 'ai_distance_value') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length - 1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');

            result = firstParam;
        } else {
            result = syntax;
        }

        return result;
    }

    bTojBinaryOperatorConvertor(operator) {
        let result;
        switch (operator) {
            case "'BIGGER'":
                result = '>';
                break;
            case "'BIGGER_EQUAL'":
                result = '>=';
                break;
            case "'EQUAL'":
                result = '==';
                break;
            case "'SMALLER'":
                result = '<';
                break;
            case "'SMALLER_EQUAL'":
                result = '<=';
                break;
        }

        return result;
    }

    jTobBinaryOperatorConvertor(operator) {
        let result;
        switch (operator) {
            case '>':
                result = 'BIGGER';
                break;
            case '>=':
                result = 'BIGGER_EQUAL';
                break;
            case '==':
                result = 'EQUAL';
                break;
            case '<':
                result = 'SMALLER';
                break;
            case '<=':
                result = 'SMALLER_EQUAL';
                break;
        }

        return result;
    }

    radarVariableConvertor(variable) {
        const items = variable.split('_');
        return items[1].toUpperCase();
    }

    tTobDropdownValueConvertor(value) {
        let result;
        if (value == 'stone') {
            result = 'OBSTACLE';
        } else if (value == 'wall') {
            result = value.toUpperCase();
        } else if (value == 'item') {
            result = value.toUpperCase();
        } else {
            result = value;
        }

        return result;
    }

    canConvertTextModeForOverlayMode(convertingMode) {
        let message;
        const oldMode = Entry.getMainWS().oldMode;

        if (
            oldMode == Entry.Workspace.MODE_OVERLAYBOARD &&
            convertingMode == Entry.Workspace.MODE_VIMBOARD
        ) {
            message = Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_EDITOR];
            return message;
        }

        return message;
    }

    isNamesIncludeSpace() {
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        const hasWhiteSpace = (targets, message) => {
            const result = {
                message: undefined,
                type: 'error',
            };

            for (let i = 0; i < targets.length; i++) {
                if (/ /.test(targets[i].name_)) {
                    result.message = message;
                    return result;
                }
            }
        };

        return (
            hasWhiteSpace(
                vc.lists_ || [],
                Lang.TextCoding[Entry.TextCodingError.ALERT_LIST_EMPTY_TEXT]
            ) ||
            hasWhiteSpace(
                vc.variables_ || [],
                Lang.TextCoding[Entry.TextCodingError.ALERT_VARIABLE_EMPTY_TEXT]
            )
        );
    }

    /**
     * TODO 18년 9월자 배포(10/4) 일 임시 코드입니다. 차후 수정 필수입니다.
     * https://oss.navercorp.com/entry/Entry/issues/9155 링크 참조
     * @returns {{message: string, type: string} || undefined}
     */
    hasExpansionBlocks() {
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        const activatedExpansionBlocks = Entry.expansionBlocks;

        if (activatedExpansionBlocks.length > 0) {
            return {
                message: Lang.TextCoding[Entry.TextCodingError.ALERT_API_NO_SUPPORT],
                type: 'error',
            };
        }
    }

    validateVariableToPython() {
        return this.isNamesIncludeSpace() || this.isNameIncludeNotValidChar();
    }

    validateFunctionToPython() {
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        const ERROR_LANG = Lang.TextCoding;
        const ERROR = Entry.TextCodingError;
        const DISORDER = ERROR_LANG[ERROR.ALERT_FUNCTION_NAME_DISORDER];
        const FIELD_MULTI = ERROR_LANG[ERROR.ALERT_FUNCTION_NAME_FIELD_MULTI];
        const HAS_BOOLEAN = ERROR_LANG[ERROR.ALERT_FUNCTION_HAS_BOOLEAN];
        const result = {
            message: undefined,
            type: 'error',
        };

        const targets = vc.functions_ || {};

        for (const i in targets) {
            let paramBlock = targets[i].content.getEventMap('funcDef')[0];
            paramBlock = paramBlock && paramBlock.params[0];
            if (!paramBlock) {
                continue;
            }

            // 함수 파라미터의 첫 값이 이름이어야 한다.
            if (paramBlock.type !== 'function_field_label') {
                result.message = DISORDER;
                return result;
            }

            const { params } = paramBlock;

            // 인자가 하나이상 존재하면 함수명에 공백이 허용되고, 함수명만 존재하면 공백을 허용하지 않는다.
            if (this.hasFunctionFieldLabel(params[1])) {
                //이름은 처음에만 등장해야한다.
                result.message = FIELD_MULTI;
                return result;
            } else if (this.hasFunctionBooleanField(params[1])) {
                result.message = HAS_BOOLEAN;
                result.type = 'warning';
                return result;
            }
        }
    }

    isNameIncludeSpace(name, type) {
        if (!/ /.test(name)) {
            return false;
        }

        if (type == 'variable') {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_VARIABLE_EMPTY_TEXT_ADD_CHANGE];
        } else if (type == 'list') {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_LIST_EMPTY_TEXT_ADD_CHANGE];
        } else if (type == 'function') {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_EMPTY_TEXT_ADD_CHANGE];
        }

        return false;
    }

    isNameIncludeNotValidChar() {
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        const validateList = (targets, errorSuffix) => {
            const result = {
                message: undefined,
                type: 'error',
            };

            for (let i = 0; i < targets.length; i++) {
                const errorMessage = this.checkName(targets[i].name_, errorSuffix);
                if (errorMessage) {
                    result.message = errorMessage;
                    return result;
                }
            }
        };

        return validateList(vc.variables_ || [], 'v') || validateList(vc.lists_ || [], 'l');
    }

    hasFunctionFieldLabel(fBlock) {
        if (!fBlock || !fBlock.data) {
            return;
        }
        if (fBlock.data.type == 'function_field_label') {
            return true;
        }

        const params = fBlock.data.params;
        if (params[0]) {
            var type = params[0].data.type;
            if (type == 'function_field_label') {
                return true;
            }
            if (params[0].data.params) {
                if (this.hasFunctionFieldLabel(params[0])) {
                    return true;
                }
            }
        }

        if (params[1]) {
            var type = params[1].data.type;
            if (type == 'function_field_label') {
                return true;
            }
            if (params[1].data.params) {
                if (this.hasFunctionFieldLabel(params[1])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 함수 인자에 판단형 파라미터가 존재하는지 찾는다.
     * 이 함수는 재귀로 동작한다.
     * @param fBlock 함수명이 포함되지 않은 functionBlock 목록
     * @returns {Boolean} 판단형 파라미터가 존재하는 경우 true, 존재하지 않는 경우 false
     */
    hasFunctionBooleanField(fBlock) {
        if (!fBlock || !fBlock.data) {
            return false;
        }
        const { data } = fBlock;
        return (
            data.type === 'function_field_boolean' || this.hasFunctionBooleanField(data.params[1])
        );
    }

    checkName(name, target) {
        const keywords = [
            'and',
            'assert',
            'break',
            'class',
            'continue',
            'def',
            'del',
            'elif',
            'else',
            'except',
            'exec',
            'finally',
            'for',
            'from',
            'global',
            'if',
            'import',
            'in',
            'is',
            'lambda',
            'not',
            'or',
            'pass',
            'print',
            'raise',
            'return',
            'try',
            'while',
            'with',
            'yield',
        ];
        //숫자 검사
        let regExp = /^[0-9]$/g;

        if (regExp.test(name[0])) {
            return Lang.Menus[`textcoding_numberError_${target}`];
        }

        //특수문자 검사
        regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
        if (regExp.test(name)) {
            return Lang.Menus[`textcoding_specialCharError_${target}`];
        }

        //예약어 검사
        if (keywords.includes(name)) {
            return (
                Lang.Menus[`textcoding_bookedError_1${target}`] +
                name +
                Lang.Menus[`textcoding_bookedError_2${target}`]
            );
        }

        return false;
    }

    generateVariablesDeclaration() {
        let result = '';
        const currentObject = Entry.playground.object;
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }
        //inspect variables
        const targets = vc.variables_ || [];

        for (let i = targets.length - 1; i >= 0; i--) {
            const v = targets[i];
            let name = v.name_;
            let value = v.value_;

            if (v.object_) {
                if (v.object_ == currentObject.id) {
                    name = `self.${name}`;
                } else {
                    continue;
                }
            }

            if (typeof value === 'string') {
                value = '"()"'.replace('()', value);
            }

            result += `${name} = ${value}\n`;
        }

        return result;
    }

    generateListsDeclaration() {
        let result = '';
        const currentObject = Entry.playground.object;
        const vc = Entry.variableContainer;
        if (!vc) {
            return;
        }

        //inspect lists
        const targets = vc.lists_ || [];

        for (let i = targets.length - 1; i >= 0; i--) {
            const l = targets[i];
            let name = l.name_;
            let value = '';
            const lArray = l.array_;
            if (l.object_) {
                if (l.object_ == currentObject.id) {
                    name = `self.${name}`;
                } else {
                    continue;
                }
            }

            for (const va in lArray) {
                const vItem = lArray[va];
                let data = vItem.data;

                if (isNaN(data) || (data.length > 1 && String(data)[0] === '0')) {
                    data = `"${data.replace(/"/gi, '\\"')}"`;
                }

                if (typeof data === 'number' || data.trim().length > 0) {
                    value += data;
                }

                if (va != lArray.length - 1) {
                    value += ', ';
                }
            }

            result += `${name} = [${value}]` + `\n`;
        }

        return result;
    }
    generateForStmtIndex(index, str) {
        str = str || '';
        const ref = ['i', 'j', 'k'];
        const quotient = Math.floor(index / 3);
        const remainder = index % 3;

        str = ref[remainder] + str;

        if (quotient) {
            return this.generateForStmtIndex(quotient - 1, str);
        } else {
            return str;
        }
    }
}

Entry.TextCodingUtil = {};
Entry.TextCodingUtil = new TextCodingUtil();
