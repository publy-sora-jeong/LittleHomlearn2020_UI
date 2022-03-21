var clicked = false;
$("#memo").off('input').on('input', function() {
	this.value = this.value.replace(/[^0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ]/g, '').substring(0, 20);
});
function updateAddress() {
	if (clicked) return;
	clicked = true;
	if ($("#address_change #receiver_name").val() === '') {
		alert("수령인을 입력하세요.");
		clicked = false;
		return;
	}
	if ($("#address_change #address1").val() === '') {
		alert("기본 주소를 입력하세요.");
		clicked = false;
		return;
	}
	if ($("#address_change #zipcode").val() === '') {
		alert("기본 주소는 우편번호 찾기로 입력하세요.");
		clicked = false;
		return;
	}
	if ($("#address_change #address2").val() === '') {
		alert("상세 주소를 입력하세요.");
		clicked = false;
		return;
	}
	if ($("#address_change #phone").val() === '') {
		alert("휴대전화번호를 입력하세요.");
		clicked = false;
		return;
	}
	$.ajax({
		url: "/ajax/member/subscribe/" + $("#address_change #subscribe_seq").val() + "/delivery/" + $("#address_change #week").val(),
		method: "post",
		data: {
			receiver_name: $("#address_change #receiver_name").val(),
			address1: $("#address_change #address1").val(),
			address2: $("#address_change #address2").val(),
			zipcode: $("#address_change #zipcode").val(),
			receiver_phone: $("#address_change #phone-select").val() + $("#address_change #phone").val(),
			memo: $("#address_change #memo").val(),
			apply_date: $("#address_change #target_date").val()
		}
	}).done(function() {
		$("#address_change").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		if ($("#address_change #subscribe_seq").val() !== '') {
			var subscribe_seq = $("#address_change #subscribe_seq").val();
			$.ajax({
				url: "/ajax/mypage/subscribe/" + subscribe_seq + "/delivery",
				method: "get"
			}).done(function(res) {
				$("#list-" + subscribe_seq + " .detailBox .detail_tab a.tab02").prev().addClass("color_gray");
				$("#list-" + subscribe_seq + " .detailBox .detail_tab a.tab02").prev().removeClass("active");
				$("#list-" + subscribe_seq + " .detailBox .detail_tab a.tab02").removeClass("color_gray");
				$("#list-" + subscribe_seq + " .detailBox .detail_tab a.tab02").addClass("active");
				var $temp = $("<div>").html(res);
				$("#list-" + subscribe_seq + " .detailBox .contBox.delivery").html($temp.find(".contBox.delivery").html()).show();
				$("#list-" + subscribe_seq + " .detailBox .contBox.payment").hide();
			});
		}
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
}