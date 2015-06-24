/**
* Gestionnaire de Synchronisation de l'application
*/
Application.Synchronizer = new function(){
	/**
	* List des synchornizers définis
	*/
	var synchronizers = {};

	/**
	* Flag permettant de savoir si une synchronization est en cour
	*/
	var isSynchronizing = false;
	
	/**
	* Permet de définir un synchronizer
	* Celui-ci doit être un objet comportant une méthode sync() accessible
	* prenant en paramètre : 
	*	_ les données à envoyer
	*	_ la date de dernière synchronisation (afin de pouvoir récupérer les éventuelles modification faites entre temps)
	*	_ une éventuelle fonction de callback appelée lorsque la tâche est terminée
	*		cette méthode de callback sera appelée avec un objet en paramètre défini comme suit : 
	*			{
	*				success : {boolean},			=> true pour un succés de synchronisation, false dans le cas contraire
	*				data : {object}, 				=> la réponse de la synchro (les données à mettre à jour dans l'application)
	*				message : {string} (optional)	=> le message d'erreur en cas de problème
	*				date : {date('YYYYMMDDhhmmss')} => date de synchronisation
	*			}
	* @throws error : erreur lors de la définition du synchronizer
	*/
	this.define = function(name, instance){
		if(typeof instance.sync !== 'function'){
			throw 'Error in synchronizer definition, your synchronizer must implement the sync method';
		}
		if(synchronizers[name]){
			throw 'Error the synchronizer '+name+' already exists';
		}
		synchronizers[name] = instance;
	};
	
	/**
	* Exécute la synchronisation des données (si une synchronisation est déjà en cours cette action est annulée)
	* @param {json} data : les données modifiées à renvoyer au serveur
	* @param {string} synchronizerName: nom du synchronizer à appeler
	* @param {string} lastSynchronizationDate: date de dernière synchronisation
	* @param  {function} callback : méthode appelée à la fin de la synchronisation (le résultat est passé en paramètre)
	*	@see Application.Synchronizer.define
	*
	* @throws exception : erreur de configuration du synchornizer par défaut ou du nommage du synchronizer à utiliser
	*/
	var _sync = function(data, synchronizerName, lastSynchronizationDate,callback){
		if(!isSynchronizing){
			isSynchronizing = true;
			
		
			if(!settings.synchronizer){
				throw 'Error no synchronizer defined in configuration';
			}
			if(typeof synchronizers[synchronizerName] !== 'object'){
				console.log(synchronizers,typeof synchronizers[synchronizerName]);
				throw 'Error the defined synchronizer in configuration does not exist (\''+settings.synchronizer+'\')';
			}
			synchronizers[synchronizerName].sync(data, lastSynchronizationDate ,function(result){
				isSynchronizing = false;
				if(typeof callback === 'function'){
					callback(result);
				}
			});
		}
	};

	/**
	* lance la synchronisation des données
	* @param {object} data : les données modifiées depuis la dernière synchornisation
	* @param {string} synchronizerName (optional): nom du synchronizer à appeler
	* @param {function} callback : action à réaliser une fois la synchronisation terminée
	*	@see Application.Synchronizer.define
	*/
	this.sync = function(data,callback){
		var lastSynchronizationDate = Application.Parameters.get('lastSynchronizationDate');
		var synchronizerName = settings.synchronizer;
		//gestion du paramètre de nom du synchornizer à exécuter
		if(arguments.length > 2){
			synchronizerName = callback;
			callback = arguments[2];
		}
		_sync(data, synchronizerName, lastSynchronizationDate, function(result){
			//sauvegarde de la date de dernière synchronisation
			Application.Parameters.set('lastSynchronizationDate',result.date);
			if(typeof callback === 'function'){
				callback(result);
			}
		});
	}
	
	/**
	* récupère les données de l'application
	* @param {string} synchronizerName (optional): nom du synchronizer à appeler
	* @param {function} callback : action à réaliser une fois la synchronisation terminée
	*	@see Application.Synchronizer.define
	*/
	this.fetch = function(callback){
		var synchronizerName = settings.synchronizer;
		//gestion du paramètre de nom du synchornizer à exécuter
		if(arguments.length > 1){
			synchronizerName = callback;
			callback = arguments[1];
		}
		_sync(null, synchronizerName, null, callback);
	};
};