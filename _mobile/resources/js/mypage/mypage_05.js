var phonePattern = /^(\d{3})(\d{4})(\d{4})$/;

$(function() {
    $("#mypage .phone .changeBtn").click(function(){
    	$("#code").val("");
    	$(".certi_code .time").text("").hide();
		$("#mypage .phone").removeClass("disabled");
		$(this).hide();
		$("#mypage .phone .codeBtn").show();
		//$("#mypage .certi_code").show();
		$("#mypage .phone select, #mypage .phone input").attr("disabled",false);
	});
});

//Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCY2BZwtJudVwsqMyFj8FXWOBhC6QY-0dI",
  authDomain: "littlehomelearn.firebaseapp.com",
  databaseURL: "https://littlehomelearn.firebaseio.com",
  projectId: "littlehomelearn",
  storageBucket: "littlehomelearn.appspot.com",
  messagingSenderId: "104394237981",
  appId: "1:104394237981:web:3ddf6415bdb548a306fef4",
  measurementId: "G-E3TS8LEN8X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var changePw = null;
var clicked = false;
function edit() {
	if (clicked) return;
	clicked = true;
	var updateMember = {
	};
	var agree_changed = ($("#email-agree").prop("checked") !== ($("#email-agree").data('org') === "y")) || $("#sms-agree").prop("checked") !== ($("#sms-agree").data('org') === "y");
	updateMember.receive_email_yn = $("#email-agree").prop("checked") ? 'y' : 'n';
	updateMember.receive_sms_yn = $("#sms-agree").prop("checked") ? 'y' : 'n';
	if ($(".phone").data('cert') === 'n') {
		if ($("#phoneFirstSelect").val() !== $("#phoneFirstSelect").data("org") + '' || $("#phoneSecond").val() !== $("#phoneSecond").data("org") + '') {
			toast("휴대폰 번호를 인증해주세요.");
			clicked = false;
			return;
		}
	}
	if (!/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/.test($("#email1").val() + "@" + $("#email2").val())) {
		toast("이메일 주소를 확인해주세요.");
		clicked = false;
		return;
	}
	updateMember.phone = $("#phoneFirstSelect").val() + $("#phoneSecond").val();
	updateMember.email = $("#email1").val() + "@" + $("#email2").val();
	if (changePw !== null) {
		updateMember.pw = changePw;
	}
	$.ajax({
		url: "/ajax/mypage/member",
		method: "post",
		data: updateMember
	}).done(function(res) {
		toast("회원정보가 수정되었습니다.");
		if (agree_changed) {
			$("#email-agree-text").text($("#email-agree").prop("checked") ? "수신동의" : "수신거부");
			$("#email-agree").data('org', updateMember.receive_email_yn);
			$("#sms-agree-text").text($("#sms-agree").prop("checked") ? "수신동의" : "수신거부");
			$("#sms-agree").data('org', updateMember.receive_sms_yn);
			if (agree_changed)
				popup_page_open('ad_receive_state');
		}
		clicked = false;
	}).fail(function() {
		clicked = false;
	});
}

$("#email-select").off('change').on('change', function() {
	if ($(this).val() === '') {
		$("#email2").val("").removeAttr('readonly');
	} else {
		$("#email2").val($(this).val()).attr('readonly', 'readonly');
	}
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
	var phoneFirst = $("#phoneFirstSelect").val();
	var phoneSecond = $("#phoneSecond").val();
	if (phoneFirst === $("#phoneFirstSelect").data("org") + '' && phoneSecond === $("#phoneSecond").data("org") + '') return;
	$.ajax({
		url: "/ajax/join/check/phone",
		method: "post",
		data: {
			phone: phoneFirst + phoneSecond
		}
	}).done(function() {
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
			$(".codeBtn").hide();
			$("#mypage .certi_code").show();
			startTimer();
		}).fail(function(err) {
			console.error(err);
		});
	}).fail(function(err) {
		if (err.responseJSON.error === 'duplicated phone') {
			toast("이미 가입된 휴대전화번호입니다.");
			return;
		}
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		return;
	});
}

function certCode() {
	var phoneFirst = $("#phoneFirstSelect").val();
	var phoneSecond = $("#phoneSecond").val();
	if (phoneSecond.length === 0) {
		toast("인증할 휴대폰 번호를 입력하세요.");
		return;
	}
	if (phoneSecond.length < 7) {
		toast("정확한 휴대전화번호를 입력하세요.");
		return;
	}
	if ($("#code").val().length !== 6) {
		$("#warningCode").show();
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
		$(".phone").addClass("disabled").data('cert', 'y');
		$("#phoneFirstSelect").attr("disabled", "disabled");
		$("#phoneSecond").attr("disabled", "disabled");
		$(".certi_code").hide();
		$("#warningCode").hide();
		$(".codeBtn").hide();
		$(".changeBtn").show();
	}).fail(function(err) {
		console.error(err);
	});
}
$("#phoneFirstSelect, #phoneSecond").off('keyup').on('keyup', function() {
	$(".phone").data('cert', 'n');
});

$("#kakao").off('change').on('change', function() {
	if ($(this).prop("checked")) {
		$.ajax({
			url: "/social/kakao/signin",
			method: "post"
		}).done(function(res) {
			location.href = res.result;
		}).fail(function(err) {
			alert(err.responseJSON.error || "에러가 발생했습니다.");
		});
	} else {
		if ($("#join_sns").val() === 'true') {
			if ($("input[name=sns]:checked").length === 0) {
				alert("SNS 간편가입의 경우 SNS 1개 연동은 필수입니다.");
				$(this).prop("checked", true);
				return;
			}
		}
		confirm("연동을 해제하시겠습니까?", function() {
			$.ajax({
				url: "/social/disconnect/kakao",
				method: "post"
			}).done(function() {
				location.reload();
			}).fail(function() {
				alert("에러가 발생했습니다.");
			});
		});
	}
});

$("#naver").off('change').on('change', function() {
	if ($(this).prop("checked")) {
		$.ajax({
			url: "/social/naver/signin",
			method: "post"
		}).done(function(res) {
			location.href = res.result;
		}).fail(function(err) {
			alert(err.responseJSON.error || "에러가 발생했습니다.");
		});
	} else {
		if ($("#join_sns").val() === 'true') {
			if ($("input[name=sns]:checked").length === 0) {
				alert("SNS 간편가입의 경우 SNS 1개 연동은 필수입니다.");
				$(this).prop("checked", true);
				return;
			}
		}
		confirm("연동을 해제하시겠습니까?", function() {
			$.ajax({
				url: "/social/disconnect/naver",
				method: "post"
			}).done(function() {
				location.reload();
			}).fail(function() {
				alert("에러가 발생했습니다.");
			});
		});
	}
});

$("#facebook").off('change').on('change', function() {
	if ($(this).prop("checked")) {
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('email');
		firebase.auth().signInWithPopup(provider).then(function(result) {
			console.log(result);
			$("#loginForm input").remove();
			var $form = $("#loginForm");
			$form.append('<input name="code" value="' + result.credential.accessToken + '" />');
			$form.append('<input name="id" value="' + result.user.uid + '" />');
			$form.append('<input name="name" value="' + result.user.displayName + '" />');
			$form.append('<input name="email" value="' + result.user.email + '" />');
			$form.attr("method", "post");
			$form.attr("action", "/social/facebook/callback");
			$form.submit();
		}).catch(function(error) {
			console.error(error);
			if (error.credential !== undefined || error.credential !== null) {
				$("#loginForm input").remove();
				var $form = $("#loginForm");
				$form.append('<input name="code" value="' + error.credential.accessToken + '" />');
				$form.append('<input name="id" value="" />');
				$form.append('<input name="name" value="" />');
				$form.append('<input name="email" value="" />');
				$form.attr("method", "post");
				$form.attr("action", "/social/facebook/callback");
				$form.submit();
			}
		});
	} else {
		if ($("#join_sns").val() === 'true') {
			if ($("input[name=sns]:checked").length === 0) {
				alert("SNS 간편가입의 경우 SNS 1개 연동은 필수입니다.");
				$(this).prop("checked", true);
				return;
			}
		}
		confirm("연동을 해제하시겠습니까?", function() {
			$.ajax({
				url: "/social/disconnect/facebook",
				method: "post"
			}).done(function() {
				location.reload();
			}).fail(function() {
				alert("에러가 발생했습니다.");
			});
		});
	}
});

$("#google").off('change').on('change', function() {
	if ($(this).prop("checked")) {
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
		firebase.auth().signInWithPopup(provider).then(function(result) {
			console.log(result);
			$("#loginForm input").remove();
			var $form = $("#loginForm");
			$form.append('<input name="code" value="' + result.credential.idToken + '" />');
			$form.append('<input name="id" value="' + result.user.uid + '" />');
			$form.append('<input name="name" value="' + result.user.displayName + '" />');
			$form.append('<input name="email" value="' + result.user.email + '" />');
			$form.attr("method", "post");
			$form.attr("action", "/social/google/callback");
			$form.submit();
		}).catch(function(error) {
			console.error(error);
			if (error.credential !== undefined || error.credential !== null) {
				$("#loginForm input").remove();
				var $form = $("#loginForm");
				$form.append('<input name="code" value="' + error.credential.idToken + '" />');
				$form.append('<input name="id" value="" />');
				$form.append('<input name="name" value="" />');
				$form.append('<input name="email" value="" />');
				$form.attr("method", "post");
				$form.attr("action", "/social/google/callback");
				$form.submit();
			}
		});
	} else {
		if ($("#join_sns").val() === 'true') {
			if ($("input[name=sns]:checked").length === 0) {
				alert("SNS 간편가입의 경우 SNS 1개 연동은 필수입니다.");
				$(this).prop("checked", true);
				return;
			}
		}
		confirm("연동을 해제하시겠습니까?", function() {
			$.ajax({
				url: "/social/disconnect/google",
				method: "post"
			}).done(function() {
				location.reload();
			}).fail(function() {
				alert("에러가 발생했습니다.");
			});
		});
	}
});

function openWithdrawPopup(canWithdraw) {
	if (canWithdraw)
		popup_page_open('membership_withdraw');
	else
		alert("서비스를 이용중인 자녀가 있어 탈퇴가 불가합니다.");
}
