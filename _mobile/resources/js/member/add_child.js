function oncomplete(year, month, date) {
	$("#birthday").val(year + '.' + month + '.' + date);
}
$("#relation").off('change').on('change', function() {
	if ($(this).val() === 'etc') {
		$("#relation-desc").val('').removeAttr("readonly");
	} else {
		$("#relation-desc").val($("#relation option:selected").text()).attr("readonly", "readonly");
	}
});
$("#relation-desc").off('input').on('input', function() {
	this.value = this.value.replace(/[^0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ]/g, '').substring(0, 10);
});
$("#name").off('input').on('input', function() {
	this.value = this.value.replace(/[^a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]/g, '').substring(0, 5);
});
var clicked = false;
$("#add_child .bottomBtn").off('click').on('click', function() {
	if (clicked) return;
	clicked = true;
	if ($("#name").val().trim() == '') {
		alert("자녀의 이름을 입력하세요.");
		clicked = false;
		return;
	}
	if ($(".gender:checked").length == 0) {
		alert("자녀의 성별을 선택하세요.");
		clicked = false;
		return;
	}
	if ($("#birthday").val() == '') {
		alert("자녀의 생년월일을 입력하세요.");
		clicked = false;
		return;
	}
	if ($("#relation").val() == '') {
		alert("자녀와의 관계를 알려주세요.");
		clicked = false;
		return;
	}
	if ($("#relation").val() === 'etc' && $("#relation-desc").val() === '') {
		alert("자녀와의 관계를 알려주세요.");
		clicked = false;
		return;
	}
	$.ajax({
		url: "/ajax/member/child",
		method: "post",
		data: {
			name: $("#name").val(),
			gender: $(".gender:checked").val(),
			birthday: $("#birthday").val().replace(/\./g, '-'),
			relation: $("#relation").val(),
			relation_desc: $("#relation-desc").val()
		}
	}).done(function(res) {
		$("#name").val("");
		$(".gender:checked").prop("checked", false);
		$("#birthday").val("");
		$("#relation option:selected").prop("selected", false);
		$("#relation-desc").val("");
		onAddChildSuccess(res.result);
		$("#add_child").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		clicked = false;
	}).fail(function(err) {
		console.error(err);
		alert("에러가 발생했습니다.");
		clicked = false;
	});
});