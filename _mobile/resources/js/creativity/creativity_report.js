$(function() {
	var swiper_creativity_report = new Swiper('.swiper_creativity_report', {
		direction : 'horizontal',
		slidesPerView : 1, // 화면에 보여질 슬라이드 갯수
		spaceBetween : 0, // 슬라이드 사이의 간격 px 단위
		simulateTouch : true,
		autoplayDisableOnInteraction : false,
		navigation : {
			nextEl : '.swiper_creativity_report .swiper-button-next',
			prevEl : '.swiper_creativity_report .swiper-button-prev',
		},
		preventClicks : false
	});

	var slideCount = 0;
	swiper_creativity_report.on('transitionEnd', function() {
		slideCount++;
		if (slideCount > swiper_creativity_report.activeIndex) {
			$("#bottom_banner2").addClass("show");
			slideCount = 0;
		}
	});

	$("#bottom_banner2 .xBtn").click(function() {
		$("#bottom_banner2").removeClass("show");
	});
});

// 첫페이지 버튼 숨김
$("html").on(
		'touchend click',
		function(event) {
			if ($("#creativity_report .swiper-slide:nth-of-type(1)").hasClass(
					"swiper-slide-active")) {
				$("#creativity_report .button").hide();
			} else {
				$("#creativity_report .button").show();
			}
		});

function sendReport(resultQuizId) {
	var sendCount = 0;
	var totalSendCount = 0;
	$(".receiver input[type=email]").each(function() {
		if ($(this).val() !== '') {
			totalSendCount++;
		}
	});
	if (totalSendCount === 0) {
		alert("창의력 발달 검사 결과를 받는 메일 주소를 입력하세요.");
		return;
	}
	$(".receiver input[type=email]").each(function() {
		if ($(this).val() === '') return true;
		$.ajax({
			url : "https://io-creative.littlehome-learn.com/v1/admin/quiz/result/" + resultQuizId + "/report",
			method : "put",
			headers : {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'Authorization' : 'Bearer ' + $('#send-btn').data('hash')
			},
			data : JSON.stringify({
				email : $(this).val()
			}),
			success : function() {
				sendCount++;
				if (sendCount === totalSendCount)
					alert("검사결과 전체 메일로 보냈습니다.");
			},
			error : function(err) {
				console.error(err);
			}
		});
	});
}

Kakao.init('9e4f610640b3425f2a497a15896c9b79');

var share_url = "https://littlehome-learn.com/creativity";

function shareKakao() {
	Kakao.Link.sendDefault({
		objectType : 'feed',
		content : {
			title : "창의력 발달 검사 결과",
			description : $("#share_desc").val(),
			imageUrl : $("#share_image").val(),
			link : {
				mobileWebUrl : share_url,
				webUrl : share_url
			}
		},
		buttons : [ {
			title : '웹으로 보기',
			link : {
				mobileWebUrl : share_url,
				webUrl : share_url
			}
		} ]
	}).then(function(res) {
		console.log(res);
	});
}

function shareBlog() {
	var url = encodeURI(encodeURIComponent(share_url));
	var title = encodeURI("창의력 발달 검사 결과");
	window.open('https://share.naver.com/web/shareView.nhn?url=' + url
			+ '&title=' + title);
}

function shareFacebook() {
	var url = "https://www.facebook.com/dialog/share?"
			+ "app_id=1266628346868307" + "&display=popup" + "&href="
			+ encodeURIComponent(share_url);
	window
			.open(
					url,
					"Share to facebook",
					"width=500,height=700,location=no,menubar=no,status=no,scrollbars=no,resizable=no,titlebar=no,toolbar=no");
}

var clicked = false;
function shareSms() {
	if (clicked)
		return;
	clicked = true;
	$.ajax({
		url : "/ajax/event/" + location.href.split('/').pop() + "/share/sms",
		method : "post"
	}).done(function(res) {
		alert("공유가 완료되었습니다.");
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
}

function copyToClipboard() {
	var input = $("#share-url")[0];
	input.select();
	input.setSelectionRange(0, 99999);
	document.execCommand('copy');
	$("#share-url").blur();
	alert("url 복사가 완료되었습니다.");
}

function addEmailInput() {
	if ($(".receiver").length >= 5) {
		return;
	}
	var id = "receiver-" + Date.now();
	$("#emailInputContainer").append('<div class="inputBox receiver" id="' + id + '"><input type="email" value=""><a href="javascript:removeEmailInput(\'#' + id + '\');">-</a></div>');
}
function removeEmailInput(id) {
	if ($(".receiver").length <= 1) {
		return;
	}
	$(id).remove();
}

function getRatingTitle(type, score) {
	switch (type) {
	case 'MI11':
		return '유창성(' + score + ')';
	case 'MI12':
		return '융통성(' + score + ')';
	case 'MI13':
		return '정교성(' + score + ')';
	case 'MI14':
		return '상상력(' + score + ')';
	case 'MI21':
		return '호기심(' + score + ')';
	case 'MI22':
		return '사회성(' + score + ')';
	case 'MI23':
		return '자신감(' + score + ')';
	case 'MI24':
		return '집중력(' + score + ')';
	case 'MI31':
		return '내용이해(' + score + ')';
	case 'MI32':
		return '단어표현(' + score + ')';
	case 'MI33':
		return '문장표현(' + score + ')';
	default:
		return '미정의(' + score + ')';
	}
}

function initChart(id, labels, curRadarLabels, scores, compareRadarRabel,
		compareScores) {
	const colors = [ '#69c9f2', '#9cc83b', '#e82377', '#ed8222', '#f4d40d',
			'#9737d4', '#4cc1ba', '#1a81c4' ];
	return new Chart(
			document.getElementById(id).getContext('2d'),
			{
				type : 'radar',
				data : {
					labels : labels,
					datasets : [ {
						labels : curRadarLabels,
						backgroundColor : 'rgba(255, 0, 0, 0.2)',
						borderColor : 'rgba(197, 197, 197, 1)',
						borderWidth : 2,
						radius : 1,
						pointRadius : 2.5,
						pointBorderWidth : 1.5,
						pointBackgroundColor : 'white',
						pointBorderColor : colors,
						fill : false,
						data : scores,
					}, {
						labels : compareRadarRabel,
						backgroundColor : 'rgba(190, 224, 222, 0.5)',
						borderColor : 'rgba(82, 172, 168, 1)',
						borderWidth : 1,
						pointBorderWidth : 0,
						pointRadius : 0,
						data : compareScores,
					}, ],
				},
				options : {
					legend : {
						display : false,
						position : 'bottom',
						labels : {
							fontColor : 'rgb(255, 99, 132)',
						},
					},
					title : {
						display : false,
					},
					scale : {
						ticks : {
							beginAtZero : true,
							min : 0,
							max : 5,
							stepSize : 1,
							display : false,
						},
						gridLines : {
							display : true,
							color : 'rgba(242, 242, 242, 1)',
							offsetGridLines : false,
						},
						angleLines : {
							display : true,
							color : 'rgba(242, 242, 242, 1)',
							lineWidth : 0.5,
						},
						pointLabels : {
							fontSize : 9,
							fontFamily : 'NotoSansKR',
							display : true,
							fontColor : colors,
						},
					},
					tooltips : {
						callbacks : {
							label : getTooltipLabel = function(tooltipItem,
									data) {
								const dataset = data.datasets[tooltipItem.datasetIndex];
								const index = tooltipItem.index;
								return dataset.labels ? dataset.labels[index]
										: dataset.label + ': '
												+ dataset.data[index];
							},
						},
					},
				},
			});
}
