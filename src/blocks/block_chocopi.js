Entry.Chocopi = {	  
  name: 'chocopi',
  p:{},
  ev:{},
  blocks:[],
  setZero: function() { },
  getport: function(id, port){
    if(!this.blocks) return -1		
		if(this.blocks[port].id==id) return port
		for(var p in this.blocks)if(this.blocks[p].id==id) return p
		return -1
	},
  connected:false,
	portlist: 
[
  [Lang.Blocks.chocopi_port+'1', 0],[Lang.Blocks.chocopi_port+'2', 1],[Lang.Blocks.chocopi_port+'3', 2],[Lang.Blocks.chocopi_port+'4', 3],
  [Lang.Blocks.chocopi_port+'5', 4],[Lang.Blocks.chocopi_port+'6', 5],[Lang.Blocks.chocopi_port+'7', 6],[Lang.Blocks.chocopi_port+'8', 7],
  ['BLE1', 8],['BLE2', 9],['BLE3', 10],['BLE4', 11],
  ['BLE5', 12],['BLE6', 13],['BLE7', 14],['BLE8', 15],
],
  dataHandler:function(data){
    if(!this.connected){
      this.connected=true
      Entry.hw.sendQueue.init =true
      Entry.hw.update()
      delete Entry.hw.sendQueue.init
      Entry.hw.sendQueue.data={}
    }
    if(data['d']){
      for(var i in data['d']){
          this.p[i]=data['d'][i]
      }
    }
    if(data['ev']){
      for(var i in data['ev']){
          this.ev[i]= data['ev'][i]
          Entry.engine.fireEvent(this.blocks[i].name + '14')
      }
    }  
    if(data['bl']){
      this.blocks= data['bl']
    }
  }
}