$("#datepicker_pause .bottomBtn .btn01").off('click').on('click', function() {
	popup_to_popup('learning_pause', 'datepicker_pause');
});
$("#datepicker_pause .bottomBtn .btn02").off('click').on('click', function() {
	var year = $("#datepicker_pause .datepicerBox .year .active").data('val');
	var month = $("#datepicker_pause .datepicerBox .month .active").data('val');
	if (month < 10) month = '0' + month;
	var date = $("#datepicker_pause .datepicerBox .date .active").data('val');
	if (date < 10) date = '0' + date;
	$("#birthday").val(year + '-' + month + '-' + date);
	popup_to_popup('learning_pause', 'datepicker_pause');
});

/// swipe event handler
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

var xDown = null;
var yDown = null;

var xLast = null;
var yLast = null;

var scrollStartOnYear = false;
var scrollStartOnMonth = false;
var scrollStartOnDate = false;

function getTouches(evt) {
	return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt) {
	const firstTouch = getTouches(evt)[0];
	xLast = xDown = firstTouch.clientX;
	yLast = yDown = firstTouch.clientY;
	scrollStartOnYear = $(evt.target).parent().hasClass("year");
	scrollStartOnMonth = $(evt.target).parent().hasClass("month");
	scrollStartOnDate = $(evt.target).parent().hasClass("date");
}

function handleTouchMove(evt) {
	if (!xDown || !yDown) return;

	const xUp = evt.touches[ 0 ].clientX;
	const yUp = evt.touches[ 0 ].clientY;

	const xDiff = xLast - xUp;
	const yDiff = yLast - yUp;

	if (Math.abs(xDiff) < Math.abs(yDiff)) {
		if (scrollStartOnYear)
			onSwipeYear(-yDiff);
		else if (scrollStartOnMonth)
			onSwipeMonth(-yDiff);
		else if (scrollStartOnDate)
			onSwipeDate(-yDiff);
	}

	xLast = xUp;
	yLast = yUp;
}

function handleTouchEnd(evt) {
	xDown = null;
	yDown = null;
	var activeYear = parseInt($("#datepicker_pause .datepicerBox .year .active").data('val'));
	var activeMonth = parseInt($("#datepicker_pause .datepicerBox .month .active").data('val'));
	var activeDate = parseInt($("#datepicker_pause .datepicerBox .date .active").data('val'));
	var active = new Date(activeYear, activeMonth - 1, activeDate);
	/* if (active.getTime() > new Date().getTime()) {
		active = new Date();
	} */
	if (scrollStartOnYear) {
		scrollStartOnYear = false;
		resetYear(active);
	}
	if (scrollStartOnMonth) {
		scrollStartOnMonth = false;
		resetYear(active);
		resetMonth(active);
	}
	if (scrollStartOnDate) {
		scrollStartOnDate = false;
		resetYear(active);
		resetMonth(active);
		resetDate(active);
	}
}
/// !swipe event handler
function resetYear(active, add) {
	if (add === undefined) add = 0;
	var activeYear = active.getFullYear() + add;
	$("#datepicker_pause .datepicerBox .year li").remove();
	$("#datepicker_pause .datepicerBox .year").append('<li data-val="' + (activeYear - 2) + '">' + (activeYear - 2) + '년</li>');
	$("#datepicker_pause .datepicerBox .year").append('<li data-val="' + (activeYear - 1) + '">' + (activeYear - 1) + '년</li>');
	$("#datepicker_pause .datepicerBox .year").append('<li data-val="' + (activeYear) + '" class="active">' + (activeYear) + '년</li>');
	$("#datepicker_pause .datepicerBox .year").append('<li data-val="' + (activeYear + 1) + '">' + (activeYear + 1) + '년</li>');
	$("#datepicker_pause .datepicerBox .year").append('<li data-val="' + (activeYear + 2) + '">' + (activeYear + 2) + '년</li>');
	$("#datepicker_pause .datepicerBox .year").css("top", "-30px");
}
function resetMonth(active, add) {
	if (add === undefined) add = 0;
	var activeMonth = active.getMonth() + 1 + add;
	$("#datepicker_pause .datepicerBox .month li").remove();
	if (activeMonth - 2 < 1) {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth + 10) + '">' + (activeMonth + 10) + '월</li>');
	} else {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth - 2) + '">' + (activeMonth - 2) + '월</li>');
	}
	if (activeMonth - 1 < 1) {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth + 11) + '">' + (activeMonth + 11) + '월</li>');
	} else {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth - 1) + '">' + (activeMonth - 1) + '월</li>');
	}
	$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth) + '" class="active">' + (activeMonth) + '월</li>');
	if (activeMonth + 1 > 12) {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth - 11) + '">' + (activeMonth - 11) + '월</li>');
	} else {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth + 1) + '">' + (activeMonth + 1) + '월</li>');
	}
	if (activeMonth + 2 > 12) {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth - 10) + '">' + (activeMonth - 10) + '월</li>');
	} else {
		$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth + 2) + '">' + (activeMonth + 2) + '월</li>');
	}
	$("#datepicker_pause .datepicerBox .month").css("top", "-30px");
}
function resetDate(active, resetCss) {
	if (resetCss === undefined) resetCss = true;
	var activeDate = active.getDate();
	var currentLastDateOfMonth = active.getMonth() + 1 > 11 ? new Date(active.getFullYear(), active.getMonth() - 11, 0).getDate() : new Date(active.getFullYear(), active.getMonth() + 1, 0).getDate();
	var prevLastDateOfMonth = new Date(active.getFullYear(), active.getMonth(), 0).getDate();
	if (activeDate > currentLastDateOfMonth) {
		activeDate = currentLastDateOfMonth;
	}
	$("#datepicker_pause .datepicerBox .date li").remove();
	if (activeDate - 2 < 1) {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate - 2 + prevLastDateOfMonth) + '">' + (activeDate - 2 + prevLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate - 2) + '">' + (activeDate - 2) + '일</li>');
	}
	if (activeDate - 1 < 1) {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate - 1 + prevLastDateOfMonth) + '">' + (activeDate - 1 + prevLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate - 1) + '">' + (activeDate - 1) + '일</li>');
	}
	$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate) + '" class="active">' + (activeDate) + '일</li>');
	if (activeDate + 1 > currentLastDateOfMonth) {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate + 1 - currentLastDateOfMonth) + '">' + (activeDate + 1 - currentLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate + 1) + '">' + (activeDate + 1) + '일</li>');
	}
	if (activeDate + 2 > currentLastDateOfMonth) {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate + 2 - currentLastDateOfMonth) + '">' + (activeDate + 2 - currentLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate + 2) + '">' + (activeDate + 2) + '일</li>');
	}
	if (resetCss)
		$("#datepicker_pause .datepicerBox .date").css("top", "-30px");
}

var prevPrepend = false;
var prevAppend = false;
function onSwipeYear(yDiff) {
	var currentTop = parseFloat($("#datepicker_pause .datepicerBox .year").css("top").replace("px", ''));
	$("#datepicker_pause .datepicerBox .year").css("top", currentTop + yDiff);
	currentTop = parseFloat($("#datepicker_pause .datepicerBox .year").css("top").replace("px", ''));
	if (currentTop > -15) {
		if ($("#datepicker_pause .datepicerBox .year li").length == 5) {
			$("#datepicker_pause .datepicerBox .year li:nth-child(2)").addClass("active");
			$("#datepicker_pause .datepicerBox .year li:nth-child(3)").removeClass("active");
			$("#datepicker_pause .datepicerBox .year li:nth-child(5)").remove();
			var activeYear = parseInt($("#datepicker_pause .datepicerBox .year .active").data('val'));
			$("#datepicker_pause .datepicerBox .year").prepend('<li data-val="' + (activeYear - 2) + '">' + (activeYear - 2) + '년</li>');
			$("#datepicker_pause .datepicerBox .year").css("top", currentTop - 30);
			prevPrepend = true;
		}
	}
	if (currentTop < -45) {
		if ($("#datepicker_pause .datepicerBox .year li").length == 5) {
			$("#datepicker_pause .datepicerBox .year li:nth-child(3)").removeClass("active");
			$("#datepicker_pause .datepicerBox .year li:nth-child(4)").addClass("active");
			$("#datepicker_pause .datepicerBox .year li:nth-child(1)").remove();
			var activeYear = parseInt($("#datepicker_pause .datepicerBox .year .active").data('val'));
			$("#datepicker_pause .datepicerBox .year").append('<li data-val="' + (activeYear + 2) + '">' + (activeYear + 2) + '년</li>');
			$("#datepicker_pause .datepicerBox .year").css("top", currentTop + 30);
			prevAppend = true;
		}
	}
	if (currentTop >= -45 && currentTop <= -15) {
		if (prevPrepend) {
			prevPrepend = false;
		}
		if (prevAppend) {
			prevAppend = false;
		}
	}
}
function onSwipeMonth(yDiff) {
	var currentTop = parseFloat($("#datepicker_pause .datepicerBox .month").css("top").replace("px", ''));
	$("#datepicker_pause .datepicerBox .month").css("top", currentTop + yDiff);
	currentTop = parseFloat($("#datepicker_pause .datepicerBox .month").css("top").replace("px", ''));
	if (currentTop > -15) {
		if ($("#datepicker_pause .datepicerBox .month li").length == 5) {
			$("#datepicker_pause .datepicerBox .month li:nth-child(2)").addClass("active");
			$("#datepicker_pause .datepicerBox .month li:nth-child(3)").removeClass("active");
			$("#datepicker_pause .datepicerBox .month li:nth-child(5)").remove();
			var activeYear = parseInt($("#datepicker_pause .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker_pause .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker_pause .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			if (activeMonth - 2 < 1) {
				$("#datepicker_pause .datepicerBox .month").prepend('<li data-val="' + (activeMonth + 10) + '">' + (activeMonth + 10) + '월</li>');
			} else {
				$("#datepicker_pause .datepicerBox .month").prepend('<li data-val="' + (activeMonth - 2) + '">' + (activeMonth - 2) + '월</li>');
			}
			$("#datepicker_pause .datepicerBox .month").css("top", currentTop - 30);
			prevPrepend = true;
			if (activeMonth == 12) {
				resetYear(active, -1);
			}
			resetDate(active);
		}
	}
	if (currentTop < -45) {
		if ($("#datepicker_pause .datepicerBox .month li").length == 5) {
			$("#datepicker_pause .datepicerBox .month li:nth-child(3)").removeClass("active");
			$("#datepicker_pause .datepicerBox .month li:nth-child(4)").addClass("active");
			$("#datepicker_pause .datepicerBox .month li:nth-child(1)").remove();
			var activeYear = parseInt($("#datepicker_pause .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker_pause .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker_pause .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			if (activeMonth + 2 > 12) {
				$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth - 10) + '">' + (activeMonth - 10) + '월</li>');
			} else {
				$("#datepicker_pause .datepicerBox .month").append('<li data-val="' + (activeMonth + 2) + '">' + (activeMonth + 2) + '월</li>');
			}
			$("#datepicker_pause .datepicerBox .month").css("top", currentTop + 30);
			prevAppend = true;
			if (activeMonth == 1) {
				resetYear(active, 1);
			}
			resetDate(active);
		}
	}
	if (currentTop >= -45 && currentTop <= -15) {
		if (prevPrepend) {
			prevPrepend = false;
		}
		if (prevAppend) {
			prevAppend = false;
		}
	}
}
function onSwipeDate(yDiff) {
	var currentTop = parseFloat($("#datepicker_pause .datepicerBox .date").css("top").replace("px", ''));
	$("#datepicker_pause .datepicerBox .date").css("top", currentTop + yDiff);
	currentTop = parseFloat($("#datepicker_pause .datepicerBox .date").css("top").replace("px", ''));
	if (currentTop > -15) {
		if ($("#datepicker_pause .datepicerBox .date li").length == 5) {
			$("#datepicker_pause .datepicerBox .date li:nth-child(2)").addClass("active");
			$("#datepicker_pause .datepicerBox .date li:nth-child(3)").removeClass("active");
			$("#datepicker_pause .datepicerBox .date li:nth-child(5)").remove();
			var activeYear = parseInt($("#datepicker_pause .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker_pause .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker_pause .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			var currentLastDateOfMonth = active.getMonth() + 1 > 11 ? new Date(active.getFullYear(), active.getMonth() - 11, 0).getDate() : new Date(active.getFullYear(), active.getMonth() + 1, 0).getDate();
			var prevLastDateOfMonth = new Date(active.getFullYear(), active.getMonth(), 0).getDate();
			if (activeDate - 2 < 1) {
				$("#datepicker_pause .datepicerBox .date").prepend('<li data-val="' + (activeDate - 2 + prevLastDateOfMonth) + '">' + (activeDate - 2 + prevLastDateOfMonth) + '월</li>');
			} else {
				$("#datepicker_pause .datepicerBox .date").prepend('<li data-val="' + (activeDate - 2) + '">' + (activeDate - 2) + '월</li>');
			}
			$("#datepicker_pause .datepicerBox .date").css("top", currentTop - 30);
			prevPrepend = true;
			if (activeDate == prevLastDateOfMonth) {
				resetMonth(active, -1);
			}
		}
	}
	if (currentTop < -45) {
		if ($("#datepicker_pause .datepicerBox .date li").length == 5) {
			$("#datepicker_pause .datepicerBox .date li:nth-child(3)").removeClass("active");
			$("#datepicker_pause .datepicerBox .date li:nth-child(4)").addClass("active");
			$("#datepicker_pause .datepicerBox .date li:nth-child(1)").remove();
			var activeYear = parseInt($("#datepicker_pause .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker_pause .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker_pause .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			var currentLastDateOfMonth = active.getMonth() + 1 > 11 ? new Date(active.getFullYear(), active.getMonth() - 11, 0).getDate() : new Date(active.getFullYear(), active.getMonth() + 1, 0).getDate();
			var prevLastDateOfMonth = new Date(active.getFullYear(), active.getMonth(), 0).getDate();
			if (activeDate + 2 > currentLastDateOfMonth) {
				$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate + 2 - currentLastDateOfMonth) + '">' + (activeDate + 2 - currentLastDateOfMonth) + '월</li>');
			} else {
				$("#datepicker_pause .datepicerBox .date").append('<li data-val="' + (activeDate + 2) + '">' + (activeDate + 2) + '월</li>');
			}
			$("#datepicker_pause .datepicerBox .date").css("top", currentTop + 30);
			prevAppend = true;
			if (activeDate == 1) {
				resetMonth(active, 1);
			}
		}
	}
	if (currentTop >= -45 && currentTop <= -15) {
		if (prevPrepend) {
			prevPrepend = false;
		}
		if (prevAppend) {
			prevAppend = false;
		}
	}
}