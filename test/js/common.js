
var currentTimeObject;

window.addEventListener('load', 
	function(){
		currentTimeObject = new CurrentTime(document.querySelector('.header__time'))
	});

/* Timer */

CurrentTime = function(element){
	var timeElement = element;
	var timeOptions = {
		month: 'long',
		day: '2-digit',
		weekday: 'short',
		timezone: 'UTC',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};

	this.updateTime = function() {
		var date = new Date();

		timeElement.textContent = date.toLocaleString("ru", timeOptions)
	}

	/* update time */
	this.updateTime(); 

	(function(func){
		setInterval(func);
	})(this.updateTime)
}