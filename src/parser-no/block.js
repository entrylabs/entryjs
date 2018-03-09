/*
 *
 */
'use strict';

Entry.BlockParser = function(syntax) {
    this.syntax = syntax;

    this._iterVariableCount = 0;
    this._iterVariableChunk = ['i', 'j', 'k'];
};

(function(p) {
    p.Code = function(code) {
        if (code instanceof Entry.Thread) return this.Thread(code);
        if (code instanceof Entry.Block) return this.Block(code);

        var textCode = '',
            threads = code.getThreads();

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            textCode += this.Thread(thread);
        }

        return textCode;
    };

    p.Thread = function(thread) {
        if (thread instanceof Entry.Block) return this.Block(thread);
        var code = '',
            blocks = thread.getBlocks();

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            code += this.Block(block);
        }
        return code;
    };

    p.Block = function(block) {
        var syntax = block._schema.syntax;
        if (!syntax) return '';
        var syntaxType = syntax[0];
        return this[syntaxType](block);
    };

    p.Program = function(block) {
        return '';
    };

    p.Scope = function(block) {
        var syntax = block._schema.syntax.concat();
        return syntax.splice(1, syntax.length - 1).join('.') + '();\n';
    };

    p.BasicFunction = function(block) {
        var statementCode = this.Thread(block.statements[0]);
        var code =
            'function promise() {\n' + this.indent(statementCode) + '}\n';
        return code;
    };

    p.BasicIteration = function(block) {
        var iterateNumber = block.params[0];
        var iterVariable = this.publishIterateVariable();
        var statementCode = this.Thread(block.statements[0]);
        this.unpublishIterateVariable();
        var code =
            'for (var ' +
            iterVariable +
            ' = 0; ' +
            iterVariable +
            ' < ' +
            iterateNumber +
            '; ' +
            iterVariable +
            '++){\n' +
            this.indent(statementCode) +
            '}\n';
        return code;
    };

    p.BasicIf = function(block) {
        var statementCode = this.Thread(block.statements[0]);
        var syntax = block._schema.syntax.concat();
        var code =
            'if (' + syntax[1] + ') {\n' + this.indent(statementCode) + '}\n';
        return code;
    };

    p.BasicWhile = function(block) {
        var statementCode = this.Thread(block.statements[0]);
        var syntax = block._schema.syntax.concat();
        var code =
            'while (' +
            syntax[1] +
            ') {\n' +
            this.indent(statementCode) +
            '}\n';
        return code;
    };

    p.indent = function(textCode) {
        var result = '    ';
        var indentedCode = textCode.split('\n');
        indentedCode.pop();
        result += indentedCode.join('\n    ') + '\n';
        return result;
    };

    // iterate variable
    p.publishIterateVariable = function() {
        var iterVariable = '';
        var iterVariableCount = this._iterVariableCount;
        do {
            var chunk = this._iterVariableChunk[iterVariableCount % 3];
            iterVariable = chunk + iterVariable;
            iterVariableCount = parseInt(iterVariableCount / 3) - 1;
            if (iterVariableCount === 0)
                iterVariable = this._iterVariableChunk[0] + iterVariable;
        } while (iterVariableCount > 0);
        this._iterVariableCount++;
        return iterVariable;
    };

    p.unpublishIterateVariable = function() {
        if (this._iterVariableCount) this._iterVariableCount--;
    };
})(Entry.BlockParser.prototype);
