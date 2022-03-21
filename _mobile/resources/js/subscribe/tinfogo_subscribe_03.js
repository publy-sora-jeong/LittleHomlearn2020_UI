$("#choose-subscribe").off("change").on("change", function() {
	if ($(this).prop("checked")) {
		$(".topBox .listBox").show();
	} else {
		$(".topBox .listBox").hide();
	}
	$("#bg_cover2").hide();
});
$(".topBox .listBox li").off("click").on("click", function() {
	$("#choose-subscribe ~ label .left").html($(this).find(".left").html());
	$("#choose-subscribe ~ label .right").html($(this).find(".right").html());
	$("#td-term").text($(this).find(".left").data("term"));
	$("#td-price").text($(this).find(".right").data("price") + '원');
	selected_product_seq = $(this).data("seq");
	$("#choose-subscribe").prop("checked", false);
	$(".topBox .listBox").hide();
});

var clicked = false;
$(".bottomBtn").off('click').on('click', function() {
	if (clicked) return;
	clicked = true;
	if (!$("#agree").prop("checked")) {
		alert("정기결제에 대한 안내사항을 확인하고 동의해 주세요.");
		clicked = false;
		return;
	}
	window.open("", "inicis");
	$.ajax({
		url: "/ajax/subscribe/" + selected_product_seq + "/getPaymentParameters",
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
//		$("#inicisForm").attr("target", "inicisFrame");
//		$("#inicisForm").submit();
//		$("#inicisFrame").show();
//		$("#loading_layer").show();
//		$("body").css("overflow", "hidden");
		openPopPost("inicis", $("#inicisForm")[0]);
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
});

function gotoFinish(inicis_billing_seq, payAuthCode, tid) {
	$("#loading_layer").show();
	location.replace("/subscribe/finish" + location.search + "&inicis_billing_seq=" + inicis_billing_seq + "&payAuthCode=" + payAuthCode + "&tid=" + tid + "&address_seq=" + address_seq);
}
function gotoFinish2(res) {
	$("#loading_layer").show();
	location.replace("/subscribe/finish2" + location.search + "&" + res + "&address_seq=" + address_seq);
}
function insertFailPayLog(inicis_billing_seq, msg, tid) {
	if (msg === undefined) msg = '';
	if (tid === undefined) tid = '';
	$.ajax({
		url: "/ajax/failPayLog" + location.search + "&inicis_billing_seq=" + inicis_billing_seq + "&msg=" + encodeURI(msg) + "&tid=" + tid,
		method: "get"
	});
}
function insertFailPayLog2(res) {
	$.ajax({
		url: "/ajax/failPayLog2" + location.search + "&" + res,
		method: "get"
	});
}

window.addEventListener('message', function(e) {
	if (e.data.action === 'showLoading') {
		$("#loading_layer").show();
	}
	if (e.data.action === 'hideLoading') {
		$("#loading_layer").hide();
	}
	if(e.data.action === 'insertFailPayLog') {
		insertFailPayLog(e.data.params[0], e.data.params[1], e.data.params[2]);
	}
	if(e.data.action === 'insertFailPayLog2') {
		insertFailPayLog2(e.data.params[0]);
	}
	if(e.data.action === 'alert') {
		if (typeof e.data.callback !== 'undefined') {
			if (e.data.callback.method === 'gotoFinish') {
				alert(e.data.params[0], function() {
					gotoFinish(e.data.callback.params[0], e.data.callback.params[1], e.data.callback.params[2]);
				});
			} else if (e.data.callback.method === 'gotoFinish2') {
				alert(e.data.params[0], function() {
					gotoFinish2(e.data.callback.params[0]);
				});
			}
		} else {
			alert(e.data.params[0]);
		}
	}
}, false);