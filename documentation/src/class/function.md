# [entry-js](http://play-entry.com) *0.1.1*

> JavaScript library for visual programming


### src/class/function.js


#### Entry.Func(variable) 

Block variable constructor




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| variable | `variable.model`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.threads() 

EmptyFunction






##### Returns


- `Void`



#### Entry.Func.registerFunction(Function) 

함수/값 등록




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| Function | `variable.model`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.executeFunction(threadHash) 

함수/값 실행




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| threadHash | `hashValue`  |  | &nbsp; |




##### Returns


- `Boolean`  didScriptRan



#### Entry.Func.clearThreads() 

쓰레드 전체 비우기






##### Returns


- `Void`



#### Entry.Func.destroy() 

함수/값 전체 삭제






##### Returns


- `Void`



#### Entry.Func.edit(Function) 

함수/값 수정, 인자로 받은 함수/값 으로 현재 함수/값을 수정




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| Function | `variable.model`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.initEditView(content) 

인자로 받은 수정 컨텐츠코드에 해당하는 부분 보여주는 뷰를 Init




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| content | `String.BoardCode`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.endEdit(message) 

인자로 받은 message 를 통해 현재 수정 단계를 끝맻음, cancelEdit / save




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| message | `String`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.save() 

수정 하던 함수/값 저장합니다.






##### Returns


- `Void`



#### Entry.Func.cancelEdit() 

수정 하던 것을 그만둡니다






##### Returns


- `Void`



#### Entry.Func.setupMenuCode() 

메뉴에 들어가야하는 부분에 대한 코드를 다시 생성합니다






##### Returns


- `Void`



#### Entry.Func.refreshMenuCode() 

메뉴에 들어가야하는 부분에 대한 코드를 다시 세팅합니다 문제가 있다면 다시 생성합니다






##### Returns


- `Void`



#### Entry.Func.requestParamBlock(type) 

값 블록을 요청합니다. type에 맞는 기본 값 블록을 리턴합니다.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `String`  |  | &nbsp; |




##### Returns


- `Entry.block`  String/Boolean 블록



#### Entry.Func.registerParamBlock(type) 

값 블록을 등록합니다. type에 맞는 타입으로 등록합니다.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `String`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.createParamBlock(type, blockPrototype, originalType) 

값 블록을 생성합니다. type에 맞는 타입으로 등록합니다.
originalType 에 맞는 Lang Template 을 가져오며, blockPrototype 을 이용하여 만들어진 블럭을 type 에 맞게 등록하여 리턴합니다.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `String`  |  | &nbsp; |
| blockPrototype | `String`  |  | &nbsp; |
| originalType | `String`  |  | &nbsp; |




##### Returns


- `Entry.block`  blockSchema



#### Entry.Func.updateMenu() 

메뉴창을 갱신합니다.






##### Returns


- `Void`



#### Entry.Func.edit() 

함수/값 수정에 대한 기본 베이스 함수






##### Returns


- `Void`



#### Entry.Func.generateBlock(Function) 

인자로 받은 함수/값을 블록에 넣어서 생성




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| Function | `variable.model`  |  | &nbsp; |




##### Returns


- `Object`  block && description in singleObject



#### Entry.Func.generateBlock(UNKNOWN) 

블록 생성에 대한 기본 베이스 함수




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| UNKNOWN | `UNKNOWN`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.generateWsBlock(targetFunc, isRestore) 

워크스페이스 블럭 생성, 사용할 함수/값과, 복원인지 여부를 인자로 받음.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| targetFunc | `variable.model`  |  | &nbsp; |
| isRestore | `Boolean`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.bindFuncChangeEvent(targetFunc) 

함수/값 변경 이벤트에 대한 이벤트 리스너 함수를 인자로 받아서 부착




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| targetFunc | `variable.model`  |  | &nbsp; |




##### Returns


- `Void`



#### Entry.Func.unbindFuncChangeEvent() 

함수/값 변경에 대한 이벤트를 제거






##### Returns


- `Void`



#### Entry.Func.unbindWorkspaceStateChangeEvent() 

워크스페이스 상태 변경에 대한 이벤트를 제거






##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
