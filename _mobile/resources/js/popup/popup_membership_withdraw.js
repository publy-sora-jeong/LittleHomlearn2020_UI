function cancelWithdraw() {
	$("#membership_withdraw").hide();
	$("html, body").removeClass("bgFix");
	$("#wraper").removeClass("position");
}

var clicked = false;
function confirmWithdraw() {
	if (clicked) return;
	clicked = true;
	$.ajax({
		url: "/ajax/member/check/password",
		method: "post",
		data: {
			password: $("#membership_withdraw #password").val()
		}
	}).done(function() {
		$.ajax({
			url: "/ajax/member",
			method: "delete"
		}).done(function() {
			location.href = "/";
		}).fail(function(err) {
			alert("에러가 발생했습니다.");
			clicked = false;
		});
	}).fail(function(err) {
		var validError = err.responseJSON.validationError === null ? "" : err.responseJSON.validationError.message;
		console.error(validError);
		switch(validError) {
		case "password is null or empty":
			toast("비밀번호를 입력해주세요.");
			clicked = false;
			return;
		case "password is wrong password":
			toast("비밀번호를 다시 한번 확인해 주세요.");
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
