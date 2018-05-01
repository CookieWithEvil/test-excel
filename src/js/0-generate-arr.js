//GENERATE HEADERS
function generateHeaders(size, horisontal){
	var arr = [];
	for (var i = 0; i < size; i++) {
		if(horisontal){
			arr.push(String.fromCharCode(64+i))
		}else{
			arr.push([]);
			arr[i].push(""+(i+1));
			for (var j = 1; j < size; j++) {
				arr[i].push("");
			}
		}
	}
	return arr;
};
var horisontalHeaders = generateHeaders(27, true);
var values = generateHeaders(27, false);
