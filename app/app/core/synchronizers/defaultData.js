Application.Synchronizer.define('DefaultData',new function(){
	this.sync = function(data, date, callback){
		if(callback && typeof callback === 'function'){
			var date = DateUtils.dateToNumber(new Date());
			callback({
				success : true, 
				date: date, 
				data : config.defaultData
			});
		}
	};
});