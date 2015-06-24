Application.View.define('dayView',{
	'template' : 'squareTemplate',

	'events' : {
		'click' : 'showEditDialog',
	},
	
	'onInitialize' : function(){
		if(!this.settings.data){
			this.settings.data = {};
		}
	},
	'showEditDialog' : function(){
		alert('Edit');
	},
	
});