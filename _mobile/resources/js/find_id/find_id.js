var findWith = "";

$(function() {
	$("#find-with-phone-name, #find-with-phone-select, #find-with-phone").off("focus").on("focus", function() {
		findWith = "phone";
	});
	$("#find-with-email-name, #find-with-email1, #find-with-email2, #find-with-email-select").off("focus").on("focus", function() {
		findWith = "email";
	});
	
	$("#find-with-email-select").off("change").on("change", function() {
		if ($(this).val() === '') {
			$("#find-with-email2").removeAttr("readonly").val("");
		} else {
			$("#find-with-email2").attr("readonly", true).val($(this).val());
		}
	});
});

function _confirm() {
	var findWithPhoneName = $("#find-with-phone-name").val();
	var findWithPhoneSelect = $("#find-with-phone-select").val();
	var findWithPhone = $("#find-with-phone").val();

	var findWithEmailName = $("#find-with-email-name").val();
	var findWithEmail1 = $("#find-with-email1").val();
	var findWithEmail2 = $("#find-with-email2").val();
	var findWithEmailSelect = $("#find-with-email-select").val();
	
	var $form = $("#findForm");
	
	if (findWith === "phone") {
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
	}
	
	if (findWith === "email") {
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
	}
	
	if (findWith === "") return;
	
	$.ajax({
		url: "/ajax/find/id/" + findWith,
		method: "post",
		data: $form.serialize()
	}).done(function(res) {
		var id = res.result;
		if (id === null) {
			toast("회원정보를 찾을 수 없습니다.<br/>가입시 입력한 정보를 입력하세요.");
			return;
		}
		$("#findForm input[name!=name]").remove();
		$("#findForm").append('<input name="id" value="' + id + '" />');
		$("#findForm").attr("method", "post");
		$("#findForm").attr("action", "/find/id/finish");
		$("#findForm").submit();
	}).fail(function(err) {
		var validError = err.responseJSON.validationError === null ? "" : err.responseJSON.validationError.message;
		switch(validError) {
		case "name null":
		case "name empty":
		case "name pattern not match":
			toast("이름은 한글로 입력해 주세요.");
			return;
		case "phone null":
		case "phone empty":
		case "phone pattern not match":
			toast("전화번호를 확인해 주세요.");
			return;
		case "email null":
		case "email empty":
		case "email pattern not match":
			toast("이메일을 확인해 주세요.");
			return;
		default:
			toast("회원정보를 찾을 수 없습니다.<br/>가입시 입력한 정보를 입력하세요.");
			return;
		}
	});
}
