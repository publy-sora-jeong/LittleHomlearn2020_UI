$(function(){
	var swiper_report = new Swiper('.swiper_report', {
		direction: 'horizontal',
		slidesPerView: 1, //화면에 보여질 슬라이드 갯수
		spaceBetween: 0, // 슬라이드 사이의 간격 px 단위
		simulateTouch: true,
		autoplayDisableOnInteraction: false,
		navigation: {
			nextEl: '.swiper_report .swiper-button-next',
			prevEl: '.swiper_report .swiper-button-prev',
		},
		preventClicks : false
	});
});

$(function(){
	var swiper_gallery = new Swiper('.swiper_gallery', {
		direction: 'horizontal',
		slidesPerView: 1, //화면에 보여질 슬라이드 갯수
		spaceBetween: 0, // 슬라이드 사이의 간격 px 단위
		simulateTouch: true,
		autoHeight: true,
		autoplayDisableOnInteraction: false,
		navigation: {
			nextEl: '.gallery .swiper-button-next',
			prevEl: '.gallery .swiper-button-prev',
		},
		preventClicks : false
	});
});