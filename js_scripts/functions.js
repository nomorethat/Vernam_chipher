$(document).ready(function(){
	$("#container #to_encrypt").bind("click", to_encrypt);
	
	// код Бодо
	var Bodo_code = new Map([
		["a", "11011"],
		["b", "10110"],
		["c", "10010"],
		["d", "10000"],
		["e", "11101"],
		["f", "10100"],
		["g", "10101"],
		["h", "10001"],
		["i", "11100"],
		["j", "10011"],
		["k", "00011"],
		["l", "00001"],
		["m", "00101"],
		["n", "00100"],
		["o", "11000"],
		["p", "00000"],
		["r", "00110"],
		["q", "00010"],
		["s", "01110"],
		["t", "01010"],
		["u", "11010"],
		["v", "01000"],
		["w", "01100"],
		["x", "01101"],
		["y", "11110"],
		["z", "01001"]
	]);
	
	function to_encrypt(){
		$("#container #result").empty();
		$("#container textarea").css("border", "1px solid #bbb");
		$("#container input[name='key']").css("border", "1px solid #bbb");
		
		var open_message = $("#container textarea").val();
		if(open_message.length < 1){
			$("#container #result").append("<span>Шифрование невозможно (открытый текст отсутствует)</span>");
			$("#container textarea").css("border", "1px solid #f00");
			return;
		}
		
		open_message = normalize_of_data(open_message); // нормализация исходного сообщения
		var binnary_open_message = translate_to_binnary_open_message(open_message);
		var pseudorandom_sequence = generate_a_pseudorandom_sequence(binnary_open_message.length);
		
		//наложение гаммы
		var binnary_chipher_text = gamming(binnary_open_message, pseudorandom_sequence);
		var chipher_text = translate_to_chipher_text(binnary_chipher_text);
		
		$("#container #result").append("<br /><span><b>Сообщение: </b>" + open_message + "</span><br />");
		$("#container #result").append("<span><b>Шифротекст: </b>" + chipher_text + "</span>");
		$("#container #result").append("<span><b>Примечание: </b> при шифровании некоторые коды могут не интерпретироваться в символ алфавита Бодо. Это связано с тем, что двоичной последовательностью из 5 символов можно закодировать 32 (2 в 5й степени) символов, в то время как в латинском алфавите всего 26 символов. Это значит, что символа для 6ти двоичных комбинаций из 5ти символов просто нет. ");
	}
	
	function normalize_of_data(data){
		data = data.toLowerCase();
		for(var i = 0; i < data.length; i++){
			var code_of_symbol = data.charCodeAt(i);
			if((code_of_symbol < 97)  || (code_of_symbol > 123)){
				data = data.replace(data.charAt(i), "");
				i--;
			}
		}
		return data;
	}
	
	function translate_to_binnary_open_message(open_message){
		var binnary_open_message = "";
		for(var i = 0; i < open_message.length; i++){
			binnary_open_message += Bodo_code.get(open_message.charAt(i));
		}
		return binnary_open_message;
	}
	
	function generate_a_pseudorandom_sequence(len){
		var pseudorandom_sequence = "";
		for(var i = 0; i < len; i++){
			pseudorandom_sequence += Math.round(Math.random());
		}
		return pseudorandom_sequence;
	}
	
	function gamming(binnary_open_message, pseudorandom_sequence){
		var binnary_chipher_text = "";
		for(var i = 0; i < binnary_open_message.length; i++){
			binnary_chipher_text += ((Number(binnary_open_message.charAt(i)) + Number(pseudorandom_sequence.charAt(i)))%2);
		}
		return binnary_chipher_text;
	}
	
	function translate_to_chipher_text(binnary_chipher_text){
		var chipher_text = new Array();
		var i = 0;
		var k = 0;
		while(1){
			if(k === binnary_chipher_text.length)
				break;
			chipher_text[i] = binnary_chipher_text.slice(k, k + 5);
			i++;
			k = k + 5;
		}
		
		for(var i = 0; i < chipher_text.length; i++){
			for (let pair of Bodo_code.entries()) {
				if(chipher_text[i] === pair[1])
					chipher_text[i] = pair[0];
			}
		}
		
		var chipher_text = chipher_text.join("");
		return chipher_text;
	}
});