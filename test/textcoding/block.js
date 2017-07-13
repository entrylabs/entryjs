describe('EntryPython', function(){
    var allCategories = EntryStatic.getAllBlocks();

    Entry.init(null, {type: "invisible"});

    Entry.loadProject(Entry.getStartProject());
    //Entry.variableContainer.addVariable({"name": "testVar"})

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

            blockToPyParser = new Entry.BlockToPyParser(syntax);
            blockToPyParser._parseMode = Entry.Parser.PARSE_GENERAL;

            var secondPythonOutput = blockToPyParser.Thread(new Entry.Thread(blockOutput[0], code));
            if (pythonOutput !== secondPythonOutput)
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
                    if (i === 11 &&
                        ["arduino", "ArduinoExt", "hamster"].indexOf(blockSchema.isNotFor[0]) < 0)
                        continue;
                    if (blockSchema.syntax.py[0] &&
                        blockSchema.syntax.py[0].passTest)
                        continue;
                    pairConvertTest(blockType);
                }
            }
        }
    });

    describe('should convert block', function(){
        it ("move direction", function() {
            assert.ok(Test.pythonToBlock(
                "Entry.move_to_direction(10)",
                [[{
                    type: "move_direction",
                    params: [{
                        params: [10]
                    }]
                }]]
            ));
        });
    });

    describe('should convert block', function() {
        it("move_x" , function() {
            assert.ok(Test.pythonToBlock(
                "Entry.add_x(10)" ,
                [[{
                    "type": "move_x",
                    "params": [{
                        params : [10]
                    }]
                }]]
            ));
        });
    });

    describe('minus / plus test', function() {
        it("move_x" , function() {
            assert.ok(Test.pythonToBlock(
                "Entry.add_x(-10)" ,
                [[{
                    "type": "move_x",
                    "params": [{
                        params : ["-10"]
                    }]
                }]]
            ));
        });
    });

    describe('String merge and add block test', function() { // variable add ,
        it("calc_basic" , function() {
            assert.ok(Test.pythonToBlock(
                "('안녕' + '하세요')",
                [[{
                    "type": "calc_basic",
                    "params": [
                        {
                            params : ["안녕"]
                        },
                        "PLUS",
                        {
                            params : ["하세요"]
                        }
                    ]
                }]]
            ));
        });

    });

    describe('should convert block', function(){
        it ("get_variable", function() {
            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "asdf"
            })
            assert.ok(Test.pythonToBlock(
                "테스트변수1",
                [[{
                    type: "get_variable",
                    params: [
                        "asdf"
                    ]
                }]]
            ));
            Entry.clearProject();
        });
    });
});
