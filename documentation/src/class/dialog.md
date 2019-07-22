# [entry-js](http://play-entry.com) *0.1.1*

> JavaScript library for visual programming


### src/class/dialog.js


#### Entry.Dialog(entity, message, mode) 

Construct dialog




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| entity | `Entry.EntityObject`  | parent entity | &nbsp; |
| message | `string`  | to show on canvas | &nbsp; |
| mode | `string`  | is 'speak' or 'think' | &nbsp; |




##### Returns


- `Void`



#### Entry.Dialog.generateSpeak() 

Generate speak dialog box






##### Returns


- `Void`



#### Entry.Dialog.update() 

Set position






##### Returns


- `Void`



#### Entry.Dialog.createSpeakNotch(type) 

Generate speak notch




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| type | `string`  | can be 'ne', 'nw', 'se', 'sw' | &nbsp; |




##### Returns


- `createjs.Shape`  



#### Entry.Dialog.remove() 

Remove self






##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
