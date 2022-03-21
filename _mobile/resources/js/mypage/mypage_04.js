$(function() {
	$.ajax({
		url: "/ajax/mypage/card/subscribe",
		method: "get"
	}).done(function(res) {
		var $temp = $("<div>").html(res);
		$("#totalCount").text($temp.find("#totalCount").val());
		$("div .order_list").html($temp.find("div .order_list").html());
	}).fail(function(err) {
		alert("에러가 발생했습니다.");
	});
});

function openChangeHistoryPopup(seq) {
	$.ajax({
		url: "/ajax/mypage/card/subscribe/" + seq + "/history",
		method: "get"
	}).done(function(html) {
		var $temp = $("<div>").html(html);
		if ($temp.find("#change_history .change_history_list li").length === 0) {
			alert("변경이력이 없습니다.");
			return;
		}
		$("#change_history").html($temp.find("#change_history").html());
		popup_page_open('change_history');
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
}

var clicked = false;
function change(seq) {
	if (clicked) return;
	clicked = true;
	$.ajax({
		url: "/ajax/mypage/card/subscribe/" + seq + "/check",
		method: "get"
	}).done(function(res) {
		if (!res.result) {
			alert("납부카드 변경신청은 월(4주) 1회에 한해서만<br/>가능합니다.");
			clicked = false;
			return;
		}
		window.open("", "inicis");
		$.ajax({
			url: "/ajax/subscribe/" + seq + "/getPaymentParametersForChangeCard",
			method: "post"
		}).done(function(res) {
			$("#inicisForm input").remove();
			$("#inicisForm").append('<input type="hidden" name="mid" value="' + res.result.mid + '" />');
			$("#inicisForm").append('<input type="hidden" name="buyername" value="' + res.result.buyername + '" />');
			$("#inicisForm").append('<input type="hidden" name="goodname" value="' + res.result.goodname + '" />');
			$("#inicisForm").append('<input type="hidden" name="price" value="' + res.result.price + '" />');
			$("#inicisForm").append('<input type="hidden" name="orderid" value="' + res.result.orderid + '" />');
			$("#inicisForm").append('<input type="hidden" name="returnurl" value="' + res.result.returnurl + '" />');
			$("#inicisForm").append('<input type="hidden" name="merchantreserved" value="' + res.result.merchantreserved + '" />');
			$("#inicisForm").append('<input type="hidden" name="timestamp" value="' + res.result.timestamp + '" />');
			$("#inicisForm").append('<input type="hidden" name="period" value="' + res.result.period + '" />');
			$("#inicisForm").append('<input type="hidden" name="period_custom" value="' + res.result.period_custom + '" />');
			$("#inicisForm").append('<input type="hidden" name="carduse" value="' + res.result.carduse + '" />');
			$("#inicisForm").append('<input type="hidden" name="p_noti" value="' + res.result.p_noti + '" />');
			$("#inicisForm").append('<input type="hidden" name="hashdata" value="' + res.result.hashdata + '" />');
			$("#inicisForm").append('<input type="hidden" name="merchantreserved" value="below1000=Y">');
			$("#inicisForm").attr("target", "inicisFrame");
			$("#inicisForm").attr("action", "https://inilite.inicis.com/inibill/inibill_card.jsp");
//			$("#inicisForm").submit();
//			$("#inicisFrame").show();
			$("#loading_layer").show();
//			$("body").css("overflow", "hidden");
			openPopPost("inicis", $("#inicisForm")[0]);
			clicked = false;
		}).fail(function(err) {
			alert(err.responseJSON.error || "에러가 발생했습니다.");
			clicked = false;
		});
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
}

window.addEventListener('message', function(e) {
	if(e.data.action === 'hideLoading') {
		$("#loading_layer").hide();
	}
	if(e.data.action === 'alert') {
		alert(e.data.params[0]);
	}
}, false);