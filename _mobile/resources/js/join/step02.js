var idPattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d\s]{6,12}$|^[A-Za-z]{6,12}$/;
var pwPattern = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_=\-+])[A-Za-z\d!@#$%^&*_=\-+]{6,18}$/;
var phonePattern = /^(\d{3})(\d{4})(\d{4})$/;

function checkDupId() {
	$.ajax({
		url: "/ajax/join/check/id",
		method: "post",
		data: {
			id: $("#id").val()
		}
	}).done(function() {
		$("#duplicateId").hide().removeClass("fail").addClass("success");
	}).fail(function(err) {
		if (err.responseJSON.error === 'duplicated id') {
			$("#warningId").hide().removeClass("fail").addClass("success");
			$("#duplicateId").show().removeClass("success").addClass("fail");
			return;
		}
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		return;
	});
}

function checkDupPhone() {
	$.ajax({
		url: "/ajax/join/check/phone",
		method: "post",
		data: {
			phone: $("#phoneFirstSelect").val() + $("#phoneSecond").val()
		}
	}).done(function() {
		$("#duplicatePhone").hide().removeClass("fail").addClass("success");
	}).fail(function(err) {
		if (err.responseJSON.error === 'duplicated phone') {
			$("#duplicatePhone").show().removeClass("success").addClass("fail");
			return;
		}
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		return;
	});
}

function checkInput() {
	if ($("#id").val() !== '' && $("#pw").val() !== '' && $("#pwConfirm").val() !== '' && $("#name").val() !== '' && $("#name").val() !== '' &&
			$("#phoneFirstSelect").val() !== '' && $("#phoneSecond").val() !== '' && $(".phone").hasClass('disabled') && $("#emailFirst").val() !== '' && $("#emailSecond").val() !== '') {
		$(".joinBtn").removeClass("disabled");
	} else {
		$(".joinBtn").addClass("disabled");
	}
}

$(function() {
	$("input").off("input").on("input", checkInput);
	
	$("#id").off("keyup").on("keyup", function() {
		if ($("#id").val().length === 0) {
			$("#warningId").hide().removeClass("fail").addClass("success");
			$("#duplicateId").hide().removeClass("fail").addClass("success");
			return;
		}
		if (idPattern.test(this.value)) {
			$("#warningId").hide().removeClass("fail").addClass("success");
		} else {
			$("#warningId").show().removeClass("success").addClass("fail");
			$("#duplicateId").hide().removeClass("fail").addClass("success");
		}
		checkDupId();
		checkInput();
	}).on('focus', function() {
		if ($("#id").val().length === 0) {
			$("#warningId").hide().removeClass("fail").addClass("success");
			$("#duplicateId").hide().removeClass("fail").addClass("success");
			return;
		}
		checkDupId();
		checkInput();
	});
	
	$("#pw").off("keyup").on("keyup", function() {
		if ($("#pw").val().length === 0) {
			$("#warningPw").hide().removeClass("fail").addClass("success");
			return;
		}
		if (pwPattern.test(this.value)) {
			$("#warningPw").hide().removeClass("fail").addClass("success");
		} else {
			$("#warningPw").show().removeClass("success").addClass("fail");
		}
		if ($("#pwConfirm").val() === '' || $("#pwConfirm").val() === this.value) {
			$("#warningPwConfirm").hide().removeClass("fail").addClass("success");
		} else {
			$("#warningPwConfirm").show().removeClass("success").addClass("fail");
		}
		checkInput();
	});
	
	$("#pwConfirm").off("keyup").on("keyup", function() {
		if (this.value === '' || $("#pw").val() === this.value) {
			$("#warningPwConfirm").hide().removeClass("fail").addClass("success");
		} else {
			$("#warningPwConfirm").show().removeClass("success").addClass("fail");
		}
		checkInput();
	});
	
	$("#emailSecondSelect").off("change").on("change", function() {
		if (this.value === "") {
			$("#emailSecond").val($("#emailSecond").data("prev")).removeAttr("readonly");
		} else {
			$("#emailSecond").data("prev", $("#emailSecond").val()).val(this.value).attr("readonly", "readonly");
		}
		checkInput();
	});

	$("#phoneFirstSelect").off('change').on('change', function() {
		$(".phone").data('cert', 'n');
		checkDupPhone();
		checkInput();
	});
	$("#phoneSecond").off('keyup').on('keyup', function() {
		$(".phone").data('cert', 'n');
		checkDupPhone();
		checkInput();
	});
});

var timer = null;
function setTimerStr(time) {
	var min = Math.floor(time / 60);
	var sec = time % 60;
	if (sec < 10) sec = "0" + sec;
	var str = min > 0 ? ("유효시간 : " + min + "분 " + sec + "초") : ("유효시간 : " + sec + "초");
	$(".certi_code .time").text(str).show();
	if (time === 0) {
		stopTimer();
		$(".certi_code").hide();
		$(".codeBtn").show();
		$("#warningCode").hide();
		return;
	}
	timer = setTimeout(function(time) {
		return function() {
			setTimerStr(time - 1);
		};
	}(time), 1000);
}
function startTimer() {
	setTimerStr(120);
}
function stopTimer() {
	if (timer !== null) clearTimeout(timer);
}

function sendCode() {
	$.ajax({
		url: "/ajax/join/check/phone",
		method: "post",
		data: {
			phone: $("#phoneFirstSelect").val() + $("#phoneSecond").val()
		}
	}).done(function() {
		var phoneFirst = $("#phoneFirstSelect").val();
		var phoneSecond = $("#phoneSecond").val();
		if (phoneSecond.length === 0) {
			toast("인증할 휴대폰 번호를 입력하세요.");
			return;
		}
		if (!phonePattern.test(phoneFirst + phoneSecond)) {
			toast("정확한 휴대전화번호를 입력하세요.");
			return;
		}
		$.ajax({
			url: "/ajax/cert-code",
			method: "post",
			data: {
				phone: phoneFirst + phoneSecond
			}
		}).done(function(res) {
			$(".certi_code").show();
			startTimer();
			$(".codeBtn").hide();
		}).fail(function(err) {
			console.error(err);
		});
	}).fail(function(err) {
		if (err.responseJSON.error === 'duplicated phone') {
			$("#duplicatePhone").show().removeClass("success").addClass("fail");
			return;
		}
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		return;
	});
}

function certCode() {
	var phoneFirst = $("#phoneFirstSelect").val();
	var phoneSecond = $("#phoneSecond").val();
	if (phoneSecond.length < 7) {
		alert("전화번호를 확인해 주세요.");
		return;
	}
	if ($("#code").val().length !== 6) {
		toast("휴대전화번호를 인증하세요.");
		return;
	}
	$.ajax({
		url: "/ajax/cert-code/confirm",
		method: "post",
		data: {
			phone: phoneFirst + phoneSecond,
			code: $("#code").val()
		}
	}).done(function(res) {
		if (res.result === 'code is not match') {
			$("#warningCode").show();
			return;
		}
		stopTimer();
		$(".phone").addClass("disabled");
		$("#phoneFirstSelect").attr("disabled", "disabled");
		$("#phoneSecond").attr("disabled", "disabled");
		$(".certi_code").hide();
		$("#warningCode").hide();
		checkInput();
	}).fail(function(err) {
		console.error(err);
	});
}

var clicked = false;
function _confirm() {
	if (clicked) true;
	clicked = false;
	if ($(".warning.fail").length > 0) {
		clicked = false;
		return;
	}
	if (!$(".phone").hasClass('disabled')) {
		toast("휴대전화번호를 인증하세요.");
		clicked = false;
		return;
	}
	var id = $("#id").val();
	var pw = $("#pw").val();
	var name = $("#name").val();
	var phone = $("#phoneFirstSelect").val() + $("#phoneSecond").val();
	var email = $("#emailFirst").val() + "@" + $("#emailSecond").val();
	
	var $form = $("#joinForm");
	$("#joinForm input[name=id]").remove();
	$form.append('<input name="id" value="' + id.replace(/\s/gi, '').trim() + '" />');
	$("#joinForm input[name=pw]").remove();
	$form.append('<input name="pw" value="' + pw + '" />');
	$("#joinForm input[name=name]").remove();
	$form.append('<input name="name" value="' + name + '" />');
	$("#joinForm input[name=phone]").remove();
	$form.append('<input name="phone" value="' + phone + '" />');
	$("#joinForm input[name=email]").remove();
	$form.append('<input name="email" value="' + email + '" />');
	
	$.ajax({
		url: "/ajax/join",
		method: "post",
		data: $form.serialize()
	}).done(function(res) {
		location.href = "/join/step03";
	}).fail(function(err) {
		var validError = err.responseJSON.validationError === null ? "" : err.responseJSON.validationError.message;
		switch(validError) {
		case "id null":
		case "id empty":
		case "id pattern not match":
			$("#warningId").show().removeClass("success").addClass("fail");
			alert("사용할 수 없는 아이디입니다.");
			clicked = false;
			return;
		case "pw null":
		case "pw empty":
		case "pw pattern not match":
			$("#warningPw").show().removeClass("success").addClass("fail");
			alert("영문, 숫자, 특수문자 포함 6자~18자로 설정하세요.");
			clicked = false;
			return;
		case "name null":
		case "name empty":
		case "name pattern not match":
			alert("이름은 한글로 입력해 주세요.");
			clicked = false;
			return;
		case "phone null":
		case "phone empty":
		case "phone pattern not match":
			alert("전화번호를 확인해 주세요.");
			clicked = false;
			return;
		case "email null":
		case "email empty":
		case "email pattern not match":
			alert("이메일을 확인해 주세요.");
			clicked = false;
			return;
		default:
			if (err.responseJSON.error === 'duplicated id') {
				alert("이미 사용중인 아이디입니다.");
				clicked = false;
				return;
			}
			alert(err.responseJSON.error || "에러가 발생했습니다.");
			clicked = false;
			return;
		}
		clicked = false;
	});
}

function confirmSns() {
	if (clicked) return;
	clicked = true;
	if ($(".warning.fail").length > 0) {
		clicked = false;
		return;
	}
	if (!$(".phone").hasClass('disabled')) {
		alert("휴대폰 번호 인증을 해주세요.");
		clicked = false;
		return;
	}
	var id = $("#id").val();
	var pw = $("#pw").val();
	var name = $("#name").val();
	var phone = $("#phoneFirstSelect").val() + $("#phoneSecond").val();
	var email = $("#emailFirst").val() + "@" + $("#emailSecond").val();
	
	var $form = $("#joinForm");
	$("#joinForm input[name=id]").remove();
	$form.append('<input name="id" value="' + id + '" />');
	$("#joinForm input[name=pw]").remove();
	$form.append('<input name="pw" value="' + pw + '" />');
	$("#joinForm input[name=name]").remove();
	$form.append('<input name="name" value="' + name + '" />');
	$("#joinForm input[name=phone]").remove();
	$form.append('<input name="phone" value="' + phone + '" />');
	$("#joinForm input[name=email]").remove();
	$form.append('<input name="email" value="' + email + '" />');
	if ($("#kakao_token").length > 0) {
		$("#joinForm input[name=kakao_token]").remove();
		$form.append('<input name="kakao_token" value="' + $("#kakao_token").val() + '" />');
		$form.append('<input name="kakao_id" value="' + id + '" />');
	}
	if ($("#naver_token").length > 0) {
		$("#joinForm input[name=naver_token]").remove();
		$form.append('<input name="naver_token" value="' + $("#naver_token").val() + '" />');
		$form.append('<input name="naver_id" value="' + id + '" />');
	}
	if ($("#facebook_token").length > 0) {
		$("#joinForm input[name=facebook_token]").remove();
		$form.append('<input name="facebook_token" value="' + $("#facebook_token").val() + '" />');
		$form.append('<input name="facebook_id" value="' + id + '" />');
	}
	if ($("#google_token").length > 0) {
		$("#joinForm input[name=google_token]").remove();
		$form.append('<input name="google_token" value="' + $("#google_token").val() + '" />');
		$form.append('<input name="google_id" value="' + id + '" />');
	}
	
	console.log($form.serialize());
	
	$.ajax({
		url: "/ajax/join/sns",
		method: "post",
		data: $form.serialize()
	}).done(function(res) {
		location.href = "/join/step03";
	}).fail(function(err) {
		var validError = err.responseJSON.validationError === null ? "" : err.responseJSON.validationError.message;
		switch(validError) {
		case "name null":
		case "name empty":
		case "name pattern not match":
			alert("이름은 한글로 입력해 주세요.");
			clicked = false;
			return;
		case "phone null":
		case "phone empty":
		case "phone pattern not match":
			alert("전화번호를 확인해 주세요.");
			clicked = false;
			return;
		case "email null":
		case "email empty":
		case "email pattern not match":
			alert("이메일을 확인해 주세요.");
			clicked = false;
			return;
		default:
			alert("에러가 발생했습니다.");
			clicked = false;
			return;
		}
		clicked = false;
	});
}
