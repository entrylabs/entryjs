# Engine class Documentation

엔진은 Canvas 를 컨트롤하는 클래스이며, 스마트폰의 경우 stageMouseMove/ stageMouseOut 이벤트 리스너가 없음.

---

## Basic Constructor variables

---

### **1. State**

정의) Engine의 상태를 나타내는 변수이며,

가능한 타입 : `typeof String, ['stop', 'pause', 'run'];`

---

### **2. popup**

정의) Engine이 사용할 팝업 reference 를 확인할 수 있는 부분입니다.

`Entry.Popup` 을 값으로 받습니다.

** FYI, `toggleFullScreen()` 참조 **

---

### **3. isUpdating**

정의) 현재 Engine 이 업데이트 중인지 아닌지를 확인 하는 flag 성 변수입니다.

---

### **4. speeds**

정의) 엔진의 실행 가능 속도를 정의합니다. Entry.engine 의 실행부 좌상단의 계기판 버튼에 해당하는 변수 리스트 입니다.

---

---

## **Functions**

---

---

** LIST OF FUNCTIONS **

|                    Name                     |                                               Simple Definition                                                |
| :-----------------------------------------: | :------------------------------------------------------------------------------------------------------------: |
|               generateView()                |                                          기본 뷰 initializing 을 담당                                          |
|             toggleSpeedPanel()              |                                엔진 속도 패널 on/off , 속도 패널 엘레멘트 관리                                 |
|             setSpeedMeter(FPS)              |                                             엔진 속도 세팅 (1~60)                                              |
|                   start()                   |                                                 엔진 렌더 시작                                                 |
|                   stop()                    |                                                 엔진 렌더 정지                                                 |
|                  update()                   |                              엔진 object연산 수행으로 업데이트, 하드웨어 연산시작                              |
|              computeObjects()               |            현재 Scene에 올라와있는 오브젝트들에 대해서 mapping하는 클래스, 오브젝트의 함수도 매핑함            |
|           computeFunction(script)           |                                        인자로 받은 script의 이벤트 기동                                        |
|        computeThread(entity, script)        | script가 있다면 engine이 가동중인지 확인, 만약 가동중이며, 현재 진행중인 스크립트와 같지 않다면 스크립트를 run |
|               isState(state)                |                                         return engine.state === state                                          |
|                    run()                    |                                           Engine 상태 토글 (isState)                                           |
|                 toggleRun()                 |                                                  Engine 기동                                                   |
|                toggleStop()                 |                                                  Engine 정지                                                   |
|            setEnableInputField()            |                                          Engine의 입력 Element 보이기                                          |
|                togglePause()                |                                                Engine 일시정지                                                 |
|           setPauseButton(option)            |                              일시정지 버튼 변경, 옵션은 minimize 이거나 아니거나                               |
|            fireEvent(eventName)             |                    엔진이 기동중이면 모든 entity의 부모entity 에 eventName인 이벤트를 전달                     |
|        raiseEvent(entity, eventName)        |                                        entity의 parent에 에 이벤트 전달                                        |
|    fireEventOnEntity(eventName, entity)     |                                      entity 에 eventName인 이벤트를 전달                                       |
|      raiseEventOnEntity(entity, param)      |                 만약 param의 첫번째 인자가 entity라면, 해당 entity의 부모에 이벤트를 전달한다                  |
|         captureKeyEvent(e, isForce)         |      만약 isForce가 아니면 작동하지 않는 keyCapture, 엔진 정지상태일때 방향키는 sprite 이동 event로 인식       |
| raiseKeyEvent(entity, [eventName, keyCode]) |                                             entity에 keyEvent 전달                                             |
|              updateMouseView()              |                                             마우스 좌표값 업데이트                                             |
|               hideMouseView()               |                                              마우스 좌표값 숨기기                                              |
|             toggleFullScreen()              |                                               팝업 전체화면 켜기                                               |
|              closeFullScreen()              |                                               팝업 전체화면 끄기                                               |
|              exitFullScreen()               |                                                 전체화면 exit                                                  |
|             showProjectTimer()              |                                                                                                                |
|             hideProjectTimer()              |                                                                                                                |
|                clearTimer()                 |                                                                                                                |
|             startProjectTimer()             |                                                                                                                |
|             stopProjectTimer()              |                                                                                                                |
|                resetTimer()                 |                                                                                                                |
|            updateProjectTimer()             |                                                                                                                |
|               raiseMessage()                |                                                                                                                |
|                  getDom()                   |                                                                                                                |
|           attachKeyboardCapture()           |                                                                                                                |
|           detachKeyboardCapture()           |                                                                                                                |
|                applyOption()                |                                                                                                                |
|                  destroy()                  |                                                                                                                |

---

---

---

## 상세 정보

### **`generateView()`**

#### Params

|     Name      |        Def        |              Default               |
| :-----------: | :---------------: | :--------------------------------: |
| `controlView` | Entry.controlView |                ---                 |
|   `option`    |        ---        | "workspace" instance of **String** |
|               |                   |                ---                 |

#### Generating Components

|        variable         |               work               |
| :---------------------: | :------------------------------: |
|      `this.view_`       |           Engine 추가            |
|   `this.speedButton`    |         speed 버튼 생성          |
|  `this.maximizeButton`  |    maximize 버튼 생성(팝업화)    |
| `this.coordinateButton` | 좌표격자 보이기/숨기기 버튼 생성 |
|    `this.mouseView`     |   현재 마우스 위치 좌표 표시,    |
|  `this.mouseViewInput`  |        mousePos 인풋 생성        |
|  `this.buttonWrapper`   |    하단 버튼 **wrapper** 추가    |
|    `this.addButton`     |          하단 버튼 추가          |
|    `this.runButton`     |             실행버튼             |
|    `this.runButton2`    |            mini 실행             |
|   `this.pauseButton`    |          일시 정지 버튼          |
| `this.pauseButtonFull`  |        전체화면시의 pause        |
|    `this.stopButton`    |        전체화면시의 정지         |
|   `this.stopButton2`    |             mini정지             |

---

### **`toggleSpeedPanel()`**

---

### **`setSpeedMeter()`**

---

### **`start()`**

---

### **`stop()`**

---

### **`update()`**

---

### **`computeObjects()`**

---

### **`computeFunction()`**

---

### **`computeThread()`**

---

### **`isState()`**

---

### **`run()`**

---

### **`toggleRun()`**

---

### **`toggleStop()`**

---

### **`setEnableInputField()`**

---

### **`togglePause()`**

---

### **`setPauseButton()`**

---

### **`fireEvent()`**

---

### **`raiseEvent()`**

---

### **`fireEventOnEntity()`**

---

### **`raiseEventOnEntity()`**

---

### **`captureKeyEvent()`**

---

### **`raiseKeyEvent()`**

---

### **`updateMouseView()`**

---

### **`hideMouseView()`**

---

### **`toggleFullScreen()`**

---

### **`closeFullScreen()`**

---

### **`exitFullScreen()`**

---

### **`showProjectTimer()`**

---

### **`hideProjectTimer()`**

---

### **`clearTimer()`**

---

### **`startProjectTimer()`**

---

### **`stopProjectTimer()`**

---

### **`resetTimer()`**

---

### **`updateProjectTimer()`**

---

### **`raiseMessage()`**

---

### **`getDom()`**

---

### **`attachKeyboardCapture()`**

---

### **`detachKeyboardCapture()`**

---

### **`applyOption()`**

---

### **`destroy()`**

---
