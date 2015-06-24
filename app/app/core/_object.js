Application._Object = {
	isDirty : function(){
		if(this.state !== Application.CRUD.RETRIEVED){
			return true;
		}else{
			//on regarde si des enfants sont dirty
			for(var i in this.data){
				if(this.data[i] instanceof Application.Object || this.data[i] instanceof Application.Array){
					if(this.data[i].isDirty()){
						return true;
					}
				}
			}
		}
		return false;
	},
	getState : function(){
		return this.state;
	},
	setCreated : function(){
		this.state = Application.CRUD.CREATED;
	},
	setUpdated : function(){
		if(this.state !== Application.CRUD.CREATED && this.state !== Application.CRUD.DELETED){
			this.state = Application.CRUD.UPDATED;
		}
	},
	setDeleted : function(){
		this.state = Application.CRUD.DELETED;
	},
	setRetrieved : function(){
		this.state = Application.CRUD.RETRIEVED;
	},
	getKeys : function(){
		return _.keys(this.data);
	},
	getValues : function(){
		return _.values(this.data);
	},
	toJson : function(){
		var str = this._jsonSymbol.open;
		var counter = 0;
		for(var i in this.data){
			if(counter > 0){
				str +=',';
			}
			if(this._jsonSymbol.type === 'object'){
				str += JSON.stringify(i) + ':' ;
			}
			if(this.data[i] instanceof Application.Object || this.data[i] instanceof Application.Array){
				str += JSON.stringify(this.data[i].toJson());
			}else{
				str += JSON.stringify(this.data[i]);
			}
			counter++;
		}
		str += this._jsonSymbol.close;
		var result = null;
		try{
			return JSON.parse(str);
		}catch(e){
			console.error(e);
			return result;
		}
	},
	onChange : function(fn, scope){
		this.listeners.push({'fn' : fn, 'scope' : scope});
	},
	unWatch : function(fn){
		var index = -1;
		for(var i in this.listeners){
			if(this.listeners[i].fn === fn){
				index = i;
				break;
			}
		}
		if(index >=0){
			this.listeners.splice(index,1);
		}else{
			console.warn('Listener not found in object', this, fn, index);
		}
	}
};