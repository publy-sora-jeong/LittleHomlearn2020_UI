var clicked = false;
$(".bottomBtn").off('click').on('click', function() {
	if (clicked) return;
	clicked = true;
	window.open("", "inicis");
	$.ajax({
		url: "/ajax/claim/" + seq + "/getPaymentParameters",
		method: "post",
		data: {
			pay_method: $("input[name=pay_method]:checked").val()
		}
	}).done(function(res) {
		$("#inicisForm input").remove();
		$("#inicisForm").append('<input type="hidden" name="P_INI_PAYMENT" value="' + res.result.p_INI_PAYMENT + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_MID" value="' + res.result.p_MID + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_GOODS" value="' + res.result.p_GOODS + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_OID" value="' + res.result.p_OID + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_AMT" value="' + res.result.p_AMT + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_UNAME" value="' + res.result.p_UNAME + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_MOBILE" value="' + res.result.p_MOBILE + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_EMAIL" value="' + res.result.p_EMAIL + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_NEXT_URL" value="' + res.result.p_NEXT_URL + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_NOTI" value="' + res.result.p_NOTI + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_NOTI_URL" value="' + res.result.p_NOTI_URL + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_QUOTABASE" value="' + res.result.p_QUOTABASE + '" />');
		$("#inicisForm").append('<input type="hidden" name="P_CHARSET" value="utf8" />');
		$("#inicisForm").attr("accept-charset", "euc-kr");
//		$("#inicisForm").attr("target", "inicisFrame");
		$("#inicisForm").attr("action", "https://mobile.inicis.com/smart/payment");
//		$("#inicisForm").submit();
//		$("#inicisFrame").show();
		$("#loading_layer").show();
		openPopPost("inicis", $("#inicisForm")[0]);
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
});

window.addEventListener('message', function(e) {
	if(e.data.action === 'hideLoading') {
		$("#loading_layer").hide();
	}
	if(e.data.action === 'alert') {
		if (e.data.callback !== undefined) {
			if (e.data.callback.method === 'move') {
				alert(e.data.params[0], function() {
					location.href = e.data.callback.params[0];
				});
			}
		} else {
			alert(e.data.params[0]);
		}
	}
}, false);