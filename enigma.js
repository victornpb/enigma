/*

http://www.ellsbury.com/ultraenigmawirings.htm



*/


/*
 Rotor constructor used by the Enigma machine
*/
function Rotor(wiring){
	this.pos = 0;
	this.wiring = [];
	
	if(/^[A-Z]{26}$/.test(wiring)){
		this.wiring = wiring.split('');
	}
	else{
		throw new Error("Invalid Rotor");
	}
}

Rotor.prototype.step = function(){
	this.pos++;
	if(this.pos>=26){
		this.pos = 0;
	}
	return this.pos;
}

/*
* A signal goes in both directions in a rotor
* This function compute the signal in normal direction
*/
Rotor.prototype.signalForward=function(char){
	
	char = char.toUpperCase();
	
	var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(char);
	if(i<0)
		throw new Error("Input must be A-Z");

	i += this.pos;
	
	var out = this.wiring[i%26];
	
	//console.log(" %s -> %s",char,out);
	
	return out;
}

/*
* A signal goes in both directions in a rotor
* This function compute the signal in backward direction after its been mirrored
*/
Rotor.prototype.signalReverse=function(char){
	
	char = char.toUpperCase();
	
	var i = this.wiring.indexOf(char);
	if(i<0)
		throw new Error("Input must be A-Z");
	
	i -= this.pos;
	i += 26;
	
	var out = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(i%26);
	
	//console.log(" %s -> %s",char,out);
	
	return out;
}

var rotors = {};
rotors.I = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ"); //I
rotors.II = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE"); //II
rotors.III = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO"); //III
rotors.IV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB"); //IV
rotors.V = new Rotor("VZBRGITYUPSDNHLXAWMJQOFECK"); //V
rotors.VI = new Rotor("JPGVOUMFYQBENHZRDKASXLICTW"); //VI
rotors.VII = new Rotor("NZJHGRCXMYSWBOUFAIVLPEKQDT"); //VII
rotors.VIII = new Rotor("FKQHTLXOCBJSPDZRAMEWNIUYGV"); //VIII
rotors.b = new Rotor("LEYJVCNIXWPBQMDRTAKZGFUHOS"); //M4 beta
rotors.g = new Rotor("FSOKANUERHMBTIYCWLQPZXVGJD"); //M4 gama

var reflectors = {};
reflectors["b"] = new Rotor("YRUHQSLDPXNGOKMIEBFZCWVJAT"); // M3 B
reflectors["c"] = new Rotor("FVPJIAOYEDRZXWGCTKUQSBNMHL"); // M3 C
reflectors["b_thin"] = new Rotor("ENKQAUYWJICOPBLMDXZVFTHRGS"); // M4 thin B
reflectors["c_thin"] = new Rotor("RDOBJNTKVEHMLFCWZAXGYIPSUQ"); // M4 thin C


var Enigma = {
	rotors : [
		rotors.III,
		rotors.II,
		rotors.I,
		reflectors.b
	],
	
	wireboard : null,
	
	encode : function(char){
		
		var oldChar = char;
		
		//turn the rotors in one step every time a char is entered
		Enigma.gearing();
		
		//propagate the signal through each rotor back and forth
		for(var i=0; i<(Enigma.rotors.length-1); ++i){
			char = Enigma.rotors[i].signalForward(char);
			//console.log(i);
		}
		for(var i=Enigma.rotors.length-1; i>=0; --i){
			char = Enigma.rotors[i].signalReverse(char);
			//console.log(i);
		}	
		
		
		//console.log("[ %s %s %s ] %s -> %s", Enigma.rotors[0].pos, Enigma.rotors[1].pos, Enigma.rotors[2].pos, oldChar, char);
		
		return char;
	},
	
	gearing : function(){
		//shift the first rotor[0]
		//propagate to next rotors[0..n-1] one when they complete one revolution (25)
		//propagate to all rotors except the last (n-1) because the last is the reflector which is fixed.
		for(var i=0; i<Enigma.rotors.length-1; ++i){
			pos = Enigma.rotors[i].step();
			if(pos>0) break;
		}
	},
	
	getPos:function(){
		return Enigma.rotors[0].pos +" "+Enigma.rotors[1].pos +" "+Enigma.rotors[2].pos;
	},
	setPos:function(x,y,z){
		Enigma.rotors[0].pos = x;
		Enigma.rotors[1].pos = y;
		Enigma.rotors[2].pos = z;
	}
}

function test(){
	var pos=[];
	var codes=[];
	for(var i=0;i<(26*26*26)+1;++i){
		
		codes.push(Enigma.encode('A'));
		pos.push(Enigma.getPos());
	}
	
	//document.body.innerHTML = pos.join('<br>');
	document.body.innerHTML = codes.join('');
}
//test();


function encode(text){
	var encoded=[];
	for(var i=0; i<text.length; ++i){
		encoded.push(Enigma.encode(text.charAt(i)));
	}
	return encoded.join('');
}