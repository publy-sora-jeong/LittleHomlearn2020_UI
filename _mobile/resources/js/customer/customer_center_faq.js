var page = 1;
var type = '';
var keyword = '';
$(function() {
    $("#customer_center .totalBox .searchBtn").click(function(){
		$("#customer_center .totalBox .inputBox").show();
		$("#customer_center .totalBox .inputBox input").focus();
	});
});

$("input[name=cate]").off('change').on('change', function() {
	page = 0;
	type = this.id === 'all' ? '' : this.id;
	$(".listBox li").remove();
	loadMore();
});
var inputShowing = false;
function search() {
	if (!inputShowing) {
		inputShowing = true;
		return;
	}
	page = 0;
	keyword = $("#keyword").val();
	$(".listBox li").remove();
	loadMore();
}
$("#keyword").off('keyup').on('keyup', function(e) {
	if (e.keyCode === 13) {
		search();
	}
});
$("[id^=list-]").off('change').on('change', function() {
	$.ajax({
		url: "/ajax/customer/faq/" + $(this).val() + "/view",
		method: "post"
	});
});
var loadMoreCalling = false;
function loadMore() {
	if (loadMoreCalling) return;
	loadMoreCalling = true;
	$.ajax({
		url: "/ajax/customer/faq",
		method: "get",
		data: {
			page: ++page,
			type: type,
			keyword: keyword
		}
	}).done(function($html) {
		var $tmp = $("<div>").html($html);
		var totalCount = parseInt($tmp.find("#totalCount").val());
		var liCount = $tmp.find(".listBox > li").length;
		if (totalCount === 0) {
			if ($("#keyword").val() === '')
				$(".listBox").html('<li class="empty">등록된 게시글이 없습니다.</li>');
			else
				$(".listBox").html('<li class="empty">검색된 게시글이 없습니다.</li>');
			$("#totalCount").text("0건");
			unbindScrollEvent();
			loadMoreCalling = false;
			return;
		}
		$("#totalCount").text(totalCount + "건");
		console.log(liCount);
		if (liCount === 0) {
			unbindScrollEvent();
			loadMoreCalling = false;
			return;
		}
		bindScrollEvent();
		$(".listBox").append($tmp.find(".listBox").html());
		loadMoreCalling = false;
	}).fail(function(err) {
		console.error(err);
		unbindScrollEvent();
		loadMoreCalling = false;
	});
}
function bindScrollEvent() {
	if (checkLoadAll) return;
	$(window).off('scroll').on('scroll', function() {
		if ($(document).height() - $(this).height() < $(this).scrollTop() + 100) {
			loadMore();
		}
		if($(window).scrollTop()>300){
			$("#topBtn").fadeIn();
		}else{
			$("#topBtn").fadeOut();
		}
	});
}
function unbindScrollEvent() {
	$(window).off('scroll').on('scroll', function() {
		if($(window).scrollTop()>300){
			$("#topBtn").fadeIn();
		}else{
			$("#topBtn").fadeOut();
		}
	});
}
bindScrollEvent();