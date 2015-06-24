Validation = {
	'NOT' : function(value){
		return !value;
	},
	'EMPTY' : function(value){
		return typeof value === 'undefined' || value === null || value === '';
	},
	'IS_NUMERIC' : function(value){
		var regex = /[0-9]+(\.[0-9]+)*/g;
		return regex.test(value);
	},
	'IS_BOOLEAN' : function(value){
		return typeof value === 'boolean' || value === 'true' || value === 'false';
	},
	'MAX_LENGTH' : function(value,max){
		return value.length <= max;
	},
	'MIN_LENGTH' : function(value,min){
		return value.length >= min;
	},
	'EQUALS' : function(value, otherValue){
		return value == otherValue;
	},
	'LOWER_THAN' : function(value, min){
		return value > min;
	},
	'GREATER_THAN' : function(value, max){
		return value < max;
	},
	'IN_LIST' : function(value, list){
		return _.contains(list,value);
	},

	/**
	* valide une donnée en fonction d'une phrase
	* <example>
	* var result = Validation.validatePhrase("EMPTY || MIN_LENGTH(0) && MAX_LENGTH(20)","test");
	* //result => true;
	* </example>
	*/
	validatePhrase : function(phrase, value){
		// prépare la phrase pour la rendre
		var preparePhrase = function(phrase){
			phrase = phrase.toUpperCase();
			phrase = phrase.replace(/\(/g,' ( ');
			phrase = phrase.replace(/\)/g,' ) ');
			phrase = phrase.replace(/  /g,' ');
			phrase = phrase.trim();
			return phrase;
		};
		var operators = {
			or : '||',
			and : '&&'
		};
		var word = function(){
			this.name = null;
			this.children = [];
			//this.result = null;
			//this.operatopr = null;
			//this.parameters = null;
		};
		
		if(!phrase){
			return true;
		}
		phrase = preparePhrase(phrase);
		var words = phrase.split(' ');

		var createWordsTree = function(node){
			while(words.length > 0){
				var currentWord = words[0];
				words.splice(0,1);
				
				if(currentWord === '('){
					if(node){
						node.children.push(createWordsTree());
					}else{
						node = new word();
					}
				}else if(currentWord === ')'){
					return node;
				}else{
					var newWord = new word();
					newWord.name = currentWord;
					if(node){
						node.children.push(newWord);
					}else{
						node = newWord;
					}
					createWordsTree(node);
				}
			}
			return node;
		};
		var tmp = createWordsTree(new word());
		console.log(JSON.stringify(tmp));
		
		// TODO
		
		return false;
	}
};

/*
//TEST
Interpreter = {
	LETTER : '[a-zA-Z]',
	FIGURE : '[0-9]',
	NUMBER : 'FIGURE+',
	WORD : 'LETTER+',
	FUNCTION_CALL : 'WORD\((WORD|NUMBER(,WORD|NUMBER)*)?\)'
};
*/