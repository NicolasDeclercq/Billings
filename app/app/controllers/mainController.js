Application.Controller.define('mainController',{
	theme : null,
	category : null,

	getThemes : function(){
		return Application.Store.get('ideas');
	},
	setSelectedTheme : function(value){
		this.theme = value;
	},
	getSelectedTheme : function(){
		return this.getThemes()[this.theme];
	},
	setSelectedThemeName : function(name){
		if(this.theme){
			this.getSelectedTheme().name = name;
		}else{
			this.getThemes().push({
				name : name,
				categories : []
			});
		}
		Application.Store.save();
	},
	removeTheme : function(index){
		this.getThemes().splice(index, 1);
		Application.Store.save();
	},
	removeCategory : function(index){
		delete this.getSelectedTheme().categories[index];
		Application.Store.save();
	},
	
	getSelectedCategory : function(){
		return this.category;
	},
	setSelectedCategory : function(value){
		this.category = value;
	},
	
	//gestion du timer
	getTimeout : function(){
		return Application.Store.get('time').timeout;
	},
	getTimeoutAction : function(){
		return  Application.Store.get('time').action;
	}
});