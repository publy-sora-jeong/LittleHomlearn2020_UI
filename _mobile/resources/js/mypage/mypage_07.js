function open_add_popup() {
	$("#address_add #seq").val('');
	$("#address_add #address_name").val('');
	$("#address_add #receiver_name").val('');
	$("#address_add #address1").val('');
	$("#address_add #address2").val('');
	$("#address_add #zipcode").val('');
	$("#address_add #phone-select option[value=010]").prop("selected");
	$("#address_add #phone").val('');
	$("#address_add .popup_header .title").text('배송지 추가');
	popup_page_open('address_add');
}
function open_add_popup_as_edit_popup(address, is_using) {
	$("#address_add #seq").val(address.seq);
	$("#address_add #address_name").val(address.address_name);
	$("#address_add #receiver_name").val(address.receiver_name);
	$("#address_add #address1").val(address.address1);
	$("#address_add #address2").val(address.address2);
	$("#address_add #zipcode").val(address.zipcode);
	$("#address_add #phone-select option[value=" + address.receiver_phone.substring(0, 3) + "]").prop("selected");
	$("#address_add #phone").val(address.receiver_phone.substring(3));
	$("#address_add #is_using").val(is_using);
	$("#address_add .popup_header .title").text('배송지 수정');
	popup_page_open('address_add');
}
function open_delete_popup(seq) {
	$("#delete #delete-target").val(seq);
	popup_page_open('delete');
}

var clicked = false;
$("#address_add .bottomBtn").off('click').on('click', function() {
	if (clicked) return;
	clicked = true;
	/* if ($("#address_add #address_name").val() === '') {
		alert('배송지명을 입력하세요.');
		return;
	}
	if ($("#address_add #receiver_name").val() === '') {
		alert('수령인을 입력하세요.');
		return;
	}
	if ($("#address_add #address1").val() === '') {
		alert('기본 주소를 입력하세요.');
		return;
	}
	if ($("#address_add #address2").val() === '') {
		alert('상세 주소를 입력하세요.');
		return;
	}
	if ($("#address_add #phone").val() === '') {
		alert('전화번호를 입력하세요.');
		return;
	} */
	if ($("#address_add #seq").val() === '') {
		// add
		$.ajax({
			url: "/ajax/mypage/address",
			method: "post",
			data: {
				address_name: $("#address_add #address_name").val(),
				receiver_name: $("#address_add #receiver_name").val(),
				address1: $("#address_add #address1").val(),
				address2: $("#address_add #address2").val(),
				zipcode: $("#address_add #zipcode").val(),
				receiver_phone: $("#address_add #phone-select").val() + $("#address_add #phone").val()
			}
		}).done(function(res) {
			location.reload();
		}).fail(function(err) {
			if (err.responseJSON.validationError.message !== null) {
				alert(err.responseJSON.validationError.message);
				clicked = false;
				return;
			}
			alert(err.responseJSON.error || "에러가 발생했습니다.");
			clicked = false;
		});
	} else {
		// edit
		$.ajax({
			url: "/ajax/mypage/address/" + $("#address_add #seq").val(),
			method: "post",
			data: {
				address_name: $("#address_add #address_name").val(),
				receiver_name: $("#address_add #receiver_name").val(),
				address1: $("#address_add #address1").val(),
				address2: $("#address_add #address2").val(),
				zipcode: $("#address_add #zipcode").val(),
				receiver_phone: $("#address_add #phone-select").val() + $("#address_add #phone").val(),
				is_using: $("#address_add #is_using").val()
			}
		}).done(function(res) {
			location.reload();
		}).fail(function(err) {
			if (err.responseJSON.validationError.message !== null) {
				alert(err.responseJSON.validationError.message);
				clicked = false;
				return;
			}
			alert(err.responseJSON.error || "에러가 발생했습니다.");
			clicked = false;
		});
	}
});
$("#delete .btn02").off('click').on('click', function() {
	if (clicked) return;
	clicked = true;
	$.ajax({
		url: "/ajax/mypage/address/" + $("#delete #delete-target").val(),
		method: "delete"
	}).done(function(res) {
		location.reload();
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
});