Application.View.defineExtension('DefaultView',{
	/**
	* Default settings for the view
	*/
	settings : {
		container : 'body',
		autoRender : true
	},
	
	/**
	* refresh the view (and its subviews) by redrawing it
	* if beforeRefresh or afterRefresh are defined they will be called here
	*/
	refresh : function(){
		if(typeof this.beforeRefresh === 'function'){
			this.beforeRefresh();
		}
		
		this._doRefresh();
		this._createSubViews();
		this._bindEvents();
		
		//refresh des vues filles
		if(this.settings.subViews){
			for(var i in this.settings.subViews){
				this.settings.subViews[i].refresh();
			}
		}
		
		if(typeof this.afterRefresh === 'function'){
			this.afterRefresh();
		}
	},
	
	/**
	* private method applying the refresh action
	* this is the method to override when defining a new extension with a different way of redraw
	*/
	_doRefresh : function(){
		if(this.$view){
			this.$view.remove();
		}
		var data = this.settings.data ? this.settings.data : {};
		var container = this.settings.container ? this.settings.container : 'body';
		
		var view = this.settings.wrapper && this.settings.wrapper.before ? this.settings.wrapper.before : '';
		if(_.isArray(this.template)){
			for(var i in this.template){
				var templateCompiler =_.template(Application.Template.get(this.template[i]));
				view += templateCompiler({data : data[this.template[i]] ? {data : data[this.template[i]]} : {data : data}});
			}
		}else{
			var templateCompiler =_.template(Application.Template.get(this.template));
			view += templateCompiler({data : data});
		}
		view += this.settings.wrapper && this.settings.wrapper.after ? this.settings.wrapper.after : '';
		this.$view = $(view);
		this.$view.data('data',data);
		
		$(container).append(this.$view);
	},
	
	/**
	* private method called by the refresh action
	* this search for subviews in the current view and appendthem to the current one
	*/
	_createSubViews : function(){
		var views = Application.View.getDefinedViewsName();
		var that = this;
		for(var i in views){
			this.$view.find(views[i]).each(function(){
				var settings = {};
				settings.isTemplateSubView = true;
				settings.data = {};
				for(var j=0; j<this.attributes.length; j++){
					settings.data[this.attributes[j].name] = $(this).attr(this.attributes[j].name);
				}
				var subView = that.appendView(views[i],settings);
				subView.settings.parent._removeSubViewFromList(subView);
				$(this).replaceWith(subView.$view);
			});
		}
	},
	
	/**
	* private method called by the refresh
	* bind all events  defined in the view
	*/
	_bindEvents : function(){
		var touchEvents = {"mousedown":"touchstart","mouseup":"touchend","mousemove":"touchmove"};
	
		//méthode permettant d'appeler la méthode de callback dans le bon contexte et avec des arguments 
		//($element : l'élément du binding,  event : l'évènement qui a été lancé)
		var eventHandler = function(event){
			var $element = $(this);
			event.data.handler.call(event.data.obj, $element, event);
		};
		
		for(var selector in this.events){
			if(typeof this.events[selector] === 'string' || typeof this.events[selector] === 'function'){
				var eventType = '';
				var $selector = '';
				
				var tmp = selector.split(' ');
				if(tmp.length > 1){
					eventType = tmp.shift();
					$selector = this.$view.find(tmp.join(' '));
				}else{
					eventType = selector;
					$selector = this.$view;
				}
				if(Application.isMobile && touchEvents[eventType]){
					eventType = touchEvents[eventType];
				}
				if(typeof this.events[selector] === 'string'){
					$selector.bind(eventType,{handler : this[this.events[selector]], obj : this},eventHandler);
				}else{
					$selector.bind(eventType,{handler : this.events[selector], obj : this},eventHandler);
				}				
			}else{
				var $selector = this.$view.find(selector);
				if(selector === ''){
					$selector = this.$view;
				}
				
				for(var eventType in this.events[selector]){
					var event = this.events[selector][eventType];
					if(typeof this.events[selector][eventType] === 'string'){
						$selector.bind(eventType,{handler : this[event], obj : this},eventHandler);
					}else if(typeof this.events[selector][eventType] === 'function'){
						$selector.bind(eventType,{handler : event, obj : this},eventHandler);
					}
				}
			}
		}
	},
	
	/**
	* create the view for the first time
	* if beforeRender or afterRender functions are defined they will be called here
	* if animation is defined it will be called here
	*/
	render : function(){
		if(typeof this.beforeRender === 'function'){
			this.beforeRender();
		}
		this.refresh();
		if(this.settings.animation && this.settings.animation.open){
			if(typeof this.settings.animation.open === 'function'){
				this.settings.animation.open(this.$view);
			}else{
				var open = this.settings.animation.open;
				if(open.fromProperties){
					this.$view.css(open.fromProperties);
				}
				this.$view.animate( open.toProperties , open.duration, open.easing, open.callback );
			}
		}
		if(typeof this.afterRender === 'function'){
			this.afterRender();
		}
	},

	/**
	* make the view watch an Application Event
	* @param {string} event : event name
	* @param {function} handler : function to call when the event is triggered
	*/
	watch : function(event, handler){
		Application.watch(event, this, handler);
	},
	
	/**
	* make the view stops watching the Application Event
	* @param {string} event : event name
	* @param {function} handler : the function that was called when the event was triggered
	*/
	unwatch : function(event,handler){
		Application.unwatch(event, this, handler);
	},
	
	/**
	* Triggers a new Application Event
	* @param {string} event : event name
	*/
	trigger : function(event){
		Application.trigger(event);
	},
	
	/**
	* destroy the view and all its subviews,
	* if animation is defined it will be called here
	* if beforeDestroy method exists it will be called here
	*/
	destroy : function(){
		var that = this;

		//appel de la méthode beforeDestroy si elle existe
		if(typeof this.beforeDestroy === 'function'){
			this.beforeDestroy();
		}

		//suppression des vues filles
		if(this.settings.subViews){
			//on clone le tableau car celui-ci est modifié par la destruction des vues filles
			var subViews = _.clone(this.settings.subViews);
			for(var i in subViews){
				subViews[i].destroy();
			}
		}

		//suppression de la vue avec éventuelle animation
		if(this.settings.animation && this.settings.animation.close){
			if(typeof this.settings.animation.close === 'function'){
				this.settings.animation.close(this.$view,function(){
					that.$view.remove();
				});
			}else{
				var close = this.settings.animation.close;
				if(close.fromProperties){
					this.$view.css(close.fromProperties);
				}
				this.$view.animate( close.toProperties , close.duration, close.easing, function(){
					that.$view.remove();
					if(typeof close.callback === 'function'){
						close.callback
					}
				});
			}
		}else{
			this.$view.remove();
		}

		//suppression des listeners
		this.unwatch();
		
		if(this.settings.parent){
			this.settings.parent._removeSubViewFromList(this);
		}
	},
	
	/**
	* alias for destroy method
	*/
	remove : function(){
		this.destroy()
	},	

	/**
	* adds a subview to the current
	* @param {string} viewName : name of the subview definition
	* @param {json} options : options of the subview
	*/
	appendView : function(viewName,options){
		//ajout de la définition du parent dans les settings
		if(!options){
			options = {};
		}
		options.parent = this;
		var subView = Application.View.create(viewName,options);
		if(!this.settings.subViews){
			this.settings.subViews = {};			
		}
		this.settings.subViews[subView.uid] = subView;
		return subView;
	},
	
	/**
	* private method called by destroy
	* removes a subview from the current one
	* @param {object} subView : the subView to remove
	*/
	_removeSubViewFromList : function(subView){
		if(this.settings.subViews){
			delete this.settings.subViews[subView.uid];
		}
	},

});
