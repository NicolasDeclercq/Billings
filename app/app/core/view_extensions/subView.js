/**
* A Sub-View does not have any template but it is associated to an element from its parent View
* to attach the element to the sub-view you must define the selector property in the view definition
* <example>
*	Application.View.define('mySubView',{
*	'extends' : 'SubView',
*	'selector' : '#mySubViewSelector'
*	});
* </example>
*
* Because they are rendered by their parent they must be created after the parent has been rendered
*
*/
Application.View.defineExtension('SubView',{
	extends : 'DefaultView',
	
	_doRefresh : function(){
		if(this.settings.isTemplateSubView){
			this.super._doRefresh.call(this); // call the super method keeping current context
		}else{
			//no refresh needed : done by the parent
			
			// récupération de l'élément depuis la vue parente
			this.$view = this.settings.parent.$view.find(this.selector);
			//ajout des éventuels wrappers
			if(this.settings.wrapper){
				var view = '';
				if(this.settings.wrapper.before){
					view += this.settings.wrapper.before;
				}
				view +=$('<div>').append(this.$view.clone()).html();
				if(this.settings.wrapper.after){
					view += this.settings.wrapper.after;
				}
				var elem = $(view);
				this.$view.replaceWith(elem);
				this.$view = elem;
			}
		}
	}

});