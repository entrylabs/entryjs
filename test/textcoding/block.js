describe('EntryPython', function(){
    var allCategories = EntryStatic.getAllBlocks();

    Entry.init(null, {type: "none"});

    function pairConvertTest(blockType) {
        it (blockType, function(){
            var parser = new Entry.Parser(Entry.Vim.WORKSPACE_MODE);
            var syntax = parser.mappingSyntax(Entry.Vim.WORKSPACE_MODE);
            var blockToPyParser = new Entry.BlockToPyParser(syntax);
            var pyToBlockParser = new Entry.PyToBlockParser(syntax);
            blockToPyParser._parseMode = Entry.Parser.PARSE_GENERAL;
            var options = { locations: true, ranges: true };
            var code = {
                registerEvent: function() {},
                registerBlock: function() {}
            };

            var blockSchema = Entry.block[blockType];
            var pythonOutput = blockToPyParser.Thread(new Entry.Thread([blockSchema.def], code));
            var blockOutput = pyToBlockParser.processProgram([filbert.parse(pythonOutput, options)]);
            var secondPythonOutput = blockToPyParser.Thread(new Entry.Thread(blockOutput[0], code));
            console.log(
                pythonOutput,
                secondPythonOutput,
                blockOutput
            );
            assert.equal(pythonOutput, secondPythonOutput);
        });
    }

    describe('should convert block', function(){
        for (var i = 0; i < allCategories.length; i++) {
            var blocks = allCategories[i].blocks;
            for (var j = 0; j < blocks.length; j++) {
                var blockType = blocks[j];
                var blockSchema = Entry.block[blockType];

                if (blockSchema &&
                    blockSchema.syntax &&
                    blockSchema.syntax.py &&
                    blockSchema.def) {
                    pairConvertTest(blockType);
                }
            }
        }
    });
});
