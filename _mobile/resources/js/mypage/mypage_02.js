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

function showPaymentList(seq) {
	if ($("#list-" + seq + " .detailBox .contBox.payment").css('display') === 'none') {
		$.ajax({
			url: "/ajax/mypage/subscribe/" + seq + "/payments",
			method: "get",
			data: {
				page: "02"
			}
		}).done(function(res) {
			var $temp = $("<div>").html(res);
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").next().addClass("color_gray");
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").next().removeClass("active");
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").removeClass("color_gray");
			$("#list-" + seq + " .detailBox .detail_tab a.tab01").addClass("active");
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

function showDeliveryList(seq) {
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
		url: "/ajax/mypage/claim",
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
function open_subscribe_cancel_reason_popup(reason) {
	console.log(reason);
	var arr = reason.split(":::");
	var reason_arr = [];
	if (arr[0] === 'y') reason_arr.push("콘텐츠 부족");
	if (arr[1] === 'y') reason_arr.push("콘텐츠 품질 불만족");
	if (arr[2] === 'y') reason_arr.push("서비스 이용 불편");
	if (arr[3] === 'y') reason_arr.push("이용빈도 낮음");
	if (arr[4] === 'y') reason_arr.push("다른 상품으로 변경");
	if (arr[5] === 'y') reason_arr.push("기타");
	if (arr[6] !== '') reason_arr.push(arr[6]);
	$("#subscribe_cancel_reason .reason_text").text(reason_arr.join(', '));
	popup_page_open('subscribe_cancel_reason');
}
$(function() {
	load(currentPage = 1);
});

function open_cancel_info_popup(price, cancel_price) {
	$("#cancel-info-pay-price").text(price.won());
	$("#cancel-info-cancel-price").text(cancel_price.won());
	popup_page_open('creativity_cancel_02');
}