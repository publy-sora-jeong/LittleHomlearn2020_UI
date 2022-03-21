var pwPattern = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_=\-+])[A-Za-z\d!@#$%^&*_=\-+]{6,18}$/;

$(function(){
	$("#pw").off("keyup").on("keyup", function() {
		if (pwPattern.test(this.value)) {
			$("#warningPw").hide().removeClass("fail").addClass("success");
		} else {
			$("#warningPw").show().removeClass("success").addClass("fail");
		}
		if ($("#pwConfirm").val() === this.value) {
			$("#warningPwConfirm").hide().removeClass("fail").addClass("success");
		} else {
			$("#warningPwConfirm").show().removeClass("success").addClass("fail");
		}
	});
	
	$("#pwConfirm").off("keyup").on("keyup", function() {
		if ($("#pw").val() === this.value) {
			$("#warningPwConfirm").hide().removeClass("fail").addClass("success");
		} else {
			$("#warningPwConfirm").show().removeClass("success").addClass("fail");
		}
	});
});

function _confirm() {
	if ($(".warning.fail").length > 0) {
		return;
	}
	var pw = $("#pw").val();
	
	var $form = $("#findForm");
	$("#findForm input[name=pw]").remove();
	$form.append('<input name="pw" value="' + pw + '" />');
	
	$.ajax({
		url: "/ajax/find/pw/new",
		method: "post",
		data: $form.serialize()
	}).done(function(res) {
		location.href = "/login";
	}).fail(function(err) {
		if (err.responseJSON.error === "invalid") {
			$("#warningPw").show().removeClass("success").addClass("fail");
			alert("영문, 숫자, 특수문자 포함 6자~18자로 설정하세요.");
			return;
		}
		alert("에러가 발생했습니다.");
	});
}
