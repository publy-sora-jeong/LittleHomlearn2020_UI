var clicked = false;
function requestRestartLearning() {
	if (clicked) return;
	clicked = false;
	$.ajax({
		url: "/ajax/subscribe/" + currentSubscribe_seq + "/probation/cancel",
		method: "post",
		data: {
			start: current
		}
	}).done(function(res) {
		alert('학습 유예가 해제 처리되었습니다.<br/>' + current + '부터 학습이 재시작 됩니다.');
		$("#learning_restart").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		refreshChildLearngin_main();
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
}