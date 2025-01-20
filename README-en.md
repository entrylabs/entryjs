# entryjs 
entryjs is an HTML5-based block coding library developed by entry.
If you access the [Entry](https://playentry.org) site, you can check the block coding environment using entryjs.

## get started
entryjs uses several open source libraries to handle HTML Canvas, audio, and vector images.
After these libraries are loaded in the web project, entryjs should be loaded.

### 3rd party library
 * [jQuery](http://jquery.com/download/) - 1.9.1
 * [jquery-ui](https://github.com/jquery/jquery-ui) - 1.10.4
 * [Underscore](https://github.com/jashkenas/underscore) - 1.8.3
 * [CreateJS](http://createjs.com/downloads)
   * EaselJS - 0.8.0
   * PreloadJS - 0.6.0
   * SoundJS - 0.6.0
 * [Lodash](https://lodash.com/docs/4.17.15) - 4.17.10
 * [Velocity](https://github.com/julianshapiro/velocity) - ~1.2.3
 * [CodeMirror](https://codemirror.net) - 5.12.0
 * [Fuzzy](https://github.com/mattyork/fuzzy) - ~0.1.1
 * [Literallycanvas](https://github.com/entrylabs/literallycanvas) - entry version
 * [EntryTool](https://github.com/entrylabs/entry-tool) - entry version
  All of these libraries are distributed as open source, You can download it yourself or install it using [npm](http://npmjs.org) or [bower](http://bower.io).

###  JavaScript library
 
```html
<!--  third party libraries -->
<script type="text/javascript" src="${LIBDIR}/PreloadJS/lib/preloadjs-0.6.0.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/EaselJS/lib/easeljs-0.8.0.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/SoundJS/lib/soundjs-0.6.0.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/SoundJS/lib/flashaudioplugin-0.6.0.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/lodash/dist/lodash.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/jquery/jquery.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/jquery-ui/ui/minified/jquery-ui.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/velocity/velocity.min.js"></script>
<script type="text/javascript" src="${LIBDIR}/codemirror/lib/codemirror.js"></script>
<script type="text/javascript" src="${LIBDIR}/codemirror/addon/hint/show-hint.js"></script>
<script type="text/javascript" src="${LIBDIR}/codemirror/addon/lint/lint.js"></script>
<script type="text/javascript" src="${LIBDIR}/codemirror/addon/selection/active-line.js"></script>
<script type="text/javascript" src="${LIBDIR}/codemirror/mode/javascript/javascript.js"></script>
<script type="text/javascript" src="${LIBDIR}/codemirror/addon/hint/javascript-hint.js"></script>
<script type="text/javascript" src="${LIBDIR}/fuzzy/lib/fuzzy.js"></script>
<script type="text/javascript" src="${LIBDIR}/socket.io-client/socket.io.js"></script>
<script type="text/javascript" src="${LIBDIR}/react/react.js"></script>
<script type="text/javascript" src="${LIBDIR}/react/react-dom.js"></script>
<script type="text/javascript" src="${LIBDIR}/entry-lms/dist/assets/app.js"></script>
<script type="text/javascript" src="${LIBDIR}/literallycanvas-mobile/lib/js/literallycanvas.js"></script>
<script type="text/javascript" src="${LIBDIR}/entry-tool/dist/entry-tool.js"></script>

<!-- Code included in the playentry server -->
<script type="text/javascript" src="https://playentry.org/js/jshint.js"></script>
<script type="text/javascript" src="https://playentry.org/js/textmode/python/python.js"></script>

<!-- library included in entryjs and entryjs -->
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/filbert.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/CanvasInput.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/ndgmr.Collision.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/handle.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/bignumber.min.js"></script>

<!-- entryjs core / contains language and global settings -->
<script type='text/javascript' src='${LIBDIR}/entryjs/extern/lang/ko.js'></script>
<script type='text/javascript' src='${LIBDIR}/entryjs/extern/util/static.js'></script>
<script type='text/javascript' src='${LIBDIR}/entryjs/dist/entry.min.js'></script>
```

###  entryjs stylesheet
Basic styles related to block design are defined.
```html
<link rel='stylesheet'  href='${LIBDIR}/entryjs/dist/entry.css'>
```

### Entry Initialization (Inject Options)

Once you have loaded the necessary libraries and entryjs, you can inject the entryjs workspace using Javascript at a specific location in the current DOM.

 * Entry.init(domElement, initOptions);
    ```html
       <div id="workspace"></div>
    ```

    ```javascript
       var workspace = document.getElementById("workspace");
       var initOptions = {
        type: 'workspace',
        libDir: '/lib',
        fonts: [{
          name: '나눔고딕',
          family: 'Nanum Gothic',
          url: '/css/nanumgothic.css'
        }]
       };
       Entry.init(workspace, initOptions);
    ```
 * domElement : The DOM node into which the entry will be injected.
 * initOptions : Option value of entryjs workspace.
   
### initOptions
 All options except Workspace type and font information are optional and Boolean type. 
   
 * Required
   - type: Workspace type. (workspace: creation environment, minimize: viewing environment)
   - libDir:Third-party library repository. Library location including entryjs. (default: '/lib')
   - fonts: Web font information
   
 * choice
   - projectsaveable: Whether the project can be saved (true)
   - objectaddable: Whether objects can be added (true)
   - objectEditable: Whether the object can be modified (true). Setting this value to false also sets objectAddable to false.
   - objectdeletable: Whether the object can be deleted (true)
   - soundeditable: Whether sound can be modified (true)
   - pictureeditable: Whether the shape can be modified (true)
   - sceneEditable: Whether the scene can be modified (true)
   - functionEnable: Whether the function is available (true)
   - messageEnable: signal available (true)
   - variableEnable: Whether the variable is available (true)
   - listEnable: list available (true)
   - isForLecture: Lecture project or not (false)
   - textCodingEnable: Whether entry python is available (true)
   - hardwareEnable: Hardware availability (true)
   
 * Web font information 정보
    You can add one or more arrays of fonts to be used in the entry textbox and paint.
    ```javascript
      [{
        name: 'Font name to display on screen',
        family: 'font-family name',
        url: 'Font definition file path'
      }]
    ```
    
    ```javascript
    // 예시
    [{
      name: 'Nanum Gothic',
      family: 'Nanum Gothic',
      url: '/css/nanumgothic.css'
    },
    {
      name: 'Nanum handwriting',
      family: 'Nanum Pen Script',
      url: '/css/nanumpenscript.css'
    }]
    ```
   Free Korean web fonts can be downloaded from https://www.google.com/fonts/earlyaccess.

### Entry.playground.setBlockMenu();
 Block menu reset
    
### Entry.loadProject(project);
 Load project. If the project argument is omitted, the default project is returned..

### event. (Event description)
 * event listening
 ```javascript
 Entry.addEventListener(eventName, function);
 ```
  - eventName: The name of the custom event you want to catch
  - function: Function to be executed when the corresponding custom event occurs

 * event dispatch
 ```javascript
 Entry.dispatchEvent(eventName,params);
 ```
  - eventName: The name of the event you want to trigger
  - params: Parameters to be passed to the callback function listening for events

 * representative event
  - run
  - stop

 * user interaction
  - keyPressed
  - keyUpped
  - canvasClick
  - canvasClickCanceled
  - entityClick
  - entityClickCanceled
  - stageMouseMove
  - stageMouseOut

 * screen
  - windowResized

### Entry.Toast
* Display notification messages at the bottom of the workspace
 - Entry.Toast.warning(title, message, auto-dospose); // caution
 - Entry.Toast.success(title, message, auto-dospose); // success
 - Entry.Toast.alert(title, message, auto-dospose); // warning

### Block shape definition and running script.
```
${entryjs}/src/blocks/**/*
```

### block shape definition

Please refer to [EntryDocs - Write block specification](https://entrylabs.github.io/docs/guide/entryjs/2016-05-22-add_new_blocks.html).

### Project Schema

### save
   :You can save essential information in JSON format using the Entry function below.
     A saved project can be reloaded using Entry.loadProject(project) .
    
```javascript
    var project = Entry.exportProject();
```

### detailed schema
 
```javascript
/**
 * MongoDB schema example.
 */
var ProjectSchema = new Schema({
    speed: { // Execution frames per second
        type: Number,
        default: 60
    },
    objects: [ // object list
        {
            id: String, // Object ID. Unique.
            name: String, // The object (or textbox title) name.
            text: String, // text box content. (If objectType is textBox)
            order: Number, // TODO
            objectType: String, // object type. (sprite, textBox)
            scene: String, // Scene ID. Unique.
            active: { // whether the object is active
                type: Boolean,
                default: true
            },
            lock: { // object lock
                type: Boolean,
                default: false
            },
            rotateMethod: String, // rotation method (free, vertical, none)
            entity: { // entity information
                rotation: Number, // rotation
                direction: Number, // direction
                x: Number, // x coordinate
                y: Number, // y coordinate
                regX: Number, // horizontal center point
                regY: Number, // vertical center point
                scaleX: Number, // horizontal scale
                scaleY: Number, // vertical scale
                width: Number, // area
                height: Number, // height
                imageIndex: Number, // TODO
                visible: Boolean, // screen display
                colour: String, // text box font color 
                font: String, // text box font
                bgColor: String, // text box background color
                textAlign: Number, // textbox alignment
                lineBreak: Boolean, // Whether text box line breaks
                underLine: Boolean, // text box
                strike: Boolean // text box underline
            },
            script: String, // block script
            sprite: { // sprite information
                name: String, // sprite name
                pictures: [{ // shape list
                    id: String, // Shape ID. Unique/
                    name: String, // shape name
                    fileurl: String, // shape image
                    dimension: { // shape size
                        width: Number,
                        height: Number,
                        scaleX: Number,
                        scaleY: Number
                    },
                    scale: { // Magnification, reduction ratio (based on 100%)
                        type: Number,
                        default: 100
                    }
                }],
                sounds: [{ // list of sounds
                    id: String, // Sound ID. Unique.
                    name: String, // name
                    fileurl: String, // Sound file URL
                    duration: Number // play time. (in seconds)
                }]
            },
            selectedPictureId: String, // ID of the currently active shape
            selectedSoundId: String // ID of currently active sound

        }
    ],
    variables: [ // project variable
        {
            name: String, // variable name
            variableType: String, // variable type. (General variable: variable, timer: timer, answer: answer, slide: slide, list: list)
            id: String, // variable ID. Unique.
            value: String, // variable value
            minValue: Number, // minimum
            maxValue: Number, // max value
            visible: Boolean, // visibility on canvas
            x: Number, // Converse position x coordinate
            y: Number, // canvas position y-coordinate
            width: Number, // width
            height: Number, // height
            isCloud: { // Shared variable or not
                type: Boolean,
                default: false
            },
            object: { // If it is a local variable, the ID of the object it refers to
                type: String,
                default: null
            },
            array: [{ // A list of values if the variable type is list
                data: String //  value data
            }]
        }
    ],
    messages: [ // signal list
        {
            name: String, // signal name
            id: String // Signal ID. Unique.
        }
    ],
    functions: [ // function list
        {
            id: String, // function ID. Unique.
            block: String, // function block information
            content: String, // function execution information
                id: String,
                name: String
            }]
        }
    ],
    scenes: { // scene information
        type: [ // scene list
            {
                name: String, // scene name
                id: String // Scene ID. Unique.
            }
        ]
    },
});
```

### Sprite, Picture, Sound schema

### Sprites
```javascript
            var SpriteSchema = new Schema({
                name: String, // sprite name
                pictures: [{ // shape list
                    name: String, // shape name
                    fileurl: String, // shape image
                    dimension: { // shape size
                        width: Number,
                        height: Number
                    }
                }],
                sounds: [{ // list of sounds
                    name: String, // name
                    fileurl: String, // Sound file URL
                    duration: Number // play time. (in seconds)
                }]
            })
```

#### Pictures
```javascript
	var PictureSchema = new Schema({
                    name: String, // shape name
                    fileurl: String, // shape image
                    dimension: { // shape size
                        width: Number,
                        height: Number
                    }
	})
```

#### Sounds
```javascript
	var SoundSchema = new Schema({
                    name: String, // name
                    fileurl: String, // Sound file URL
                    duration: Number // play time. (in seconds)
	})
```


## Copyright and License

EntryJS Copyright (c) 2015 Entry Labs.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
