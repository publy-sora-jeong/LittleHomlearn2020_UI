$(".selectBox select").off('change').on('change', function() {
	$(".listBox a").hide();
	if ($(this).val() === 'ing') {
		$(".listBox a:not(.finish)").show();
		$("#empty-ing").hide();
		$("#empty-end").hide();
		$(".totalBox .left").text($(".listBox a:not(.finish)").length + "건");
		if ($(".listBox a:not(.finish)").length === 0) {
			$("#empty-ing").show();
		}
	}
	if ($(this).val() === 'end') {
		$(".listBox a.finish").show();
		$("#empty-ing").hide();
		$("#empty-end").hide();
		$(".totalBox .left").text($(".listBox a.finish").length + "건");
		if ($(".listBox a.finish").length === 0) {
			$("#empty-end").show();
		}
	}
});
$(".listBox a:not(.finish)").show();
$(".totalBox .left").text($(".listBox a:not(.finish)").length + "건");

function viewLog(seq) {
	$.ajax({
		url: "/ajax/event/" + seq + "/view",
		method: "post"
	});
}