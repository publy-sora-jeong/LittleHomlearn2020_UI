var clicked = false;
$(".bottomBtn").off('click').on('click', function() {
	if (clicked) return;
	clicked = true;
	if (!$("#agree").prop("checked")) {
		alert("정기결제에 대한 안내사항을 확인하고 동의해 주세요.");
		clicked = false;
		return;
	}
	if (bill_seq !== '' && authcode !== '' && tid !== '') {
		// 이전 결제 정보 사용
		if (status === 'end') {
			$.ajax({
				url: "/ajax/subscribe/" + subscribe_seq + "/bill/" + bill_seq,
				method: "get",
				success: function(res) {
					$.ajax({
						crossOrigin: true,
						proxy: "/ajax/crossOriginProxy",
						url: res.result.endpoint,
						method: "post",
						data: {
							type: encodeURI(res.result.type),
							paymethod: encodeURI(res.result.paymethod),
							timestamp: encodeURI(res.result.timestamp),
							clientIp: encodeURI(res.result.clientIp),
							mid: encodeURI(res.result.mid),
							url: encodeURI(res.result.url),
							moid: encodeURI(res.result.moid),
							goodName: encodeURI(res.result.goodName),
							buyerName: encodeURI(res.result.buyerName),
							buyerEmail: encodeURI(res.result.buyerEmail),
							buyerTel: encodeURI(res.result.buyerTel),
							price: encodeURI(res.result.price),
							currency: encodeURI(res.result.currency),
							billKey: encodeURI(res.result.billKey),
							authentification: encodeURI(res.result.authentification),
							cardQuota: encodeURI(res.result.cardQuota),
							quotaInterest: encodeURI(res.result.quotaInterest),
							hashData: encodeURI(res.result.hashData)
						},
						success: function(res) {
							res = JSON.parse(res);
							console.log(res);
							if (res.resultCode == '00' && res.resultMsg.indexOf('초과') === -1 && res.resultMsg.indexOf('부족') === -1 && res.payAuthCode !== 'ERROR') {
								alert("결제가 완료되었습니다.", function() {
									gotoFinish(bill_seq, res.payAuthCode, res.tid);
								});
							} else {
								insertFailPayLog(bill_seq, res.resultMsg, res.tid);
								alert(res.resultMsg || "결제 승인이 거절되었습니다.");
								$("#loading_layer").hide();
							}
						},
						error: function(err) {
							console.error(err);
							alert("에러가 발생했습니다.");
							$("#loading_layer").hide();
						}
					});
				},
				error: function(err) {
					console.error(err);
					alert("에러가 발생했습니다.");
					$("#loading_layer").hide();
				}
			});
		} else {
			gotoFinish(bill_seq, authcode, tid);
		}
		return;
	}
	window.open("", "inicis");
	$.ajax({
		url: "/ajax/subscribe/" + subscribe_seq + "/getPaymentParametersForRenewal",
		method: "post"
	}).done(function(res) {
		$("#inicisForm input").remove();
		if (typeof res.result.hashdata === "undefined") {
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
			$("#inicisForm").append('<input type="hidden" name="P_RESERVED" value="below1000=Y" />');
			$("#inicisForm").append('<input type="hidden" name="P_CHARSET" value="utf8" />');
			$("#inicisForm").attr("accept-charset", "euc-kr");
			$("#inicisForm").attr("action", "https://mobile.inicis.com/smart/payment");
		} else {
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
			$("#inicisForm").attr("action", "https://inilite.inicis.com/inibill/inibill_card.jsp");
		}
//		$("#inicisForm").attr("target", "inicisFrame")
//		$("#inicisForm").submit();
//		$("#inicisFrame").show();
		$("#loading_layer").show();
//		$("body").css("overflow", "hidden");
		openPopPost("inicis", $("#inicisForm")[0]);
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
});

function gotoFinish(inicis_billing_seq, payAuthCode, tid) {
	location.replace("/subscribe/renewal/finish" + location.search + "&inicis_billing_seq=" + inicis_billing_seq + "&payAuthCode=" + payAuthCode + "&tid=" + tid + "&address_seq=" + address_seq);
}
function insertFailPayLog(inicis_billing_seq, msg, tid) {
	if (msg === undefined) msg = '';
	if (tid === undefined) tid = '';
	$.ajax({
		url: "/ajax/failPayLog" + location.search + "&inicis_billing_seq=" + inicis_billing_seq + "&msg=" + encodeURI(msg) + "&tid=" + tid,
		method: "get"
	});
}

window.addEventListener('message', function(e) {
	if(e.data.action === 'hideLoading') {
		$("#loading_layer").hide();
	}
	if(e.data.action === 'insertFailPayLog') {
		insertFailPayLog(e.data.params[0], e.data.params[1], e.data.params[2]);
	}
	if(e.data.action === 'alert') {
		if (typeof e.data.callback !== 'undefined') {
			if (e.data.callback.method === 'gotoFinish') {
				alert(e.data.params[0], function() {
					gotoFinish(e.data.callback.params[0], e.data.callback.params[1], e.data.callback.params[2])
				});
			}
		} else {
			alert(e.data.params[0]);
		}
	}
}, false);