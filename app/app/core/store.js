/**
* Gestion des données de l'application
* La récupération/mise à jour/synchronisation des données doit se faire via cet objet
*/
Application.Store = new function(){
	/**
	* données de cache de l'application
	*/
	var data = null;
	
	/**
	* Flag permettant de définir si le store a été initialisé
	*/
	var isInitialized = false;
	
	/**
	* initialise le Store en faisant une synchronisation 
	* et en mettant les données par défaut dans le cas où aucune donnée n'est récupérée
	* @param {function} callback : action à réaliser une fois l'initialisation effectuée
	*/
	this.initialize = function(callback){
		if(!isInitialized){
			isInitialized = true;
			var that = this;
			this.sync(function(){
				// données par défaut si aucune donnée présente
				/*if(!data){
					data = settings.defaultData;
					Application.Parameters.set('data',data);*/
					if(typeof callback === 'function'){
						callback();
					}
				//}
			});
		}
	};
	
	/**
	* méthode de synchronisation de l'application
	* @param {function} successCalback (optional) : méthode à exécuter en cas de réussite de la synchronisation
	* @param {function} errorCalback (optional) : méthode à exécuter en cas d'échec de la synchronisation
	*/
	this.sync = function(successCallback, errorCallback){
		/*var method = function(result){
			data = result.data;
			if(result.success && successCallback){
				if(typeof successCallback === 'function'){
					successCallback();
				}else{
						throw 'SuccessCallback argument must be a function';
				}
			}else if(!result.success && errorCallback){
				if(typeof errorCallback === 'function'){
					errorCallback();
				}else{
						throw 'ErrorCallback argument must be a function';
				}
			}
		};
		if(!data){
			Application.Synchronizer.fetch(method);
		}else{
			//TODO récupération des modifications faites depuis dernière synchro
			Application.Synchronizer.sync(data,method);
		}*/
		if(data){
			Application.Parameters.set('data',data);
		}
		data = Application.Parameters.getObject('data');
		if(!data){
			data = settings.defaultData;
			Application.Parameters.set('data',data);
		}
		if(typeof successCallback === 'function'){
			successCallback();
		}
	};
	
	this.save = function(data2){
		if(data2){
			Application.Parameters.set('data',data2);
		}else{
			Application.Parameters.set('data',data);
		}
	}
	
	/**
	* Récupère une donnée du store
	* @param {string} key : clé de la donnée à récupérer
	*/
	this.get = function(key){
		if(key){
			return data[key];
		}else{
			return data;
		}
	};
	
	this.getKeys = function(){
		return _.keys(data);
	}
	
	/**
	* Modifie/Crée une donnée dans le store
	* @param {string} key : clée de la donnée
	* @param {object} value : valeur à donner à la donnée
	*/
	this.set = function(key,value){
		if(!data){
			data = {};
		}
		if(key){
			data[key] = value;
		}else{
			data = value;
		}
	}
};