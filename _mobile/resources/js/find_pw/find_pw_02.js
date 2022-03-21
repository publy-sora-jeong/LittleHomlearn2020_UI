var phonePattern = /^(\d{3})(\d{4})(\d{4})$/;
var emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-\.]+$/;

$(function(){
	$("#cert-phone-label .textBox").click(function() {
		$("#cert-phone").prop("checked", !$("#cert-phone").prop("checked"));
	});
	$("#cert-email-label .textBox").click(function() {
		$("#cert-email").prop("checked", !$("#cert-email").prop("checked"));
	});
	$("#find-with-email-select").change(function() {
		$("#find-with-email2").val($(this).val());
	});
});

var timer_phone = null;
function setTimerStr_phone(time) {
	var min = Math.floor(time / 60);
	var sec = time % 60;
	if (sec < 10) sec = "0" + sec;
	var str = min > 0 ? ("유효시간 : " + min + "분 " + sec + "초") : ("유효시간 : " + sec + "초");
	$(".phone_certi_code .time").text(str).show();
	if (time === 0) {
		stopTimer_phone();
		$(".phone_certi_code").hide();
		$(".phone_codeBtn").show();
		return;
	}
	timer_phone = setTimeout(function(time) {
		return function() {
			setTimerStr_phone(time - 1);
		};
	}(time), 1000);
}
function startTimer_phone() {
	setTimerStr_phone(120);
}
function stopTimer_phone() {
	if (timer_phone !== null) clearTimeout(timer_phone);
}

var timer_email = null;
function setTimerStr_email(time) {
	var min = Math.floor(time / 60);
	var sec = time % 60;
	if (sec < 10) sec = "0" + sec;
	var str = min > 0 ? ("유효시간 : " + min + "분 " + sec + "초") : ("유효시간 : " + sec + "초");
	$(".email_certi_code .time").text(str).show();
	if (time === 0) {
		stopTimer_email();
		$(".email_certi_code").hide();
		$(".email_codeBtn").show();
		return;
	}
	timer_email = setTimeout(function(time) {
		return function() {
			setTimerStr_email(time - 1);
		};
	}(time), 1000);
}
function startTimer_email() {
	setTimerStr_email(120);
}
function stopTimer_email() {
	if (timer_email !== null) clearTimeout(timer_email);
}

function sendCode(type) {
	var data = {};
	if (type === 'phone') {
		var phoneFirst = $("#find-with-phone-select").val();
		var phoneSecond = $("#find-with-phone").val();
		if (phoneSecond.length === 0) {
			toast("인증할 휴대폰 번호를 입력하세요.");
			return;
		}
		if (!phonePattern.test(phoneFirst + phoneSecond)) {
			toast("정확한 휴대전화번호를 입력하세요.");
			return;
		}
		if ($(".phone").data("org") !== phoneFirst + phoneSecond) {
			toast("정확한 휴대전화번호를 입력하세요.");
			return;
		}
		data = {
				phone: phoneFirst + phoneSecond
		};
		$(".phone_codeBtn").hide();
		$(".phone_certi_code").show();
		$(".code_phone").val("");
		$(".phone select, .phone input").addClass("disabled");
	}
	if (type === 'email') {
		var emailFirst = $("#find-with-email1").val();
		var emailSecond = $("#find-with-email2").val();
		if (emailFirst.length === 0 && emailSecond.length === 0) {
			toast("인증할 이메일을 입력하세요.");
			return;
		}
		if (!emailPattern.test(emailFirst + '@' + emailSecond)) {
			toast("정확한 이메일을 입력하세요.");
			return;
		}
		if ($(".email").data("org") !== emailFirst + '@' + emailSecond) {
			toast("정확한 이메일을 입력하세요.");
			return;
		}
		data = {
				email: emailFirst + '@' + emailSecond
		};
		$(".email_codeBtn").hide();
		$(".email_certi_code").show();
		$(".code_email").val("");
		$(".email .inputBox, .email .address").addClass("disabled");
	}
	$.ajax({
		url: "/ajax/cert-code",
		method: "post",
		data: data
	}).done(function(res) {
	}).fail(function(err) {
		console.error(err);
	});
	if (type === 'phone')
		startTimer_phone();
	if (type === 'email')
		startTimer_email();
}

function certCode(type) {
	var data = {};
	if (type === 'phone') {
		var phoneFirst = $("#find-with-phone-select").val();
		var phoneSecond = $("#find-with-phone").val();
		if (phoneSecond.length === 0) {
			toast("인증할 휴대폰 번호를 입력하세요.");
			return;
		}
		if (!phonePattern.test(phoneFirst + phoneSecond)) {
			toast("정확한 휴대전화번호를 입력하세요.");
			return;
		}
		if ($(".phone").data("org") !== phoneFirst + phoneSecond) {
			toast("정확한 휴대전화번호를 입력하세요.");
			return;
		}
		if ($("#code_phone").val().length !== 6) {
			$("#warningCodePhone").show();
			return;
		}
		data = {
				phone: phoneFirst + phoneSecond,
				code: $("#code_phone").val()	
		};
	}
	if (type === 'email') {
		var emailFirst = $("#find-with-email1").val();
		var emailSecond = $("#find-with-email2").val();
		if (emailFirst.length === 0 && emailSecond.length === 0) {
			toast("인증할 이메일을 입력하세요.");
			return;
		}
		if (!emailPattern.test(emailFirst + '@' + emailSecond)) {
			toast("정확한 이메일을 입력하세요.");
			return;
		}
		if ($(".email").data("org") !== emailFirst + '@' + emailSecond) {
			toast("정확한 이메일을 입력하세요.");
			return;
		}
		if ($("#code_email").val().length !== 6) {
			$("#warningCodeEmail").show();
			return;
		}
		data = {
				email: emailFirst + '@' + emailSecond,
				code: $("#code_email").val()	
		};
	}
	console.log(data);
	$.ajax({
		url: "/ajax/cert-code/confirm",
		method: "post",
		data: data
	}).done(function(res) {
		console.log(res.result);
		if (res.result === 'code is not match') {
			$("#warningCodeEmail").show();
			if (type === 'phone') {
				$("#warningCodePhone").show();
			}
			if (type === 'email') {
				$("#warningCodeEmail").show();
			}
			return;
		}
		if (type === 'phone') {
			stopTimer_phone();
			$(".phone").addClass("disabled");
			$("#find-with-phone-select").attr("disabled", "disabled");
			$("#find-with-phone").attr("disabled", "disabled");
			$("#find-with-phone-name").attr("disabled", "disabled");
			$(".phone_certi_code").hide();
			$("#warningCodePhone").hide();
			$("#code_phone").data('cert', true);
		}
		if (type === 'email') {
			stopTimer_email();
			$(".email").addClass("disabled");
			$("#find-with-email-select").attr("disabled", "disabled");
			$("#find-with-email1").attr("disabled", "disabled");
			$("#find-with-email2").attr("disabled", "disabled");
			$("#find-with-email-name").attr("disabled", "disabled");
			$(".email_certi_code").hide();
			$("#warningCodeEmail").hide();
			$("#code_email").data('cert', true);
		}
	}).fail(function(err) {
		console.error(err);
	});
}

function _confirm() {
	var findWith = "";
	
	var findWithPhoneName = $("#find-with-phone-name").val();
	var findWithPhoneSelect = $("#find-with-phone-select").val();
	var findWithPhone = $("#find-with-phone").val();

	var findWithEmailName = $("#find-with-email-name").val();
	var findWithEmail1 = $("#find-with-email1").val();
	var findWithEmail2 = $("#find-with-email2").val();
	var findWithEmailSelect = $("#find-with-email-select").val();
	
	var $form = $("#findForm");
	$("#findForm input").remove();
	$form.append('<input name="id" value="' + id + '" />');
	
	if (!$("#cert-phone").prop("checked") && !$("#cert-email").prop("checked")) {
		toast("휴대전화번호 인증이나 이메일 인증을 먼저 하세요.");
		return;
	}
	
	if ($("#cert-phone").prop("checked")) {
		findWith = "phone";
		if (findWithPhoneName === '') {
			alert("이름을 입력하세요.");
			return;
		}
		$("#findForm input[name=name]").remove();
		$form.append('<input name="name" value="' + findWithPhoneName + '" />');
		if (findWithPhone === '') {
			alert("휴대전화번호를 입력하세요.");
			return;
		}
		$("#findForm input[name=phone]").remove();
		$form.append('<input name="phone" value="' + findWithPhoneSelect + findWithPhone + '" />');
		if (!$("#code_phone").data('cert')) {
			alert("휴대전화번호 인증을 먼저 하세요.");
			return;
		}
	}
	if ($("#cert-email").prop("checked")) {
		findWith = "email";
		if (findWithEmailName === '') {
			alert("이름을 입력하세요.");
			return;
		}
		$("#findForm input[name=name]").remove();
		$form.append('<input name="name" value="' + findWithEmailName + '" />');
		if (findWithEmail1 === '') {
			alert("이메일을 입력하세요.");
			return;
		}
		if (findWithEmail2 === '') {
			alert("이메일을 입력하세요.");
			return;
		}
		$("#findForm input[name=email]").remove();
		$form.append('<input name="email" value="' + findWithEmail1 + "@" + findWithEmail2 + '" />');
		if (!$("#code_email").data('cert')) {
			alert("이메일 인증을 먼저 하세요.");
			return;
		}
	}
	
	if (findWith === "") return;
	
	$.ajax({
		url: "/ajax/find/pw/" + findWith,
		method: "post",
		data: $form.serialize()
	}).done(function(res) {
		var seq = typeof res.result === 'number' ? res.result : parseInt(res.result);
		if (seq === 0) {
			alert("이름과 " + (findWith === "phone" ? "휴대전화번호가" : "이메일이") + " 일치하는 계정을 찾지 못했습니다.");
			return;
		}
		$("#findForm input[name!=name]").remove();
		$form.append('<input name="seq" value="' + seq + '" />');
		$("#findForm").attr("method", "post");
		$("#findForm").attr("action", "/find/pw/new");
		$("#findForm").submit();
	}).fail(function(err) {
		var validError = err.responseJSON.validationError === null ? "" : err.responseJSON.validationError.message;
		switch(validError) {
		case "name null":
		case "name empty":
		case "name pattern not match":
			alert("이름은 한글로 입력해 주세요.");
			return;
		case "phone null":
		case "phone empty":
		case "phone pattern not match":
			alert("전화번호를 확인해 주세요.");
			return;
		case "email null":
		case "email empty":
		case "email pattern not match":
			alert("이메일을 확인해 주세요.");
			return;
		default:
			alert("에러가 발생했습니다.");
			return;
		}
	});
}
