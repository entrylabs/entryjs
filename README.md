# entryjs

## 프로젝트 (Project Schema)

 1. 저장
   : 아래의 Entry 함수를 이용해 필수정보들을 JSON형태로 저장할 수 있습니다.
    저장된 프로젝트는 Entry.loadProject(project) 를 이용해 다시 로드할 수 있습니다.
```
    var project = Entry.exportProject();
```

 2. 상세 스키마
```
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

## 엔트리 초기화 (Inject Options)

 * Entry.init(domElement, initOptions);
```
   - Markup
   <div id="workspace"></div>
```

```
   - JS
   var workspace = document.getElementById("workspace");
   var initOptions = {
    type: 'workspace'
   };
   Entry.init(workspace, initOptions);
```
   - domElement : Entry가 Inject될 DOM 노드.
   - initOptions (기본값)
````
{
    type: 워크스페이스 타입. (workspace: 만들기 환경, minimize: 구경하기 환경)
    projectsaveable: 프로젝트 저장가능 여부 (true)
    objectaddable: 오브젝트 추가가능 여부 (true)
    objectEditable: 오브젝트 수정가능 여부 (true). 이값을 false로 세팅하면 objectAddable도 false가 된다.
    objectdeletable: 오브젝트 삭제가능 여부 (true)
    soundeditable: 소리 수정가능 여부 (true)
    pictureeditable: 모양 수정가능 여부 (true)
    sceneEditable: 장면 수정가능 여부 (true)
    functionEnable: 함수 사용가능 여부 (true)
    messageEnable: 신호 사용가능 여부 (true)
    variableEnable: 변수 사용가능 여부 (true)
    listEnable: 리스트 사용가능 여부 (true)
    isForLecture: 강의용 프로젝트 여부 (false)
   }
```

 * Entry.playground.setBlockMenu(); // 블록메뉴 초기화
 * Entry.enableArduino(); // 아두이노 초기화, Web socket connection 오픈
 * Entry.loadProject(project) // 프로젝트 불러오기. project 인자를 생략할 경우 기본 프로젝트를 리턴합니다.


## 이벤트. (Event description)

* event listening
```
Entry.addEventListener(eventName, function);
```
 - eventName: 캐치하고 싶은  커스텀 이벤트의 이름
 - function: 해당 커스텀 이벤트가 발생했을 경우 실행 될 함수

* event dispatch
```
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

## Toast description



## Sprite, Picture, Sound schema
* 스프라이트
```
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

* 모양
```
	var PictureSchema = new Schema({
                    name: String, // 모양 이름
                    fileurl: String, // 모양 이미지
                    dimension: { // 모양 크기
                        width: Number,
                        height: Number
                    }
	})
```

* 소리
```
	var SoundSchema = new Schema({
                    name: String, // 이름
                    fileurl: String, // 사운드 파일 URL
                    duration: Number // 재생시간. (초단위)
	})
```

## Block add and define



## License

## Dependent library

* CSS include
```
<link rel='stylesheet'  href='/lib/entryjs/dist/entry.css'>
```

* JS includes (jquery and underscore required)
```
<script type='text/javascript'  src='jquery.js'>
<script type='text/javascript' src='underscore.js'>

<script type='text/javascript' src='/lib/entryjs/extern/blockly/blockly_compressed.js'>
<script type='text/javascript' src='/lib/entryjs/extern/blockly/msg/js/ko.js'>
<script type='text/javascript' src='/lib/entryjs/extern/PreloadJS/lib/preloadjs-0.6.0.min.js'>
<script type='text/javascript' src='/lib/entryjs/extern/EaselJS/lib/easeljs-0.8.0.min.js'>
<script type='text/javascript' src='/lib/entryjs/extern/SoundJS/lib/soundjs-0.6.0.min.js'>
<script type='text/javascript' src='/lib/entryjs/extern/SoundJS/lib/flashaudioplugin-0.6.0.min.js'>
<script type='text/javascript' src='/lib/entryjs/util/ko.js'>
<script type='text/javascript' src='/lib/entryjs/util/static.js'>
<script type='text/javascript' src='/lib/entryjs/util/CanvasInput.js'>
<script type='text/javascript' src='/lib/entryjs/util/handle.js'>
<script type='text/javascript' src='/lib/entryjs/util/ndgmr.Collision.js'>

<script type='text/javascript' src='/lib/entryjs/dist/entry.min.js'>
```
