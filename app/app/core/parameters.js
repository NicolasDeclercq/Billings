/**
* Permet de créer des paramètres dasn l'applications
*	les paramètres sont de la forme clé => valeur
*	et peuvent être configurés pour ne pas persister entre les sessions
*/
Application.Parameters = new function(){

	/**
	* Récupère un paramètre
	* @param key : nom du paramètre à récupérer
	* @return : valeur du paramètre
	*/
	this.get = function(key){
		if(sessionStorage.getItem(key)){
			return sessionStorage.getItem(key);
		}else{
			return localStorage.getItem(key);
		}
	};
	this.getObject = function(key){
		return JSON.parse(this.get(key));
	};
	/**
	* Enregistre une donnée
	* @param key : nom de la variable
	* @param value : valeur de la variable
	* @param isTemporary : permet de définir si la donnée disparaitra à la fermeture de l'application (boolean optional)
	*/
	this.set = function(key,value,isTemporary){
		if(typeof value !== 'string'){
			value = JSON.stringify(value);
		}
		if(isTemporary){
			sessionStorage.setItem(key,value);
		}else{
			localStorage.setItem(key,value);
		}
	}
	
	/**
	*	Supprime un paramètre
	*/
	this.unset = function(key){
		if(sessionStorage.getItem(key)){
			sessionStorage.removeItem(key);
		}else{
			localStorage.removeItem(key);
		}
	}
};