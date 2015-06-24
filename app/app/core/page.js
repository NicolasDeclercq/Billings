Application.Page = new function(){
	var pages = {};
	var currentPage = null;

	this.define = function(pageName,definition){
		if(!pages[pageName]){
			pages[pageName] = definition;
			if(!definition.settings){
				definition.settings = {};
			}
			if(!definition.settings.animation){
				definition.settings.animation = {
					'open' : {
						'fromProperties' : {'opacity' : 0, 'left' : '100%'},
						'toProperties' : {'opacity' : 1, 'left' : 0}
					},
					'close' : {
						'toProperties' : {'opacity' : 0, 'left' : '-100%'}
					}
				};
			}
			Application.View.define('page_'+pageName,definition);
		}else{
			throw 'The page with the name : "'+pageName+'" already exists';
		}
	};
	
	this.navigate = function(pageName,settings){
		if(pages[pageName]){
			if(currentPage){
				currentPage.remove();
			}
			if(pages[pageName].controller){
				Application.Controller.activate(pages[pageName].controller,settings);
			}
			currentPage = Application.View.create('page_'+pageName,{'onInitialize' : pages[pageName].onInitialize});
		}else{
			throw 'Page with name : "'+pageName+'" does not exist';
		}
	};
};