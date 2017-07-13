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

    describe('convert float and integer block test', function() { // variable add ,
        it("calc_basic" , function() {
            assert.ok(Test.pythonToBlock(
                "('10.12345' - '10.0003')", 
                [[{
                    "type": "calc_basic",
                    "params": [
                        {
                            params : ["10.12345"]
                        },
                        "MINUS",
                        {
                            params : ["10.0003"]
                        }
                    ]
                }]]
            ));
        });

        it("quotient_and_mod" , function() {
            assert.ok(Test.pythonToBlock(
                "(11.0002 // 10.0003)", 
                [[{
                    "type": "quotient_and_mod",
                    "params": [
                        null,
                        {
                            params : ["11.0002"]
                        },
                        null,
                        {
                            params : ["10.0003"]
                        }
                    ]
                }]]
            ));
        });

        it("Minus action use variable" , function(){          
            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "abcd" , "value" : "11.0002"
            });
            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수2", "id": "abce" , "value" : "10.0003"
            });
            assert.ok(Test.pythonToBlock(
                "(테스트변수1 - 테스트변수2)", 
                [[{
                    "type": "calc_basic",
                    "params": [
                        {
                            type: "get_variable",
                            params: [
                                "abcd"
                            ]
                        },
                        "MINUS",
                        {
                            type: "get_variable",
                            params: [
                                "abce"
                            ]
                        }
                    ]
                }]]
            )); 
            Entry.clearProject();
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

    describe('parameter process test' , function() {
        Entry.variableContainer.addVariable({
            "type": "variable", "name": "테스트변수1", "id": "asdf"
        })


        it("dialog block test", function() { // (테스트변수)를 말하기 블록

            assert.ok(Test.pythonToBlock(
                "Entry.print(테스트변수1)",
                [[{
                    type: "dialog",
                    params: [
                        {   
                            type: "get_variable",   
                            params: [
                                "asdf"
                            ]
                        }
                    ]
                }]]
            ));
            Entry.clearProject();               
        });

        Entry.variableContainer.addVariable({
            "type": "variable", "name": "테스트변수1", "id": "asdf"
        })

        Entry.variableContainer.addVariable({
            "type": "variable", "name": "테스트변수2", "id": "asde"
        })

        it("dialog time block test", function() {
            assert.ok(Test.pythonToBlock(
                "Entry.print(테스트변수1 , 테스트변수2)",
                [[{
                    type: "dialog",
                    params: [
                        {   
                            type: "get_variable",   
                            params: [
                                "asdf"
                            ]
                        },
                        {   
                            type: "get_variable",   
                            params: [
                                "asde"
                            ]
                        }
                    ]
                }]]
            ));

            Entry.clearProject();
        });

   
        it("while not block test", function(){
            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "asdf"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수2", "id": "asde"
            });


            assert.ok(Test.pythonToBlock(
                "while not (테스트변수1 == 테스트변수2):",
                [[{
                    type : "repeat_while_true",
                    params : [
                        {
                            "type" : "boolean_basic_operator",
                            "params" : [
                                {
                                    "type": "get_variable",
                                    "params" : [
                                        "asdf"
                                    ]
                                },
                                "EQUAL",
                                {
                                    "type": "get_variable",
                                    "params" : [
                                        "asde"
                                    ]
                                }
                            ]
                        }
                    ]
                }]]
            ));
            
            Entry.clearProject();
        });

         it("set x, y block test", function(){

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "asdf"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수2", "id": "asde"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수3", "id": "asdh"
            });

            assert.ok(Test.pythonToBlock(
                "Entry.set_xy_for_sec(테스트변수1, 테스트변수2, 테스트변수3)",
                [[{
                    type : "locate_xy_time",
                    params : [
                        {   
                            type: "get_variable",   
                            params : ['asdf']
                        },
                        {
                            type: "get_variable",   
                            params : ['asde']
                        },
                        {
                            type: "get_variable",   
                            params : ['asdh']
                        }
                    ]
                }]]
            ));
            
            Entry.clearProject();
        });

    })
});
