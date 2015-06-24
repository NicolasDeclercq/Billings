Application.View.define('cyclePage',{
	'extends' : 'Page',
	'template' : 'cyclePageTemplate',
	
	'settings' : {
		'data' : {
			'cycleDays' : [
				{
					'date' : DateUtils.toDate('04/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'red',
					'cell' : ['X','','','','4 Juin','','hum','','etir']
				},
				{
					'date' : DateUtils.toDate('05/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'red',
					'cell' : [0,1,2,3,4,5,6,7,8]
				},
				{
					'date' : DateUtils.toDate('06/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'red',
					'cell' : [0,1,2,3,4,5,6,7,8]
				},
				{
					'date' : DateUtils.toDate('07/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'red',
					'cell' : [0,1,2,3,4,5,6,7,8]
				},
				{
					'date' : DateUtils.toDate('08/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'white',
					'cell' : [0,1,2,3,4,5,6,7,8]
				},
				{
					'date' : DateUtils.toDate('09/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'white',
					'cell' : [0,1,2,3,4,5,6,7,8]
				},
				{
					'date' : DateUtils.toDate('10/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'white',
					'cell' : [0,1,2,3,4,5,6,7,8]
				},
				{
					'date' : DateUtils.toDate('11/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'yellow',
					'cell' : [0,1,2,3,4,5,6,7,8]
				},
				{
					'date' : DateUtils.toDate('12/06/2015','{DD}/{MM}/{YYYY}'),
					'color' : 'green',
					'cell' : [0,1,2,3,4,5,6,7,8]
				}				
			]
		}
	},
	
	'onInitialize' : function(){
		var startDay = new Date().getDay();
		if(this.settings.data.cycleDays){
			startDay = this.settings.data.cycleDays[0].date.getDay();
		}
		this.settings.data.days = [];
		for(var i=0; i < 7; i++){
			var day = i + startDay < 7 ? i + startDay :  i + startDay - 7;
			this.settings.data.days.push(Application.I18n.get("default.date.days."+day+".short"));
		}
		
		for(var i in this.settings.data.cycleDays){
			var current = this.settings.data.cycleDays[i];
			this.appendView('dayView',{container : 'main .cycle', data : current});
		}
		this.appendView('dayView',{container : 'main .cycle',data : {cell:[]}});
	}
});