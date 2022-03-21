// 틴포GO 정기구독신청 중간 학습시작일 선택
$(function() {
	$('.selectBox .select_text').click(function(){
		if ($(this).next(".optionBox").length > 0) {
			$(this).next(".optionBox").show();
			$("#bg_cover").show();
		}
	});
	$('.selectBox .optionBox li').click(function(){ 
		$(this).parents(".optionBox").hide();
		$("#bg_cover").hide();
		$('.selectBox .select_text').removeClass("active");
		$('.selectBox .select_text').text($(this).text());
	});
	$('.selectBox .optionBox input').focusout(function() {
	  $(this).parent(".optionBox").hide();
	  $(".selectBox .select_text").removeClass("active");
	});
});
$(document).mouseup(function (e) {
	var container = $(".selectBox .optionBox");
	if (!container.is(e.target) && container.has(e.target).length === 0){
		container.hide();
		$("#bg_cover").hide();
	}	
});
$(".bottomBtn").off("click").on("click", function() {
	if (skip_address === 'n') {
		location.replace("/subscribe/renewal/02?subscribe_seq=" + subscribe_seq + "&selected_product_seq=" + selected_product_seq + "&start_date=" + encodeURI($('.selectBox .select_text').text()));
		return;
	}
	location.replace("/subscribe/renewal/03?subscribe_seq=" + subscribe_seq + "&selected_product_seq=" + selected_product_seq + "&start_date=" + encodeURI($('.selectBox .select_text').text()));
});