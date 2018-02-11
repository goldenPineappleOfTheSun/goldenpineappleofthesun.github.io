
var daysSheduleObject;

window.addEventListener('load', 
	function(){
		daysSheduleObject = new DaysShedule(document.querySelector('.days'), document.querySelector('.days-wrapper'))
	});

DaysShedule = function(element, wrapper){
	var mouseGrab = false;
	var element = element;
	var wrapperElement = wrapper;
	var mouseOff = 0;
	var daysOff = 0; 
	var daysViewWidth = wrapperElement.getBoundingClientRect().width;
	var dayWidth = element.firstElementChild.getBoundingClientRect().width - 2;
	var daysWidth = element.childElementCount * dayWidth;

	function init() {
		element.ontouchstart = handleTouchStart;
		element.ontouchmove = handleTouchMove;
		element.ontouchend = handleTouchEnd;
	}


	function handleTouchStart(event){
		mouseGrab = true;
		mouseOff = event.changedTouches[0].clientX;
	}

	function handleTouchMove(event){
		if (mouseGrab)
			element.style.left = daysOff + event.changedTouches[0].clientX - mouseOff + 'px';
	}

	function handleTouchEnd(event){
		mouseGrab = false;
		daySetX(daysOff + event.changedTouches[0].clientX - mouseOff);
	}

	function daySetX(x) {
		daysOff = x;
		var l = 'block';
		var r = 'block';

		daysOff = Math.round(daysOff / dayWidth) * dayWidth;

		if (daysOff >= -1) {
			daysOff = 0;
			l = 'none';
		}
		if (daysOff <= -daysWidth + daysViewWidth + 1){
			daysOff = -daysWidth + daysViewWidth;
			r = 'none';
		}

		document.querySelector('.days__left').style.display = l;
		document.querySelector('.days__right').style.display = r;

		element.style.left = daysOff + 'px';
	}

	this.scrollDayLeft = function(){
		daySetX(daysOff + dayWidth * 1.4);
	}

	this.scrollDayRight = function(){
		daySetX(daysOff - dayWidth * 1.4);
	}

	init();
}



/*

window.addEventListener('load', init);

function handleDayTouchStart(event){
	mouseGrab = true;
	mouseOff = event.changedTouches[0].clientX;
}

function handleDayTouchMove(event){
	if (mouseGrab)
		daysElement.style.left = daysOff + event.changedTouches[0].clientX - mouseOff + 'px';
}

function handleDayTouchEnd(event){
	mouseGrab = false;
	daySetX(daysOff + event.changedTouches[0].clientX - mouseOff);
}

function daySetX(x) {
	daysOff = x;
	var l = 'block';
	var r = 'block';

	daysOff = Math.round(daysOff / dayWidth) * dayWidth;

	if (daysOff >= -1) {
		daysOff = 0;
		l = 'none';
	}
	if (daysOff <= -daysWidth + daysViewWidth + 1){
		daysOff = -daysWidth + daysViewWidth;
		r = 'none';
	}

	document.querySelector('.days__left').style.display = l;
	document.querySelector('.days__right').style.display = r;

	daysElement.style.left = daysOff + 'px';
}

function scrollDayLeft(){
	daySetX(daysOff + dayWidth * 1.4);
}

function scrollDayRight(){
	daySetX(daysOff - dayWidth * 1.4);
}

function init() {
	daysElement = document.querySelector('.days');
	dayWidth = daysElement.firstElementChild.getBoundingClientRect().width - 2;
	daysWidth = daysElement.childElementCount * dayWidth;
	daysViewWidth = document.querySelector('.days-wrapper').getBoundingClientRect().width;

	daysElement.ontouchstart = handleDayTouchStart;
	daysElement.ontouchmove = handleDayTouchMove;
	daysElement.ontouchend = handleDayTouchEnd;
}*/