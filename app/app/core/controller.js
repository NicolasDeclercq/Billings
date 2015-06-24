/**
* Gestionnaire des controlleurs de l'application
*
* Un controlleur permet de rendre des méthodes accessibles à chacune des vues de l'application dans un context défini
* Il fait le lien entre le Store et les vues (le Store ne devant pas être appelé depuis une vue)
* 
*/
Application.Controller = new function(){
	/**
	* liste des controlleurs définis
	*/
	var controllers = {};
	
	/**
	* controlleur actif
	*/
	var currentController = null;
	
	/**
	* Défini un nouveau controlleur
	* @param {string} controllerName : nom du controlleur
	* @param {json} definition : definition du controlleur
	*/
	this.define = function(controllerName, definition){
		if(!controllers[controllerName]){
			controllers[controllerName] = definition;
		}else{
			throw 'Controller with name : "'+controllerName+'" already exists';
		}
	};
	
	/**
	* Active un controlleur celui-ci sera accessible grâce à la méthode:
	* @see Application.Controller.getCurrent
	*/
	this.activate = function(controllerName,settings){
		if(!controllers[controllerName]){
			throw 'Cannot instantiate controller with name '+controllerName;
		}
		currentController = _.clone(controllers[controllerName]);
		currentController.name = controllerName;
		
		if(typeof currentController.initialize === 'function'){
			currentController.initialize(settings);
		}
	};
	
	/**
	* Renvoi le controlleur actif (null si aucun controlleur n'a été activé
	*/
	this.getCurrent = function(){
		return currentController;
	};
};