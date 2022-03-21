function init() {
	String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
	String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
	Number.prototype.zf = function(len){return this.toString().zf(len);};
	Date.prototype.format = function(f) {
		if (!this.valueOf()) return " ";

		var weekName = ["일", "월", "화", "수", "목", "금", "토"];
		var d = this;
		
		return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
			switch ($1) {
				case "yyyy": return d.getFullYear();
				case "yy": return (d.getFullYear() % 1000).zf(2);
				case "MM": return (d.getMonth() + 1).zf(2);
				case "dd": return d.getDate().zf(2);
				case "E": return weekName[d.getDay()];
				case "HH": return d.getHours().zf(2);
				case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
				case "mm": return d.getMinutes().zf(2);
				case "ss": return d.getSeconds().zf(2);
				case "a/p": return d.getHours() < 12 ? "오전" : "오후";
				default: return $1;
			}
		});
	};
	Number.prototype.won = function() {
		return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
	}
	
	$(".search-address-btn").off('click').on('click', function() {
		var zipcodeId = $(this).data('zipcode-id');
		var addressId = $(this).data('address-id');
		new daum.Postcode({
	        oncomplete: function(data) {
	            $("#" + zipcodeId).val(data.zonecode);
	            $("#" + addressId).val(data.address);
	            $("#daumPostcodeFrame").hide();
	        },
	        width: '100%',
	        height: '100%'
	    }).open();
	});
	
	$(".nav_bg").off('click').on('click', function() {
		$("nav .nav_close").click();
	});
	
	var idx = 0;
	$("p.swiper-pagination-bullet").each(function() {
		$(this).data('idx', idx++);
	});
	
	$("input.input-phone").on('keydown', function() {
		return event.keyCode === 69 || event.keyCode === 109 || event.keyCode === 189 ? false : true;
	});
	
	if ($("#top_banner").length > 0) {
		$.ajax({
			url: "/ajax/banner/" + $("#top_banner").data("banner-seq") + "/view",
			method: "post"
		}).fail(function(err) {
			console.error(err);
		});
	}
	
	if ($("#popup_event").length > 0) {
		$.ajax({
			url: "/ajax/banner/" + $("#popup_event").data("banner-seq") + "/view",
			method: "post"
		}).fail(function(err) {
			console.error(err);
		});
	}
	
	if (typeof initEndCallback === 'function') {
		initEndCallback();
	}
}

function checkEmailAddress(email) {
	var pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/;
	return pattern.test(email);
}

function logout() {
	$.ajax({
		url: "/ajax/logout",
		method: "post"
	}).done(function(res) {
		location.href = "/";
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
}

function onClickSubscribe(device, product_seq, loged_in) {
	if (product_seq == 0) {
		console.log("fail to query experience kit info.");
		return;
	}
	if (device == 'desktop') {
		alert("모바일에서 신청이 가능합니다.<br/>모바일로 접속하시어 신청하여 주시기 바랍니다.");
		return;
	}
	if (!loged_in) {
		confirm("로그인이 필요한 서비스 입니다.", function() {
			location.replace("/login?p=" + encodeURI("/subscribe/01?selected_product_seq=" + product_seq));
		});
		return;
	}
	location.replace("/subscribe/01?selected_product_seq=" + product_seq);
}

function onClickExperience(device, product_seq, loged_in) {
	//location.href = "/experience/01?selected_product_seq=" + product_seq;
	location.href = "/experience/choose?selected_product_seq=" + product_seq;
}

function onClickRelative(device, product_seq, loged_in, subscribe_seq, skip_address) {
	if (product_seq == 0) {
		console.log("fail to query product info.");
		return;
	}
	if (device == 'desktop') {
		alert("모바일에서 신청이 가능합니다.<br/>모바일로 접속하시어 신청하여 주시기 바랍니다.");
		return;
	}
	if (!loged_in) {
		confirm("로그인이 필요한 서비스 입니다.", function() {
			location.replace("/login?p=" + encodeURI("/subscribe/renewal/01?subscribe_seq=" + subscribe_seq + "&selected_product_seq=" + product_seq + "&skip_address=" + (skip_address ? 'y' : 'n')));
		});
		return;
	}
	location.replace("/subscribe/renewal/01?subscribe_seq=" + subscribe_seq + "&selected_product_seq=" + product_seq + "&skip_address=" + (skip_address ? 'y' : 'n'));
}

function hideInicisFrame() {
	$("#inicisFrame").hide();
	$("body").css("overflow", "inherit");
}

window.onload = function() {
	init();
};
function closeDaumPostcode() {
	$("#daumPostcodeFrame").hide();
}

function onClickIndexTabs(idx, fromSide, isSubscribing) {
	if (!isLogin) {
		if (idx === 3) {
			confirm("로그인이 필요한 서비스 입니다.", function() {
				location.href = "/login?p=childLearning";
			});
			return;
		}
	}
	if (idx === 3 && !isSubscribing) {
		alert("리틀홈런을 이용중인 회원만 이용가능한 메뉴입니다.");
		return;
	}
	if (fromSide) {
		$("nav .nav_close").click();
		$("p.swiper-pagination-bullet:nth-child(" + (idx + 1) + ")").click();
	}
}

function linkNeedLogin(url) {
	if (isLogin) {
		location.href = url;
	} else {
		confirm("로그인이 필요한 서비스 입니다.", function() {
			location.href = "/login?p=" + url;
		});
	}
}
