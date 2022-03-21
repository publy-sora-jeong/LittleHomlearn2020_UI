$("#org-password, #password, #password-confirm").off('keyup').on('keyup', function() {
	var regexp = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_=\-+])[A-Za-z\d!@#$%^&*()_=\-+]{6,18}$/;
	var allCheck = true;
//	if (regexp.test($("#org-password").val())) {
//		$("#warning-org-password").hide();
//	} else {
//		$("#warning-org-password").show();
//		allCheck = false;
//	}
	if (regexp.test($("#password").val())) {
		$("#warning-password").hide();
	} else {
		$("#warning-password").show();
		allCheck = false;
	}
	if (regexp.test($("#password-confirm").val())) {
		$("#warning-password-confirm").hide();
	} else {
		$("#warning-password-confirm").show();
		allCheck = false;
	}
	if ($("#password").val() !== $("#password-confirm").val()) {
		$("#warning-password-confirm").show();
		allCheck = false;
	} else {
		$("#warning-password-confirm").hide();
	}
	if (allCheck) {
		$(".formBox .bottomBtn").removeClass("disabled");
	} else {
		$(".formBox .bottomBtn").addClass("disabled");
	}
});
var clicked = false;
function _confirm() {
	if (clicked) return;
	if ($(".formBox .bottomBtn").hasClass('disabled')) {
		clicked = false;
		return;
	}
	$.ajax({
		url: "/ajax/member/password",
		method: "post",
		data: {
			org_password: $("#org-password").val(),
			password: $("#password").val(),
			password_confirm: $("#password-confirm").val()
		}
	}).done(function(res) {
		changePw = $("#password").val();
		$("#password_change").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		clicked = false;
	}).fail(function(err) {
		clicked = false;
		if (err.responseJSON.validationError.field === 'org_password') {
			$("#warning-org-password").show();
			return;
		}
		if (err.responseJSON.validationError.field === 'password') {
			$("#warning-password").show();
			return;
		}
		if (err.responseJSON.validationError.field === 'password_confirm') {
			$("#warning-password-confirm").show();
			return;
		}
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
}