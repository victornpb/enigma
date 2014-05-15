/*
*  viewController.js  - written by Victor N - 22/Nov/2013 - www.vitim.us
*/

window.onload=function(){
	
	console.log('Loaded!');
	
	addEvent(document.body,"keyup",keyEvent);
	addEvent(document.body,"keydown",keyEvent);

	addEvent(document.querySelector('.keyboard'), "mousedown", mouseEvent);
	addEvent(document.querySelector('.keyboard'), "mouseup", mouseEvent);
	
	counter1 = new Counter(c1);
	counter2 = new Counter(c2);
	counter3 = new Counter(c3);
	counter4 = new Counter(c4);
	
	document.querySelector('#encKey4').style.visibility = "hidden";
	
	counter1.onChange = function(pos){
		Enigma.rotors[0].pos = pos;
	}
	counter2.onChange = function(pos){
		Enigma.rotors[1].pos = pos;
	}
	counter3.onChange = function(pos){
		Enigma.rotors[2].pos = pos;
	}

};

var lastKeyEvent;
function keyEvent(e){
	var evt = window.event ? window.event : e;
	var keyCode = evt.keyCode ? evt.keyCode : e.which;
	
	var state = evt.type=='keydown'?"down":"up";
	
	if(lastKeyEvent!=state)
	if(keyCode>=65 && keyCode<=90){
		lastKeyEvent=state;
		var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(keyCode-65);
		work(char, state);
		console.log(char, state);
	}
}

var lastClick;
function mouseEvent(e){
	var evt = window.event ? window.event : e;
	//var keyCode = evt.keyCode ? evt.keyCode : e.which;
	console.log(evt);
	
	var state = evt.type=='mousedown'?"down":"up";
	var char = e.target.innerHTML;
		
	if(/^[A-Z]$/.test(char)){
		
		if(state=="down"){
			lastClick = Date.now();
			work(char, state);
			console.log(char, state);
		}
		else{
			console.log(Date.now()-lastClick)
			if(Date.now()-lastClick>50){
				work(char, state);
			}
			else setTimeout(function(){ work(char,'up')}, 1500);
		}
	}
}


var previousLight;
function work(char, state){
	
	if(state=='down'){
		simulateKey(char, state);
		var newChar = Enigma.encode(char);
		
		simulateLight(newChar, 1);
		previousLight = newChar;
		
		fakePrinter(newChar);
	}
	else{
		simulateKey(char, 0);
		simulateLight(previousLight, 0);
		
		counter1.moveTo(Enigma.rotors[0].pos);
		counter2.moveTo(Enigma.rotors[1].pos);
		counter3.moveTo(Enigma.rotors[2].pos);
	}
}


function simulateKey(char, state){
	var keys = document.querySelectorAll(".keyboard div")
	for(var i=0; i<keys.length; i++){
		
		if(keys[i].innerHTML==char){
			if(state)
				keys[i].classList.add('down');
			else
				keys[i].classList.remove('down');
		}
	}
}

function simulateLight(char, state){
	var keys = document.querySelectorAll(".lightBoard div")
	for(var i=0; i<keys.length; i++){
		
		if(keys[i].innerHTML==char){
			if(state)
				keys[i].classList.add('on');
			else
				keys[i].classList.remove('on');
		}
	}
}


function fakePrinter(char){
	paperContent.innerHTML += char;
	paper.style.width = paperContent.offsetWidth +"px";
	console.log(paperContent.offsetWidth);
}