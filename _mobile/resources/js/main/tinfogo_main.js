$(document).ready(function(){ 
	var swiper_video = new Swiper('.swiper_video', {
		direction: 'horizontal',
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		pagination: {
			el: '.videoBox .swiper-pagination',
			clickable: true,
		}
	});
	
	var swiper_banner = new Swiper('.swiper_banner', {
		direction: 'horizontal',
		slidesPerView: 1.3,
		spaceBetween: 10
	});
});

function playVideo(videoKey) {
	$("#youtube_frame").attr("src", "https://www.youtube.com/embed/" + videoKey);
}
function loadYoutubeEnd() {
	if ($("#youtube_frame").attr("src") === '') return;
	var imgXMargin = 40;
	var imgYMargin = 40;
	$("#attached_img .imgBox").css('left', imgXMargin + 'px');
	$("#attached_img .imgBox").css('right', imgXMargin + 'px');
	$("#attached_img .imgBox").css('width', 'calc(100% - ' + (imgXMargin * 2) + 'px)');
	var width = window.innerWidth - 80;
	var height = width * $("#attached_img #youtube_frame")[0].height / $("#attached_img #youtube_frame")[0].width;
	$("#attached_img #youtube_frame").css('width', '100%');
	$("#attached_img #youtube_frame").css('height', 'auto');
	var offsetTop = (window.innerHeight - height) / 2;
	if (offsetTop < imgYMargin) {
		$("#attached_img #youtube_frame").css('height', height = ((height / 2) - (imgYMargin - offsetTop)) * 2);
		width = height * $("#attached_img #youtube_frame")[0].width / $("#attached_img #youtube_frame")[0].height;
		var margin = (window.innerWidth - width) / 2;
		$("#attached_img .imgBox").css('left', margin + 'px');
		$("#attached_img .imgBox").css('right', margin + 'px');
		$("#attached_img .imgBox").css('width', 'calc(100% - ' + (margin * 2) + 'px)');
	}
	$("#attached_img").show();
}
function closeVideo() {
	$("#youtube_frame").attr("src", "");
	$("#attached_img").hide();
}