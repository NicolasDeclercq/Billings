/**
* Définition des modèles de l'application : 
*	@param {string} model name
*	@param {json} attributes definition
*		{
*			@param {string} 'attribute name' : {
*				@param {string} type [optional] : type de données [string (default),date, numeric, other model name]
*				@param {defined type} default [optional] : valeur par défaut
*				@param {function} validation [optional] : méthode de validation de la donnée (return true/false) (@see Application.Validation)
*				@param {string} localStorageName [optional] : nom de sauvegarde local (par défaut on prend le nom de l'attibut)
*				@param {string} distantStorageName [optional] : nom de sauvegarde distant (par défaut on prend le nom de l'attibut)
*				@param {boolean/string} crypt [optional] : si true utilise le cryptage par défaut de l'application, si {string} nom du cryptage à utiliser
*				@param {enum['one','many'] / json} relation [optional] : /!\ n'est pris en compte que si le type correspond au nom d'un model, défini le type de relation entre les deux models (default many)
*					{
*						@param {enum['one','many']}	type [optional] : type de la relation (default 'many')
*						@param {json} localStorageName [optional] : nom de sauvegarde local (par défaut on prend le nom de chaque model séparé par un tiret (currentModel_childModel))
*							{
*								@param {string} modelName [optional] : nom de sauvegarde du modèle
*								@param {string} id_parent [optional] : nom de sauvegarde de l'identifiant du modèle courant
*								@param {string} id_child [optional] : nom de sauvegarde de l'identifiant du modèle de la relation
*							}
*						@param {json} distantStorageName [optional] : nom de sauvegarde distant (par défaut on prend le nom de chaque model séparé par un tiret (currentModel_childModel))
*							{
*								@param {string} modelName [optional] : nom de sauvegarde du modèle
*								@param {string} id_parent [optional] : nom de sauvegarde de l'identifiant du modèle courant
*								@param {string} id_child [optional] : nom de sauvegarde de l'identifiant du modèle de la relation
*							}
*					}	
*			}
*		}
*	@param {json} options [optional]
*		{
*				@param {string} localStorageName [optional] : nom de sauvegarde local (par défaut on prend le nom du model)
*				@param {string} distantStorageName [optional] : nom de sauvegarde distant (par défaut on prend le nom du model)
*		}
*	<example>
*	Application.Model.define('model',{
*		'id' : 'uid',
*		'name' : {type : 'string', default : 'No name', validation : Application.Validation.notNull, localStorageName : 'mdl_name', distantStorageName : 'bdd_mdl_name', crypt : true},
*		'date' : {type : 'date', default : 'currentTimestamp', validation : function(){ ... }},
*		'child' : {type : 'modelChildName', relation : 'many'}
*	},{
*		localStorageName : 'mdl', 
*		distantStorageName : 'bdd_mdl'
*	});
*	</example>
*/
Application.Model = new function(){
	var models = {};
	var relations = {
		'one' : 'one',
		'many' : 'many'
	}
	
	this.Types = {	// TODO
		'uid' : {},
		'string' : {},
		'numeric' : {},
		'date' : {},
	};
	
	/**
	* Défini le modéle passé en paramètre
	* @param {string} modelName : nom du modèle
	* @param {json} definition : définition de modèle
	* @param {json} options [optional] : options du modèle
	* @see Appplication.Model
	*/
	this.define = function(modelName,definition,options){
		if(!models[modelName]){
			models[modelName] = {definition : definition, options : options};
			//recherche de relations many pour construire un model relationel
			for(var i in definition){
				var obj = definition[i];
				if(typeof obj === 'string'){
					obj = {type : obj};
				}
				if(!_.has(Application.Model.Types, obj.type) && (!obj.relation || obj.relation === relations.many || obj.relation.type === relations.many)){
					var opts = {};
					var def = {};
					def['id_'+modelName] = {type : 'uid'};
					def['id_'+obj.type] = {type : 'uid'};
					
					if(obj.relation && obj.relation && obj.relation.localStorageName){
						if(obj.relation.localStorageName){
							if(obj.relation.localStorageName.modelName){
								opts.localStorageName = obj.relation.localStorageName.modelName;
							}
							if(obj.relation.localStorageName.id_parent){
								def['id_'+modelName].localStorageName = obj.relation.localStorageName.id_parent;
							}
							if(obj.relation.localStorageName.id_child){
								def['id_'+obj.type].localStorageName = obj.relation.localStorageName.id_child;
							}
						}
					}
					if(obj.relation && obj.relation && obj.relation.distantStorageName){
						if(obj.relation.distantStorageName){
							if(obj.relation.distantStorageName.modelName){
								opts.distantStorageName = obj.relation.distantStorageName.modelName;
							}
							if(obj.relation.distantStorageName.id_parent){
								def['id_'+modelName].distantStorageName = obj.relation.distantStorageName.id_parent;
							}
							if(obj.relation.distantStorageName.id_child){
								def['id_'+obj.type].distantStorageName = obj.relation.distantStorageName.id_child;
							}
						}
					}
					this.define(modelName+"_"+obj.type, def,opts);
				}
			}
		}else{
			throw 'A model with '+modelName+' as name already exists';
		}
	};
	
	this.get = function(modelName){
		return models[modelName];
	};
	
	/**
	* Create an object of a model type
	* @param {string} modelName : nom du modéle de l'objet à créer
	* @param {json} values : values of the object to create
	* @return {object} the created object
	*/
	this.create = function(modelName, values){
		if(!models[modelName]){
			throw 'Model with name \''+modelName+'\' does not exist';
		}
		if(!values){
			values = {};
		}
		var obj = new Application.Object();
		for(var i in models[modelName].definition){
			var attr = models[modelName].definition[i];
			var value = null;
			if(attr.type && !_.has(this.Types, attr.type) && (!attr.relation || attr.relation === relations.many || attr.relation.type === relations.many)){
				value = new Application.Array();
				if(typeof values[i] !== 'undefined'){
					for(var j in values[i]){
						var tmp =Application.Model.create(attr.type,values[i][j]);
						value.add(tmp);
					}
				}
			}else if(attr.type && !_.has(this.Types, attr.type) && (attr.relation === relations.one || attr.relation.type === relations.one)){
				value = Application.Model.create(attr.type,values[i]);
			}else if(typeof values[i] !== 'undefined'){
				value = values[i];
			}else if(attr.default){
				value = attr.default;
			}
			obj.add(i,value);
		}
		return obj;		
	}
};