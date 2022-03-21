$(".bottomBtn").off('click').on('click', function() {
	if ($("#download_app").length === 0) {
		next();
	}
});
function onAddChildSuccess(child) {
	$(".checkBox .addBtn").remove();
	$(".checkBox").append('<input type="radio" name="child" class="children" id="child' + child.seq + '" value="' + child.seq + '"><label for="child' + child.seq + '">' + child.name + '</label>');
	if ($(".children").length < 4) {
		$(".checkBox").append('<a href="javascript:popup_page_open(\'add_child\');" class="addBtn">+ 자녀추가</a>');
	}
}
function next(selected_product_seq) {
	if ($(".children:checked").length == 0) {
		alert("틴포GO와 함께할 자녀를 선택하시거나<br/>새로 추가해 주세요.");
		return;
	}
	var child_seq = $(".children:checked").val();
	location.replace("/experience/free/finish?selected_product_seq=" + selected_product_seq + "&selected_children=" + child_seq);
}