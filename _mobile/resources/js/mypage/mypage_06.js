var selected_delete_seq = 0;
function open_delete_popup(seq) {
	selected_delete_seq = seq;
	popup_page_open('delete');
}
function add_child() {
	if ($(".child_list li").length >= 4) {
		alert("자녀는 최대 4명까지 등록 가능합니다.");
		return;
	}
	popup_page_open('add_child');
}
function onAddChildSuccess(child) {
	$(".child_list .empty").remove();
	var html = '';
	html += '<li>';
	html += '    <div class="text01"><font color="#41c3d2">[' + child.genderKor2 + ']</font> ' + child.name + '</div>';
	html += '    <div class="text02">' + child.birthday + ' <span>자녀와의 관계 : ' + child.relationKor + '</span></div>';
	if (child.in_subscribe) {
		html += '		<div class="rightBox2" data-boolean="true">틴포GO<p>구독중</p></div>';
	} else if (child.in_experience) {
		html += '		<div class="rightBox2" data-boolean="true">틴포GO<p>체험중</p></div>';
	} else {
		html += '		<div class="rightBox2"><a href="javascript:open_delete_popup(' + child.seq + ');" class="delete"><img src="/resources/img/icon_list_delete.png"></a></div>';
	}
    html += '</li>';
	$(".child_list").append(html);
	$("#count").text($(".child_list li").length + "건");
}