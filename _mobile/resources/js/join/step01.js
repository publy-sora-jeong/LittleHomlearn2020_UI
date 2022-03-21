$(function() {
	function checkAllChecked() {
		return $("#check1:checked, #check2:checked, #checkAd:checked").length === 3;
	}

	function checkAdChecked() {
		return $("#checkEmail:checked, #checkSms:checked").length > 0;
	}
	
	function setJoinBtnActive() {
		if ($("#check1").prop("checked") && $("#check2").prop("checked")) {
			$(".joinBtn").removeClass("disabled");
		} else {
			$(".joinBtn").addClass("disabled");
		}
	}
	
	$("#checkAll").off("change").on("change", function() {
		var checked = $(this).prop("checked");
		$("#check1").prop("checked", checked);
		$("#check2").prop("checked", checked);
		$("#checkAd").prop("checked", checked);
		$("#checkEmail").prop("checked", checked);
		$("#checkSms").prop("checked", checked);
		setJoinBtnActive();
	});
	$("#check1, #check2").off("change").on("change", function() {
		$("#checkAll").prop("checked", checkAllChecked());
		setJoinBtnActive();
	});
	$("#checkAd").off("change").on("change", function() {
		var checked = $(this).prop("checked");
		$("#checkEmail").prop("checked", checked);
		$("#checkSms").prop("checked", checked);
		$("#checkAll").prop("checked", checkAllChecked());
	});
	$("#checkEmail, #checkSms").off("change").on("change", function() {
		$("#checkAd").prop("checked", checkAdChecked());
		$("#checkAll").prop("checked", checkAllChecked());
	});
	
	setJoinBtnActive();
});

function _confirm() {
	if (!$("#check1").prop("checked")) {
		alert("이용약관에 동의해 주세요.");
		return;
	}
	if (!$("#check2").prop("checked")) {
		alert("개인정보수집 및 처리방침에 동의해 주세요.");
		return;
	}
	var checkAd = $("#checkAd").prop("checked");
	var checkEmail = $("#checkEmail").prop("checked");
	var checkSms = $("#checkSms").prop("checked");
	
	$("#agreeAd").val(checkAd);
	$("#agreeEmail").val(checkEmail);
	$("#agreeSms").val(checkSms);
	
	$("#agreeForm").submit();
}
