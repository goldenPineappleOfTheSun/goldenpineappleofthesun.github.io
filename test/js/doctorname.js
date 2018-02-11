
var doctorsNameObject;

window.addEventListener('load', 
	function(){
		doctorsNameObject = new DoctorsName(document.querySelector('.doctors__table'), document.querySelector('.doctors__table-wrapper'))
	});

DoctorsName = function(element, wrapper){
	var mouseGrab = false;
	var mouseOff = 0;
	var tableOff = 0;
	var tableHeight = element.getBoundingClientRect().height;
	var tableViewHeight = document.querySelector('.doctors__table-wrapper').getBoundingClientRect().height;
	var element = element;
	var wrapperElement = wrapper;

	function init() {
		element.ontouchstart = handleTouchStart;
		element.ontouchmove = handleTouchMove;
		element.ontouchend = handleTouchEnd;
	}

	function tableSetY(y) {
		tableOff = y;

		if (tableOff > 0)
			tableOff = 0;
		if (tableOff < -tableHeight + tableViewHeight)
			tableOff = -tableHeight + tableViewHeight;

		tableOff = Math.round(tableOff / 90) * 90 + (90 - 58);
		if (tableOff > 0)
			tableOff = 0;

		element.style.marginTop = tableOff + 'px';
	}

	function handleTouchStart(event){
		mouseGrab = true;
		mouseOff = event.changedTouches[0].clientY;
	}

	function handleTouchMove(event){
		if (mouseGrab)
			element.style.marginTop = tableOff + event.changedTouches[0].clientY - mouseOff + 'px';
	}

	function handleTouchEnd(event){
		mouseGrab = false;
		tableSetY(tableOff + event.changedTouches[0].clientY - mouseOff);
	}

	this.scrollTableUp = function(){
		tableSetY(tableOff + 90);
	}

	this.scrollTableDown = function(){
		tableSetY(tableOff - 90);
	}

	init();
}