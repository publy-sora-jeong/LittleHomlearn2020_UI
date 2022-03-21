if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
	$("video").each(function() {
		$(this).attr("poster", $(this).attr("src"));
		$(this).parent().find("#attached").hide();
		var seq = $(this).data('seq');
		this.addEventListener('loadeddata', function() {
			loadVideoEnd(seq);
			this.currentTime = 0;
		});
	});
}
var imgXMargin = 40;
var imgYMargin = 40;
function openAttachedImgPopup(seq) {
	popup_page_open('attached_img_' + seq);
}
function loadImageEnd(seq) {
	console.log('loadImageEnd', seq);
	$("#attached_img_" + seq + " .imgBox").css('left', imgXMargin + 'px');
	$("#attached_img_" + seq + " .imgBox").css('right', imgXMargin + 'px');
	$("#attached_img_" + seq + " .imgBox").css('width', 'calc(100% - ' + (imgXMargin * 2) + 'px)');
	var width = window.innerWidth - 80;
	var height = width * $("#attached_img_" + seq + " #attached")[0].height / $("#attached_img_" + seq + " #attached")[0].width;
	$("#attached_img_" + seq + " #attached").css('height', 'auto');
	var offsetTop = (window.innerHeight - height) / 2;
	if (offsetTop < imgYMargin) {
		$("#attached_img_" + seq + " #attached").css('height', height = ((height / 2) - (imgYMargin - offsetTop)) * 2);
		width = height * $("#attached_img_" + seq + " #attached")[0].width / $("#attached_img_" + seq + " #attached")[0].height;
		var margin = (window.innerWidth - width) / 2;
		$("#attached_img_" + seq + " .imgBox").css('left', margin + 'px');
		$("#attached_img_" + seq + " .imgBox").css('right', margin + 'px');
		$("#attached_img_" + seq + " .imgBox").css('width', 'calc(100% - ' + (margin * 2) + 'px)');
	}
	$("#attached_img_" + seq + " #attached").show();
}
function loadVideoEnd(seq) {
	console.log('loadVideoEnd', seq);
	$("#attached_img_" + seq + " .imgBox").css('left', imgXMargin + 'px');
	$("#attached_img_" + seq + " .imgBox").css('right', imgXMargin + 'px');
	$("#attached_img_" + seq + " .imgBox").css('width', 'calc(100% - ' + (imgXMargin * 2) + 'px)');
	var width = window.innerWidth - 80;
	var height = width * $("#attached_img_" + seq + " #attached_video")[0].height / $("#attached_img_" + seq + " #attached_video")[0].width;
	$("#attached_img_" + seq + " #attached_video").css('height', 'auto');
	var offsetTop = (window.innerHeight - height) / 2;
	if (offsetTop < imgYMargin) {
		$("#attached_img_" + seq + " #attached_video").css('height', height = ((height / 2) - (imgYMargin - offsetTop)) * 2);
		width = height * $("#attached_img_" + seq + " #attached_video")[0].width / $("#attached_img_" + seq + " #attached_video")[0].height;
		var margin = (window.innerWidth - width) / 2;
		$("#attached_img_" + seq + " .imgBox").css('left', margin + 'px');
		$("#attached_img_" + seq + " .imgBox").css('right', margin + 'px');
		$("#attached_img_" + seq + " .imgBox").css('width', 'calc(100% - ' + (margin * 2) + 'px)');
	}
	$("#attached_img_" + seq + " #attached").hide();
}
var clicked = false;
function deleteQuestion(seq) {
	if (clicked) return;
	clicked = true;
	confirm("정말 삭제하시겠습니까?", function() {
		$.ajax({
			url: "/ajax/mypage/question/" + seq,
			method: "delete"
		}).done(function(res) {
			location.reload();
		}).fail(function(err) {
			alert(err.responseJSON.error || "에러가 발생했습니다.");
			clicked = false;
		});
	}, function() {
		clicked = false;
	});
}
$(document).ready(function() {
	$(".selectBox select").off('change').on('change', function() {
		if ($(this).val() === '') {
			$(".listBox li").show();
			$(".totalBox .left").text($(".listBox li").length + "건");
			if ($(".listBox li").length === 0) {
				$(".listBox .empty").show();
			} else {
				$(".listBox .empty").hide();
			}
		} else {
			$(".listBox li").hide();
			$(".listBox li." + $(this).val()).show();
			$(".totalBox .left").text($(".listBox li." + $(this).val()).length + "건");
			if ($(".listBox li." + $(this).val()).length === 0) {
				$(".listBox .empty").show();
			} else {
				$(".listBox .empty").hide();
			}
		}
	});
});