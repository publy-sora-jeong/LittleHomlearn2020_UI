$("#input-image").off('change').on('change', function() {
	$("#loading_layer").show();
	var formData = new FormData($("#file-form")[0]);
	formData.append("file", this.files[0]);
	$.ajax({
		url: "/ajax/uploadFile",
		method: "post",
		data: formData,
		processData: false,
		contentType: false
	}).done(function(result) {
		$("#input-image").data('path', result.result);
		$("#image_attach").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		if (typeof afterUploadFile !== 'undefined') {
			afterUploadFile(result.result, 'image');
		}
		$("#loading_layer").hide();
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
});
$("#input-video").off('change').on('change', function() {
	$("#loading_layer").show();
	var formData = new FormData($("#file-form")[0]);
	formData.append("file", this.files[0]);
	$.ajax({
		url: "/ajax/uploadFile",
		method: "post",
		data: formData,
		processData: false,
		contentType: false
	}).done(function(result) {
		$("#input-video").data('path', result.result);
		$("#image_attach").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		if (typeof afterUploadFile !== 'undefined') {
			afterUploadFile(result.result, 'video');
		}
		$("#loading_layer").hide();
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
});
$("#input-camera").off('change').on('change', function() {
	$("#loading_layer").show();
	var formData = new FormData($("#file-form")[0]);
	formData.append("file", this.files[0]);
	$.ajax({
		url: "/ajax/uploadFile",
		method: "post",
		data: formData,
		processData: false,
		contentType: false
	}).done(function(result) {
		$("#input-camera").data('path', result.result);
		$("#image_attach").hide();
		$("html, body").removeClass("bgFix");
		$("#wraper").removeClass("position");
		if (typeof afterUploadFile !== 'undefined') {
			afterUploadFile(result.result, 'image');
		}
		$("#loading_layer").hide();
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
});