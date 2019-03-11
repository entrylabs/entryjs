/*
 *
 */
'use strict';

Entry.TextCodingUtil = {};

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
        const queue = new Entry.Queue();
        this._funcParamQ = queue;

        const fNameQueue = new Entry.Queue();
        this._funcNameQ = fNameQueue;
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
        value = String(Math.abs(value));
        if (value.match(/^-?\d+$|^-\d+$/) || value.match(/^-?\d+\.\d+$/)) {
            return true;
        }

        return false;
    }

    isBinaryOperator(value) {
        return (
            value == '==' ||
            value == '>' ||
            value == '<' ||
            value == '>=' ||
            value == '<=' ||
            value == '+' ||
            value == '-' ||
            value == '*' ||
            value == '/'
        );
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

    dropdownDynamicNameToIdConvertor(name, menuName, currentObject) {
        const result = name;
        const currentScene = Entry.scene.selectedScene;

        if (menuName == 'scenes') {
            const scenes = Entry.scene.getScenes();
            for (const s in scenes) {
                const scene = scenes[s];
                if (name == scene.name) {
                    return scene.id;
                }
            }
        } else if (
            menuName == 'spritesWithMouse' ||
            menuName == 'spritesWithSelf' ||
            menuName == 'collision' ||
            menuName == 'clone'
        ) {
            const objects = Entry.container.getAllObjects();
            for (const o in objects) {
                const object = objects[o];
                if (object.scene.id == currentScene.id) {
                    if (name == object.name) {
                        return object.id;
                    }
                }
            }
        } else if (menuName == 'variables') {
            const entryVariables = Entry.variableContainer.variables_;
            for (var e in entryVariables) {
                const entryVariable = entryVariables[e];
                if (entryVariable.name_ == name) {
                    if (currentObject) {
                        if (currentObject.id == entryVariable.object_) {
                            return entryVariable.id_;
                        }
                    } else {
                        return entryVariable.id_;
                    }
                }
            }
        } else if (menuName == 'lists') {
            const entryLists = Entry.variableContainer.lists_;
            for (var e in entryLists) {
                const entryList = entryLists[e];
                if (entryList.name_ == name) {
                    if (currentObject) {
                        if (currentObject.id == entryList.object_) {
                            return entryList.id_;
                        }
                    } else {
                        return entryList.id_;
                    }
                }
            }
        } else if (menuName == 'messages') {
            const entryMessages = Entry.variableContainer.messages_;
            for (var e in entryMessages) {
                const entryMessage = entryMessages[e];
                if (entryMessage.name == name) {
                    return entryMessage.id;
                }
            }
        } else if (menuName == 'pictures') {
            currentObject = Entry.playground.object;
            const pictures = currentObject.pictures;
            for (var p in pictures) {
                const picture = pictures[p];
                if (picture.name == name) {
                    return picture.id;
                }
            }
        } else if (menuName == 'sounds') {
            currentObject = Entry.playground.object;
            const sounds = currentObject.sounds;
            for (var p in sounds) {
                const sound = sounds[p];
                if (sound.name == name) {
                    return sound.id;
                }
            }
        }

        return result;
    }

    dropdownDynamicIdToNameConvertor(id, menuName) {
        //var found = false;
        let result;

        switch (menuName) {
            case 'variables':
                var entryVariables = Entry.variableContainer.variables_;
                for (var e in entryVariables) {
                    const entryVariable = entryVariables[e];
                    if (entryVariable.id_ == id) {
                        if (entryVariable.object_) {
                            result = `self.${entryVariable.name_}`;
                        } else {
                            result = entryVariable.name_;
                        }
                        break;
                    }
                }
                break;
            case 'lists':
                var entryLists = Entry.variableContainer.lists_;
                for (var e in entryLists) {
                    var entryList = entryLists[e];
                    if (entryList.id_ == id) {
                        if (entryList.object_) {
                            result = `self.${entryList.name_}`;
                        } else {
                            result = entryList.name_;
                        }
                        break;
                    }
                }
                break;
            case 'messages':
                var entryMessages = Entry.variableContainer.messages_;
                for (var e in entryMessages) {
                    var entryList = entryMessages[e];
                    if (entryList.id == id) {
                        result = entryList.name;
                        break;
                    }
                }
                break;
            case 'pictures':
                var objects = Entry.container.getAllObjects();
                for (var o in objects) {
                    var object = objects[o];
                    const pictures = object.pictures;
                    for (var p in pictures) {
                        const picture = pictures[p];
                        if (picture.id == id) {
                            result = picture.name;
                            return result;
                        }
                    }
                }
                break;
            case 'sounds':
                var objects = Entry.container.getAllObjects();
                for (var o in objects) {
                    var object = objects[o];
                    const sounds = object.sounds;
                    for (var p in sounds) {
                        const sound = sounds[p];
                        if (sound.id == id) {
                            result = sound.name;
                            return result;
                        }
                    }
                }
                break;
            case 'scenes':
                var scenes = Entry.scene.getScenes();
                for (const s in scenes) {
                    const scene = scenes[s];
                    if (scene.id == id) {
                        result = scene.name;
                        break;
                    }
                }
                break;
            case 'clone':
            case 'textBoxWithSelf':
                if (id == 'self') {
                    result = id;
                } else {
                    var objects = Entry.container.objects_.filter((obj) => obj.id === id);

                    result = objects[0] ? objects[0].name : null;
                }
                break;
        }

        return result;
    }

    getDynamicIdByNumber(value, textParam) {
        let result = value;
        if (Entry.getMainWS() && Entry.getMainWS().vimBoard) {
            var VIM = Entry.getMainWS().vimBoard;
        } else {
            return result;
        }

        const currentObject = VIM._currentObject;

        if (typeof value == 'number') {
            result = 'None';
            if (textParam.menuName == 'pictures') {
                if (value > 0) {
                    var objects = Entry.container.getAllObjects();
                    for (var o in objects) {
                        var object = objects[o];
                        if (object.id == currentObject.id) {
                            const pictures = object.pictures;
                            const picture = pictures[value - 1];
                            if (picture) {
                                result = picture.name;
                                break;
                            }
                        }
                    }
                }
            } else if (textParam.menuName == 'sounds') {
                if (value > 0) {
                    var objects = Entry.container.getAllObjects();
                    for (var o in objects) {
                        var object = objects[o];
                        if (object.id == currentObject.id) {
                            const sounds = object.sounds;
                            const sound = sounds[value - 1];
                            if (sound) {
                                result = sound.name;
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            result = Entry.TextCodingUtil.dropdownDynamicNameToIdConvertor(
                value,
                textParam.menuName
            );
        }

        return result;

        function isNumeric(value) {
            return /^\d+$/.test(value);
        }
    }

    isLocalType(id, menuName) {
        const result = id;

        if (menuName == 'variables') {
            const entryVariables = Entry.variableContainer.variables_;
            for (var e in entryVariables) {
                const entryVariable = entryVariables[e];
                if (entryVariable.id_ == id) {
                    if (entryVariable.object_) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } else if (menuName == 'lists') {
            const entryLists = Entry.variableContainer.lists_;
            for (var e in entryLists) {
                const entryList = entryLists[e];
                if (entryList.id_ == id) {
                    if (entryList.object_) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }

        return false;
    }

    binaryOperatorValueConvertor(operator) {
        let result;
        switch (operator) {
            case '"EQUAL"': {
                result = '==';
                break;
            }
            case '"GREATER"': {
                result = '>';
                break;
            }
            case '"LESS"': {
                result = '<';
                break;
            }
            case '"GREATER_OR_EQUAL"': {
                result = '>=';
                break;
            }
            case '"LESS_OR_EQUAL"': {
                result = '<=';
                break;
            }
            case '"그리고"': {
                result = '&&';
                break;
            }
            case '"또는"': {
                result = '||';
                break;
            }
            case '"PLUS"': {
                result = '+';
                break;
            }
            case '"MINUS"': {
                result = '-';
                break;
            }
            case '"MULTI"': {
                result = '*';
                break;
            }
            case '"DIVIDE"': {
                result = '/';
                break;
            }
            default: {
                result = operator;
            }
        }

        return result;
    }

    variableListFilter(block, index, param) {
        if (param == 'None') {
            return (result = param);
        }

        var result = param;
        const type = block.data.type;
        if (type == 'change_variable' || type == 'set_variable' || type == 'get_variable') {
            if (index == 1) {
                result = eval(param);
            }
        } else if (type == 'length_of_list' || type == 'is_included_in_list') {
            if (index == 2) {
                result = eval(param);
            }
        } else if (type == 'value_of_index_from_list') {
            if (index == 2) {
                result = eval(param);
            } else if (index == 4) {
                if (this.isNumeric(param)) {
                    result = param - 1;
                }
            }
        } else if (type == 'remove_value_from_list') {
            if (index == 2) {
                result = eval(param);
            } else if (index == 1) {
                if (this.isNumeric(param)) {
                    result = param - 1;
                }
            }
        } else if (type == 'insert_value_to_list') {
            if (index == 2) {
                result = eval(param);
            } else if (index == 3) {
                if (this.isNumeric(param)) {
                    result = param - 1;
                }
            }
        } else if (type == 'change_value_list_index') {
            if (index == 1) {
                result = eval(param);
            } else if (index == 2) {
                if (this.isNumeric(param)) {
                    result = param - 1;
                }
            }
        } else if (type == 'add_value_to_list') {
            if (index == 2) {
                result = eval(param);
            }
        }

        return result;
    }

    /*variableListSpaceMessage() {
        var error = {};
        error.title = "파이썬변환(Converting) 오류";
        error.message = "공백(띄어쓰기)이 포함된 변수 또는 리스트는 변환할 수 없습니다.";
        error.line = this._blockCount;
        throw error;
    };*/

    isGlobalVariableExisted(name) {
        const entryVariables = Entry.variableContainer.variables_;
        for (const i in entryVariables) {
            const entryVariable = entryVariables[i];
            if (entryVariable.object_ === null && entryVariable.name_ == name) {
                return true;
            }
        }

        return false;
    }

    updateGlobalVariable(name, value) {
        const variables = Entry.variableContainer.variables_;
        for (const i in variables) {
            const variable = variables[i];
            if (variable.object_ === null && variable.name_ == name) {
                const model = variable.toJSON();
                model.name = name;
                model.value = value;
                variable.syncModel_(model);
                Entry.variableContainer.updateList();

                break;
            }
        }
    }

    createGlobalVariable(name, value) {
        if (this.isGlobalVariableExisted(name)) {
            return;
        }

        const variable = {
            name,
            value,
            variableType: 'variable',
        };

        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    }

    isLocalVariableExisted(name, object) {
        const entryVariables = Entry.variableContainer.variables_;
        for (const i in entryVariables) {
            const entryVariable = entryVariables[i];
            if (entryVariable.object_ === object.id && entryVariable.name_ == name) {
                return true;
            }
        }

        return false;
    }

    updateLocalVariable(name, value, object) {
        const entryVariables = Entry.variableContainer.variables_;
        for (const i in entryVariables) {
            const entryVariable = entryVariables[i];
            if (entryVariable.object_ === object.id && entryVariable.name_ == name) {
                const model = entryVariable.toJSON();
                model.name = name;
                model.value = value;
                entryVariable.syncModel_(model);
                Entry.variableContainer.updateList();

                break;
            }
        }
    }

    createLocalVariable(name, value, object) {
        if (this.isLocalVariableExisted(name, object)) {
            return;
        }

        const variable = {
            name,
            value,
            object: object.id,
            variableType: 'variable',
        };

        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    }

    isLocalVariable(variableId) {
        const object = Entry.playground.object;
        const entryVariables = Entry.variableContainer.variables_;
        for (const e in entryVariables) {
            const entryVariable = entryVariables[e];
            if (entryVariable.object_ == object.id && entryVariable.id_ == variableId) {
                return true;
            }
        }

        return false;
    }

    isGlobalListExisted(name) {
        const entryLists = Entry.variableContainer.lists_;
        for (const i in entryLists) {
            const entryList = entryLists[i];
            if (entryList.object_ === null && entryList.name_ == name) {
                return true;
            }
        }

        return false;
    }

    updateGlobalList(name, array) {
        const entryLists = Entry.variableContainer.lists_;
        for (const i in entryLists) {
            const entryList = entryLists[i];
            if (entryList.object_ === null && entryList.name_ == name) {
                const list = {
                    x: entryList.x_,
                    y: entryList.y_,
                    id: entryList.id_,
                    visible: entryList.visible_,
                    name,
                    isCloud: entryList.isCloud_,
                    width: entryList.width_,
                    height: entryList.height_,
                    array,
                };

                entryList.syncModel_(list);
                entryList.updateView();
                Entry.variableContainer.updateList();

                break;
            }
        }
    }

    createGlobalList(name, array) {
        if (this.isGlobalListExisted(name)) {
            return;
        }

        const list = {
            name,
            array,
            variableType: 'list',
        };

        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    }

    isLocalListExisted(name, object) {
        if (!object) {
            return false;
        }
        const entryLists = Entry.variableContainer.lists_;
        for (const i in entryLists) {
            const entryList = entryLists[i];
            if (entryList.object_ === object.id && entryList.name_ == name) {
                return true;
            }
        }

        return false;
    }

    updateLocalList(name, array, object) {
        const entryLists = Entry.variableContainer.lists_;
        for (const i in entryLists) {
            const entryList = entryLists[i];
            if (entryList.object_ === object.id && entryList.name_ == name) {
                const list = {
                    x: entryList.x_,
                    y: entryList.y_,
                    id: entryList.id_,
                    visible: entryList.visible_,
                    name,
                    isCloud: entryList.isCloud_,
                    width: entryList.width_,
                    height: entryList.height_,
                    array,
                };

                entryList.syncModel_(list);
                entryList.updateView();
                Entry.variableContainer.updateList();

                break;
            }
        }
    }

    createLocalList(name, array, object) {
        if (this.isLocalListExisted(name, object)) {
            return;
        }

        const list = {
            name,
            array,
            object: object.id,
            variableType: 'list',
        };

        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    }

    isLocalList(listId) {
        const object = Entry.playground.object;
        const entryLists = Entry.variableContainer.lists_;
        for (const e in entryLists) {
            const entryList = entryLists[e];
            if (entryList.object_ == object.id && entryList.id_ == listId) {
                return true;
            }
        }

        return false;
    }

    createMessage(name) {
        const messages = Entry.variableContainer.messages_;
        const exist = Entry.isExist(name, 'name', messages);
        if (exist) {
            return;
        }
        const message = {
            name,
        };

        Entry.variableContainer.addMessage(message);
        Entry.variableContainer.updateList();
    }

    /*isLocalType(block, id) {
        if(block.data.type == "get_variable" ||
            block.data.type == "set_variable" ||
            block.data.type == "change_variable" ) {

            if(this.isLocalVariable(id))
                return true;

        } else if(block.data.type == "value_of_index_from_list" ||
            block.data.type == "add_value_to_list" ||
            block.data.type == "remove_value_from_list" ||
            block.data.type == "insert_value_to_list" ||
            block.data.type == "change_value_list_index" ||
            block.data.type == "length_of_list" ||
            block.data.type == "is_included_in_list") {

            if(this.isLocalList(id))
                return true;
        }
    };*/

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

    isEntryEventBlockWithParam(block) {
        const blockType = block.data.type;
        return blockType == 'when_some_key_pressed' || blockType == 'when_message_cast';
    }

    isEventBlockByType(blockType) {
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

    makeDefinition(block) {
        const blockType = block.data.type;
        const syntax = Entry.block[blockType].syntax.py[0];

        const paramReg = /(%.)/im;
        const tokens = syntax.split(paramReg);

        let result = '';
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (paramReg.test(token)) {
                result += 'event';
            } else {
                result += token;
            }
        }

        return result;
    }

    entryEventFilter(text) {
        const startIndex = text.indexOf('(');
        const endIndex = text.indexOf(')');

        const stmt = text.substring(0, startIndex);
        let param = text.substring(startIndex + 1, endIndex);
        param = param.replace(/\"/g, '');

        if (param) {
            if (isNaN(param)) {
                param = param.replace(/ /g, '_space_');
            } else {
                param = `num${param}`;
            }

            if (param == 'None') {
                param = 'none';
            }
        }

        text = `${stmt}(${param}):\n`;

        return text;
    }

    entryEventFuncFilter(threads) {
        let result;
        let eventFound = false;
        const threadArr = threads.split('\n');

        for (const i in threadArr) {
            let thread = threadArr[i];
            const trimedThread = threadArr[i].trim();
            var colonIndex = trimedThread.indexOf(':');
            let preText = '';

            if (colonIndex > 0) {
                preText = trimedThread.substring(0, colonIndex + 1);
            }

            preText = preText.split('(');
            preText = preText[0];
            if (preText == 'def when_press_key' || preText == 'def when_get_signal') {
                thread = thread.replace(/def /, '');
                var colonIndex = thread.indexOf(':');
                let funcPart = '';
                let restPart = '';

                if (colonIndex > 0) {
                    funcPart = thread.substring(0, colonIndex);
                    restPart = thread.substring(colonIndex + 1, thread.length);
                }

                if (restPart) {
                    var newThread = funcPart.concat('\n').concat(restPart.trim());
                } else {
                    var newThread = funcPart;
                }

                threadArr[i] = newThread;
                eventFound = true;
            } else {
                if (eventFound) {
                    var newThread = threadArr[i];
                    newThread = newThread.replace(/\t/g, '    ');
                    newThread = newThread.replace(/    /, '');
                    threadArr[i] = newThread;
                }
            }
        }

        result = threadArr.join('\n');
        return result;
    }

    isEntryEventFunc(name) {
        return (
            name === 'def when_start' ||
            name === 'def when_press_key' ||
            name === 'def when_click_mouse_on' ||
            name === 'def when_click_mouse_off' ||
            name === 'def when_click_object_on' ||
            name === 'def when_click_object_off' ||
            name === 'def when_get_signal' ||
            name === 'def when_start_scene' ||
            name === 'def when_make_clone'
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

    eventBlockSyntaxFilter(name) {
        if (
            name == 'when_start' ||
            name == 'when_press_key' ||
            name == 'when_click_mouse_on' ||
            name == 'when_click_mouse_off' ||
            name == 'when_click_object_on' ||
            name == 'when_click_object_off' ||
            name == 'when_get_signal' ||
            name == 'when_start_scene' ||
            name == 'when_make_clone' ||
            name == 'entry_event_start' ||
            name == 'entry_event_key' ||
            name == 'entry_event_mouse_down' ||
            name == 'entry_event_mouse_up' ||
            name == 'entry_event_object_down' ||
            name == 'entry_event_object_up' ||
            name == 'entry_event_signal' ||
            name == 'entry_event_scene_start' ||
            name == 'entry_event_clone_create'
        ) {
            return `def ${name}`;
        }
        return undefined;
    }

    isEntryEventFuncName(name) {
        return (
            name == 'when_start' ||
            name == 'when_press_key' ||
            name == 'when_click_mouse_on' ||
            name == 'when_click_mouse_off' ||
            name == 'when_click_object_on' ||
            name == 'when_click_object_off' ||
            name == 'when_get_signal' ||
            name == 'when_start_scene' ||
            name == 'when_make_clone' ||
            name == 'entry_event_start' ||
            name == 'entry_event_key' ||
            name == 'entry_event_mouse_down' ||
            name == 'entry_event_mouse_up' ||
            name == 'entry_event_object_down' ||
            name == 'entry_event_object_up' ||
            name == 'entry_event_signal' ||
            name == 'entry_event_scene_start' ||
            name == 'entry_event_clone_create'
        );
    }

    isEntryEventFuncByType(type) {
        return (
            type == 'when_run_button_click' ||
            type == 'when_some_key_pressed' ||
            type == 'mouse_clicked' ||
            type == 'mouse_click_cancled' ||
            type == 'when_object_click' ||
            type == 'when_object_click_canceled' ||
            type == 'when_message_cast' ||
            type == 'when_scene_start' ||
            type == 'when_clone_start'
        );
    }

    isEntryEventFuncNameWithParam(name) {
        const lastIndex = name.lastIndexOf('_');

        if (lastIndex > 0) {
            const preText = name.substring(0, lastIndex);
            if (preText == 'when_press_key' || preText == 'when_get_signal') {
                return true;
            }
        }

        return false;
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

    isEntryEventFuncTypeWithParam(block) {
        return block.type == 'when_some_key_pressed' || block.type == 'when_message_cast';
    }

    isEntryEventDesignatedParamName(paramName) {
        return paramName == 'key' || paramName == 'signal';
    }

    gatherFuncDefParam(block) {
        if (block && block.data) {
            if (block.data.params[0]) {
                if (block.data.params[0].data) {
                    var param = block.data.params[0].data.type;
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
                var result = this.searchFuncDefParam(block.data.params[1]);

                if (result.data.params[0].data) {
                    var param = result.data.params[0].data.type;

                    if (
                        result.data.type == 'function_field_string' ||
                        result.data.type == 'function_field_boolean'
                    ) {
                        this._funcParamQ.enqueue(param);
                    }
                }

                if (result.data.params[1]) {
                    if (result.data.params[1].data.params[0].data) {
                        var param = result.data.params[1].data.params[0].data.type;

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

    getLastParam(funcBlock) {
        if (funcBlock && funcBlock.data && funcBlock.data.params[1]) {
            return this.getLastParam(funcBlock.data.params[1]);
        } else {
            return funcBlock;
        }
    }

    isFuncContentsMatch(
        blockFuncContents,
        textFuncStatements,
        paramMap,
        paramInfo,
        currentFuncKey
    ) {
        let matchFlag = true;

        if (textFuncStatements.length != blockFuncContents.length) {
            matchFlag = false;
            return matchFlag;
        }

        for (let i = 0; i < blockFuncContents.length; i++) {
            if (!matchFlag) {
                break;
            }
            matchFlag = false;
            const blockFuncContent = blockFuncContents[i];
            const textFuncStatement = textFuncStatements[i];

            if (blockFuncContent && !textFuncStatement) {
                matchFlag = false;
                return matchFlag;
            }

            if (!blockFuncContent && textFuncStatement) {
                matchFlag = false;
                return matchFlag;
            }

            if (blockFuncContent._schema && blockFuncContent._schema.template) {
                const template = blockFuncContent._schema.template;
                const blockFuncName = template.trim().split(' ')[0];
                if (blockFuncName == textFuncStatement.funcName) {
                    var reculsive = true;
                } else {
                    var reculsive = false;
                }
            }

            if (textFuncStatement.type == blockFuncContent.data.type || reculsive) {
                matchFlag = true;
                if (currentFuncKey != textFuncStatement.type) {
                    matchFlag = false;
                }

                let textFuncStatementParams = textFuncStatement.params;
                let blockFuncContentParams = blockFuncContent.data.params;
                var cleansingParams = [];
                if (textFuncStatementParams == undefined || textFuncStatementParams == null) {
                    textFuncStatementParams = [];
                }
                if (blockFuncContentParams == undefined || blockFuncContentParams == null) {
                    blockFuncContentParams = [];
                }

                blockFuncContentParams.map((blockFuncContentParam, index) => {
                    if (blockFuncContentParam) {
                        cleansingParams.push(blockFuncContentParam);
                    }
                });
                blockFuncContentParams = cleansingParams;

                cleansingParams = [];
                textFuncStatementParams.map((textFuncStatementParam, index) => {
                    if (textFuncStatementParam) {
                        cleansingParams.push(textFuncStatementParam);
                    }
                });
                textFuncStatementParams = cleansingParams;

                if (textFuncStatementParams.length == blockFuncContentParams.length) {
                    //Statement Param Length Comparison
                    matchFlag = true;
                    for (let j = 0; j < textFuncStatementParams.length; j++) {
                        if (!matchFlag) {
                            break;
                        }
                        matchFlag = false;

                        if (typeof textFuncStatementParams[j] !== 'object') {
                            if (textFuncStatementParams[j] == blockFuncContentParams[j]) {
                                matchFlag = true;
                            } else {
                                matchFlag = false;
                            }
                        } else if (textFuncStatementParams[j].name) {
                            const paramKey = textFuncStatementParams[j].name;
                            const paramBlockType = paramInfo[paramKey];

                            if (paramBlockType) {
                                if (blockFuncContentParams[j].data.type == paramBlockType) {
                                    matchFlag = true;
                                }
                            } else {
                                if (
                                    textFuncStatementParams[j].params &&
                                    blockFuncContentParams[j].data.params &&
                                    textFuncStatementParams[j].params[0] ==
                                        blockFuncContentParams[j].data.params[0]
                                ) {
                                    matchFlag = true;
                                }
                            }
                        } else if (
                            textFuncStatementParams[j].type == 'True' ||
                            textFuncStatementParams[j].type == 'False'
                        ) {
                            if (blockFuncContentParams[j].data) {
                                if (
                                    textFuncStatementParams[j].type ==
                                    blockFuncContentParams[j].data.type
                                ) {
                                    matchFlag = true;
                                }
                            } else if (
                                textFuncStatementParams[j].type == blockFuncContentParams[j].type
                            ) {
                                matchFlag = true;
                            }
                        } else if (
                            textFuncStatementParams[j].type &&
                            textFuncStatementParams[j].params
                        ) {
                            matchFlag = this.isFuncContentsParamsMatch(
                                blockFuncContentParams[j],
                                textFuncStatementParams[j],
                                paramMap,
                                paramInfo
                            );
                        }
                    }

                    if (
                        matchFlag &&
                        textFuncStatement.statements &&
                        textFuncStatement.statements.length != 0
                    ) {
                        for (const kkk in textFuncStatement.statements) {
                            matchFlag = this.isFuncContentsMatch(
                                blockFuncContent.data.statements[kkk]._data,
                                textFuncStatement.statements[kkk],
                                paramMap,
                                paramInfo
                            );
                        }
                    }
                } else {
                    matchFlag = false;
                    break;
                }
            } else {
                matchFlag = false;
                break;
            }
        }

        return matchFlag;
    }

    isFuncContentsParamsMatch(blockFuncContentParam, textFuncStatementParam, paramMap, paramInfo) {
        let matchFlag = false;

        let tfspType = textFuncStatementParam.type;
        let bfcpType = blockFuncContentParam.data.type;

        if (tfspType == 'text') {
            tfspType = 'literal';
        } else if (tfspType == 'number') {
            tfspType = 'literal';
        } else {
            if (textFuncStatementParam.isParamFromFunc) {
                tfspType = paramInfo[tfspType];
            }
        }

        if (bfcpType == 'text') {
            bfcpType = 'literal';
        } else if (bfcpType == 'number') {
            bfcpType = 'literal';
        }

        if (tfspType == bfcpType) {
            const textSubParams = textFuncStatementParam.params;
            const blockSubParams = blockFuncContentParam.data.params;

            if (!textSubParams && !blockSubParams) {
                matchFlag = true;
            } else if (textSubParams.length == blockSubParams.length) {
                matchFlag = true;
                for (const t in textSubParams) {
                    if (!matchFlag) {
                        break;
                    }
                    matchFlag = false;
                    const textSubParam = textSubParams[t];
                    const blockSubParam = blockSubParams[t];
                    if (!textSubParam && !blockSubParam) {
                        matchFlag = true;
                    } else if (typeof textSubParam !== 'object') {
                        if (textSubParam == blockSubParam) {
                            matchFlag = true;
                        }
                    } else if (textSubParam.name) {
                        const paramKey = textSubParam.name;
                        const paramBlockType = paramInfo[paramKey];
                        if (paramBlockType) {
                            if (blockSubParam.data.type == paramBlockType) {
                                matchFlag = true;
                            }
                        } else {
                            if (textSubParam.params[0] == blockSubParam.data.params[0]) {
                                matchFlag = true;
                            }
                        }
                    } else if (textSubParam.type == 'True' || textSubParam.type == 'False') {
                        if (blockSubParam.data) {
                            if (textSubParam.type == blockSubParam.data.type) {
                                matchFlag = true;
                            }
                        } else if (textSubParam.type == blockSubParam.type) {
                            matchFlag = true;
                        }
                    } else if (textSubParam.type && textSubParam.params) {
                        matchFlag = this.isFuncContentsParamsMatch(
                            blockSubParam,
                            textSubParam,
                            paramMap,
                            paramInfo
                        );
                    }
                }
            } else {
                matchFlag = false;
            }
        } else {
            matchFlag = false;
        }

        return matchFlag;
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

    makeFuncParamBlock(targetBlock, paramInfo, blockCount) {
        const tParams = targetBlock.params;

        for (const i in tParams) {
            const param = tParams[i];
            if (!param) {
                continue;
            }

            if (typeof param != 'object') {
                continue;
            }

            if (param.type && param.params && param.params.length != 0) {
                this.makeFuncParamBlock(param, paramInfo, blockCount);
            } else if (param.type && param.params && param.params.length == 0) {
                var paramKey = param.type;
                var paramBlockType = paramInfo[paramKey];
                if (paramBlockType) {
                    var paramBlock = {};
                    paramBlock.type = paramBlockType;
                    paramBlock.params = [];
                    targetBlock.params[i] = paramBlock;
                }
            } else if (param.name) {
                var paramKey = param.name;
                var paramBlockType = paramInfo[paramKey];
                if (paramBlockType) {
                    var paramBlock = {};
                    paramBlock.type = paramBlockType;
                    paramBlock.params = [];
                    targetBlock.params[i] = paramBlock;
                } else if (param.type != 'get_variable') {
                    var keyword = param.name;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                        keyword,
                        blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_VARIABLE
                    );
                }
            } else if (param.object && param.property) {
                //self.xx
                var keyword = `${param.object.name}.${param.property.name}`;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                    keyword,
                    blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_VARIABLE
                );
            }
        }

        const stmts = targetBlock.statements;

        if (stmts && stmts[0] && stmts[0].length != 0) {
            const statements0 = stmts[0];
            for (const s0 in statements0) {
                const statement0 = statements0[s0];
                this.makeFuncParamBlock(statement0, paramInfo, blockCount);
            }
        }

        if (stmts && stmts[1] && stmts[1].length != 0) {
            const statements1 = stmts[1];
            for (const s1 in statements1) {
                const statement1 = statements1[s1];
                this.makeFuncParamBlock(statement1, paramInfo, blockCount);
            }
        }
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

    isJudgementBlock(blockType) {
        return (
            blockType == 'is_clicked' ||
            blockType == 'is_press_some_key' ||
            blockType == 'reach_something' ||
            blockType == 'boolean_basic_operator' ||
            blockType == 'boolean_and' ||
            blockType == 'boolean_or' ||
            blockType == 'boolean_not'
        );
    }

    isCalculationBlock(blockType) {
        return (
            blockType == 'calc_basic' ||
            blockType == 'calc_rand' ||
            blockType == 'coordinate_mouse' ||
            blockType == 'coordinate_object' ||
            blockType == 'get_sound_volume' ||
            blockType == 'quotient_and_mod' ||
            blockType == 'calc_operation' ||
            blockType == 'get_project_timer_value' ||
            blockType == 'get_date' ||
            blockType == 'distance_something' ||
            blockType == 'get_sound_duration' ||
            blockType == 'length_of_string' ||
            blockType == 'combine_something' ||
            blockType == 'char_at' ||
            blockType == 'substring' ||
            blockType == 'index_of_string' ||
            blockType == 'replace_string' ||
            blockType == 'change_string_case'
        );
    }

    isVariableDeclarationBlock(blockType) {
        return blockType == 'set_variable';
    }

    isHWParamBlock(blockType) {
        return (
            blockType == 'hamster_hand_found' ||
            blockType == 'hamster_value' ||
            blockType == 'arduino_get_port_number' ||
            blockType == 'arduino_get_number_sensor_value' ||
            blockType == 'arduino_get_digital_value' ||
            blockType == 'arduino_convert_scale' ||
            blockType == 'arduino_ext_get_analog_value' ||
            blockType == 'arduino_ext_get_analog_value_map' ||
            blockType == 'arduino_ext_get_ultrasonic_value' ||
            blockType == 'arduino_ext_get_digital' ||
            blockType == 'arduino_ext_tone_list' ||
            blockType == 'arduino_ext_octave_list'
        );
    }

    isMaterialBlock(blockType) {
        return (
            blockType == 'get_canvas_input_value' ||
            blockType == 'get_variable' ||
            blockType == 'value_of_index_from_list' ||
            blockType == 'length_of_list' ||
            blockType == 'is_included_in_list'
        );
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

    makeExpressionStatementForEntryEvent(calleeName, arg) {
        const expressionStatement = {};

        const type = 'ExpressionStatement';
        const expression = {};

        expression.type = 'CallExpression';

        const callee = {};
        callee.name = calleeName;
        callee.type = 'Identifier';
        expression.callee = callee;

        const args = [];
        const argument = {};
        argument.type = 'Literal';
        argument.value = arg;
        args.push(argument);
        expression.arguments = args;

        expressionStatement.expression = expression;
        expressionStatement.type = type;

        return expressionStatement;
    }

    setMathParams(propertyName, params) {
        let optionParam;

        if (propertyName == 'pow') {
            optionParam = 'square';
            params[3] = optionParam;
        } else if (propertyName == 'sqrt') {
            optionParam = 'root';
            params[3] = optionParam;
        } else if (propertyName == 'sin') {
            optionParam = 'sin';
            params[3] = optionParam;
        } else if (propertyName == 'cos') {
            optionParam = 'cos';
            params[3] = optionParam;
        } else if (propertyName == 'tan') {
            optionParam = 'tan';
            params[3] = optionParam;
        } else if (propertyName == 'asin') {
            optionParam = 'asin_radian';
            params[3] = optionParam;
        } else if (propertyName == 'acos') {
            optionParam = 'acos_radian';
            params[3] = optionParam;
        } else if (propertyName == 'atan') {
            optionParam = 'atan_radian';
            params[3] = optionParam;
        } else if (propertyName == 'log') {
            optionParam = 'ln';
            params[3] = optionParam;
        } else if (propertyName == 'log10') {
            optionParam = 'log';
            params[3] = optionParam;
        } else if (propertyName == 'floor') {
            optionParam = 'floor';
            params[3] = optionParam;
        } else if (propertyName == 'ceil') {
            optionParam = 'ceil';
            params[3] = optionParam;
        } else if (propertyName == 'round') {
            optionParam = 'round';
            params[3] = optionParam;
        } else if (propertyName == 'factorial') {
            optionParam = 'factorial';
            params[3] = optionParam;
        } else if (propertyName == 'fabs') {
            optionParam = 'abs';
            params[3] = optionParam;
        }

        return optionParam;
    }

    isMathExpression(text) {
        const textTokens = text.split('(');
        const textName = textTokens[0];
        return textName == 'Entry.math_operation';
    }

    makeMathExpression(text) {
        let result = text;
        const textTokens = text.split('(');
        const paramsParts = textTokens[1];
        const paramsTokens = paramsParts.split(',');
        const mathValue = paramsTokens[0];
        let mathOption = paramsTokens[1];
        let mathProperty;

        mathOption = mathOption.substring(2, mathOption.length - 2).trim();

        if (mathOption == 'square') {
            mathProperty = 'pow';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'root') {
            mathProperty = 'sqrt';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'sin') {
            mathProperty = 'sin';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'cos') {
            mathProperty = 'cos';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'tan') {
            mathProperty = 'tan';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'asin_radian') {
            mathProperty = 'asin';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'acos_radian') {
            mathProperty = 'acos';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'atan_radian') {
            mathProperty = 'atan';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'ln') {
            mathProperty = 'log';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'log') {
            mathProperty = 'log10';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'floor') {
            mathProperty = 'floor';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'ceil') {
            mathProperty = 'ceil';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'round') {
            mathProperty = 'round';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'factorial') {
            mathProperty = 'factorial';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        } else if (mathOption == 'abs') {
            mathProperty = 'fabs';
            var mathText = `${'math' + '.'}${mathProperty}`;
            result = `${mathText}(${mathValue})`;
        }

        return result;
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

    isVariableNumber(id, type) {
        const currentObject = Entry.playground.object;
        const entryVariables = Entry.variableContainer.variables_;
        for (const i in entryVariables) {
            const entryVariable = entryVariables[i];
            if (type == 'global') {
                if (entryVariable.object_ === null && entryVariable.id_ == id) {
                    if (Entry.Utils.isNumber(entryVariable.value_)) {
                        return true;
                    }
                }
            } else if (type == 'local') {
                if (entryVariable.object_ === currentObject.id && entryVariable.id_ == id) {
                    if (Entry.Utils.isNumber(entryVariable.value_)) {
                        return true;
                    }
                }
            }
        }

        return false;
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

    isExpressionLiteral(component, syntax) {
        switch (component.type) {
            case 'CallExpression':
                if (component.callee.type === 'MemberExpression') {
                    let calleeName = component.callee.property.name;
                    calleeName = syntax['%2'][calleeName];
                    if (calleeName) {
                        const key = calleeName.key;
                        return Entry.block[key].skeleton === 'basic_string_field';
                    }
                }
                break;
            case 'Literal':
                return true;
        }
        return false;
    }

    isNameInEntryData(name, object) {
        return (
            this.isGlobalVariableExisted(name) ||
            this.isLocalVariableExisted(name, object) ||
            this.isGlobalListExisted(name) ||
            this.isLocalListExisted(name)
        );
    }
}

Entry.TextCodingUtil = new TextCodingUtil();
