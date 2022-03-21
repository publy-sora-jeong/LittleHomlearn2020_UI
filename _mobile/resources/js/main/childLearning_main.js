$(document).ready(function(){
	setTimeout(function() {
		swiper_main.updateAutoHeight();
	}, 100);
	var swiper_report_banner = new Swiper('.swiper_report_banner', {
		direction: 'horizontal',
		slidesPerView: 1.15,
		spaceBetween: 10,
		centeredSlides: true,
	});
});
$(window).resize(function() {
	setTimeout(function() {
		swiper_main.updateAutoHeight();
	}, 100);
});

$(function(){
	$(".sticky3 ~ .sticky4").remove();
	if ($(".sticky4").length > 0) {
		$(".sticky3").after($(".sticky4"));
	}
	if($(".swiper-pagination-bullet:nth-of-type(4)").hasClass("swiper-pagination-bullet-active")){
		$("#wraper .mainArea .sticky.sticky3").fadeOut("fast");
		$("#wraper .mainArea .sticky_kids").fadeOut("fast");
		$("#wraper .mainArea .sticky.sticky4").fadeIn("fast");
	}
});

function change_child(seq) {
	$.ajax({
		url: "/member/child/" + seq + "/subscribe_renewal",
		method: "get"
	}).done(function(html) {
		$("#subscribe_renewal").html($('<div>').html(html).find("#subscribe_renewal").html());
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
	$.ajax({
		url: "/member/child/" + seq + "/learning_pause",
		method: "get"
	}).done(function(html) {
		$("#learning_pause").html($('<div>').html(html).find("#learning_pause").html());
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
	$.ajax({
		url: "/member/child/" + seq + "/learning_restart",
		method: "get"
	}).done(function(html) {
		$("#learning_restart").html($('<div>').html(html).find("#learning_restart").html());
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
	$.ajax({
		url: "/member/child/" + seq + "/learning_restart_confirm",
		method: "get"
	}).done(function(html) {
		$("#learning_restart_confirm").html($('<div>').html(html).find("#learning_restart_confirm").html());
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
	$.ajax({
		url: "/member/child/" + seq,
		method: "get"
	}).done(function(html) {
		$("#childLearning_main").html(html);
		setTimeout(function() {
			swiper_main.updateAutoHeight();
		}, 100);
		init();
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
}