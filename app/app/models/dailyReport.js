Application.Model.define('dailyReport',{
	'date' : {type:'date',default: new Date()},
	'sensation' : {},
	'observation' : {},
	'temperature' : {},
	'particularite' : {},
	'couleur' : {default : 'white'},
	'notes' : {}
});