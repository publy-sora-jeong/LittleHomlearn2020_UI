$(function() {
    $("#mypage .detail_tab a").click(function(){
		if($(this).hasClass("tab01")){
			$(this).next().addClass("color_gray");
			$(this).next().removeClass("active");
			$(this).removeClass("color_gray");
			$(this).addClass("active");
			$(this).parent().next().find(".delivery").hide();
			$(this).parent().next().find(".payment").show();
		} if($(this).hasClass("tab02")){
			$(this).prev().addClass("color_gray");
			$(this).prev().removeClass("active");
			$(this).removeClass("color_gray");
			$(this).addClass("active");
			$(this).parent().next().find(".payment").hide();
			$(this).parent().next().find(".delivery").show();
		}
	});
});

function showPaymentList(seq, input) {
	if ($("#list-" + seq + " .detailBox .contBox.payment").css('display') === 'none') {
		$.ajax({
			url: "/ajax/mypage/subscribe/" + seq + "/payments",
			method: "get",
			data: {
				page: "01"
			}
		}).done(function(res) {
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").next().addClass("color_gray");
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").next().removeClass("active");
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").removeClass("color_gray");
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").addClass("active");
			var $temp = $("<div>").html(res);
			$("#list-" + seq + " .detailBox .contBox.payment").html($temp.find(".contBox.payment").html()).show();
			$("#list-" + seq + " .detailBox .contBox.delivery").hide();
		});
	} else {
		$("#list-" + seq + " .detailBox .contBox.payment").hide();
		$("#list-" + seq + " .detailBox .contBox.delivery").hide();
		$("#list-" + seq + " .detailBox .detail_tab a.tab02").prev().removeClass("active");
		$("#list-" + seq + " .detailBox .detail_tab a.tab02").removeClass("color_gray");
	}
}

function showDeliveryList(seq, input) {
	if ($("#list-" + seq + " .detailBox .contBox.delivery").css('display') === 'none') {
		$.ajax({
			url: "/ajax/mypage/subscribe/" + seq + "/delivery",
			method: "get"
		}).done(function(res) {
			$("#list-" + seq + " .detailBox .detail_tab a.tab02").prev().addClass("color_gray");
			$("#list-" + seq + " .detailBox .detail_tab a.tab02").prev().removeClass("active");
			$("#list-" + seq + " .detailBox .detail_tab a.tab02").removeClass("color_gray");
			$("#list-" + seq + " .detailBox .detail_tab a.tab02").addClass("active");
			var $temp = $("<div>").html(res);
			$("#list-" + seq + " .detailBox .contBox.delivery").html($temp.find(".contBox.delivery").html()).show();
			$("#list-" + seq + " .detailBox .contBox.payment").hide();
		});
	} else {
		$("#list-" + seq + " .detailBox .contBox.delivery").hide();
		$("#list-" + seq + " .detailBox .contBox.payment").hide();
		$("#list-" + seq + " .detailBox .detail_tab a.tab01").next().removeClass("active");
		$("#list-" + seq + " .detailBox .detail_tab a.tab01").removeClass("color_gray");
	}
}

function openChangeDeliveryAddressPopup(seq, apply_delivery_seq) {
	$.ajax({
		url: "/ajax/mypage/subscribe/" + seq + "/delivery/" + apply_delivery_seq,
		method: "get"
	}).done(function(res) {
		console.log(res.result);
		$("#address_change #address_change_week").text(res.result.week + "주차");
		$("#address_change #address_change_date").text(res.result.week + "주차 배송 예정일 : " + res.result.nextDate);
		$("#address_change #seq").val(res.result.seq);
		$("#address_change #subscribe_seq").val(res.result.subscribe_seq);
		$("#address_change #week").val(res.result.week);
		$("#address_change #target_date").val(res.result.target_date);
		$("#address_change #receiver_name").val(res.result.receiver_name);
		$("#address_change #zipcode").val(res.result.zipcode);
		$("#address_change #address1").val(res.result.address1);
		$("#address_change #address2").val(res.result.address2);
		$("#address_change #phone-select option[value=" + res.result.receiver_phone1 + "]").prop('selected', true);
		$("#address_change #phone").val(res.result.receiver_phone2);
		$("#address_change #memo").val(res.result.delivery_memo);
		popup_page_open('address_change');
	});
}

var currentPage = 0;
function load(page) {
	$.ajax({
		url: "/ajax/mypage/subscribe",
		method: "get",
		data: {
			seq: login_seq,
			page: page
		}
	}).done(function(res) {
		var $temp = $("<div>").html(res);
		$("#totalCount").text($temp.find("#totalCount").val());
		if (parseInt($temp.find("#totalCount").val().replace('건', '')) === 0) {
			$("div .order_list").addClass('empty').html($temp.find("div .order_list").html());
		} else {
			$("div .order_list").removeClass('empty').append($temp.find("div .order_list").html());
		}
	}).fail(function(err) {
		console.log(err);
		alert("에러가 발생했습니다.");
	});
}
var cancel_subscribe_seq = 0;
var clicked = false;
function open_cancel_subscribe(seq) {
	if (clicked) return;
	clicked = true;
	cancel_subscribe_seq = seq;
	$.ajax({
		url: "/ajax/subscribe/" + seq + "/cancel/dayInfo",
		method: "get"
	}).done(function(res) {
		var dayInfo = JSON.parse(res.result);
//		if (dayInfo.dayCount < 7) {
//			confirm("정기구독을 취소하시겠습니까?", function() {
//				var reasonArr = [];
//				reasonArr.push('n');
//				reasonArr.push('n');
//				reasonArr.push('n');
//				reasonArr.push('n');
//				reasonArr.push('n');
//				reasonArr.push('n');
//				reasonArr.push('구독 신청 후 7일 이내 해지신청');
//				var reason = reasonArr.join(":::");
//				$.ajax({
//					url: "/ajax/claim/request",
//					method: "post",
//					data: {
//						seq: cancel_subscribe_seq,
//						reason: reason
//					}
//				}).done(function(res) {
//					location.reload();
//				}).fail(function(err) {
//					console.log(err);
//					alert("에러가 발생했습니다.");
//					clicked = false;
//				});
//			}, function() {
//				clicked = false;
//			});
//			return;
//		}
		$("#claimDate").text(dayInfo.claimDate);
		if (dayInfo.studyEndDate === '')
			$("#studyEndDateWrapper").hide();
		else {
			$("#studyEndDateWrapper").show();
			$("#studyEndDate").text(dayInfo.studyEndDate);
		}
		popup_page_open('subscribe_cancel');
		clicked = false;
	}).fail(function(err) {
		console.log(err);
		alert("에러가 발생했습니다.");
		clicked = false;
	});
}
$(function() {
	load(currentPage = 1);
});

function open_cancel_info_popup(price, cancel_price) {
	$("#cancel-info-pay-price").text(price.won());
	$("#cancel-info-cancel-price").text(cancel_price.won());
	popup_page_open('creativity_cancel_02');
}