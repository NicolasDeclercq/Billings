Application.View.define('i18n',{
	'extends' : 'SubView',
	'template' : 'i18n',
	
	'beforeRefresh' : function(){
		//ajout de la traduction
		if(!this.settings.data){
			this.settings.data = {};
		}
		this.settings.data.value = Application.I18n.get(this.settings.data.key,this.settings.data.parameters);
	}
});