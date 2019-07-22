# [entry-js](http://play-entry.com) *0.1.1*

> JavaScript library for visual programming


### src/class/engine.js


#### Entry.Engine() 

엔진은 Canvas 를 컨트롤하는 클래스이며, 스마트폰의 경우 stageMouseMove/ stageMouseOut 이벤트 리스너가 없음.

### Basic Constructor variables

### **1. State**

정의) Engine의 상태를 나타내는 변수이며, 가능한 타입 :

     `typeof String, ['stop', 'pause', 'run'];`


### **2. popup**

정의) Engine이 사용할 팝업 reference 를 확인할 수 있는 부분입니다.

`Entry.Popup` 을 값으로 받습니다.

** FYI, `toggleFullScreen()` 참조 **


### **3. isUpdating**

정의) 현재 Engine 이 업데이트 중인지 아닌지를 확인 하는 flag 성 변수입니다.


### **4. speeds**

정의) 엔진의 실행 가능 속도를 정의합니다. Entry.engine 의 실행부 좌상단의 계기판 버튼에 해당하는 변수 리스트 입니다.


Class for a engine. This have view for control running state.






##### Returns


- `NULL`  



#### generateView(controlView, option) 

#### Params
|     Name      |        Def        |              Default               |
| :-----------: | :---------------: | :--------------------------------: |
| `controlView` | Entry.controlView |                ---                 |
|   `option`    |        ---        | "workspace" instance of **String** |
|               |                   |                ---                 |
  기본 뷰 initializing 을 담당  Control bar view generator.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| controlView | `Element`  | controlView from Entry. | &nbsp; |
| option | `string`  | for choose type of view. | &nbsp; |




##### Returns


- `NULL`  



#### this.view_() 








##### Returns


- `Void`



#### toggleSpeedPanel() 

엔진 속도 패널 on/off , 속도 패널 엘레멘트 관리






##### Returns


- `NULL`  



#### setSpeedMeter(FPS) 

엔진 속도 세팅 (1~60)




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| FPS | `number`  | 1~60의 프레임수를 넣을수 있음 | &nbsp; |




##### Returns


- `NULL`  



#### start(FPS) 

엔진 렌더 시작
ORIGINAL: Start engine




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| FPS | `number`  | 1~60의 시작 프레임수를 넣을수 있음 | &nbsp; |




##### Returns


- `NULL`  



#### stop() 

엔진 렌더 정지
ORIGINAL: stop engine






##### Returns


- `NULL`  



#### update() 

엔진 object연산 수행으로 업데이트, 하드웨어 연산시작
ORIGINAL: Update canvas and object.






##### Returns


- `NULL`  



#### computeObjects() 

현재 Scene에 올라와있는 오브젝트들에 대해서 mapping하는 클래스, 오브젝트의 함수도 매핑함
ORIGINAL: compute each object with runningScript on entity.






##### Returns


- `NULL`  



#### computeFunction(object) 

인자로 받은 script의 이벤트 기동
ORIGINAL: Compute function for map.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| object | `Entry.EntryObject`  |  | &nbsp; |




##### Returns


- `NULL`  



#### isState(state) 

engine.state === state 를 리턴
ORIGINAL: Check this state is same with argument




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| state | `string`  |  | &nbsp; |




##### Returns


- `boolean`  



#### run() 

Engine 상태 토글 (isState === run ? isState = stop : isState = run)
ORIGINAL: Execute this function when click start button






##### Returns


- `NULL`  



#### toggleRun(disableAchieve) 

Engine 기동, achievement 에 대한 인식 변경포함
ORIGINAL: toggle this engine state run




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| disableAchieve | `Boolean`  |  | &nbsp; |




##### Returns


- `NULL`  



#### toggleStop() 

Engine 정지
ORIGINAL: toggle this engine state stop






##### Returns


- `NULL`  



#### setEnableInputField(on) 

Engine의 입력 Element 보이기




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| on | `Boolean`  | inputField enabler | &nbsp; |




##### Returns


- `NULL`  



#### togglePause() 

Engine 일시정지
ORIGINAL:toggle this engine state pause






##### Returns


- `NULL`  



#### setPauseButton(option) 

일시정지 버튼 변경, 옵션은 minimize 이거나 아니거나, 버튼에 대한 옵션이 변경됨




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| option | `String`  |  | &nbsp; |




##### Returns


- `NULL`  



#### fireEvent(eventName) 

엔진이 기동중이면 모든 오브젝트에 eventName인 이벤트를 전달




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| eventName | `string`  |  | &nbsp; |




##### Returns


- `NULL`  



#### raiseEvent(object, eventName) 

entity의 parent에 이벤트 전달
ORIGINAL: this is callback function for map.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| object | `Entry.EntryObject`  |  | &nbsp; |
| eventName | `string`  |  | &nbsp; |




##### Returns


- `NULL`  



#### fireEventOnEntity(eventName, entity) 

entity 에 eventName인 이벤트를 전달




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| eventName | `string`  |  | &nbsp; |
| entity | `Entry.EntityObject`  |  | &nbsp; |




##### Returns


- `NULL`  



#### raiseEventOnEntity(object, param) 

만약 param의 첫번째 인자가 entity라면, 해당 entity의 부모에 이벤트를 전달한다
ORIGINAL: this is callback function for map.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| object | `Entry.EntryObject`  |  | &nbsp; |
| param | `Array`  |  | &nbsp; |




##### Returns


- `NULL`  



#### captureKeyEvent(e) 

만약 isForce가 아니면 작동하지 않는 keyCapture, 엔진 정지상태일때 방향키는 sprite 이동 event로 인식
ORIGINAL: capture keyboard press input




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| e | `keyboardEvent`  |  | &nbsp; |




##### Returns


- `NULL`  



#### raiseKeyEvent(object, param) 

entity에 keyEvent 전달
ORIGINAL: this is callback function for map.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| object | `Entry.EntryObject`  |  | &nbsp; |
| param | `Array`  |  | &nbsp; |




##### Returns


- `NULL`  



#### updateMouseView() 

마우스 좌표값 업데이트
ORIGINAL: Update mouse coordinate






##### Returns


- `NULL`  



#### hideMouseView() 

마우스 좌표값 숨기기
ORIGINAL: hide mouse coordinate






##### Returns


- `NULL`  



#### toggleFullScreen() 

팝업 전체화면 켜기
ORIGINAL: Toggle full screen of canvas






##### Returns


- `NULL`  



#### closeFullScreen() 

팝업 전체화면 끄기






##### Returns


- `NULL`  



#### exitFullScreen() 

전체화면 exit






##### Returns


- `NULL`  



#### showProjectTimer() 

엔트리 엔진에 있는 프로젝트 타이머 켜기
ORIGINAL: projectTimer to show






##### Returns


- `NULL`  



#### hideProjectTimer(removeBlock, notIncludeSelf) 

엔트리 엔진에 있는 프로젝트 타이머 끄기
ORIGINAL: decide Entry.engine.projectTimer to show




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| removeBlock | `Entry.Block`  |  | &nbsp; |
| notIncludeSelf | `Boolean`  |  | &nbsp; |




##### Returns


- `NULL`  



#### clearTimer() 

엔트리 엔진에 있는 프로젝트 타이머 관련 interval clear, tick.stop()






##### Returns


- `NULL`  



#### startProjectTimer() 

엔트리 엔진에 있는 프로젝트 타이머 시작






##### Returns


- `NULL`  



#### stopProjectTimer() 

엔트리 엔진에 있는 프로젝트 타이머 정지






##### Returns


- `NULL`  



#### resetTimer() 

엔트리 엔진에 있는 프로젝트 타이머 리셋






##### Returns


- `NULL`  



#### updateProjectTimer(value) 

엔트리 엔진에 있는 프로젝트 타이머 갱신(value값은 지정 가능, default empty)




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| value |  |  | &nbsp; |




##### Returns


- `NULL`  



#### raiseMessage() 

엔트리에 신호(value) 전송






##### Returns


- `NULL`  



#### getDom(query) 

querySelector Equivalent, 버튼을 가져오는 클래스(run/stop/objectAdd)




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| query | `Array.<Query>`  |  | &nbsp; |




##### Returns


- `NULL`  



#### attachKeyboardCapture() 

키보드 입력 eventListener 추가






##### Returns


- `NULL`  



#### detachKeyboardCapture() 

키보드 입력 eventListener 제거






##### Returns


- `NULL`  



#### applyOption() 

엔진 옵션 적용 Entry.objectAddable 인지에 따라 **버튼**에 옵션 부여






##### Returns


- `NULL`  



#### destroy() 

destroy interface definition






##### Returns


- `NULL`  



#### Entry.Engine.computeThread(entity, object) 

엔진이 돌아가는동안 각 쓰레드별로 script 계산하여 리턴




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| entity | `Entry.EntityObject`  |  | &nbsp; |
| object | `Script`  |  | &nbsp; |




##### Returns


- `NULL`  




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
