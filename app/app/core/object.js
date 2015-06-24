Application.Object = function(values){
	var state = Application.CRUD.CREATED;
	var data = {};
	var parent = null;
	var listeners = [];
	var isArray = false;
	var _jsonSymbol = {open : '{', close : '}', type : 'object'};
	
	//on protège l'accés à data
	Object.defineProperty(this, 'data', {
		get: function(){
			return data;
		},set: function(){
			throw 'You cannot modify the data property';
		}
	});
	//on protège l'accés à parent
	Object.defineProperty(this, 'parent', {
		get: function(){
			return parent;
		},set: function(value){
			if(!value instanceof Application.Object && !value instanceof Application.Array){
				throw 'Invalid parent definition';
			}
			parent = value;
		}
	});
	//on protège l'accés à state
	Object.defineProperty(this, 'state', {
		get: function(){
			return state;
		},set: function(value){
			if(! _.contains(Application.CRUD, value)){
				throw 'State must be an element of : Application.STATE';
			}
		}
	});
	//on protège l'accés à listeners
	Object.defineProperty(this, 'listeners', {
		get: function(){
			return listeners;
		},set: function(value){
			throw 'You cannot modify the listeners property';
		}
	});
	
	//on protège l'accés à _jsonSymbol
	Object.defineProperty(this, '_jsonSymbol', {
		get: function(){
			return _jsonSymbol;
		},set: function(value){
			throw 'You cannot modify the _jsonSymbol property';
		}
	});

	//création de l'objet à partir des valeurs passées à la construction
	for(var i in values){
		if(values[i] instanceof Application.Object || values[i] instanceof Application.Array){
			data[i] = values[i];
		}else if(typeof values[i] === 'function'){
			this[i] = values[i];
		}else{
			this.add(i, values[i]);
		}
	}
};

Application.Object.prototype.isDirty = Application._Object.isDirty;
Application.Object.prototype.getState = Application._Object.getState;
Application.Object.prototype.setCreated = Application._Object.setCreated;
Application.Object.prototype.setUpdated = Application._Object.setUpdated;
Application.Object.prototype.setDeleted = Application._Object.setDeleted;
Application.Object.prototype.setRetrieved = Application._Object.setRetrieved;
Application.Object.prototype.getKeys = Application._Object.getKeys;
Application.Object.prototype.getValues = Application._Object.getValues;
Application.Object.prototype.toJson = Application._Object.toJson;
Application.Object.prototype.onChange = Application._Object.onChange;
Application.Object.prototype.unWatch = Application._Object.unWatch;

Application.Object.prototype.add = function(name,value){
	if(typeof name === 'undefined'){
		throw 'name can\'t be undefined';
	}
	if(typeof this.data[name] === 'undefined'){
		Object.defineProperty(this, name, {
			get: function() {
				return this.data[name];
			},
			set: function(value) {
				//set value
				if(_.isArray(value)){
					this.data[name] = new Application.Array(value);
					this.data[name].parent = this;
				}else if(_.isObject(value) && !value instanceof Application.Array && ! value instanceof Application.Object){
					this.data[name] = new Application.Object(value);
					this.data[name].parent = this;
				}else{
					this.data[name] = value;
				}
				//change state
				this.setUpdated();

				//call listeners
				for(var i in this.listeners){
					if(typeof this.listeners[i].fn === 'function'){
						this.listeners[i].fn.call(this.listeners[i].scope);
					}
				}
			}
		});
		this[name] = value;
	}
};
Application.Object.prototype.removeKey = function(name){
	if(typeof name === 'undefined'){
		throw 'name can\'t be undefined';
	}else if(typeof this.data[name] === 'undefined'){
		throw 'Key '+name+' not found in object';
	}
	delete this.data[name];
	this.setUpdated();
};

