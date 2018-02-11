
var policyObject;

window.addEventListener('load', 
	function(){
		policyObject = new Policy(document.querySelector('.policy-number__input-cursor'))
	});

Policy = function(cursorElement){
	var number = '123456789'
	var cursor = 9;
	var cursorOpacity = 1;
	var cursorElement = cursorElement;

	this.setCursor = function(n) {
		if (number.length < n)
			n = number.length;

		if (n < 0)
			n = 0;

		cursorElement.style.left = 44 + (((n - 1) % 8) * 60 - 16) + ((n === 0) ? 20 : 0) + 'px';
		if (n < 9)
			cursorElement.style.top = '-3px';
		else
			cursorElement.style.top = '85px';

		cursor = n;
	}

	this.dialLitera = function(n) {
		if (number.length >= 16)
			return;

		number = number.substr(0, cursor) + n + number.substr(cursor, number.length-1);;		

		this.setCursor (cursor+1)
		updateNumber(number);
	}

	this.eraseLitera = function() {
		if (number.length > 0)
			number = number.substr(0, cursor-1) + number.substr(cursor, number.length-1);

		this.setCursor (cursor-1)
		updateNumber(number);
	}

	function updateNumber(number) {
		document.querySelector('.policy-number__input-number-1').textContent = number.substr(0,8);
		document.querySelector('.policy-number__input-number-2').textContent = number.substr(8,8);
	}

	setInterval(function(){
		cursorOpacity = (cursorOpacity > 0.5) ? 0.2 : 1;
		cursorElement.style.opacity = cursorOpacity;
	}, 600)
}