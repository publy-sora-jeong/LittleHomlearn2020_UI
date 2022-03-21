$("#datepicker .bottomBtn .xBtn").off('click').on('click', function() {
	if (curr_popup_open_method === 'popup_page_open') {
		$("#datepicker").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
	}
	if (curr_popup_open_method === 'popup_to_popup') {
		$("#datepicker").hide();
		$("#" + prev_opened_popup).show();
	}
});
$("#datepicker .bottomBtn .btn02").off('click').on('click', function() {
	var year = $("#datepicker .datepicerBox .year .active").data('val');
	var month = $("#datepicker .datepicerBox .month .active").data('val');
	if (month < 10) month = '0' + month;
	var date = $("#datepicker .datepicerBox .date .active").data('val');
	if (date < 10) date = '0' + date;
	if (on_complete_popup !== null) {
		on_complete_popup(year, month, date);
	}
	$("#datepicker .bottomBtn .xBtn").click();
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
function resetDatepicker() {
	var minDateValue = $("#date-picker-min-date").val();
	var activeYear = parseInt(minDateValue.split("-")[0]);
	var activeMonth = parseInt(minDateValue.split("-")[1]);
	var activeDate = parseInt(minDateValue.split("-")[2]);
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
function handleTouchEnd(evt) {
	xDown = null;
	yDown = null;
	var activeYear = parseInt($("#datepicker .datepicerBox .year .active").data('val'));
	var activeMonth = parseInt($("#datepicker .datepicerBox .month .active").data('val'));
	var activeDate = parseInt($("#datepicker .datepicerBox .date .active").data('val'));
	var active = new Date(activeYear, activeMonth - 1, activeDate);
	if ($("#date-picker-min-date").length > 0) {
		var minDateValue = $("#date-picker-min-date").val();
		var minYear = parseInt(minDateValue.split("-")[0]);
		var minMonth = parseInt(minDateValue.split("-")[1]);
		var minDate = parseInt(minDateValue.split("-")[2]);
		var min = new Date(minYear, minMonth - 1, minDate);
		if (min.getTime() > active.getTime()) {
			activeYear = minYear;
			activeMonth = minMonth;
			activeDate = minDate;
			active = min;
		}
	}
	resetYear(active);
	resetMonth(active);
	resetDate(active);
}
/// !swipe event handler
function resetYear(active, add) {
	if (add === undefined) add = 0;
	var activeYear = active.getFullYear() + add;
	$("#datepicker .datepicerBox .year li").remove();
	$("#datepicker .datepicerBox .year").append('<li data-val="' + (activeYear - 2) + '">' + (activeYear - 2) + '년</li>');
	$("#datepicker .datepicerBox .year").append('<li data-val="' + (activeYear - 1) + '">' + (activeYear - 1) + '년</li>');
	$("#datepicker .datepicerBox .year").append('<li data-val="' + (activeYear) + '" class="active">' + (activeYear) + '년</li>');
	$("#datepicker .datepicerBox .year").append('<li data-val="' + (activeYear + 1) + '">' + (activeYear + 1) + '년</li>');
	$("#datepicker .datepicerBox .year").append('<li data-val="' + (activeYear + 2) + '">' + (activeYear + 2) + '년</li>');
	$("#datepicker .datepicerBox .year").css("top", "-30px");
}
function resetMonth(active, add) {
	if (add === undefined) add = 0;
	var activeMonth = active.getMonth() + 1 + add;
	$("#datepicker .datepicerBox .month li").remove();
	if (activeMonth - 2 < 1) {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth + 10) + '">' + (activeMonth + 10) + '월</li>');
	} else {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth - 2) + '">' + (activeMonth - 2) + '월</li>');
	}
	if (activeMonth - 1 < 1) {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth + 11) + '">' + (activeMonth + 11) + '월</li>');
	} else {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth - 1) + '">' + (activeMonth - 1) + '월</li>');
	}
	$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth) + '" class="active">' + (activeMonth) + '월</li>');
	if (activeMonth + 1 > 12) {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth - 11) + '">' + (activeMonth - 11) + '월</li>');
	} else {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth + 1) + '">' + (activeMonth + 1) + '월</li>');
	}
	if (activeMonth + 2 > 12) {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth - 10) + '">' + (activeMonth - 10) + '월</li>');
	} else {
		$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth + 2) + '">' + (activeMonth + 2) + '월</li>');
	}
	$("#datepicker .datepicerBox .month").css("top", "-30px");
}
function resetDate(active, resetCss) {
	if (resetCss === undefined) resetCss = true;
	var activeDate = active.getDate();
	var currentLastDateOfMonth = active.getMonth() + 1 > 11 ? new Date(active.getFullYear(), active.getMonth() - 11, 0).getDate() : new Date(active.getFullYear(), active.getMonth() + 1, 0).getDate();
	var prevLastDateOfMonth = new Date(active.getFullYear(), active.getMonth(), 0).getDate();
	if (activeDate > currentLastDateOfMonth) {
		activeDate = currentLastDateOfMonth;
	}
	$("#datepicker .datepicerBox .date li").remove();
	if (activeDate - 2 < 1) {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate - 2 + prevLastDateOfMonth) + '">' + (activeDate - 2 + prevLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate - 2) + '">' + (activeDate - 2) + '일</li>');
	}
	if (activeDate - 1 < 1) {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate - 1 + prevLastDateOfMonth) + '">' + (activeDate - 1 + prevLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate - 1) + '">' + (activeDate - 1) + '일</li>');
	}
	$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate) + '" class="active">' + (activeDate) + '일</li>');
	if (activeDate + 1 > currentLastDateOfMonth) {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate + 1 - currentLastDateOfMonth) + '">' + (activeDate + 1 - currentLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate + 1) + '">' + (activeDate + 1) + '일</li>');
	}
	if (activeDate + 2 > currentLastDateOfMonth) {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate + 2 - currentLastDateOfMonth) + '">' + (activeDate + 2 - currentLastDateOfMonth) + '일</li>');
	} else {
		$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate + 2) + '">' + (activeDate + 2) + '일</li>');
	}
	if (resetCss)
		$("#datepicker .datepicerBox .date").css("top", "-30px");
}

var prevPrepend = false;
var prevAppend = false;
function onSwipeYear(yDiff) {
	var currentTop = parseFloat($("#datepicker .datepicerBox .year").css("top").replace("px", ''));
	$("#datepicker .datepicerBox .year").css("top", currentTop + yDiff);
	currentTop = parseFloat($("#datepicker .datepicerBox .year").css("top").replace("px", ''));
	if (currentTop > -15) {
		if ($("#datepicker .datepicerBox .year li").length == 5) {
			$("#datepicker .datepicerBox .year li:nth-child(2)").addClass("active");
			$("#datepicker .datepicerBox .year li:nth-child(3)").removeClass("active");
			$("#datepicker .datepicerBox .year li:nth-child(5)").remove();
			var activeYear = parseInt($("#datepicker .datepicerBox .year .active").data('val'));
			$("#datepicker .datepicerBox .year").prepend('<li data-val="' + (activeYear - 2) + '">' + (activeYear - 2) + '년</li>');
			$("#datepicker .datepicerBox .year").css("top", currentTop - 30);
			prevPrepend = true;
		}
	}
	if (currentTop < -45) {
		if ($("#datepicker .datepicerBox .year li").length == 5) {
			$("#datepicker .datepicerBox .year li:nth-child(3)").removeClass("active");
			$("#datepicker .datepicerBox .year li:nth-child(4)").addClass("active");
			$("#datepicker .datepicerBox .year li:nth-child(1)").remove();
			var activeYear = parseInt($("#datepicker .datepicerBox .year .active").data('val'));
			$("#datepicker .datepicerBox .year").append('<li data-val="' + (activeYear + 2) + '">' + (activeYear + 2) + '년</li>');
			$("#datepicker .datepicerBox .year").css("top", currentTop + 30);
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
	var currentTop = parseFloat($("#datepicker .datepicerBox .month").css("top").replace("px", ''));
	$("#datepicker .datepicerBox .month").css("top", currentTop + yDiff);
	currentTop = parseFloat($("#datepicker .datepicerBox .month").css("top").replace("px", ''));
	if (currentTop > -15) {
		if ($("#datepicker .datepicerBox .month li").length == 5) {
			$("#datepicker .datepicerBox .month li:nth-child(2)").addClass("active");
			$("#datepicker .datepicerBox .month li:nth-child(3)").removeClass("active");
			$("#datepicker .datepicerBox .month li:nth-child(5)").remove();
			var activeYear = parseInt($("#datepicker .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			if (activeMonth - 2 < 1) {
				$("#datepicker .datepicerBox .month").prepend('<li data-val="' + (activeMonth + 10) + '">' + (activeMonth + 10) + '월</li>');
			} else {
				$("#datepicker .datepicerBox .month").prepend('<li data-val="' + (activeMonth - 2) + '">' + (activeMonth - 2) + '월</li>');
			}
			$("#datepicker .datepicerBox .month").css("top", currentTop - 30);
			prevPrepend = true;
			if (activeMonth == 12) {
				resetYear(active, -1);
			}
			resetDate(active);
		}
	}
	if (currentTop < -45) {
		if ($("#datepicker .datepicerBox .month li").length == 5) {
			$("#datepicker .datepicerBox .month li:nth-child(3)").removeClass("active");
			$("#datepicker .datepicerBox .month li:nth-child(4)").addClass("active");
			$("#datepicker .datepicerBox .month li:nth-child(1)").remove();
			var activeYear = parseInt($("#datepicker .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			if (activeMonth + 2 > 12) {
				$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth - 10) + '">' + (activeMonth - 10) + '월</li>');
			} else {
				$("#datepicker .datepicerBox .month").append('<li data-val="' + (activeMonth + 2) + '">' + (activeMonth + 2) + '월</li>');
			}
			$("#datepicker .datepicerBox .month").css("top", currentTop + 30);
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
	var currentTop = parseFloat($("#datepicker .datepicerBox .date").css("top").replace("px", ''));
	$("#datepicker .datepicerBox .date").css("top", currentTop + yDiff);
	currentTop = parseFloat($("#datepicker .datepicerBox .date").css("top").replace("px", ''));
	if (currentTop > -15) {
		if ($("#datepicker .datepicerBox .date li").length == 5) {
			$("#datepicker .datepicerBox .date li:nth-child(2)").addClass("active");
			$("#datepicker .datepicerBox .date li:nth-child(3)").removeClass("active");
			$("#datepicker .datepicerBox .date li:nth-child(5)").remove();
			var activeYear = parseInt($("#datepicker .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			var currentLastDateOfMonth = active.getMonth() + 1 > 11 ? new Date(active.getFullYear(), active.getMonth() - 11, 0).getDate() : new Date(active.getFullYear(), active.getMonth() + 1, 0).getDate();
			var prevLastDateOfMonth = new Date(active.getFullYear(), active.getMonth(), 0).getDate();
			if (activeDate - 2 < 1) {
				$("#datepicker .datepicerBox .date").prepend('<li data-val="' + (activeDate - 2 + prevLastDateOfMonth) + '">' + (activeDate - 2 + prevLastDateOfMonth) + '월</li>');
			} else {
				$("#datepicker .datepicerBox .date").prepend('<li data-val="' + (activeDate - 2) + '">' + (activeDate - 2) + '월</li>');
			}
			$("#datepicker .datepicerBox .date").css("top", currentTop - 30);
			prevPrepend = true;
			if (activeDate == prevLastDateOfMonth) {
				resetMonth(active, -1);
			}
		}
	}
	if (currentTop < -45) {
		if ($("#datepicker .datepicerBox .date li").length == 5) {
			$("#datepicker .datepicerBox .date li:nth-child(3)").removeClass("active");
			$("#datepicker .datepicerBox .date li:nth-child(4)").addClass("active");
			$("#datepicker .datepicerBox .date li:nth-child(1)").remove();
			var activeYear = parseInt($("#datepicker .datepicerBox .year .active").data('val'));
			var activeMonth = parseInt($("#datepicker .datepicerBox .month .active").data('val'));
			var activeDate = parseInt($("#datepicker .datepicerBox .date .active").data('val'));
			var active = new Date(activeYear, activeMonth - 1, activeDate);
			if (active.getTime() > new Date().getTime()) {
				active = new Date();
			}
			var currentLastDateOfMonth = active.getMonth() + 1 > 11 ? new Date(active.getFullYear(), active.getMonth() - 11, 0).getDate() : new Date(active.getFullYear(), active.getMonth() + 1, 0).getDate();
			var prevLastDateOfMonth = new Date(active.getFullYear(), active.getMonth(), 0).getDate();
			if (activeDate + 2 > currentLastDateOfMonth) {
				$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate + 2 - currentLastDateOfMonth) + '">' + (activeDate + 2 - currentLastDateOfMonth) + '월</li>');
			} else {
				$("#datepicker .datepicerBox .date").append('<li data-val="' + (activeDate + 2) + '">' + (activeDate + 2) + '월</li>');
			}
			$("#datepicker .datepicerBox .date").css("top", currentTop + 30);
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