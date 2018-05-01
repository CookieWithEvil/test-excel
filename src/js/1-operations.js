//Object makes operations on numbers
var operations = {
	result: "",
	noErrors: true,
	operationList: ["=SUM", "=AVERAGE", "=CONCAT", "=HYPERLINK"],
	//SPECIFY OPERATION
	identifyOperation: function(value){
		this.noError = true;
		if(value.length == 0) return "";
		if(+(value.replace(",",".")) === +(value.replace(",","."))){
			this.result = Math.round((+value.replace(",","."))*100)/100;
			return this.result;
		}else if(!this.isFormula(value) && this.isMoney(value)){
			this.result = this.formaliseMoney(value);
			return this.result;
		}else{
			if(this.isFormula(value)){
				var operation;
				this.result = this.checkFormulaErrors(value);
				if(this.result === false){
					for (var i = 0; i < this.operationList.length; i++) {
						if(value.includes(this.operationList[i])){
							operation = this.operationList[i];
							break;
						}else if(i === this.operationList.length - 1 && !value.includes(this.operationList[i])){
							this.noErrors = false;
							this.result = "Your formula spelled incorect";
						}
					}
					switch(operation){
						case "=SUM": {this.result = this.sum(value)}
						break;
						case "=AVERAGE": {this.result = this.average(value)}
						break;
						case "=CONCAT": {this.result = this.concat(value)}
						break;
						case "=HYPERLINK": {this.result = this.isValid(value)}
						break;
					}
				}
			}else if(this.isLink(value)){
				this.result = this.isValid(value);
			}else{
				this.result = value;
			}
		}

		return this.result;
	},
	//CHECK OPERATION'S TYPE AND EXECUTE SOME SIMPLE
		checkFormulaErrors: function(str) {
			if(!str.includes("(") || !str.includes(")") || !str.includes("=") ){
				this.noErrors = false;
				return "Error: Formula is missing the bracket";
			}else if(str.slice(1,str.indexOf("(")).search(/[a-z]/) > -1){
				this.noErrors = false;
				return "Error: Formula typed in lower case";
			}
			if(!str.includes("=HYPERLINK")){
				if(str.search(/[','|':']/) < 0 || (str.indexOf("(") == str.indexOf(")")-1) ||
				str.search(/[a-z]/) > -1){
					this.noErrors = false;
					return "Error: Incorrenct spelling";
				}
			}
			return false;
		},
		isMoney: function(str){
			var amountStart = str.search(/[0-9]/);
			if(amountStart > 0 && str.search(/\s/) === -1 && str.search(/["="]/) === -1){
				return true;
			}
			else return false;
		},
		formaliseMoney: function(str){
			var formal = [];
			var point = (str.search(/[","|"."]/) > -1) ? str.search(/[","|"."]/) : str.length+1;
			var amount = (str.slice(1, point)).split("");
			var currency  = str.slice(0, 1);
			var floatPoint = "";
			if(str.search(/[","|"."]/) > -1){
				floatPoint = +("."+str.slice(str.search(/[","|"."]/)+1));
				floatPoint = ""+(Math.round(floatPoint*100)/100);
				floatPoint = floatPoint.slice(1,)
			}
			for(var i = amount.length - 1, n = 0; i >= 0; i--, n++){
				if(n >= 3){
					formal.unshift(" ");
					n = 0;
				}
				if(n < 3){
					formal.unshift(amount[i]);
				}
			}
			formal = formal.join("");
			return currency+formal+floatPoint;
		},
		isFormula: function(str){
			if(str.match(/["("|")"]/g) || str.match(/["="]/)) return true;
			return false;
		},
		isLink: function(str){
			if(str.includes(".") || (str.match("://") || str.includes(".com") || str.includes(".ua")) ) return true;
			return false;
		},
		isValid: function(str){
			if( (str.includes("www.") || str.includes("http://") || str.includes("https://")) &&
				(str.search(/\S(?=".")/gi)) || str.includes(".com") ||
				str.includes(".ua")){
					if(str.includes("=HYPERLINK")){
						str = str.replace("(", "(‘");
						str = str.replace(")", "‘)");
					}else{
						str = "=HYPERLINK(‘"+str+"’)";
					}
				return str;
			}
			this.noErrors = false;
			return "Error: link is not valid";
		},
		//GET VALUES
		getCellsValues: function(str){
			var helpValue = this.detachValues(str);
			var numbers = [];

			var rowIFirst = helpValue[0].match(/[0-9]/g);
			var colJFirst = helpValue[0].match(/[A-Z]/g);
			rowIFirst = +(rowIFirst.join(""));
			colJFirst = colJFirst[0].charCodeAt(0) - 64;//numbers.push(rowIFirst, colJFirst);

			var rowILast = helpValue[1].match(/[0-9]/g);
			var colJLast = helpValue[1].match(/[A-Z]/g);
			rowILast = +(rowILast.join(""));
			colJLast = colJLast[0].charCodeAt(0) - 64;

			numbers.push(values[rowIFirst][colJFirst]);

			if(helpValue[2]){
				var indexStart = (rowIFirst === rowILast)? colJFirst : rowIFirst;
				var indexEnd = (indexStart === rowIFirst)? colJLast : rowILast;
				var isSameRow = (indexStart === rowIFirst)? true : false;

				for (var i = indexStart+1; i < indexEnd; i++){
					(isSameRow) ? (numbers.push(values[rowIFirst][i])) :
								  (numbers.push(values[i][colJFirst]));
				}
			}
			numbers.push(values[rowILast][colJLast]);

			return numbers;
		},
		detachValues: function(str){
			var openBracket = str.indexOf("(");
			var closeBracket = str.indexOf(")");
			var punct = str.match(/[","|":"]/);

			var isSequence = (punct[0] == ":") ? true : false;
			var firstElement = str.slice(openBracket+1, punct.index);
			var lastElement = str.slice(punct.index+1, closeBracket);

			return [firstElement, lastElement, isSequence]
		},
		//OPERATIONS METHODS
		sum: function(str){
			var numbers = this.getCellsValues(str);
			var point;var floatPoint;
			var sumMoney = false;
			var sm = 0; var i = 0;
			while(sumMoney === false && i < numbers.length){
				sumMoney = this.isMoney(numbers[i]);
				i++;
			}
			var currency = (sumMoney) ? numbers[i-1].match(/[^0-9]/).join('') : 0;
			for(i = 0; i < numbers.length; i++){
				if(numbers[i].search(/[","|"."]/) > -1){
					point = numbers[i].search(/[","|"."]/);
				}else{
					point = numbers.length;
					floatPoint = "";
				}

				if(sumMoney){
					if(this.isMoney(numbers[i]) === false){
						this.noErrors = false;
						return "Error: Trying to add number to money";
					}
					numbers[i] = ( numbers[i].match(/[0-9,"."|","]/g).join('') );
					numbers[i] = numbers[i].replace(/[","]/, ".");
				}
				sm += +(numbers[i]);
			}
			return currency+(Math.round(sm*100)/100);
		},
		average: function(str){
			var numbers = this.getCellsValues(str);
			var point;var floatPoint;
			var aMoney = false;
			var a = 0; var i = 0;
			while(aMoney === false && i < numbers.length){
				aMoney = this.isMoney(numbers[i]);
				i++;
			}
			var currency = (aMoney) ? numbers[i-1].match(/[^0-9]/).join('') : 0;
			for(var i = 0; i < numbers.length; i++){
				if(numbers[i].search(/[","|"."]/) > -1){
					point = numbers[i].search(/[","|"."]/);
				}else{
					point = numbers.length;
					floatPoint = "";
				}
				if(aMoney){
					if(this.isMoney(numbers[i]) === false){
						this.noErrors = false;
						return "Error: Average of number and money";
					}
					numbers[i] = ( numbers[i].match(/[0-9,"."|","]/g).join('') );
					numbers[i] = numbers[i].replace(/[","]/, ".");
				}
				a += +(numbers[i]);
			}
			return currency+(Math.round((a/numbers.length)*100)/100);
		},
		concat: function(str){
			var strings = this.getCellsValues(str);
			var st = "";
			for(var i = 0; i < strings.length; i++){
				st += strings[i];
			}
			return st;
		},
	};
