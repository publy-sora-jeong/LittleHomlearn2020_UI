function cancel() {
	$("#delete").hide();
	$("html, body").removeClass("bgFix");
	$("#wraper").removeClass("position");
}
var clicked = false;
function _delete() {
	if (clicked) return;
	clicked = true;
	$.ajax({
		url: "/ajax/member/child/" + selected_delete_seq,
		method: "delete"
	}).done(function(res) {
		location.reload();
	}).fail(function(err) {
		console.log(err);
		alert("에러가 발생했습니다.");
		$("#delete").hide();
		clicked = false;
	});
}