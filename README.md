# entryjs 
entryjs는 엔트리에서 개발한 HTML5 기반의 블록코딩 라이브러리 입니다.
[엔트리](https://playentry.org) 사이트에 접속하시면 entryjs를 사용한 블록코딩 환경을 확인해 볼 수 있습니다.

## 시작하기
entryjs는 HTML Canvas와 오디오, 벡터 이미지등을 다루기 위해 몇가지 오픈소스 라이브러리들을 사용합니다.
이 라이브러리들이 웹프로젝트에 먼저 로딩된 후에 entryjs를 로딩하여야 합니다.

### 써드파티 라이브러리
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
 위 라이브러리들은 모두 오픈소스로 배포되며, 직접 다운로드 받거나 [npm](http://npmjs.org), [bower](http://bower.io)등을 이용해 설치할 수 있습니다.

### 자바스크립트 라이브러리
 
```html
<!-- 써드파티 라이브러리들 -->
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

<!-- playentry 서버에 포함된 코드 -->
<script type="text/javascript" src="https://playentry.org/js/jshint.js"></script>
<script type="text/javascript" src="https://playentry.org/js/textmode/python/python.js"></script>

<!-- entryjs 및 entryjs 에 포함된 라이브러리들 -->
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/filbert.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/CanvasInput.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/ndgmr.Collision.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/handle.js"></script>
<script type="text/javascript" src="${LIBDIR}/entryjs/extern/util/bignumber.min.js"></script>

<!-- entryjs core / 언어 및 글로벌 설정이 포함되어있습니다. -->
<script type='text/javascript' src='${LIBDIR}/entryjs/extern/lang/ko.js'></script>
<script type='text/javascript' src='${LIBDIR}/entryjs/extern/util/static.js'></script>
<script type='text/javascript' src='${LIBDIR}/entryjs/dist/entry.min.js'></script>
```

### entryjs 스타일시트
블록 디자인과 관련된 기본적인 스타일들이 정의되어 있습니다.
```html
<link rel='stylesheet'  href='${LIBDIR}/entryjs/dist/entry.css'>
```

### 엔트리 초기화 (Inject Options)

필요한 라이브러리와 entryjs를 로딩하였으면 현재 DOM의 특정 위치에 Javascript를 이용해 entryjs workspace를 주입할 수 있습니다.

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
 * domElement : Entry가 Inject될 DOM 노드.
 * initOptions : entryjs workspace의 옵션값.
   
### initOptions
 Workspace 타입과 폰트정보를 제외한 모든 옵션은 선택사항이며 Boolean 타입입니다.
   
 * 필수항목
   - type: 워크스페이스 타입. (workspace: 만들기 환경, minimize: 구경하기 환경)
   - libDir: 써드파티 라이브러리 저장소. entryjs를 포함한 Library 위치. (기본값: '/lib')
   - fonts: 웹폰트 정보
   
 * 선택항목
   - projectsaveable: 프로젝트 저장가능 여부 (true)
   - objectaddable: 오브젝트 추가가능 여부 (true)
   - objectEditable: 오브젝트 수정가능 여부 (true). 이값을 false로 세팅하면 objectAddable도 false가 된다.
   - objectdeletable: 오브젝트 삭제가능 여부 (true)
   - soundeditable: 소리 수정가능 여부 (true)
   - pictureeditable: 모양 수정가능 여부 (true)
   - sceneEditable: 장면 수정가능 여부 (true)
   - functionEnable: 함수 사용가능 여부 (true)
   - messageEnable: 신호 사용가능 여부 (true)
   - variableEnable: 변수 사용가능 여부 (true)
   - listEnable: 리스트 사용가능 여부 (true)
   - isForLecture: 강의용 프로젝트 여부 (false)
   - textCodingEnable: 엔트리 파이선 사용가능 여부 (true)
   - hardwareEnable: 하드웨어 사용가능 여부 (true)
   
 * 웹폰트 정보
    엔트리 글상자와 그림판에서 사용할 폰트들을 하나 이상 배열로 추가할 수 있습니다.
    ```javascript
      [{
        name: '화면에 표시할 폰트 이름',
        family: 'font-family 이름',
        url: '폰트 정의파일 경로'
      }]
    ```
    
    ```javascript
    // 예시
    [{
      name: '나눔고딕',
      family: 'Nanum Gothic',
      url: '/css/nanumgothic.css'
    },
    {
      name: '나눔필기체',
      family: 'Nanum Pen Script',
      url: '/css/nanumpenscript.css'
    }]
    ```
    무료 한글 웹폰트는 https://fonts.google.com/earlyaccess 에서 다운로드 하실 수 있습니다.

### Entry.playground.setBlockMenu();
 블록메뉴 초기화
    
### Entry.loadProject(project);
 프로젝트 불러오기. project 인자를 생략할 경우 기본 프로젝트를 리턴합니다.

### 이벤트. (Event description)
 * event listening
 ```javascript
 Entry.addEventListener(eventName, function);
 ```
  - eventName: 캐치하고 싶은  커스텀 이벤트의 이름
  - function: 해당 커스텀 이벤트가 발생했을 경우 실행 될 함수

 * event dispatch
 ```javascript
 Entry.dispatchEvent(eventName,params);
 ```
  - eventName: 발생 시키고 싶은 이벤트의 이름
  - params: 이벤트를 리스닝 하고 있는 콜백함수에 넘겨줄 파라미터

 * 대표적인 이벤트
  - run
  - stop

 * 유저 인터랙션
  - keyPressed
  - keyUpped
  - canvasClick
  - canvasClickCanceled
  - entityClick
  - entityClickCanceled
  - stageMouseMove
  - stageMouseOut

 * 화면
  - windowResized

### Entry.Toast
* 워크스페이스 하단에 알림 메시지 표시
 - Entry.Toast.warning(title, message, auto-dospose); // 주의
 - Entry.Toast.success(title, message, auto-dospose); // 성공
 - Entry.Toast.alert(title, message, auto-dospose); // 경고

### 블록 모양 정의와 실행 스크립트.
```
${entryjs}/src/blocks/**/*
```

### 블록 모양 정의

[EntryDocs - 블록 명세 작성](https://entrylabs.github.io/docs/guide/entryjs/2016-05-22-add_new_blocks.html) 을 참고해주세요.

### 프로젝트 (Project Schema)

### 저장
   : 아래의 Entry 함수를 이용해 필수정보들을 JSON형태로 저장할 수 있습니다.
    저장된 프로젝트는 Entry.loadProject(project) 를 이용해 다시 로드할 수 있습니다.
    
```javascript
    var project = Entry.exportProject();
```

### 상세 스키마
 
```javascript
/**
 * MongoDB 스키마 예제.
 */
var ProjectSchema = new Schema({
    speed: { // 초당 실행 프레임수
        type: Number,
        default: 60
    },
    objects: [ // 오브젝트 목록
        {
            id: String, // 오브젝트 ID. Unique.
            name: String, // 오브젝트(또는 글상자 제목) 이름.
            text: String, // 글상자 내용. (objectType이 textBox일 경우)
            order: Number, // TODO
            objectType: String, // 오브젝트 유형. (sprite, textBox)
            scene: String, // 장면 ID. Unique.
            active: { // 오브젝트 활성화 여부
                type: Boolean,
                default: true
            },
            lock: { // 오브젝트 잠금 여부
                type: Boolean,
                default: false
            },
            rotateMethod: String, // 회전방식. (free, vertical, none)
            entity: { // 엔티티 정보
                rotation: Number, // 회전
                direction: Number, // 방향
                x: Number, // x 좌표
                y: Number, // y 좌표
                regX: Number, // 가로 중심점
                regY: Number, // 세로 중심점
                scaleX: Number, // 가로 배율
                scaleY: Number, // 세로 배율
                width: Number, // 넓이
                height: Number, // 높이
                imageIndex: Number, // TODO
                visible: Boolean, // 화면표시 여부
                colour: String, // 글상자 폰트색깔
                font: String, // 글상자 폰트
                bgColor: String, // 글상자 배경색깔
                textAlign: Number, // 글상자 정렬
                lineBreak: Boolean, // 글상자 줄바꿈 여부
                underLine: Boolean, // 글상자
                strike: Boolean // 글상자 밑줄
            },
            script: String, // 블록 스크립트
            sprite: { // 스프라이트 정보
                name: String, // 스프라이트 이름
                pictures: [{ // 모양 목록
                    id: String, // 모양 ID. Unique/
                    name: String, // 모양 이름
                    fileurl: String, // 모양 이미지
                    dimension: { // 모양 크기
                        width: Number,
                        height: Number,
                        scaleX: Number,
                        scaleY: Number
                    },
                    scale: { // 확대, 축소 비율(100% 기준)
                        type: Number,
                        default: 100
                    }
                }],
                sounds: [{ // 소리 목록
                    id: String, // 소리 ID. Unique.
                    name: String, // 이름
                    fileurl: String, // 사운드 파일 URL
                    duration: Number // 재생시간. (초단위)
                }]
            },
            selectedPictureId: String, // 현재 활성화된 모양의 ID
            selectedSoundId: String // 현재 활성화된 소리의 ID

        }
    ],
    variables: [ // 프로젝트 변수
        {
            name: String, // 변수명
            variableType: String, // 변수형. (일반변수: variable, 타이머: timer, 대답: answer, 슬라이드: slide, 리스트: list)
            id: String, // 변수ID. Unique.
            value: String, // 변수 값
            minValue: Number, // 최소값
            maxValue: Number, // 최대값
            visible: Boolean, // 캔버스에 표시여부
            x: Number, // 컨버스 위치 x좌표
            y: Number, // 캔버스 위치 y좌표
            width: Number, // 넓이
            height: Number, // 높이
            isCloud: { // 공유 변수 여부
                type: Boolean,
                default: false
            },
            object: { // 지역변수일 경우 참조하는 오브젝트 ID
                type: String,
                default: null
            },
            array: [{ // 변수형이 list일 경우 값 목록
                data: String // 값 데이터
            }]
        }
    ],
    messages: [ // 신호 목록
        {
            name: String, // 신호명
            id: String // 신호 ID. Unique.
        }
    ],
    functions: [ // 함수 목록
        {
            id: String, // 함수 ID. Unique.
            block: String, // 함수 블록 정보
            content: String, // 함수 실행 정보
                id: String,
                name: String
            }]
        }
    ],
    scenes: { // 장면 정보
        type: [ // 장면 목록
            {
                name: String, // 장면 이름
                id: String // 장면 ID. Unique.
            }
        ]
    },
});
```

### Sprite, Picture, Sound schema

### 스프라이트
```javascript
            var SpriteSchema = new Schema({
                name: String, // 스프라이트 이름
                pictures: [{ // 모양 목록
                    name: String, // 모양 이름
                    fileurl: String, // 모양 이미지
                    dimension: { // 모양 크기
                        width: Number,
                        height: Number
                    }
                }],
                sounds: [{ // 소리 목록
                    name: String, // 이름
                    fileurl: String, // 사운드 파일 URL
                    duration: Number // 재생시간. (초단위)
                }]
            })
```

#### 모양
```javascript
	var PictureSchema = new Schema({
                    name: String, // 모양 이름
                    fileurl: String, // 모양 이미지
                    dimension: { // 모양 크기
                        width: Number,
                        height: Number
                    }
	})
```

#### 소리
```javascript
	var SoundSchema = new Schema({
                    name: String, // 이름
                    fileurl: String, // 사운드 파일 URL
                    duration: Number // 재생시간. (초단위)
	})
```


## Copyright and License

EntryJS Copyright (c) 2015 Entry Labs.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
