/**
* Définition des vues de type Dialog
* if a method named 'beforeClose' exists it will be called before the view is closed via the click on overlay
* 	if it returns false the close will not happen
*/
Application.View.defineExtension('Dialog',{
	extends : 'DefaultView',
	settings : {
		container : 'body',
		autoRender : true,
		animation : {
			'open' : function($view){
				$view.filter('.overlay').css({'opacity' : 0});
				$view.filter('.dialog').css({'top' : '-100%'});
				var height = ($view.filter('.overlay').innerHeight() - $view.filter('.dialog').outerHeight()) / 2;
				$view.filter('.overlay').animate({'opacity' : 1});
				$view.filter('.dialog').animate({'top' : height});
			},
			'close' : function($view,callback){
				$view.filter('.overlay').animate({'opacity' : 0});
				$view.filter('.dialog').animate({'top' : '-100%'},callback);
			}
		},
		wrapper : {
			before : '<div class="overlay"></div><div class="dialog">',
			after : '</div>'
		}
	},
	_doRefresh : function(){
		this.super._doRefresh.call(this); // call the super method keeping current context

		var cid = _.uniqueId();
		this.$view.attr('id', cid);
		var that = this;
		this.$view.click(function(e){
			if($(e.target).hasClass('overlay')){
				if(typeof that.beforeClose === 'function'){
					var result = that.beforeClose();
					if(result !== false){
						if(typeof that.settings.cancelCallback === 'function'){
							that.settings.cancelCallback();
						}
						that.remove();
					}
				}else{
					if(typeof that.settings.cancelCallback === 'function'){
						that.settings.cancelCallback();
					}
					that.remove();
				}
			}
		});
	}
});