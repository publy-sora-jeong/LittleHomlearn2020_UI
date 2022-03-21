// SMS, 이메일 체크 시 아래 입력박스 나옴
$(document).ready(function() {
    $("#check-phone").click(function(){
		if($(this).is(':checked')) {
			$(".hidden_form").addClass("phone_show");
		} else{
			$(".hidden_form").removeClass("phone_show");
		}
	});
	$("#check-email").click(function(){
		if($(this).is(':checked')) {
			$(".hidden_form").addClass("email_show");
		} else{
			$(".hidden_form").removeClass("email_show");
		}
	});
	$("#content").on('input', function() {
		this.value = this.value.replace(/[^0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\;\:\'\",.\<\>\|\/\?\\\n\s]/g, '');
	});
});

function afterUploadFile(result, type) {
	$(".fileBtn").text('첨부완료 (1개)');
}

var complete_msg = "";
$("#email-select").off('change').on('change', function() {
	$("#email2").val($(this).val());
	if ($(this).val() === '') {
		$("#email2").removeAttr("readonly");
	} else {
		$("#email2").attr("readonly", "readonly");
	}
});
var clicked = false;
function _confirm() {
	if (clicked) return;
	clicked = true;
	if ($("#agree").length > 0) {
		if (!$("#agree").prop("checked")) {
			alert("개인정보의 수집 및 이용목적, 이용기간에 동의해주세요.");
			clicked = false;
			return;
		}
		complete_msg = "1:1 문의가 정상적으로 접수 되었습니다.<br/>빠른 시일내에 답변 드리도록 하겠습니다.";
	} else {
		complete_msg = "1:1 문의가 정상적으로 접수 되었습니다.<br/>빠른 시일내에 답변 드리도록 하겠습니다.<br/>문의에 대한 답변은 마이페이지 > 문의내역을<br/>통해서 확인이 가능합니다.";
	}
	if ($("#request-type").val() === '') {
		alert("문의유형을 선택하세요.");
		clicked = false;
		return;
	}
	if ($("#content").val() === '') {
		alert("문의할 내용을 입력하세요.");
		clicked = false;
		return;
	}
	if (!isLogin) {
		if (!$("#check-phone").prop("checked") && !$("#check-email").prop("checked")) {
			alert("답변을 받을 연락처를 입력하세요.");
			clicked = false;
			return;
		}
	}
	if ($("#check-phone").prop("checked")) {
		if ($("#phone").val() === '') {
			alert("답변을 받을 휴대 전화번호를 입력하세요.");
			clicked = false;
			return;
		}
		if (!/^\d{3}\d{3,4}\d{4}$/.test($("#phone-select").val() + $("#phone").val())) {
			alert("휴대 전화번호를 정확히 입력해주세요.");
			clicked = false;
			return;
		}
	}
	if ($("#check-email").prop("checked")) {
		if ($("#email1").val() === '' || $("#email2").val() === '') {
			alert("답변을 받을 이메일 주소를 입력하세요.");
			clicked = false;
			return;
		}
		if (!/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/.test($("#email1").val() + "@" + $("#email2").val())) {
			alert("이메일 주소를 정확히 입력해주세요.");
			clicked = false;
			return;
		}
	}
	$.ajax({
		url: "/ajax/customer/question",
		method: "post",
		data: {
			request_type: $("#request-type").val(),
			content: $("#content").val(),
			file: $("#input-image").data('path') || $("#input-video").data('path') || $("#input-camera").data('path'),
			phone: $("#check-phone").prop("checked") ? ($("#phone-select").val() + $("#phone").val()) : "",
			email: $("#check-email").prop("checked") ? ($("#email1").val() + "@" + $("#email2").val()) : ""
		}
	}).done(function(res) {
		alert(complete_msg, function() {
			location.reload();
		});
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
}