var page = 1;
var type = '';
$("[id^=list-]").off('change').on('change', function() {
	$.ajax({
		url: "/ajax/customer/notice/" + $(this).val() + "/view",
		method: "post"
	});
});
$(".selectBox select").off('change').on('change', function() {
	page = 0;
	type = $(this).val();
	$(".listBox li").remove();
	loadMore();
});
var loadMoreCalling = false;
function loadMore() {
	if (loadMoreCalling) return;
	loadMoreCalling = true;
	$.ajax({
		url: "/ajax/customer/notice",
		method: "get",
		data: {
			page: ++page,
			type: type
		}
	}).done(function($html) {
		var $tmp = $("<div>").html($html);
		var totalCount = parseInt($tmp.find("#totalCount").val());
		var liCount = $tmp.find(".listBox > li").length;
		if (totalCount === 0) {
			$(".listBox").html('<li class="empty">등록된 게시글이 없습니다.</li>');
			$("#totalCount").text("0건");
			$(window).off('scroll');
			loadMoreCalling = false;
			return;
		}
		$("#totalCount").text(totalCount + "건");
		if (liCount === 0) {
			$(window).off('scroll');
			loadMoreCalling = false;
			return;
		}
		bindScrollEvent();
		$(".listBox").append($tmp.find(".listBox").html());
		loadMoreCalling = false;
	}).fail(function(err) {
		console.error(err);
		$(window).off('scroll');
		loadMoreCalling = false;
	});
}
function bindScrollEvent() {
	if (checkLoadAll) return;
	$(window).on('scroll', function() {
		if ($(document).height() - $(this).height() < $(this).scrollTop() + 100) {
			loadMore();
		}
	});
}
bindScrollEvent();