var clicked = false;
function requestClaim() {
	if (clicked) return;
	clicked = true;
	if ($("#reason1:checked, #reason2:checked, #reason3:checked, #reason4:checked, #reason5:checked, #reason6:checked").length === 0) {
		alert("해지를 원하는 이유를 알려주세요.");
		clicked = false;
		return;
	}
	confirm("해지가 요청되었습니다.<br/>해지를 요청하시면, 상담원이 확인 후<br/>해지를 처리하여 드립니다.", function() {
		var reasonArr = [];
		reasonArr.push($("#reason1").prop("checked") ? 'y' : 'n');
		reasonArr.push($("#reason2").prop("checked") ? 'y' : 'n');
		reasonArr.push($("#reason3").prop("checked") ? 'y' : 'n');
		reasonArr.push($("#reason4").prop("checked") ? 'y' : 'n');
		reasonArr.push($("#reason5").prop("checked") ? 'y' : 'n');
		reasonArr.push($("#reason6").prop("checked") ? 'y' : 'n');
		reasonArr.push($("#reasonEtcText").val());
		var reason = reasonArr.join(":::");
		$.ajax({
			url: "/ajax/claim/request",
			method: "post",
			data: {
				seq: cancel_subscribe_seq,
				reason: reason
			}
		}).done(function(res) {
			//location.reload();
			location.href = "/mypage/02";
		}).fail(function(err) {
			console.log(err);
			alert("에러가 발생했습니다.");
			clicked = false;
		});
	}, function() {
		clicked = false;
	});
}