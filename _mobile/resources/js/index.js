$(function () {
	var posY;

	// 메뉴열기
	$("header .menu_toggle").click(function () {
		$("nav, nav .bottomBox").addClass("left0");
		$(".nav_bg").show();

		posY = $(window).scrollTop();
		$("html, body").addClass("bgFix");
		$("#wraper").addClass("position");
		$("#wraper").css("top", -posY);
	});

	// 메뉴닫기
	$("nav .nav_close").click(function () {
		$("nav, nav .bottomBox").removeClass("left0");
		$(".nav_bg").hide();

		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		posY = $(window).scrollTop(posY);
	});
});

//틴포GO 03 영역 서브 메뉴 클릭 시 섹션 이동
function fnMove(seq) {
	var offset = $(".section0" + seq).offset();
	$('html, body').animate({
		scrollTop: offset.top - 50
	}, 400);
}

function openSubscribePopup() {
	$("#bottom_banner").addClass("show");
}

//틴포GO 03 영역 서브 메뉴 클릭 시 메뉴 활성화
$(function () {
	$("#tinfogo_sec03_menu .menuBox a").click(function () {
		$("#tinfogo_sec03_menu .menuBox a").removeClass("active");
		$(this).addClass("active");
	});
});

// 구독신청 클릭시
$(function () {
	$("#tinfogo_sec03_menu .menuBox .subscribe_btn").click(function () {
		$("#bottom_banner").addClass("show");
	});
});

// 메인 틴포GO 화면일때
/*$("html").on('touchend click', function(event) {
	if($(".swiper-pagination-bullet:nth-of-type(2)").hasClass("swiper-pagination-bullet-active")){
		$("#wraper .mainArea .sticky.sticky3").fadeIn("fast"); // 틴포GO 하단 고정 버튼
		$("#wraper .mainArea .sticky.sticky4").fadeOut("fast");
		$(window).scroll(function() { // 틴포GO 하단 배너 화면하단에 도달시 나옴
			if ($(this).scrollTop() >= Math.ceil($('.tinfogo_main .section05').offset().top - 220)) {
				$("#bottom_banner").addClass("show");
			} else{
				$("#bottom_banner").removeClass("show");
			}
		});
	} else if($(".swiper-pagination-bullet:nth-of-type(3)").hasClass("swiper-pagination-bullet-active")){
		$("#wraper .mainArea .sticky.sticky3").fadeOut("fast");
		$("#wraper .mainArea .sticky.sticky4").fadeIn("fast");
	} else{
		$("#wraper .mainArea .sticky.sticky3").fadeOut("fast"); // 틴포GO 하단 고정 버튼
		$("#wraper .mainArea .sticky.sticky4").fadeOut("fast");
		$("#bottom_banner").removeClass("show");
	}
})*/
;

//틴포GO 하단 배너 엑스버튼
$(function () {
	$(".bottom_banner .xBtn").click(function () {
		$(".bottom_banner").removeClass("show");
	});
});

//자녀학습관리 페이지 일때
/*$("html").on('touchend click', function(event) {
	if($(".swiper-pagination-bullet:nth-of-type(3)").hasClass("swiper-pagination-bullet-active")){
		$("#wraper .mainArea").addClass("child_learning");
	} else{
		$("#wraper .mainArea").removeClass("child_learning");
	}
});*/

//상단 베너 닫기
function top_banner_close() {
	$("#top_banner").hide();
}

function relative(device, relative_seq, isLogin) {
	popup_page_open('subscribe_renewal', function () {
		onClickRelative(device, relative_seq, isLogin, currentSubscribe_seq, true);
	}, function () {
		onClickRelative(device, relative_seq, isLogin, currentSubscribe_seq, false);
	});
}