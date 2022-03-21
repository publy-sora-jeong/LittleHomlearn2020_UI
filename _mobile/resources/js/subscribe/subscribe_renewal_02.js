$(".bottomBtn").off("click").on("click", function() {
	var address = {
		seq: $("#address_seq").val(),
		receiver_name: $("#receiver_name").val(),
		address1: $("#address1").val(),
		address2: $("#address2").val(),
		receiver_phone: $("#phone-select").val() + $("#phone").val(),
		memo: $("#memo").val(),
		zipcode: $("#zipcode").val(),
		address_save: $("#address_save").prop("checked")
	};
	if (address.name == '') { alert("수령인을 입력하세요."); return; }
	if (address.address1 == '') { alert("기본 주소를 입력하세요."); return; }
	if (address.address2 == '') { alert("상세 주소를 입력하세요."); return; }
	if (address.phone == '') { alert("수령인 전화번호를 입력하세요."); return; }
	if (address.phone.length > 8) { alert("휴대전화번호를 확인해주세요."); return; }
	location.replace("/subscribe/renewal/03?subscribe_seq=" + subscribe_seq + "&selected_product_seq=" + selected_product_seq + "&start_date=" + start_date + "&address_json=" + encodeURIComponent(JSON.stringify(address)));
});
$("#memo").off('input').on('input', function() {
	this.value = this.value.replace(/[^0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ]/g, '').substring(0, 20);
});
$(".address_list .btn.active").off("click").on("click", function() {
	var address = $(this).parent().data('json');
	//$("#receiver_name").val(address.receiver_name);
	$("#address1").val(address.address1);
	$("#address2").val(address.address2);
	$("#phone-select option[value=" + address.receiver_phone.substring(0, 3) + "]").prop("selected", true);
	$("#phone").val(address.receiver_phone.substring(3));
	$("#memo").val(address.memo);
	$("#address_seq").val(address.seq);
	$("#zipcode").val(address.zipcode);
	$("#address").hide();
	$("html, body").removeClass("bgFix");
	$("#wraper").removeClass("position");
});