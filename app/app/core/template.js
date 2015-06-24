/**
* Gestionnaire des tempaltes de l'application
*/
Application.Template = new function(){
	/**
	* liste des templates définis dans l'application
	*/
	var templates = {};
	
	/**
	* Défini un template
	* @param {string} templateName : nom du template
	* @param {underscore template} template : template sous format underscore
	*/
	this.define = function(templateName, template){
		if(!templates[templateName]){
			templates[templateName] = template;
		}else{
			throw 'Template '+templateName+' already exists';
		}
	};

	/**
	* Récupère un template à partir de son nom
	*	si le template n'a pas été défini avant essaye de le récupérer dans le dom le nom correspondant à l'id du tag de définition
	* @param {string} templateName
	*/
	this.get = function(templateName){
		if(!templates[templateName]){
			templates[templateName] = $('#'+templateName).html();
		}
		if(!templates[templateName]){
			throw 'The template with name : '+templateName+' cannot be found';
		}
		return templates[templateName];
	};
};