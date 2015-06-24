Application.Synchronizer.define('LocalStorage',new function(){
	this.sync = function(data, date, callback){
		// TODO modifier pour avoir une vrai méthode de synchro
		Application.Parameters.set('data',data);
		if(callback && typeof callback === 'function'){
			var date = DateUtils.dateToNumber(new Date());
			callback({
				success : true, 
				date: date, 
				data : Application.Parameters.getObject('data')
			});
		}
	};
});