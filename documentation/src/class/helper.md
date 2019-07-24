# [entry-js](http://play-entry.com) *0.1.1*

> JavaScript library for visual programming


### src/class/helper.js


#### Entry.Helper() 

doxdox 'src/class/helper.js' --layout markdown --output documentation/src/class/helper.md

Helper provide block description with 'blockHelper'






##### Returns


- `Void`



#### p.generateView(parentView, option) 

인자로 받은 ParentView 에 인자로 받은 option이 적용된 block helper를 생성합니다.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| parentView | `Entry.View`  | 해당 사항이 되는 parentView 입니다. | &nbsp; |
| option | `Object`  | JSON object 입니다. | &nbsp; |




##### Returns


- `Void`



#### this.parentView_() 








##### Returns


- `Void`



#### p.bindWorkspace() 

인자로 받은 workspace와 결합 합니다. 기존에 바인딩 되어있던 것이 있다면 제거한뒤에 새롭게 생성합니다.






##### Returns


- `Void`



#### p._updateSelectedBlock() 

toggle on block helper






##### Returns


- `Void`



#### p.renderBlock(type) 

인자로 받은 타입에 맞는 헬퍼를 생성합니다.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `String`  | 블록의 타입 | &nbsp; |




##### Returns


- `Void`



#### p.getView() 

현재 헬퍼의 view target 을 리턴합니다.






##### Returns


- `Entry.View`  view



#### p.resize() 

현재 코드 미러를 새로고침 합니다.






##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
