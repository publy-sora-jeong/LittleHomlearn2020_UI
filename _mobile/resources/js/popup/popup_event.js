function popup_event_close(setCookie, seq, hide_date){
	if (setCookie) {
		$.ajax({
			url: "/ajax/popup/" + seq + "/cookie/event",
			method: "post",
			data: {
				day: hide_date
			}
		}).done(function(res) {
			$("#popup_event").hide();
			$("html, body").removeClass("bgFix");
			$("#wraper").removeClass("position");
		}).fail(function(err) {
			alert(err.responseJSON.error || "에러가 발생했습니다.");
		});
	} else {
		$("#popup_event").hide();
	}
}

function onClickPopupBanner(url, target) {
	$.ajax({
		url: "/ajax/banner/" + $("#popup_event").data("banner-seq") + "/click",
		method: "post"
	}).fail(function(err) {
		console.error(err);
	});
	if (target === 'new')
		window.open(url, '_blank');
	else
		location.href = url;
}
