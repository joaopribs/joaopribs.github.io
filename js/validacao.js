if(!Array.indexOf){
    Array.prototype.indexOf = function(obj) {
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    };
}

function iniciarForm(idForm) {
	tags = ['INPUT', 'TEXTAREA'];
	for (var i = 0; i < tags.length; i++) {
		inputs = document.getElementsByTagName(tags[i]);
		for (var j = 0; j < inputs.length; j++) {
			inputs[j].onfocus = function () {selecionar(this);};
			inputs[j].onblur = function () {desselecionar(this);};
			inputs[j].onchange = function () {precisaConfirmar = true;};
		}
	}
	form = document.getElementById(idForm);
	if (form) {
		form.onsubmit = function () {precisaConfirmar = false; return validar(idForm);};
	}
}

function selecionar(elemento) {
	elemento.className = "campoFocus";
}

function desselecionar(objeto) {
	if (erroNoCampo(objeto) != "") {
		objeto.className = "campoInvalido";
	}
	else {
		objeto.className = "";
	}
}

function oQueTemNoCampo(objeto) {
	if (objeto.nodeName == "INPUT") {
		if (objeto.type == "text" || objeto.type == "hidden" || objeto.type == "password") {
			return objeto.value;
		}
		if (objeto.type == "radio") {
			var todos = document.getElementsByName(objeto.name);
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].checked)
					return todos[i].value;
			}
		}
	}
	else if (objeto.nodeName == "TEXTAREA") {
		return objeto.value;
	}
	
	return "";
}

function erroNoCampo(objeto, lingua) {
	if (!objeto.getAttribute("alt")) {
		return "";
	}

	if (lingua == null) {
		lingua = "br";
	}
	
	var campo = "";
	var ehOpcional = true;
	var tipo = "";
	var mascara = "";
	var opc = "";
	
	var array = objeto.getAttribute("alt").split("|");
	campo = array[0];
	if (array.length > 1)
		opc = array[1];
	if (opc != "Opcional" && opc != "") 
		ehOpcional = false;
	if (array.length > 2)
		tipo = array[2];
	if (array.length > 3)
		mascara = array[3];
	
	var valor = oQueTemNoCampo(objeto);
	
	if (opc.indexOf("ObrigatorioCom") == 0) {
		var arrayAdicional = opc.split(".");
		var campoQueObriga = document.getElementsByName(arrayAdicional[1])[0];
		var valorQueObriga = arrayAdicional[2];
		var condicaoQueObriga = arrayAdicional[3];
		
		if (oQueTemNoCampo(campoQueObriga) == valorQueObriga && valor == "") {
			if (lingua == "br") {
				return " - Como se trata de " + condicaoQueObriga + ", o campo " + campo + " é obrigatório\n";	
			}
			else if (lingua == "us") {
				return " - Since it is a " + condicaoQueObriga + ", " + campo + " is required\n";	
			}
		}
		ehOpcional = true;
	}
	
	if (valor == "") {
		if (!ehOpcional) {
			if (lingua == "br") {
				return " - Campo " + campo + " é obrigatório\n";
			}
			else if (lingua == "us") {
				return " - " + campo + " is required\n";	
			}
		}
	}
	else {
		if (mascara.length > 0) {
			if (valor.length != mascara.length) {
				if (lingua == "br") {
					return " - Campo " + campo + " preenchido incorretamente\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " is invalid\n";	
				}
			}
			
			numeros = "0123456789";
			letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			
			for (var a = 0; a < mascara.length; a++) {
				if (mascara.charAt(a) == "#")
					continue;
				else if (mascara.charAt(a) == "L") {
					if (letras.indexOf(valor.charAt(a).toUpperCase()) == -1) {
						if (lingua == "br") {
							return " - Campo " + campo + " preenchido incorretamente\n";
						}
						else if (lingua == "us") {
							return " - " + campo + " is invalid\n";	
						}
					}
				}
				else if (mascara.charAt(a) == "N") {
					if (numeros.indexOf(valor.charAt(a)) == -1) {
						if (lingua == "br") {
							return " - Campo " + campo + " preenchido incorretamente\n";
						}
						else if (lingua == "us") {
							return " - " + campo + " is invalid\n";	
						}
					}
				}
				else {
					if (valor.charAt(a) != mascara.charAt(a)) {
						if (lingua == "br") {
							return " - Campo " + campo + " preenchido incorretamente\n";
						}
						else if (lingua == "us") {
							return " - " + campo + " is invalid\n";	
						}
					}
				}
			}
		}
		
		if (tipo == "SoNumeros") {
			numeros = "0123456789";
			for (var b = 0; b < valor.length; b++) {
				if (numeros.indexOf(valor.charAt(b)) == -1) {
					if (lingua == "br") {
						return " - Campo " + campo + " preenchido incorretamente\n";
					}
					else if (lingua == "us") {
						return " - " + campo + " is invalid\n";
					}
				}
			}
		}

		else if (tipo.indexOf("MenorOuIgual") == 0) {
			arrayAdicional = tipo.split(".");
			var outroNumero = parseFloat(arrayAdicional[1]);
			var numero = parseFloat(valor);
			if (numero > outroNumero) {
				if (lingua == "br") {
					return " - O campo " + campo + " precisa ter valor menor ou igual a " + outroNumero + "\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " should be less than or equal to " + outroNumero + "\n";	
				}
			}
		}
		
		else if (tipo.indexOf("Igual") == 0) {
			arrayAdicional = tipo.split(".");
			outroCampo = document.getElementsByName(arrayAdicional[1])[0];
			outroValor = oQueTemNoCampo(outroCampo);
			arrayOutro = outroCampo.getAttribute("alt").split("|");
			nomeOutro = arrayOutro[0];
			if (valor != outroValor) {
				if (lingua == "br") {
					return " - Os campos " + campo + " e " + nomeOutro + " devem ser iguais\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " and " + nomeOutro + " should be the same\n";	
				}
			}
		}
		
		else if (tipo == "Usuario") {
			letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.";
			if (letras.indexOf(valor.charAt(0).toUpperCase()) == -1) {
				if (lingua == "br") {
					return " - O campo " + campo + " deve comecar com uma letra\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " should start with a letter\n";
				}
			}
			else if (valor.length < 3) {
				if (lingua == "br") {
					return " - O campo " + campo + " deve ter no minimo 3 caracteres\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " should have at least 3 characters\n";
				}
			}
			else {
				for (var c = 0; c < valor.length; c++) {
					if (caracteresPermitidos.indexOf(valor.charAt(c).toUpperCase()) == -1) {
						if (lingua == "br") {
							return " - O campo " + campo + " so pode conter letras, numeros, _ (sublinhado) e . (ponto)\n";
						}
						else if (lingua == "us") {
							return " - " + campo + " can only have letters, numbers, _ and .\n";	
						}
					}
				}
			}
		}

		else if (tipo == "Senha") {
			caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&_";
			if (valor.length < 3) {
				if (lingua == "br") {
					return " - O campo " + campo + " deve ter no minimo 3 caracteres\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " should have at least 3 characters\n";
				}
			}
			else {
				for (var i = 0; i < valor.length; i++) {
					if (caracteresPermitidos.indexOf(valor.charAt(i).toUpperCase()) == -1) {
						if (lingua == "br") {
							return " - O campo " + campo + " so pode conter letras, numeros, !, @, #, $, %, & e _\n";
						}
						else if (lingua == "us") {
							return " - " + campo + " can only have letters, numbers, !, @, #, $, %, & and _\n";
						}
					}
				}
			}
		}
		
		else if (tipo.indexOf("Data") != -1 && valor != "") {
			diasNoMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			elementos = valor.split("/");
			if (elementos.length != 3) {
				if (lingua == "br") {
					return " - Campo " + campo + " preenchido incorretamente\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " is invalid\n";
				}
			}
			else {
				dia = elementos[0];
				mes = elementos[1];
				ano = elementos[2];
				if (ano % 4 == 0)
					diasNoMes[1] = 29;
				if (dia < 1 || dia > diasNoMes[mes - 1]) {
					if (lingua == "br") {
						return " - Campo " + campo + " preenchido incorretamente\n";
					}
					else if (lingua == "us") {
						return " - " + campo + " is invalid\n";
					}
				}
				if (mes < 1 || mes > 12) {
					if (lingua == "br") {
						return " - Campo " + campo + " preenchido incorretamente\n";
					}
					else if (lingua == "us") {
						return " - " + campo + " is invalid\n";
					}
				}
			}
		}
		
		else if (tipo == "Email") {
			var temArroba = false;
			var temPontoDepoisDaArroba = false;
			for (var i = 0; i < valor.length; i++) {
				if (valor.charAt(i) == '@') {
					if (temArroba) {
						if (lingua == "br") {
							return " - Campo " + campo + " preenchido incorretamente\n";
						}
						else {
							return " - " + campo + " is invalid\n";
						}
					}
					temArroba = true;
				}
				else if (valor.charAt(i) == '.' && temArroba)
					temPontoDepoisDaArroba = true;
			}
			if (!temArroba || !temPontoDepoisDaArroba) {
				if (lingua == "br") {
					return " - Campo " + campo + " preenchido incorretamente\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " is invalid\n";
				}
			}
		}
		
		else if (tipo.indexOf("ComprimentoMinimo") == 0) {
			var compMinimo = tipo.split(".")[1];
			if (valor.length < compMinimo) {
				if (lingua == "br") {
					return " - O campo " + campo + " deve ter no minimo " + compMinimo + " caracteres\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " should have at least " + compMinimo + " characters\n";
				}
			}
		}
		
		if (tipo.indexOf("DataComparacao") == 0) {
			arrayAdicional = tipo.split(".");
			
			tempo = arrayAdicional[1];
			
			data = valor.split("/");
			dataComp = data[2] + "" + data[1] + "" + data[0];
			
			outroCampo = document.getElementsByName(arrayAdicional[2])[0];
			
			outraData = oQueTemNoCampo(outroCampo).split("/");
			outroDataComp = outraData[2] + "" + outraData[1] + "" + outraData[0];
		
			arrayOutro = outroCampo.getAttribute("alt").split("|");
			nomeOutro = arrayOutro[0];
				
			if (tempo == "Antes" && dataComp >= outroDataComp) {
				if (lingua == "br") {
					return " - O campo " + campo + " deve conter uma data anterior à do campo " + nomeOutro + "\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " should be before " + nomeOutro + "\n";
				}
			}
			else if (tempo == "Depois" && dataComp <= outroDataComp) {
				if (lingua == "br") {
					return " - O campo " + campo + " deve conter uma data posterior à do campo " + nomeOutro + "\n";
				}
				else if (lingua == "us") {
					return " - " + campo + " should be after " + nomeOutro + "\n";
				}
			}
		}
	}
		
	return "";	
}

function validar(idForm, lingua) {
	var primeiroObjeto = null;
	var erros = "";
	var form = document.getElementById(idForm);
	var tags = ['INPUT', 'TEXTAREA'];
	for (var d = 0; d < form.length; d++) {
		if (tags.indexOf(form[d].nodeName) != -1) {
			var elemento = $("#" + form[d].id);

			var erro = erroNoCampo(form[d], lingua);

			if (erro != "") {
				if (primeiroObjeto == null) {
					primeiroObjeto = form[d];
				}
				elemento.addClass("campoInvalido");
				erros += erro;
			}
			else {
				elemento.removeClass("campoInvalido");
			}
		}
	}

	if (erros != "") {
		if (lingua == "br") {
			alert("Seu formulário não foi submetido por causa dos seguintes erros:\n\n" + erros);	
		}
		else if (lingua == "us") {
			alert("Your form could not be submitted because of the following errors:\n\n" + erros);	
		}
		
		primeiroObjeto.focus();
		return false;
	}
	return true;
}

function preencher(objeto, mascara, evento) {
	numeros = "1234567890";
	letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	teclas = [8, 9, 16, 27, 35, 36, 37, 39, 46];
	
	var unicode = evento.keyCode? evento.keyCode : evento.charCode;
	if (teclas.indexOf(unicode) == -1) {
		if (mascara == "FLOAT") {
			var jaTemNumero = false;
			var jaTemPonto = false;
			deletar = [];
			for (var i = 0; i < objeto.value.length; i++) {
				var caractere = objeto.value.charAt(i);
				if (numeros.indexOf(caractere) != -1) {
					jaTemNumero = true;
				}
				else if (caractere == "," || caractere == ".") {
					if (jaTemPonto || !jaTemNumero) {
						deletar = deletar.concat([i]);
					}
					else {
						esquerda = objeto.value.substring(0, i);
						direita = objeto.value.substring(i + 1);
						objeto.value = esquerda + "." + direita;
						jaTemPonto = true;
					}
				}
				else if (numeros.indexOf(caractere) == -1) {
					deletar = deletar.concat([i]);	
				}
			}
			objeto.value = deletarDaString(objeto.value, deletar);
		}
		
		else if (mascara == "EMAIL") {
			var jaTemArroba = false;
			deletar = [];
			for (var i = 0; i < objeto.value.length; i++) {
				if (objeto.value.charAt(i) == '@') {
					if (jaTemArroba)
						deletar = deletar.concat([i]);
					jaTemArroba = true;
				}
			}
			objeto.value = deletarDaString(objeto.value, deletar);
		}
		
		else if (mascara == "SOLETRASEESPACO") {
			var permitidos = "AÃÁÀÂÄBCÇDEËÈÉÊFGHIÏÌÍÎJKLMNOÖÒÓÔÕPQRSTUÜÚÙÛVWXYZ ";
			deletar = [];
			for (var i = 0; i < objeto.value.length; i++) {
				var caractere = objeto.value.charAt(i);
				if (permitidos.indexOf(caractere.toUpperCase()) == -1) {
					deletar = deletar.concat([i]);
				}
			}
			objeto.value = deletarDaString(objeto.value, deletar);
		}
	
		else {
			deletar = [];
			for (var e = 0; e < objeto.value.length; e++) {
				objeto.value = objeto.value.substring(0, mascara.length);
				if (mascara.charAt(e) == '#')
					continue;
				else if (mascara.charAt(e) == 'L' || mascara.charAt(e) == 'M') {
					if (letras.indexOf(objeto.value.charAt(e).toUpperCase()) == -1) {
						deletar = deletar.concat([e]);
					}
					else {
						esquerda = objeto.value.substring(0, e);
						direita = objeto.value.substring(e + 1);
						objeto.value = esquerda + objeto.value.charAt(e).toUpperCase() + direita;
					}
				}
				else if (mascara.charAt(e) == 'N') {
					if (numeros.indexOf(objeto.value.charAt(e)) == -1) {
						deletar = deletar.concat([e]);
					}
				}
				else if (objeto.value.charAt(e) != mascara.charAt(e)) {
					esquerda = objeto.value.substring(0, e);
					direita = objeto.value.substring(e);
					objeto.value = esquerda + mascara.charAt(e) + direita;
				}
			}
			objeto.value = deletarDaString(objeto.value, deletar);
			objeto.focus();
		}
	}
}

function deletarDaString(string, indices) {
	for (var i = 0; i < indices.length; i++) {
		var indice = indices[i];
		if (indice < string.length) {
			esquerda = string.substring(0, indice);
			direita = string.substring(indice + 1);
			string = esquerda + direita;
			for (var j = i + 1; j < indices.length; j++)
				indices[j] = indices[j] - 1;
		}
	}
	return string;
}

precisaConfirmar = false;
function confirmarSaida() {
	if (precisaConfirmar) {
		return "As informacoes nao foram salvas.";
	}
}