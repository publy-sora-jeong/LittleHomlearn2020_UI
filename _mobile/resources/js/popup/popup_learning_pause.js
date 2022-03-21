function oncomplete1(year, month, date) {
	var date = new Date(year, month - 1, date);
	$("#date1").val(date.format('yyyy.MM.dd (E)'))
	.data('date', date.format('yyyy-MM-dd'));
}
function oncomplete2(year, month, date) {
	var date = new Date(year, month - 1, date);
	$("#date2").val(date.format('yyyy.MM.dd (E)'))
	.data('date', date.format('yyyy-MM-dd'));
}
var clicked = false;
function requestPauseLearning() {
	if (clicked) return;
	clicked = true;
	var date1 = $("#date1").data('date');
	var date2 = $("#date2").data('date');
	if (date1 === date2) {
		alert("학습유예기간 시작일과 종료일을 다르게 설정해 주세요.");
		clicked = false;
		return;
	}
	$.ajax({
		url: "/ajax/subscribe/" + currentSubscribe_seq + "/probation",
		method: "post",
		data: {
			start_date: date1,
			end_date: date2
		}
	}).done(function(res) {
		alert("학습유예가 신청되었습니다.");
		$("#learning_pause").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		refreshChildLearngin_main();
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
}