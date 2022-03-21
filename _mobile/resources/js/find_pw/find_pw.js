function _confirm() {
	var id = $("#id").val();
	if (id === "") {
		alert("아이디를 입력하세요.");
		return;
	}
	
	$.ajax({
		url: "/ajax/find/pw/check/existId",
		method: "post",
		data: {
			id: id
		}
	}).done(function(res) {
		if (res.result) {
			var $form = $("#findForm");
			$("#findForm input").remove();
			$form.append('<input name="id" value="' + id + '" />');
			
			$.ajax({
				url: "/ajax/find/pw/valid-id",
				method: "post",
				data: $form.serialize()
			}).done(function() {
				$("#findForm").attr("method", "post");
				$("#findForm").attr("action", "/find/pw/step02");
				$("#findForm").submit();
			}).fail(function(err) {
				if (err.responseJSON.error === "invalid") {
					alert("아이디를 확인해 주세요.");
					return;
				}
				alert("에러가 발생했습니다.");
			});
		} else {
			toast("회원정보를 찾을 수 없습니다.<br/>정확한 아이디를 입력해 주세요.");
		}
	}).fail(function(err) {
		console.error(err);
		toast("회원정보를 찾을 수 없습니다.<br/>정확한 아이디를 입력해 주세요.");
	});
}
