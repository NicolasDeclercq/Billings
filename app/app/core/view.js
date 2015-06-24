/**
* Defines a view in the application
* the view can then be created like this : var myView = Application.View.create('viewDefinitionName');
*	@param {string} viewName : name of the view definition, you'll access it by this name later on
*	@param {object} definition : the definition of the view
* when created you will be able to access this list of methods:
*	_ render : display the view (triggered automatically on creation if autoRender setting is set)
*	_ refresh : refresh the view by redrawing it
*	_ destroy : remove the view from the screen
*	_ remove : alias of destroy
*	_ appendView : append a sub-view to the current view
*
*	other methods will be created but should not be called directly as they are directly managed by the application:
*	/!\	those methods should not be overwritten
*	_ _doRefresh :  make the refresh of the view (called between beforeRefresh and afterRefresh)
*	_ _bindEvents : add the event listeners to the view (called by _doRefresh)
*	_ _removeSubViewFromList : remove the subView from its parent list (called by destroy/remove)
*
* you can access the settings of the view via the settings property
* you can access the data of the view through settings.data or data directly
*
* when rendered the DOM element of the view can be retrieved via $view
*
* Application.View.define('viewDefinitionName',{
*
*	////
*	// type of the views
*	////
*	extends (optional) : 'Page' => the view type (Page / Dialog / DefaultView (default))
*
*	//// 
*	// template name for the view
*	////
*	templates :  'templateName1',
*	
*	//// 
*	// list of events handled by the view:
*	//
*	// events : {
*	//	'selector' : { // you can access the view element by setting an empty string ( '' ) has a selector
*	//		'eventName1' : 'handlerFunctionName',	//handler can be a function name defined later in the view or a function definition
*	//		'eventName2' : function(){
*	//			...
*	//		},
*	//		...
*	//	},
*	//	'eventName3 selector2' : 'handlerFunctionName' // you can also declare an event by giving the eventName then separated by à ' ' (space) declaring your selector
*	//	'eventName4 selector3' : : function(){
*	//			...
*	//	},
*	//	...
*	// }
*	////
*	events (optional): {
*		'' : {
*			'click' : 'onClick'
*		},
*		'selector' : {
*			'click' : function(){
*			
*			}
*		},
*		'click header .title' : function(){
*			alert('You clicked on the header title');
*		}
*	},
*	
*	//// 
*	// default settings
*	////
*	settings (optional): {
*		container : 'body',
*		autoRender : true,
*		data : null,
*		animation (no default settings) : {
*			open (optional) : { // it can be a function if you want a custom animation
*				fromProperties (optional) : {json},
*				toProperties : {json},
*				duration (optional): {int},
*				easing (optional) : {string},
*				callback (optional) : {function},
*			},
*			close (optional): {// it can be a function if you want a custom animation
*				fromProperties (optional) : {json},
*				toProperties : {json},
*				duration (optional): {int},
*				easing (optional) : {string},
*				callback (optional) : {function},
*			}
*		}
*	},
*
*	////
*	// triggered after new instance creation
*	////
*	onInitialize : function(){
*		...
*	},
*
*	////
*	// triggered before the view is destroyed ( myView.destroy() )
*	////
*	beforeDestroy : function(){
*		...
*	},
*	
*	////
*	// triggered before each refresh of the view
*	////
*	beforeRefresh : function(){
*	
*	},
*	
*	////
*	// triggered after each refresh of the view
*	////
*	afterRefresh : function(){
*	
*	},
*	////
*	// triggered before each render of the view
*	////
*	beforeRender : function(){
*	
*	},
*	
*	////
*	// triggered after each refresh of the view
*	////
*	afterRender : function(){
*	
*	},	
*	
*	////
*	// view function definition
*	// can be called from events definition
*	// or by templates on rendering
*	////
*	onClick : function(){
*	
*	}
* });
*
* // Options definition
* var options = {
*	container : 'myViewContainer', // container for the created view (all templates without a defined container will be rendered there)
*	bindData : false, //override settings
* };
*
* var myView = Application.View.create('viewDefinitionName');
* // create the view with specific options
* var myCustomView = Application.View.create('viewDefinitionName', options);
*
* <example>
*	Application.View.define('myView',{
*		'template' : 'myTemplate',
*		'settings' : {
*			autoRender : false
*		}
*	});
*
*	var myViewInstance = Application.View.create('myView',{container : 'main'});
*	myViewInstance.render();
* </example>
*/
Application.View = new function(){
	/**
	* Classe par défaut de la vue
	*/
	var defaultExtension = 'DefaultView';
	
	/**
	* définitions des différents type de vues
	*/
	this.Extensions = {};
	
	/**
	* list of defined views
	*/
	var _views = {};

	/**
	* define a view configuration to the application
	* @param {string} viewName : name of the view definition
	* @param {object} definition : configuration of the view
	* @see Application.View
	*/
	this.define = function(viewName, definition){
		if(!_views[viewName]){
			_views[viewName] =  definition;
		}else{
			throw viewName+' already exists'; 
		}
	};
	
	/**
	* Récupère la liste des vues défini
	* @return {array[string]}
	*/
	this.getDefinedViewsName = function(){
		return _.keys(_views);
	};
	
	/**
	* creates a new view
	* @param viewName : definition name of the view
	* @param options : list of options passed to the view (they will be accessible in the view via the settings property)
	*/
	this.create = function(viewName,options){
		if(_views[viewName]){
			var extension = _views[viewName].extends ? _views[viewName].extends : defaultExtension;
			if(!Application.View.Extensions[extension]){
				throw 'No view type with name '+extension+' exists';
			}
			var view = new Application.View.Extensions[extension].obj();
			
			//deep extend de la vue pour rajouter le paramètrage, les données par défaut et la definition de la vue
			view = $.extend(true, view, Application.View.Extensions[extension].defaults, _views[viewName], {settings : options, name : viewName, uid :  _.uniqueId()});
			if(!view.settings.data){
				view.settings.data = {};
			}
			//set the view controller
			if(view.controller){
				var ctrlr = Application.Controller.getCurrent();
				if(!ctrlr || view.controller !== ctrlr.name){
					Application.Controller.activate(view.controller);
					ctrlr = Application.Controller.getCurrent();
				}
				if(!ctrlr || view.controller !== ctrlr.name){
					throw 'The controller with name '+view.controller+' has not been found';
				}
				view.controller = ctrlr;
			}
			
			if(typeof view.onInitialize === 'function'){
				view.onInitialize();
			}
			
			if(view.settings.autoRender === true){
				view.render();
			}
			return view;
		}else{
			throw 'No view with name : "'+viewName+'" is defined';
		}
	};

	/**
	* Défini une nouvelle classe de vues
	* @param extensionName : nom de la classe
	* @param definition : définition de la classe
	*/
	this.defineExtension = function(extensionName, definition){
		if(!Application.View.Extensions[extensionName]){
			Application.View.Extensions[extensionName] = {};
			Application.View.Extensions[extensionName].obj = function (){};
			Application.View.Extensions[extensionName].defaults = {};

			if(definition.extends){
				Application.View.Extensions[extensionName].obj.prototype.super = {};
				if(Application.View.Extensions[definition.extends]){
					for(var i in Application.View.Extensions[definition.extends].obj.prototype){
						Application.View.Extensions[extensionName].obj.prototype[i] = Application.View.Extensions[definition.extends].obj.prototype[i];
						Application.View.Extensions[extensionName].obj.prototype.super[i] = Application.View.Extensions[definition.extends].obj.prototype[i];
					}
				}
				Application.View.Extensions[extensionName].defaults.settings =  Application.View.Extensions[definition.extends].defaults.settings;
			}
			for(var i in definition){
				if(typeof definition[i] === 'function'){
					Application.View.Extensions[extensionName].obj.prototype[i] = definition[i];
				}else{
					//les données ne sont rajouté qu'à la création sur l'objet créé
					Application.View.Extensions[extensionName].defaults[i] = definition[i];
				}
			}
		}else{
			throw 'View extension with name : '+extensionName+' already exists';
		}
	};
}();