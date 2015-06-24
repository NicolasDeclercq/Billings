Application.View.defineExtension('Page',{
	extends : 'DefaultView',
	settings : {
		container : 'body',
		autoRender : true,
		animation : {
			'open' : {
				'fromProperties' : {'opacity' : 0.5, 'left' : '100%'},
				'toProperties' : {'opacity' : 1, 'left' : 0}
			},
			'close' : {
				'toProperties' : {'opacity' : 0.5, 'left' : '-100%'}
			}
		},
		wrapper : {
			before : '<div class="page">',
			after : '</div>'
		}
	},
	/**
	* correction pb css
	*/
	_resize : function(){
		//on met un timeout pour éviter de redimensionner trop de fois sur PC
		/*if(!this.resizing){
			this.resizing = true;
			var that = this;
			setTimeout(function(){
				var height = that.$view.parent().height() - that.$view.find('.header').outerHeight() - that.$view.find('.footer').outerHeight();
				that.$view.find('.main').height(height);
				$(window).on('resize',function(){
					that._resize.call(that);
				});	
				that.resizing = false;
			},100);	
		};*/
	},
	_doRefresh : function(){
		this.super._doRefresh.call(this); // call the super method keeping current context
		this._resize();
	},
	render : function(){
		if(this.settings.isRoot){
			this.settings.animation.open = null;
		}
		this.super.render.call(this);
	}

});