$(function() {
	$.ajax({
		url: "/ajax/event/" + location.href.split('/').pop(),
		method: "get"
	}).done(function(res) {
		$("#share-url").val(res.result.short_url);
	});
});

Kakao.init('9e4f610640b3425f2a497a15896c9b79');

function shareKakao() {
	$.ajax({
		url: "/ajax/event/" + location.href.split('/').pop(),
		method: "get"
	}).done(function(res) {
		Kakao.Link.sendDefault({
			objectType: 'feed',
			content: {
				title: res.result.title,
				description: res.result.description,
				imageUrl: location.href.split('/event/')[0] + res.result.image,
				link: {
					mobileWebUrl: res.result.short_url,
					webUrl: res.result.short_url
				}
			},
			buttons: [
				{
					title: '웹으로 보기',
					link: {
						mobileWebUrl: res.result.short_url,
						webUrl: res.result.short_url
					}
				}
			]
		}).then(function(res) {
			console.log(res);
		});
	});
}

function shareBlog() {
	$.ajax({
		url: "/ajax/event/" + location.href.split('/').pop(),
		method: "get"
	}).done(function(res) {
		var url = encodeURI(encodeURIComponent(res.result.short_url));
	    var title = encodeURI(res.result.title);
		window.open('https://share.naver.com/web/shareView.nhn?url=' + url + '&title=' + title);
	});
}

function shareFacebook() {
	$.ajax({
		url: "/ajax/event/" + location.href.split('/').pop(),
		method: "get"
	}).done(function(res) {
		var url = "https://www.facebook.com/dialog/share?" +
		                  "app_id=1266628346868307" +
		                  "&display=popup" +
		                  "&href=" + encodeURIComponent(res.result.short_url);
		window.open(url, "Share to facebook", "width=500,height=700,location=no,menubar=no,status=no,scrollbars=no,resizable=no,titlebar=no,toolbar=no");
	});
}

var clicked = false;
function shareSms() {
	if (clicked) return;
	clicked = true;
	$.ajax({
		url: "/ajax/event/" + location.href.split('/').pop() + "/share/sms",
		method: "post"
	}).done(function(res) {
		alert("공유가 완료되었습니다.");
		clicked = false;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
		clicked = false;
	});
}

function copyToClipboard() {
	var input = $("#share-url")[0];
	input.select();
	input.setSelectionRange(0, 99999);
	document.execCommand('copy');
	$("#share-url").blur();
	alert("url 복사가 완료되었습니다.");
}
