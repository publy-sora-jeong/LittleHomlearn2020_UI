// 틴포GO 정기구독신청 중간 학습시작일 선택
var selectBoxOpened = false;
$(function() {
	$('.selectBox .select_text').click(function(){
		if (selectBoxOpened) {
			$(this).removeClass("click");
			$(this).next(".optionBox").hide();
			$("#bg_cover").hide();
			selectBoxOpened = false;
		} else {
			$(this).addClass("click");
			$(this).next(".optionBox").show();
			$("#bg_cover").show();
			selectBoxOpened = true;
		}
	});
	$('.selectBox .optionBox li').click(function(){ 
		$(this).parents(".optionBox").hide();
		$("#bg_cover").hide();
		selectBoxOpened = false;
		$('.selectBox .select_text').removeClass("click");
		$('.selectBox .select_text').text($(this).text());
	});
	$('.selectBox .optionBox input').focusout(function() {
	  $(this).parent(".optionBox").hide();
	  $('.selectBox .select_text').removeClass("click");
		selectBoxOpened = false;
	});
});
$(document).mouseup(function (e) {
	var container = $(".selectBox .optionBox");
	if (!container.is(e.target) && container.has(e.target).length === 0){
		container.hide();
		$("#bg_cover").hide();
		selectBoxOpened = false;
		$('.selectBox .select_text').removeClass("click");
	}	
});
$("#choose-subscribe").off("change").on("change", function() {
	if ($(this).prop("checked")) {
		$(".topBox .listBox").show();
		$(".topBox").css("zIndex", "10");
	} else {
		$(".topBox .listBox").hide();
		$(".topBox").css("zIndex", "5");
	}
});
$(".topBox .listBox li").off("click").on("click", function() {
	$("#choose-subscribe ~ label .left").html($(this).find(".left").html());
	$("#choose-subscribe ~ label .right").html($(this).find(".right").html());
	selected_product_seq = $(this).data("seq");
	$("#choose-subscribe").prop("checked", false);
	$(".topBox .listBox").hide();
});

$(".bottomBtn").off("click").on("click", function() {
	if ($(".children-checkbox:checked").length == 0) {
		alert("틴포GO와 함께할 자녀를 선택하시거나<br/>새로 추가해 주세요.");
		return;
	}
	location.replace("/subscribe/02?selected_product_seq=" + selected_product_seq + "&selected_children=" + $(".children-checkbox:checked").val() + "&start_date=" + encodeURI($('.selectBox .select_text').text()));
});
function onAddChildSuccess(child) {
	$(".checkBox .addBtn").remove();
	$(".checkBox").append('<input type="radio" name="children" class="children-checkbox" id="' + child.seq + '" value="' + child.seq + '"><label for="' + child.seq + '">' + child.name + '</label>');
	if ($(".children-checkbox").length < 4) {
		$(".checkBox").append('<a href="javascript:popup_page_open(\'add_child\');" class="addBtn">+ 자녀추가</a>');
	}
}