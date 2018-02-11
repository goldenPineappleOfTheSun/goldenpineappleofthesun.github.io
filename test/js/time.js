
var timeSheduleObject;

window.addEventListener('load', 
	function(){
		timeSheduleObject = new TimeShedule(document.querySelector('.shedule__table'), document.querySelector('.shedule__table-wrapper'))
	});

TimeShedule = function(element, wrapper){
	var mouseGrab = false;
	var element = element;
	var wrapperElement = wrapper;
	var mouseOff = 0;
	var timeOff = 0;
	var timeHeight = element.getBoundingClientRect().height;
	var timeViewHeight = wrapperElement.getBoundingClientRect().height;
	var cellHeight = element.firstElementChild.getBoundingClientRect().height - 2;

	function init() {
		element.ontouchstart = handleTouchStart;
		element.ontouchmove = handleTouchMove;
		element.ontouchend = handleTouchEnd;
	}

	this.scrollTimeUp = function(){
		timeSetY(timeOff + cellHeight);
	}

	this.scrollTimeDown = function(){
		timeSetY(timeOff - cellHeight);
	}

	function handleTouchStart(event){
		mouseGrab = true;
		mouseOff = event.changedTouches[0].clientY;
	}

	function handleTouchMove(event){
		if (mouseGrab)
			element.style.top = timeOff + event.changedTouches[0].clientY - mouseOff + 'px';
	}

	function handleTouchEnd(event){
		mouseGrab = false;
		timeSetY(timeOff + event.changedTouches[0].clientY - mouseOff);
	}

	function timeSetY(y) {
		timeOff = y;

		if (timeOff >= 0)
			timeOff = 0;
		if (timeOff <= -timeHeight + timeViewHeight)
			timeOff = -timeHeight + timeViewHeight;

		element.style.top = timeOff + 'px';
	}

	init();
}