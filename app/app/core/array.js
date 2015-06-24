Application.Array = function(values){
	var state = Application.CRUD.CREATED;
	var data = {};
	var keys = [];
	var parent = null;
	var listeners = [];
	var _jsonSymbol = {open : '[', close : ']', type : 'array'};
	
	this._counter = 0;
	
	//on protège l'accés à data
	Object.defineProperty(this, 'data', {
		get: function(){
			return data;
		},set: function(){
			throw 'You cannot modify the data property';
		}
	});
	//on protège l'accés à keys
	Object.defineProperty(this, 'keys', {
		get: function(){
			return keys;
		},set: function(){
			throw 'You cannot modify the keys property';
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
	
	Object.defineProperty(this, 'values', {
		get: function(){
			return _.values(this.data);
		},set: function(value){
			throw 'You cannot modify the listeners property';
		}
	});

	//création de l'objet à partir des valeurs passées à la construction
	for(var i in values){
		if(typeof values[i] === 'function'){
			this[i] = values[i];
		}else{
			this.add(values[i]);
		}
	}
	
	Object.defineProperty(this, 'length', {
		get: function(){
			return keys.length;
		},set: function(value){
			throw 'You cannot modify the length property';
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
};

Application.Array.prototype.isDirty = Application._Object.isDirty;
Application.Array.prototype.getState = Application._Object.getState;
Application.Array.prototype.setCreated = Application._Object.setCreated;
Application.Array.prototype.setUpdated = Application._Object.setUpdated;
Application.Array.prototype.setDeleted = Application._Object.setDeleted;
Application.Array.prototype.setRetrieved = Application._Object.setRetrieved;
Application.Array.prototype.getKeys = Application._Object.getKeys;
Application.Array.prototype.getValues = Application._Object.getValues;
Application.Array.prototype.toJson = Application._Object.toJson;
Application.Array.prototype.onChange = Application._Object.onChange;
Application.Array.prototype.unWatch = Application._Object.unWatch;

Application.Array.prototype.add = function(value){
	var elem = this._counter;
	var keyIndex = this.keys.length;

	Object.defineProperty(this, elem, {
		get: function() {
			return this.data[this.keys[elem]];
		},
		set: function(value) {
			//set value
			if(_.isArray(value)){
				this.data[elem] = new Application.Array(value);
				this.data[elem].parent = this;
			}else if(_.isObject(value) && !(value instanceof Application.Array) && !(value instanceof Application.Object)){
				this.data[elem] = new Application.Object(value);
				this.data[elem].parent = this;
			}else{
				this.data[name] = value;
			}
			this.keys.push(elem);
			
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
	this[this._counter] = value;
	this._counter++;
};
Application.Array.prototype.removeAt = function(index){
	delete this.data[this.keys[index]];
	this.keys.splice(index,1);
	this.setUpdated();
};