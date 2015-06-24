DateUtils = new function(){
	/**
	* Définition des clés de formats pour les dates
	*/
	var formats = {
		/**
		* Annnée sur 4 caractères
		*/
		'{YYYY}' : {toString : function(date){ return date.getFullYear();}, toDate : function(str, time){time.setFullYear(str);}},
		/**
		* Annnée sur 2 caractères
		*/
		'{YY}' :  {toString : function(date){ return (date.getFullYear()+'').substr(2,2);}, toDate : function(str, time){time.setFullYear('20'+str);}},
		/**
		*Mois en toutes lettres
		*/
		'{MMMM}' :  {toString : function(date){ return Application.Lang.get('default.date.months.'+date.getMonth()+'.long');}, toDate : function(str, time){
			var months = _.pluck(Application.Lang.getTranslations('default.date.months'),'long');
			time.setMonth(_.indexOf(months,str));
		}},
		/**
		* Mois abrégé en toutes lettres
		*/
		'{MMM}' :  {toString : function(date){ return Application.Lang.get('default.date.months.'+date.getMonth()+'.short');}, toDate : function(str, time){
			var months = _.pluck(Application.Lang.getTranslations('default.date.months'),'short');
			time.setMonth(_.indexOf(months,str));
		}},
		/**
		* Numéro du mois sur 2 chiffres
		*/
		'{MM}' :  {toString : function(date){ var month = date.getMonth()+1; return (month < 10 ? '0' : '')+month;}, toDate : function(str, time){time.setMonth(str - 1);}},
		/**
		* Numéro du mois sur 1 ou 2 chiffres
		*/
		'{M}' :  {toString : function(date){ return date.getMonth()+1;}, toDate : function(str, time){time.setMonth(str - 1);}},
		/**
		* Jour de la semaine en toute lettre
		*/
		'{DDDD}' :  {toString : function(date){ return Application.Lang.get('default.date.days.'+date.getDay()+'.long');}, toDate : function(str, time){}},
		/**
		* Jour de la semaine abrégé en toute lettre
		*/
		'{DDD}' :  {toString : function(date){ return Application.Lang.get('default.date.days.'+date.getDay()+'.short');}, toDate : function(str, time){}},
		/**
		* date du jour sur 2 chiffres
		*/
		'{DD}' :  {toString : function(date){ var day = date.getDate();return (day < 10 ? '0' : '')+day;}, toDate : function(str, time){time.setDate(str);}},
		/**
		* date du jour sur 1 ou 2 chiffres
		*/
		'{D}' :  {toString : function(date){ return date.getDate();}, toDate : function(str, time){time.setDate(str);}},
		/**
		* heure sur 2 chiffres (24h)
		*/
		'{hh}' :  {toString : function(date){ var hours = date.getHours(); return (hours < 10 ? '0' : '')+hours;}, toDate : function(str, time){time.setHours(str);}},
		/**
		* heure sur 1 ou 2 chiffres (24h)
		*/
		'{h}' :  {toString : function(date){ return date.getHours();}, toDate : function(str, time){time.setHours(str);}},
		/**
		* heure sur 2 chiffres (12h)
		*/
		'{HH}' :  {toString : function(date){ var hours = date.getHours();if(hours > 12){hours = hours -12} return (hours < 10 ? '0' : '')+hours;}, toDate : function(str, time){time.setHours(str);}},
		/**
		* heure sur 1 ou 2 chiffres (12h)
		*/
		'{HH}' :  {toString : function(date){ var hours = date.getHours();if(hours > 12){hours = hours -12} return hours;}, toDate : function(str, time){time.setHours(str);}},
		/**
		* période du jour (AM/PM)
		*/
		'{P}' :  {toString : function(date){ var hours = date.getHours();return hours < 12 ? 'AM' : 'PM';}, toDate : function(str, time){if(str === 'PM'){time.setHours(time.getHours()+12);}}},
		/**
		* minutes sur 2 chiffres
		*/
		'{mm}' :  {toString : function(date){ var minutes = date.getMinutes(); return (minutes < 10 ? '0' : '')+minutes;}, toDate : function(str, time){time.setMinutes(str);}},
		/**
		* minutes sur 1 ou 2 chiffres
		*/
		'{m}' :  {toString : function(date){ return date.getMinutes();}, toDate : function(str, time){time.setMinutes(str);}},
		/**
		* secondes sur 2 chiffres
		*/
		'{ss}' :  {toString : function(date){ var seconds = date.getSeconds(); return (seconds < 10 ? '0' : '')+seconds;}, toDate : function(str, time){time.setSeconds(str);}},
		/**
		* secondes sur 1 ou 2 chiffres
		*/
		'{s}' :  {toString : function(date){ return date.getSeconds();}, toDate : function(str, time){time.setSeconds(str);}},
		/**
		* millisecondes sur 2 chiffres
		*/
		'{SS}' :  {toString : function(date){ var milliSeconds = date.getMilliseconds(); return (milliSeconds < 10 ? '0' : '')+milliSeconds;}, toDate : function(str, time){time.setMilliseconds(str);}},
		/**
		* millisecondes sur 1 ou 2 chiffres
		*/
		'{S}' :  {toString : function(date){ return date.getMilliseconds();}, toDate : function(str, time){time.setMilliseconds(str);}},
	};

	/**
	* Formate la date en une chaine de caractères répondant aux format indiqué
	* @param {date} date : la date à convertir
	* @param {string} format : le format de sortie de la chaine de caractère
	* @return {string} 
	*/
	this.format = function(date, format){
		var str = format;
		for(var i in formats){
			str = str.replace(i,formats[i].toString(date));
		}
		return str;
	};
	
	/**
	* Reconverti une chaine de caractère représentant une date en une date
	* @param {string} string : la chaine à convertir
	* @param {string} format : le format utilisé sur la chaine
	*/
	this.toDate = function(string, format){
		var regexs = {
			extractText : /\{[a-z]+\}/i,
			extractData : /(\{[a-z]+\})/gi
		};
		var date = new Date();
		if(regexs.extractData.test(format)){
			//interprétation des données
			var text = format.split(regexs.extractText);
			var data = [];
			var formatData = format.match(regexs.extractData);
			
			var tmp = string;
			for(var i in text){
				var index = tmp.indexOf(text[i]);
				if(index > 0){
					data.push(tmp.substring(0,index));
				}
				tmp = tmp.slice(index+text[i].length,tmp.length);
			}
			if(tmp.length > 0){
				data.push(tmp);
			}
			
			//conversion des données
			
			// TODO : Ajout gestion correcte du flag '{P}' (AP/PM)
			
			for(var i in formatData){
				if(formats[formatData[i]] && data[i]){
					formats[formatData[i]].toDate(data[i],date);
				}
			}
		}
		
		return date;
	};

	/**
	* Formate la date en une chaine de caractères utilisant un format défini dans le fichier de langue
	* @param {date} date : date à convertir
	* @param {string} formatKey : clé défini dans le fichier de langue
	* <example>
	*	DateUtils.localFormat(new Date(),'default.format.word_date.long');
	*	// renvoi quelque chose ressemblant à : 'Samedi 1 Janvier 2015' (si la langue française est la langue courante)
	* </example>
	*/
	this.localFormat = function(date,formatKey){
		var fmt = Application.Lang.get(formatKey);
		return this.format(date,fmt);
	};
	
	/**
	* Formate la date en une chaine de caractères utilisant un format défini dans le fichier de langue
	* @param {date} date : la date à formatter
	* @param {boolean} isInFullWords (optionel) : défini si la date doit être sous format numérique (default) ou textuel
	* @param {boolean} isLong (optionel): défini si la date doit être au format court (default) ou long
	*/
	this.localDateFormat = function(date, isInFullWords, isLong){
		var tmp = 'default.formats.'+(isInFullWords ? 'word_date' : 'number_date')+'.'+(isLong ? 'long' : 'short');
		var fmt = Application.Lang.get(tmp);
		return this.format(date,fmt);
	};
	
	/**
	* Formate la date en une chaine de caractères utilisant un format défini dans le fichier de langue
	* @param {date} date : la date à convertir
	* @param {boolean} isLong (optionel): défine si la date doit utiliser le format court (default) ou long
	*/
	this.localHourFormat = function(date, isLong){
		var tmp = 'default.formats.hour'+(isLong ? 'long' : 'short');
		var fmt = Application.Lang.get(tmp);
		return this.format(date,fmt);
	};
};