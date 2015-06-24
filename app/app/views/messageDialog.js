Application.View.define('messageDialog',{
	'extends' : 'Dialog',
	'template' : 'messageDialogTemplate',
	'settings' : {
		'data' : {
			'title' : 'default.confirm.title',
			'message' : 'default.confirm.message',
			'btn_cancel' : 'default.buttons.cancel',
			'btn_validate' : 'default.buttons.validate'
		}
	},
	'events' : {
		'click .close' : 'close',
		'click .validate' : 'validate'
	},
	'onInitialize' : function(){
		if(this.settings.data.title){
			this.settings.data.title = Application.I18n.get(this.settings.data.title);
		}
		if(this.settings.data.message){
			this.settings.data.message = Application.I18n.get(this.settings.data.message);
		}
		if(this.settings.data.btn_cancel){
			this.settings.data.btn_cancel = Application.I18n.get(this.settings.data.btn_cancel);
		}
		if(this.settings.data.btn_validate){
			this.settings.data.btn_validate = Application.I18n.get(this.settings.data.btn_validate);
		}
	},	
	'close' : function(){
		if(typeof this.settings.cancelCallback === 'function'){
			this.settings.cancelCallback();
		}
		this.remove();
	},
	'validate' : function(){
		if(typeof this.settings.validateCallback === 'function'){
			this.settings.validateCallback();
		}
		this.remove();
	},
});