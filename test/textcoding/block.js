describe('EntryPython', function(){
    var allCategories = EntryStatic.getAllBlocks();

    Entry.init(null, {type: "invisible"});

    Entry.loadProject(Entry.getStartProject());
    Entry.playground.object = Entry.container.objects_[0];

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
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];
                     
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
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];
            
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
        
        it("dialog block test", function() { // (테스트변수)를 말하기 블록
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];
            
            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "asdf"
            })

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

        

        it("dialog time block test", function() {
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];
            
            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "asdf"
            })

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수2", "id": "asde"
            })

            assert.ok(Test.pythonToBlock(
                "Entry.print_for_sec(테스트변수1 , 테스트변수2)",
                [[{
                    type: "dialog_time",
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
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

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
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

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
                "Entry.set_xy_for_sec(테스트변수2, 테스트변수3, 테스트변수1)",
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

        it("add_brush_size block test", function(){
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "asdf"
            });

            assert.ok(Test.pythonToBlock(
                "Entry.add_brush_size(테스트변수1)",
                [[{
                    type : "change_thickness",
                    params : [
                        {   
                            type: "get_variable",   
                            params : ['asdf']
                        }
                    ]
                }]]
            ));
            
            Entry.clearProject();
        });

        it("play_sound_from_to block test", function(){
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];


            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수1", "id": "asdf"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수2", "id": "abce" 
            });

            assert.ok(Test.pythonToBlock(
                "Entry.play_sound_from_to('강아지 짖는소리', 테스트변수1, 테스트변수2)",
                [[{
                    type : "sound_from_to",
                    params : [
                        {   
                            type: "get_sounds",   
                            params : ['8el5']
                        },
                        {   
                            type: "get_variable",   
                            params : ['asdf']
                        },
                        {   
                            type: "get_variable",   
                            params : ['abce']
                        }
                    ]
                }]]
            ));
            
            Entry.clearProject();
        });
    })

    
    describe('list index change block is ', function(){
        it("value_of_index_from_list block", function() {
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            Entry.variableContainer.addList({
                "type": "list", "name": "테스트리스트", "id": "asdf"
            });
            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수", "id": "asde"
            });


            assert.ok(Test.pythonToBlock(
                "테스트리스트[테스트변수-1]",
                [[{
                    type : "value_of_index_from_list",
                    params : [
                        null,
                        'asdf',                
                        null,
                       {   
                            type: "get_variable",   
                            params : ['asde']
                        }
                    ]
                }]]
            ));

            Entry.clearProject();

        });

        it("remove_value_from_list block", function() {
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            Entry.variableContainer.addList({
                "type": "list", "name": "테스트리스트", "id": "asdf"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수", "id": "asde"
            });

            assert.ok(Test.pythonToBlock(
                "테스트리스트.pop(테스트변수-1)",
                [[{
                    type : "remove_value_from_list",
                    params : [
                       {
                            type: "get_variable",
                            params: ['asde']
                       },
                       'asdf'
                    ]
                }]]
            ));

            Entry.clearProject();

        });

        it("insert_value_to_list block", function() {
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            Entry.variableContainer.addList({
                "type": "list", "name": "테스트리스트", "id": "asdf"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수", "id": "asde"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수2", "id": "asdz"
            });


            assert.ok(Test.pythonToBlock(
                "테스트리스트.insert(테스트변수2-1 , 테스트변수)",
                [[{
                    type : "insert_value_to_list",
                    params : [
                       {
                            type: "get_variable",
                            params: ['asde']
                       },
                       'asdf',
                       {
                            type: "get_variable",
                            params: ['asdz']
                       }
                    ]
                }]]
            ));

            Entry.clearProject();

        });

        it("change_value_list_index block", function() {
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            Entry.variableContainer.addList({
                "type": "list", "name": "테스트리스트", "id": "asdf"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수", "id": "asde"
            });

            Entry.variableContainer.addVariable({
                "type": "variable", "name": "테스트변수2", "id": "asdz"
            });


            assert.ok(Test.pythonToBlock(
                "테스트리스트[테스트변수2-1] = 테스트변수",
                [[{
                    type : "change_value_list_index",
                    params : [
                       'asdf',
                       {
                            type: "get_variable",
                            params: ['asdz']
                       },
                       {
                            type: "get_variable",
                            params: ['asde']
                       }
                    ]
                }]]
            ));

            Entry.clearProject();
        });

    });

    describe('declare', function(){

        it("variable" , function() {
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];
            Test.parsePython("test = 2");
            var variable = Entry.variableContainer.variables_[0];

            assert.ok(variable);
            assert.equal(variable.name_ , 'test');
            assert.equal(variable.value_ , '2');

            Entry.clearProject();

        });

        it("list" , function() {
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];
            Test.parsePython("test = ['2']");
            var list = Entry.variableContainer.lists_[0];

            assert.ok(list);
            assert.equal(list.name_ , 'test');
            assert.equal(list.array_[0].data , '2');
            
            Entry.clearProject();

        });

    });

    describe('parse', function(){

        it("sound" , function(){
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            assert.ok(Test.pythonToBlock(
                "Entry.play_sound('강아지 짖는소리')",
                [[{
                    type : "sound_something_with_block",
                    params : [
                       {
                            type: "get_sounds",
                            params: ['8el5']
                       },
                       null
                    ]
                }]]
            ));
            Entry.clearProject();
        });

        it("picture" , function(){
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            assert.ok(Test.pythonToBlock(
                "Entry.change_shape('엔트리봇_걷기2')",
                [[{
                    type : "change_to_some_shape",
                    params : [
                       {
                            type: "get_pictures",
                            params: ["4t48"]
                       },
                       null
                    ]
                }]]
            ));
            Entry.clearProject();
        });
        
        it("object" , function(){
            Entry.loadProject(Entry.getStartProject());
            Entry.playground.object = Entry.container.objects_[0];

            assert.ok(Test.pythonToBlock(
                'Entry.make_clone_of("엔트리봇")',
                [[{
                    type : "create_clone",
                    params : [
                        "7y0y"
                    ]
                }]]
            ));
            Entry.clearProject();
        });
    
        describe('create ' , function() {
            it('local variable' , function() {

                Entry.variableContainer.addVariable({
                    "type": "variable", "name": "테스트변수1", "id": "abcd" , object_ : "7y0y"

                });

                Entry.loadProject(Entry.getStartProject());
                Entry.playground.object = Entry.container.objects_[0];

                assert.ok(Test.pythonToBlock(
                    "테스트변수1",
                    [[{
                        type : 'get_variable',
                        params : [ 'abcd' ]
                    }]]
                ));

                Entry.clearProject();
            })
        });
    });
});
