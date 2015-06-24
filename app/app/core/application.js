/**
* Namespace pour toutes les fonctionalités de l'application
*/
Application = new function(){
	/**
	* Etat d'initialisation de l'application elle peux posséder les valeurs suivantes :
	*	_ null	=> valeur par défaut l'application n'est pas lancée
	*	_ initializing => l'application est lancée et est en train de procéder aux différentes étapes d'initialisation
	*	_ ready => l'application est prête à l'emploi
	*/
	var state = null;
	
	/**
	* tableau contenant les fonctions à lancer lorsque l'application est prête
	*/
	var readyCallbacks = [];

	/**
	* évenements pouvant être lancés par phonegap
	*/
	var deviceEvents = [
		/*'pause',
		'resume',
		'backbutton',
		'menubutton',
		'searchbutton',
		'startcallbutton',
		'endcallbutton',
		'volumedownbutton',
		'volumeupbutton'*/
	];
	
	this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	
	if(settings.mode === 'debug'){
		$('body').append('<div class="console"><div class="grab"></div><div class="content"></div></div>');
		$(".console .grab").click(function(){
			if(!$(this).data('visible')){
				$(this).data('visible',true);
				$(this).parent().animate({bottom : 0});
			}else{
				$(this).data('visible',false);
				$(this).parent().animate({bottom : - $(this).parent().height()});
			
			}
		});
		var _console = {
			log : console.log,
			info : console.info,
			warn : console.warn,
			error : console.error,
		};
		var consoleOverride = function(args,type){
			var value = "";
			var counter=0;
			for(var i in args){
				if(counter>0){
					value+=' ';
				}
				value+= args[i];
				counter++;
			}
			if(type === 'error'){
				$(".console .grab").data('type','error');
				$(".console .grab").addClass('red');
				$(".console .grab").removeClass('amber');
				$(".console .grab").removeClass('blue');
			}else if(type === 'warn' && $(".console .grab").data('type') !== 'error'){
				$(".console .grab").data('type','warn');
				$(".console .grab").addClass('amber');
				$(".console .grab").removeClass('blue');
			}else if(type === 'info' && $(".console .grab").data('type') !== 'error' && $(".console .grab").data('type') !== 'warn'){
				$(".console .grab").data('type','info');
				$(".console .grab").addClass('blue');
			}
			
			$('.console .content').prepend('<div class="'+type+'"> '+value+'</div>');
		}
		console = {
			log : function(){consoleOverride(arguments,'log');},
			info : function(){consoleOverride(arguments,'info');},
			warn : function(){consoleOverride(arguments,'warn');},
			error : function(){consoleOverride(arguments,'error');}
		};
		window.onerror = function(errorMsg, url, lineNumber) {
			console.error('Exception (line '+lineNumber+') :'+errorMsg+' '+url);
			return true;
		};
	}
	
	var currentPage = null;
	
	var listeners = {};
	
	/**
	* initialisation de l'application
	*/
	var init = function(){
		var that = this;
		state = 'initializing';
		
		var initialize = function(){
			$(document).ready(function(){
				Application.load(resources,function(){
					//Application.Store.initialize(function(){
						state = 'ready';
						for(var i in readyCallbacks){
							readyCallbacks[i].call(Application);
						}
					//});
					for(var i in deviceEvents){
						document.addEventListener(deviceEvents[i],that.trigger,false);
					}
				});
			});
		};
		
		if(Application.isMobile){
			document.addEventListener("deviceready", initialize,false);
		}else{
			initialize();
		}
		
	};

		
	this.load = function (scripts, callback) {
		var next = function(){
			scripts.splice(0,1);
			if(scripts.length > 0){
				console.info('Load : ',scripts[0]);
				writeScript(scripts[0],next);
			}else if(typeof callback === 'function'){
				console.info('all files loaded');
				callback.call(Application);
			}else{
				console.info('all files loaded (no callback)');
			}
		};
		
		var writeScript = function (src,clbk) {
			var s = document.createElement('script');
			s.type = "text/javascript";
			s.async = true;
			s.src = src;
			s.addEventListener('load', function (evt) {
				if (typeof clbk == 'function'){ 
					clbk.call(Application);
				}
			}, false);
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(s);
		};
		if(typeof scripts === 'string'){
			scripts = [scripts];
		}
		next();
	};
	
	/**
	* défini une action à réaliser lorsque l'application sera prête
	* @param {function} callback : action à lancer
	*/
	this.ready = function(callback){
		$('.loader').remove();
		if(callback && typeof callback !== 'function'){
			throw 'Callback argument must be a function';
		}
		
		if(state === 'ready'){
			callback.call(Application);
		}else if(callback){
			readyCallbacks.push(callback);
			if(state !== 'initializing'){
				init();
			}
		}	
	}

	/**
	* navigue vers une nouvelle page
	* la vue doit étendre le type Page
	*/
	this.navigate = function(viewName,settings){
		if(!settings){
			settings = {};
		}
		settings.isRoot = false;
		if(currentPage){
			currentPage.remove();
		}else{
			settings.isRoot = true;
		}
		currentPage = Application.View.create(viewName,settings);
		if(!currentPage.settings.autoRender){
			currentPage.render();
		}
	}
	
	/**
	* Add a listener to an event
	* @param {string} eventName : the event to listen to
	* @param {object} obj : the listening element
	* @param {function} handler : the function to call when the event is triggered
	*/
	this.watch = function(eventName, obj, handler){
		if(typeof handler !== 'function'){
			throw 'Event handler must be a function';
		}

		if(!listeners[eventName]){
			listeners[eventName] = {};
		}
		if(!listeners[eventName][obj]){
			listeners[eventName][obj] = [];		
		}		
		listeners[eventName][obj].push(handler);
	}
	this.unwatch = function(eventName,obj,handler){
		if(eventName){
			if(listeners[eventName] && listeners[eventName][obj]){
				if(handler){
					listeners[eventName][obj].splice(_.indexOf(listeners[eventName][obj],handler),1);
				}else{
					delete listeners[eventName][obj];
				}
			}
		}else{
			for(var eventName in listeners){
				this.unwatch(eventName,obj,handler);
			}
		}
	}
	this.trigger = function(eventName){
		if(eventName){
			if(typeof eventName !== 'string'){
				eventName = eventName.type;
			}	
			for(var obj in listeners[eventName]){
				for(var handler in listeners[eventName][obj]){
					$.proxy(listeners[eventName][obj][handler],obj);
					listeners[eventName][obj][handler]();
				}
			}
		}
	}
};