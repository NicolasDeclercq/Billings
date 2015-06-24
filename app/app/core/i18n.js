/**
 * Module de gestion des langues du système
 *
 * la langue par défaut est initialisée depuis les paramètres : Application.Parameters.get("lang")
 * si le parmaètre n'existe pas alors on récupère la valeur de configuration : settings.defaultLanguage
 */
Application.I18n = new function() {
    var currentLanguage = null;
    var _languages = {};
	var _languagesRow = {};
    var _languagesNames = {};

    if (Application.Parameters.get("i18n")) {
        currentLanguage = Application.Parameters.get("i18n");
        //Application.load("app/i18n/"+currentLanguage+".js");
        //Application.load("app/i18n/"+settings.defaultLanguage+".js");
    } else {
        currentLanguage = settings.defaultLanguage;
        //Application.load("app/i18n/"+settings.defaultLanguage+".js");
    }

    this.getCurrentLanguage = function() {
        return currentLanguage;
    };

    /**
     * Permet de modifier la langue utilisée dans l'application (la valeur est automatiquement sauvegardée)
     * @param language : langue à mettre par défaut ("fr", "en", etc.)
     */
    this.changeLanguage = function(language) {
        if (currentLanguage !== language) {
            _languages[currentLanguage] = null;
            if (language !== settings.defaultLanguage) {
				//Application.load("app/i18n/"+language+".js");
            }
            currentLanguage = language;
            Application.Parameters.set("i18n", language);
        }
        console.info(currentLanguage);
        Application.refresh();
    }

    /**
     * Ajoute les traductions d'une langue au dictionnaire
     * @param code : code de la langue
     * @param fullName : nom de la langue
     * @param data : liste des traductions sous la forme de clé valeurs
     *<example>
     * Application.i18n.set("en_EN","English",{
     * "myKey1" : "Hello",
     * "myKey2" : "World"
     * });
     *</example>
     */
    this.define = function(code, fullName, data) {
        _languages[code] = flatten(data);
        _languagesRow[code] = data;
        _languagesNames[code] = fullName;
    }

    var flatten = function(data, values, root) {
        if (!values) {
            values = {};
        }
        if (typeof data === 'string') {
            if (root) {
                values[root] = data;
            }
        } else {
            for (var i in data) {
                var newRoot = root ? root + '.' + i : i;
                values = flatten(data[i], values, newRoot);
            }
        }
        return values;
    }

    /**
     * Permet de récupérer la traduction dans la langue courante d'une clé
     * @param {String} key : clé de la valeur à récupérer
     * @return traduction de la valeur recherché dans la langue en cours
     *</example>
     */
    this.get = function(key) {
        var regexLang = /^languages/;
        if (regexLang.test(key)) {
            key = key.replace('languages.', '');
            return _languagesNames[key];
        }
        var parameters = [];
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                parameters.push(arguments[i]);
            }
        }
        if (!_languages[currentLanguage]) {
            console.log("i18n : " + currentLanguage + " does not exist");
            return key;
        } else {
            var text = _languages[currentLanguage][key];
            if (!text) {
                console.log("i18n : " + key + " does not exist in current language (" + currentLanguage + ")");
                text = _languages[settings.defaultLanguage][key];
            }
            text = setParametersValuesInText(text, parameters);
            return text ? text : key;
        }
    };

	this.getTranslations = function(key, root){
		if(!root){
			root = _languagesRow[currentLanguage];
		}
		if(root[key]){
			return root[key];
		}else{
			var index = key.indexOf('.');
			var newRoot = root[key.substring(0,index)];
			var newKey = key.slice(index+1, key.length);
			if(newRoot){
				return this.getTranslations(newKey, newRoot);
			}else{
				throw 'Key cannot be found '+key;
			}			
		}
	};
	
    this.getAvailableLanguages = function() {
        return _languagesNames;
    }

    var setParametersValuesInText = function(text, parameters) {
        if (!text || parameters.length === 0) {
            return text;
        }
        var regex = /\{([0-9]+)\}/;
        var regexReplace = /\{([0-9]+)/;
        if (regex.test(text)) {
            var tmp = text.split('}');
            for (var i in tmp) {
                regexReplace.test(tmp[i]);
                var index = RegExp.$1;
                if (parameters[index]) {
                    var param = parameters[index];
                    if (typeof parameters[index] !== 'string') {
                        param = '';
                        var counter = 0;
                        for (var j in parameters[index]) {
                            if (counter > 0) {
                                param += ', ';
                            }
                            param += '\'' + parameters[index][j] + '\'';
                            counter++;
                        }
                    }

                    tmp[i] = tmp[i].replace(regexReplace, param);
                } else {
                    tmp[i] = tmp[i].replace(regexReplace, '{$1}');
                }
            }
            text = tmp.join('');
        }
        return text;
    }
};